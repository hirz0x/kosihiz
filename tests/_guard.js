/* Guard keamanan tes. SETIAP file tests/*.test.js WAJIB memanggil pastikanAmanUntukTes(env) di
   baris paling awal (sebelum request/panggilan apa pun) — menolak (process.exit(1)) kalau:

   1. TEST_ALLOWED_SUPABASE_URL belum diisi di .env.local, atau SUPABASE_URL yang sedang dipakai
      TIDAK ADA di daftar itu. Mencegah tes ini (yang membuat/menghapus akun & baris data sintetis)
      diam-diam dijalankan ke project Supabase PRODUKSI kalau suatu saat .env.local proyek ini
      dipasangi kredensial produksi.
   2. PAYMENKU_API_KEY berawalan "sk_live_" (kunci LIVE Paymenku, bukan sandbox — lihat
      AUDIT_REPORT.md temuan WEBHOOK-04, kunci yang terpasang di .env.local proyek ini SAAT AUDIT
      memang live). Tes-tes ini dijaga supaya tidak pernah memanggil API Paymenku sungguhan, tapi
      guard ini lapis tambahan: kalau kuncinya live, berhenti total, jangan andalkan cuma penjaga
      di masing-masing tes.

   Isi TEST_ALLOWED_SUPABASE_URL di .env.local dengan SUPABASE_URL project Supabase KHUSUS testing
   (boleh lebih dari satu, pisahkan koma) sebelum menjalankan npm run test:security / tes manapun
   di folder ini. */
const fs = require('fs');
const path = require('path');

function bacaEnvLocal() {
  const txt = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
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
    console.error('\nDIHENTIKAN: TEST_ALLOWED_SUPABASE_URL belum diisi di .env.local.');
    console.error('Tes ini membuat/menghapus akun & baris data lewat Supabase sungguhan — isi');
    console.error('TEST_ALLOWED_SUPABASE_URL dengan SUPABASE_URL project Supabase KHUSUS testing');
    console.error('(bukan produksi) sebelum menjalankan tes keamanan apa pun. Lihat .env.example.');
    process.exit(1);
  }
  if (!url || !daftarAman.includes(url)) {
    console.error('\nDIHENTIKAN: SUPABASE_URL (' + (url || '(kosong)') + ') TIDAK ADA di TEST_ALLOWED_SUPABASE_URL.');
    console.error('Kemungkinan ini project Supabase PRODUKSI — tes keamanan TIDAK dijalankan ke sana.');
    console.error('Tambahkan URL ini ke TEST_ALLOWED_SUPABASE_URL di .env.local HANYA kalau kamu');
    console.error('YAKIN ini project testing, bukan produksi.');
    process.exit(1);
  }
  const paymenkuKey = String(env.PAYMENKU_API_KEY || '');
  if (paymenkuKey.startsWith('sk_live_')) {
    console.error('\nDIHENTIKAN: PAYMENKU_API_KEY di .env.local adalah kunci LIVE (sk_live_...).');
    console.error('Tes-tes ini dijaga supaya tidak pernah memanggil API Paymenku sungguhan, tapi');
    console.error('tetap tidak dijalankan selama kunci live terpasang — ganti ke kunci sandbox');
    console.error('(sk_test_...) dulu, atau kosongkan kalau cuma mau jalankan tes non-Paymenku.');
    process.exit(1);
  }
}

module.exports = { bacaEnvLocal, pastikanAmanUntukTes };
