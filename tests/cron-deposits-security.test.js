/* Tes keamanan SEMUA endpoint /api/cron/* (deposits, orders, services): masing-masing HARUS
   menolak (fail-closed) tanpa CRON_SECRET yang valid -- baik karena header Authorization
   salah/tidak ada, MAUPUN karena CRON_SECRET sendiri belum diisi di environment server (lapisan
   kedua, tidak boleh diam-diam "lolos" kalau secretnya kosong). Dua bagian:
   1. HTTP sungguhan ke server yang sedang jalan, utk KETIGA endpoint: tanpa header Authorization,
      secret SALAH, secret KOSONG di header, dan header tanpa scheme "Bearer " -- semuanya harus
      ditolak (bukan 200, dan body TIDAK mengandung hasil pengecekan/pembaruan apa pun).
   2. "CRON_SECRET kosong di ENVIRONMENT server" tidak bisa diuji lewat HTTP sungguhan (proses tes
      ini tidak bisa mengosongkan env server yang SEDANG jalan) -- diuji level fungsi lewat
      cerminan persis cekBearerRahasia()/sama() dari lib/auth.js, DIPERIKSA ULANG lewat
      assertSumberKodeCocok() yang mem-baca source code KETIGA route cron + lib/auth.js langsung
      supaya tes ini gagal kalau salah satu source aslinya berubah tapi cerminan di sini lupa
      diikutkan (tripwire anti-drift, pola yang sama dengan tests/webhook-security.test.js).

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

/* Ketiga endpoint cron yang ada di repo ini, semuanya WAJIB pakai pola fail-closed yang sama. */
const ENDPOINT_CRON = [
  { nama: 'deposits', url: '/api/cron/deposits', file: ['pages', 'api', 'cron', 'deposits.js'], bodyKosongKunci: 'dicek' },
  { nama: 'orders', url: '/api/cron/orders', file: ['pages', 'api', 'cron', 'orders.js'], bodyKosongKunci: 'diperbarui' },
  { nama: 'services', url: '/api/cron/services', file: ['pages', 'api', 'cron', 'services.js'], bodyKosongKunci: 'hasil' },
];

/* Tripwire anti-drift: pastikan source code asli masih mengandung pola inti yang diuji ulang di
   atas, supaya tes ini sengaja GAGAL kalau pola itu hilang/berubah di source asli (bukan diam-diam
   lolos padahal mengecek versi lama). */
function assertSumberKodeCocok() {
  const authSrc = fs.readFileSync(path.join(__dirname, '..', 'lib', 'auth.js'), 'utf8');
  assert(authSrc.includes('export function cekBearerRahasia(req, rahasia) {'), '[tripwire] lib/auth.js masih punya cekBearerRahasia()');
  assert(authSrc.includes('if (!rahasia) return false;'), '[tripwire] cekBearerRahasia() masih fail-closed (return false) kalau rahasia kosong, SEBELUM hash/compare apa pun');
  assert(authSrc.includes('crypto.timingSafeEqual'), '[tripwire] sama() masih pakai timing-safe compare');
  assert(authSrc.includes("crypto.createHash('sha256')"), '[tripwire] sama() masih hash dulu sebelum timing-safe compare (menyamakan panjang kedua sisi, cegah leak panjang secret lewat timing)');

  for (const ep of ENDPOINT_CRON) {
    const src = fs.readFileSync(path.join(__dirname, '..', ...ep.file), 'utf8');
    assert(src.includes("const rahasia = process.env.CRON_SECRET || '';"), '[tripwire] /api/cron/' + ep.nama + ' masih membaca CRON_SECRET sebagai string KOSONG (bukan undefined) kalau tidak diisi');
    assert(src.includes('if (!rahasia) return res.status(500)'), '[tripwire] /api/cron/' + ep.nama + ' masih berhenti SEBELUM cekBearerRahasia() dipanggil kalau CRON_SECRET kosong di environment -- tolak semua, apa pun header-nya');
    assert(src.includes('if (!cekBearerRahasia(req, rahasia)) return res.status(401)'), '[tripwire] /api/cron/' + ep.nama + ' masih menolak 401 kalau cekBearerRahasia() gagal');
    assert(src.includes("import { cekBearerRahasia } from '../../../lib/auth';"), '[tripwire] /api/cron/' + ep.nama + ' masih mengimpor cekBearerRahasia() dari lib/auth.js (bukan implementasi sendiri yang bisa diam-diam berbeda)');
  }
}

(async () => {
  const env = bacaEnvTes();
  pastikanAmanUntukTes(env);

  console.log('=== Tripwire anti-drift (source code asli ketiga route cron masih sesuai yang diuji) ===');
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

  const ctx = await request.newContext();
  for (const ep of ENDPOINT_CRON) {
    console.log('\n=== HTTP sungguhan ke ' + ep.url + ' (dev server yang sedang jalan) ===');

    const tanpaHeader = await ctx.get(BASE + ep.url);
    assert(tanpaHeader.status() !== 200, ep.nama + ': TANPA header Authorization -> ditolak (status=' + tanpaHeader.status() + ', bukan 200)');
    const bodyTanpaHeader = await tanpaHeader.json().catch(() => ({}));
    assert(bodyTanpaHeader[ep.bodyKosongKunci] === undefined, ep.nama + ': TANPA header Authorization -> tidak ada apa pun diproses (body tidak mengandung "' + ep.bodyKosongKunci + '")');

    const secretSalah = 'secret-salah-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    const headerSalah = await ctx.get(BASE + ep.url, { headers: { Authorization: 'Bearer ' + secretSalah } });
    assert(headerSalah.status() !== 200, ep.nama + ': secret SALAH -> ditolak (status=' + headerSalah.status() + ', bukan 200)');
    const bodyHeaderSalah = await headerSalah.json().catch(() => ({}));
    assert(bodyHeaderSalah[ep.bodyKosongKunci] === undefined, ep.nama + ': secret SALAH -> tidak ada apa pun diproses (body tidak mengandung "' + ep.bodyKosongKunci + '")');

    const headerKosong = await ctx.get(BASE + ep.url, { headers: { Authorization: 'Bearer ' } });
    assert(headerKosong.status() !== 200, ep.nama + ': secret KOSONG di header Authorization ("Bearer " tanpa nilai) -> ditolak (status=' + headerKosong.status() + ')');

    const salahScheme = await ctx.get(BASE + ep.url, { headers: { Authorization: secretSalah } }); // tanpa prefix "Bearer "
    assert(salahScheme.status() !== 200, ep.nama + ': header Authorization tanpa scheme "Bearer " -> ditolak (status=' + salahScheme.status() + ')');
  }
  await ctx.dispose();

  console.log('\n' + (gagal === 0 ? 'SEMUA TES LOLOS' : gagal + ' TES GAGAL'));
  process.exit(gagal === 0 ? 0 : 1);
})().catch((e) => { console.error('TES BERHENTI PAKSA:', e.message); process.exit(1); });
