/* Pengecekan status deposit Paymenku terjadwal — jalur pemulihan OTOMATIS untuk deposit yang
   masih "menunggu" padahal sudah dibayar, tapi webhook-nya tidak pernah sampai/ditolak (misalnya
   Paymenku me-retry callback dengan timestamp sudah >5 menit, sengaja ditolak oleh
   timestampFresh() di pages/api/paymenku/webhook.js, atau notifikasinya memang tidak pernah
   terkirim sama sekali). Mengecek ULANG ke API Paymenku lewat jalur CAS yang sama dengan webhook
   (lihat lib/paymenku-kredit.js: cekSemuaDepositPending()), jadi aman dijalankan berulang kali
   walau deposit yang sama sudah lebih dulu dikreditkan webhook/tombol "cek" user/tombol admin.
   Hanya bisa dipanggil dengan CRON_SECRET di header Authorization — sama persis polanya dengan
   /api/cron/orders. */

import { cekSemuaDepositPending } from '../../../lib/paymenku-kredit';
import { cekBearerRahasia } from '../../../lib/auth';

const BATAS = 200;

export default async function handler(req, res) {
  const rahasia = process.env.CRON_SECRET || '';
  if (!rahasia) return res.status(500).json({ error: 'CRON_SECRET belum diisi di .env.local.' });
  if (!cekBearerRahasia(req, rahasia)) return res.status(401).json({ error: 'Tidak diizinkan.' });

  try {
    const hasil = await cekSemuaDepositPending({ uid: null, batas: BATAS });
    return res.status(200).json({ ...hasil, waktu: new Date().toISOString() });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
