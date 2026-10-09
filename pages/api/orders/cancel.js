/* Pembatalan pesanan oleh user. Hanya untuk pesanan miliknya yang masih menunggu, lalu diteruskan ke provider. */

import { callProvider } from '../../../lib/provider';
import { getOrders, saveOrders } from '../../../lib/store';
import { userDariRequest } from '../../../lib/account';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metode tidak didukung.' });

  const user = await userDariRequest(req);
  if (!user) return res.status(401).json({ error: 'Perlu login.' });

  const id = String((req.body && req.body.id) || '');
  if (!id) return res.status(400).json({ error: 'ID pesanan tidak valid.' });

  try {
    const pesanan = (await getOrders(user.id)).find((o) => o.id === id);
    if (!pesanan) return res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
    if (String(pesanan.status).toLowerCase() !== 'pending') {
      return res.status(400).json({ error: 'Hanya pesanan yang masih menunggu yang bisa dibatalkan.' });
    }
    if (!pesanan.providerOrder) return res.status(400).json({ error: 'Pesanan ini belum punya ID provider.' });

    /* Provider membalas daftar hasil per ID. Balasan berisi "error" berarti pembatalan ditolak.
       Pesan error mentah dari provider TIDAK diteruskan apa adanya ke pelanggan — bisa saja memuat
       nama/istilah khas provider upstream yang tidak boleh kebocor ke pelanggan. */
    const hasil = await callProvider(pesanan.provider || 'smmsoc', 'cancel', { orders: String(pesanan.providerOrder) });
    const item = Array.isArray(hasil) ? hasil[0] : hasil;
    if (!item || item.error) {
      return res.status(400).json({ error: 'Pembatalan ditolak. Pesanan mungkin sudah mulai diproses.' });
    }

    await saveOrders([{ ...pesanan, status: 'Canceled' }]);
    return res.status(200).json({ ok: true, status: 'Canceled' });
  } catch (e) {
    return res.status(502).json({ error: 'Gagal memproses pembatalan. Coba lagi sebentar lagi.' });
  }
}
