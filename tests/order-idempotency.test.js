/* Tes idempotency key pembuatan pesanan (supabase/order-idempotency.sql, lib/store.js:
   klaimIdempotensiPesanan(), lib/pesanan.js: buatPesanan()).

   KETERBATASAN PENTING (baca dulu sebelum menambah tes baru di file ini): tes di bawah menguji
   PRIMITIF ATOMIC di database langsung (fungsi klaim_idempotensi_pesanan lewat REST Supabase),
   BUKAN lewat HTTP POST /api/orders sungguhan. Alasannya sama persis dengan kenapa
   tests/webhook-idempotency.test.js tidak memanggil webhook Paymenku asli: buatPesanan()
   (lib/pesanan.js) memanggil callProvider() (lib/provider.js) ke API SMM provider SUNGGUHAN
   (smmsoc.com/likeo.net) — TIDAK ADA mode sandbox untuk provider ini. Memanggil /api/orders
   sungguhan dalam tes otomatis akan membuat pesanan NYATA & memotong saldo provider NYATA.
   Jadi: skenario "request identik", "request bersamaan", "payload berbeda key sama", "retry
   setelah timeout", dan "order baru yang valid" SEMUANYA diuji di level primitif
   klaim_idempotensi_pesanan() + tabel order_idempotency — ini PERSIS mekanisme yang dipakai
   buatPesanan() sebelum menyentuh saldo/provider sama sekali (lihat lib/pesanan.js), jadi
   membuktikan primitif ini benar sudah membuktikan lib/pesanan.js tidak akan memproses dobel.
   Verifikasi ujung-ke-ujung (lewat HTTP /api/orders sungguhan sampai provider & saldo asli)
   TIDAK bisa diotomatisasi dengan aman — lihat "Verifikasi manual" di AUDIT_REPORT.md untuk
   langkah manual satu-kali yang perlu dilakukan sebelum deploy.

   PRASYARAT: migrasi supabase/order-idempotency.sql HARUS sudah dijalankan di project Supabase
   yang dipakai .env.test.local (lihat tests/_guard.js) sebelum tes ini bisa lolos — kalau belum,
   SEMUA panggilan rpc/klaim_idempotensi_pesanan di bawah akan gagal dengan "function does not
   exist" (bukan tes ini yang salah, migrasinya memang belum dijalankan).

   Jalankan: node tests/order-idempotency.test.js   (dev server tidak perlu jalan — tes ini
   bicara langsung ke Supabase lewat service key, tidak lewat endpoint Next.js manapun, karena
   yang diuji murni primitif database-nya). */
const crypto = require('crypto');
const { bacaEnvTes, pastikanAmanUntukTes } = require('./_guard');

let gagal = 0;
function assert(kondisi, pesan) {
  if (!kondisi) { console.log('GAGAL: ' + pesan); gagal++; } else { console.log('OK: ' + pesan); }
}

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

/* Cermin PERSIS hashPermintaan() di lib/pesanan.js -- kalau algoritma di sana berubah, perbarui
   juga di sini (tripwire manual, bukan impor langsung -- tes di folder ini sengaja tidak pernah
   mengimpor lib/*.js, lihat tests/webhook-idempotency.test.js untuk alasan yang sama). */
function hashPermintaan({ service, link, jumlah, extra }) {
  const kanonik = JSON.stringify([String(service), String(link), Number(jumlah), extra == null ? null : String(extra)]);
  return crypto.createHash('sha256').update(kanonik).digest('hex');
}

async function klaim(env, uid, key, hash, staleMs) {
  const rows = await sb(env, 'rpc/klaim_idempotensi_pesanan', {
    method: 'POST',
    body: { p_user_id: uid, p_key: key, p_hash: hash, p_stale_ms: staleMs }
  });
  return rows && rows[0];
}

(async () => {
  const env = bacaEnvTes();
  pastikanAmanUntukTes(env);

  const uid = 'test-idem-' + Date.now();
  const hashA = hashPermintaan({ service: '101', link: 'https://instagram.com/tes', jumlah: 1000, extra: null });
  const hashB = hashPermintaan({ service: '101', link: 'https://instagram.com/BEDA', jumlah: 1000, extra: null });
  assert(hashA !== hashB, 'hashPermintaan: payload yang berbeda (link beda) menghasilkan hash berbeda');
  const hashA2 = hashPermintaan({ service: '101', link: 'https://instagram.com/tes', jumlah: 1000, extra: null });
  assert(hashA === hashA2, 'hashPermintaan: payload yang SAMA selalu menghasilkan hash yang SAMA (deterministik)');

  const orderId = 'SG-TEST-IDEM-' + Date.now();
  const kunciDibuat = [];

  try {
    // Baris orders sintetis -- dipakai sebagai target order_id saat mensimulasikan status "done"
    // di bawah (kolom order_id di order_idempotency punya FK ke orders(id), jadi harus menunjuk
    // ke baris yang benar-benar ada).
    await sb(env, 'orders', {
      method: 'POST',
      body: [{ id: orderId, user_id: uid, link: 'https://instagram.com/tes', jumlah: 1000, biaya: 5000, status: 'Pending', dibuat: new Date().toISOString() }],
      prefer: 'return=minimal'
    });

    // --- 1. Request pertama (klaim baru) ---
    const key1 = 'key-baru-' + Date.now();
    kunciDibuat.push(key1);
    const r1 = await klaim(env, uid, key1, hashA, 60000);
    assert(r1.hasil === 'claimed', 'Permintaan pertama dengan key baru: hasil = claimed (boleh lanjut proses)');

    // --- 2. Request identik (replay) setelah permintaan pertama SELESAI (status done) ---
    // Simulasikan "sudah selesai" seperti selesaikanIdempotensiPesanan() akan lakukan.
    await sb(env, 'order_idempotency?user_id=eq.' + encodeURIComponent(uid) + '&idempotency_key=eq.' + encodeURIComponent(key1), {
      method: 'PATCH', body: { status: 'done', order_id: orderId, diupdate: new Date().toISOString() }, prefer: 'return=minimal'
    });
    const r1replay = await klaim(env, uid, key1, hashA, 60000);
    assert(r1replay.hasil === 'done', 'Replay permintaan IDENTIK (key+data sama) setelah selesai: hasil = done (bukan claimed lagi)');
    assert(r1replay.order_id === orderId, 'Replay mengembalikan order_id pesanan yang SUDAH ada, bukan membuat yang baru');

    // --- 2b. Key yang SUDAH "done" dipakai ulang dengan payload BERBEDA -- harus hash_mismatch,
    // BUKAN diam-diam mengembalikan order_id lama (ditemukan saat audit: urutan pengecekan
    // hash vs status di fungsi ini sempat salah, lihat komentar di supabase/order-idempotency.sql).
    const r1replayBeda = await klaim(env, uid, key1, hashB, 60000);
    assert(r1replayBeda.hasil === 'hash_mismatch', 'Key yang sudah "done" dipakai ulang dengan payload BERBEDA: hash_mismatch, bukan diam-diam mengembalikan order_id lama');

    // --- 3. Payload BERBEDA dengan key yang SAMA ---
    const key3 = 'key-hash-mismatch-' + Date.now();
    kunciDibuat.push(key3);
    const r3a = await klaim(env, uid, key3, hashA, 60000);
    assert(r3a.hasil === 'claimed', 'Setup tes #3: klaim awal key baru dengan hashA berhasil');
    const r3b = await klaim(env, uid, key3, hashB, 60000);
    assert(r3b.hasil === 'hash_mismatch', 'Key sama + payload BERBEDA (hashB != hashA yang tersimpan): ditolak (hash_mismatch), bukan diproses sebagai permintaan itu');

    // --- 4. Request BERSAMAAN (concurrent) dengan key yang sama ---
    const key4 = 'key-concurrent-' + Date.now();
    kunciDibuat.push(key4);
    const [r4a, r4b] = await Promise.all([klaim(env, uid, key4, hashA, 60000), klaim(env, uid, key4, hashA, 60000)]);
    console.log('  percobaan A:', r4a.hasil, '| percobaan B:', r4b.hasil);
    const hasilGabungan = [r4a.hasil, r4b.hasil].sort().join('+');
    assert(hasilGabungan === 'claimed+processing', 'Dua permintaan BERSAMAAN dengan key sama: TEPAT SATU dapat claimed, yang lain dapat processing (tidak dua-duanya claimed)');

    // --- 5. Retry setelah "timeout" -- baris processing yang basi boleh diklaim ulang ---
    const key5 = 'key-stale-' + Date.now();
    kunciDibuat.push(key5);
    const r5a = await klaim(env, uid, key5, hashA, 60000);
    assert(r5a.hasil === 'claimed', 'Setup tes #5: klaim awal key baru berhasil (status processing)');
    // Belum basi -- retry SEKARANG dengan stale window besar harus ditolak (masih "berjalan").
    const r5bBelumBasi = await klaim(env, uid, key5, hashA, 60000);
    assert(r5bBelumBasi.hasil === 'processing', 'Baris processing yang MASIH baru (belum lewat stale window): retry ditolak (processing), tidak diklaim ulang begitu saja');
    // Mundurkan "diupdate" seolah permintaan sebelumnya sudah lama macet/crash.
    await sb(env, 'order_idempotency?user_id=eq.' + encodeURIComponent(uid) + '&idempotency_key=eq.' + encodeURIComponent(key5), {
      method: 'PATCH', body: { diupdate: new Date(Date.now() - 120000).toISOString() }, prefer: 'return=minimal'
    });
    const r5c = await klaim(env, uid, key5, hashA, 1000); // p_stale_ms=1000ms, baris berumur 120s -> basi
    assert(r5c.hasil === 'claimed', 'Baris processing yang SUDAH basi (lebih tua dari p_stale_ms): bisa diklaim ULANG, tidak terkunci selamanya oleh percobaan yang ditinggal/crash');

    // --- 6. Order BARU yang valid (key berbeda, data berbeda) -- tidak boleh terganggu key lain ---
    const key6 = 'key-baru-lain-' + Date.now();
    kunciDibuat.push(key6);
    const r6 = await klaim(env, uid, key6, hashB, 60000);
    assert(r6.hasil === 'claimed', 'Key BARU untuk pesanan BERBEDA (hashB): tetap claimed seperti biasa, tidak terpengaruh key-key lain milik user yang sama');
  } finally {
    // Bersihkan semua baris sintetis yang dibuat tes ini.
    for (const k of kunciDibuat) {
      await sb(env, 'order_idempotency?user_id=eq.' + encodeURIComponent(uid) + '&idempotency_key=eq.' + encodeURIComponent(k), { method: 'DELETE', prefer: 'return=minimal' }).catch(() => {});
    }
    await sb(env, 'orders?id=eq.' + encodeURIComponent(orderId), { method: 'DELETE', prefer: 'return=minimal' }).catch(() => {});
    console.log('Baris sintetis dibersihkan (order_idempotency x' + kunciDibuat.length + ', orders x1).');
  }

  console.log('\n' + (gagal === 0 ? 'SEMUA TES LOLOS' : gagal + ' TES GAGAL'));
  process.exit(gagal === 0 ? 0 : 1);
})().catch((e) => {
  console.error('\nERROR TAK TERTANGANI:', e && e.message ? e.message : e);
  console.error('Kalau pesannya menyebut "klaim_idempotensi_pesanan" atau "order_idempotency" tidak');
  console.error('ditemukan: migrasi supabase/order-idempotency.sql belum dijalankan di project Supabase ini.');
  process.exit(1);
});
