import { tokenUser, userDariRequest } from '../../../lib/account';
import { faktorUser, totpAktif } from '../../../lib/mfa';

/* Status 2FA user. */
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Gunakan GET.' });
  const user = await userDariRequest(req);
  if (!user) return res.status(401).json({ error: 'Perlu login.' });
  const faktor = await faktorUser(tokenUser(req));
  return res.status(200).json({ aktif: Boolean(totpAktif(faktor)) });
}
