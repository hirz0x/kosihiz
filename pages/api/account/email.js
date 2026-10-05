import { userDariRequest, supaAuth, supaUbahAkun, tokenUser } from '../../../lib/account';
import { sisaKunci, catatGagal, resetKunci } from '../../../lib/loginGuard';

const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Ganti email. Supabase mengirim link verifikasi ke alamat baru. Password saat ini wajib diisi. */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST.' });
  const user = await userDariRequest(req);
  if (!user) return res.status(401).json({ error: 'Perlu login.' });

  const baru = String((req.body && req.body.emailBaru) || '').trim().toLowerCase();
  const pw = String((req.body && req.body.password) || '');
  if (!baru || !pw) return res.status(400).json({ error: 'Isi email baru dan password saat ini.' });
  if (baru.length > 254 || !POLA_EMAIL.test(baru)) return res.status(400).json({ error: 'Format email tidak valid.' });
  if (baru === String(user.email || '').toLowerCase()) return res.status(400).json({ error: 'Email baru sama dengan email sekarang.' });

  try {
    const kunci = 'em_user:' + user.id;
    const tunggu = await sisaKunci(kunci);
    if (tunggu > 0) return res.status(429).json({ error: 'Terlalu banyak percobaan. Coba lagi dalam ' + Math.ceil(tunggu / 60) + ' menit.' });

    const cek = await supaAuth('token?grant_type=password', { email: user.email, password: pw });
    if (!cek.ok) {
      await catatGagal(kunci);
      return res.status(400).json({ error: 'Password saat ini salah.' });
    }

    const r = await supaUbahAkun({ email: baru }, tokenUser(req));
    if (!r.ok) {
      const pesan = (r.data && (r.data.error_description || r.data.msg || r.data.message)) || 'Email gagal diganti.';
      return res.status(400).json({ error: pesan });
    }
    await resetKunci(kunci);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: 'Email gagal diganti. Coba lagi.' });
  }
}
