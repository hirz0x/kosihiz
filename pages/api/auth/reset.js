import { supaUbahAkun } from '../../../lib/account';

/* Pasang password baru memakai token dari link reset yang dikirim ke email. */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST.' });
  const token = String((req.body && req.body.accessToken) || '');
  const password = String((req.body && req.body.password) || '');
  if (!token) return res.status(400).json({ error: 'Link reset tidak valid. Minta link baru.' });
  if (password.length < 8 || password.length > 128) return res.status(400).json({ error: 'Password harus 8-128 karakter.' });
  try {
    const r = await supaUbahAkun({ password }, token);
    if (!r.ok) return res.status(400).json({ error: 'Link reset sudah kedaluwarsa. Minta link baru.' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: 'Password gagal diperbarui. Coba lagi.' });
  }
}
