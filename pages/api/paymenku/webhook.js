/* Notifikasi pembayaran dari Paymenku. Isi notifikasi tidak dipercaya begitu saja:
   status dicek ulang ke API Paymenku, dan saldo hanya bertambah kalau API mengonfirmasi sudah dibayar. */

import { getDeposit, getDepositByTrx } from '../../../lib/store';
import { isiData } from '../../../lib/paymenku';
import { cekDanKreditDeposit } from '../../../lib/paymenku-kredit';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metode tidak didukung.' });
  const body = req.body || {};

  const data = isiData(body);
  const refId = data.reference_id || body.reference_id;
  const trxId = data.trx_id || body.trx_id;

  try {
    const deposit = (refId ? await getDeposit(String(refId)) : null) || (trxId ? await getDepositByTrx(String(trxId)) : null);
    /* Jawab 200 supaya Paymenku tidak mengulang notifikasi untuk deposit yang memang tidak kita punya. */
    if (!deposit || !deposit.trxId) return res.status(200).json({ ok: true, diabaikan: 'deposit tidak dikenal' });
    const hasil = await cekDanKreditDeposit(deposit);
    return res.status(200).json({ ok: true, ...hasil });
  } catch (e) {
    /* 500 membuat Paymenku mengulang notifikasi nanti. */
    return res.status(500).json({ error: String(e.message || e) });
  }
}
