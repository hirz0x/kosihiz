/* Pemanggil API provider. Mendukung lebih dari satu provider (smmsoc.com, likeo.net),
   keduanya memakai format SMM API v2 yang sama. Hanya dipakai di sisi server. */

export const PROVIDERS = {
  smmsoc: {
    url: process.env.SMMSOC_API_URL || 'https://smmsoc.com/api/v2',
    key: () => process.env.SMMSOC_API_KEY
  },
  likeo: {
    url: process.env.LIKEO_API_URL || 'https://likeo.net/api/v2',
    key: () => process.env.LIKEO_API_KEY
  }
};

/* Layanan likeo disimpan dengan ID digeser sebesar ini supaya tidak pernah bentrok
   dengan ID layanan smmsoc (kedua provider sama-sama punya ID mentah yang kecil). */
export const LIKEO_ID_OFFSET = 10_000_000;

/* ID mentah yang dikenal provider aslinya (dipakai saat memanggil action 'add', dll). */
export function rawProviderId(service) {
  return service.provider === 'likeo' ? String(Number(service.id) - LIKEO_ID_OFFSET) : service.id;
}

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

export async function callProvider(provider, action, params = {}) {
  const prov = PROVIDERS[provider];
  if (!prov) throw new Error('Provider tidak dikenal: ' + String(provider));
  const key = prov.key();
  if (!key) throw new Error('API key provider "' + provider + '" belum diisi di .env.local. Isi dulu, lalu jalankan ulang server.');
  if (!Object.prototype.hasOwnProperty.call(ALLOWED, action)) throw new Error('Action tidak dikenal: ' + String(action));

  const body = new URLSearchParams({ key, action });
  for (const name of ALLOWED[action]) {
    const value = params[name];
    if (value !== undefined && value !== null && value !== '') body.append(name, String(value));
  }

  const r = await fetch(prov.url, {
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
