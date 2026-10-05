import { supaReq, tokenUser, userDariRequest, pasangSesi, ingatDariRequest } from '../../../lib/account';
import { faktorUser, totpAktif, verifikasiKode } from '../../../lib/mfa';
import { sisaKunci, catatGagal, resetKunci } from '../../../lib/loginGuard';

/* Nonaktifkan 2FA. Wajib kode dari authenticator dulu. */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST.' });
  const user = await userDariRequest(req);
  if (!user) return res.status(401).json({ error: 'Perlu login.' });
  const kode = String((req.body && req.body.kode) || '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(kode)) return res.status(400).json({ error: 'Masukkan 6 digit kode dari aplikasi authenticator.' });

  const kunci = 'mfa_user:' + user.id;
  const tunggu = await sisaKunci(kunci);
  if (tunggu > 0) return res.status(429).json({ error: 'Terlalu banyak percobaan. Coba lagi dalam ' + Math.ceil(tunggu / 60) + ' menit.' });

  try {
    const token = tokenUser(req);
    const faktor = totpAktif(await faktorUser(token));
    if (!faktor) return res.status(400).json({ error: '2FA belum aktif.' });

    const hasil = await verifikasiKode(token, faktor.id, kode);
    if (!hasil.ok) {
      await catatGagal(kunci);
      return res.status(400).json({ error: hasil.error });
    }
    const hapus = await supaReq('DELETE', 'factors/' + encodeURIComponent(faktor.id), undefined, hasil.sesi.access_token);
    if (!hapus.ok) return res.status(400).json({ error: 'Gagal menonaktifkan 2FA. Coba lagi.' });
    await resetKunci(kunci);
    pasangSesi(res, hasil.sesi.access_token, hasil.sesi.expires_in, hasil.sesi.refresh_token, ingatDariRequest(req));
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: 'Gagal menonaktifkan 2FA. Coba lagi.' });
  }
}
