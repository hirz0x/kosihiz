/* Tes keamanan /api/cron/deposits: endpoint ini HARUS menolak (fail-closed) tanpa CRON_SECRET
   yang valid -- baik karena header Authorization salah/tidak ada, MAUPUN karena CRON_SECRET
   sendiri belum diisi di environment server (lapisan kedua, tidak boleh diam-diam "lolos" kalau
   secretnya kosong). Dua bagian:
   1. HTTP sungguhan ke server yang sedang jalan: tanpa header Authorization, secret SALAH, secret
      KOSONG di header, dan header tanpa scheme "Bearer " -- semuanya harus ditolak (bukan 200, dan
      body TIDAK mengandung hasil pengecekan deposit apa pun / "dicek").
   2. "CRON_SECRET kosong di ENVIRONMENT server" tidak bisa diuji lewat HTTP sungguhan (proses tes
      ini tidak bisa mengosongkan env server yang SEDANG jalan) -- diuji level fungsi lewat
      cerminan persis cekBearerRahasia()/sama() dari lib/auth.js, DIPERIKSA ULANG lewat
      assertSumberKodeCocok() yang mem-baca source code aslinya langsung (lib/auth.js DAN
      pages/api/cron/deposits.js) supaya tes ini gagal kalau source aslinya berubah tapi cerminan
      di sini lupa diikutkan (tripwire anti-drift, pola yang sama dengan
      tests/webhook-security.test.js).

   Jalankan: node tests/cron-deposits-security.test.js   (dev server harus sudah jalan) */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { request } = require('playwright');
const { bacaEnvTes, pastikanAmanUntukTes } = require('./_guard');

const BASE = 'http://localhost:3000';
let gagal = 0;
function assert(kondisi, pesan) {
  if (!kondisi) { console.log('GAGAL: ' + pesan); gagal++; } else { console.log('OK: ' + pesan); }
}

/* Mencerminkan persis sama() di lib/auth.js. */
function sama(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return ha.length === hb.length && crypto.timingSafeEqual(ha, hb);
}
/* Mencerminkan persis cekBearerRahasia() di lib/auth.js. */
function cekBearerRahasia(headerAuthorization, rahasia) {
  if (!rahasia) return false;
  const header = String(headerAuthorization || '');
  return sama(header, 'Bearer ' + rahasia);
}

/* Tripwire anti-drift: pastikan source code asli masih mengandung pola inti yang diuji ulang di
   atas, supaya tes ini sengaja GAGAL kalau pola itu hilang/berubah di source asli (bukan diam-diam
   lolos padahal mengecek versi lama). */
function assertSumberKodeCocok() {
  const authSrc = fs.readFileSync(path.join(__dirname, '..', 'lib', 'auth.js'), 'utf8');
  const cronSrc = fs.readFileSync(path.join(__dirname, '..', 'pages', 'api', 'cron', 'deposits.js'), 'utf8');
  assert(authSrc.includes('export function cekBearerRahasia(req, rahasia) {'), '[tripwire] lib/auth.js masih punya cekBearerRahasia()');
  assert(authSrc.includes('if (!rahasia) return false;'), '[tripwire] cekBearerRahasia() masih fail-closed (return false) kalau rahasia kosong, SEBELUM hash/compare apa pun');
  assert(authSrc.includes('crypto.timingSafeEqual'), '[tripwire] sama() masih pakai timing-safe compare');
  assert(authSrc.includes("crypto.createHash('sha256')"), '[tripwire] sama() masih hash dulu sebelum timing-safe compare (menyamakan panjang kedua sisi, cegah leak panjang secret lewat timing)');
  assert(cronSrc.includes("const rahasia = process.env.CRON_SECRET || '';"), '[tripwire] /api/cron/deposits masih membaca CRON_SECRET sebagai string KOSONG (bukan undefined) kalau tidak diisi');
  assert(cronSrc.includes('if (!rahasia) return res.status(500)'), '[tripwire] /api/cron/deposits masih berhenti SEBELUM cekBearerRahasia() dipanggil kalau CRON_SECRET kosong di environment -- tolak semua, apa pun header-nya');
  assert(cronSrc.includes('if (!cekBearerRahasia(req, rahasia)) return res.status(401)'), '[tripwire] /api/cron/deposits masih menolak 401 kalau cekBearerRahasia() gagal');
}

(async () => {
  const env = bacaEnvTes();
  pastikanAmanUntukTes(env);

  console.log('=== Tripwire anti-drift (source code asli masih sesuai yang diuji) ===');
  assertSumberKodeCocok();

  console.log('\n=== Fail-closed level fungsi: CRON_SECRET KOSONG di environment -> tolak SEMUA, apa pun header-nya ===');
  assert(cekBearerRahasia('Bearer apa-saja', '') === false, 'rahasia kosong + header ADA & "benar bentuknya" -> ditolak');
  assert(cekBearerRahasia('', '') === false, 'rahasia kosong + header KOSONG -> ditolak');
  assert(cekBearerRahasia(undefined, '') === false, 'rahasia kosong + header tidak ada sama sekali (undefined) -> ditolak');

  console.log('\n=== Sanity compare (logika cekBearerRahasia sendiri tidak salah arah) ===');
  const rahasiaContoh = 'contoh-cron-secret-' + Date.now();
  assert(cekBearerRahasia('Bearer ' + rahasiaContoh, rahasiaContoh) === true, 'rahasia TERISI + header cocok persis -> diterima');
  assert(cekBearerRahasia('Bearer ' + rahasiaContoh + 'X', rahasiaContoh) === false, 'rahasia TERISI + header beda 1 karakter -> ditolak');
  assert(cekBearerRahasia('bearer ' + rahasiaContoh, rahasiaContoh) === false, 'rahasia TERISI + scheme huruf kecil ("bearer" bukan "Bearer") -> ditolak (case-sensitive, sesuai header asli)');

  console.log('\n=== HTTP sungguhan ke /api/cron/deposits (dev server yang sedang jalan) ===');
  const ctx = await request.newContext();

  const tanpaHeader = await ctx.get(BASE + '/api/cron/deposits');
  assert(tanpaHeader.status() !== 200, 'TANPA header Authorization -> ditolak (status=' + tanpaHeader.status() + ', bukan 200)');
  const bodyTanpaHeader = await tanpaHeader.json().catch(() => ({}));
  assert(bodyTanpaHeader.dicek === undefined, 'TANPA header Authorization -> tidak ada satu pun deposit diproses (body tidak mengandung "dicek")');

  const secretSalah = 'secret-salah-' + Date.now() + '-' + Math.random().toString(36).slice(2);
  const headerSalah = await ctx.get(BASE + '/api/cron/deposits', { headers: { Authorization: 'Bearer ' + secretSalah } });
  assert(headerSalah.status() !== 200, 'secret SALAH -> ditolak (status=' + headerSalah.status() + ', bukan 200)');
  const bodyHeaderSalah = await headerSalah.json().catch(() => ({}));
  assert(bodyHeaderSalah.dicek === undefined, 'secret SALAH -> tidak ada satu pun deposit diproses (body tidak mengandung "dicek")');

  const headerKosong = await ctx.get(BASE + '/api/cron/deposits', { headers: { Authorization: 'Bearer ' } });
  assert(headerKosong.status() !== 200, 'secret KOSONG di header Authorization ("Bearer " tanpa nilai) -> ditolak (status=' + headerKosong.status() + ')');

  const salahScheme = await ctx.get(BASE + '/api/cron/deposits', { headers: { Authorization: secretSalah } }); // tanpa prefix "Bearer "
  assert(salahScheme.status() !== 200, 'header Authorization tanpa scheme "Bearer " -> ditolak (status=' + salahScheme.status() + ')');

  await ctx.dispose();
  console.log('\n' + (gagal === 0 ? 'SEMUA TES LOLOS' : gagal + ' TES GAGAL'));
  process.exit(gagal === 0 ? 0 : 1);
})().catch((e) => { console.error('TES BERHENTI PAKSA:', e.message); process.exit(1); });
