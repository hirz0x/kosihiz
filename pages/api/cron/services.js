/* Sinkron katalog layanan terjadwal, supaya layanan baru dari provider tidak ketinggalan berhari-hari
   kalau admin lupa klik "Ambil daftar layanan" manual. Hanya bisa dipanggil dengan CRON_SECRET di
   header Authorization — sama persis polanya dengan /api/cron/orders, tapi job terpisah karena ini
   jauh lebih berat (tarik ulang seluruh katalog) sehingga jadwalnya harus jauh lebih jarang
   (disarankan beberapa jam sekali atau sekali sehari, bukan tiap menit).

   Tanpa ?provider=, sinkron SEMUA provider sekaligus dalam satu request — dengan katalog masing-
   masing provider sudah 5000+ layanan, menyinkronkan keduanya berurutan dalam satu panggilan bisa
   kelamaan dan kena limit waktu eksekusi server atau timeout di sisi penjadwal cron. ?provider=smmsoc
   atau ?provider=likeo membatasi ke satu provider saja per panggilan, supaya tiap cronjob bisa
   dijadwalkan terpisah dan masing-masing lebih ringan/cepat. */

import { sinkronKatalog } from '../../../lib/katalog';
import { PROVIDERS } from '../../../lib/provider';
import { cekBearerRahasia } from '../../../lib/auth';

export default async function handler(req, res) {
  const rahasia = process.env.CRON_SECRET || '';
  if (!rahasia) return res.status(500).json({ error: 'CRON_SECRET belum diisi di .env.local.' });
  if (!cekBearerRahasia(req, rahasia)) return res.status(401).json({ error: 'Tidak diizinkan.' });

  const hanya = String(req.query.provider || '').trim();
  if (hanya && !Object.prototype.hasOwnProperty.call(PROVIDERS, hanya)) {
    return res.status(400).json({ error: 'Provider tidak dikenal: ' + hanya });
  }

  /* Sinkron provider yang diminta (?provider=...), atau semua yang API key-nya sudah diisi kalau tidak diminta spesifik. */
  const providers = (hanya ? [hanya] : Object.keys(PROVIDERS)).filter((p) => PROVIDERS[p].key());
  const hasil = {};
  const errors = {};
  for (const provider of providers) {
    try {
      hasil[provider] = await sinkronKatalog({ provider });
    } catch (e) {
      errors[provider] = String(e.message || e);
    }
  }
  const status = Object.keys(errors).length && !Object.keys(hasil).length ? 502 : 200;
  return res.status(status).json({ hasil, ...(Object.keys(errors).length ? { errors } : {}) });
}
