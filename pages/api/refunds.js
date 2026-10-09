/* Refund pesanan yang dibatalkan atau selesai sebagian. Saldo bertambah setelah admin menyetujui. */

import { listRefunds, getRefund, createRefund, ubahStatusRefund, getOrders, getProfile, addSaldo } from '../../lib/store';
import { isAdmin, wajibAdmin } from '../../lib/auth';
import { userDariRequest } from '../../lib/account';
import { tambahNotif } from '../../lib/notif';
import { catatAktivitas } from '../../lib/adminLog';

/* Status provider yang boleh direfund. Status lain tidak. */
const STATUS_REFUND = ['Canceled', 'Partial'];

export default async function handler(req, res) {
  try {
    /* Daftar refund. Admin melihat semua, user hanya miliknya. */
    if (req.method === 'GET') {
      const admin = isAdmin(req) && req.query.as !== 'user';
      const user = admin ? null : await userDariRequest(req);
      if (!admin && !user) return res.status(401).json({ error: 'Perlu login.' });
      return res.status(200).json({ refunds: await listRefunds(admin ? null : user.id) });
    }

    /* User mengajukan refund untuk pesanannya sendiri. Jumlah mengikuti sisa pesanan.
       orderId di sini adalah ID internal pesanan ("SG-..."), BUKAN nomor pesanan dari provider —
       harus sama dengan yang dipakai jalur refund admin (pages/api/orders/refund.js), supaya
       pengecekan "sudah pernah direfund" di kedua jalur saling mendeteksi satu sama lain
       (sebelumnya beda acuan ID, jadi bisa ke-refund dua kali lewat dua jalur berbeda). */
    if (req.method === 'POST') {
      const user = await userDariRequest(req);
      if (!user) return res.status(401).json({ error: 'Login dulu untuk mengajukan refund.' });
      const pesananId = String((req.body && req.body.orderId) || '').trim();

      const pesanan = (await getOrders(user.id)).find((o) => o.id === pesananId);
      if (!pesanan) return res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
      if (!STATUS_REFUND.includes(pesanan.status)) {
        return res.status(400).json({ error: 'Refund hanya untuk pesanan yang dibatalkan atau selesai sebagian.' });
      }
      if (!(pesanan.biaya > 0) || !(pesanan.jumlah > 0)) return res.status(400).json({ error: 'Biaya pesanan tidak tercatat.' });

      /* Pesanan dibatalkan dianggap sisanya penuh kalau provider tidak mengirim angka sisa. */
      const sisa = pesanan.sisa === null || pesanan.sisa === undefined
        ? (pesanan.status === 'Canceled' ? pesanan.jumlah : 0)
        : Number(pesanan.sisa);
      const jumlah = Math.round((pesanan.biaya * Math.min(sisa, pesanan.jumlah)) / pesanan.jumlah);
      if (!(jumlah > 0)) return res.status(400).json({ error: 'Tidak ada sisa jumlah yang bisa direfund.' });

      const aktif = (await listRefunds(user.id)).find((r) => r.pesanan === pesananId && r.status !== 'ditolak');
      if (aktif) return res.status(400).json({ error: 'Refund untuk pesanan ini sudah diajukan.' });

      const profil = await getProfile(user.id);
      const refund = await createRefund({
        userId: user.id,
        username: profil ? profil.username : '',
        pesanan: pesananId,
        jumlah,
        alasan: pesanan.status === 'Canceled' ? 'Pesanan dibatalkan' : 'Pesanan selesai sebagian'
      });
      return res.status(200).json({ refund });
    }

    /* Admin menyetujui atau menolak. Saldo hanya bertambah sekali. */
    if (req.method === 'PATCH') {
      if (!wajibAdmin(req, res)) return;
      const { id, aksi } = req.body || {};
      if (!id || (aksi !== 'setujui' && aksi !== 'tolak')) return res.status(400).json({ error: 'Data tidak lengkap.' });

      const r = await getRefund(String(id));
      if (!r) return res.status(404).json({ error: 'Refund tidak ditemukan.' });
      if (r.status !== 'menunggu') return res.status(400).json({ error: 'Refund ini sudah diproses.' });

      const keStatus = aksi === 'setujui' ? 'disetujui' : 'ditolak';
      const berhasil = await ubahStatusRefund(r.id, 'menunggu', keStatus);
      if (!berhasil) return res.status(400).json({ error: 'Refund ini sudah diproses.' });
      if (keStatus === 'disetujui') await addSaldo(r.userId, r.jumlah);
      await tambahNotif(r.userId, 'order', keStatus === 'disetujui' ? 'Refund disetujui' : 'Refund ditolak', 'Refund pesanan ' + r.pesanan + (keStatus === 'disetujui' ? ' sudah masuk ke saldo.' : ' tidak disetujui.'));
      await catatAktivitas(keStatus === 'disetujui' ? 'refund_setuju' : 'refund_tolak', 'Pesanan ' + r.pesanan + ' (' + (r.username || r.userId) + ') · Rp ' + Number(r.jumlah).toLocaleString('id-ID'));
      return res.status(200).json({ ok: true, status: keStatus });
    }

    return res.status(405).json({ error: 'Metode tidak didukung.' });
  } catch (e) {
    return res.status(502).json({ error: (isAdmin(req) && req.query.as !== 'user') ? String(e.message || e) : 'Gagal memproses refund. Coba lagi.' });
  }
}
