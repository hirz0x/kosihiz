/* Header keamanan untuk semua halaman dan API. */
const production = process.env.NODE_ENV === 'production';

const nextConfig = {
  poweredByHeader: false,
  /* Cache webpack di disk (.next/cache) sering gagal ditulis di Windows (ENOENT saat rename pack file),
     dan itu yang bikin dev server berujung "missing required error components". Dimatikan saat dev saja;
     build produksi tetap pakai cache normal. */
  webpack(config, { dev }) {
    if (dev) config.cache = false;
    return config;
  },
  async redirects() {
    /* Link lama /admin-login tetap diarahkan ke /admin/login. */
    return [{ source: '/admin-login', destination: '/admin/login', permanent: false }];
  },
  async headers() {
    const headers = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' }
    ];
    /* Mode report-only: pelanggaran hanya dicatat di console, belum memblokir. */
    headers.push({ key: 'Content-Security-Policy-Report-Only', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' data: https://cdnjs.cloudflare.com https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" });
    if (production) headers.push({ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' });
    const privat = { key: 'X-Robots-Tag', value: 'noindex, nofollow' };
    return [
      { source: '/:path*', headers },
      { source: '/admin', headers: [privat] },
      { source: '/admin/:path*', headers: [privat] },
      { source: '/dashboard', headers: [privat] },
      { source: '/dashboard/:path*', headers: [privat] },
      { source: '/api/:path*', headers: [privat] }
    ];
  }
};

module.exports = nextConfig;
