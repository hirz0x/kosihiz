/* Deposit saldo dengan transfer manual.
   User membuat permintaan, lalu admin menyetujui atau menolak setelah cek mutasi. */

import { userDariRequest } from '../../lib/account';
import { wajibAdmin, isAdmin } from '../../lib/auth';
import { beriKomisi } from '../../lib/affiliate';
import { buatTransaksi, ambilStatus, jumlahBayar } from '../../lib/paymenku';
import { hitungKredit } from '../../lib/bonus';
import { tambahNotif } from '../../lib/notif';
import { listDeposits, createDeposit, getDeposit, ubahStatusDeposit, addSaldo, getProfile, semuaProfil } from '../../lib/store';
import { catatAktivitas } from '../../lib/adminLog';

const MIN_DEPOSIT = 10000;

const LABEL = { menunggu: 'Menunggu', disetujui: 'Berhasil', ditolak: 'Gagal' };

export default async function handler(req, res) {
  /* Admin melihat semua. User melihat deposit miliknya. */
  if (req.method === 'GET') {
    const admin = isAdmin(req) && req.query.as !== 'user';
    const user = admin ? null : await userDariRequest(req);
    if (!admin && !user) return res.status(401).json({ error: 'Perlu login.' });
    try {
      const list = await listDeposits(admin ? null : user.id);
      let nama = {};
      if (admin) (await semuaProfil()).forEach((p) => { nama[p.user_id] = p.username; });
      return res.status(200).json({
        deposits: list.map((d) => ({ ...d, label: LABEL[d.status] || d.status, username: nama[d.userId] || '' })),
      });
    } catch (e) {
      return res.status(502).json({ error: admin ? String(e.message || e) : 'Gagal memuat riwayat deposit. Coba lagi.' });
    }
  }

  /* Admin menambah deposit manual langsung disetujui — dipakai utk transfer yang dikonfirmasi
     di luar aplikasi (WhatsApp/bank/tunai), tidak lewat Paymenku. Saldo langsung bertambah.
     Pakai userId (bukan username ketik bebas) supaya tidak salah pilih orang karena typo. */
  if (req.method === 'POST' && req.body && req.body.manual) {
    if (!wajibAdmin(req, res)) return;
    const userId = String(req.body.userId || '').trim();
    const nominal = Math.round(Number(req.body.nominal));
    const catatan = String(req.body.catatan || '').trim();
    if (!userId) return res.status(400).json({ error: 'Pilih user dulu dari daftar.' });
    if (!Number.isFinite(nominal) || nominal <= 0) return res.status(400).json({ error: 'Nominal harus angka lebih dari 0.' });
    try {
      const profil = await getProfile(userId);
      if (!profil) return res.status(404).json({ error: 'User tidak ditemukan.' });
      const id = 'DEP-' + Date.now();
      const kredit = await hitungKredit(userId, nominal);
      const deposit = {
        id,
        userId,
        nominal,
        metode: 'Manual (Admin)' + (catatan ? ' — ' + catatan : ''),
        status: 'disetujui',
        dibuat: new Date().toISOString(),
        trxId: null,
        bayarUrl: null
      };
      await createDeposit(deposit);
      await addSaldo(userId, kredit.total);
      await beriKomisi(userId, nominal);
      await tambahNotif(userId, 'deposit', 'Deposit berhasil', 'Saldo bertambah Rp ' + kredit.total.toLocaleString('id-ID') + ' (deposit manual oleh admin).');
      await catatAktivitas('deposit_manual', profil.username + ' · Rp ' + nominal.toLocaleString('id-ID') + (catatan ? ' · ' + catatan : ''));
      return res.status(200).json({ ok: true, deposit: { ...deposit, label: LABEL.disetujui } });
    } catch (e) {
      return res.status(502).json({ error: String(e.message || e) });
    }
  }

  /* User membuat permintaan deposit. */
  if (req.method === 'POST') {
    const user = await userDariRequest(req);
    if (!user) return res.status(401).json({ error: 'Login dulu untuk isi saldo.' });
    const nominal = Math.round(Number(req.body && req.body.nominal));
    if (!Number.isFinite(nominal) || nominal < MIN_DEPOSIT) {
      return res.status(400).json({ error: 'Nominal minimal Rp ' + MIN_DEPOSIT.toLocaleString('id-ID') + '.' });
    }
    try {
      const profil = await getProfile(user.id);
      if (!profil) return res.status(400).json({ error: 'Profil belum ada. Muat ulang halaman lalu coba lagi.' });
      const id = 'DEP-' + Date.now();
      const trx = await buatTransaksi({ amount: jumlahBayar(nominal), referenceId: id, customerName: profil.username, customerEmail: user.email });
      const info = trx && trx.data && typeof trx.data === 'object' ? trx.data : trx || {};
      if (!info.trx_id) throw new Error('Paymenku tidak mengembalikan trx_id.');
      const deposit = {
        id,
        userId: user.id,
        nominal,
        metode: 'Paymenku',
        status: 'menunggu',
        dibuat: new Date().toISOString(),
        trxId: String(info.trx_id),
        bayarUrl: info.pay_url || null
      };
      await createDeposit(deposit);
      return res.status(200).json({ deposit: { ...deposit, label: LABEL.menunggu }, bayarUrl: deposit.bayarUrl });
    } catch (e) {
      /* Bisa gagal di panggilan Paymenku (pembayaran pihak ketiga) — teks errornya tidak diteruskan
         mentah-mentah ke pelanggan. */
      console.error('Gagal membuat deposit:', e && e.message ? e.message : e);
      return res.status(502).json({ error: 'Gagal membuat permintaan deposit. Coba lagi.' });
    }
  }

  /* Admin menyetujui atau menolak. Saldo hanya bertambah sekali, walaupun tombol ditekan dua kali. */
  if (req.method === 'PATCH') {
    if (!wajibAdmin(req, res)) return;
    const { id, aksi } = req.body || {};
    if (!id || (aksi !== 'setujui' && aksi !== 'tolak')) return res.status(400).json({ error: 'Data tidak lengkap.' });
    try {
      const d = await getDeposit(String(id));
      if (!d) return res.status(404).json({ error: 'Deposit tidak ditemukan.' });
      if (d.status !== 'menunggu') return res.status(400).json({ error: 'Deposit ini sudah diproses.' });

      const keStatus = aksi === 'setujui' ? 'disetujui' : 'ditolak';
      /* Bonus dihitung sebelum status berubah, supaya deposit ini tidak ikut dihitung sebagai "sudah disetujui". */
      const kredit = keStatus === 'disetujui' ? await hitungKredit(d.userId, d.nominal) : null;
      const berhasil = await ubahStatusDeposit(d.id, 'menunggu', keStatus);
      if (!berhasil) return res.status(400).json({ error: 'Deposit ini sudah diproses.' });
      if (kredit) {
        await addSaldo(d.userId, kredit.total);
        await beriKomisi(d.userId, d.nominal);
        await tambahNotif(d.userId, 'deposit', 'Deposit berhasil', 'Saldo bertambah Rp ' + kredit.total.toLocaleString('id-ID') + '.');
      }
      await catatAktivitas(keStatus === 'disetujui' ? 'deposit_setuju' : 'deposit_tolak', 'Deposit ' + d.id + ' · Rp ' + Number(d.nominal).toLocaleString('id-ID'));
      return res.status(200).json({ ok: true, status: keStatus });
    } catch (e) {
      return res.status(502).json({ error: String(e.message || e) });
    }
  }

  return res.status(405).json({ error: 'Metode tidak didukung.' });
}
