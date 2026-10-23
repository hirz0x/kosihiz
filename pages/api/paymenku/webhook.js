/* Notifikasi pembayaran dari Paymenku. Berlapis, SEMUA wajib lolos sebelum saldo bisa bertambah:

   0. Rate limit per IP (di bawah) — batas percobaan per IP per menit, supaya endpoint ini tidak
      bisa dipakai untuk menebak reference_id/signature bertubi-tubi sebelum lapisan lain dicek.
   1. Signature HMAC-SHA256 di bawah (header X-PaymenKu-Signature + X-PaymenKu-Timestamp, lihat
      docs.paymenku.com/events/webhooks) — menolak permintaan yang sama sekali bukan dari Paymenku.
      FAIL-CLOSED: kalau PAYMENKU_WEBHOOK_SECRET belum diisi di .env.local, webhook DITOLAK semua
      (401), bukan dilewatkan. Isi dulu secretnya dari dashboard Paymenku (Settings → Webhook)
      sebelum endpoint ini bisa dipakai — lebih baik notifikasi pembayaran nyata tertunda sampai
      secretnya di-setup daripada endpoint ini bisa dipicu siapa saja yang tahu/menebak reference_id.
   2. Timestamp (X-PaymenKu-Timestamp) tidak boleh terlalu tua/jauh di masa depan — mencegah replay
      permintaan lama yang signature-nya sendiri sah (mis. hasil sadap) dipakai ulang belakangan.
   3. lib/paymenku-kredit.js: status, nominal, DAN reference_id dicek ulang langsung ke API Paymenku
      (bukan percaya isi notifikasi webhook sama sekali) sebelum saldo benar-benar ditambah. */

import crypto from 'crypto';
import { getDeposit, getDepositByTrx } from '../../../lib/store';
import { isiData } from '../../../lib/paymenku';
import { cekDanKreditDeposit } from '../../../lib/paymenku-kredit';
import { ambilIp, bolehCoba } from '../../../lib/loginGuard';

export const config = { api: { bodyParser: false } };

/* Toleransi umur timestamp webhook: 5 menit ke belakang atau ke depan (jam server/Paymenku bisa
   sedikit beda). Di luar itu, permintaan ditolak walau signature-nya sendiri valid. */
const TOLERANSI_TIMESTAMP_MS = 5 * 60 * 1000;
/* Rate limit sederhana per IP: cukup untuk menutup celah coba-coba reference_id/signature
   bertubi-tubi, tanpa mengganggu retry notifikasi wajar dari server Paymenku sendiri. */
const RATE_LIMIT_MAKS = 60;
const RATE_LIMIT_JENDELA_MS = 60 * 1000;

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

/* Diekspor untuk tests/webhook-security.test.js (lihat komentar di signatureValid di atas). */
export function timestampFresh(req, toleransiMs = TOLERANSI_TIMESTAMP_MS) {
  const raw = String(req.headers['x-paymenku-timestamp'] || '');
  if (!raw || !/^\d+$/.test(raw)) return false;
  let ms = Number(raw);
  if (!Number.isFinite(ms)) return false;
  if (raw.length <= 10) ms *= 1000; // header berupa unix seconds, bukan milliseconds
  return Math.abs(Date.now() - ms) <= toleransiMs;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metode tidak didukung.' });

  const ip = ambilIp(req);
  if (!(await bolehCoba('paymenku_webhook_ip:' + ip, RATE_LIMIT_MAKS, RATE_LIMIT_JENDELA_MS))) {
    console.error('Webhook Paymenku ditolak: rate limit per IP terlampaui (' + ip + ').');
    return res.status(429).json({ error: 'Terlalu banyak permintaan, coba lagi nanti.' });
  }

  const rawBody = await bacaRawBody(req);
  if (!signatureValid(rawBody, req)) {
    const sebab = process.env.PAYMENKU_WEBHOOK_SECRET ? 'signature tidak cocok' : 'PAYMENKU_WEBHOOK_SECRET belum diisi di .env.local';
    console.error('Webhook Paymenku ditolak: ' + sebab + '.');
    return res.status(401).json({ error: 'Signature tidak valid.' });
  }
  if (!timestampFresh(req)) {
    console.error('Webhook Paymenku ditolak: timestamp kadaluarsa atau tidak valid.');
    return res.status(401).json({ error: 'Timestamp tidak valid.' });
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
