# Rencana upgrade Next.js 14 → 15/16

Status saat ini: `next@14.2.35` (versi 14.x terbaru, tidak ada patch lebih baru dalam major 14).
2 kerentanan tersisa di `npm audit` (RCE Image Optimization API untuk AVIF/SVG) hanya bisa
ditutup dengan upgrade major — untuk sementara ditutup lewat `images.unoptimized: true` di
`next.config.js` (lihat laporan terpisah), bukan upgrade.

**Jangan kerjakan upgrade ini langsung di `main`.** Buat branch terpisah dulu (mis.
`chore/next-16-upgrade`) — ada 1-2 perubahan yang bisa gagal build (lihat di bawah), dan upgrade
React 18→19 butuh testing ulang semua halaman dashboard yang pakai class component.

Sumber: panduan resmi Next.js (`nextjs.org/docs/.../upgrading/version-15` dan `version-16`,
diambil dari paket `next@16.3.8`), dicocokkan dengan kode aktual di repo ini — bukan tebakan.

## Temuan spesifik di codebase ini (sudah dicek, bukan asumsi)

1. **`next.config.js` punya custom `webpack()` config** (mematikan disk cache webpack pas `dev`
   untuk hindari bug ENOENT di Windows). Next.js 16 default pakai Turbopack untuk `next dev` dan
   `next build` — **build akan GAGAL** kalau ada custom webpack config, kecuali pakai flag
   `--webpack` atau config webpack-nya dihapus. Perlu diputuskan saat upgrade: pindah ke
   `--webpack` (pertahankan workaround ini), atau coba tanpa workaround dulu (Turbopack punya
   mekanisme cache beda, mungkin bug ENOENT itu sudah tidak relevan — perlu dites di Windows).
2. **`middleware.js` ada di root repo** (dipakai apa isinya belum dicek ulang di tugas ini, tapi
   filenya ada). Next.js 16 mewajibkan rename jadi `proxy.js` dengan fungsi ekspor bernama
   `proxy` — `middleware.js` lama tidak lagi dibaca. Edge runtime tidak didukung di `proxy`, jadi
   kalau middleware ini pakai `export const config = { runtime: 'edge' }`, itu perlu dicek
   terpisah sebelum upgrade.
3. **4 route API** (`pages/api/artikel.js`, `pages/api/artikel/upload-gambar.js`,
   `pages/api/paymenku/webhook.js`, `pages/api/services.js`) punya `export const config = {...}`
   — **sudah dicek isinya**, semuanya `api.bodyParser` (ukuran body / matikan body-parser untuk
   webhook mentah), BUKAN config AMP (`{ amp: true }`). Next 16 menghapus AMP sepenuhnya, tapi
   config `bodyParser` ini tidak termasuk yang dihapus — aman, tidak perlu diubah.
4. **Pages Router murni, tidak ada folder `app/`** — breaking change async `cookies()`/
   `headers()`/`params`/`searchParams` di Next 15/16 cuma berlaku untuk App Router, **tidak
   relevan** untuk `pages/api/*.js` yang pakai `req`/`res` biasa di repo ini.
5. **Tidak ada pemakaian `next/image`** sama sekali — perubahan `images.qualities`,
   `images.localPatterns`, `minimumCacheTTL` default di Next 16 tidak berdampak; `unoptimized:true`
   yang sudah dipasang tetap valid di Next 15 dan 16 tanpa perubahan.
6. **Tidak ada `serverRuntimeConfig`/`publicRuntimeConfig`/`getConfig()`** — aman, tidak kena
   penghapusan runtime-config di Next 16.
7. **Tidak ada `.eslintrc*`, tidak ada script `next lint` di `package.json`** — aman dari
   penghapusan `next lint` di Next 16 dan default ESLint Flat Config.
8. **Class component, tidak ada string ref / `findDOMNode` / lifecycle `UNSAFE_*` / pemanggilan
   manual `ReactDOM.render`** — dicek lewat grep ke seluruh `components/`, `pages/`, `lib/`, nol
   hasil. Ini kabar baik: risiko breaking akibat bump React 18→19 (wajib untuk App Router, Pages
   Router Next sendiri bilang tetap kompatibel dengan React 18 — tapi kalau ikut bump React 19
   juga, kode kelas yang ada sejauh ini tidak memakai API yang sudah dihapus React 19).
9. **Node.js terpasang: v22.19.0** — sudah di atas syarat minimum Next 16 (20.9.0 LTS), tidak
   perlu upgrade Node.

## Urutan kerja yang disarankan (saat benar-benar dikerjakan, di branch terpisah)

1. `git checkout -b chore/next-16-upgrade`
2. `npx @next/codemod@latest upgrade latest` — otomatis menangani rename `middleware`→`proxy`,
   migrasi `next lint`, dan beberapa rename config lain yang dilaporkan di atas.
3. Putuskan soal custom `webpack()` di `next.config.js` (poin 1 di atas) — coba hapus dulu dan
   jalankan `npm run dev`/`npm run build` di Windows tanpa workaround; kalau ENOENT muncul lagi,
   pasang ulang lewat flag `--webpack` di script `dev`/`build`.
4. `npm run build` lokal, lalu jalankan skenario smoke test yang sama seperti sesi-sesi
   sebelumnya (login, New Order, semua halaman dashboard, light/dark, 4 viewport) sebelum merge.
5. `npm audit` ulang untuk pastikan 2 CVE yang jadi alasan upgrade ini memang sudah hilang.

## Belum dicek (di luar scope tugas ini, perlu dilihat lagi saat upgrade beneran)

- Isi `middleware.js` itu sendiri (apakah pakai Edge runtime, matcher apa) — baru dicek
  keberadaan filenya, bukan isinya.
- Kompatibilitas dependency lain di `package.json` (Supabase client? tidak dipakai — repo ini
  pakai PostgREST manual; `playwright`/`lucide-react` kemungkinan besar aman tapi belum dicek
  versi minimum React 19 mereka).
- `cacheComponents`/Turbopack filesystem cache — fitur baru, tidak wajib dipakai, cuma opsional.
