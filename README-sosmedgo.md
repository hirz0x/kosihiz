# SosmedGo — halaman Next.js (pages router)

## Taruh file di mana

```
components/sosmedgo/LandingPage.jsx
components/sosmedgo/LoginPage.jsx
components/sosmedgo/RegisterPage.jsx
components/sosmedgo/DashboardPage.jsx
pages/index.js        -> landing page   (/)
pages/login.js        -> halaman masuk  (/login)
pages/register.js     -> halaman daftar (/register)
pages/dashboard.js    -> panel user     (/dashboard)
```

Kalau di repo sudah ada `pages/index.js`, `login.js`, `register.js`, atau `dashboard.js`,
jangan ditimpa langsung: ganti isinya dengan baris `export { default } from ...`
yang ada di file pages, atau pakai komponennya di halaman yang sudah ada.

## Kebutuhan

- Next.js 12+ (pages router), React 18. Sudah dites build dengan Next 14.
- Tidak perlu library tambahan. Style pakai `styled-jsx` yang sudah bawaan Next.js.
- Font Plus Jakarta Sans dimuat dari Google Fonts lewat `<Head>`.

## Yang masih contoh (belum terhubung ke backend)

- Login / daftar: tombol langsung ke `/dashboard`, belum cek ke Supabase Auth.
- Dashboard: daftar layanan, harga, pesanan, refund, saldo `[SALDO]`, dan semua tombol
  kirim/simpan masih data contoh di dalam `renderVals()`.
  Ganti array `services`, `cats`, dan `orderData` dengan data dari Supabase / provider.
- Placeholder `[X]`, `[JUMLAH]`, `[HARGA]` di landing page tinggal diganti angka asli.
