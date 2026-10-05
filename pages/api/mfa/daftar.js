import { supaReq, tokenUser, userDariRequest } from '../../../lib/account';
import { faktorUser, totpAktif } from '../../../lib/mfa';

/* Mulai pendaftaran 2FA. Mengembalikan QR code dan kunci manual. Belum aktif sampai kodenya dikonfirmasi. */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST.' });
  const user = await userDariRequest(req);
  if (!user) return res.status(401).json({ error: 'Perlu login.' });
  const token = tokenUser(req);
  if (totpAktif(await faktorUser(token))) return res.status(400).json({ error: '2FA sudah aktif.' });

  const r = await supaReq('POST', 'factors', { factor_type: 'totp', friendly_name: 'SosmedGo', issuer: 'SosmedGo' }, token);
  if (!r.ok || !r.data || !r.data.id || !r.data.totp) {
    return res.status(400).json({ error: 'Gagal memulai 2FA. Coba lagi.' });
  }
  return res.status(200).json({ factorId: r.data.id, qr: r.data.totp.qr_code, kunci: r.data.totp.secret });
}
