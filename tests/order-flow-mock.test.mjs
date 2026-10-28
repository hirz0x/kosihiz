/* Tes integrasi buatPesanan() (lib/pesanan.js) MELAWAN MOCK -- bukan Supabase/provider sungguhan.

   BEDA dengan tests/order-idempotency.test.js (yang menguji primitif klaim_idempotensi_pesanan()
   langsung di database tes): file ini menjalankan KODE ASLI lib/pesanan.js (diimpor langsung,
   tidak ditulis ulang) melawan server HTTP lokal buatan sendiri yang berperan sebagai Supabase
   REST + RPC dan sebagai provider SMM (action "add" dkk) -- jadi bisa menguji seluruh alur
   claim -> potong saldo -> panggil provider -> simpan -> selesaikan/lepas klaim SATU KALI JALAN,
   termasuk skenario yang tidak mungkin diuji lewat tests/order-idempotency.test.js (gagal provider,
   gagal refund, gagal finalisasi, koneksi provider putus) -- TANPA sekali pun menyentuh Supabase
   atau provider (smmsoc.com/likeo.net) sungguhan. Tidak perlu .env.test.local sama sekali.

   Kenapa aman: SUPABASE_URL/SUPABASE_SECRET_KEY/SMMSOC_API_URL/SMMSOC_API_KEY diisi dengan nilai
   PALSU yang mengarah ke server lokal (127.0.0.1) di bawah ini -- lib/pesanan.js tidak tahu
   bedanya, tapi tidak ada satu byte pun yang keluar ke jaringan luar.

   Kenapa perlu --import tests/_register-resolve-ext.mjs: lib/*.js memakai import relatif tanpa
   ekstensi (gaya Next.js/webpack, mis. `from './store'`), yang Node ESM native tolak kecuali
   dibantu loader hook itu (lihat komentar di tests/_resolve-ext.mjs). Ini TIDAK mengubah satu
   baris pun source code aplikasi.

   Jalankan: node --import ./tests/_register-resolve-ext.mjs tests/order-flow-mock.test.mjs
   (atau: npm run test:order-flow-mock) */

import http from 'node:http';

let gagal = 0;
function assert(kondisi, pesan) {
  if (!kondisi) { console.log('GAGAL: ' + pesan); gagal++; } else { console.log('OK: ' + pesan); }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function sendJson(res, status, body) {
  const text = body === undefined ? '' : JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(text);
}

/* Mock Supabase REST/RPC + provider SMM, dalam satu server HTTP lokal, state di memori. */
function createMockBackend() {
  const state = {
    services: new Map(),
    settings: new Map(),
    saldo: new Map(),
    orders: new Map(),
    idem: new Map(), // key: userId + '\0' + idempotencyKey
    usedRefIds: new Set()
  };
  const providerLog = [];
  let providerMode = { type: 'success' };
  const finalizeFailLeft = new Map(); // key -> sisa percobaan yang akan digagalkan
  const addSaldoFailFor = new Set(); // userId yang akan gagal di add_saldo_aman

  const server = http.createServer(async (req, res) => {
    let rawBody = '';
    try {
      rawBody = await readBody(req);
    } catch {
      return sendJson(res, 400, { message: 'gagal baca body' });
    }
    try {
      const u = new URL(req.url, 'http://mock.local');
      const path = u.pathname;
      const qs = u.searchParams;
      const method = req.method;
      const eq = (name) => {
        const v = qs.get(name);
        return v && v.startsWith('eq.') ? v.slice(3) : null;
      };

      if (path === '/provider') {
        const params = new URLSearchParams(rawBody);
        const action = params.get('action');
        providerLog.push({ action, params: Object.fromEntries(params) });
        if (providerMode.type === 'error') return sendJson(res, 200, { error: providerMode.message || 'Not enough funds on balance' });
        if (providerMode.type === 'network-fail') { req.socket.destroy(); return; }
        return sendJson(res, 200, { order: 900000 + providerLog.length });
      }

      if (!path.startsWith('/rest/v1/')) return sendJson(res, 404, { message: 'route tidak ada: ' + path });
      const rel = path.slice('/rest/v1/'.length);

      if (rel === 'services' && method === 'GET') {
        const id = eq('id');
        return sendJson(res, 200, [...state.services.values()].filter((s) => !id || s.id === id));
      }

      if (rel === 'settings' && method === 'GET') {
        const key = eq('key');
        return sendJson(res, 200, key && state.settings.has(key) ? [{ value: state.settings.get(key) }] : []);
      }

      if (rel === 'orders' && method === 'GET') {
        const id = eq('id');
        const uid = eq('user_id');
        let rows = [...state.orders.values()];
        if (id) rows = rows.filter((r) => r.id === id);
        if (uid) rows = rows.filter((r) => r.user_id === uid);
        return sendJson(res, 200, rows);
      }

      if (rel === 'orders' && method === 'POST') {
        const rows = JSON.parse(rawBody || '[]');
        for (const r of rows) state.orders.set(r.id, r);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        return res.end('');
      }

      if (rel === 'rpc/klaim_idempotensi_pesanan' && method === 'POST') {
        const { p_user_id, p_key, p_hash, p_stale_ms } = JSON.parse(rawBody);
        const k = p_user_id + '\u0000' + p_key;
        const now = Date.now();
        let row = state.idem.get(k);
        if (!row) {
          row = { user_id: p_user_id, idempotency_key: p_key, request_hash: p_hash, status: 'processing', order_id: null, dibuat: now, diupdate: now };
          state.idem.set(k, row);
          return sendJson(res, 200, [{ hasil: 'claimed', order_id: null }]);
        }
        // Hash dicek SEBELUM status -- cermin urutan yang sama di supabase/order-idempotency.sql
        // (lihat komentar di file itu: key 'done' dengan payload berbeda harus hash_mismatch,
        // bukan diam-diam mengembalikan order_id lama).
        if (row.request_hash !== p_hash) return sendJson(res, 200, [{ hasil: 'hash_mismatch', order_id: null }]);
        if (row.status === 'done') return sendJson(res, 200, [{ hasil: 'done', order_id: row.order_id }]);
        if (now - row.diupdate > p_stale_ms) {
          row.status = 'processing'; row.order_id = null; row.dibuat = now; row.diupdate = now;
          return sendJson(res, 200, [{ hasil: 'claimed', order_id: null }]);
        }
        return sendJson(res, 200, [{ hasil: 'processing', order_id: null }]);
      }

      if (rel === 'rpc/potong_saldo' && method === 'POST') {
        const { uid, amount } = JSON.parse(rawBody);
        const bal = state.saldo.get(uid) || 0;
        if (bal < amount) return sendJson(res, 200, null);
        state.saldo.set(uid, bal - amount);
        return sendJson(res, 200, bal - amount);
      }

      if (rel === 'rpc/add_saldo_aman' && method === 'POST') {
        const { p_uid, p_amount, p_ref_id } = JSON.parse(rawBody);
        if (addSaldoFailFor.has(p_uid)) return sendJson(res, 500, { message: 'simulasi add_saldo_aman gagal' });
        if (state.usedRefIds.has(p_ref_id)) return sendJson(res, 200, state.saldo.get(p_uid) || 0);
        state.usedRefIds.add(p_ref_id);
        const bal = (state.saldo.get(p_uid) || 0) + p_amount;
        state.saldo.set(p_uid, bal);
        return sendJson(res, 200, bal);
      }

      if (rel === 'order_idempotency' && method === 'PATCH') {
        const uid = eq('user_id');
        const key = eq('idempotency_key');
        const k = uid + '\u0000' + key;
        const sisa = finalizeFailLeft.get(k) || 0;
        if (sisa > 0) {
          finalizeFailLeft.set(k, sisa - 1);
          return sendJson(res, 500, { message: 'simulasi finalisasi gagal' });
        }
        const patch = JSON.parse(rawBody);
        const row = state.idem.get(k);
        if (row) Object.assign(row, patch);
        res.writeHead(204);
        return res.end('');
      }

      if (rel === 'order_idempotency' && method === 'DELETE') {
        const uid = eq('user_id');
        const key = eq('idempotency_key');
        const k = uid + '\u0000' + key;
        const row = state.idem.get(k);
        if (row && row.status === 'processing') state.idem.delete(k);
        res.writeHead(204);
        return res.end('');
      }

      return sendJson(res, 404, { message: 'route tidak ditangani: ' + method + ' ' + path });
    } catch (e) {
      sendJson(res, 500, { message: String((e && e.message) || e) });
    }
  });

  return {
    server,
    state,
    providerLog,
    setProviderMode: (m) => { providerMode = m; },
    failFinalizeFor: (uid, key, n) => finalizeFailLeft.set(uid + '\u0000' + key, n),
    failAddSaldoFor: (uid) => addSaldoFailFor.add(uid),
    clearAddSaldoFailFor: (uid) => addSaldoFailFor.delete(uid)
  };
}

function listen(server) {
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
}

const SERVICE_ID = 'MOCK-SVC-1';

(async () => {
  const backend = createMockBackend();
  const port = await listen(backend.server);
  const base = 'http://127.0.0.1:' + port;

  /* HARUS diisi SEBELUM mengimpor lib/pesanan.js: lib/provider.js membaca SMMSOC_API_URL di level
     modul (saat diimpor), bukan di dalam fungsi -- lihat lib/provider.js. SUPABASE_URL/SECRET_KEY
     dibaca lib/store.js di dalam fungsi (lazy), tapi diisi di sini juga sekalian untuk konsisten. */
  process.env.SUPABASE_URL = base;
  process.env.SUPABASE_SECRET_KEY = 'mock-key-local-test-only';
  process.env.SMMSOC_API_URL = base + '/provider';
  process.env.SMMSOC_API_KEY = 'mock-provider-key-local-test-only';

  backend.state.services.set(SERVICE_ID, {
    id: SERVICE_ID, aktif: true, dasar: 100000, markup: 10, provider: 'smmsoc', jenis: 'Default', nama: 'Mock Service', min: 10, maks: 10000
  });

  const { buatPesanan } = await import('../lib/pesanan.js');

  const BIAYA = 11000; // hargaJual=110000/1000 * jumlah(100) * (1-diskon 0%)

  try {
    // --- A. Permintaan normal: klaim -> potong saldo -> provider -> simpan -> selesaikan ---
    const userA = 'mock-user-a';
    backend.state.saldo.set(userA, 50000);
    const keyA = 'idemkey-normal-aaaaaaaa';
    const pesananA = await buatPesanan(userA, { service: SERVICE_ID, link: 'https://instagram.com/a', quantity: 100, idempotencyKey: keyA });
    assert(!!(pesananA && pesananA.id), 'A: permintaan normal berhasil membuat pesanan');
    assert(backend.providerLog.length === 1, 'A: provider dipanggil tepat 1x untuk 1 permintaan baru');
    assert(backend.state.saldo.get(userA) === 50000 - BIAYA, 'A: saldo terpotong tepat sekali sebesar biaya pesanan (tidak kurang/lebih)');
    const rowA = backend.state.idem.get(userA + '\u0000' + keyA);
    assert(!!(rowA && rowA.status === 'done' && rowA.order_id === pesananA.id), 'A: klaim idempotency ditandai "done" dengan order_id yang benar setelah sukses');

    // --- B. Replay identik (klien retry setelah tidak menerima respons, server sebenarnya sudah sukses) ---
    const saldoSebelumB = backend.state.saldo.get(userA);
    const providerCallSebelumB = backend.providerLog.length;
    const pesananB = await buatPesanan(userA, { service: SERVICE_ID, link: 'https://instagram.com/a', quantity: 100, idempotencyKey: keyA });
    assert(pesananB.id === pesananA.id, 'B: replay key+payload identik mengembalikan pesanan YANG SAMA, bukan pesanan baru');
    assert(backend.providerLog.length === providerCallSebelumB, 'B: replay TIDAK memanggil provider lagi -- retry key sama tidak mengirim order ke provider dua kali');
    assert(backend.state.saldo.get(userA) === saldoSebelumB, 'B: replay TIDAK memotong saldo lagi');

    // --- C. Key sama, payload BERBEDA -> ditolak sebelum menyentuh apa pun ---
    const providerCallSebelumC = backend.providerLog.length;
    let errC = null;
    try {
      await buatPesanan(userA, { service: SERVICE_ID, link: 'https://instagram.com/BEDA', quantity: 100, idempotencyKey: keyA });
    } catch (e) { errC = e; }
    assert(!!(errC && errC.status === 409), 'C: key sama + payload berbeda ditolak dengan status 409');
    assert(backend.providerLog.length === providerCallSebelumC, 'C: payload-berbeda-key-sama ditolak SEBELUM memanggil provider');
    assert(backend.state.saldo.get(userA) === saldoSebelumB, 'C: payload-berbeda-key-sama TIDAK memotong saldo');

    // --- D. Dua permintaan BERSAMAAN (race) dengan key sama, benar-benar konkuren di level HTTP ---
    const userD = 'mock-user-d';
    backend.state.saldo.set(userD, 50000);
    const keyD = 'idemkey-race-dddddddd';
    const providerCallSebelumD = backend.providerLog.length;
    const [hasilD1, hasilD2] = await Promise.allSettled([
      buatPesanan(userD, { service: SERVICE_ID, link: 'https://instagram.com/d', quantity: 100, idempotencyKey: keyD }),
      buatPesanan(userD, { service: SERVICE_ID, link: 'https://instagram.com/d', quantity: 100, idempotencyKey: keyD })
    ]);
    const sukses = [hasilD1, hasilD2].filter((r) => r.status === 'fulfilled');
    const ditolak = [hasilD1, hasilD2].filter((r) => r.status === 'rejected');
    assert(sukses.length === 1 && ditolak.length === 1, 'D: dua permintaan BERSAMAAN key sama -- tepat satu sukses, satu ditolak (tidak dua-duanya sukses)');
    assert(!!(ditolak[0] && ditolak[0].reason && ditolak[0].reason.status === 409), 'D: permintaan yang ditolak mendapat status 409 (processing), bukan diproses ulang');
    assert(backend.providerLog.length === providerCallSebelumD + 1, 'D: request paralel dengan key sama -- provider HANYA dipanggil 1x total, race aman di titik klaim');
    assert(backend.state.saldo.get(userD) === 50000 - BIAYA, 'D: saldo terpotong tepat SEKALI meski dua request datang bersamaan');

    // --- E. Provider gagal -> saldo dikembalikan & klaim DILEPAS -> retry dengan key sama sah ---
    const userE = 'mock-user-e';
    backend.state.saldo.set(userE, 50000);
    const keyE = 'idemkey-provfail-eeeeee';
    backend.setProviderMode({ type: 'error', message: 'Not enough funds on balance (pesan provider, bukan punya kita)' });
    let errE = null;
    try {
      await buatPesanan(userE, { service: SERVICE_ID, link: 'https://instagram.com/e', quantity: 100, idempotencyKey: keyE });
    } catch (e) { errE = e; }
    assert(!!(errE && errE.status === 502), 'E: provider gagal -> pelanggan menerima 502 (pesan provider mentah TIDAK diteruskan)');
    assert(backend.state.saldo.get(userE) === 50000, 'E: provider gagal -> saldo DIKEMBALIKAN penuh (tidak hilang)');
    assert(!backend.state.idem.has(userE + '\u0000' + keyE), 'E: provider gagal (refund sukses) -> klaim idempotency DILEPAS, key tidak macet');

    backend.setProviderMode({ type: 'success' });
    const providerCallSebelumERetry = backend.providerLog.length;
    const pesananERetry = await buatPesanan(userE, { service: SERVICE_ID, link: 'https://instagram.com/e', quantity: 100, idempotencyKey: keyE });
    assert(!!(pesananERetry && pesananERetry.id), 'E: retry SAH dengan key sama setelah klaim dilepas -- berhasil membuat pesanan baru');
    assert(backend.providerLog.length === providerCallSebelumERetry + 1, 'E: retry setelah release memanggil provider lagi (percobaan baru yang sah, bukan dobel dari percobaan gagal)');
    assert(backend.state.saldo.get(userE) === 50000 - BIAYA, 'E: retry setelah release memotong saldo untuk percobaan baru ini saja');

    // --- F. Provider gagal DAN refund (addSaldoAman) JUGA gagal -> klaim SENGAJA tidak dilepas ---
    const userF = 'mock-user-f';
    backend.state.saldo.set(userF, 50000);
    const keyF = 'idemkey-doublefail-ffffff';
    backend.setProviderMode({ type: 'error', message: 'provider down' });
    backend.failAddSaldoFor(userF);
    let errF = null;
    try {
      await buatPesanan(userF, { service: SERVICE_ID, link: 'https://instagram.com/f', quantity: 100, idempotencyKey: keyF });
    } catch (e) { errF = e; }
    assert(!!(errF && errF.status === 502 && /BELUM berhasil dikembalikan/.test(errF.message)), 'F: provider gagal DAN refund gagal -> pelanggan diberitahu saldo BELUM PASTI dikembalikan (bukan diklaim aman)');
    const rowF = backend.state.idem.get(userF + '\u0000' + keyF);
    assert(!!(rowF && rowF.status === 'processing'), 'F: kegagalan ganda (provider+refund) -> klaim SENGAJA TIDAK dilepas, tetap "processing" (status ambigu dibiarkan basi, bukan dilepas prematur)');

    backend.clearAddSaldoFailFor(userF);
    backend.setProviderMode({ type: 'success' });
    const providerCallSebelumF2 = backend.providerLog.length;
    let errF2 = null;
    try {
      await buatPesanan(userF, { service: SERVICE_ID, link: 'https://instagram.com/f', quantity: 100, idempotencyKey: keyF });
    } catch (e) { errF2 = e; }
    assert(!!(errF2 && errF2.status === 409), 'F: selagi klaim masih tertahan (belum basi) -- retry dengan key sama ditolak (processing), TIDAK mencoba potong saldo/panggil provider lagi di atas status ambigu');
    assert(backend.providerLog.length === providerCallSebelumF2, 'F: retry yang ditolak karena masih tertahan TIDAK memanggil provider');

    // Simulasikan baris tertahan itu sudah basi (>60 detik) -- harus bisa diklaim ulang, tidak macet selamanya.
    rowF.diupdate = Date.now() - 120000;
    const providerCallSebelumFStale = backend.providerLog.length;
    const pesananFStale = await buatPesanan(userF, { service: SERVICE_ID, link: 'https://instagram.com/f', quantity: 100, idempotencyKey: keyF });
    assert(!!(pesananFStale && pesananFStale.id), 'F: setelah klaim yang tertahan BASI (>60 detik) -- key bisa diklaim ulang, TIDAK macet selamanya');
    assert(backend.providerLog.length === providerCallSebelumFStale + 1, 'F: klaim ulang setelah basi memanggil provider sebagai percobaan baru yang sah');

    // --- G. Finalisasi (tandai "done") gagal 3x setelah sukses -> pesanan TETAP sukses ke pelanggan ---
    const userG = 'mock-user-g';
    backend.state.saldo.set(userG, 50000);
    const keyG = 'idemkey-finalizefail-gggggg';
    backend.setProviderMode({ type: 'success' });
    backend.failFinalizeFor(userG, keyG, 3);
    const pesananG = await buatPesanan(userG, { service: SERVICE_ID, link: 'https://instagram.com/g', quantity: 100, idempotencyKey: keyG });
    assert(!!(pesananG && pesananG.id), 'G: finalisasi gagal total 3x percobaan -- pelanggan TETAP menerima pesanan sukses (provider sudah proses beneran)');
    const rowG = backend.state.idem.get(userG + '\u0000' + keyG);
    assert(!!(rowG && rowG.status === 'processing'), 'G: akibat finalisasi gagal -- baris idempotency tertahan di "processing" (bukan "done"); risiko residual terdokumentasi, BUKAN kegagalan diam-diam');
    let errGReplay = null;
    try {
      await buatPesanan(userG, { service: SERVICE_ID, link: 'https://instagram.com/g', quantity: 100, idempotencyKey: keyG });
    } catch (e) { errGReplay = e; }
    assert(!!(errGReplay && errGReplay.status === 409), 'G: replay SEBELUM baris basi ditolak (processing) -- TIDAK membuat pesanan kedua, meski klien belum bisa dapat balasan pesanan pertamanya sampai baris basi');

    // --- H. Validasi gagal (jumlah di luar batas) -> klaim idempotency TIDAK pernah dibuat ---
    const userH = 'mock-user-h';
    backend.state.saldo.set(userH, 50000);
    const keyH = 'idemkey-validasi-hhhhhh';
    const providerCallSebelumH = backend.providerLog.length;
    let errH = null;
    try {
      await buatPesanan(userH, { service: SERVICE_ID, link: 'https://instagram.com/h', quantity: 999999, idempotencyKey: keyH });
    } catch (e) { errH = e; }
    assert(!!(errH && errH.status === 400), 'H: validasi jumlah di luar batas layanan -> ditolak 400');
    assert(!backend.state.idem.has(userH + '\u0000' + keyH), 'H: permintaan gagal validasi TIDAK membuat/menghabiskan baris klaim idempotency');
    assert(backend.providerLog.length === providerCallSebelumH, 'H: validasi gagal -> provider tidak pernah dipanggil');
    assert(backend.state.saldo.get(userH) === 50000, 'H: validasi gagal -> saldo tidak tersentuh');

    // --- I. Koneksi ke provider putus sebelum respons sampai (ambigu) -- BATASAN YANG HARUS JUJUR DILAPORKAN ---
    const userI = 'mock-user-i';
    backend.state.saldo.set(userI, 50000);
    const keyI = 'idemkey-nettimeout-iiiiii';
    backend.setProviderMode({ type: 'network-fail' });
    let errI = null;
    try {
      await buatPesanan(userI, { service: SERVICE_ID, link: 'https://instagram.com/i', quantity: 100, idempotencyKey: keyI });
    } catch (e) { errI = e; }
    assert(errI != null, 'I: koneksi ke provider putus sebelum respons sampai -> dilaporkan sebagai error (bukan sukses senyap)');
    assert(backend.state.saldo.get(userI) === 50000, 'I: setelah koneksi provider putus -> saldo LOKAL tetap konsisten (dikembalikan)');

    backend.setProviderMode({ type: 'success' });
    const providerCallSebelumIRetry = backend.providerLog.length;
    const pesananIRetry = await buatPesanan(userI, { service: SERVICE_ID, link: 'https://instagram.com/i', quantity: 100, idempotencyKey: keyI });
    assert(!!(pesananIRetry && pesananIRetry.id), 'I: retry dengan key sama setelah koneksi putus berhasil (klaim sudah dilepas karena refund lokal sukses)');
    assert(
      backend.providerLog.length === providerCallSebelumIRetry + 1,
      'I: CATATAN BATASAN (bukan bug) -- retry ini memanggil provider LAGI, sebagai percobaan ke-2 yang sah dari sudut pandang SISTEM KITA (percobaan pertama dianggap gagal karena jawabannya tidak pernah sampai). ' +
      'Idempotensi di sini HANYA menjamin exactly-once di SISI KITA (saldo & record order lokal) -- kalau percobaan pertama ternyata DIAM-DIAM sudah diproses provider sebelum koneksinya putus, provider bisa menerima 2 panggilan "add" berbeda untuk 1 maksud pelanggan. ' +
      'Provider (smmsoc/likeo) tidak punya field dedup/idempotency key sendiri (lib/provider.js: ALLOWED.add tidak memuatnya) -- idempotensi database lokal TIDAK otomatis menjamin idempotensi di provider eksternal; exactly-once delivery ke provider TIDAK bisa diklaim dari mekanisme ini.'
    );
  } finally {
    backend.server.close();
  }

  console.log('\n' + (gagal === 0 ? 'SEMUA TES LOLOS' : gagal + ' TES GAGAL'));
  process.exit(gagal === 0 ? 0 : 1);
})().catch((e) => {
  console.error('\nERROR TAK TERTANGANI:', e && e.stack ? e.stack : e);
  process.exit(1);
});
