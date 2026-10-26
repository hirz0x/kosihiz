/* Tes RLS-02 (AUDIT_REPORT.md / supabase/lock-rpc-execute.sql): setiap fungsi RPC uang/admin di
   supabase/schema.sql harus DITOLAK (permission denied) kalau dipanggil pakai SUPABASE_ANON_KEY,
   dan tetap jalan normal kalau dipanggil pakai SUPABASE_SECRET_KEY (service_role) — persis cara
   lib/store.js memanggilnya di aplikasi.

   PENTING: tes bagian "anon ditolak" di bawah ini HANYA LOLOS SEMUA setelah migrasi
   supabase/lock-rpc-execute.sql benar-benar dijalankan di database (lewat Supabase SQL Editor —
   proses ini SENGAJA TIDAK menjalankannya sendiri ke database, sesuai instruksi). Sebelum migrasi
   dijalankan, 5 fungsi yang sudah lama di-revoke di schema.sql (add_saldo_aman, tambah_pesan_tiket,
   rl_tick, rl_gagal, waktu_per_layanan) akan LOLOS duluan, sementara 6 fungsi saldo/komisi lain
   (add_saldo, potong_saldo, add_komisi, potong_komisi, kembalikan_komisi, pindah_komisi_ke_saldo)
   akan GAGAL — itu justru pembuktian langsung temuan RLS-02 sebelum diperbaiki. Jalankan ulang tes
   ini SETELAH migrasi dijalankan untuk memverifikasi 11/11 lolos.

   Semua argumen yang dikirim ke percobaan "anon ditolak" sengaja memakai user_id/key/ref_id palsu
   yang tidak ada di database — kalaupun (secara tak terduga) tidak ditolak, tidak ada baris nyata
   yang berubah. Percobaan "service_role tetap jalan" memakai akun tester sekali pakai yang sudah
   dipakai tes lain di sesi ini, dan baris apa pun yang dibuat (tiket, baris settings rate-limit)
   dibersihkan di akhir.

   Jalankan: node tests/rpc-privileges.test.js   (dev server harus sudah jalan di localhost:3000) */
const { request } = require('playwright');
const { bacaEnvTes, pastikanAmanUntukTes } = require('./_guard');

const BASE = 'http://localhost:3000';
let gagal = 0;
function assert(kondisi, pesan) {
  if (!kondisi) { console.log('GAGAL: ' + pesan); gagal++; } else { console.log('OK: ' + pesan); }
}

async function sb(env, key, p, opts = {}) {
  const r = await fetch(env.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/' + p, {
    method: opts.method || 'GET',
    headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', ...(opts.prefer ? { Prefer: opts.prefer } : {}) },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined
  });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* bukan JSON */ }
  if (!r.ok) {
    const err = new Error('Supabase ' + r.status + ': ' + ((data && data.message) || text.slice(0, 300)));
    err.status = r.status;
    err.body = data;
    throw err;
  }
  return data;
}

/* Fungsi RPC "sensitif" (uang/komisi/admin) di supabase/schema.sql — 11 total, sesuai AUDIT_REPORT.md.
   uid/key/ref palsu supaya aman dipanggil kalaupun tidak ditolak. */
const UID_PALSU = 'rpc-priv-test-uid-tidak-ada';
const FUNGSI_ANON = [
  { nama: 'add_saldo', path: 'rpc/add_saldo', body: { uid: UID_PALSU, amount: 1 } },
  { nama: 'potong_saldo', path: 'rpc/potong_saldo', body: { uid: UID_PALSU, amount: 1 } },
  { nama: 'add_komisi', path: 'rpc/add_komisi', body: { uid: UID_PALSU, amount: 1 } },
  { nama: 'potong_komisi', path: 'rpc/potong_komisi', body: { uid: UID_PALSU, amount: 1 } },
  { nama: 'kembalikan_komisi', path: 'rpc/kembalikan_komisi', body: { uid: UID_PALSU, amount: 1 } },
  { nama: 'pindah_komisi_ke_saldo', path: 'rpc/pindah_komisi_ke_saldo', body: { uid: UID_PALSU, amount: 1 } },
  { nama: 'add_saldo_aman', path: 'rpc/add_saldo_aman', body: { p_uid: UID_PALSU, p_amount: 1, p_ref_id: 'rpc-priv-test-' + Date.now() } },
  { nama: 'tambah_pesan_tiket', path: 'rpc/tambah_pesan_tiket', body: { p_id: 999999999, p_pesan_baru: [], p_status: null, p_user_baca: null } },
  { nama: 'rl_tick', path: 'rpc/rl_tick', body: { p_key: 'rpc-priv-test-' + Date.now(), p_maks: 999, p_jendela_ms: 1000 } },
  { nama: 'rl_gagal', path: 'rpc/rl_gagal', body: { p_key: 'rpc-priv-test-' + Date.now(), p_kelipatan: 999 } },
  { nama: 'waktu_per_layanan', path: 'rpc/waktu_per_layanan', body: {} }
];

(async () => {
  const env = bacaEnvTes();
  pastikanAmanUntukTes(env);
  if (!env.SUPABASE_ANON_KEY) { console.log('SUPABASE_ANON_KEY belum diisi di .env.local — tidak bisa jalankan tes ini.'); process.exit(1); }

  console.log('=== anon HARUS ditolak (permission denied) untuk semua fungsi RPC sensitif ===');
  let lolosAnon = 0;
  for (const f of FUNGSI_ANON) {
    try {
      const hasil = await sb(env, env.SUPABASE_ANON_KEY, f.path, { method: 'POST', body: f.body });
      assert(false, f.nama + ': seharusnya ditolak, tapi lolos (hasil=' + JSON.stringify(hasil) + ') — migrasi lock-rpc-execute.sql belum dijalankan?');
    } catch (e) {
      const ditolak = e.status === 401 || e.status === 403 || /permission denied/i.test(e.message);
      if (ditolak) lolosAnon++;
      assert(ditolak, f.nama + ': anon ditolak dengan "permission denied" (status=' + e.status + ')');
    }
  }
  console.log(lolosAnon + '/' + FUNGSI_ANON.length + ' fungsi sudah menolak anon.');
  if (lolosAnon < FUNGSI_ANON.length) {
    console.log('-> Jalankan supabase/lock-rpc-execute.sql di Supabase SQL Editor, lalu ulangi tes ini.');
  }

  console.log('\n=== service_role (lewat SUPABASE_SECRET_KEY) HARUS tetap jalan normal ===');
  const ctx = await request.newContext();
  const login = await ctx.post(BASE + '/api/auth/login', { data: { email: 'qa.idor.a.1792744037192@example.com', password: 'TestPass123!' }, headers: { 'Content-Type': 'application/json' } });
  if (!login.ok()) { console.log('Login akun tester gagal — jalankan tests/saldo-race.test.js dulu supaya akunnya ada.'); process.exit(1); }
  const me = await (await ctx.get(BASE + '/api/me')).json();
  const uid = me && me.user && me.user.id;
  await ctx.dispose();
  if (!uid) { console.log('Tidak bisa lanjut tanpa user id tester.'); process.exit(1); }

  // saldo: add -> potong, net nol, selalu dikembalikan ke saldo awal.
  const saldoAwal = (await sb(env, env.SUPABASE_SECRET_KEY, 'profiles?user_id=eq.' + encodeURIComponent(uid) + '&select=saldo'))[0].saldo;
  const setelahAdd = await sb(env, env.SUPABASE_SECRET_KEY, 'rpc/add_saldo', { method: 'POST', body: { uid, amount: 1000 } });
  assert(Number(setelahAdd) === Number(saldoAwal) + 1000, 'add_saldo via service_role masih berfungsi normal');
  const setelahPotong = await sb(env, env.SUPABASE_SECRET_KEY, 'rpc/potong_saldo', { method: 'POST', body: { uid, amount: 1000 } });
  assert(Number(setelahPotong) === Number(saldoAwal), 'potong_saldo via service_role masih berfungsi normal (saldo balik ke awal)');

  // komisi: add -> pindah ke saldo -> potong balik dari saldo, net nol di kedua kolom.
  const profilAwal = (await sb(env, env.SUPABASE_SECRET_KEY, 'profiles?user_id=eq.' + encodeURIComponent(uid) + '&select=saldo,komisi'))[0];
  await sb(env, env.SUPABASE_SECRET_KEY, 'rpc/add_komisi', { method: 'POST', body: { uid, amount: 500 } });
  const setelahPotongKomisi = await sb(env, env.SUPABASE_SECRET_KEY, 'rpc/potong_komisi', { method: 'POST', body: { uid, amount: 500 } });
  assert(Number(setelahPotongKomisi) === Number(profilAwal.komisi), 'add_komisi + potong_komisi via service_role masih berfungsi normal (net nol)');
  await sb(env, env.SUPABASE_SECRET_KEY, 'rpc/add_komisi', { method: 'POST', body: { uid, amount: 500 } });
  const setelahPindah = await sb(env, env.SUPABASE_SECRET_KEY, 'rpc/pindah_komisi_ke_saldo', { method: 'POST', body: { uid, amount: 500 } });
  assert(Number(setelahPindah) === Number(profilAwal.saldo) + 500, 'pindah_komisi_ke_saldo via service_role masih berfungsi normal');
  await sb(env, env.SUPABASE_SECRET_KEY, 'rpc/potong_saldo', { method: 'POST', body: { uid, amount: 500 } });
  await sb(env, env.SUPABASE_SECRET_KEY, 'rpc/kembalikan_komisi', { method: 'POST', body: { uid, amount: 0 } }); // sanity call saja (amount 0, tidak mengubah apa pun)
  const profilAkhir = (await sb(env, env.SUPABASE_SECRET_KEY, 'profiles?user_id=eq.' + encodeURIComponent(uid) + '&select=saldo,komisi'))[0];
  assert(Number(profilAkhir.saldo) === Number(profilAwal.saldo) && Number(profilAkhir.komisi) === Number(profilAwal.komisi), 'saldo & komisi tester balik ke nilai semula setelah seluruh round-trip');

  // waktu_per_layanan: read-only, cukup pastikan tidak error dan bentuknya array.
  const waktu = await sb(env, env.SUPABASE_SECRET_KEY, 'rpc/waktu_per_layanan', { method: 'POST' });
  assert(Array.isArray(waktu), 'waktu_per_layanan via service_role masih berfungsi normal');

  // rl_tick / rl_gagal: pakai key throwaway, lalu hapus baris settings-nya supaya tidak menumpuk.
  const klTick = 'rpc-priv-test-tick-' + Date.now();
  const okTick = await sb(env, env.SUPABASE_SECRET_KEY, 'rpc/rl_tick', { method: 'POST', body: { p_key: klTick, p_maks: 5, p_jendela_ms: 60000 } });
  assert(okTick === true, 'rl_tick via service_role masih berfungsi normal');
  await sb(env, env.SUPABASE_SECRET_KEY, 'settings?key=eq.' + encodeURIComponent('coba:' + klTick), { method: 'DELETE', prefer: 'return=minimal' });

  const klGagal = 'rpc-priv-test-gagal-' + Date.now();
  await sb(env, env.SUPABASE_SECRET_KEY, 'rpc/rl_gagal', { method: 'POST', body: { p_key: klGagal, p_kelipatan: 5 } });
  const rowGagal = await sb(env, env.SUPABASE_SECRET_KEY, 'settings?key=eq.' + encodeURIComponent('batas:' + klGagal));
  assert(Array.isArray(rowGagal) && rowGagal.length === 1, 'rl_gagal via service_role masih berfungsi normal');
  await sb(env, env.SUPABASE_SECRET_KEY, 'settings?key=eq.' + encodeURIComponent('batas:' + klGagal), { method: 'DELETE', prefer: 'return=minimal' });

  // tambah_pesan_tiket: butuh tiket sungguhan — dibuat lalu dihapus lagi di akhir.
  const tiket = await sb(env, env.SUPABASE_SECRET_KEY, 'tickets', {
    method: 'POST',
    body: { user_id: uid, username: 'qarpcpriv', kategori: 'lain', pesan: [], user_baca: true },
    prefer: 'return=representation'
  });
  const tiketId = tiket[0].id;
  const tiketSetelah = await sb(env, env.SUPABASE_SECRET_KEY, 'rpc/tambah_pesan_tiket', {
    method: 'POST',
    body: { p_id: tiketId, p_pesan_baru: [{ dari: 'tes', isi: 'halo' }], p_status: null, p_user_baca: null }
  });
  assert(Array.isArray(tiketSetelah) && tiketSetelah[0] && tiketSetelah[0].pesan.length === 1, 'tambah_pesan_tiket via service_role masih berfungsi normal');
  await sb(env, env.SUPABASE_SECRET_KEY, 'tickets?id=eq.' + tiketId, { method: 'DELETE', prefer: 'return=minimal' });

  console.log('\n' + (gagal === 0 ? 'SEMUA TES LOLOS' : gagal + ' TES GAGAL'));
  process.exit(gagal === 0 ? 0 : 1);
})().catch((e) => { console.error('TES BERHENTI PAKSA:', e.message); process.exit(1); });
