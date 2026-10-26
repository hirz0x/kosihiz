/* Tombol admin "Cek status" (tab Deposit) — jalur pemulihan manual untuk deposit Paymenku yang
   masih "menunggu" padahal sudah dibayar, tapi webhook-nya tidak pernah sampai/ditolak (misalnya
   Paymenku me-retry callback dengan timestamp sudah >5 menit, sengaja ditolak oleh
   timestampFresh() di pages/api/paymenku/webhook.js — lihat komentar di sana & di
   lib/paymenku-kredit.js: cekSemuaDepositPending()). Beda dari pages/api/deposits/cek-semua.js:
   endpoint itu HANYA mengecek deposit milik user yang sedang login (dipanggil otomatis saat
   dashboard dibuka) — endpoint INI mengecek SEMUA user, dipakai admin kalau ada laporan "sudah
   bayar tapi saldo belum masuk" dari user yang belum/tidak membuka dashboardnya lagi. */

import { wajibAdmin } from '../../../lib/auth';
import { cekSemuaDepositPending } from '../../../lib/paymenku-kredit';
import { catatAktivitas } from '../../../lib/adminLog';

const BATAS = 50;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Metode tidak didukung.' });
  if (!wajibAdmin(req, res)) return;
  try {
    const hasil = await cekSemuaDepositPending({ uid: null, batas: BATAS });
    if (hasil.disetujui > 0) {
      await catatAktivitas('deposit_cek_admin', hasil.disetujui + ' dari ' + hasil.dicek + ' deposit menunggu berhasil dikreditkan (cek manual ke Paymenku).');
    }
    return res.status(200).json(hasil);
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
