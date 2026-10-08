/* Sinkron katalog layanan terjadwal, supaya layanan baru dari provider tidak ketinggalan berhari-hari
   kalau admin lupa klik "Ambil daftar layanan" manual. Hanya bisa dipanggil dengan CRON_SECRET di
   header Authorization — sama persis polanya dengan /api/cron/orders, tapi job terpisah karena ini
   jauh lebih berat (tarik ulang seluruh katalog) sehingga jadwalnya harus jauh lebih jarang
   (disarankan beberapa jam sekali atau sekali sehari, bukan tiap menit). */

import { sinkronKatalog } from '../../../lib/katalog';
import { cekBearerRahasia } from '../../../lib/auth';

export default async function handler(req, res) {
  const rahasia = process.env.CRON_SECRET || '';
  if (!rahasia) return res.status(500).json({ error: 'CRON_SECRET belum diisi di .env.local.' });
  if (!cekBearerRahasia(req, rahasia)) return res.status(401).json({ error: 'Tidak diizinkan.' });

  try {
    const hasil = await sinkronKatalog({});
    return res.status(200).json(hasil);
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
