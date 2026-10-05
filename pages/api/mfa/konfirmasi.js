import { tokenUser, userDariRequest, pasangSesi, ingatDariRequest } from '../../../lib/account';
import { verifikasiKode } from '../../../lib/mfa';
import { sisaKunci, catatGagal, resetKunci } from '../../../lib/loginGuard';

/* Konfirmasi kode pertama untuk mengaktifkan 2FA. Sesi diganti dengan sesi yang sudah lolos 2FA. */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST.' });
  const user = await userDariRequest(req);
  if (!user) return res.status(401).json({ error: 'Perlu login.' });
  const factorId = String((req.body && req.body.factorId) || '');
  const kode = String((req.body && req.body.kode) || '').replace(/\s/g, '');
  if (!factorId || !/^\d{6}$/.test(kode)) return res.status(400).json({ error: 'Masukkan 6 digit kode dari aplikasi authenticator.' });

  const kunci = 'mfa_user:' + user.id;
  const tunggu = await sisaKunci(kunci);
  if (tunggu > 0) return res.status(429).json({ error: 'Terlalu banyak percobaan. Coba lagi dalam ' + Math.ceil(tunggu / 60) + ' menit.' });

  try {
    const hasil = await verifikasiKode(tokenUser(req), factorId, kode);
    if (!hasil.ok) {
      await catatGagal(kunci);
      return res.status(400).json({ error: hasil.error });
    }
    await resetKunci(kunci);
    pasangSesi(res, hasil.sesi.access_token, hasil.sesi.expires_in, hasil.sesi.refresh_token, ingatDariRequest(req));
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: 'Gagal memverifikasi kode. Coba lagi.' });
  }
}
