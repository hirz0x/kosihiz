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

/* PostgREST membatasi 1000 baris per permintaan, jadi dibaca per halaman. */
async function selectAll(table, order, filter = '') {
  let out = [];
  for (let off = 0; ; off += 1000) {
    const part = await sb(table + '?select=*&order=' + order + filter + '&limit=1000&offset=' + off);
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

export async function getServices() {
  return selectAll('services', 'id.asc');
}

/* Simpan satu daftar layanan lengkap. Layanan yang sudah tidak ada di provider dihapus. */
export async function replaceServices(list) {
  const lama = await getServices();
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
    user_id: o.userId ?? null
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
    userId: r.user_id
  };
}

export async function getOrders() {
  const rows = await selectAll('orders', 'dibuat.desc');
  return rows.map(pesananDariDb);
}

export async function saveOrders(list) {
  if (!list.length) return;
  await upsert('orders', list.map(pesananKeDb), 'id');
}

/* ---------- pengaturan ---------- */

export async function getSetting(key, fallback) {
  const rows = await sb('settings?select=value&key=eq.' + encodeURIComponent(key));
  return rows && rows.length ? rows[0].value : fallback;
}

export async function setSetting(key, value) {
  await upsert('settings', [{ key, value }], 'key');
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

export async function potongSaldo(uid, n) {
  return sb('rpc/potong_saldo', { method: 'POST', body: { uid, amount: n } });
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

export async function createRefund(r) {
  const rows = await sb('refunds', {
    method: 'POST',
    body: [{ user_id: r.userId, username: r.username, pesanan: r.pesanan, jumlah: r.jumlah, alasan: r.alasan, status: 'menunggu' }],
    prefer: 'return=representation'
  });
  return refundDariDb(rows[0]);
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

export async function potongKomisi(uid, n) {
  return sb('rpc/potong_komisi', { method: 'POST', body: { uid, amount: n } });
}

export async function kembalikanKomisi(uid, n) {
  return sb('rpc/kembalikan_komisi', { method: 'POST', body: { uid, amount: n } });
}

export async function hitungReferral(username) {
  const rows = await sb('profiles?select=user_id&ref_by=eq.' + encodeURIComponent(username));
  return rows.length;
}

function penarikanDariDb(r) {
  return { id: r.id, userId: r.user_id, username: r.username, jumlah: r.jumlah, tujuan: r.tujuan, status: r.status, dibuat: r.dibuat, diputuskan: r.diputuskan };
}

export async function listPenarikan(uid) {
  const filter = uid ? '&user_id=eq.' + encodeURIComponent(uid) : '';
  const rows = await selectAll('withdrawals', 'dibuat.desc', filter);
  return rows.map(penarikanDariDb);
}

export async function getPenarikan(id) {
  const rows = await sb('withdrawals?select=*&id=eq.' + encodeURIComponent(id));
  return rows && rows.length ? penarikanDariDb(rows[0]) : null;
}

export async function createPenarikan(p) {
  const rows = await sb('withdrawals', {
    method: 'POST',
    body: [{ user_id: p.userId, username: p.username, jumlah: p.jumlah, tujuan: p.tujuan, status: 'menunggu' }],
    prefer: 'return=representation'
  });
  return penarikanDariDb(rows[0]);
}

export async function ubahStatusPenarikan(id, dariStatus, keStatus) {
  const rows = await sb('withdrawals?id=eq.' + encodeURIComponent(id) + '&status=eq.' + encodeURIComponent(dariStatus), {
    method: 'PATCH',
    body: { status: keStatus, diputuskan: new Date().toISOString() },
    prefer: 'return=representation'
  });
  return Array.isArray(rows) && rows.length > 0;
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
