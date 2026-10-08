/* Pengecekan status pesanan terjadwal. Hanya bisa dipanggil dengan CRON_SECRET di header Authorization. */

import { refreshOrders } from '../../../lib/orders';
import { cekBearerRahasia } from '../../../lib/auth';

export default async function handler(req, res) {
  const rahasia = process.env.CRON_SECRET || '';
  if (!rahasia) return res.status(500).json({ error: 'CRON_SECRET belum diisi di .env.local.' });
  if (!cekBearerRahasia(req, rahasia)) return res.status(401).json({ error: 'Tidak diizinkan.' });

  try {
    const { diperbarui } = await refreshOrders({ force: false });
    return res.status(200).json({ diperbarui, waktu: new Date().toISOString() });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
