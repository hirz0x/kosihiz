import crypto from 'crypto';
import { supaAuth, pasangSesi, emailDariUid } from '../../../lib/account';
import { getProfileByUsername } from '../../../lib/store';
import { faktorUser, totpAktif } from '../../../lib/mfa';
import { ambilIp, sisaKunci, catatGagal, resetKunci } from '../../../lib/loginGuard';

const JEDA_GAGAL_MS = 600;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST.' });
  const { email, password, ingat } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Username/email dan kata sandi wajib diisi.' });
  const masukan = String(email).trim().toLowerCase();
  if (masukan.length > 254 || String(password).length > 128) return res.status(400).json({ error: 'Email atau kata sandi terlalu panjang.' });

  try {
    /* Form login memakai field "Username" (lihat components/sosmedgo/LoginPage.jsx), bukan email —
       tapi Supabase Auth cuma menerima email. Kalau yang diketik bukan format email, cari dulu
       emailnya lewat username. Kalau usernamenya tidak ada, tetap lanjut ke Supabase Auth dengan
       nilai aslinya (pasti ditolak juga) supaya alur & waktu balasannya sama seperti username yang
       ada tapi salah password — tidak membocorkan username mana yang terdaftar. */
    let emailBersih = masukan;
    if (!masukan.includes('@')) {
      const profil = await getProfileByUsername(masukan);
      const resolved = profil ? await emailDariUid(profil.user_id) : null;
      if (resolved) emailBersih = resolved;
    }

    /* Kunci per IP dan per akun (email di-hash supaya tidak tersimpan mentah). */
    const kunciIp = 'user_ip:' + ambilIp(req);
    const kunciAkun = 'user_akun:' + crypto.createHash('sha256').update(emailBersih).digest('hex');
    const tunggu = Math.max(await sisaKunci(kunciIp), await sisaKunci(kunciAkun));
    if (tunggu > 0) {
      return res.status(429).json({ error: 'Terlalu banyak percobaan. Coba lagi dalam ' + Math.ceil(tunggu / 60) + ' menit.' });
    }

    const r = await supaAuth('token?grant_type=password', { email: emailBersih, password: String(password) });
    if (!r.ok || !r.data || !r.data.access_token) {
      await new Promise((resolve) => setTimeout(resolve, JEDA_GAGAL_MS));
      await catatGagal(kunciIp);
      await catatGagal(kunciAkun);
      return res.status(401).json({ error: 'Email atau kata sandi salah.' });
    }

    await resetKunci(kunciAkun);
    /* Akun dengan 2FA aktif: sesi belum diberikan. Token disimpan sementara di cookie pendek, menunggu kode. */
    if (totpAktif(await faktorUser(r.data.access_token))) {
      const aman = process.env.NODE_ENV === 'production' ? '; Secure' : '';
      res.setHeader('Set-Cookie', 'sg_mfa=' + encodeURIComponent(r.data.access_token) + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=300' + aman);
      return res.status(200).json({ mfa: true });
    }
    pasangSesi(res, r.data.access_token, r.data.expires_in, r.data.refresh_token, Boolean(ingat));
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: 'Gagal memeriksa login. Coba lagi.' });
  }
}
