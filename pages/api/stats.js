/* Angka umum untuk halaman depan: jumlah pengguna dan pesanan. Hanya angka, tidak ada data pribadi. */

import { semuaProfil, getOrders } from '../../lib/store';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Metode tidak didukung.' });
  try {
    const [profil, orders] = await Promise.all([semuaProfil(), getOrders()]);
    return res.status(200).json({ pengguna: profil.length, pesanan: orders.length });
  } catch (e) {
    return res.status(502).json({ error: 'Statistik belum bisa dimuat.' });
  }
}
