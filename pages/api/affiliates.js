/* Afiliasi: data referral & komisi. Komisi dipindahkan user ke saldo sendiri (tidak ada pencairan
   tunai/transfer bank — kalau nanti itu dibutuhkan, baru dibangun lagi). */

import { getProfile, hitungReferral, pindahKomisiKeSaldo, semuaProfil } from '../../lib/store';
import { isAdmin } from '../../lib/auth';
import { userDariRequest } from '../../lib/account';
import { KOMISI_PERSEN, MIN_TARIK } from '../../lib/affiliate';

export default async function handler(req, res) {
  try {
    /* Data user: komisi & jumlah referral. Admin: ringkasan semua afiliasi. */
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
      const pendaftaran = await hitungReferral(profil.username);
      return res.status(200).json({
        username: profil.username,
        komisi: profil.komisi,
        komisiTotal: profil.komisi_total,
        pendaftaran,
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

    return res.status(405).json({ error: 'Metode tidak didukung.' });
  } catch (e) {
    return res.status(502).json({ error: (isAdmin(req) && req.query.as !== 'user') ? String(e.message || e) : 'Gagal memproses afiliasi. Coba lagi.' });
  }
}
