import { ambilSemuaArtikel } from '../lib/artikelStore';

/* Sitemap otomatis: halaman publik dan artikel yang sudah terbit. Dibuat ulang setiap diminta. */
const BASE = (process.env.APP_URL || 'https://www.smmsosmedgo.store').replace(/\/$/, '');

function escXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function getServerSideProps({ res }) {
  const artikel = (await ambilSemuaArtikel()).filter((a) => a.terbit !== false);
  const url = (loc, tgl) => '<url><loc>' + escXml(BASE + loc) + '</loc>' + (tgl ? '<lastmod>' + escXml(tgl) + '</lastmod>' : '') + '</url>';
  const daftar = [url('/'), url('/layanan'), url('/blog'), ...artikel.map((a) => url('/blog/' + a.slug, a.tanggal))].join('');
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + daftar + '</urlset>');
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
