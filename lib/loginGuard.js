/* Pembatas percobaan login dan pendaftaran. Disimpan di tabel settings, jadi tetap berlaku walau server di-restart. */

import { getSetting, setSetting } from './store';

const MENIT = 60 * 1000;

/* IP asal permintaan. Kalau ada proxy, yang dipakai IP pertama dari X-Forwarded-For. */
export function ambilIp(req) {
  const teruskan = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return teruskan || (req.socket && req.socket.remoteAddress) || 'tidak-diketahui';
}

/* Sisa detik kunci. 0 berarti boleh mencoba. */
export async function sisaKunci(kunci) {
  const s = await getSetting('batas:' + kunci, null);
  if (!s || !s.sampai) return 0;
  const sisa = Math.ceil((Number(s.sampai) - Date.now()) / 1000);
  return sisa > 0 ? sisa : 0;
}

/* Catat satu kegagalan. Setiap `kelipatan` kegagalan, kunci 15 menit, lalu durasinya digandakan (maks 24 jam). */
export async function catatGagal(kunci, kelipatan = 5) {
  const s = (await getSetting('batas:' + kunci, null)) || { gagal: 0, sampai: 0 };
  const gagal = (Number(s.gagal) || 0) + 1;
  let sampai = Number(s.sampai) || 0;
  if (gagal % kelipatan === 0) {
    const tingkat = Math.min(gagal / kelipatan - 1, 6);
    sampai = Date.now() + Math.min(15 * MENIT * 2 ** tingkat, 24 * 60 * MENIT);
  }
  await setSetting('batas:' + kunci, { gagal, sampai });
}

export async function resetKunci(kunci) {
  await setSetting('batas:' + kunci, { gagal: 0, sampai: 0 });
}

/* Batas jumlah percobaan dalam satu jendela waktu, misalnya pendaftaran per IP. true = masih boleh. */
export async function bolehCoba(kunci, maks, jendelaMs) {
  const s = (await getSetting('coba:' + kunci, null)) || { n: 0, mulai: 0 };
  const sekarang = Date.now();
  let n = Number(s.n) || 0;
  let mulai = Number(s.mulai) || 0;
  if (!mulai || sekarang - mulai > jendelaMs) { n = 0; mulai = sekarang; }
  n += 1;
  await setSetting('coba:' + kunci, { n, mulai });
  return n <= maks;
}
