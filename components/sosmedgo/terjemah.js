/* Terjemahan istilah dari provider, supaya nama layanan dan kategori tampil dalam Bahasa Indonesia.
   Hanya untuk tampilan. Nama brand (Instagram, TikTok, YouTube, Facebook) tidak diubah. */

const ISTILAH = [
  ['Live Stream Viewers', 'Penonton Live'], ['Real Likes', 'Like Asli'],
  ['Followers', 'Pengikut'], ['Subscribers', 'Subscriber'], ['Likes', 'Like'], ['Comments', 'Komentar'],
  ['Shares', 'Bagikan'], ['Saves', 'Simpan'], ['Cheapest', 'Termurah'], ['Cheap', 'Murah'],
  ['Best for SEO', 'Terbaik untuk SEO'], ['Best', 'Terbaik'], ['English Names', 'Nama Inggris'],
  ['Worldwide', 'Seluruh Dunia'], ['Insights', 'Insight'], ['Brazil', 'Brasil'], ['USA', 'AS'],
  ['Instant Start', 'Mulai Instan'], ['Low Drop', 'Penurunan Rendah'], ['No Refill', 'Tanpa Refill'],
  ['Services', 'Layanan'], ['Service', 'Layanan'], ['Real', 'Asli'], ['Active', 'Aktif'],
  ['Lifetime', 'Seumur Hidup'], ['Guaranteed', 'Dijamin'], ['Speed', 'Kecepatan'],
  ['Days', 'Hari'], ['Day', 'Hari'], ['Hours', 'Jam'], ['Hour', 'Jam'], ['Minutes', 'Menit'], ['Minute', 'Menit']
];

const PETA = new Map(ISTILAH.map((x) => [x[0].toLowerCase(), x[1]]));
const URUTAN = ISTILAH.map((x) => x[0]).sort((a, b) => b.length - a.length);

/* Hanya cocok kalau diapit awal, akhir, atau karakter non-huruf. */
export function namaIndo(teks) {
  let hasil = String(teks || '');
  for (const en of URUTAN) {
    hasil = hasil.replace(new RegExp('(^|[^A-Za-z])(' + en + ')(?![A-Za-z])', 'gi'), (m, awal, kata) => awal + (PETA.get(kata.toLowerCase()) || kata));
  }
  return hasil;
}
