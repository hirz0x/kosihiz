import { cookieSesiLengkap } from '../../../lib/account';
import { faktorUser, totpAktif, verifikasiKode } from '../../../lib/mfa';
import { ambilIp, sisaKunci, catatGagal, resetKunci } from '../../../lib/loginGuard';

/* Langkah kedua login untuk akun dengan 2FA: kode dari authenticator. */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST.' });
  const kode = String((req.body && req.body.kode) || '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(kode)) return res.status(400).json({ error: 'Masukkan 6 digit kode dari aplikasi authenticator.' });

  const raw = req.headers.cookie || '';
  const m = raw.split(';').map((c) => c.trim()).find((c) => c.startsWith('sg_mfa='));
  if (!m) return res.status(401).json({ error: 'Sesi verifikasi habis. Login ulang.' });
  const token = decodeURIComponent(m.slice('sg_mfa='.length));

  const kunci = 'mfa_login:' + ambilIp(req);
  const tunggu = await sisaKunci(kunci);
  if (tunggu > 0) return res.status(429).json({ error: 'Terlalu banyak percobaan. Coba lagi dalam ' + Math.ceil(tunggu / 60) + ' menit.' });

  try {
    const faktor = totpAktif(await faktorUser(token));
    if (!faktor) return res.status(401).json({ error: 'Sesi verifikasi habis. Login ulang.' });
    const hasil = await verifikasiKode(token, faktor.id, kode);
    if (!hasil.ok) {
      await catatGagal(kunci);
      return res.status(400).json({ error: hasil.error });
    }
    await resetKunci(kunci);
    const aman = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    res.setHeader('Set-Cookie', [...cookieSesiLengkap(hasil.sesi.access_token, hasil.sesi.expires_in, hasil.sesi.refresh_token, Boolean(req.body && req.body.ingat)), 'sg_mfa=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0' + aman]);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: 'Gagal memverifikasi kode. Coba lagi.' });
  }
}
