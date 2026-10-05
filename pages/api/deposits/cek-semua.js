/* Cek semua deposit user yang masih menunggu ke Paymenku, dan kreditkan yang sudah dibayar.
   Dipanggil saat dashboard dibuka, jadi pembayaran yang dilakukan di luar aplikasi tetap tercatat. */

import { listDeposits } from '../../../lib/store';
import { userDariRequest } from '../../../lib/account';
import { cekDanKreditDeposit } from '../../../lib/paymenku-kredit';

const BATAS = 10;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Metode tidak didukung.' });
  const user = await userDariRequest(req);
  if (!user) return res.status(401).json({ error: 'Perlu login.' });
  try {
    const menunggu = (await listDeposits(user.id)).filter((d) => d.status === 'menunggu' && d.trxId).slice(0, BATAS);
    let disetujui = 0;
    for (const d of menunggu) {
      try {
        const hasil = await cekDanKreditDeposit(d);
        if (hasil.status === 'disetujui') disetujui += 1;
      } catch (e) {
        /* Satu deposit gagal dicek tidak menghentikan yang lain. */
      }
    }
    return res.status(200).json({ dicek: menunggu.length, disetujui });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
