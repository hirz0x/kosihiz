/* Paymenku: buat transaksi dan cek status. Dokumentasi: https://paymenku.com/docs */

const BASE = 'https://paymenku.com/api/v1';

export const KANAL = process.env.PAYMENKU_CHANNEL || 'qris';

/* Status yang berarti sudah dibayar. 'paid' sudah dikonfirmasi dari sandbox Paymenku. */
export const STATUS_BERHASIL = ['paid'];

async function pk(path, opsi = {}) {
  const key = process.env.PAYMENKU_API_KEY;
  if (!key) throw new Error('PAYMENKU_API_KEY belum diisi di .env.local.');
  const r = await fetch(BASE + path, {
    method: opsi.method || 'GET',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: opsi.body ? JSON.stringify(opsi.body) : undefined
  });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* bukan JSON */ }
  if (!r.ok) throw new Error('Paymenku ' + r.status + ': ' + ((data && (data.message || data.error)) || text.slice(0, 200)));
  return data;
}

/* Paymenku juga minta email pembeli dan URL kembali setelah bayar. */
export const buatTransaksi = ({ amount, referenceId, customerName, customerEmail }) =>
  pk('/transaction/create', {
    method: 'POST',
    body: {
      channel_code: KANAL,
      amount,
      reference_id: referenceId,
      customer_name: customerName,
      customer_email: customerEmail,
      return_url: (process.env.APP_URL || 'http://localhost:3000') + '/dashboard'
    }
  });

/* Status diambil dari daftar transaksi yang difilter trx_id. Itu path yang terbukti jalan di sandbox. */
export const cekTransaksi = async (trxId) => {
  const d = await pk('/transactions?trx_id=' + encodeURIComponent(trxId));
  const daftar = d && Array.isArray(d.data) ? d.data : [];
  return daftar.find((x) => x.trx_id === trxId) || daftar[0] || null;
};

/* Respons bisa langsung berisi field, atau di dalam "data". Dua-duanya diterima. */
export const isiData = (d) => (d && d.data && typeof d.data === 'object' ? d.data : d || {});
/* Status dari objek transaksi hasil cekTransaksi. */
export const ambilStatus = (t) => String((t && t.status) || '').toLowerCase();

/* Biaya QRIS dari /payment-channels (fee_mode: merchant, dipotong dari pembayaran).
   Jumlah yang ditagih ke user dinaikkan supaya setelah dipotong biaya, yang diterima tepat sebesar nominal. */
export const BIAYA_QRIS = { flat: 200, persen: 0.7 };

export function jumlahBayar(nominal) {
  return Math.ceil((nominal + BIAYA_QRIS.flat) / (1 - BIAYA_QRIS.persen / 100));
}
