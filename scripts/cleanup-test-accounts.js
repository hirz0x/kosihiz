/* Bersihkan akun tester sekali-pakai (HANYA email lokal-part berawalan "qa." atau "auditqd", domain
   @example.com — konvensi dua pola yang benar-benar dipakai tests/*.test.js & sesi audit sebelumnya;
   SENGAJA BUKAN "semua @example.com" supaya tidak menyapu akun lain yang kebetulan memakai domain
   itu untuk alasan lain) dan baris data yang menempel padanya (profiles, deposits, tickets, refunds,
   withdrawals, orders, saldo_log), lalu akun Auth-nya sendiri.

   GUARD SKRIP INI SENDIRI (BUKAN tests/_guard.js — skrip ini memang dibuat untuk bisa menyentuh
   project Supabase PRODUKSI, bukan cuma project testing, karena akun tester kadang bocor ke prod
   lewat alur customer biasa, lihat AUDIT_REPORT.md bagian "Invoice Paymenku sungguhan"):
     1. Wajib flag --target-prod-i-understand di command line. Tanpa ini skrip langsung berhenti,
        tidak membaca/menghubungi Supabase sama sekali.
     2. Kalau (1) terpenuhi, skrip menanyakan interaktif: ketik ulang PROJECT REF Supabase (subdomain
        di SUPABASE_URL, mis. "abcdefgh" dari https://abcdefgh.supabase.co) yang sedang aktif di
        .env.local. Salah ketik/kosong -> berhenti. Ini memastikan orang yang menjalankan skrip
        SADAR project mana yang akan disentuh, tidak cuma menekan Enter di command yang disalin dari
        riwayat/dokumentasi.
   Kedua lapis ini WAJIB lolos dulu sebelum skrip membaca daftar akun sekalipun (termasuk dry run) —
   supaya tidak ada jalan pintas "kebetulan jalan" ke project yang salah.

   DRY RUN SECARA DEFAULT SETELAH GUARD LOLOS — HANYA MELAPORKAN, TIDAK MENGHAPUS APA PUN. Tambahkan
   --confirm untuk benar-benar menghapus (tetap wajib lolos guard di atas juga).

   Opsi tambahan: --reject-deposit=<ID> menandai SATU deposit yang masih "menunggu" jadi "ditolak"
   (persis transisi yang dilakukan tombol "Tolak" admin di pages/api/deposits.js — CAS dari
   menunggu ke ditolak, tidak pernah menyentuh saldo karena saldo cuma berubah di jalur "disetujui").
   Juga dry-run kecuali --confirm disertakan.

   Jalankan:
     node scripts/cleanup-test-accounts.js --target-prod-i-understand
     node scripts/cleanup-test-accounts.js --target-prod-i-understand --confirm
     node scripts/cleanup-test-accounts.js --target-prod-i-understand --reject-deposit=DEP-xxx
     node scripts/cleanup-test-accounts.js --target-prod-i-understand --reject-deposit=DEP-xxx --confirm
     (keduanya boleh digabung dalam satu pemanggilan) */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const POLA_EMAIL_TES = /^(qa\.[^@]*|auditqd[^@]*)@example\.com$/i;
const TABEL_ANAK = ['deposits', 'tickets', 'refunds', 'withdrawals', 'orders'];

function argFlag(nama) {
  return process.argv.includes('--' + nama);
}
function argNilai(nama) {
  const p = process.argv.find((a) => a.startsWith('--' + nama + '='));
  return p ? p.slice(nama.length + 3) : null;
}

function bacaEnvLocal() {
  const file = path.join(__dirname, '..', '.env.local');
  const txt = fs.readFileSync(file, 'utf8');
  const env = {};
  for (const line of txt.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

function ambilProjectRef(supabaseUrl) {
  const m = String(supabaseUrl || '').match(/^https?:\/\/([a-z0-9-]+)\.supabase\.co/i);
  return m ? m[1] : null;
}

function tanya(pertanyaan) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(pertanyaan, (jawaban) => { rl.close(); resolve(jawaban); });
  });
}

/* Guard skrip ini sendiri — lihat komentar di atas file. Berhenti total (process.exit(1)) kalau
   salah satu lapis tidak lolos. */
async function pastikanTargetDisadari(env) {
  if (!argFlag('target-prod-i-understand')) {
    console.error('\nDIHENTIKAN: skrip ini butuh flag --target-prod-i-understand.');
    console.error('Skrip ini bisa menyentuh project Supabase PRODUKSI (bukan cuma testing) — flag');
    console.error('ini memastikan kamu sengaja menjalankannya, bukan tidak sadar.');
    process.exit(1);
  }
  const ref = ambilProjectRef(env.SUPABASE_URL);
  if (!ref) {
    console.error('\nDIHENTIKAN: tidak bisa membaca project ref dari SUPABASE_URL di .env.local (' + (env.SUPABASE_URL || '(kosong)') + ').');
    process.exit(1);
  }
  console.log('\nProject Supabase yang AKAN disentuh: ' + ref + ' (' + env.SUPABASE_URL + ')');
  const jawaban = await tanya('Ketik ulang project ref di atas ("' + ref + '") untuk konfirmasi: ');
  if (jawaban.trim() !== ref) {
    console.error('\nDIHENTIKAN: project ref yang diketik tidak cocok. Tidak ada yang disentuh.');
    process.exit(1);
  }
}

async function sb(env, p, opts = {}) {
  const r = await fetch(env.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/' + p, {
    method: opts.method || 'GET',
    headers: {
      apikey: env.SUPABASE_SECRET_KEY,
      Authorization: 'Bearer ' + env.SUPABASE_SECRET_KEY,
      'Content-Type': 'application/json',
      ...(opts.prefer ? { Prefer: opts.prefer } : {})
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined
  });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* bukan JSON */ }
  if (!r.ok) throw new Error('Supabase ' + r.status + ': ' + ((data && data.message) || text.slice(0, 300)));
  return data;
}

async function daftarAkunTes(env) {
  const url = env.SUPABASE_URL.replace(/\/$/, '');
  const hasil = [];
  for (let page = 1; page <= 50; page++) {
    const r = await fetch(url + '/auth/v1/admin/users?page=' + page + '&per_page=1000', {
      headers: { apikey: env.SUPABASE_SECRET_KEY, Authorization: 'Bearer ' + env.SUPABASE_SECRET_KEY }
    });
    if (!r.ok) throw new Error('Gagal memuat daftar user Auth: ' + r.status + ' ' + (await r.text()).slice(0, 300));
    const data = await r.json();
    const users = (data && data.users) || [];
    for (const u of users) {
      if (POLA_EMAIL_TES.test(String(u.email || ''))) hasil.push({ id: u.id, email: u.email });
    }
    if (users.length < 1000) break;
  }
  return hasil;
}

async function hitungBarisAnak(env, uid) {
  const jumlah = {};
  for (const tabel of TABEL_ANAK) {
    const rows = await sb(env, tabel + '?user_id=eq.' + encodeURIComponent(uid) + '&select=id');
    jumlah[tabel] = Array.isArray(rows) ? rows.length : 0;
  }
  const saldoLog = await sb(env, 'saldo_log?uid=eq.' + encodeURIComponent(uid) + '&select=ref_id');
  jumlah.saldo_log = Array.isArray(saldoLog) ? saldoLog.length : 0;
  const profil = await sb(env, 'profiles?user_id=eq.' + encodeURIComponent(uid) + '&select=user_id');
  jumlah.profiles = Array.isArray(profil) ? profil.length : 0;
  return jumlah;
}

async function hapusAkunDanBarisnya(env, uid) {
  for (const tabel of TABEL_ANAK) {
    await sb(env, tabel + '?user_id=eq.' + encodeURIComponent(uid), { method: 'DELETE', prefer: 'return=minimal' });
  }
  await sb(env, 'saldo_log?uid=eq.' + encodeURIComponent(uid), { method: 'DELETE', prefer: 'return=minimal' });
  await sb(env, 'profiles?user_id=eq.' + encodeURIComponent(uid), { method: 'DELETE', prefer: 'return=minimal' });
  const url = env.SUPABASE_URL.replace(/\/$/, '');
  const r = await fetch(url + '/auth/v1/admin/users/' + encodeURIComponent(uid), {
    method: 'DELETE',
    headers: { apikey: env.SUPABASE_SECRET_KEY, Authorization: 'Bearer ' + env.SUPABASE_SECRET_KEY }
  });
  if (!r.ok) throw new Error('Gagal menghapus akun Auth ' + uid + ': ' + r.status + ' ' + (await r.text()).slice(0, 300));
}

async function prosesRejectDeposit(env, id, konfirmasi) {
  console.log('\n=== --reject-deposit=' + id + ' ===');
  const rows = await sb(env, 'deposits?id=eq.' + encodeURIComponent(id));
  const d = Array.isArray(rows) ? rows[0] : null;
  if (!d) { console.log('  Deposit ' + id + ' tidak ditemukan — tidak ada yang diubah.'); return; }
  console.log('  Status saat ini: ' + d.status + ' | user_id=' + d.user_id + ' | nominal=' + d.nominal);
  if (d.status !== 'menunggu') { console.log('  Sudah diproses sebelumnya (bukan "menunggu") — tidak diubah.'); return; }
  if (!konfirmasi) { console.log('  [DRY RUN] AKAN diubah ke status="ditolak". Tambahkan --confirm untuk benar-benar mengubah.'); return; }
  const hasil = await sb(env, 'deposits?id=eq.' + encodeURIComponent(id) + '&status=eq.menunggu', {
    method: 'PATCH',
    body: { status: 'ditolak', diputuskan: new Date().toISOString() },
    prefer: 'return=representation'
  });
  if (Array.isArray(hasil) && hasil.length === 1) console.log('  Diubah jadi "ditolak".');
  else console.log('  Tidak ada baris yang berubah (kemungkinan sudah diproses oleh proses lain tepat sebelum ini).');
}

(async () => {
  const env = bacaEnvLocal();
  await pastikanTargetDisadari(env);
  const konfirmasi = argFlag('confirm');
  const rejectId = argNilai('reject-deposit');

  if (rejectId) await prosesRejectDeposit(env, rejectId, konfirmasi);

  console.log('\n=== Akun tester (email lokal-part "qa.*" atau "auditqd*", domain @example.com) ===');
  const akun = await daftarAkunTes(env);
  if (akun.length === 0) { console.log('Tidak ada akun tester ditemukan.'); return; }

  let totalBaris = 0;
  const laporan = [];
  for (const a of akun) {
    const jumlah = await hitungBarisAnak(env, a.id);
    const total = Object.values(jumlah).reduce((s, n) => s + n, 0);
    totalBaris += total;
    laporan.push({ ...a, jumlah, total });
    console.log(
      '  ' + a.email + ' (uid=' + a.id + ') — ' +
      Object.entries(jumlah).filter(([, n]) => n > 0).map(([t, n]) => t + ':' + n).join(', ') +
      (total === 0 ? ' (tidak ada baris data lain)' : '')
    );
  }
  console.log('\nTotal: ' + akun.length + ' akun tester, ' + totalBaris + ' baris data terkait.');

  if (!konfirmasi) {
    console.log('\n[DRY RUN] TIDAK ADA yang dihapus. Jalankan ulang dengan --confirm untuk benar-benar menghapus.');
    return;
  }

  console.log('\n--confirm terdeteksi — menghapus...');
  for (const a of laporan) {
    await hapusAkunDanBarisnya(env, a.id);
    console.log('  Dihapus: ' + a.email + ' (uid=' + a.id + ')');
  }
  console.log('\nSelesai. ' + laporan.length + ' akun tester + baris data terkait dihapus.');
})().catch((e) => { console.error('BERHENTI PAKSA:', e.message); process.exit(1); });
