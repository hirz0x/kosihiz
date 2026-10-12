/* Notifikasi pembayaran dari Paymenku. Isi notifikasi tidak dipercaya begitu saja:
   status dicek ulang ke API Paymenku, dan saldo hanya bertambah kalau API mengonfirmasi sudah dibayar
   (ini SUDAH cukup buat mencegah kredit saldo palsu, lihat lib/paymenku-kredit.js).

   Lapisan tambahan di bawah: verifikasi signature HMAC-SHA256 yang dikirim Paymenku sendiri
   (header X-PaymenKu-Signature + X-PaymenKu-Timestamp, lihat docs.paymenku.com/events/webhooks),
   supaya permintaan yang sama sekali bukan dari Paymenku langsung ditolak di sini — tanpa ini,
   siapa pun yang tahu/menebak reference_id/trx_id milik deposit orang lain bisa memicu pengecekan
   status lebih awal dari seharusnya (dampaknya kecil karena tetap di-reverifikasi, tapi tidak perlu
   dibiarkan terbuka kalau provider-nya sendiri sudah menyediakan cara menutupnya).

   PAYMENKU_WEBHOOK_SECRET opsional dengan sengaja: kalau belum diisi di .env.local (perlu diambil
   dari dashboard Paymenku: Settings → Webhook), verifikasi dilewati dan webhook tetap jalan seperti
   sebelumnya (dilindungi re-verifikasi di atas) — supaya rilis fitur ini tidak memutus notifikasi
   pembayaran nyata cuma karena secret-nya belum sempat di-setup. */

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

/* true = valid ATAU verifikasi memang sengaja dilewati (secret belum diisi).
   false = secret sudah diisi TAPI signature tidak cocok — ini yang harus ditolak. */
function signatureValid(rawBody, req) {
  const secret = process.env.PAYMENKU_WEBHOOK_SECRET;
  if (!secret) return true;
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
    console.error('Webhook Paymenku ditolak: signature tidak cocok.');
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
