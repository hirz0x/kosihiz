/* Membaca artikel dari database. Kalau belum ada yang tersimpan, pakai data awal dari lib/artikel.js. */

import { getSetting } from './store';
import { ARTIKEL_AWAL } from './artikel';

export async function ambilSemuaArtikel() {
  const simpan = await getSetting('artikel', null);
  return Array.isArray(simpan) ? simpan : ARTIKEL_AWAL;
}
