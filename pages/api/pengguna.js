/* Daftar pengguna untuk admin: saldo, pesanan, total belanja, dan pengajak. Hanya admin. */

import { semuaProfil, getOrdersRingkas } from '../../lib/store';
import { wajibAdmin } from '../../lib/auth';
import { tanggalWib } from '../../lib/waktu';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Metode tidak didukung.' });
  if (!wajibAdmin(req, res)) return;
  try {
    const [profil, orders] = await Promise.all([semuaProfil(), getOrdersRingkas()]);

    const per = new Map();
    for (const o of orders) {
      if (!o.user_id) continue;
      const x = per.get(o.user_id) || { pesanan: 0, belanja: 0 };
      x.pesanan += 1;
      if (o.status !== 'Canceled') x.belanja += Number(o.biaya) || 0;
      per.set(o.user_id, x);
    }

    const pengguna = profil
      .map((p) => {
        const x = per.get(p.user_id) || { pesanan: 0, belanja: 0 };
        return {
          id: p.user_id,
          username: p.username,
          saldo: Number(p.saldo) || 0,
          pesanan: x.pesanan,
          belanja: x.belanja,
          daftar: tanggalWib(p.dibuat),
          pengajak: p.ref_by || ''
        };
      })
      .sort((a, b) => (a.daftar < b.daftar ? 1 : a.daftar > b.daftar ? -1 : 0));

    return res.status(200).json({ pengguna });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
