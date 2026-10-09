/* Buat pesanan lewat API key. Contoh:
   POST /api/v1/order  Authorization: Bearer sgk_...  body: { "service": 302, "link": "...", "quantity": 1000 } */

import { userDariApiKey } from '../../../lib/apikey';
import { buatPesanan, PesananError } from '../../../lib/pesanan';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST.' });
  try {
    const user = await userDariApiKey(req);
    if (!user) return res.status(401).json({ error: 'API key tidak valid.' });
    const pesanan = await buatPesanan(user.id, req.body || {});
    return res.status(200).json({ order: pesanan.providerOrder, biaya: pesanan.biaya });
  } catch (e) {
    /* PesananError sengaja ditulis aman (mis. "Saldo tidak cukup") — error lain yang tidak
       terduga jangan diteruskan mentah-mentah, endpoint ini dipanggil pihak luar (reseller). */
    if (e instanceof PesananError) return res.status(e.status || 502).json({ error: e.message });
    console.error('Gagal membuat pesanan via API key (tidak terduga):', e && e.message ? e.message : e);
    return res.status(502).json({ error: 'Pesanan gagal diproses. Coba lagi.' });
  }
}
