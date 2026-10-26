/* Tes idempotensi kredit deposit (dipakai webhook Paymenku DAN tombol "cek" manual/otomatis,
   lihat lib/paymenku-kredit.js): kalau fungsi yang sama dipanggil 2x BERSAMAAN untuk deposit yang
   sama, saldo cuma boleh bertambah SATU kali.

   SENGAJA tidak memanggil endpoint webhook sungguhan (/api/paymenku/webhook) atau API Paymenku
   asli — PAYMENKU_API_KEY di .env.local adalah kunci LIVE (sk_live_), bukan sandbox (lihat
   AUDIT_REPORT.md). Sebagai gantinya, dibuat SATU baris deposit sintetis langsung di database
   (status 'menunggu', trxId palsu yang tidak mungkin cocok transaksi Paymenku asli manapun),
   lalu mekanisme inti yang menjamin "cuma kredit sekali" — ubahStatusDeposit() compare-and-swap
   dari 'menunggu' ke 'disetujui' — diuji langsung dengan dipanggil 2x bersamaan. ini PERSIS
   baris kode yang sama dipanggil cekDanKreditDeposit() di webhook asli.

   Jalankan: node tests/webhook-idempotency.test.js   (dev server harus sudah jalan) */
const { request } = require('playwright');
const { bacaEnvTes, pastikanAmanUntukTes } = require('./_guard');

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
  const env = bacaEnvTes();
  pastikanAmanUntukTes(env);

  const ctx = await request.newContext();
  const login = await ctx.post(BASE + '/api/auth/login', { data: { email: 'qa.idor.a.1792744037192@example.com', password: 'TestPass123!' }, headers: { 'Content-Type': 'application/json' } });
  if (!login.ok()) { console.log('Login akun tester gagal — jalankan tests/saldo-race.test.js dulu supaya akunnya ada.'); process.exit(1); }
  const me = await (await ctx.get(BASE + '/api/me')).json();
  const uid = me && me.user && me.user.id;
  if (!uid) { console.log('Tidak dapat user id.'); process.exit(1); }

  // Deposit sintetis, status "menunggu" — trxId jelas palsu, tidak akan pernah dicek ke Paymenku
  // sungguhan di tes ini (kita panggil langsung RPC-nya, bukan lewat lib/paymenku-kredit.js).
  const depId = 'DEP-TEST-' + Date.now();
  await sb(env, 'deposits', {
    method: 'POST',
    body: { id: depId, user_id: uid, nominal: 75000, metode: 'Test sintetis (bukan Paymenku asli)', status: 'menunggu', dibuat: new Date().toISOString(), trx_id: 'FAKE-TRX-' + Date.now() },
    prefer: 'return=minimal'
  });
  console.log('Deposit sintetis dibuat:', depId, '(status: menunggu)');

  // Saldo awal bersih
  await sb(env, 'profiles?user_id=eq.' + encodeURIComponent(uid), { method: 'PATCH', body: { saldo: 0 }, prefer: 'return=minimal' });

  // Ini PERSIS mekanisme cekDanKreditDeposit() pakai: ubahStatusDeposit CAS lalu addSaldoAman
  // kalau menang. Dipanggil 2x BERSAMAAN, meniru webhook dobel/race antara webhook & cek manual.
  async function cobaKredit() {
    const rows = await sb(env, 'deposits?id=eq.' + encodeURIComponent(depId) + '&status=eq.menunggu', {
      method: 'PATCH', body: { status: 'disetujui', diputuskan: new Date().toISOString() }, prefer: 'return=representation'
    });
    const menang = Array.isArray(rows) && rows.length > 0;
    if (menang) {
      await sb(env, 'rpc/add_saldo_aman', { method: 'POST', body: { p_uid: uid, p_amount: 75000, p_ref_id: 'deposit ' + depId } });
    }
    return menang;
  }

  const [menangA, menangB] = await Promise.all([cobaKredit(), cobaKredit()]);
  console.log('  percobaan A menang CAS?', menangA, '| percobaan B menang CAS?', menangB);
  assert((menangA && !menangB) || (!menangA && menangB), 'CAS status menunggu->disetujui: TEPAT SATU dari dua percobaan bersamaan yang menang');

  const profil = await sb(env, 'profiles?user_id=eq.' + encodeURIComponent(uid) + '&select=saldo');
  const saldoAkhir = profil && profil[0] && Number(profil[0].saldo);
  console.log('  saldo akhir:', saldoAkhir);
  assert(saldoAkhir === 75000, 'saldo nambah TEPAT SATU kali 75.000, walau dua "webhook" datang bersamaan untuk deposit yang sama');

  // Bersihkan: hapus baris deposit sintetis + netralkan saldo, supaya tidak nyampah di tab Deposit admin
  await sb(env, 'deposits?id=eq.' + encodeURIComponent(depId), { method: 'DELETE', prefer: 'return=minimal' });
  await sb(env, 'profiles?user_id=eq.' + encodeURIComponent(uid), { method: 'PATCH', body: { saldo: 0 }, prefer: 'return=minimal' });
  console.log('Deposit sintetis dibersihkan.');

  await ctx.dispose();
  console.log('\n' + (gagal === 0 ? 'SEMUA TES LOLOS' : gagal + ' TES GAGAL'));
  process.exit(gagal === 0 ? 0 : 1);
})();
