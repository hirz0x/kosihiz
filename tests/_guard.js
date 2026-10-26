/* Guard keamanan tes. SETIAP file tests/*.test.js WAJIB memanggil pastikanAmanUntukTes(env) di
   baris paling awal (sebelum request/panggilan apa pun) — menolak (process.exit(1)) kalau:

   1. TEST_ALLOWED_SUPABASE_URL belum diisi di .env.test.local, atau SUPABASE_URL yang sedang
      dipakai TIDAK ADA di daftar itu. Mencegah tes ini (yang membuat/menghapus akun & baris data
      sintetis) diam-diam dijalankan ke project Supabase PRODUKSI.
   2. PAYMENKU_API_KEY berawalan "sk_live_" (kunci LIVE Paymenku, bukan sandbox — lihat
      AUDIT_REPORT.md temuan WEBHOOK-04). Tes-tes ini dijaga supaya tidak pernah memanggil API
      Paymenku sungguhan, tapi guard ini lapis tambahan: kalau kuncinya live, berhenti total,
      jangan andalkan cuma penjaga di masing-masing tes.

   PENTING — kredensial dibaca dari .env.test.local, BUKAN .env.local:
   .env.local adalah env APLIKASI/produksi (dibaca otomatis oleh `next dev`/`next build`, bisa
   berisi kredensial produksi kapan saja tanpa pemberitahuan khusus ke folder ini). Kalau tes-tes
   di sini ikut membaca .env.local, cukup satu kali .env.local diarahkan ke Supabase produksi
   (misalnya untuk deploy) untuk membuat SEMUA tes di folder ini diam-diam membuat/menghapus data
   sungguhan. Dengan file terpisah (.env.test.local, TIDAK dibaca Next.js sama sekali, dan TIDAK
   ada fallback ke .env.local kalau filenya tidak ada — lihat bacaEnvTes() di bawah), kredensial
   testing harus diisi EKSPLISIT satu kali secara terpisah, dan tidak ikut berubah kalau .env.local
   diubah untuk kebutuhan lain.

   Isi TEST_ALLOWED_SUPABASE_URL di .env.test.local dengan SUPABASE_URL project Supabase KHUSUS
   testing (boleh lebih dari satu, pisahkan koma) sebelum menjalankan npm run test:security / tes
   manapun di folder ini. Buat file .env.test.local (tidak otomatis dibuat) berisi SUPABASE_URL,
   SUPABASE_ANON_KEY, SUPABASE_SECRET_KEY, TEST_ALLOWED_SUPABASE_URL, ADMIN_USERNAME,
   ADMIN_PASSWORD (lihat variabel yang dibaca lib/supabase dkk) untuk mulai. */
const fs = require('fs');
const path = require('path');

function bacaEnvTes() {
  const file = path.join(__dirname, '..', '.env.test.local');
  let txt;
  try {
    txt = fs.readFileSync(file, 'utf8');
  } catch (e) {
    console.error('\nDIHENTIKAN: .env.test.local tidak ditemukan.');
    console.error('Tes di folder tests/ WAJIB membaca kredensial dari .env.test.local, BUKAN');
    console.error('.env.local (env aplikasi/produksi) — supaya tes yang membuat/menghapus data');
    console.error('sintetis tidak pernah ikut diam-diam menyasar Supabase produksi hanya karena');
    console.error('.env.local sedang diarahkan ke sana untuk kebutuhan lain (deploy, dll).');
    console.error('Buat .env.test.local lalu isi kredensial project');
    console.error('Supabase KHUSUS testing (bukan produksi).');
    process.exit(1);
  }
  const env = {};
  for (const line of txt.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

function pastikanAmanUntukTes(env) {
  const daftarAman = String(env.TEST_ALLOWED_SUPABASE_URL || '')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);
  const url = String(env.SUPABASE_URL || '').trim().replace(/\/$/, '');

  if (daftarAman.length === 0) {
    console.error('\nDIHENTIKAN: TEST_ALLOWED_SUPABASE_URL belum diisi di .env.test.local.');
    console.error('Tes ini membuat/menghapus akun & baris data lewat Supabase sungguhan — isi');
    console.error('TEST_ALLOWED_SUPABASE_URL dengan SUPABASE_URL project Supabase KHUSUS testing');
    console.error('(bukan produksi) sebelum menjalankan tes keamanan apa pun.');
    process.exit(1);
  }
  if (!url || !daftarAman.includes(url)) {
    console.error('\nDIHENTIKAN: SUPABASE_URL (' + (url || '(kosong)') + ') TIDAK ADA di TEST_ALLOWED_SUPABASE_URL.');
    console.error('Kemungkinan ini project Supabase PRODUKSI — tes keamanan TIDAK dijalankan ke sana.');
    console.error('Tambahkan URL ini ke TEST_ALLOWED_SUPABASE_URL di .env.test.local HANYA kalau kamu');
    console.error('YAKIN ini project testing, bukan produksi.');
    process.exit(1);
  }
  const paymenkuKey = String(env.PAYMENKU_API_KEY || '');
  if (paymenkuKey.startsWith('sk_live_')) {
    console.error('\nDIHENTIKAN: PAYMENKU_API_KEY di .env.test.local adalah kunci LIVE (sk_live_...).');
    console.error('Tes-tes ini dijaga supaya tidak pernah memanggil API Paymenku sungguhan, tapi');
    console.error('tetap tidak dijalankan selama kunci live terpasang — ganti ke kunci sandbox');
    console.error('(sk_test_...) dulu, atau kosongkan kalau cuma mau jalankan tes non-Paymenku.');
    process.exit(1);
  }
}

module.exports = { bacaEnvTes, pastikanAmanUntukTes };
