/* Pesanan: kirim ke provider, simpan di Supabase, dan segarkan status. */

import { getOrders } from '../../lib/store';
import { refreshOrders } from '../../lib/orders';
import { buatPesanan, PesananError } from '../../lib/pesanan';
import { wajibAdmin, isAdmin } from '../../lib/auth';
import { userDariRequest } from '../../lib/account';

/* "provider" (smmsoc/likeo) cuma dipakai internal buat routing ke API yang benar — tidak boleh
   ikut terkirim ke pelanggan (kelihatan mentah di tab Network kalau tidak dibuang di sini),
   supaya nama/merek provider upstream tidak kebocor ke pelanggan. */
const sembunyikanProvider = (o) => { const { provider, ...sisanya } = o; return sisanya; };

export default async function handler(req, res) {
  /* Daftar pesanan. Pelanggan hanya melihat pesanan dengan ID yang dia sebut. */
  if (req.method === 'GET') {
    /* Admin melihat semua pesanan. User biasa hanya melihat pesanannya sendiri. */
    const admin = isAdmin(req) && req.query.as !== 'user';
    const user = admin ? null : await userDariRequest(req);
    if (!admin && !user) return res.status(401).json({ error: 'Perlu login.' });
    const milik = (list) => {
      const punya = admin ? list : list.filter((o) => o.userId === user.id);
      return admin ? punya : punya.map(sembunyikanProvider);
    };
    try {
      const { orders } = await refreshOrders({ force: false });
      return res.status(200).json({ orders: milik(orders) });
    } catch (e) {
      const simpan = await getOrders().catch(() => []);
      /* Pesan error asli (bisa memuat istilah/teks dari provider upstream) cuma ditampilkan ke
         admin buat diagnosis — pelanggan cukup tahu statusnya mungkin belum ter-update terbaru. */
      const peringatan = admin ? String(e.message || e) : 'Status pesanan belum sempat diperbarui, coba muat ulang.';
      return res.status(200).json({ orders: milik(simpan), peringatan });
    }
  }

  /* Buat pesanan baru lalu teruskan ke provider. Logikanya ada di lib/pesanan.js. */
  if (req.method === 'POST') {
    const user = await userDariRequest(req);
    if (!user) return res.status(401).json({ error: 'Login dulu untuk membuat pesanan.' });
    try {
      const pesanan = await buatPesanan(user.id, req.body || {});
      return res.status(200).json({ order: sembunyikanProvider(pesanan) });
    } catch (e) {
      /* PesananError sengaja ditulis aman buat pelanggan (mis. "Saldo tidak cukup") — tapi error
         lain yang tidak terduga (gangguan Supabase dll) jangan diteruskan mentah-mentah. */
      if (e instanceof PesananError) return res.status(e.status || 502).json({ error: e.message });
      console.error('Gagal membuat pesanan (tidak terduga):', e && e.message ? e.message : e);
      return res.status(502).json({ error: 'Pesanan gagal diproses. Coba lagi.' });
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
