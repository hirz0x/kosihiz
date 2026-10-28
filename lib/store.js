/* Penyimpanan di Supabase (Postgres via REST). Hanya dipakai di server.
   Memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari .env.local. */

const DEFAULT_SETTINGS = { kurs: 16000 };

function cfg() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL atau SUPABASE_SECRET_KEY belum diisi di .env.local.');
  return { url: url.replace(/\/$/, ''), key };
}

async function sb(path, { method = 'GET', body, prefer } = {}) {
  const { url, key } = cfg();
  const headers = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };
  if (prefer) headers.Prefer = prefer;
  const r = await fetch(url + '/rest/v1/' + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* bukan JSON */ }
  if (!r.ok) throw new Error('Supabase ' + r.status + ': ' + ((data && data.message) || text.slice(0, 200)));
  return data;
}

/* PostgREST membatasi 1000 baris per permintaan, jadi dibaca per halaman.
   `select` opsional: default '*' (semua kolom) untuk kompatibilitas pemanggil yang sudah ada —
   isi dengan daftar kolom spesifik (mis. 'user_id,biaya,status') kalau pemanggil cuma butuh
   sebagian kolom, supaya payload yang ditarik dari Supabase tidak membesar tanpa guna untuk
   tabel yang barisnya sudah banyak (lihat getOrdersRingkas di bawah). */
async function selectAll(table, order, filter = '', select = '*') {
  let out = [];
  for (let off = 0; ; off += 1000) {
    const part = await sb(table + '?select=' + select + '&order=' + order + filter + '&limit=1000&offset=' + off);
    out = out.concat(part);
    if (part.length < 1000) break;
  }
  return out;
}

async function upsert(table, rows, onConflict) {
  for (let i = 0; i < rows.length; i += 500) {
    await sb(table + '?on_conflict=' + onConflict, {
      method: 'POST',
      body: rows.slice(i, i + 500),
      prefer: 'resolution=merge-duplicates,return=minimal'
    });
  }
}

/* ---------- layanan ---------- */

/* opts boleh string (nama provider, buat kompatibilitas lama) atau object { provider, aktifOnly }.
   aktifOnly mendorong filter "aktif" ke query Supabase-nya langsung, bukan ambil semua baris dulu
   baru disaring di JS — penting waktu katalognya sudah puluhan ribu baris (mis. ribuan layanan
   provider lain yang sengaja belum diaktifkan, tidak perlu ikut ditarik dari DB sama sekali). */
export async function getServices(opts) {
  const o = typeof opts === 'string' ? { provider: opts } : (opts || {});
  let filter = '';
  if (o.provider) filter += '&provider=eq.' + encodeURIComponent(o.provider);
  if (o.aktifOnly) filter += '&aktif=eq.true';
  return selectAll('services', 'id.asc', filter);
}

/* Satu layanan by ID — dipakai tiap kali ada pesanan dibuat (lib/pesanan.js), jadi harus tetap
   murah walau katalognya sudah puluhan ribu baris lintas provider. Jangan ganti dengan
   `(await getServices()).find(...)`, itu artinya narik SELURUH katalog (dua provider sekaligus)
   cuma buat satu baris — bikin tiap pesanan kebawa lambat tanpa alasan. */
export async function getService(id) {
  const rows = await sb('services?select=*&id=eq.' + encodeURIComponent(id));
  return rows && rows.length ? rows[0] : null;
}

/* Simpan satu daftar layanan lengkap UNTUK SATU PROVIDER. Layanan provider itu yang sudah
   tidak ada di daftar baru dihapus — baris provider lain tidak disentuh sama sekali, supaya
   sinkron satu provider tidak pernah menghapus katalog provider yang lain. */
export async function replaceServices(list, provider) {
  const lama = await getServices(provider);
  const baru = new Set(list.map((x) => x.id));
  const hapus = lama.map((x) => x.id).filter((id) => !baru.has(id));
  for (let i = 0; i < hapus.length; i += 200) {
    const daftar = hapus.slice(i, i + 200).map((id) => '"' + id + '"').join(',');
    await sb('services?id=in.(' + daftar + ')', { method: 'DELETE', prefer: 'return=minimal' });
  }
  await upsert('services', list, 'id');
}

export async function saveServices(list) {
  await upsert('services', list, 'id');
}

/* ---------- pesanan ---------- */

/* '' bukan null/undefined jadi lolos dari ??, tapi ditolak Postgres untuk kolom integer —
   dan sekali itu terjadi, SELURUH batch upsert ikut gagal, bukan cuma satu baris. Jaga-jaga di sini
   selain di lib/orders.js, supaya sumber data lain yang belum tentu bersih tidak bisa mengulang bug ini. */
function keAngkaAtauNull(v) {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function pesananKeDb(o) {
  return {
    id: o.id,
    provider_order: o.providerOrder ?? null,
    layanan_id: keAngkaAtauNull(o.layananId),
    layanan_nama: o.layananNama ?? null,
    link: o.link ?? null,
    jumlah: keAngkaAtauNull(o.jumlah),
    biaya: keAngkaAtauNull(o.biaya),
    status: o.status ?? null,
    sisa: keAngkaAtauNull(o.sisa),
    awal: keAngkaAtauNull(o.awal),
    dibuat: o.dibuat ?? null,
    cek_at: o.cekAt ?? null,
    selesai_at: o.selesaiAt ?? null,
    user_id: o.userId ?? null,
    provider: o.provider || 'smmsoc'
  };
}

function pesananDariDb(r) {
  return {
    id: r.id,
    providerOrder: r.provider_order,
    layananId: r.layanan_id,
    layananNama: r.layanan_nama,
    link: r.link,
    jumlah: r.jumlah,
    biaya: r.biaya,
    status: r.status,
    sisa: r.sisa,
    awal: r.awal,
    dibuat: r.dibuat,
    cekAt: r.cek_at,
    selesaiAt: r.selesai_at,
    userId: r.user_id,
    provider: r.provider || 'smmsoc'
  };
}

/* userId opsional: kalau diisi, query-nya difilter di Supabase langsung (bukan ambil SEMUA pesanan
   lalu disaring di JS) — penting dipakai di tempat yang cuma butuh pesanan SATU user (mis. hitung
   peringkat tiap kali checkout), supaya tidak ikut menarik pesanan semua orang setiap saat. */
export async function getOrders(userId) {
  const filter = userId ? '&user_id=eq.' + encodeURIComponent(userId) : '';
  const rows = await selectAll('orders', 'dibuat.desc', filter);
  return rows.map(pesananDariDb);
}

/* Versi ringkas getOrders() KHUSUS untuk rekap per-user (lihat pages/api/pengguna.js) — cuma
   butuh 3 kolom (siapa, biayanya, statusnya) untuk dihitung per user, bukan SELURUH baris
   pesanan dengan semua kolomnya. PERF-01 (lihat AUDIT_REPORT.md): ini bukan perbaikan arsitektur
   penuh (itu tetap butuh agregasi di database lewat RPC/view, belum dibuat — lihat laporan),
   tapi mengurangi data yang ditarik dari Supabase secara nyata TANPA mengubah hasil akhirnya
   sedikit pun (angka pesanan/belanja per user tetap persis sama), dan tidak butuh migrasi apa pun. */
export async function getOrdersRingkas() {
  return selectAll('orders', 'dibuat.desc', '', 'user_id,biaya,status');
}

/* Satu pesanan by id — dipakai tiap kali admin/pelanggan perlu cari SATU pesanan (batalkan,
   ajukan refund, refund langsung admin), jadi harus tetap murah walau tabel orders sudah besar.
   Jangan ganti dengan `(await getOrders()).find(...)` atau `(await getOrders(uid)).find(...)` —
   itu tetap narik semua baris (semua pesanan satu user, atau lebih parah semua pesanan semua
   user) cuma buat satu baris. userId opsional: kalau diisi, sekalian pastikan pesanan itu
   memang milik user tersebut (dipakai jalur pelanggan, bukan admin). */
export async function getOrder(id, userId) {
  const filter = userId ? '&user_id=eq.' + encodeURIComponent(userId) : '';
  const rows = await sb('orders?select=*&id=eq.' + encodeURIComponent(id) + filter);
  return rows && rows.length ? pesananDariDb(rows[0]) : null;
}

export async function saveOrders(list) {
  if (!list.length) return;
  await upsert('orders', list.map(pesananKeDb), 'id');
}

/* ---------- idempotency key pembuatan pesanan ---------- */
/* Lihat supabase/order-idempotency.sql untuk definisi tabel+fungsi, dan lib/pesanan.js untuk
   bagaimana ini dipakai dalam alur buatPesanan(). Tabel & fungsi ini BELUM dijalankan ke database
   manapun (migrasi disiapkan, belum dieksekusi) -- ketiga fungsi di bawah akan melempar error
   kalau dipanggil sebelum migrasinya dijalankan (fungsi/tabelnya belum ada). Itu SENGAJA: lihat
   lib/pesanan.js, bagian ini hanya dipanggil kalau klien mengirim idempotencyKey secara eksplisit
   (dashboard "Buat Pesanan" baru), jadi jalur lama (tanpa key -- mass order, API key reseller)
   tidak pernah memanggil ini sama sekali dan tidak terdampak sebelum migrasi dijalankan. */

export async function klaimIdempotensiPesanan(userId, key, hash, staleMs) {
  const rows = await sb('rpc/klaim_idempotensi_pesanan', {
    method: 'POST',
    body: { p_user_id: userId, p_key: key, p_hash: hash, p_stale_ms: staleMs }
  });
  return rows && rows.length ? rows[0] : { hasil: 'claimed', order_id: null };
}

/* Dipanggil setelah pesanan BENAR-BENAR tersimpan (sukses) -- retry 3x sama seperti
   addSaldoAman()/saveOrders() di lib/pesanan.js, karena titik ini juga "kritis": kalau PATCH ini
   gagal terus, baris tetap 'processing' sampai basi (p_stale_ms), lalu BISA diklaim ulang dan
   membuat pesanan KEDUA kalau ada retry dari klien persis di jendela waktu itu. Retry di sini
   bukan jaminan mutlak, tapi mengecilkan jendela racenya sampai sekecil praktis mungkin --
   residual risk-nya didokumentasikan di AUDIT_REPORT.md, sekelas dengan risiko yang sudah
   diterima proyek ini untuk "KRITIS: gagal disimpan ke database setelah 3x percobaan". */
export async function selesaikanIdempotensiPesanan(userId, key, orderId) {
  let terakhir;
  for (let percobaan = 1; percobaan <= 3; percobaan++) {
    try {
      await sb('order_idempotency?user_id=eq.' + encodeURIComponent(userId) + '&idempotency_key=eq.' + encodeURIComponent(key), {
        method: 'PATCH',
        body: { status: 'done', order_id: orderId, diupdate: new Date().toISOString() },
        prefer: 'return=minimal'
      });
      return;
    } catch (e) {
      terakhir = e;
      if (percobaan < 3) await new Promise((resolve) => setTimeout(resolve, 300 * percobaan));
    }
  }
  console.error('KRITIS: pesanan ' + orderId + ' sukses tapi GAGAL menandai idempotency key "' + key + '" jadi "done" setelah 3x percobaan -- kalau klien retry dengan key yang sama SEBELUM baris ini basi, permintaan akan ditolak (409) bukan dikembalikan hasil lama. uid:', userId, '| error:', terakhir && terakhir.message ? terakhir.message : terakhir);
}

/* Dipanggil kalau proses pembuatan pesanan gagal SETELAH klaim key berhasil (validasi gagal,
   saldo tidak cukup, provider gagal, dst) -- menghapus baris 'processing' supaya key itu BEBAS
   dipakai lagi segera (retry yang sah), bukan menunggu sampai basi. Best-effort: kalau DELETE ini
   sendiri gagal, key itu cuma tertahan sampai p_stale_ms lewat (bukan selamanya) -- tidak fatal. */
export async function lepasKlaimIdempotensiPesanan(userId, key) {
  try {
    await sb('order_idempotency?user_id=eq.' + encodeURIComponent(userId) + '&idempotency_key=eq.' + encodeURIComponent(key) + '&status=eq.processing', {
      method: 'DELETE',
      prefer: 'return=minimal'
    });
  } catch (e) {
    console.error('Gagal melepas klaim idempotency key "' + key + '" setelah percobaan pesanan gagal (tidak fatal, key akan basi sendiri):', e && e.message ? e.message : e);
  }
}

/* ---------- pengaturan ---------- */

export async function getSetting(key, fallback) {
  const rows = await sb('settings?select=value&key=eq.' + encodeURIComponent(key));
  return rows && rows.length ? rows[0].value : fallback;
}

export async function setSetting(key, value) {
  await upsert('settings', [{ key, value }], 'key');
}

export async function hapusSetting(key) {
  await sb('settings?key=eq.' + encodeURIComponent(key), { method: 'DELETE', prefer: 'return=minimal' });
}

/* Klaim satu baris settings HANYA kalau key-nya belum ada ("INSERT ... ON CONFLICT DO NOTHING" lewat
   Supabase) — beda dari setSetting yang selalu menimpa. Dipakai buat aksi yang cuma boleh kejadian
   sekali (mis. undian bulanan) supaya dua permintaan hampir bersamaan tidak bisa sama-sama lolos
   "belum ada yang klaim" sebelum salah satu sempat menulis duluan. true = berhasil klaim (baris ini
   yang pertama), false = sudah ada yang klaim duluan. */
export async function klaimSetting(key, value) {
  const data = await sb('settings', {
    method: 'POST',
    body: [{ key, value }],
    prefer: 'resolution=ignore-duplicates,return=representation'
  });
  return Array.isArray(data) && data.length > 0;
}

export async function getSettings() {
  return { ...DEFAULT_SETTINGS, ...(await getSetting('settings', {})) };
}

/* ---------- profil & saldo ---------- */

export async function getProfile(uid) {
  const rows = await sb('profiles?select=*&user_id=eq.' + encodeURIComponent(uid));
  return rows && rows.length ? rows[0] : null;
}

export async function getProfileByUsername(username) {
  const rows = await sb('profiles?select=user_id&username=eq.' + encodeURIComponent(username));
  return rows && rows.length ? rows[0] : null;
}

export async function createProfile(uid, username, refBy = null) {
  await sb('profiles', { method: 'POST', body: [{ user_id: uid, username, ref_by: refBy }], prefer: 'return=minimal' });
  return getProfile(uid);
}

export async function addSaldo(uid, n) {
  return sb('rpc/add_saldo', { method: 'POST', body: { uid, amount: n } });
}

/* Dipanggil SETELAH status refund/deposit diklaim "disetujui" (supaya tidak diproses dua kali).
   Kalau addSaldo gagal di sini dan tidak diulang, saldo bisa tidak pernah masuk padahal statusnya
   sudah terlanjur "disetujui" — dan tidak bisa diajukan ulang karena ketahan pengecekan duplikat.

   PENTING soal retry-nya: RPC yang dipanggil (add_saldo_aman) BUKAN cuma retry buta — dia idempoten
   lewat tabel saldo_log (lihat supabase/schema.sql). Tanpa ini, retry bisa nambah saldo DUA KALI
   kalau yang gagal cuma koneksinya SETELAH transaksi sebenarnya sukses commit di database (realistis
   untuk fungsi serverless yang nyambung ke Supabase lintas region) — exception dari fetch yang gagal
   terlihat sama persis dengan "belum sempat jalan di database", padahal belum tentu.

   refId WAJIB unik & stabil per transaksi logis (bukan cuma label buat log) — refund pakai id
   refund/pesanan, deposit pakai id deposit, dst. Panggilan ulang dengan refId yang SAMA dijamin
   cuma nambah saldo sekali, berapa kali pun RPC-nya ditembak ulang. */
export async function addSaldoAman(uid, n, refId) {
  let terakhir;
  for (let percobaan = 1; percobaan <= 3; percobaan++) {
    try {
      return await sb('rpc/add_saldo_aman', { method: 'POST', body: { p_uid: uid, p_amount: n, p_ref_id: refId } });
    } catch (e) {
      terakhir = e;
      if (percobaan < 3) await new Promise((resolve) => setTimeout(resolve, 500 * percobaan));
    }
  }
  console.error('KRITIS: status sudah "disetujui" tapi saldo GAGAL ditambahkan setelah 3x percobaan (' + refId + ') — butuh ditambahkan manual. uid:', uid, 'jumlah:', n, '| error:', terakhir && terakhir.message ? terakhir.message : terakhir);
  throw terakhir;
}

export async function potongSaldo(uid, n) {
  return sb('rpc/potong_saldo', { method: 'POST', body: { uid, amount: n } });
}

/* Pembatas percobaan (rate limit): dulu dihitung di JS lewat baca-lalu-tulis biasa, rawan race
   kalau beberapa percobaan datang bersamaan (dibuktikan: 15 pendaftaran konkuren dari 1 IP, yang
   seharusnya dibatasi 5/jam, 15-15nya lolos). Sekarang dihitung atomic di database — lihat
   rl_tick/rl_gagal di supabase/schema.sql. */
export async function rlTick(key, maks, jendelaMs) {
  return sb('rpc/rl_tick', { method: 'POST', body: { p_key: key, p_maks: maks, p_jendela_ms: jendelaMs } });
}

export async function rlGagal(key, kelipatan) {
  return sb('rpc/rl_gagal', { method: 'POST', body: { p_key: key, p_kelipatan: kelipatan } });
}

/* Rata-rata menit penyelesaian per layanan, dihitung di database lewat RPC (lihat
   supabase/schema.sql, fungsi waktu_per_layanan) — bukan tarik seluruh tabel orders ke Node. */
export async function waktuPerLayananDb() {
  return sb('rpc/waktu_per_layanan', { method: 'POST' });
}

/* ---------- deposit ---------- */

function depositKeDb(d) {
  return { id: d.id, user_id: d.userId, nominal: d.nominal, metode: d.metode, status: d.status, dibuat: d.dibuat, trx_id: d.trxId || null, bayar_url: d.bayarUrl || null };
}

function depositDariDb(r) {
  return { id: r.id, userId: r.user_id, nominal: r.nominal, metode: r.metode, status: r.status, dibuat: r.dibuat, diputuskan: r.diputuskan, trxId: r.trx_id, bayarUrl: r.bayar_url };
}

export async function createDeposit(d) {
  await sb('deposits', { method: 'POST', body: [depositKeDb(d)], prefer: 'return=minimal' });
}

export async function listDeposits(uid) {
  const filter = uid ? '&user_id=eq.' + encodeURIComponent(uid) : '';
  const rows = await selectAll('deposits', 'dibuat.desc', filter);
  return rows.map(depositDariDb);
}

export async function getDeposit(id) {
  const rows = await sb('deposits?select=*&id=eq.' + encodeURIComponent(id));
  return rows && rows.length ? depositDariDb(rows[0]) : null;
}

/* Ubah status hanya kalau statusnya masih sama dengan yang diharapkan. Mengembalikan true kalau berhasil. */
export async function ubahStatusDeposit(id, dariStatus, keStatus) {
  const rows = await sb('deposits?id=eq.' + encodeURIComponent(id) + '&status=eq.' + encodeURIComponent(dariStatus), {
    method: 'PATCH',
    body: { status: keStatus, diputuskan: new Date().toISOString() },
    prefer: 'return=representation'
  });
  return Array.isArray(rows) && rows.length > 0;
}

export async function semuaProfil() {
  return selectAll('profiles', 'user_id.asc');
}

/* ---------- tiket support ---------- */

function tiketDariDb(r) {
  return { id: r.id, userId: r.user_id, username: r.username, kategori: r.kategori, sub: r.sub, orderId: r.order_id, status: r.status, pesan: r.pesan || [], userBaca: r.user_baca, dibuat: r.dibuat, diupdate: r.diupdate };
}

export async function listTickets(uid) {
  const filter = uid ? '&user_id=eq.' + encodeURIComponent(uid) : '';
  const rows = await selectAll('tickets', 'diupdate.desc', filter);
  return rows.map(tiketDariDb);
}

export async function getTicket(id) {
  const rows = await sb('tickets?select=*&id=eq.' + encodeURIComponent(id));
  return rows && rows.length ? tiketDariDb(rows[0]) : null;
}

export async function createTicket(t) {
  const rows = await sb('tickets', {
    method: 'POST',
    body: [{ user_id: t.userId, username: t.username, kategori: t.kategori, sub: t.sub, order_id: t.orderId, status: 'open', pesan: t.pesan, user_baca: true }],
    prefer: 'return=representation'
  });
  return tiketDariDb(rows[0]);
}

/* Field yang bisa diubah: status, pesan, userBaca. diupdate selalu diperbarui. */
export async function updateTicket(id, f) {
  const body = { diupdate: new Date().toISOString() };
  if (f.status !== undefined) body.status = f.status;
  if (f.pesan !== undefined) body.pesan = f.pesan;
  if (f.userBaca !== undefined) body.user_baca = f.userBaca;
  const rows = await sb('tickets?id=eq.' + encodeURIComponent(id), { method: 'PATCH', body, prefer: 'return=representation' });
  return tiketDariDb(rows[0]);
}

/* Tambah satu pesan balasan secara ATOMIC (operator jsonb "||" di database, bukan baca-array-lalu-
   tulis-ulang di Node) — dipakai khusus buat balasan, supaya dua balasan yang hampir bersamaan
   tidak saling menimpa dan membuat salah satunya hilang. Jangan pakai updateTicket untuk ini. */
export async function tambahPesanTiket(id, pesanBaru, f = {}) {
  const rows = await sb('rpc/tambah_pesan_tiket', {
    method: 'POST',
    body: { p_id: id, p_pesan_baru: [pesanBaru], p_status: f.status ?? null, p_user_baca: f.userBaca === undefined ? null : f.userBaca }
  });
  return rows && rows.length ? tiketDariDb(rows[0]) : null;
}

/* ---------- refund ---------- */

function refundDariDb(r) {
  return { id: r.id, userId: r.user_id, username: r.username, pesanan: r.pesanan, jumlah: r.jumlah, alasan: r.alasan, status: r.status, dibuat: r.dibuat, diputuskan: r.diputuskan };
}

export async function listRefunds(uid) {
  const filter = uid ? '&user_id=eq.' + encodeURIComponent(uid) : '';
  const rows = await selectAll('refunds', 'dibuat.desc', filter);
  return rows.map(refundDariDb);
}

export async function getRefund(id) {
  const rows = await sb('refunds?select=*&id=eq.' + encodeURIComponent(id));
  return rows && rows.length ? refundDariDb(rows[0]) : null;
}

/* Pengecekan "sudah pernah direfund" di pemanggil (refunds.js/orders/refund.js) membaca dulu baru
   menulis — dua permintaan yang hampir bersamaan (double klik, atau dua request paralel) bisa
   sama-sama lolos pengecekan itu sebelum salah satu selesai menulis. Index unique parsial
   `refunds_pesanan_aktif_idx` di database (lihat supabase/schema.sql) jadi penjaga terakhir:
   kalau sampai dua permintaan tetap lolos pengecekan di kode, yang kedua akan ditolak di sini. */
export async function createRefund(r) {
  try {
    const rows = await sb('refunds', {
      method: 'POST',
      body: [{ user_id: r.userId, username: r.username, pesanan: r.pesanan, jumlah: r.jumlah, alasan: r.alasan, status: 'menunggu' }],
      prefer: 'return=representation'
    });
    return refundDariDb(rows[0]);
  } catch (e) {
    if (/duplicate key|refunds_pesanan_aktif_idx/.test(String(e.message))) {
      const err = new Error('Pesanan ini sudah pernah direfund atau sedang diajukan.');
      err.duplikat = true;
      throw err;
    }
    throw e;
  }
}

/* Sama seperti ubahStatusDeposit: hanya berubah kalau statusnya masih yang diharapkan. */
export async function ubahStatusRefund(id, dariStatus, keStatus) {
  const rows = await sb('refunds?id=eq.' + encodeURIComponent(id) + '&status=eq.' + encodeURIComponent(dariStatus), {
    method: 'PATCH',
    body: { status: keStatus, diputuskan: new Date().toISOString() },
    prefer: 'return=representation'
  });
  return Array.isArray(rows) && rows.length > 0;
}

/* ---------- afiliasi ---------- */

export async function addKomisi(uid, n) {
  return sb('rpc/add_komisi', { method: 'POST', body: { uid, amount: n } });
}

export async function hitungReferral(username) {
  const rows = await sb('profiles?select=user_id&ref_by=eq.' + encodeURIComponent(username));
  return rows.length;
}

/* ---------- riwayat layanan ---------- */

export async function listRiwayat(limit) {
  return sb('riwayat_layanan?select=*&order=dibuat.desc&limit=' + Number(limit));
}

export async function tambahRiwayat(rows) {
  await sb('riwayat_layanan', {
    method: 'POST',
    body: rows.map((r) => ({ layanan_id: String(r.layananId), tipe: r.tipe, lama: r.lama || null, baru: r.baru || null })),
    prefer: 'return=minimal'
  });
}

export async function getDepositByTrx(trxId) {
  const rows = await sb('deposits?select=*&trx_id=eq.' + encodeURIComponent(trxId));
  return rows && rows.length ? depositDariDb(rows[0]) : null;
}

export async function pindahKomisiKeSaldo(uid, n) {
  return sb('rpc/pindah_komisi_ke_saldo', { method: 'POST', body: { uid, amount: n } });
}
/* Terima satu id atau array id (hapus massal). */
export async function hapusRiwayat(id) {
  const daftar = Array.isArray(id) ? id : [id];
  if (!daftar.length) return;
  await sb('riwayat_layanan?id=in.(' + daftar.map((x) => Number(x)).join(',') + ')', { method: 'DELETE', prefer: 'return=minimal' });
}

/* ---------- log aktivitas admin ---------- */

export async function tambahAdminLog(aksi, detail) {
  await sb('admin_log', { method: 'POST', body: [{ aksi, detail: detail || null }], prefer: 'return=minimal' });
}

export async function listAdminLog(limit) {
  return sb('admin_log?select=*&order=dibuat.desc&limit=' + Number(limit || 200));
}
