# Audit keamanan & kualitas kode — Admin & seluruh app

Dikerjakan di branch `audit/admin`. Mode: baca dulu, perbaiki yang aman (Critical/High yang tidak
mengubah perilaku bisnis), laporkan yang butuh keputusan. Tidak ada data akun asli yang diubah —
semua pengujian pakai akun tester sekali pakai (`qa.*@example.com`), dibersihkan lagi setelah dipakai
untuk tes saldo/deposit sintetis.

**Catatan jujur soal proses**: rencana awal memecah audit ini ke 4 sub-agent paralel (otorisasi admin,
saldo/webhook, IDOR/injection/secrets, header/kualitas kode). Keempatnya gagal di awal karena kena
rate limit sesi. Daripada menjalankan ulang (risiko kena limit sama lagi), seluruh cakupan di bawah
saya kerjakan sendiri secara langsung — baca kode + uji runtime nyata, bukan ringkasan dari agent lain.

## Ringkasan

Dari seluruh area yang diperiksa, mayoritas sudah diimplementasikan dengan benar — saldo/pembayaran
atomik di level database (dibuktikan dengan tes race-condition sungguhan, bukan cuma baca kode),
otorisasi admin ditegakkan di server (SSR + tiap API, diuji dengan request nyata tanpa login & dari
user biasa), IDOR dicegah konsisten, tidak ada secret bocor ke client atau git history, RLS aktif
tanpa policy di 11/11 tabel (diuji empiris pakai kunci anon sungguhan — nol akses baca/tulis).
**Tidak ditemukan temuan Critical.** 2 temuan High: satu bersifat operasional (kunci Paymenku live
di `.env.local`, bukan bug kode, tidak saya ubah), satu lagi bug kode nyata (webhook belum
mencocokkan nominal/reference_id sebelum kredit) — **sudah diperbaiki & diuji otomatis**. Beberapa
temuan Medium/Low dicatat, sebagian diperbaiki langsung (duplikasi kode, fail-closed webhook, batas
markup — semua tidak mengubah perilaku bisnis yang sah), sisanya butuh keputusan karena mengubah
perilaku/arsitektur (lihat RLS-02 soal REVOKE fungsi RPC, PERF-01 soal query admin tanpa limit).

## Tabel temuan

| ID | Severity | Lokasi | Deskripsi | Dampak | Status |
|---|---|---|---|---|---|
| WEBHOOK-04 | **High** | `.env.local` — `PAYMENKU_API_KEY` | Kunci Paymenku yang terpasang adalah kunci **LIVE** (`sk_live_...`), bukan sandbox, walau komentar di file menyebut "sandbox" | Kalau environment ini pernah memproses transaksi, itu transaksi uang sungguhan, bukan simulasi. **Terbukti pernah terjadi — lihat bagian "Invoice sungguhan yang pernah tercipta" di bawah** | **Perlu keputusan** — bukan bug kode, saya tidak mengubah file `.env.local`. Mohon cek & ganti ke `sk_test_...` kalau memang untuk development |
| WEBHOOK-03 | Medium | `pages/api/paymenku/webhook.js` | Verifikasi signature HMAC webhook dulu dilewati (fail-open) kalau `PAYMENKU_WEBHOOK_SECRET` kosong | Webhook bisa dipicu siapa saja yang tahu/menebak reference_id selama secret belum di-setup | **Diperbaiki** — fail-closed: webhook sekarang menolak (401) SEMUA request kalau secret belum diisi, bukan melewati verifikasi. `PAYMENKU_WEBHOOK_SECRET` sendiri masih belum diisi di `.env.local` (perlu diambil dari dashboard Paymenku) — sampai diisi, endpoint ini menolak semua webhook, bukan merusak apa pun |
| WEBHOOK-05 | High | `lib/paymenku-kredit.js` | Status webhook dicek ulang ke API Paymenku (sudah ada sebelumnya), TAPI nominal & reference_id dari balasan Paymenku tidak pernah dicocokkan ke data deposit sendiri sebelum kredit | Kalau `trx_id` nyasar ke transaksi lain (reference_id tertukar/bug provider) tapi statusnya "paid", saldo bisa salah dikredit | **Diperbaiki** — nominal (lewat `jumlahBayar()`) dan `reference_id` sekarang WAJIB cocok persis sebelum kredit jalan; kalau tidak cocok atau transaksi tidak ditemukan, ditolak & dicatat ke `console.error`. Diuji otomatis di `tests/webhook-security.test.js` |
| PERF-01 | Medium | `pages/api/pengguna.js` → `lib/store.js: getOrders()` | Halaman admin "Pengguna" menarik SEMUA baris tabel `orders` (tanpa filter/limit) tiap kali dibuka, cuma untuk menghitung jumlah+total belanja per user | Akan makin lambat seiring tabel orders membesar tanpa batas (saat ini ribuan baris, masih OK) | **Perlu keputusan** — opsi: agregat lewat view/RPC Postgres, atau cache berkala. Mengubah arsitektur, bukan perbaikan kecil |
| CODE-01 | Low | `pages/api/{invoice,pengguna,riwayat,statistik,tickets}.js` | Fungsi format tanggal/waktu WIB diimplementasikan ulang terpisah di 5 file, sebagian tanpa penjaga tanggal tidak valid | Risiko rendah — kalau ada bug di satu, 4 lainnya tidak otomatis ikut benar | **Diperbaiki** — disatukan ke `lib/waktu.js` |
| CODE-02 | Low | `components/sosmedgo/AdminPage.jsx` | Punya `ambilJson()` sendiri, duplikat dari versi di `DashboardPage.jsx` yang sudah diperbaiki sesi sebelumnya (logging per-percobaan retry + pesan error spesifik timeout/401/500) | Admin tidak dapat perbaikan observability yang sama seperti dashboard pelanggan | **Opsional** — belum dikerjakan, file admin besar (1023 baris), risiko regresi untuk perbaikan non-critical |
| DANGER-03 | Low | `pages/api/services.js` (PATCH markup) | Markup % tidak punya batas atas, cuma dijamin ≥0 | Admin salah ketik bisa set markup ekstrem (langsung kelihatan di UI, bisa dikoreksi) | **Diperbaiki** — batas 0-500% (nilai dipilih kamu), ditolak 400 di server dengan pesan jelas kalau di luar batas, `max="500"` di input UI. Diuji di `tests/markup-bounds.test.js` |
| RLS-02 | Medium | `supabase/schema.sql` — fungsi `add_saldo`, `potong_saldo`, `add_komisi`, `potong_komisi`, `kembalikan_komisi`, `pindah_komisi_ke_saldo` | 6 dari 11 fungsi RPC yang menyentuh saldo/komisi TIDAK punya `REVOKE ... FROM anon, authenticated` eksplisit, beda dari 5 fungsi lain (`add_saldo_aman`, `tambah_pesan_tiket`, `rl_tick`, `rl_gagal`, `waktu_per_layanan`) yang sudah di-revoke | **Diuji empiris langsung pakai `SUPABASE_ANON_KEY` sungguhan** (lihat bagian RLS di bawah): keenamnya BISA dipanggil anon (HTTP 200, bukan permission denied) tapi hasilnya selalu `null` — RLS di tabel `profiles` (aktif, nol policy) menahan `UPDATE`-nya dari dalam, walau fungsinya sendiri tidak ditolak. **Tidak tereksploitasi saat ini** (diverifikasi dengan akun tester sungguhan yang punya saldo 5.000 — saldo TIDAK berubah), tapi ini pertahanan berlapis yang hilang, bukan sesuatu yang seharusnya diandalkan terus | **Migrasi disiapkan, BELUM dijalankan ke database** — `supabase/lock-rpc-execute.sql` (baru, tidak mengedit `schema.sql`/`fix-security.sql` lama). Lihat bagian "RLS-02: migrasi REVOKE RPC" di bawah untuk isi, bukti grep pemanggil, tes otomatis, dan urutan deploy |
| CODE-03 | Info | `DashboardPage.jsx` (1874 baris), `AdminPage.jsx` (1023 baris) | File terbesar di repo | Belum ada masalah fungsional, akan makin sulit dirawat kalau terus bertambah | **Tidak diubah** — refactor struktural besar, di luar scope audit ini |

### Yang sudah diperiksa dan TERBUKTI AMAN (bukan cuma "tidak ditemukan masalah" — dibuktikan aktif)

| Area | Bukti |
|---|---|
| **Otorisasi admin SSR** | `pages/admin.js` cek `isAdmin()` di `getServerSideProps`, redirect 307 SEBELUM HTML terkirim. Diverifikasi: `curl /admin` tanpa cookie → 307 ke `/admin/login` |
| **Otorisasi admin API** | 16 endpoint admin-mutating diuji runtime sungguhan (`tests/admin-authz.test.js`): tanpa login DAN dengan user biasa, **32/32 percobaan ditolak 401** |
| **Mass-assignment role** | Tidak ada kolom "role" di tabel user sama sekali — status admin dari env var + cookie HMAC terpisah (`lib/auth.js`), bukan data yang bisa di-PATCH. `/api/preferensi.js` pakai whitelist field eksplisit per field, bukan spread objek mentah |
| **Race condition saldo** | `tests/saldo-race.test.js`: 2× `potong_saldo` bersamaan pada saldo pas-pasan untuk 1 transaksi → **tepat satu yang lolos**, saldo akhir tepat seperti seharusnya (bukan dua-duanya lolos jadi minus, bukan dua-duanya gagal) |
| **Idempotensi kredit deposit/webhook** | `tests/webhook-idempotency.test.js`: 2 "webhook" bersamaan untuk deposit yang sama → **tepat satu yang menang CAS**, saldo cuma nambah sekali |
| **Refund otomatis kalau order gagal di provider** | Saldo yang sudah terpotong dikembalikan otomatis (`addSaldoAman` dengan ref_id unik); kalau refund itu sendiri gagal, pesan ke pelanggan eksplisit "hubungi admin", tidak diam-diam hilang (`lib/pesanan.js`) |
| **Verifikasi status webhook** | Isi notifikasi webhook TIDAK dipercaya langsung — status selalu dicek ulang ke API Paymenku sebelum kredit (`lib/paymenku-kredit.js`) |
| **IDOR tiket & invoice** | Diuji 2 akun tester nyata: user B tidak bisa lihat (list), balas (PATCH→404), atau tandai-baca tiket user A; tidak bisa lihat invoice user A (404) |
| **Validasi input aksi admin** | Nominal deposit manual & markup: `Number.isFinite()` + `>0`/`Math.max(0,...)` eksplisit di API (bukan cuma di UI) |
| **Konfirmasi aksi destruktif** | Semua aksi massal (markup massal, aktif/nonaktifkan massal, hapus riwayat, undi pemenang, refund) lewat `tanyaKonfirmasi()` dengan pesan spesifik sebelum eksekusi |
| **Audit log** | `catatAktivitas()` terpasang di: login admin, deposit manual, approve/tolak deposit, refund, tutup tiket, sinkron katalog, hapus riwayat |
| **Secret tidak bocor ke client** | Nol `NEXT_PUBLIC_*` di seluruh kode; `SUPABASE_SECRET_KEY` cuma dipakai di `lib/` (server-only); dicek langsung ke bundle client hasil build (`.next/static/`) — nol kecocokan |
| **Error tidak bocor ke pelanggan** | Pesan error customer selalu generik; detail (`e.message`) cuma dikirim kalau request dari admin. Nol `.stack` dikirim ke response di seluruh `pages/api` + `lib` |
| **SSRF** | `callProvider()` selalu fetch ke URL TETAP dari whitelist provider, bukan dari input user; parameter diteruskan lewat whitelist nama field per action |
| **Upload file** | Validasi tipe MIME whitelist + batas ukuran sebelum diterima (artikel & lampiran tiket) |
| **Secrets di git history** | `git log --all` ke path `.env*` → nol hasil. Pola key/secret (`sk_live_`, `sb_secret_`, dll) di seluruh diff history → nol hasil |
| **CORS** | Nol header CORS di mana pun — default same-origin Next.js, tidak ada wildcard |
| **Header keamanan** | CSP, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy terpasang di `next.config.js` (dari audit sesi sebelumnya, dikonfirmasi ulang) |
| **Rate limit** | Login admin (per-IP + global, delay 800ms di gagal), registrasi (terbukti aktif — saya sendiri kena saat membuat akun tester berkali-kali) |
| **Admin UI responsif** | 13 tab × 4 viewport (1920×1080/1366×768/412×915/375×812) × 2 tema diuji otomatis — nol overflow-x. Drawer mobile berfungsi (hamburger, tiap tab diklik sungguhan). Tabel data-padat (Layanan, 11 kolom) discroll horizontal di dalam card-nya sendiri di mobile, bukan overflow halaman |
| **Dependency tidak terpakai** | Nol — `next`/`react`/`react-dom`/`lucide-react` semua terpakai |

## Audit RLS & policy — semua tabel Supabase (`supabase/*.sql`)

3 file SQL di repo: `supabase/schema.sql` (367 baris, definisi tabel+fungsi), `supabase/rls.sql`
(aktifkan RLS untuk 9 tabel), `supabase/fix-security.sql` (kunci `search_path` 6 fungsi, mencegah
privilege-escalation lewat search_path hijacking — sudah benar, tidak diubah).

**Tidak ada `CREATE POLICY` sama sekali di file manapun.** Di Postgres/Supabase, RLS aktif + nol
policy = DENY ALL untuk `anon`/`authenticated`, akses penuh cuma untuk `service_role` (dipakai
`lib/store.js` lewat `SUPABASE_SECRET_KEY`, dicek sebelumnya tidak pernah ada di client bundle).
Ini **diverifikasi empiris langsung pakai `SUPABASE_ANON_KEY` sungguhan** dari `.env.local`, bukan
cuma dibaca dari SQL:

| Tabel | RLS aktif? | Policy | SELECT pakai `anon` (diuji sungguhan) |
|---|---|---|---|
| `profiles` | Ya | Nol | `[]` — kosong, termasuk saat ditarget ke akun yang beneran ada |
| `orders` | Ya | Nol | `[]` |
| `settings` | Ya | Nol | `[]` |
| `deposits` | Ya | Nol | `[]` |
| `tickets` | Ya | Nol | `[]` |
| `refunds` | Ya | Nol | `[]` |
| `withdrawals` | Ya | Nol | `[]` |
| `riwayat_layanan` | Ya | Nol | `[]` |
| `services` | Ya | Nol | `[]` |
| `admin_log` | Ya | Nol | `[]` |
| `saldo_log` | Ya | Nol | `[]` |

**Kesimpulan: `anon` TIDAK bisa baca atau tulis apa pun lewat SELECT/INSERT/UPDATE/DELETE langsung
ke tabel manapun** — nol tabel yang "anon bisa baca/tulis".

**Tapi** — fungsi RPC beda mekanisme dari akses tabel langsung (`EXECUTE` privilege, defaultnya
diberikan ke `PUBLIC` oleh Postgres kecuali di-revoke eksplisit). Dicek SATU PER SATU, 5 dari 11
fungsi SUDAH punya `revoke ... from public, anon, authenticated` (fail langsung dengan
`permission denied`, dikonfirmasi: `add_saldo_aman` → 401 `permission denied for function`), tapi
**6 fungsi lain belum** — lihat RLS-02 di tabel temuan di atas. Diuji empiris: anon BISA memanggil
`potong_saldo`/`add_saldo`/`add_komisi`/`potong_komisi`/`kembalikan_komisi`/`pindah_komisi_ke_saldo`
(HTTP 200, bukan ditolak), tapi hasilnya `null` karena `UPDATE` di dalamnya tunduk RLS pemanggil
(fungsi-fungsi ini tidak dideklarasikan `SECURITY DEFINER`, jadi defaultnya `SECURITY INVOKER`).
Diuji ulang pakai akun tester SUNGGUHAN dengan saldo 5.000, target `potong_saldo` lewat anon key,
amount 1.000 — saldo tetap 5.000 sesudahnya (dicek pakai service key secara terpisah). **Tidak ada
kebocoran data atau uang yang tereksploitasi hari ini**, tapi lapis pertahanan ini sebaiknya
ditutup juga (rekomendasi REVOKE eksplisit, tidak saya terapkan sesuai instruksi "jangan ubah policy").

Tidak saya ubah satu baris SQL/policy pun — semua di atas murni laporan (bagian ini). Lanjutan
kerja untuk RLS-02 (migrasi + tes) ada di bagian berikut, dikerjakan di sesi lanjutan setelah
laporan di atas selesai.

## RLS-02: migrasi REVOKE RPC (lanjutan — belum dijalankan ke database)

**Langkah 1 — grep semua pemanggil `rpc/...` di kode aplikasi (bukan di tes) sebelum menyentuh
privilege apa pun**, sesuai instruksi "laporkan dulu, jangan revoke kalau ada pemanggil anon/
authenticated tanpa konfirmasi":

- Aplikasi memanggil RPC Supabase lewat REST (`fetch .../rest/v1/rpc/<nama>`), BUKAN lewat SDK
  `supabase-js` (`.rpc(...)`) — proyek ini tidak memakai `supabase-js` sama sekali. Jadi yang
  digrep adalah pola `'rpc/<nama>'` dan `createClient`/pemakai `SUPABASE_ANON_KEY`/
  `NEXT_PUBLIC_SUPABASE*`.
- **Satu-satunya titik yang memanggil RPC dari kode aplikasi**: fungsi `sb()` di `lib/store.js`
  (baris 13-27) — semua 11 fungsi RPC (`add_saldo`, `potong_saldo`, `add_komisi`, `potong_komisi`*,
  `kembalikan_komisi`*, `pindah_komisi_ke_saldo`, `add_saldo_aman`, `tambah_pesan_tiket`, `rl_tick`,
  `rl_gagal`, `waktu_per_layanan`) dipanggil lewat `sb('rpc/<nama>', ...)`, dan `sb()` **selalu**
  memakai `SUPABASE_SECRET_KEY` (service_role) dari `process.env` — tidak ada parameter atau jalur
  lain untuk memakai kunci anon/authenticated. Dipanggil dari `pages/api/*` (server-side saja).
  (*`potong_komisi` dan `kembalikan_komisi` didefinisikan di `schema.sql` tapi **tidak dipanggil di
  mana pun** di kode aplikasi saat ini — fungsi "mati" dari sisi pemanggil, kemungkinan disiapkan
  untuk fitur penarikan komisi yang belum/tidak dipakai jalurnya. Tidak masalah untuk tetap
  direvoke — malah lebih aman karena memang tidak ada yang perlu memanggilnya dari luar
  service_role.)
- `NEXT_PUBLIC_SUPABASE*`: nol hasil di seluruh repo (dikonfirmasi ulang audit sebelumnya) —
  `SUPABASE_ANON_KEY` cuma dipakai di `middleware.js`/`lib/account.js`/`lib/storage.js` untuk alur
  Supabase Auth (login/sesi), BUKAN untuk panggilan RPC apa pun.
- **Kesimpulan: tidak ada pemanggil produksi yang memakai client anon/authenticated untuk RPC apa
  pun.** Aman menambahkan REVOKE ke seluruh 11 fungsi tanpa menunggu konfirmasi tambahan (tidak
  ada "fungsi yang dipanggil anon" yang perlu dikecualikan).

**Langkah 2 — migrasi baru**: `supabase/lock-rpc-execute.sql`. Isinya:
1. `revoke all ... from public, anon, authenticated` + `grant execute ... to service_role` untuk
   SEMUA 11 fungsi RPC sensitif (6 yang belum pernah direvoke + 5 yang sudah direvoke di
   `schema.sql`, di-ulang di sini juga supaya file migrasi ini berdiri sendiri/idempoten, tidak
   diam-diam bergantung urutan dengan `schema.sql`).
2. `alter default privileges in schema public revoke execute on functions from public, anon, authenticated` —
   fungsi RPC baru yang dibuat setelah ini TIDAK otomatis terbuka ke PUBLIC/anon/authenticated lagi.
3. `alter function ... set search_path = public` untuk 5 fungsi yang belum dikunci
   `fix-security.sql` (`add_saldo_aman`, `tambah_pesan_tiket`, `rl_tick`, `rl_gagal`,
   `waktu_per_layanan`) — defense-in-depth yang sama alasannya dengan `fix-security.sql`, walau
   kesebelas fungsi ini **bukan** `SECURITY DEFINER` (jadi search_path hijacking tidak berdampak
   privilege-escalation hari ini, cuma mengunci kalau nanti berubah jadi DEFINER tanpa sadar
   menambahkan search_path).
   
   Tidak satu baris pun di `supabase/schema.sql`, `fix-security.sql`, atau `rls.sql` yang diedit —
   semuanya murni di file baru ini, sesuai instruksi.

**Langkah 3 — tes otomatis**: `tests/rpc-privileges.test.js` (baru, masuk ke `npm run test:security`
lewat script `test:rpc-privileges`). Memanggil seluruh 11 fungsi lewat `SUPABASE_ANON_KEY`
(harus ditolak "permission denied") dan lewat `SUPABASE_SECRET_KEY` (harus tetap jalan normal,
round-trip saldo/komisi/rate-limit/tiket dikembalikan ke nilai semula di akhir, tidak pernah
menyentuh akun asli). **Dijalankan SEBELUM migrasi**, hasilnya sesuai ekspektasi:

```
5/11 fungsi sudah menolak anon.   (5 yang sudah lama direvoke di schema.sql)
6 TES GAGAL                        (6 fungsi RLS-02 yang migrasinya belum dijalankan)
service_role: SEMUA 9 pengecekan alur normal LOLOS
```

Ini pembuktian langsung temuan RLS-02 sebelum diperbaiki, sekaligus bukti migrasinya tidak
mematahkan alur normal (bagian service_role lolos semua, termasuk `tambah_pesan_tiket` yang
sebelumnya tidak ada tes otomatisnya sama sekali). **Setelah migrasi dijalankan, jalankan ulang
`npm run test:rpc-privileges` — seharusnya jadi 11/11 fungsi menolak anon.**

**Migrasi ini TIDAK dijalankan ke database** sesuai instruksi — lihat "Urutan deploy" di bawah.

## Webhook: anti-replay timestamp + rate limit per IP (lanjutan)

Dua lapis tambahan di `pages/api/paymenku/webhook.js`, di atas signature HMAC + verifikasi ulang
status/nominal/reference_id ke API Paymenku yang sudah ada:

- **Anti-replay timestamp** (`timestampFresh()`): menolak (401) kalau `X-PaymenKu-Timestamp` lebih
  dari 5 menit di masa lalu atau masa depan dari waktu server — mencegah permintaan lama yang
  signature-nya sendiri sah (misalnya hasil sadap jaringan) dipakai ulang belakangan. Mendukung
  timestamp dalam unix seconds maupun milliseconds.

  **Header/field yang dipakai — dikonfirmasi langsung dari docs.paymenku.com/events/webhooks**
  (bukan asumsi): header signature `X-PaymenKu-Signature`, header timestamp `X-PaymenKu-Timestamp`
  ("Unix timestamp saat dikirim"), rumus `signature = HMAC-SHA256(timestamp + "." + raw_body, webhook_secret)`.
  Tidak ada field timestamp di body JSON webhook (cuma `paid_at`/`created_at`, itu waktu transaksi,
  bukan waktu kirim notifikasi) — jadi satu-satunya sumber timestamp memang header ini.
  **Karena timestamp ikut ditandatangani (bagian dari string yang di-HMAC), timestamp ini WAJIB
  ada di setiap webhook ASLI dari Paymenku** — tanpanya signature tidak mungkin valid. Jadi kalau
  timestamp tidak ada/kosong, permintaan SUDAH ditolak lebih dulu di pengecekan signature (401),
  sebelum sampai ke `timestampFresh()` — tidak perlu (dan tidak aman) membuat `timestampFresh()`
  "melewatkan dengan aman" kasus timestamp hilang, karena untuk webhook Paymenku yang sah kasus itu
  memang mustahil terjadi; kalau DIBUAT melewatkan, itu justru celah (penyerang bisa sengaja
  menghapus header timestamp buat lolos dari pengecekan replay — tapi tetap akan ditolak di
  signature). Dokumentasi tidak menyebut unit timestampnya (unix seconds vs milliseconds) —
  `timestampFresh()` mendukung dua-duanya sekaligus (deteksi dari panjang digit).
- **Rate limit per IP** (`bolehCoba('paymenku_webhook_ip:' + ip, 60, 60_000)`, pakai mekanisme
  atomic `rl_tick` yang sama dengan limiter login/registrasi) — maksimal 60 permintaan/menit per
  IP, dicek PALING AWAL (sebelum baca body/signature) supaya tidak bisa dipakai menebak
  reference_id/signature bertubi-tubi. Dikonfirmasi lewat tes HTTP sungguhan
  (`tests/webhook-security.test.js`): 61 permintaan cepat dari 1 IP palsu → permintaan ke-61
  dibalas 429, 60 sebelumnya 401 (ditolak signature, **tidak pernah diproses/menyentuh Paymenku**).

  **IP diambil dari mana** — diperbaiki di `ambilIp()` (`lib/loginGuard.js`, dipakai bersama oleh
  login/registrasi/webhook), urutan kepercayaan:
  1. `X-Vercel-Forwarded-For` — di-set oleh infrastruktur Vercel sendiri, TIDAK BISA dipalsukan
     klien (Vercel selalu menimpanya). Dipakai duluan kalau aplikasi jalan di Vercel.
  2. `X-Real-IP` — umum di-set reverse proxy (nginx dkk) di hosting non-Vercel.
  3. `X-Forwarded-For` (entri pertama) — FALLBACK PALING TIDAK DIPERCAYA: kalau tidak di belakang
     proxy yang menimpa header ini, klien bisa mengirim header ini sendiri dan meniru IP apa pun.
     Sebelumnya ini SATU-SATUNYA header yang dipakai (celah yang diperbaiki sesi ini) — sekarang
     cuma fallback terakhir sebelum (4).
  4. `req.socket.remoteAddress` — IP koneksi TCP langsung.

  **Kalau IP tidak terbaca sama sekali** (keempatnya kosong — jarang, tapi bisa di lingkungan
  non-standar): `ambilIp()` mengembalikan `'tidak-diketahui'`, dan SEMUA request dengan IP tidak
  terbaca berbagi SATU kunci rate-limit yang sama (`paymenku_webhook_ip:tidak-diketahui`). Ini
  TIDAK membuka celah "lewat rate limit sepenuhnya" — tetap dibatasi 60/menit, cuma dibagi rata ke
  satu ember bersama (bukan fail-open/skip limiter). Dipilih begini karena rate limit cuma lapis
  pertahanan TAMBAHAN: signature HMAC + verifikasi ulang status/nominal/reference_id ke API
  Paymenku tetap jadi penghalang utama terlepas dari apakah IP pemanggil berhasil diidentifikasi.

Keduanya diuji di `tests/webhook-security.test.js` (bagian "Timestamp webhook" dan "Rate limit per
IP") — sudah dijalankan dan lolos semua, lihat "Cara menjalankan tes" di bawah.

## Guard keamanan tes + pembersihan akun tester (lanjutan)

**Catatan: bagian ini mendeskripsikan state di sesi SEBELUM "Guard cleanup-test-accounts &
pemisahan env tes" di bawah — dipertahankan sebagai riwayat.** Sejak bagian itu:
`scripts/cleanup-test-accounts.js` sudah TIDAK memakai `pastikanAmanUntukTes()`/
`TEST_ALLOWED_SUPABASE_URL` lagi (punya guard sendiri), dan `tests/_guard.js` membaca
`.env.test.local`, bukan `.env.local` seperti disebut di bawah.

**`tests/_guard.js`** (baru) — dipanggil di baris paling awal SEMUA `tests/*.test.js` (sebelum
request/panggilan apa pun), menolak (`process.exit(1)`) jalan kalau:
1. `TEST_ALLOWED_SUPABASE_URL` belum diisi di `.env.local`, atau `SUPABASE_URL` yang aktif tidak
   ada di daftar itu (dipisah koma kalau lebih dari satu) — mencegah tes ini (yang bikin/hapus
   akun & baris data) diam-diam jalan ke project Supabase PRODUKSI.
2. `PAYMENKU_API_KEY` berawalan `sk_live_` — kunci LIVE (lihat WEBHOOK-04). Tes-tes ini sudah
   dijaga supaya tidak pernah memanggil API Paymenku sungguhan, tapi guard ini lapis tambahan:
   kalau kuncinya live, berhenti total, jangan andalkan cuma penjaga di masing-masing tes.

**Status saat ini (terverifikasi langsung)**: `.env.local` proyek ini BELUM mengisi
`TEST_ALLOWED_SUPABASE_URL`, jadi **SEMUA tes di folder `tests/` sekarang menolak jalan** —
dijalankan `node tests/admin-authz.test.js` secara terpisah (bukan lewat `npm run test:security`,
sesuai instruksi "jangan jalankan test:security/test:rpc-privileges sampai guard aktif") untuk
memverifikasi guard-nya sendiri bekerja:
```
DIHENTIKAN: TEST_ALLOWED_SUPABASE_URL belum diisi di .env.local.
...
EXIT CODE: 1
```
Ini **disengaja** — guard ini justru dibuat supaya tidak ada yang bisa menjalankan tes keamanan ke
Supabase yang sedang terpasang sekarang (yang juga punya `PAYMENKU_API_KEY` live) tanpa secara
sadar menyiapkan project Supabase testing dulu. **Untuk mengaktifkan kembali seluruh
`npm run test:security`**, siapkan project Supabase testing (schema sama, boleh kosong datanya),
isi `TEST_ALLOWED_SUPABASE_URL` di `.env.local` dengan URL-nya, dan pastikan `PAYMENKU_API_KEY`
tidak berawalan `sk_live_` (boleh kosong kalau cuma mau tes yang tidak menyentuh Paymenku).

**`scripts/cleanup-test-accounts.js`** (baru) — membersihkan akun tester sekali-pakai (email
berakhiran `@example.com`, konvensi yang dipakai semua `tests/*.test.js`) beserta baris data yang
menempel (`profiles`, `deposits`, `tickets`, `refunds`, `withdrawals`, `orders`, `saldo_log`), lalu
akun Auth-nya sendiri. **DRY RUN secara default** — cuma melaporkan, tidak menghapus apa pun,
sampai dijalankan ulang dengan `--confirm`. Juga menerima `--reject-deposit=<ID>` untuk menandai
satu deposit `menunggu` jadi `ditolak` (transisi CAS yang sama dengan tombol "Tolak" admin) —
dipakai untuk `DEP-1792722543127` (invoice Paymenku live pending dari sesi sebelum audit, lihat
bagian "Invoice Paymenku sungguhan" di bawah), juga dry-run kecuali disertai `--confirm`.
Memanggil `pastikanAmanUntukTes()` yang sama, jadi juga menolak jalan sampai guard di atas aktif.

**Belum dijalankan dengan `--confirm` oleh proses ini** (baik untuk hapus akun maupun tolak
deposit) — sesuai instruksi. Dry run:
```
node scripts/cleanup-test-accounts.js
node scripts/cleanup-test-accounts.js --reject-deposit=DEP-1792722543127
```
keduanya saat ini langsung berhenti di guard (lihat di atas) sampai `TEST_ALLOWED_SUPABASE_URL`
diisi — belum sempat menunjukkan daftar akun yang sebenarnya. Jalankan lagi setelah guard aktif
untuk melihat laporan dry-run yang sesungguhnya, lalu `--confirm` secara manual kalau hasilnya
sesuai ekspektasi.

## Guard cleanup-test-accounts & pemisahan env tes (lanjutan)

**`scripts/cleanup-test-accounts.js`** tidak lagi memakai `tests/_guard.js`/`TEST_ALLOWED_SUPABASE_URL`
— skrip ini memang dibuat untuk bisa menyentuh project Supabase PRODUKSI (bukan cuma testing),
karena akun tester kadang bocor ke prod lewat alur customer biasa (lihat `DEP-1792722543127` di
bagian "Invoice Paymenku sungguhan" di bawah — itu contoh nyata kejadiannya). Guard-nya sendiri,
dua lapis, WAJIB lolos dulu sebelum skrip membaca daftar akun sekalipun (termasuk dry run):
1. Flag `--target-prod-i-understand` di command line.
2. Prompt interaktif: ketik ulang project ref Supabase (diambil dari subdomain `SUPABASE_URL` di
   `.env.local`) yang sedang aktif. Salah ketik/kosong → berhenti.

Filter akun juga dipersempit: sebelumnya "semua email berakhiran `@example.com`", sekarang HANYA
lokal-part `qa.*` atau `auditqd*` (domain tetap `@example.com`) — dua pola yang benar-benar dipakai
`tests/*.test.js` dan sesi audit sebelumnya (`auditqd1792722540929`, dll). Mengurangi risiko
menyapu akun lain yang kebetulan memakai domain itu untuk alasan lain.

**Tes (`tests/_guard.js` + semua `tests/*.test.js`)** sekarang membaca kredensial dari
**`.env.test.local`** (baru, lihat `.env.test.example`), bukan `.env.local` — TANPA fallback kalau
filenya tidak ada (berhenti dengan pesan jelas, bukan diam-diam lanjut pakai `.env.local`).
Alasannya: `.env.local` adalah env aplikasi, dibaca otomatis oleh `next dev`/`next build`, dan bisa
diarahkan ke Supabase produksi kapan saja (misalnya untuk deploy) tanpa pemberitahuan khusus ke
folder `tests/`. Sebelumnya itu berarti SATU KALI `.env.local` diarahkan ke produksi cukup untuk
membuat seluruh guard `TEST_ALLOWED_SUPABASE_URL` ikut membandingkan terhadap `SUPABASE_URL`
produksi itu sendiri — kalau kebetulan nilainya juga dimasukkan ke `TEST_ALLOWED_SUPABASE_URL`
(misalnya salah copy-paste), guard tidak akan menangkapnya. Dengan file terpisah yang tidak
pernah ikut berubah otomatis, kredensial testing harus diisi ulang secara SADAR & eksplisit tiap
kali memang ingin menguji project yang berbeda.

**Dampak ke `tests/webhook-security.test.js` dari perubahan `ambilIp()` (item 28 di "Perbaikan yang
diterapkan")**: bagian tes rate-limit per IP mengirim header `x-forwarded-for` palsu untuk
mensimulasikan banyak IP berbeda — sekarang di dev server lokal (`process.env.VERCEL` tidak aktif)
header itu diabaikan total oleh `ambilIp()`, jadi semua percobaan jatuh ke SATU kunci rate-limit
yang sama (IP koneksi TCP lokal). Tes tetap valid: assertion-nya cuma memastikan 429 MUNCUL setelah
banyak percobaan cepat, tidak mengandalkan isolasi per-IP-palsu (isolasi itu baru berlaku nyata saat
deploy sungguhan di Vercel, lewat `X-Vercel-Forwarded-For`/`X-Forwarded-For` yang ditimpa
infrastruktur Vercel sendiri).

## Webhook: jalur pemulihan retry timestamp lama (lanjutan)

Pertanyaan: "apa yang terjadi kalau Paymenku me-retry callback dengan `X-PaymenKu-Timestamp` yang
sudah lebih dari 5 menit?" — **Ditolak 401** oleh `timestampFresh()` (lapisan #2 di
`pages/api/paymenku/webhook.js`), SENGAJA, bukan bug: webhook tidak punya cara membedakan "retry
sah dari Paymenku sendiri karena percobaan pertama gagal terkirim" dari "replay oleh pihak lain",
jadi dua-duanya ditolak sama rata lewat anti-replay yang sama.

Ini **tidak membuat deposit macet selamanya** — ditutup lewat jalur pemulihan independen dari
webhook, yang mengecek ULANG langsung ke API Paymenku (bukan percaya retry apa pun) lewat
`cekDanKreditDeposit()` yang sama dipakai webhook asli (CAS `ubahStatusDeposit` yang sama, aman
dipanggil berulang/bersamaan). Sebelum sesi ini, jalur itu HANYA ada di level user
(`pages/api/deposits/cek.js` — tombol "cek" dashboard, dan `cek-semua.js` — otomatis saat dashboard
dibuka), jadi kalau user tidak pernah membuka dashboardnya lagi setelah membayar, deposit itu tetap
"menunggu" tanpa ada yang mengecek ulang. Ditambah di sesi ini (lewat `lib/paymenku-kredit.js:
cekSemuaDepositPending()`, dipakai bersama oleh ketiganya):
- **Admin**: tombol "Cek status ke Paymenku" di tab Deposit (`pages/api/deposits/cek-semua-admin.js`)
  — mengecek SEMUA user, dipakai kalau ada laporan "sudah bayar tapi saldo belum masuk" dari user
  yang tidak/belum membuka dashboardnya lagi.
- **Cron**: `pages/api/cron/deposits.js` (`scripts/cron-deposits.js`, `npm run cron:deposits`, sama
  polanya dengan `cron:orders` yang sudah ada) — mengecek SEMUA user secara terjadwal, tanpa perlu
  ada yang klik apa pun. Sengaja TIDAK disambungkan ke `vercel.json` — dijadwalkan lewat scheduler
  eksternal (crontab sendiri, dll), lihat bagian "Scheduler eksternal" di bawah untuk contoh
  konkretnya & auth/batas/jeda-nya lihat bagian "Tinjauan keamanan: /api/cron/deposits" di bawah.

**Bukti HMAC dihitung dari raw body, bukan body yang di-parse+stringify ulang**: `config = { api: {
bodyParser: false } }` + `bacaRawBody()` (baca stream `req.on('data')` mentah) di
`pages/api/paymenku/webhook.js` — signature diverifikasi atas `rawBody` ini SEBELUM `JSON.parse`
dijalankan sama sekali. Dibuktikan otomatis di `tests/webhook-security.test.js` ("Signature dihitung
dari RAW BODY..."): raw body yang sengaja ditulis beda spasi & urutan key dari
`JSON.stringify(objek yang sama)` tetap lolos verifikasi kalau dicocokkan ke raw body yang SAMA
persis, tapi signature yang SAMA ditolak kalau "dicocokkan" ke hasil `JSON.stringify` ulang dari
body itu (byte beda) — membuktikan implementasinya memang bergantung pada byte asli, bukan
representasi JSON yang dinormalisasi ulang (yang akan keliru menolak notifikasi Paymenku ASLI kalau
serializer-nya menghasilkan spasi/urutan key yang berbeda, sesuatu yang umum terjadi antar bahasa/
HTTP client).

## Tinjauan keamanan: /api/cron/deposits & tombol admin "Cek status" (lanjutan)

**`pages/api/cron/deposits.js` — auth, kode persis:**
```js
const rahasia = process.env.CRON_SECRET || '';
if (!rahasia) return res.status(500).json({ error: 'CRON_SECRET belum diisi di .env.local.' });
if (!cekBearerRahasia(req, rahasia)) return res.status(401).json({ error: 'Tidak diizinkan.' });
```
`cekBearerRahasia()` (`lib/auth.js`, dipakai bersama semua endpoint `/api/cron/*`):
```js
export function cekBearerRahasia(req, rahasia) {
  if (!rahasia) return false;
  const header = String(req.headers.authorization || '');
  return sama(header, 'Bearer ' + rahasia);
}
```
`sama()` (`lib/auth.js`, dipakai bersama login admin & bearer cron):
```js
function sama(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}
```
**Fail-closed, dua lapis independen** (keduanya diverifikasi di `tests/cron-deposits-security.test.js`):
1. `process.env.CRON_SECRET || ''` — kalau environment variable itu tidak diisi sama sekali,
   `rahasia` jadi string KOSONG (bukan `undefined`), dan baris berikutnya langsung `return
   res.status(500)` SEBELUM `cekBearerRahasia()` dipanggil sama sekali — endpoint berhenti total,
   apa pun isi header `Authorization`-nya (termasuk tanpa header sama sekali). Ini lapis PERTAMA:
   **CRON_SECRET kosong di environment = tolak semua.**
2. Kalau `rahasia` terisi, `cekBearerRahasia()` sendiri JUGA `return false` duluan kalau parameter
   `rahasia`-nya kosong — lapis KEDUA yang identik, independen dari pengecekan di handler. Kalau
   terisi, perbandingan header ke `'Bearer ' + rahasia` lewat `sama()` — **hash SHA-256 kedua sisi
   dulu, baru `crypto.timingSafeEqual()` atas hash itu** (bukan atas string Authorization mentah).
   Hashing dulu membuat kedua sisi SELALU 32 byte sebelum `timingSafeEqual()`, jadi: (a) tidak
   pernah melempar exception "length mismatch" untuk header sepanjang apa pun (yang kalau dibiarkan
   crash tanpa ditangkap bisa jadi DoS murah), dan (b) waktu eksekusi `timingSafeEqual()` sendiri
   tidak lagi bergantung pada PANJANG `CRON_SECRET` asli — penyerang tidak bisa menyimpulkan
   panjang secret dari mengukur waktu respons.

**Batas tambahan di satu pemanggilan** (`lib/paymenku-kredit.js: cekSemuaDepositPending()`, dipakai
bersama oleh cron & admin):
- **Maks 50 deposit per run** (turun dari 200 di draft sebelumnya) — supaya satu pemanggilan tidak
  bisa membebani API Paymenku/database tanpa batas, dan tetap aman dalam batas waktu eksekusi
  function serverless kalau dijadwalkan sering.
- **Hanya deposit `menunggu` berusia < 24 jam** — dihitung dari `dibuat` tiap baris. Invoice QRIS
  Paymenku sendiri kedaluwarsa jauh lebih cepat dari 24 jam, jadi deposit `menunggu` yang sudah
  seumur itu nyaris pasti sudah mati di sisi Paymenku; terus mengeceknya cuma buang panggilan API.
  Tidak menghapus/mengubah baris yang lebih tua — cuma tidak diikutkan ke pengecekan otomatis.
- **Jeda 300ms antar panggilan ke Paymenku** dalam satu run — mencegah satu pemanggilan ini sendiri
  menembak API Paymenku beruntun tanpa jeda sampai 50x dalam hitungan detik.

**`pages/api/deposits/cek-semua-admin.js` — auth, kode persis:**
```js
if (req.method !== 'GET') return res.status(405).json({ error: 'Metode tidak didukung.' });
if (!wajibAdmin(req, res)) return;
```
`wajibAdmin()` butuh cookie sesi admin yang valid (`isAdmin()`, lihat bagian otorisasi admin di
atas) — endpoint ini TIDAK memakai `CRON_SECRET`, memakai mekanisme login admin yang sama dengan
seluruh endpoint admin lain. Sudah diuji otomatis di `tests/admin-authz.test.js` (baris
`GET /api/deposits/cek-semua-admin`, ditambahkan sesi sebelumnya) — tanpa login & dari user biasa,
dua-duanya harus 401/403, sama seperti 15 endpoint admin lain. Memakai batas & jeda yang SAMA dengan
cron (maks 50, usia < 24 jam, jeda 300ms) lewat `cekSemuaDepositPending()` yang sama.

**`tests/cron-deposits-security.test.js`** (baru) — "tanpa secret", "secret salah", "secret kosong
di header Authorization" (`Bearer ` tanpa nilai), dan "header tanpa scheme Bearer" diuji HTTP
sungguhan ke server yang sedang jalan (semuanya harus ditolak, bukan 200, dan body tidak pernah
mengandung hasil pengecekan deposit). "CRON_SECRET kosong di ENVIRONMENT server" tidak bisa diuji
lewat HTTP sungguhan (tidak bisa mengosongkan env server yang sedang jalan dari proses tes) — diuji
level fungsi lewat cerminan persis `cekBearerRahasia()`/`sama()`, diperiksa ulang lewat tripwire
anti-drift yang mem-baca source `lib/auth.js` dan `pages/api/cron/deposits.js` langsung. Masuk ke
`npm run test:security` (`test:cron-deposits-security`).

## Scheduler eksternal (lanjutan — TIDAK memakai `vercel.json`)

Sesuai instruksi, **tidak ada `vercel.json` di repo ini** — baik untuk `/api/cron/deposits` maupun
`/api/cron/orders`/`/api/cron/services` yang sudah ada sebelumnya. Penjadwalan jadi tanggung jawab
scheduler eksternal (crontab server sendiri, cron job hosting lain, atau layanan cron pihak ketiga),
yang memanggil endpoint-endpoint ini lewat HTTP biasa dengan header `Authorization: Bearer
<CRON_SECRET>`.

**Contoh crontab — secret dibaca dari FILE env (permission 600), TIDAK ditulis langsung di command.**
Menulis `CRON_SECRET` langsung di baris crontab (`-H "Authorization: Bearer xxx"`) membuatnya
kebaca siapa pun yang bisa `crontab -l`/membuka `/var/spool/cron/crontabs/<user>`, ikut ke `MAILTO`
kalau crontab-nya mengirim email error, dan nyangkut di shell history kalau sempat ditest manual
dulu. Simpan di file terpisah, kunci permission-nya, baru di-source saat crontab jalan:

```bash
# 1. Buat file env KHUSUS untuk cron ini, isi CRON_SECRET saja (sekali, lewat shell biasa):
sudo install -d -m 700 -o deploy -g deploy /etc/sosmedgo
sudo install -m 600 -o deploy -g deploy /dev/null /etc/sosmedgo/cron.env
echo 'CRON_SECRET=isi-dengan-CRON_SECRET-produksi-yang-sama-dengan-Vercel' | sudo tee /etc/sosmedgo/cron.env >/dev/null
sudo chmod 600 /etc/sosmedgo/cron.env   # pastikan tetap 600 setelah ditulis -- rw- --- --- , cuma pemiliknya yang bisa baca
sudo chown deploy:deploy /etc/sosmedgo/cron.env   # ganti "deploy" dengan user yang menjalankan crontab ini
```
```cron
# 2. crontab -e (sebagai user "deploy" yang sama, BUKAN root, supaya $CRON_SECRET tidak ikut
#    kebaca proses lain yang jalan sebagai root):

# Cek deposit Paymenku yang masih "menunggu" tiap 5 menit
*/5 * * * * . /etc/sosmedgo/cron.env && curl -fsS -X GET -H "Authorization: Bearer $CRON_SECRET" https://domain-anda.com/api/cron/deposits >> /var/log/sosmedgo/cron-deposits.log 2>&1

# Cek status pesanan tiap 1 menit (sudah ada sebelumnya, pola yang sama)
* * * * * . /etc/sosmedgo/cron.env && curl -fsS -X GET -H "Authorization: Bearer $CRON_SECRET" https://domain-anda.com/api/cron/orders >> /var/log/sosmedgo/cron-orders.log 2>&1

# Sinkron katalog layanan 1x sehari jam 03:00 (berat, lihat komentar pages/api/cron/services.js)
0 3 * * * . /etc/sosmedgo/cron.env && curl -fsS -X GET -H "Authorization: Bearer $CRON_SECRET" "https://domain-anda.com/api/cron/services" >> /var/log/sosmedgo/cron-services.log 2>&1
```
`curl -f` membuat `curl` keluar dengan exit code bukan-nol kalau respons HTTP-nya error (4xx/5xx) —
berguna kalau crontab-nya sendiri diawasi lewat exit code (mis. `MAILTO=` di crontab, atau wrapper
monitoring seperti healthchecks.io/cronitor). `. /etc/sosmedgo/cron.env` (dot/source POSIX biasa,
bukan `source` ala bash supaya tetap jalan di `sh` minimal yang dipakai banyak sistem cron) membaca
`CRON_SECRET` dari file itu ke environment shell cron, BUKAN disalin ke baris crontab itu sendiri —
`crontab -l` tidak akan menampilkan nilainya, cuma path file-nya.

**Catatan lebih ketat (opsional)**: baris `curl -H "Authorization: Bearer $CRON_SECRET"` di atas
tetap membuat nilai `CRON_SECRET` sempat muncul sebagai argumen proses `curl` itu sendiri selama ia
berjalan (kebaca lewat `ps aux`/`/proc/<pid>/cmdline` oleh user lain di mesin yang sama, SELAMA
curl itu berjalan — biasanya sepersekian detik). Kalau itu juga ingin dihindari, pakai file konfigurasi
`curl` sendiri (`-K`, BUKAN `-H` di command) yang isinya header lengkap dengan permission 600 yang
sama:
```bash
# /etc/sosmedgo/cron-deposits.curlrc (permission 600, isi header LENGKAP, bukan cuma secretnya)
echo 'header = "Authorization: Bearer isi-dengan-CRON_SECRET-produksi"' | sudo tee /etc/sosmedgo/cron-deposits.curlrc >/dev/null
sudo chmod 600 /etc/sosmedgo/cron-deposits.curlrc
```
```cron
*/5 * * * * curl -fsS -K /etc/sosmedgo/cron-deposits.curlrc https://domain-anda.com/api/cron/deposits >> /var/log/sosmedgo/cron-deposits.log 2>&1
```
Dengan `-K`, `curl` membaca header langsung dari file (perlu satu file `.curlrc` per endpoint kalau
secretnya sama tapi mau log terpisah, atau satu file dipakai bersama kalau cukup), dan nilainya
TIDAK PERNAH muncul sebagai argumen command line sama sekali.

**Alternatif: `npm run cron:deposits`** (`scripts/cron-deposits.js`) — proses Node yang dibiarkan
jalan terus (bukan dipanggil scheduler per-interval), memanggil `/api/cron/deposits` tiap 60 detik
sendiri lewat `setInterval`. Cocok untuk server yang sudah selalu punya proses Node long-running
(VM/VPS sendiri, PM2, systemd service, dll) — BUKAN untuk platform serverless (Vercel) yang memang
tidak mendukung proses background seperti ini (makanya pola `/api/cron/*` + scheduler eksternal
lebih cocok untuk itu). Baca `CRON_SECRET`/`APP_URL` dari `.env.local` yang sama dengan aplikasi.
Jalankan di terminal terpisah (atau di belakang `pm2 start npm --name cron-deposits -- run cron:deposits`
kalau memakai PM2), biarkan tetap jalan selama server aplikasi jalan:
```
npm run cron:deposits
```
Sama persis pola & keluaran log-nya dengan `npm run cron:orders` yang sudah ada sebelumnya.

## Migrasi RLS-02: transaksi + rollback (lanjutan)

`supabase/lock-rpc-execute.sql` sekarang dibungkus `begin;` / `commit;` — kalau ada satu statement
yang gagal (misalnya nama/tanda tangan fungsi berubah sebelum migrasi dijalankan), SEMUA perubahan
di file itu batal bersama, tidak ada yang nyangkut separuh jalan.

**`supabase/lock-rpc-execute.rollback.sql`** (baru) — `GRANT EXECUTE` balik ke `public`/`anon`/
`authenticated` untuk seluruh 11 fungsi yang direvoke migrasi di atas, dan mengembalikan default
privileges schema `public` ke perilaku bawaan Postgres. Dipakai HANYA kalau migrasi
`lock-rpc-execute.sql` ternyata mematahkan sesuatu yang sah di produksi setelah di-deploy (grep
pemanggil RPC di bagian "RLS-02: migrasi REVOKE RPC" di atas sudah memastikan tidak ada pemanggil
anon/authenticated saat ini, tapi kode bisa berubah). **Tidak** membatalkan `search_path` yang
dikunci migrasi aslinya — itu pengerasan independen yang tidak berbahaya untuk tetap terkunci.

## Invoice Paymenku sungguhan yang pernah tercipta (jawaban item 3)

**Ya, ada SATU** — tapi bukan dari sesi audit saat ini (branch `audit/admin`). Dicek langsung ke
tabel `deposits` pakai service key:

- ID: `DEP-1792722543127`
- Akun: `auditqd1792722540929` (akun tester `@example.com` sekali pakai, dibuat untuk pengujian
  IDOR lintas-akun di sesi SEBELUM audit admin ini dimulai — bukan akun asli)
- Nominal: Rp 10.000
- Status: **`menunggu`** (masih pending, tidak pernah dibayar — jadi TIDAK ADA uang sungguhan yang
  berpindah tangan)
- Dibuat: 2026-10-23T02:29 UTC, sebelum branch `audit/admin` dibuat

Ini artinya `POST /api/deposits` (alur normal, bukan manual admin) sempat dipanggil sungguhan di
sesi sebelumnya — kemungkinan skrip pengujian cross-account IDOR yang pakai alur customer biasa
tanpa sadar ikut memanggil `buatTransaksi()` ke Paymenku asli. Karena statusnya tetap "menunggu"
(tidak pernah ada yang membayar QRIS-nya), tidak ada dampak finansial — tapi record pending ini
ada di sisi Paymenku (merchant live) sampai kedaluwarsa sendiri atau kamu batalkan manual lewat
dashboard Paymenku / tombol "Tolak" di tab Deposit admin (saya tidak hapus/ubah record ini sendiri).

**Di sesi audit INI** (semua pekerjaan sejak branch `audit/admin` dibuat): nol panggilan ke
Paymenku sungguhan, dijaga 2 lapis — `tests/webhook-security.test.js` punya penjaga `global.fetch`
yang melempar error kalau ada percobaan request ke `paymenku.com`, dan semua tes lain memakai
deposit sintetis (ditulis langsung ke database, bukan lewat `POST /api/deposits`) atau RPC saldo
langsung tanpa pernah melalui alur yang memanggil Paymenku.

## Perbaikan yang diterapkan

1. **`lib/waktu.js`** (baru) — satu util `tanggalWib()`/`waktuWib()`/`sekarangWib()`, dipakai di
   `pages/api/invoice.js`, `pages/api/pengguna.js`, `pages/api/riwayat.js`, `pages/api/statistik.js`,
   `pages/api/tickets.js` (sebelumnya 5 implementasi terpisah, 3 di antaranya tanpa penjaga tanggal
   tidak valid). Tidak mengubah output untuk tanggal valid — cuma menyatukan.
2. **`tests/admin-authz.test.js`** (baru) — 16 endpoint admin × 2 skenario (tanpa login, user biasa) = 32 percobaan.
3. **`tests/saldo-race.test.js`** (baru) — race condition `potong_saldo` + idempotensi `add_saldo_aman`.
4. **`tests/webhook-idempotency.test.js`** (baru) — idempotensi kredit deposit lewat CAS `ubahStatusDeposit`.
5. **`pages/api/paymenku/webhook.js`** — signature verification fail-closed (secret kosong = ditolak, dulu dilewati).
6. **`lib/paymenku-kredit.js`** — nominal & reference_id dicocokkan ke data deposit sendiri sebelum kredit; ditolak kalau transaksi tidak ditemukan di Paymenku.
7. **`tests/webhook-security.test.js`** (baru) — tanpa signature, signature salah, secret kosong, nominal tidak cocok, reference_id tidak cocok, invoice tidak ada: semua ditolak, saldo tidak berubah. Dijaga `global.fetch` supaya mustahil menyentuh Paymenku sungguhan.
8. **`pages/api/services.js`, `components/sosmedgo/AdminPage.jsx`, `components/sosmedgo/AdminLayanan.jsx`** — batas markup 0-500% (server + UI).
9. **`tests/markup-bounds.test.js`** (baru) — markup di luar batas ditolak 400 sebelum data disentuh.
10. **`package.json`** — tambah script `test:admin-authz`, `test:saldo-race`, `test:webhook-idempotency`, `test:webhook-security`, `test:markup-bounds`, `test:security`.
11. **`supabase/lock-rpc-execute.sql`** (baru, belum dijalankan ke database) — RLS-02: REVOKE EXECUTE dari `public`/`anon`/`authenticated` + GRANT ke `service_role` untuk seluruh 11 fungsi RPC sensitif, `ALTER DEFAULT PRIVILEGES` supaya fungsi baru tidak otomatis terbuka, dan `search_path` untuk 5 fungsi yang belum dikunci `fix-security.sql`. Lihat bagian "RLS-02: migrasi REVOKE RPC" di atas.
12. **`pages/api/paymenku/webhook.js`** — anti-replay timestamp (`timestampFresh()`, toleransi 5 menit) + rate limit per IP (60/menit, dicek paling awal). Lihat bagian "Webhook: anti-replay timestamp + rate limit per IP" di atas.
13. **`tests/rpc-privileges.test.js`** (baru) — anon ditolak utk semua 11 fungsi RPC sensitif (5/11 lolos sebelum migrasi, 11/11 setelah) + service_role tetap jalan normal (9 pengecekan, termasuk `tambah_pesan_tiket` yang sebelumnya tidak ada tes otomatisnya).
14. **`tests/webhook-security.test.js`** — tambah tes timestamp (anti-replay) dan rate limit per IP (HTTP sungguhan, 61 request dari 1 IP palsu → 429).
15. **`package.json`** — tambah script `test:rpc-privileges`, masuk ke pipeline `test:security`.
16. **`tests/_guard.js`** (baru) — guard keamanan: SEMUA `tests/*.test.js` menolak jalan kalau `SUPABASE_URL` tidak ada di `TEST_ALLOWED_SUPABASE_URL`, atau `PAYMENKU_API_KEY` berawalan `sk_live_`. Lihat bagian "Guard keamanan tes" di atas.
17. **`.env.example`** — tambah `TEST_ALLOWED_SUPABASE_URL` + penjelasan.
18. **`scripts/cleanup-test-accounts.js`** (baru) — bersihkan akun tester `@example.com` + baris data terkait (DRY RUN default, `--confirm` untuk hapus sungguhan), dan `--reject-deposit=<ID>` untuk menandai satu deposit `menunggu` jadi `ditolak`. Lihat bagian "Guard keamanan tes + pembersihan akun tester" di atas.
19. **`lib/loginGuard.js`** — `ambilIp()` sekarang memilih `X-Vercel-Forwarded-For`/`X-Real-IP` dulu sebelum fallback ke `X-Forwarded-For` mentah (yang sebelumnya satu-satunya sumber, bisa dipalsukan klien kalau tidak di belakang proxy yang menimpanya). Dipakai bersama oleh login/registrasi/webhook.
20. **`pages/api/paymenku/webhook.js`** — komentar diperbarui mengutip langsung docs.paymenku.com (lihat bagian "Webhook: anti-replay timestamp" di atas) — tidak ada perubahan logika dari sesi sebelumnya untuk `timestampFresh()`/`signatureValid()` sendiri, cuma dikonfirmasi dengan dokumentasi asli.
21. **`supabase/lock-rpc-execute.sql`** — dibungkus `begin;`/`commit;`.
22. **`supabase/lock-rpc-execute.rollback.sql`** (baru) — kebalikan dari migrasi RLS-02: `GRANT EXECUTE` balik ke `public`/`anon`/`authenticated` untuk seluruh 11 fungsi + kembalikan default privileges.
23. **`package.json`** — tambah script `cleanup:test-accounts`.
24. **`scripts/cleanup-test-accounts.js`** — diubah total: tidak lagi memakai `tests/_guard.js` (guard itu sekarang murni untuk `tests/*.test.js`). Guard sendiri: wajib flag `--target-prod-i-understand` + mengetik ulang project ref Supabase saat prompt interaktif, sebelum membaca/menghubungi Supabase sama sekali (termasuk dry run). Filter akun dipersempit dari "semua `@example.com`" jadi HANYA lokal-part `qa.*` atau `auditqd*` (domain tetap `@example.com`) — lihat bagian "Guard cleanup-test-accounts & pemisahan env tes" di bawah.
25. **`tests/_guard.js`** — `bacaEnvLocal()` diganti `bacaEnvTes()`, membaca `.env.test.local` (bukan `.env.local`), TANPA fallback (berhenti dengan pesan jelas kalau filenya tidak ada). Semua 6 file `tests/*.test.js` diikutkan.
26. **`.env.test.example`** (baru) — kredensial testing terpisah dari `.env.example`/`.env.local`. `.gitignore` ditambah pengecualian supaya file contoh ini tetap ikut ter-commit.
27. **`lib/paymenku-kredit.js`** — tambah `cekSemuaDepositPending()`: jalur pemulihan deposit yang masih "menunggu" (webhook ditolak/tidak sampai), mengecek ulang ke Paymenku lewat `cekDanKreditDeposit()` yang sama. Dipakai ulang oleh `pages/api/deposits/cek-semua.js` (refactor, perilaku user tidak berubah), endpoint admin baru **`pages/api/deposits/cek-semua-admin.js`**, dan cron baru **`pages/api/cron/deposits.js`** + **`scripts/cron-deposits.js`** (`npm run cron:deposits`). Tombol "Cek status ke Paymenku" ditambah di tab Deposit admin (`AdminDeposit.jsx`/`AdminPage.jsx`). Endpoint admin baru diikutkan ke `tests/admin-authz.test.js`. Lihat bagian "Webhook: jalur pemulihan retry timestamp lama" di bawah.
28. **`lib/loginGuard.js`** — `ambilIp()`: `X-Forwarded-For` sekarang HANYA dipercaya kalau `process.env.VERCEL` aktif (di luar Vercel, header itu dilewati total, langsung fallback ke `req.socket.remoteAddress`) — sebelumnya dipercaya sebagai fallback di hosting apa pun. Lihat bagian "Guard cleanup-test-accounts & pemisahan env tes" di bawah untuk dampaknya ke `tests/webhook-security.test.js`.
29. **`tests/webhook-security.test.js`** — tambah tes "signature dihitung dari raw body, bukan hasil `JSON.stringify` ulang" (raw body dengan spasi/urutan key beda dari `JSON.stringify` objek yang sama tetap valid; versi stringify-ulangnya ditolak) + tripwire baru memastikan `webhook.js` masih baca raw body & verifikasi signature SEBELUM `JSON.parse`. Komentar tes rate-limit per IP diperbarui soal dampak item 28 di atas.
30. **`lib/paymenku-kredit.js`** — `cekSemuaDepositPending()` dapat 2 batas baru: `maksUsiaMs` (default 24 jam — deposit `menunggu` yang lebih tua dilewati, tidak ikut dicek/dihitung ke `batas`) dan `jedaMs` (delay antar panggilan ke `cekDanKreditDeposit()`/Paymenku dalam satu run, default 0). Lihat bagian "Tinjauan keamanan: /api/cron/deposits & tombol admin 'Cek status'" di bawah.
31. **`pages/api/cron/deposits.js`** — `BATAS` diturunkan dari 200 jadi **50** per run, tambah `JEDA_MS = 300` (ms) antar panggilan ke Paymenku. Komentar baru menjelaskan persis dua lapis fail-closed auth-nya (CRON_SECRET kosong di environment, dan `cekBearerRahasia()` gagal).
32. **`pages/api/deposits/cek-semua-admin.js`** — tambah `JEDA_MS = 300` (sama dengan cron), komentar baru menjelaskan auth-nya (`wajibAdmin()`, diuji di `tests/admin-authz.test.js`).
33. **`tests/cron-deposits-security.test.js`** (baru) — tanpa header Authorization, secret salah, secret kosong di header, header tanpa scheme "Bearer": semua diuji HTTP sungguhan harus ditolak. "CRON_SECRET kosong di ENVIRONMENT server" diuji level fungsi (cerminan `cekBearerRahasia()`/`sama()` + tripwire baca source asli) karena tidak bisa mengosongkan env server yang sedang jalan dari proses tes. Masuk `npm run test:security`.
34. **`package.json`** — tambah script `test:cron-deposits-security`, masuk ke pipeline `test:security`.
35. **`.env.example`** — `TEST_ALLOWED_SUPABASE_URL` diberi catatan bahwa variabel ini sudah tidak dibaca kode apa pun (dipindah ke `.env.test.local`); `CRON_SECRET` diberi penjelasan fail-closed + contoh header `Authorization: Bearer`.
36. **`.env.test.example`** — tambah `CRON_SECRET`/`PAYMENKU_WEBHOOK_SECRET` (belum dibaca tes manapun saat ini, dipertahankan supaya file ini tetap mencerminkan seluruh kredensial server dev yang sedang jalan).
37. **`pages/api/cron/deposits.js`** — `BATAS` diturunkan lagi dari 50 jadi **20** per run, tambah `export const config = { maxDuration: 60 };` (batas waktu eksekusi function serverless Vercel). `lib/paymenku-kredit.js` komentar `cekSemuaDepositPending()` diperbarui soal angka 20 ini.
38. **`tests/cron-deposits-security.test.js`** — digeneralisasi: dulu cuma `/api/cron/deposits`, sekarang menguji KETIGA endpoint `/api/cron/*` (`deposits`, `orders`, `services`) dengan 4 skenario HTTP yang sama (tanpa header, secret salah, secret kosong di header, tanpa scheme "Bearer") + tripwire yang membaca source ketiga route cron tersebut, membuktikan `orders.js`/`services.js` memang memakai `cekBearerRahasia()` yang sama (bukan implementasi auth terpisah yang bisa diam-diam berbeda) dan fail-closed yang sama persis dengan `deposits.js`.
39. **`AUDIT_REPORT.md`** — contoh crontab diubah dari secret ditulis langsung di command (`-H "Authorization: Bearer CRON_SECRET_ANDA"`) jadi dibaca dari file env terpisah permission 600 (`. /etc/sosmedgo/cron.env && curl ... -H "Authorization: Bearer $CRON_SECRET"`), supaya `crontab -l` tidak menampilkan nilai secretnya. Tambah catatan opsional soal `curl -K` (config file) untuk mencegah secret muncul di `ps aux` sama sekali.

## Urutan deploy (webhook secret → migrasi → redeploy → tes Rp10.000)

Ikuti urutan ini, bukan sembarang urutan — supaya tidak ada jendela waktu endpoint webhook
menolak notifikasi sah atau deposit nyata ter-delay tanpa sebab yang jelas:

1. **Isi `PAYMENKU_WEBHOOK_SECRET`** di environment produksi (Vercel/hosting lain) — ambil dari
   dashboard Paymenku (Settings → Webhook). Tanpa ini, webhook fail-closed menolak SEMUA notifikasi
   (bukan bug baru — sudah begini sejak WEBHOOK-03 diperbaiki). Deposit yang masuk selagi secret
   belum diisi tetap bisa dikreditkan manual oleh admin lewat tab Deposit, atau otomatis saat
   tombol "Cek status" dipakai (jalur itu tidak lewat webhook).
2. **Jalankan migrasi `supabase/lock-rpc-execute.sql`** — buka Supabase Dashboard project ini →
   SQL Editor → New query → paste seluruh isi file (sudah dibungkus `begin;`/`commit;`, jadi kalau
   ada satu statement gagal semuanya batal bersama) → Run. (Tidak ada koneksi `psql`/connection
   string langsung di `.env.local`/`.env.example` proyek ini — satu-satunya cara yang konsisten
   dengan `rls.sql`/`fix-security.sql` yang sudah ada adalah lewat SQL Editor dashboard, bukan CLI.)
   Verifikasi lewat `npm run test:rpc-privileges` (dev server harus jalan, dan guard tes di bawah
   harus sudah aktif) — harus jadi **11/11 fungsi menolak anon**, dan bagian service_role tetap
   9/9 lolos. Kalau ternyata mematahkan sesuatu yang sah, jalankan
   `supabase/lock-rpc-execute.rollback.sql` (cara yang sama, lewat SQL Editor) untuk membalikkannya.
3. **Deploy ulang aplikasi** (perubahan `pages/api/paymenku/webhook.js` di commit terpisah) —
   migrasi di langkah 2 tidak mengubah kode aplikasi, jadi urutan 2-lalu-3 vs 3-lalu-2 sebenarnya
   tidak saling bergantung, tapi migrasi lebih dulu supaya privilege RPC sudah benar SEBELUM kode
   baru (yang tidak berubah perilakunya terhadap RPC) jalan di produksi.
4. **Tes deposit Rp 10.000 sungguhan** — dari akun asli (bukan tester), ajukan deposit QRIS
   Rp 10.000, bayar sungguhan, lalu konfirmasi: (a) notifikasi webhook Paymenku diterima & saldo
   bertambah otomatis TANPA perlu klik "Cek status" manual, (b) `admin_log`/`saldo_log` mencatat
   kreditnya, (c) invoice `DEP-1792722543127` (lihat bagian "Invoice Paymenku sungguhan" di bawah)
   sudah dibatalkan/kedaluwarsa duluan di dashboard Paymenku kalau belum, supaya tidak ada deposit
   pending lama yang membingungkan saat mengecek log.

## Checklist deploy final

Checklist end-to-end, dari staging sampai PR — kumpulan semua langkah yang tersebar di bagian-bagian
di atas, diurutkan jadi satu daftar centang. Setiap baris menunjuk ke bagian yang menjelaskan
detailnya; tidak ada langkah baru yang tidak sudah dijelaskan di tempat lain di laporan ini.

**1. Staging (sebelum menyentuh produksi sama sekali)**
- [ ] Siapkan project Supabase KHUSUS staging/testing (schema sama dengan produksi, boleh kosong
      datanya) — **bukan** project produksi.
- [ ] Salin `.env.test.example` → `.env.test.local`, isi kredensial project staging di atas (lihat
      "Guard cleanup-test-accounts & pemisahan env tes").
- [ ] Jalankan `npm run dev` dengan `.env.local` juga diarahkan ke project staging yang SAMA (bukan
      produksi) + `PAYMENKU_API_KEY` sandbox/kosong (bukan `sk_live_...`).
- [ ] Jalankan migrasi `supabase/lock-rpc-execute.sql` di project **staging** dulu (SQL Editor →
      paste → Run) — lihat "Urutan deploy" langkah 2 untuk detail & cara rollback.
- [ ] `npm run test:security` penuh (6 file tes + `test:cron-deposits-security`) — harus
      **SEMUA LOLOS** di staging, termasuk `test:rpc-privileges` jadi 11/11 menolak anon.
- [ ] `npm run build` lolos tanpa error (sudah diverifikasi di sesi ini — lihat bawah).

**2. Environment Vercel (atau hosting lain) — produksi**
- [ ] `SUPABASE_URL`/`SUPABASE_ANON_KEY`/`SUPABASE_SECRET_KEY` — project Supabase **produksi**
      (bukan yang dipakai staging/testing di atas).
- [ ] `PAYMENKU_API_KEY` — pastikan ini benar kunci yang dimaksud untuk produksi (lihat WEBHOOK-04:
      kunci yang terpasang sebelumnya adalah `sk_live_...`; keputusan ini tetap ada di tangan kamu,
      bukan sesuatu yang diubah laporan ini).
- [ ] `PAYMENKU_WEBHOOK_SECRET` — isi dari dashboard Paymenku (Settings → Webhook) SEBELUM deploy
      kode baru (lihat "Urutan deploy" langkah 1 — tanpa ini webhook fail-closed menolak semua).
- [ ] `CRON_SECRET` — string acak panjang (`openssl rand -hex 32`), BEDA dari staging. Simpan juga
      di tempat scheduler eksternal kamu akan membaca header `Authorization: Bearer` (lihat
      "Scheduler eksternal").
- [ ] `ADMIN_USERNAME`/`ADMIN_PASSWORD` — kredensial produksi (beda dari staging).
- [ ] `APP_URL` — domain produksi sungguhan (dipakai link reset password & kembali dari pembayaran).
- [ ] **JANGAN** set `TEST_ALLOWED_SUPABASE_URL` ke project produksi di environment manapun yang
      juga menjalankan `tests/*.test.js` — variabel ini sudah tidak dibaca aplikasi, tapi kalau ada
      yang menjalankan tes lawas secara manual dengan `.env.local` yang keliru, ini lapis terakhir.
- [ ] **TIDAK** menambah `vercel.json` cron — scheduler-nya eksternal (lihat "Scheduler eksternal").

**3. Produksi — migrasi + rollback siap**
- [ ] Jalankan `supabase/lock-rpc-execute.sql` di project **produksi** (SQL Editor → Run) — lihat
      "Urutan deploy" langkah 2.
- [ ] Simpan `supabase/lock-rpc-execute.rollback.sql` siap dijalankan (SQL Editor yang sama) kalau
      migrasi di atas mematahkan sesuatu yang sah setelah deploy — jangan tunggu sampai ada
      laporan user, siapkan dulu SEBELUM deploy supaya tidak panik cari filenya saat insiden.
- [ ] Deploy ulang aplikasi (kode webhook/cron/admin di branch ini) — urutan vs migrasi tidak saling
      bergantung (lihat "Urutan deploy" langkah 3), tapi migrasi lebih dulu lebih aman.
- [ ] Jadwalkan scheduler eksternal untuk `/api/cron/deposits` (dan `/api/cron/orders` kalau belum)
      — contoh crontab ada di "Scheduler eksternal". Verifikasi satu kali manual dulu:
      `curl -i -H "Authorization: Bearer $CRON_SECRET" https://domain-anda.com/api/cron/deposits`
      harus balas `200` + `{"dicek":...,"disetujui":...}`, BUKAN 401/500.

**4. Tes deposit Rp 10.000 sungguhan**
- [ ] Ikuti "Urutan deploy" langkah 4 di atas secara lengkap (akun asli, QRIS Rp 10.000, konfirmasi
      webhook + `admin_log`/`saldo_log` + invoice lama `DEP-1792722543127` sudah dibersihkan).
- [ ] Coba juga jalur pemulihan: tombol admin "Cek status ke Paymenku" di tab Deposit (lihat
      "Tinjauan keamanan: /api/cron/deposits & tombol admin 'Cek status'") — pastikan tombolnya
      muncul & tidak error untuk admin yang sedang login.

**5. Cleanup akun tester — dry run dulu, baru `--confirm`**
- [ ] `node scripts/cleanup-test-accounts.js --target-prod-i-understand` (dry run) — baca daftar
      akun `qa.*`/`auditqd*` + jumlah baris data terkait yang DITAMPILKAN, JANGAN langsung
      `--confirm` sebelum membaca daftarnya (lihat "Cleanup script" / "Guard cleanup-test-accounts").
- [ ] Setelah yakin daftarnya benar (bukan akun asli yang kebetulan cocok pola), baru:
      `node scripts/cleanup-test-accounts.js --target-prod-i-understand --confirm` — akan diminta
      mengetik ulang project ref Supabase sebagai konfirmasi terakhir.
- [ ] Deposit live pending `DEP-1792722543127` (lihat "Invoice Paymenku sungguhan") kalau belum
      kedaluwarsa sendiri: `--reject-deposit=DEP-1792722543127` (dry run dulu, lalu `--confirm`).

**6. Push & PR**
- [ ] `git log` — review ulang daftar commit di branch `audit/admin` dari awal (bukan cuma commit
      terakhir), pastikan tidak ada yang kelewat/salah urut.
- [ ] `git push -u origin audit/admin` (eksplisit minta konfirmasi dulu — belum dilakukan oleh sesi
      ini, sesuai instruksi "jangan push").
- [ ] Buka PR ke `main`, judul singkat merujuk ke audit ini, body merangkum Ringkasan + Tabel temuan
      di atas (bukan menyalin seluruh `AUDIT_REPORT.md` apa adanya ke body PR — pakai ringkasannya,
      tautkan ke file ini untuk detail lengkap).
- [ ] Setelah PR dibuat: checklist 1-5 di atas tetap harus dijalankan manual terpisah (migrasi SQL,
      isi secret produksi, dry-run cleanup) — merge PR TIDAK otomatis menjalankan satupun dari itu.

## Cara menjalankan tes

**Langkah 0 (WAJIB) — siapkan `.env.test.local` dulu** (lihat "Guard cleanup-test-accounts &
pemisahan env tes" di atas): salin `.env.test.example` jadi `.env.test.local`, siapkan project
Supabase KHUSUS testing, isi `SUPABASE_URL`/`SUPABASE_ANON_KEY`/`SUPABASE_SECRET_KEY`/
`TEST_ALLOWED_SUPABASE_URL`/`ADMIN_USERNAME`/`ADMIN_PASSWORD` di sana (SAMA dengan yang dipakai
server dev yang sedang jalan dari `.env.local`-nya sendiri), dan pastikan `PAYMENKU_API_KEY` di
sana tidak berawalan `sk_live_`. Tanpa `.env.test.local`, SEMUA tes di bawah berhenti duluan dengan
pesan `DIHENTIKAN: ...` — ini disengaja, bukan bug.

```
npm run dev          # di terminal terpisah, biarkan jalan
npm run test:security
```

Tes butuh `.env.test.local` terisi (lihat Langkah 0 di atas) dan akan membuat/memakai akun tester
`@example.com` sekali pakai. `saldo-race.test.js`, `webhook-idempotency.test.js`, dan
`rpc-privileges.test.js` mengubah saldo/komisi akun tester tersebut sementara lalu mengembalikannya
ke nilai semula di akhir — **tidak pernah menyentuh akun asli**, dan sekarang bisa dibersihkan
lebih tuntas lewat `npm run cleanup:test-accounts --target-prod-i-understand` (lihat bagian "Guard
cleanup-test-accounts & pemisahan env tes" di atas). Belum disambungkan ke CI (butuh dev server
jalan + `.env.test.local` berisi kredensial Supabase testing, tidak aman untuk CI publik tanpa
secret management terpisah).

**Status di sesi sebelumnya**: `.env.local` proyek ini BELUM punya `TEST_ALLOWED_SUPABASE_URL`, jadi
`npm run test:security` / `npm run test:rpc-privileges` **SENGAJA TIDAK dijalankan** (sesuai
instruksi "jangan jalankan test:security/test:rpc-privileges sampai guard aktif") — cuma satu file
tes dijalankan terpisah (`node tests/admin-authz.test.js`) untuk memverifikasi guard-nya sendiri
benar-benar menghentikan eksekusi (lihat output di bagian "Guard keamanan tes" di atas), BUKAN
untuk menjalankan isi tesnya. Setelah guard diaktifkan (langkah 0), jalankan
`npm run test:rpc-privileges` — harus jadi 11/11 fungsi menolak anon kalau migrasi RLS-02 sudah
dijalankan, atau 5/11 kalau belum (persis temuan RLS-02, lihat bagian "RLS-02: migrasi REVOKE RPC"
di atas) — dan `npm run test:security` untuk sisanya (`admin-authz`, `saldo-race`,
`webhook-idempotency`, `webhook-security`, `markup-bounds`, sudah dikonfirmasi lolos penuh di sesi
audit sebelum guard ini dipasang).

## Bagian yang tidak bisa saya verifikasi

- **Konfigurasi environment produksi** (Vercel atau hosting lain) — saya cuma baca `.env.local` di
  mesin ini. Tidak tahu apakah `PAYMENKU_WEBHOOK_SECRET`/`ADMIN_SESSION_EPOCH`/dll berbeda di produksi.
- **Riwayat transaksi `PAYMENKU_API_KEY` SEBELUM sesi audit ini** — saya temukan 1 invoice pending
  (lihat bagian di atas) dari sesi sebelum audit admin, tapi tidak mengaudit lebih jauh ke belakang
  (sebelum percakapan ini dimulai) untuk tahu apakah kunci live ini pernah dipakai di konteks lain.
- **Dashboard Supabase langsung** (Database → Policies, Auth settings, dll) — semua temuan RLS di
  atas saya dapat lewat REST API pakai kunci anon/service_role sungguhan (bukti empiris request
  HTTP asli), bukan dengan membuka UI dashboard Supabase-nya. Kemungkinan konfigurasi tambahan di
  level dashboard (mis. Auth providers, Database Webhooks lain) yang tidak tercermin di 3 file SQL
  repo ini tidak ikut terdeteksi.
- **Cakupan 4 sub-agent yang gagal di awal audit** — sebagian besar cakupannya (otorisasi, IDOR,
  SSRF, secrets, header, kualitas kode) sudah saya tutupi langsung, tapi tidak identik 100% — yang
  pasti belum sedalam yang direncanakan: audit `npm outdated` di luar next/react (sudah dicek
  sekilas, tidak ditemukan masalah), dan bundle-size spesifik halaman admin per-komponen.
- **Build/deploy produksi sungguhan** — semua pengujian di sini jalan di `npm run dev` lokal, bukan
  `next start` produksi.
