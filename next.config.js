/* Header keamanan untuk semua halaman dan API. */
const production = process.env.NODE_ENV === 'production';

const nextConfig = {
  poweredByHeader: false,
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
    return [{ source: '/:path*', headers }];
  }
};

module.exports = nextConfig;
