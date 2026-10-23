/* Notifikasi pembayaran dari Paymenku. Dua lapis pertahanan, DUA-DUANYA wajib lolos sebelum saldo
   bisa bertambah:

   1. Signature HMAC-SHA256 di bawah (header X-PaymenKu-Signature + X-PaymenKu-Timestamp, lihat
      docs.paymenku.com/events/webhooks) — menolak permintaan yang sama sekali bukan dari Paymenku.
      FAIL-CLOSED: kalau PAYMENKU_WEBHOOK_SECRET belum diisi di .env.local, webhook DITOLAK semua
      (401), bukan dilewatkan. Isi dulu secretnya dari dashboard Paymenku (Settings → Webhook)
      sebelum endpoint ini bisa dipakai — lebih baik notifikasi pembayaran nyata tertunda sampai
      secretnya di-setup daripada endpoint ini bisa dipicu siapa saja yang tahu/menebak reference_id.
   2. lib/paymenku-kredit.js: status, nominal, DAN reference_id dicek ulang langsung ke API Paymenku
      (bukan percaya isi notifikasi webhook sama sekali) sebelum saldo benar-benar ditambah. */

import crypto from 'crypto';
import { getDeposit, getDepositByTrx } from '../../../lib/store';
import { isiData } from '../../../lib/paymenku';
import { cekDanKreditDeposit } from '../../../lib/paymenku-kredit';

export const config = { api: { bodyParser: false } };

function bacaRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

/* Diekspor (bukan cuma dipakai internal) supaya tests/webhook-security.test.js bisa mengujinya
   langsung tanpa lewat HTTP — Next.js cuma pakai export `default` dan `config` sebagai route,
   export lain di sini aman diimpor begitu saja dari kode lain. */
export function signatureValid(rawBody, req) {
  const secret = process.env.PAYMENKU_WEBHOOK_SECRET;
  if (!secret) return false;
  const signature = String(req.headers['x-paymenku-signature'] || '');
  const timestamp = String(req.headers['x-paymenku-timestamp'] || '');
  if (!signature || !timestamp) return false;
  const diharapkan = crypto.createHmac('sha256', secret).update(timestamp + '.' + rawBody).digest('hex');
  const a = Buffer.from(signature);
  const b = Buffer.from(diharapkan);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metode tidak didukung.' });

  const rawBody = await bacaRawBody(req);
  if (!signatureValid(rawBody, req)) {
    const sebab = process.env.PAYMENKU_WEBHOOK_SECRET ? 'signature tidak cocok' : 'PAYMENKU_WEBHOOK_SECRET belum diisi di .env.local';
    console.error('Webhook Paymenku ditolak: ' + sebab + '.');
    return res.status(401).json({ error: 'Signature tidak valid.' });
  }

  let body = {};
  try { body = rawBody ? JSON.parse(rawBody) : {}; } catch { /* body bukan JSON, biarkan kosong */ }

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
