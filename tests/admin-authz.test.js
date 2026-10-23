/* Tes otorisasi admin: semua endpoint admin (mutasi/sensitif) harus menolak (401/403)
   request TANPA login dan dari user biasa (bukan cuma disembunyikan di client).
   Jalankan: node tests/admin-authz.test.js   (dev server harus sudah jalan di localhost:3000) */
const { request } = require('playwright');
const { bacaEnvLocal, pastikanAmanUntukTes } = require('./_guard');
pastikanAmanUntukTes(bacaEnvLocal());

const BASE = 'http://localhost:3000';

const ADMIN_ENDPOINTS = [
  { method: 'GET', url: '/api/pengguna' },
  { method: 'GET', url: '/api/admin-log' },
  { method: 'GET', url: '/api/statistik' },
  { method: 'POST', url: '/api/provider', body: { action: 'balance', provider: 'smmsoc' } },
  { method: 'POST', url: '/api/orders/refund', body: { id: 'SG-FAKE' } },
  { method: 'PATCH', url: '/api/services', body: { id: 1 } },
  { method: 'POST', url: '/api/services', body: { nama: 'x' } },
  { method: 'PATCH', url: '/api/deposits', body: { id: 'DEP-FAKE', aksi: 'setujui' } },
  { method: 'POST', url: '/api/deposits', body: { manual: true, userId: 'x', nominal: 1000000 } },
  { method: 'POST', url: '/api/undian', body: { aksi: 'cabut' } },
  { method: 'PATCH', url: '/api/peringkat', body: { nama: 'Starter', min: 0 } },
  { method: 'POST', url: '/api/artikel/upload-gambar' },
  { method: 'DELETE', url: '/api/riwayat', body: { id: 1 } },
  { method: 'PATCH', url: '/api/refunds', body: { id: 'x' } },
  { method: 'PATCH', url: '/api/support', body: {} },
  { method: 'PATCH', url: '/api/artikel', body: { id: 1 } }
];

let gagal = 0;

async function uji(label, ctx) {
  console.log('\n=== ' + label + ' ===');
  for (const ep of ADMIN_ENDPOINTS) {
    const r = await ctx.fetch(BASE + ep.url, { method: ep.method, data: ep.body, headers: { 'Content-Type': 'application/json' } });
    const ditolak = r.status() === 401 || r.status() === 403;
    if (!ditolak) gagal++;
    console.log((ditolak ? 'OK  ' : 'GAGAL') + ' ' + ep.method + ' ' + ep.url + ' -> ' + r.status());
  }
}

(async () => {
  const ctxAnon = await request.newContext();
  await uji('TANPA LOGIN', ctxAnon);
  await ctxAnon.dispose();

  const ctxUser = await request.newContext();
  const email = 'qa.admin.authz.' + Date.now() + '@example.com';
  const reg = await ctxUser.post(BASE + '/api/auth/register', {
    data: { email, password: 'TestPass123!', confirm: 'TestPass123!', username: 'qaauthz' + (Date.now() % 100000) },
    headers: { 'Content-Type': 'application/json' }
  });
  if (!reg.ok()) {
    console.log('\nDaftar akun tester kena rate-limit, login ke akun tester lama...');
    await ctxUser.post(BASE + '/api/auth/login', { data: { email: 'qa.idor.a.1792744037192@example.com', password: 'TestPass123!' }, headers: { 'Content-Type': 'application/json' } });
  }
  await uji('USER BIASA (akun tester)', ctxUser);
  await ctxUser.dispose();

  console.log('\n' + (gagal === 0 ? 'SEMUA TES LOLOS (' + ADMIN_ENDPOINTS.length * 2 + ' percobaan)' : gagal + ' PERCOBAAN TIDAK DITOLAK SEMESTINYA'));
  process.exit(gagal === 0 ? 0 : 1);
})();
