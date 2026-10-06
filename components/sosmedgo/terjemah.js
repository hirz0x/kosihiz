/* Terjemahan istilah dari provider, supaya nama layanan dan kategori tampil dalam Bahasa Indonesia.
   Hanya untuk tampilan. Nama brand (Instagram, TikTok, YouTube, Facebook) tidak diubah. */

const ISTILAH = [
  ['Live Stream Viewers', 'Penonton Live'], ['Real Likes', 'Like Asli'],
  ['Followers', 'Pengikut'], ['Subscribers', 'Subscriber'], ['Likes', 'Like'], ['Comments', 'Komentar'],
  ['Shares', 'Bagikan'], ['Saves', 'Simpan'], ['Cheapest', 'Termurah'], ['Cheap', 'Murah'],
  ['Best for SEO', 'Terbaik untuk SEO'], ['Best', 'Terbaik'], ['English Names', 'Nama Inggris'],
  ['Worldwide', 'Seluruh Dunia'], ['Insights', 'Insight'], ['Brazil', 'Brasil'], ['USA', 'AS'],
  ['Instant Start', 'Mulai Instan'], ['Start Time', 'Waktu Mulai'],
  ['No Drop', 'Tanpa Penurunan'], ['Non Drop', 'Tanpa Penurunan'], ['Low Drop', 'Penurunan Rendah'],
  ['High Drop', 'Penurunan Tinggi'], ['Drop Protection', 'Perlindungan Penurunan'], ['Drop', 'Penurunan'],
  ['No Refill', 'Tanpa Refill'], ['Refill Button Working', 'Tombol Refill Berfungsi'],
  ['Services', 'Layanan'], ['Service', 'Layanan'], ['Real', 'Asli'], ['Active', 'Aktif'],
  ['Lifetime', 'Seumur Hidup'], ['Guaranteed', 'Dijamin'], ['Guarantee', 'Garansi'], ['Speed', 'Kecepatan'],
  ['Days', 'Hari'], ['Day', 'Hari'], ['Hours', 'Jam'], ['Hour', 'Jam'], ['Minutes', 'Menit'], ['Minute', 'Menit'],
  ['Cancel Enable', 'Bisa Dibatalkan'], ['Country Targeted', 'Target Negara'], ['Targeted', 'Bertarget'],
  ['High Quality', 'Kualitas Tinggi'], ['Quality', 'Kualitas'], ['Profile Data', 'Data Profil'],
  ['Random', 'Acak'], ['Different', 'Berbeda'], ['Working', 'Berfungsi'], ['Fast', 'Cepat'],
  ['Accounts', 'Akun'], ['Account', 'Akun'], ['Max', 'Maks'], ['Views', 'Tayangan']
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
