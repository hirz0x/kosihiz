import { supaAuth } from '../../../lib/account';
import { ambilIp, bolehCoba } from '../../../lib/loginGuard';

const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Kirim link reset password ke email. Jawabannya selalu sama, supaya tidak bisa dipakai untuk mengecek email terdaftar. */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST.' });
  const email = String((req.body && req.body.email) || '').trim().toLowerCase();
  if (!POLA_EMAIL.test(email) || email.length > 254) return res.status(400).json({ error: 'Format email tidak valid.' });
  if (!(await bolehCoba('lupa_ip:' + ambilIp(req), 5, 60 * 60 * 1000))) {
    return res.status(429).json({ error: 'Terlalu banyak permintaan. Coba lagi nanti.' });
  }
  const base = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
  try {
    await supaAuth('recover?redirect_to=' + encodeURIComponent(base + '/reset-password'), { email });
  } catch (e) {
    /* Kegagalan dikirim diam-diam, supaya jawabannya tetap sama. */
  }
  return res.status(200).json({ ok: true });
}
