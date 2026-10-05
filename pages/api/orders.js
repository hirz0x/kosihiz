/* Pesanan: kirim ke provider, simpan di Supabase, dan segarkan status. */

import { callProvider } from '../../lib/provider';
import { getServices, getOrders, saveOrders, potongSaldo, addSaldo } from '../../lib/store';
import { refreshOrders } from '../../lib/orders';
import { buatPesanan } from '../../lib/pesanan';
import { wajibAdmin, isAdmin } from '../../lib/auth';
import { userDariRequest } from '../../lib/account';

const hargaJual = (s) => Math.round((s.dasar * (1 + (s.markup || 0) / 100)) / 100) * 100;

export default async function handler(req, res) {
  /* Daftar pesanan. Pelanggan hanya melihat pesanan dengan ID yang dia sebut. */
  if (req.method === 'GET') {
    /* Admin melihat semua pesanan. User biasa hanya melihat pesanannya sendiri. */
    const admin = isAdmin(req) && req.query.as !== 'user';
    const user = admin ? null : await userDariRequest(req);
    if (!admin && !user) return res.status(401).json({ error: 'Perlu login.' });
    const milik = (list) => (admin ? list : list.filter((o) => o.userId === user.id));
    try {
      const { orders } = await refreshOrders({ force: false });
      return res.status(200).json({ orders: milik(orders) });
    } catch (e) {
      const simpan = await getOrders().catch(() => []);
      return res.status(200).json({ orders: milik(simpan), peringatan: String(e.message || e) });
    }
  }

  /* Buat pesanan baru lalu teruskan ke provider. Logikanya ada di lib/pesanan.js. */
  if (req.method === 'POST') {
    const user = await userDariRequest(req);
    if (!user) return res.status(401).json({ error: 'Login dulu untuk membuat pesanan.' });
    try {
      const pesanan = await buatPesanan(user.id, req.body || {});
      return res.status(200).json({ order: pesanan });
    } catch (e) {
      return res.status((e && e.status) || 502).json({ error: String(e.message || e) });
    }
  }

  /* Paksa segarkan semua status yang belum final, tanpa menunggu jeda. */
  if (req.method === 'PATCH') {
    if (!wajibAdmin(req, res)) return;
    try {
      const { diperbarui, orders } = await refreshOrders({ force: true });
      return res.status(200).json({ diperbarui, orders });
    } catch (e) {
      return res.status(502).json({ error: String(e.message || e) });
    }
  }

  return res.status(405).json({ error: 'Metode tidak didukung.' });
}
