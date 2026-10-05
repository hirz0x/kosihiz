import { userDariRequest } from '../../../lib/account';

export default async function handler(req, res) {
  const user = await userDariRequest(req);
  if (!user) return res.status(401).json({ error: 'Belum login.' });
  return res.status(200).json({ user });
}
