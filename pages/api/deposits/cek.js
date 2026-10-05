/* User mengecek status deposit miliknya ke Paymenku. Tidak butuh webhook, jadi bisa dipakai di localhost. */

import { getDeposit } from '../../../lib/store';
import { userDariRequest } from '../../../lib/account';
import { cekDanKreditDeposit } from '../../../lib/paymenku-kredit';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Metode tidak didukung.' });
  const user = await userDariRequest(req);
  if (!user) return res.status(401).json({ error: 'Perlu login.' });
  try {
    const deposit = await getDeposit(String(req.query.id || ''));
    if (!deposit || deposit.userId !== user.id) return res.status(404).json({ error: 'Deposit tidak ditemukan.' });
    const hasil = await cekDanKreditDeposit(deposit);
    return res.status(200).json(hasil);
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
