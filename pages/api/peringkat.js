/* Peringkat user berdasarkan total belanja. Admin mengatur batas minimal tiap level. */

import { getOrders, semuaProfil, setSetting } from '../../lib/store';
import { isAdmin, wajibAdmin } from '../../lib/auth';
import { userDariRequest } from '../../lib/account';
import { ambilPeringkat, indexPeringkat, PERINGKAT_DEFAULT } from '../../lib/peringkat';

export default async function handler(req, res) {
  try {
    /* Admin melihat batas dan jumlah user per level. User melihat level dan total belanjanya sendiri. */
    if (req.method === 'GET') {
      const admin = isAdmin(req) && req.query.as !== 'user';
      const user = admin ? null : await userDariRequest(req);
      if (!admin && !user) return res.status(401).json({ error: 'Perlu login.' });

      const tiers = await ambilPeringkat();
      const totalPerUser = new Map();
      for (const o of await getOrders()) {
        if (o.status === 'Canceled' || !(o.biaya > 0) || !o.userId) continue;
        totalPerUser.set(o.userId, (totalPerUser.get(o.userId) || 0) + o.biaya);
      }

      if (admin) {
        const jumlah = tiers.map(() => 0);
        for (const p of await semuaProfil()) {
          jumlah[indexPeringkat(totalPerUser.get(p.user_id) || 0, tiers)] += 1;
        }
        return res.status(200).json({ tiers: tiers.map((t, i) => ({ ...t, pengguna: jumlah[i] })) });
      }

      const total = totalPerUser.get(user.id) || 0;
      return res.status(200).json({ tiers, total, index: indexPeringkat(total, tiers) });
    }

    /* Admin mengubah batas minimal. Batas harus naik dan level pertama tetap 0. */
    if (req.method === 'PATCH') {
      if (!wajibAdmin(req, res)) return;
      const mins = req.body && req.body.mins;
      if (!Array.isArray(mins) || mins.length !== PERINGKAT_DEFAULT.length) {
        return res.status(400).json({ error: 'Jumlah batas peringkat tidak sesuai.' });
      }
      const angka = mins.map((m) => Math.round(Number(m)));
      if (angka.some((m) => !Number.isFinite(m) || m < 0)) return res.status(400).json({ error: 'Batas harus angka 0 atau lebih.' });
      if (angka[0] !== 0) return res.status(400).json({ error: 'Batas level pertama harus 0.' });
      for (let i = 1; i < angka.length; i++) {
        if (angka[i] <= angka[i - 1]) return res.status(400).json({ error: 'Batas tiap level harus lebih besar dari level sebelumnya.' });
      }
      await setSetting('peringkat', PERINGKAT_DEFAULT.map((d, i) => ({ nama: d.nama, min: angka[i] })));
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Metode tidak didukung.' });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
