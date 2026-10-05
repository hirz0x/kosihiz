import { userDariRequest, supaAuth, supaUbahAkun, tokenUser } from '../../../lib/account';
import { sisaKunci, catatGagal, resetKunci } from '../../../lib/loginGuard';

/* Ganti password. Password lama diperiksa dulu, dan percobaan yang salah dibatasi seperti login. */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST.' });
  const user = await userDariRequest(req);
  if (!user) return res.status(401).json({ error: 'Perlu login.' });

  const lama = String((req.body && req.body.passwordLama) || '');
  const baru = String((req.body && req.body.passwordBaru) || '');
  if (!lama || !baru) return res.status(400).json({ error: 'Isi password lama dan password baru.' });
  if (baru.length < 8 || baru.length > 128) return res.status(400).json({ error: 'Password baru harus 8-128 karakter.' });
  if (baru === lama) return res.status(400).json({ error: 'Password baru harus berbeda dari password lama.' });

  try {
    const kunci = 'pw_user:' + user.id;
    const tunggu = await sisaKunci(kunci);
    if (tunggu > 0) return res.status(429).json({ error: 'Terlalu banyak percobaan. Coba lagi dalam ' + Math.ceil(tunggu / 60) + ' menit.' });

    const cek = await supaAuth('token?grant_type=password', { email: user.email, password: lama });
    if (!cek.ok) {
      await catatGagal(kunci);
      return res.status(400).json({ error: 'Password lama salah.' });
    }

    const r = await supaUbahAkun({ password: baru }, tokenUser(req));
    if (!r.ok) {
      const pesan = (r.data && (r.data.error_description || r.data.msg || r.data.message)) || 'Password gagal diperbarui.';
      return res.status(400).json({ error: pesan });
    }
    await resetKunci(kunci);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: 'Password gagal diperbarui. Coba lagi.' });
  }
}
