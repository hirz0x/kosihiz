import { hapusSesi } from '../../../lib/account';

/* GET dipakai dari tautan Keluar; POST juga didukung. */
export default function handler(req, res) {
  hapusSesi(res);
  if (req.method === 'GET') {
    res.setHeader('Location', '/login');
    return res.status(302).end();
  }
  return res.status(200).json({ ok: true });
}
