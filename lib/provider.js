/* Pemanggil API provider (smmsoc.com). Hanya dipakai di sisi server. */

const API_URL = process.env.SMMSOC_API_URL || 'https://smmsoc.com/api/v2';

/* Hanya action dan parameter di daftar ini yang diteruskan ke provider. */
export const ALLOWED = {
  services: [],
  balance: [],
  add: ['service', 'link', 'quantity', 'runs', 'interval', 'comments', 'keywords', 'username', 'min', 'max', 'posts', 'old_posts', 'delay', 'expiry'],
  status: ['order', 'orders'],
  refill: ['order', 'orders'],
  refill_status: ['refill', 'refills'],
  cancel: ['orders']
};

export async function callProvider(action, params = {}) {
  const key = process.env.SMMSOC_API_KEY;
  if (!key) throw new Error('SMMSOC_API_KEY belum diisi di .env.local. Isi dulu, lalu jalankan ulang server.');
  if (!Object.prototype.hasOwnProperty.call(ALLOWED, action)) throw new Error('Action tidak dikenal: ' + String(action));

  const body = new URLSearchParams({ key, action });
  for (const name of ALLOWED[action]) {
    const value = params[name];
    if (value !== undefined && value !== null && value !== '') body.append(name, String(value));
  }

  const r = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  const text = await r.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Balasan provider bukan JSON: ' + text.slice(0, 120));
  }
  if (data && data.error) throw new Error(data.error);
  return data;
}
