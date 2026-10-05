import { hapusCookie } from '../../lib/auth';

/* GET dipakai dari tautan Keluar di panel admin, lalu kembali ke halaman login admin. POST tetap mengembalikan JSON. */
export default function handler(req, res) {
  hapusCookie(res);
  if (req.method === 'GET') {
    res.setHeader('Location', '/admin/login');
    return res.status(302).end();
  }
  return res.status(200).json({ ok: true });
}
