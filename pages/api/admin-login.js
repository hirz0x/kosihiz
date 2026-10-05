import { adminTerkonfigurasi, cekLoginAdmin, pasangCookie } from '../../lib/auth';
import { ambilIp, sisaKunci, catatGagal, resetKunci } from '../../lib/loginGuard';

const KELIPATAN_IP = 5;
const KELIPATAN_GLOBAL = 20;
const JEDA_GAGAL_MS = 800;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST.' });
  if (!adminTerkonfigurasi()) return res.status(500).json({ error: 'ADMIN_USERNAME dan ADMIN_PASSWORD belum diisi di .env.local.' });

  const username = String((req.body && req.body.username) || '').trim();
  const password = String((req.body && req.body.password) || '');
  if (!username || !password) return res.status(400).json({ error: 'Username dan kata sandi wajib diisi.' });
  if (username.length > 64 || password.length > 128) return res.status(400).json({ error: 'Username atau kata sandi terlalu panjang.' });

  try {
    const kunciIp = 'admin_ip:' + ambilIp(req);
    const kunciGlobal = 'admin_global';
    const tunggu = Math.max(await sisaKunci(kunciIp), await sisaKunci(kunciGlobal));
    if (tunggu > 0) {
      return res.status(429).json({ error: 'Terlalu banyak percobaan. Coba lagi dalam ' + Math.ceil(tunggu / 60) + ' menit.' });
    }

    if (!cekLoginAdmin(username, password)) {
      await new Promise((r) => setTimeout(r, JEDA_GAGAL_MS));
      await catatGagal(kunciIp, KELIPATAN_IP);
      await catatGagal(kunciGlobal, KELIPATAN_GLOBAL);
      return res.status(401).json({ error: 'Username atau kata sandi salah.' });
    }

    await resetKunci(kunciIp);
    pasangCookie(res);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: 'Gagal memeriksa login. Coba lagi.' });
  }
}
