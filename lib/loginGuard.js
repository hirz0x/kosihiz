/* Pembatas percobaan login dan pendaftaran. Disimpan di tabel settings, jadi tetap berlaku walau server di-restart.

   Perhitungannya dilakukan ATOMIC di database (rpc rl_tick/rl_gagal, lihat supabase/schema.sql) —
   sebelumnya dihitung di sini lewat baca-lalu-tulis biasa (getSetting lalu setSetting), yang rawan
   race kalau beberapa percobaan datang BERSAMAAN: semuanya sempat baca angka yang sama sebelum ada
   yang menulis balik, jadi limiternya bisa ditembus total. Dibuktikan nyata lewat tes konkurensi:
   15 percobaan pendaftaran bersamaan dari 1 IP (batasnya 5/jam) — 15-15nya lolos, bukan cuma 5. */

import { getSetting, setSetting, rlTick, rlGagal } from './store';

/* IP asal permintaan. Kalau ada proxy, yang dipakai IP pertama dari X-Forwarded-For. */
export function ambilIp(req) {
  const teruskan = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return teruskan || (req.socket && req.socket.remoteAddress) || 'tidak-diketahui';
}

/* Sisa detik kunci. 0 berarti boleh mencoba. Cuma baca, tidak ada risiko race di sini. */
export async function sisaKunci(kunci) {
  const s = await getSetting('batas:' + kunci, null);
  if (!s || !s.sampai) return 0;
  const sisa = Math.ceil((Number(s.sampai) - Date.now()) / 1000);
  return sisa > 0 ? sisa : 0;
}

/* Catat satu kegagalan. Setiap `kelipatan` kegagalan, kunci 15 menit, lalu durasinya digandakan (maks 24 jam). */
export async function catatGagal(kunci, kelipatan = 5) {
  await rlGagal(kunci, kelipatan);
}

export async function resetKunci(kunci) {
  await setSetting('batas:' + kunci, { gagal: 0, sampai: 0 });
}

/* Batas jumlah percobaan dalam satu jendela waktu, misalnya pendaftaran per IP. true = masih boleh. */
export async function bolehCoba(kunci, maks, jendelaMs) {
  return rlTick(kunci, maks, jendelaMs);
}
