/* Tes race condition saldo: memanggil RPC atomik potong_saldo dan add_saldo_aman DUA KALI
   BERSAMAAN (Promise.all, bukan berurutan), langsung ke Supabase lewat kredensial yang sama
   dipakai lib/store.js — tanpa lewat provider SMM atau Paymenku sungguhan (kedua itu dihindari
   sengaja karena PAYMENKU_API_KEY di .env.local ternyata kunci LIVE, bukan sandbox — lihat
   AUDIT_REPORT.md). Dipakai pada akun tester sekali pakai yang didaftarkan lewat /api/auth/register,
   BUKAN akun asli.

   Client Supabase di sini sengaja ditulis ulang minimal (bukan import lib/store.js) karena
   lib/store.js pakai sintaks ESM murni yang tidak bisa di-require Node biasa tanpa pipeline
   Next.js — lihat catatan di AUDIT_REPORT.md bagian "Keterbatasan pengujian otomatis".

   Jalankan: node tests/saldo-race.test.js   (dev server harus sudah jalan di localhost:3000) */
const { request } = require('playwright');
const { bacaEnvLocal, pastikanAmanUntukTes } = require('./_guard');

const BASE = 'http://localhost:3000';

async function sb(env, p, opts = {}) {
  const r = await fetch(env.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/' + p, {
    method: opts.method || 'GET',
    headers: { apikey: env.SUPABASE_SECRET_KEY, Authorization: 'Bearer ' + env.SUPABASE_SECRET_KEY, 'Content-Type': 'application/json', ...(opts.prefer ? { Prefer: opts.prefer } : {}) },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined
  });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* bukan JSON */ }
  if (!r.ok) throw new Error('Supabase ' + r.status + ': ' + (text || '').slice(0, 300));
  return data;
}

let gagal = 0;
function assert(kondisi, pesan) {
  if (!kondisi) { console.log('GAGAL: ' + pesan); gagal++; } else { console.log('OK: ' + pesan); }
}

(async () => {
  const env = bacaEnvLocal();
  pastikanAmanUntukTes(env);

  // Akun tester: coba daftar baru, kalau kena rate-limit pendaftaran (sudah banyak dibuat sesi ini),
  // pakai akun tester yang sudah ada dari pengujian sebelumnya di sesi yang sama.
  const email = process.env.QA_EMAIL || 'qa.race.' + Date.now() + '@example.com';
  const password = process.env.QA_PASSWORD || 'TestPass123!';
  const ctx = await request.newContext();
  if (!process.env.QA_EMAIL) {
    const reg = await ctx.post(BASE + '/api/auth/register', {
      data: { email, password, confirm: password, username: 'qarace' + (Date.now() % 100000) },
      headers: { 'Content-Type': 'application/json' }
    });
    if (!reg.ok()) {
      console.log('Daftar baru kena rate-limit (' + (await reg.text()) + '), coba login ke akun tester lama...');
      const login = await ctx.post(BASE + '/api/auth/login', { data: { email: 'qa.idor.a.1792744037192@example.com', password: 'TestPass123!' }, headers: { 'Content-Type': 'application/json' } });
      if (!login.ok()) { console.log('Login akun tester lama juga gagal:', await login.text()); process.exit(1); }
    }
  } else {
    const login = await ctx.post(BASE + '/api/auth/login', { data: { email, password }, headers: { 'Content-Type': 'application/json' } });
    if (!login.ok()) { console.log('Login gagal:', await login.text()); process.exit(1); }
  }
  // cari user_id dari /api/me pakai sesi yang sama
  const me = await (await ctx.get(BASE + '/api/me')).json();
  const uid = me && me.user && me.user.id;
  console.log('Akun tester:', email, '| uid:', uid ? '(ada)' : '(tidak ditemukan!)');
  if (!uid) { console.log('Tidak bisa lanjut tanpa user id.'); process.exit(1); }

  // ========== TES 1: potong_saldo — dua pemotongan BERSAMAAN, saldo cuma cukup utk SATU ==========
  // Set saldo awal 30.000 langsung lewat tabel profiles (bukan via deposit asli, supaya tidak
  // perlu Paymenku sama sekali).
  await sb(env, 'profiles?user_id=eq.' + encodeURIComponent(uid), { method: 'PATCH', body: { saldo: 30000 }, prefer: 'return=minimal' });

  const [hasilA, hasilB] = await Promise.all([
    sb(env, 'rpc/potong_saldo', { method: 'POST', body: { uid, amount: 20000 } }).catch((e) => ({ error: e.message })),
    sb(env, 'rpc/potong_saldo', { method: 'POST', body: { uid, amount: 20000 } }).catch((e) => ({ error: e.message })),
  ]);
  const berhasilA = hasilA !== null && hasilA !== undefined && !(hasilA && hasilA.error);
  const berhasilB = hasilB !== null && hasilB !== undefined && !(hasilB && hasilB.error);
  console.log('  potong_saldo A ->', JSON.stringify(hasilA), '| B ->', JSON.stringify(hasilB));
  assert((berhasilA && !berhasilB) || (!berhasilA && berhasilB), 'potong_saldo konkuren: TEPAT SATU dari dua percobaan 20.000 (saldo 30.000) yang berhasil');

  const profilSetelah = await sb(env, 'profiles?user_id=eq.' + encodeURIComponent(uid) + '&select=saldo');
  const saldoAkhir = profilSetelah && profilSetelah[0] && Number(profilSetelah[0].saldo);
  console.log('  saldo akhir:', saldoAkhir);
  assert(saldoAkhir === 10000, 'saldo akhir harus persis 10.000 (30.000 - SATU kali 20.000), bukan 30.000 (gagal total) atau -10.000 (dua-duanya lolos)');

  // ========== TES 2: add_saldo_aman — idempotensi ref_id, dipanggil 2x BERSAMAAN ref_id SAMA ==========
  const refId = 'test-idempoten-' + Date.now();
  const [kreditA, kreditB] = await Promise.all([
    sb(env, 'rpc/add_saldo_aman', { method: 'POST', body: { p_uid: uid, p_amount: 50000, p_ref_id: refId } }).catch((e) => ({ error: e.message })),
    sb(env, 'rpc/add_saldo_aman', { method: 'POST', body: { p_uid: uid, p_amount: 50000, p_ref_id: refId } }).catch((e) => ({ error: e.message })),
  ]);
  console.log('  add_saldo_aman A ->', JSON.stringify(kreditA), '| B ->', JSON.stringify(kreditB));
  const profilSetelah2 = await sb(env, 'profiles?user_id=eq.' + encodeURIComponent(uid) + '&select=saldo');
  const saldoAkhir2 = profilSetelah2 && profilSetelah2[0] && Number(profilSetelah2[0].saldo);
  console.log('  saldo akhir setelah 2x add_saldo_aman ref_id SAMA:', saldoAkhir2);
  assert(saldoAkhir2 === 10000 + 50000, 'saldo cuma nambah SATU kali 50.000 (jadi 60.000), walau RPC-nya dipanggil 2x bersamaan dengan ref_id sama — bukan 110.000');

  // Bersihkan: kembalikan saldo akun tester ke 0 (bukan dihapus, cuma netral)
  await sb(env, 'profiles?user_id=eq.' + encodeURIComponent(uid), { method: 'PATCH', body: { saldo: 0 }, prefer: 'return=minimal' });

  await ctx.dispose();
  console.log('\n' + (gagal === 0 ? 'SEMUA TES LOLOS' : gagal + ' TES GAGAL'));
  process.exit(gagal === 0 ? 0 : 1);
})();
