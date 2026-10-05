/* Kelola API key user: lihat info, dan buat (atau ganti) key. Key baru ditampilkan sekali. */

import { userDariRequest } from '../../lib/account';
import { buatApiKey, infoApiKey } from '../../lib/apikey';

export default async function handler(req, res) {
  try {
    const user = await userDariRequest(req);
    if (!user) return res.status(401).json({ error: 'Perlu login.' });
    if (req.method === 'GET') return res.status(200).json({ info: await infoApiKey(user.id) });
    if (req.method === 'POST') {
      const baru = await buatApiKey(user.id);
      return res.status(200).json({ key: baru.key, info: { awal: baru.awal } });
    }
    return res.status(405).json({ error: 'Metode tidak didukung.' });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
