/* Statistik admin per hari, dihitung dari pesanan, deposit yang disetujui, dan komisi referral. Zona waktu WIB. */

import { getOrders, listDeposits, semuaProfil } from '../../lib/store';
import { wajibAdmin } from '../../lib/auth';
import { KOMISI_PERSEN } from '../../lib/affiliate';

const MAKS_HARI = 366;
const POLA_TANGGAL = /^\d{4}-\d{2}-\d{2}$/;

/* Tanggal dalam WIB. Kosong kalau waktunya tidak valid. */
function tanggalWib(iso) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '';
  return new Date(t + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

function hariDalamRentang(a, b) {
  const out = [];
  for (let t = Date.parse(a + 'T00:00:00Z'), akhir = Date.parse(b + 'T00:00:00Z'); t <= akhir; t += 86400000) {
    out.push(new Date(t).toISOString().slice(0, 10));
  }
  return out;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Metode tidak didukung.' });
  if (!wajibAdmin(req, res)) return;

  const { from, to } = req.query;
  if (!POLA_TANGGAL.test(from || '') || !POLA_TANGGAL.test(to || '') || from > to) {
    return res.status(400).json({ error: 'Rentang tanggal tidak valid.' });
  }
  const hari = hariDalamRentang(from, to);
  if (hari.length > MAKS_HARI) return res.status(400).json({ error: 'Rentang maksimal 366 hari.' });

  try {
    const [orders, deposits, profil] = await Promise.all([getOrders(), listDeposits(null), semuaProfil()]);
    const peta = new Map(hari.map((d) => [d, { date: d, deposit: 0, revenue: 0, order: 0, komisi: 0 }]));
    const punyaPengajak = new Set(profil.filter((p) => p.ref_by).map((p) => p.user_id));

    for (const o of orders) {
      if (o.status === 'Canceled') continue;
      const h = peta.get(tanggalWib(o.dibuat));
      if (!h) continue;
      h.order += 1;
      h.revenue += Number(o.biaya) || 0;
    }

    /* Deposit dan komisi dihitung dari tanggal disetujui. */
    for (const d of deposits) {
      if (d.status !== 'disetujui') continue;
      const h = peta.get(tanggalWib(d.diputuskan || d.dibuat));
      if (!h) continue;
      h.deposit += Number(d.nominal) || 0;
      if (punyaPengajak.has(d.userId)) h.komisi += Math.floor((Number(d.nominal) * KOMISI_PERSEN) / 100);
    }

    const komisiTersedia = profil.reduce((s, p) => s + Number(p.komisi || 0), 0);
    return res.status(200).json({ hari: [...peta.values()], komisiTersedia });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
