/* Riwayat perubahan layanan. Harga yang dicatat adalah harga jual per 1000, sama seperti di pesanan. */

import { tambahRiwayat } from './store';

export const hargaJual = (s) => Math.round((s.dasar * (1 + (s.markup || 0) / 100)) / 100) * 100;
const rp = (n) => 'Rp ' + n.toLocaleString('id-ID');

/* Catatan untuk satu layanan yang berubah harga jualnya atau dinonaktifkan. Null kalau tidak ada yang perlu dicatat. */
export function catatPerubahan(lama, baru) {
  if (!lama) return null;
  if (lama.aktif && !baru.aktif) return { layananId: baru.id, tipe: 'off', lama: '', baru: '' };
  const a = hargaJual(lama);
  const b = hargaJual(baru);
  if (a === b) return null;
  return { layananId: baru.id, tipe: b > a ? 'up' : 'down', lama: rp(a), baru: rp(b) };
}

/* Simpan dalam potongan 500 supaya permintaan tidak terlalu besar. */
export async function simpanRiwayat(rows) {
  for (let i = 0; i < rows.length; i += 500) await tambahRiwayat(rows.slice(i, i + 500));
}
