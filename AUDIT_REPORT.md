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
user biasa), IDOR dicegah konsisten, tidak ada secret bocor ke client atau git history. **Tidak
ditemukan temuan Critical.** Temuan High ada 1, sifatnya operasional (bukan bug kode). Beberapa
temuan Medium/Low dicatat, 1 diperbaiki langsung (duplikasi kode, tidak mengubah perilaku), sisanya
butuh keputusan karena mengubah perilaku/arsitektur.

## Tabel temuan

| ID | Severity | Lokasi | Deskripsi | Dampak | Status |
|---|---|---|---|---|---|
| WEBHOOK-04 | **High** | `.env.local` — `PAYMENKU_API_KEY` | Kunci Paymenku yang terpasang adalah kunci **LIVE** (`sk_live_...`), bukan sandbox, walau komentar di file menyebut "sandbox" | Kalau environment ini pernah memproses transaksi, itu transaksi uang sungguhan, bukan simulasi | **Perlu keputusan** — bukan bug kode, saya tidak mengubah file `.env.local`. Mohon cek & ganti ke `sk_test_...` kalau memang untuk development |
| WEBHOOK-03 | Medium | `.env.local` — `PAYMENKU_WEBHOOK_SECRET` (tidak diisi) | Verifikasi signature HMAC webhook Paymenku saat ini tidak aktif karena secret belum diisi. Kodenya sudah benar (`pages/api/paymenku/webhook.js`), tinggal diisi | Dampak terbatas — status tetap di-reverifikasi ke API Paymenku sebelum kredit, bukan satu-satunya lapis pertahanan | **Perlu keputusan** — isi secretnya dari dashboard Paymenku kalau mau lapisan ini aktif |
| PERF-01 | Medium | `pages/api/pengguna.js` → `lib/store.js: getOrders()` | Halaman admin "Pengguna" menarik SEMUA baris tabel `orders` (tanpa filter/limit) tiap kali dibuka, cuma untuk menghitung jumlah+total belanja per user | Akan makin lambat seiring tabel orders membesar tanpa batas (saat ini ribuan baris, masih OK) | **Perlu keputusan** — opsi: agregat lewat view/RPC Postgres, atau cache berkala. Mengubah arsitektur, bukan perbaikan kecil |
| CODE-01 | Low | `pages/api/{invoice,pengguna,riwayat,statistik,tickets}.js` | Fungsi format tanggal/waktu WIB diimplementasikan ulang terpisah di 5 file, sebagian tanpa penjaga tanggal tidak valid | Risiko rendah — kalau ada bug di satu, 4 lainnya tidak otomatis ikut benar | **Diperbaiki** — disatukan ke `lib/waktu.js` |
| CODE-02 | Low | `components/sosmedgo/AdminPage.jsx` | Punya `ambilJson()` sendiri, duplikat dari versi di `DashboardPage.jsx` yang sudah diperbaiki sesi sebelumnya (logging per-percobaan retry + pesan error spesifik timeout/401/500) | Admin tidak dapat perbaikan observability yang sama seperti dashboard pelanggan | **Opsional** — belum dikerjakan, file admin besar (1023 baris), risiko regresi untuk perbaikan non-critical |
| DANGER-03 | Low | `pages/api/services.js` (PATCH markup) | Markup % tidak punya batas atas, cuma dijamin ≥0 | Admin salah ketik bisa set markup ekstrem (langsung kelihatan di UI, bisa dikoreksi) | **Perlu keputusan** — menambah cap bisa dianggap mengubah perilaku bisnis (ada kemungkinan admin memang butuh markup tinggi untuk kasus tertentu) |
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

## Perbaikan yang diterapkan

1. **`lib/waktu.js`** (baru) — satu util `tanggalWib()`/`waktuWib()`/`sekarangWib()`, dipakai di
   `pages/api/invoice.js`, `pages/api/pengguna.js`, `pages/api/riwayat.js`, `pages/api/statistik.js`,
   `pages/api/tickets.js` (sebelumnya 5 implementasi terpisah, 3 di antaranya tanpa penjaga tanggal
   tidak valid). Tidak mengubah output untuk tanggal valid — cuma menyatukan.
2. **`tests/admin-authz.test.js`** (baru) — 16 endpoint admin × 2 skenario (tanpa login, user biasa) = 32 percobaan.
3. **`tests/saldo-race.test.js`** (baru) — race condition `potong_saldo` + idempotensi `add_saldo_aman`.
4. **`tests/webhook-idempotency.test.js`** (baru) — idempotensi kredit deposit lewat CAS `ubahStatusDeposit`.
5. **`package.json`** — tambah script `test:admin-authz`, `test:saldo-race`, `test:webhook-idempotency`, `test:security`.

## Cara menjalankan tes

```
npm run dev          # di terminal terpisah, biarkan jalan
npm run test:security
```

Tes butuh `.env.local` terisi (dibaca langsung, dipakai lewat kredensial Supabase yang sama dengan
app — **bukan** kredensial baru yang saya buat) dan akan membuat/memakai akun tester
`qa.*@example.com` sekali pakai. `saldo-race.test.js` dan `webhook-idempotency.test.js` mengubah
saldo akun tester tersebut sementara lalu mengembalikannya ke 0 di akhir — **tidak pernah menyentuh
akun asli**. Belum disambungkan ke CI (butuh dev server jalan + `.env.local` berisi kredensial asli,
tidak aman untuk CI publik tanpa secret management terpisah).

## Bagian yang tidak bisa saya verifikasi

- **RLS (Row Level Security) di level Supabase** — saya infer dari ARSITEKTUR kode (tidak ada akses
  client→Supabase langsung sama sekali, semua lewat API Next.js yang sudah diuji ekstensif) bahwa RLS
  bukan lapis pertahanan yang dipakai di sini (pola "service-role + app-layer auth"). Saya tidak bisa
  membuka dashboard Supabase untuk mengecek apakah RLS aktif/tidak di tiap tabel secara langsung.
- **Konfigurasi environment produksi** (Vercel atau hosting lain) — saya cuma baca `.env.local` di
  mesin ini. Tidak tahu apakah `PAYMENKU_WEBHOOK_SECRET`/`ADMIN_SESSION_EPOCH`/dll berbeda di produksi.
- **Riwayat transaksi `PAYMENKU_API_KEY`** — saya cuma melihat kunci yang terpasang SEKARANG adalah
  kunci live. Saya tidak mengaudit riwayat transaksi untuk tahu apakah kunci ini pernah terpakai
  memproses pembayaran sungguhan di masa lalu selama development.
- **Cakupan 4 sub-agent yang gagal** — sebagian besar cakupannya (otorisasi, IDOR, SSRF, secrets,
  header, kualitas kode) sudah saya tutupi langsung di atas, tapi tidak identik 100% — yang pasti
  belum sedalam yang direncanakan: audit `npm outdated` di luar next/react (sudah dicek sekilas, tidak
  ditemukan masalah), dan bundle-size spesifik halaman admin per-komponen.
- **Build/deploy produksi sungguhan** — semua pengujian di sini jalan di `npm run dev` lokal, bukan
  `next start` produksi.
