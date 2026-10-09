import { getSetting, setSetting } from '../../lib/store';
import { userDariRequest } from '../../lib/account';

export default async function handler(req, res) {
  try {
    const user = await userDariRequest(req);
    if (!user) return res.status(401).json({ error: 'Perlu login.' });
    const daftar = (await getSetting('notif:' + user.id, null)) || [];
    if (req.method === 'GET') {
      return res.status(200).json({ notif: daftar, belumDibaca: daftar.filter((n) => !n.dibaca).length });
    }
    if (req.method === 'PATCH') {
      await setSetting('notif:' + user.id, daftar.map((n) => ({ ...n, dibaca: true })));
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Metode tidak didukung.' });
  } catch (e) {
    return res.status(502).json({ error: 'Gagal memuat notifikasi. Coba lagi.' });
  }
}
