/* Angka umum untuk halaman depan: jumlah pengguna dan pesanan. Hanya angka, tidak ada data pribadi.
   Endpoint ini publik (tanpa login) dan sebelumnya membaca SELURUH tabel profiles+orders tiap kali
   dipanggil — gampang disalahgunakan buat bikin beban server naik lewat spam request. Di-cache
   singkat di memori supaya permintaan beruntun tidak memicu pembacaan penuh berulang-ulang. */

import { semuaProfil, getOrders } from '../../lib/store';
import { FINAL } from '../../lib/orders';

const CACHE_MS = 5 * 60 * 1000;
let cache = null; // { data, sampai }

/* Persentase keberhasilan ASLI (bukan angka karangan) — dihitung dari pesanan yang statusnya
   sudah final saja (Completed/Canceled/Refunded/Partial), supaya pesanan yang masih berjalan
   (Pending/Processing) tidak ikut menurunkan/menaikkan angkanya secara tidak adil. */
function hitungSukses(orders) {
  const final = orders.filter((o) => FINAL.includes(o.status));
  if (!final.length) return null;
  const selesai = final.filter((o) => o.status === 'Completed').length;
  return Math.round((selesai / final.length) * 100);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Metode tidak didukung.' });
  try {
    if (!cache || Date.now() > cache.sampai) {
      const [profil, orders] = await Promise.all([semuaProfil(), getOrders()]);
      cache = { data: { pengguna: profil.length, pesanan: orders.length, suksesPersen: hitungSukses(orders) }, sampai: Date.now() + CACHE_MS };
    }
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=240');
    return res.status(200).json(cache.data);
  } catch (e) {
    return res.status(502).json({ error: 'Statistik belum bisa dimuat.' });
  }
}
