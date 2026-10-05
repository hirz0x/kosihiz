/* Afiliasi: data referral, komisi, dan penarikan komisi. User mengajukan, admin menyetujui atau menolak. */

import { getProfile, hitungReferral, listPenarikan, getPenarikan, createPenarikan, ubahStatusPenarikan, potongKomisi, kembalikanKomisi, pindahKomisiKeSaldo, semuaProfil } from '../../lib/store';
import { isAdmin, wajibAdmin } from '../../lib/auth';
import { userDariRequest } from '../../lib/account';
import { KOMISI_PERSEN, MIN_TARIK } from '../../lib/affiliate';

const TUJUAN_MAKS = 200;

export default async function handler(req, res) {
  try {
    /* Data user: komisi, jumlah referral, dan riwayat penarikan. Admin: ringkasan dan semua penarikan. */
    if (req.method === 'GET') {
      if (isAdmin(req) && req.query.as !== 'user') {
        const profil = await semuaProfil();
        return res.status(200).json({
          totalAfiliasi: profil.filter((p) => p.ref_by).length,
          totalKomisi: profil.reduce((s, p) => s + Number(p.komisi_total || 0), 0),
          komisiTersedia: profil.reduce((s, p) => s + Number(p.komisi || 0), 0),
          persen: KOMISI_PERSEN,
          minTarik: MIN_TARIK
        });
      }
      const user = await userDariRequest(req);
      if (!user) return res.status(401).json({ error: 'Perlu login.' });
      const profil = await getProfile(user.id);
      if (!profil) return res.status(400).json({ error: 'Profil belum ada. Muat ulang halaman lalu coba lagi.' });
      const [pendaftaran, penarikan] = await Promise.all([hitungReferral(profil.username), listPenarikan(user.id)]);
      return res.status(200).json({
        username: profil.username,
        komisi: profil.komisi,
        komisiTotal: profil.komisi_total,
        pendaftaran,
        penarikan,
        persen: KOMISI_PERSEN,
        minTarik: MIN_TARIK
      });
    }

    /* User memindahkan komisi ke saldo untuk belanja layanan. */
    if (req.method === 'POST') {
      const user = await userDariRequest(req);
      if (!user) return res.status(401).json({ error: 'Login dulu untuk memindahkan komisi.' });
      const jumlah = Math.round(Number((req.body && req.body.jumlah) || 0));
      if (!Number.isFinite(jumlah) || jumlah < MIN_TARIK) return res.status(400).json({ error: 'Minimal pemindahan Rp ' + MIN_TARIK.toLocaleString('id-ID') + '.' });
      const profil = await getProfile(user.id);
      if (!profil) return res.status(400).json({ error: 'Profil belum ada. Muat ulang halaman lalu coba lagi.' });
      const saldoBaru = await pindahKomisiKeSaldo(user.id, jumlah);
      if (saldoBaru === null || saldoBaru === undefined) return res.status(400).json({ error: 'Komisi kamu tidak cukup untuk pemindahan ini.' });
      return res.status(200).json({ ok: true, saldo: Number(saldoBaru) });
    }

    /* Admin menyetujui (sudah ditransfer manual) atau menolak. Komisi dikembalikan kalau ditolak. */
    if (req.method === 'PATCH') {
      if (!wajibAdmin(req, res)) return;
      const { id, aksi } = req.body || {};
      if (!id || (aksi !== 'setujui' && aksi !== 'tolak')) return res.status(400).json({ error: 'Data tidak lengkap.' });

      const p = await getPenarikan(String(id));
      if (!p) return res.status(404).json({ error: 'Penarikan tidak ditemukan.' });
      if (p.status !== 'menunggu') return res.status(400).json({ error: 'Penarikan ini sudah diproses.' });

      const keStatus = aksi === 'setujui' ? 'disetujui' : 'ditolak';
      const berhasil = await ubahStatusPenarikan(p.id, 'menunggu', keStatus);
      if (!berhasil) return res.status(400).json({ error: 'Penarikan ini sudah diproses.' });
      if (keStatus === 'ditolak') await kembalikanKomisi(p.userId, p.jumlah);
      return res.status(200).json({ ok: true, status: keStatus });
    }

    return res.status(405).json({ error: 'Metode tidak didukung.' });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
