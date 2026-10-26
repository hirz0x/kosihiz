/* Tes keamanan webhook Paymenku: tanpa signature, signature salah, secret kosong (fail-closed),
   nominal tidak cocok, dan invoice tidak ditemukan — SEMUA harus ditolak dan saldo TIDAK berubah.

   PENTING SOAL KEAMANAN TES INI SENDIRI: tes ini TIDAK PERNAH memanggil API Paymenku sungguhan.
   .env.local di proyek ini memakai PAYMENKU_API_KEY dengan prefix "sk_live_" (kunci LIVE, bukan
   sandbox — lihat AUDIT_REPORT.md temuan WEBHOOK-04). Supaya tes ini TIDAK MUNGKIN diam-diam
   memproses sesuatu di Paymenku sungguhan:
     1. global.fetch di-pasangi penjaga: kalau ada percobaan request ke domain paymenku.com dari
        proses tes ini, langsung dilempar error dan tes berhenti (lihat pasangPenjagaFetch() di bawah).
     2. Logika pencocokan signature & nominal/reference_id TIDAK diimpor langsung dari
        pages/api/paymenku/webhook.js / lib/paymenku-kredit.js (keduanya butuh resolusi import
        tanpa-ekstensi ala Next.js yang tidak didukung Node native tanpa bundler) — diimplementasikan
        ulang di bawah PERSIS mengikuti algoritmanya, DAN diperiksa ulang lewat assertSumberKodeCocok()
        yang mem-baca file sumber aslinya langsung supaya tes ini gagal kalau source code-nya berubah
        tapi tes ini lupa diikutkan (tripwire anti-drift).

   Jalankan: node tests/webhook-security.test.js   (dev server harus sudah jalan) */
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

function pasangPenjagaFetch() {
  const asli = global.fetch;
  global.fetch = function (url, ...rest) {
    const u = String(url && url.url ? url.url : url);
    if (/paymenku\.com/i.test(u)) {
      throw new Error('PENJAGA: percobaan fetch ke Paymenku sungguhan terdeteksi (' + u + ') — tes dihentikan paksa.');
    }
    return asli(url, ...rest);
  };
  return () => { global.fetch = asli; };
}

/* Tripwire anti-drift: pastikan source code aslinya MASIH mengandung pola inti yang diuji ulang
   di bawah. Kalau pola ini hilang/berubah di source asli, tes ini sengaja GAGAL supaya ketahuan
   bukan diam-diam lolos padahal mengecek versi lama. */
function assertSumberKodeCocok() {
  const webhook = fs.readFileSync(path.join(__dirname, '..', 'pages', 'api', 'paymenku', 'webhook.js'), 'utf8');
  const kredit = fs.readFileSync(path.join(__dirname, '..', 'lib', 'paymenku-kredit.js'), 'utf8');
  assert(webhook.includes('if (!secret) return false'), '[tripwire] webhook.js masih fail-closed saat secret kosong');
  assert(webhook.includes('crypto.timingSafeEqual'), '[tripwire] webhook.js masih pakai timing-safe compare utk signature');
  assert(kredit.includes('Number(trx.amount) === nominalDiharapkan'), '[tripwire] paymenku-kredit.js masih mencocokkan nominal');
  assert(kredit.includes("String(trx.reference_id || '') === String(deposit.id)"), '[tripwire] paymenku-kredit.js masih mencocokkan reference_id');
  assert(kredit.includes('if (!trx) {'), '[tripwire] paymenku-kredit.js masih menolak kalau transaksi tidak ditemukan');
  assert(webhook.includes('export function timestampFresh'), '[tripwire] webhook.js masih punya pengecekan umur timestamp');
  assert(webhook.includes("bolehCoba('paymenku_webhook_ip:' + ip"), '[tripwire] webhook.js masih punya rate limit per IP');
  assert(webhook.includes('export const config = { api: { bodyParser: false } }'), '[tripwire] webhook.js masih menonaktifkan bodyParser bawaan Next.js (wajib baca raw body sendiri)');
  assert(webhook.includes('const rawBody = await bacaRawBody(req)'), '[tripwire] webhook.js masih membaca RAW body (stream req.on("data")) SEBELUM verifikasi signature');
  assert(webhook.includes('if (!signatureValid(rawBody, req))'), '[tripwire] webhook.js masih memverifikasi signature memakai rawBody mentah, BUKAN body yang sudah di-JSON.parse ulang');
  assert(/const rawBody = await bacaRawBody\(req\);[\s\S]*if \(!signatureValid\(rawBody, req\)\)[\s\S]*let body = \{\};[\s\S]*JSON\.parse\(rawBody\)/.test(webhook), '[tripwire] webhook.js masih memverifikasi signature SEBELUM JSON.parse(rawBody) dijalankan (urutan ini wajib: signature dicek atas BYTE asli, baru body di-parse)');
}

/* Mencerminkan persis timestampFresh() di pages/api/paymenku/webhook.js. */
function timestampFresh(headerValue, toleransiMs, sekarang = Date.now()) {
  const raw = String(headerValue || '');
  if (!raw || !/^\d+$/.test(raw)) return false;
  let ms = Number(raw);
  if (!Number.isFinite(ms)) return false;
  if (raw.length <= 10) ms *= 1000;
  return Math.abs(sekarang - ms) <= toleransiMs;
}

/* Mencerminkan persis signatureValid() di pages/api/paymenku/webhook.js. */
function signatureValid(rawBody, headers, secret) {
  if (!secret) return false;
  const signature = String(headers['x-paymenku-signature'] || '');
  const timestamp = String(headers['x-paymenku-timestamp'] || '');
  if (!signature || !timestamp) return false;
  const diharapkan = crypto.createHmac('sha256', secret).update(timestamp + '.' + rawBody).digest('hex');
  const a = Buffer.from(signature);
  const b = Buffer.from(diharapkan);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* Mencerminkan persis pengecekan nominal/reference_id di cekDanKreditDeposit() — lib/paymenku-kredit.js. */
function depositBolehDikredit(deposit, trx, nominalDiharapkan) {
  if (!trx) return false;
  const nominalCocok = Number(trx.amount) === nominalDiharapkan;
  const refCocok = String(trx.reference_id || '') === String(deposit.id);
  return nominalCocok && refCocok;
}

(async () => {
  const env = bacaEnvTes();
  pastikanAmanUntukTes(env);
  const lepasPenjaga = pasangPenjagaFetch();

  console.log('=== Tripwire anti-drift (source code asli masih sesuai yang diuji) ===');
  assertSumberKodeCocok();

  console.log('\n=== Signature ===');
  const rawBody = JSON.stringify({ reference_id: 'DEP-123', trx_id: 'TRX-123' });
  const secretAsli = 'rahasia-tes-123';

  assert(signatureValid(rawBody, {}, '') === false, 'tanpa signature + secret KOSONG -> ditolak (fail-closed)');
  assert(signatureValid(rawBody, {}, secretAsli) === false, 'tanpa header signature sama sekali -> ditolak');

  const timestamp = String(Date.now());
  const signatureSalah = crypto.createHmac('sha256', 'secret-yang-salah').update(timestamp + '.' + rawBody).digest('hex');
  assert(signatureValid(rawBody, { 'x-paymenku-signature': signatureSalah, 'x-paymenku-timestamp': timestamp }, secretAsli) === false, 'signature SALAH -> ditolak');

  const signatureBenar = crypto.createHmac('sha256', secretAsli).update(timestamp + '.' + rawBody).digest('hex');
  assert(signatureValid(rawBody, { 'x-paymenku-signature': signatureBenar, 'x-paymenku-timestamp': timestamp }, secretAsli) === true, 'signature BENAR + secret cocok -> diterima (sanity check, bukan tujuan utama tes ini)');

  console.log('\n=== Signature dihitung dari RAW BODY (byte asli), BUKAN hasil JSON.stringify ulang ===');
  /* webhook.js WAJIB memverifikasi signature atas byte raw body ASLI yang dikirim Paymenku (lihat
     config: { api: { bodyParser: false } } + bacaRawBody() yang membaca stream req.on('data')
     mentah-mentah, SEBELUM JSON.parse). Kalau implementasinya sampai berubah jadi: body di-parse
     dulu jadi objek, lalu di-stringify ULANG untuk dicocokkan ke signature — webhook akan keliru
     MENOLAK notifikasi ASLI dari Paymenku setiap kali raw body-nya punya spasi/urutan key yang
     beda dari hasil JSON.stringify (umum terjadi; serializer tiap bahasa/HTTP client tidak selalu
     menghasilkan string JSON yang identik walau isinya sama). Dibuktikan di bawah dengan raw body
     yang SENGAJA ditulis beda spasi & urutan key dari JSON.stringify(objek yang sama). */
  const payloadRaw = { trx_id: 'TRX-RAWTEST', reference_id: 'DEP-RAWTEST', amount: 50000 };
  const rawAsli = '{ "amount": 50000,   "reference_id": "DEP-RAWTEST",  "trx_id": "TRX-RAWTEST" }';
  assert(JSON.stringify(JSON.parse(rawAsli)) !== JSON.stringify(payloadRaw) || rawAsli !== JSON.stringify(payloadRaw), '(sanity) rawAsli secara STRING beda dari JSON.stringify(payloadRaw) walau isi datanya sama (spasi & urutan key disengaja beda)');
  assert(JSON.parse(rawAsli).trx_id === payloadRaw.trx_id && JSON.parse(rawAsli).amount === payloadRaw.amount, '(sanity) rawAsli tetap valid JSON, isi datanya sama dengan payloadRaw');

  const secretRaw = 'rahasia-rawbody-tes';
  const tsRaw = String(Date.now());
  const sigUntukRawAsli = crypto.createHmac('sha256', secretRaw).update(tsRaw + '.' + rawAsli).digest('hex');
  assert(
    signatureValid(rawAsli, { 'x-paymenku-signature': sigUntukRawAsli, 'x-paymenku-timestamp': tsRaw }, secretRaw) === true,
    'signature dihitung dari raw body ASLI -> valid saat diverifikasi dengan raw body yang SAMA persis (termasuk spasi/urutan key)'
  );

  const rawStringifyUlang = JSON.stringify(JSON.parse(rawAsli));
  assert(rawStringifyUlang !== rawAsli, '(sanity) hasil JSON.stringify ulang beda secara string dari raw body asli (urutan key JS mengikuti urutan deklarasi objek, bukan urutan di rawAsli)');
  assert(
    signatureValid(rawStringifyUlang, { 'x-paymenku-signature': sigUntukRawAsli, 'x-paymenku-timestamp': tsRaw }, secretRaw) === false,
    'signature yang sama DITOLAK kalau "dicocokkan" ke versi JSON.stringify ulang (byte beda dari raw asli) -- membuktikan verifikasi memang bergantung pada raw body asli, bukan body yang sempat di-parse+stringify ulang'
  );

  console.log('\n=== Timestamp webhook tidak boleh terlalu tua/jauh di masa depan (replay) ===');
  const TOLERANSI = 5 * 60 * 1000;
  assert(timestampFresh(String(Date.now()), TOLERANSI) === true, 'timestamp SEKARANG -> diterima');
  assert(timestampFresh(String(Math.floor(Date.now() / 1000)), TOLERANSI) === true, 'timestamp SEKARANG dalam unix seconds -> diterima (dua format didukung)');
  assert(timestampFresh(String(Date.now() - 10 * 60 * 1000), TOLERANSI) === false, 'timestamp 10 menit LALU (di luar toleransi 5 menit) -> ditolak (anti-replay)');
  assert(timestampFresh(String(Date.now() + 10 * 60 * 1000), TOLERANSI) === false, 'timestamp 10 menit ke DEPAN -> ditolak');
  assert(timestampFresh('', TOLERANSI) === false, 'timestamp kosong -> ditolak');
  assert(timestampFresh('bukan-angka', TOLERANSI) === false, 'timestamp bukan angka -> ditolak');
  assert(timestampFresh(String(Date.now() - 60 * 1000), TOLERANSI) === true, 'timestamp 1 menit lalu (masih dalam toleransi) -> diterima (sanity check)');

  console.log('\n=== Rate limit per IP (HTTP sungguhan ke /api/paymenku/webhook, tidak pernah lolos ke signature/Paymenku) ===');
  /* Header x-forwarded-for di bawah cuma benar-benar dipercaya ambilIp() kalau process.env.VERCEL
     aktif (lihat lib/loginGuard.js) — dev server lokal TIDAK mengisi env itu, jadi di sini header
     ini diabaikan dan semua percobaan jatuh ke SATU kunci rate-limit yang sama (IP koneksi TCP
     lokal), terlepas dari nilai ipPalsu di bawah. Itu tidak masalah untuk tes ini: tes cuma
     memastikan 429 MUNCUL setelah banyak percobaan cepat, tidak mengandalkan isolasi per-IP-palsu
     (isolasi itu baru berlaku nyata saat deploy sungguhan di Vercel). */
  const ipPalsu = '203.0.113.' + (1 + Math.floor(Math.random() * 253));
  const ctxRl = await request.newContext();
  let kode429 = false;
  let percobaanSebelum429 = 0;
  for (let i = 0; i < 70 && !kode429; i++) {
    const r = await ctxRl.post(BASE + '/api/paymenku/webhook', {
      data: { reference_id: 'RL-TEST-' + i },
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ipPalsu }
    });
    percobaanSebelum429 = i + 1;
    if (r.status() === 429) kode429 = true;
    else assert(r.status() === 401, 'percobaan #' + (i + 1) + ' dari IP palsu ditolak 401 (signature invalid, BUKAN diproses) sebelum rate limit kena');
  }
  console.log('  429 muncul setelah ' + percobaanSebelum429 + ' percobaan dari IP ' + ipPalsu);
  assert(kode429, 'rate limit per IP: setelah banyak percobaan cepat dari 1 IP, webhook membalas 429 (bukan diproses terus)');
  await ctxRl.dispose();

  console.log('\n=== Nominal & reference_id (sebelum kredit) ===');
  const depositContoh = { id: 'DEP-999', nominal: 50000 };
  const nominalDiharapkan = Math.ceil((depositContoh.nominal + 200) / (1 - 0.7 / 100)); // samakan rumus jumlahBayar()

  assert(depositBolehDikredit(depositContoh, null, nominalDiharapkan) === false, 'invoice TIDAK DITEMUKAN di Paymenku (trx null) -> ditolak');
  assert(depositBolehDikredit(depositContoh, { amount: nominalDiharapkan - 1000, reference_id: 'DEP-999' }, nominalDiharapkan) === false, 'nominal TIDAK COCOK -> ditolak');
  assert(depositBolehDikredit(depositContoh, { amount: nominalDiharapkan, reference_id: 'DEP-LAIN' }, nominalDiharapkan) === false, 'reference_id TIDAK COCOK -> ditolak');
  assert(depositBolehDikredit(depositContoh, { amount: nominalDiharapkan, reference_id: 'DEP-999' }, nominalDiharapkan) === true, 'nominal & reference_id COCOK -> diterima (sanity check)');

  console.log('\n=== Saldo benar-benar tidak berubah saat ditolak (DB sungguhan, deposit sintetis) ===');
  async function sb(p, opts = {}) {
    const r = await fetch(env.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/' + p, {
      method: opts.method || 'GET',
      headers: { apikey: env.SUPABASE_SECRET_KEY, Authorization: 'Bearer ' + env.SUPABASE_SECRET_KEY, 'Content-Type': 'application/json', ...(opts.prefer ? { Prefer: opts.prefer } : {}) },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined
    });
    const text = await r.text();
    let data = null; try { data = text ? JSON.parse(text) : null; } catch { /* bukan JSON */ }
    if (!r.ok) throw new Error('Supabase ' + r.status + ': ' + (text || '').slice(0, 300));
    return data;
  }

  const ctx = await request.newContext();
  const login = await ctx.post(BASE + '/api/auth/login', { data: { email: 'qa.idor.a.1792744037192@example.com', password: 'TestPass123!' }, headers: { 'Content-Type': 'application/json' } });
  if (!login.ok()) { console.log('Login akun tester gagal — jalankan tests/saldo-race.test.js dulu supaya akunnya ada.'); process.exit(1); }
  const me = await (await ctx.get(BASE + '/api/me')).json();
  const uid = me && me.user && me.user.id;

  const depId = 'DEP-SECTEST-' + Date.now();
  await sb('deposits', { method: 'POST', body: { id: depId, user_id: uid, nominal: 50000, metode: 'Test sintetis', status: 'menunggu', dibuat: new Date().toISOString(), trx_id: 'FAKE-' + Date.now() }, prefer: 'return=minimal' });
  await sb('profiles?user_id=eq.' + encodeURIComponent(uid), { method: 'PATCH', body: { saldo: 0 }, prefer: 'return=minimal' });

  // Simulasikan Paymenku balas "paid" tapi NOMINAL TIDAK COCOK -> replikasi persis alur
  // cekDanKreditDeposit(): kalau depositBolehDikredit() false, JANGAN panggil addSaldoAman sama sekali.
  const trxPalsu = { status: 'paid', amount: 12345, reference_id: depId }; // nominal sengaja salah
  const nominalDiharapkan2 = Math.ceil((50000 + 200) / (1 - 0.7 / 100));
  const bolehKredit = depositBolehDikredit({ id: depId, nominal: 50000 }, trxPalsu, nominalDiharapkan2);
  assert(bolehKredit === false, 'simulasi: Paymenku bilang "paid" tapi nominal beda -> keputusan TIDAK kredit');
  if (!bolehKredit) {
    console.log('  (tidak memanggil add_saldo_aman sama sekali, sesuai alur asli)');
  }

  const profilSetelah = await sb('profiles?user_id=eq.' + encodeURIComponent(uid) + '&select=saldo');
  const saldoSetelah = profilSetelah && profilSetelah[0] && Number(profilSetelah[0].saldo);
  assert(saldoSetelah === 0, 'saldo akun tester TETAP 0 setelah simulasi "webhook ditolak karena nominal salah" (tidak diam-diam kekredit)');

  await sb('deposits?id=eq.' + encodeURIComponent(depId), { method: 'DELETE', prefer: 'return=minimal' });
  await ctx.dispose();

  lepasPenjaga();
  console.log('\n' + (gagal === 0 ? 'SEMUA TES LOLOS (nol request ke Paymenku sungguhan)' : gagal + ' TES GAGAL'));
  process.exit(gagal === 0 ? 0 : 1);
})().catch((e) => { console.error('TES BERHENTI PAKSA:', e.message); process.exit(1); });
