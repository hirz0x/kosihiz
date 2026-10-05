/* Memanggil pengecekan pesanan setiap 60 detik. Jalankan dengan: npm run cron:orders
   Biarkan terminal ini terbuka selama server dijalankan. */

const fs = require('fs');
const path = require('path');

function bacaEnv() {
  const file = path.join(__dirname, '..', '.env.local');
  const out = {};
  if (!fs.existsSync(file)) return out;
  fs.readFileSync(file, 'utf8').split('\n').forEach((l) => {
    const m = l.match(/^([A-Z_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  });
  return out;
}

const env = { ...bacaEnv(), ...process.env };
const BASE = env.APP_URL || 'http://localhost:3000';
const RAHASIA = env.CRON_SECRET || '';
const JEDA_MS = 60 * 1000;

if (!RAHASIA) {
  console.error('CRON_SECRET belum diisi di .env.local. Isi dulu, lalu jalankan ulang.');
  process.exit(1);
}

async function jalan() {
  try {
    const r = await fetch(BASE + '/api/cron/orders', { headers: { Authorization: 'Bearer ' + RAHASIA } });
    const d = await r.json();
    if (!r.ok) console.log(new Date().toLocaleTimeString('id-ID'), 'gagal:', d.error);
    else if (d.diperbarui) console.log(new Date().toLocaleTimeString('id-ID'), d.diperbarui, 'pesanan diperbarui');
  } catch (e) {
    console.log(new Date().toLocaleTimeString('id-ID'), 'tidak bisa menghubungi server:', e.message);
  }
}

console.log('Pengecekan pesanan berjalan tiap 60 detik ke', BASE);
jalan();
setInterval(jalan, JEDA_MS);
