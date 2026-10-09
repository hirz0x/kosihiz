import { userDariRequest, hapusAkunAuth } from '../../lib/account';
import { getProfile, createProfile } from '../../lib/store';

export default async function handler(req, res) {
  const user = await userDariRequest(req);
  if (!user) return res.status(401).json({ error: 'Belum login.' });
  try {
    let profil = await getProfile(user.id);
    if (!profil) profil = await createProfile(user.id, user.username || 'user' + user.id.slice(0, 6));
    return res.status(200).json({ user: { id: user.id, email: user.email, username: profil.username }, saldo: Number(profil.saldo) });
  } catch (e) {
    return res.status(502).json({ error: 'Gagal memuat profil. Coba lagi.' });
  }
}
