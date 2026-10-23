/* Tes batas markup (0-500%, keputusan admin — lihat AUDIT_REPORT.md DANGER-03): request PATCH
   /api/services dengan markup di luar batas harus ditolak 400 SEBELUM data apa pun disentuh.
   Pakai id layanan palsu (999999999) — validasi batas terjadi sebelum layanan dicari di database,
   jadi aman dites tanpa menyentuh data layanan asli.

   Jalankan: node tests/markup-bounds.test.js   (dev server harus sudah jalan) */
const { request } = require('playwright');
const { bacaEnvLocal, pastikanAmanUntukTes } = require('./_guard');

const BASE = 'http://localhost:3000';
let gagal = 0;
function assert(kondisi, pesan) {
  if (!kondisi) { console.log('GAGAL: ' + pesan); gagal++; } else { console.log('OK: ' + pesan); }
}

(async () => {
  const env = bacaEnvLocal();
  pastikanAmanUntukTes(env);
  const ctx = await request.newContext();
  const login = await ctx.post(BASE + '/api/admin-login', { data: { username: env.ADMIN_USERNAME, password: env.ADMIN_PASSWORD }, headers: { 'Content-Type': 'application/json' } });
  if (!login.ok()) { console.log('Login admin gagal.'); process.exit(1); }

  const kasus = [
    { markup: 600, label: 'markup 600% (di atas batas 500%)' },
    { markup: -5, label: 'markup -5% (di bawah batas 0%)' },
    { markup: 'abc', label: 'markup bukan angka ("abc")' },
    { markup: 501, label: 'markup 501% (1 di atas batas)' }
  ];
  for (const k of kasus) {
    const r = await ctx.patch(BASE + '/api/services', { data: { updates: [{ id: 999999999, markup: k.markup }] }, headers: { 'Content-Type': 'application/json' } });
    assert(r.status() === 400, k.label + ' -> ditolak 400 (dapat: ' + r.status() + ')');
  }

  // Sanity check: markup di dalam batas TIDAK kena validasi batas (boleh lanjut ke pencarian
  // layanan, yang akan gagal normal karena id-nya memang tidak ada -- bukan 400 dari validasi batas).
  const ok = await ctx.patch(BASE + '/api/services', { data: { updates: [{ id: 999999999, markup: 250 }] }, headers: { 'Content-Type': 'application/json' } });
  const body = await ok.json().catch(() => ({}));
  assert(ok.status() !== 400 || !(body.error || '').includes('Markup harus'), 'markup 250% (dalam batas) -> TIDAK ditolak oleh validasi batas markup');

  await ctx.dispose();
  console.log('\n' + (gagal === 0 ? 'SEMUA TES LOLOS' : gagal + ' TES GAGAL'));
  process.exit(gagal === 0 ? 0 : 1);
})();
