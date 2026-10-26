/* Pengecekan status deposit Paymenku terjadwal — jalur pemulihan OTOMATIS untuk deposit yang
   masih "menunggu" padahal sudah dibayar, tapi webhook-nya tidak pernah sampai/ditolak (misalnya
   Paymenku me-retry callback dengan timestamp sudah >5 menit, sengaja ditolak oleh
   timestampFresh() di pages/api/paymenku/webhook.js, atau notifikasinya memang tidak pernah
   terkirim sama sekali). Mengecek ULANG ke API Paymenku lewat jalur CAS yang sama dengan webhook
   (lihat lib/paymenku-kredit.js: cekSemuaDepositPending()), jadi aman dijalankan berulang kali
   walau deposit yang sama sudah lebih dulu dikreditkan webhook/tombol "cek" user/tombol admin.
   Hanya bisa dipanggil dengan CRON_SECRET di header Authorization — sama persis polanya dengan
   /api/cron/orders.

   AUTH — FAIL-CLOSED, diverifikasi di tests/cron-deposits-security.test.js:
   1. `rahasia` dibaca dari `process.env.CRON_SECRET || ''` — string kosong kalau env variable itu
      sama sekali tidak diisi (bukan undefined yang bisa lolos pembandingan longgar).
   2. Kalau `rahasia` kosong -> 500, endpoint BERHENTI DI SINI, tidak pernah sampai ke
      `cekBearerRahasia()` ataupun ke `cekSemuaDepositPending()` -- secret kosong di environment =
      TOLAK SEMUA permintaan, apa pun isi header Authorization-nya (termasuk tanpa header sama
      sekali). Status 500 (bukan 401) dipilih supaya jelas ini salah KONFIGURASI (operator belum
      isi CRON_SECRET), bukan permintaan yang disengaja ditolak -- tapi efeknya identik: nol
      deposit diproses.
   3. Kalau `rahasia` terisi, `cekBearerRahasia(req, rahasia)` (lib/auth.js) membandingkan header
      `Authorization` ke `'Bearer ' + rahasia` lewat `sama()` -- HASH SHA-256 kedua sisi dulu, baru
      `crypto.timingSafeEqual()` atas hash itu (bukan atas string aslinya). Hashing dulu membuat
      KEDUA sisi selalu punya panjang yang sama (32 byte) sebelum `timingSafeEqual()`, jadi functionnya
      tidak pernah melempar "length mismatch" ataupun membocorkan panjang secret lewat timing --
      `cekBearerRahasia()` sendiri juga `return false` duluan (tanpa sempat hash apa pun) kalau
      `rahasia` kosong, lapis kedua yang sama dengan (2) di atas. */

import { cekSemuaDepositPending } from '../../../lib/paymenku-kredit';
import { cekBearerRahasia } from '../../../lib/auth';

/* Batas waktu eksekusi function serverless (Vercel) — 60 detik. Dengan BATAS=20 + JEDA_MS=300 di
   bawah, waktu minimum satu run (cuma jeda, belum termasuk latensi tiap panggilan API Paymenku
   sendiri) ada di kisaran ~6 detik — jauh di bawah 60 detik, menyisakan banyak ruang untuk latensi
   Paymenku yang sesungguhnya tanpa kena limit ini. */
export const config = { maxDuration: 60 };

/* Batas per pemanggilan: maks 20 deposit "menunggu" berusia <24 jam dicek per run (diturunkan dari
   50 — lihat cekSemuaDepositPending() di lib/paymenku-kredit.js utk alasan dua batas itu), dengan
   jeda 300ms antar panggilan ke API Paymenku supaya satu run cron tidak menembak API Paymenku
   beruntun tanpa jeda sampai 20x dalam hitungan detik. Scheduler eksternal (lihat AUDIT_REPORT.md
   bagian "Scheduler eksternal") yang menentukan SEBERAPA SERING endpoint ini dipanggil -- nilai di
   sini cuma membatasi BERAPA BANYAK yang diproses dalam SATU pemanggilan, dan dipilih supaya satu
   run tetap selesai jauh di bawah maxDuration di atas. */
const BATAS = 20;
const JEDA_MS = 300;

export default async function handler(req, res) {
  const rahasia = process.env.CRON_SECRET || '';
  if (!rahasia) return res.status(500).json({ error: 'CRON_SECRET belum diisi di .env.local.' });
  if (!cekBearerRahasia(req, rahasia)) return res.status(401).json({ error: 'Tidak diizinkan.' });

  try {
    const hasil = await cekSemuaDepositPending({ uid: null, batas: BATAS, jedaMs: JEDA_MS });
    return res.status(200).json({ ...hasil, waktu: new Date().toISOString() });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
