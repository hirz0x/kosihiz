/* Pembatas percobaan login dan pendaftaran. Disimpan di tabel settings, jadi tetap berlaku walau server di-restart.

   Perhitungannya dilakukan ATOMIC di database (rpc rl_tick/rl_gagal, lihat supabase/schema.sql) —
   sebelumnya dihitung di sini lewat baca-lalu-tulis biasa (getSetting lalu setSetting), yang rawan
   race kalau beberapa percobaan datang BERSAMAAN: semuanya sempat baca angka yang sama sebelum ada
   yang menulis balik, jadi limiternya bisa ditembus total. Dibuktikan nyata lewat tes konkurensi:
   15 percobaan pendaftaran bersamaan dari 1 IP (batasnya 5/jam) — 15-15nya lolos, bukan cuma 5. */

import { getSetting, setSetting, rlTick, rlGagal } from './store';

/* IP asal permintaan, dipakai untuk kunci rate-limit (login, registrasi, webhook Paymenku, dll).
   Urutan kepercayaan header, dari PALING dipercaya ke PALING TIDAK dipercaya:

   1. X-Vercel-Forwarded-For — di-set oleh infrastruktur Vercel sendiri (edge network), TIDAK
      BISA dipalsukan klien karena Vercel selalu menimpa header ini sebelum permintaan sampai ke
      fungsi serverless. Dipakai duluan kalau aplikasi jalan di Vercel.
   2. X-Real-IP — umum di-set oleh reverse proxy (nginx, dll) di hosting non-Vercel, biasanya
      berisi satu IP tunggal yang sudah benar (proxy menimpanya, bukan meneruskan dari klien).
   3. X-Forwarded-For (ambil entri PERTAMA) — HANYA dipercaya kalau process.env.VERCEL aktif
      (di-set otomatis oleh Vercel di semua deployment-nya sendiri, tidak bisa dipalsukan klien).
      Di Vercel, header ini ditimpa infrastrukturnya sendiri sama seperti X-Vercel-Forwarded-For,
      jadi aman dipakai sebagai fallback kalau header (1)/(2) entah kenapa kosong. DI LUAR Vercel
      (self-host, dev server lokal, dll) header ini TIDAK dipercaya sama sekali — klien bisa
      mengirimnya sendiri dan "meniru" IP mana pun kalau aplikasi tidak di belakang proxy yang
      menimpanya — jadi dilewati total di luar Vercel, langsung fallback ke (4).
   4. req.socket.remoteAddress — IP koneksi TCP langsung (benar kalau tidak ada proxy sama sekali,
      misalnya dev server lokal; salah/jadi IP si proxy kalau sebenarnya ada proxy di depannya
      tapi tidak ada satu pun header di atas yang terisi/dipercaya).

   Kalau semuanya kosong (jarang terjadi, tapi bisa di lingkungan non-standar): mengembalikan
   'tidak-diketahui' — SEMUA permintaan dengan IP tidak terbaca berbagi SATU kunci rate-limit yang
   sama. Ini tidak membuka celah "lewat rate limit sepenuhnya" (tetap dibatasi, cuma dibagi rata
   ke satu ember bersama), dan rate limit sendiri cuma lapis pertahanan tambahan — signature HMAC,
   verifikasi ulang status/nominal/reference_id ke API Paymenku (lihat lib/paymenku-kredit.js)
   tetap jadi penghalang utama terlepas dari apakah IP pemanggil berhasil diidentifikasi. */
export function ambilIp(req) {
  const vercel = String(req.headers['x-vercel-forwarded-for'] || '').split(',')[0].trim();
  if (vercel) return vercel;
  const realIp = String(req.headers['x-real-ip'] || '').trim();
  if (realIp) return realIp;
  if (process.env.VERCEL) {
    const teruskan = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    if (teruskan) return teruskan;
  }
  return (req.socket && req.socket.remoteAddress) || 'tidak-diketahui';
}

/* Sisa detik kunci. 0 berarti boleh mencoba. Cuma baca, tidak ada risiko race di sini. */
export async function sisaKunci(kunci) {
  const s = await getSetting('batas:' + kunci, null);
  if (!s || !s.sampai) return 0;
  const sisa = Math.ceil((Number(s.sampai) - Date.now()) / 1000);
  return sisa > 0 ? sisa : 0;
}

/* Catat satu kegagalan. Setiap `kelipatan` kegagalan, kunci 15 menit, lalu durasinya digandakan (maks 24 jam). */
export async function catatGagal(kunci, kelipatan = 5) {
  await rlGagal(kunci, kelipatan);
}

export async function resetKunci(kunci) {
  await setSetting('batas:' + kunci, { gagal: 0, sampai: 0 });
}

/* Batas jumlah percobaan dalam satu jendela waktu, misalnya pendaftaran per IP. true = masih boleh. */
export async function bolehCoba(kunci, maks, jendelaMs) {
  return rlTick(kunci, maks, jendelaMs);
}
