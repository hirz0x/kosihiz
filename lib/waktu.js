/* Format tanggal/waktu WIB — dulu diimplementasikan ulang terpisah di 5 file API (invoice, pengguna,
   riwayat, statistik, tickets) dengan rumus yang sama tapi sebagian tanpa penjaga tanggal tidak valid
   (bisa menghasilkan string "NaN-aN-aN" kalau iso-nya rusak). Disatukan di sini, semua pakai versi
   yang sudah dijaga NaN-nya. */

export function tanggalWib(iso) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '';
  return new Date(t + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

export function waktuWib(iso) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '';
  return new Date(t + 7 * 3600 * 1000).toISOString().slice(0, 16).replace('T', ' ');
}

export function sekarangWib() {
  return waktuWib(new Date().toISOString());
}
