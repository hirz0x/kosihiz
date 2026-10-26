/* Cek semua deposit user yang masih menunggu ke Paymenku, dan kreditkan yang sudah dibayar.
   Dipanggil saat dashboard dibuka, jadi pembayaran yang dilakukan di luar aplikasi tetap tercatat. */

import { userDariRequest } from '../../../lib/account';
import { cekSemuaDepositPending } from '../../../lib/paymenku-kredit';

const BATAS = 10;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Metode tidak didukung.' });
  const user = await userDariRequest(req);
  if (!user) return res.status(401).json({ error: 'Perlu login.' });
  try {
    const hasil = await cekSemuaDepositPending({ uid: user.id, batas: BATAS });
    return res.status(200).json(hasil);
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
