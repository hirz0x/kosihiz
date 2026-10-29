/* Konfigurasi tipe layanan provider yang butuh satu parameter tambahan di luar link+jumlah biasa
   (mengikuti SMM Panel API v2 standar yang dipakai smmsoc & likeo). File ini sengaja murni
   data+fungsi tanpa akses server (tidak pakai process.env/fetch/dsb) supaya aman dipakai dari
   client (form pesanan) maupun server (lib/pesanan.js) — satu sumber kebenaran, tidak bisa diam-diam
   beda antara validasi UI dan yang benar-benar dikirim ke provider.

   "match" pakai regex (bukan exact-match) karena provider bisa kirim variasi penulisan jenis
   layanan (mis. "Custom Comments" vs "Custom Comments Package") — "Custom Comments" sudah
   dikonfirmasi langsung ke provider (quantity dari field terpisah diabaikan, dihitung dari banyak
   baris); sisanya (Poll, Mentions, Invites from Groups) mengikuti standar API-nya, jumlahnya sangat
   sedikit jadi belum sempat dites dengan order sungguhan. */
export const EXTRA_FIELD_TYPES = [
  { match: /custom comments?( package)?/i, param: 'comments', label: 'Komentar (satu per baris)', placeholder: 'Komentar pertama\nKomentar kedua\nKomentar ketiga', multiline: true, deriveQty: true, numeric: false },
  { match: /mentions custom list/i, param: 'usernames', label: 'Username yang di-mention, tanpa @ (satu per baris)', placeholder: 'username1\nusername2\nusername3', multiline: true, deriveQty: true, numeric: false },
  { match: /mentions hashtag/i, param: 'hashtags', label: 'Hashtag, tanpa # (satu per baris)', placeholder: 'hashtag1\nhashtag2', multiline: true, deriveQty: false, numeric: false },
  { match: /^poll$/i, param: 'answer_number', label: 'Nomor jawaban polling', placeholder: 'Contoh: 1', multiline: false, deriveQty: false, numeric: true },
  { match: /invites? from groups?/i, param: 'groups', label: 'Link/username grup sumber (satu per baris)', placeholder: 'grup1\ngrup2', multiline: true, deriveQty: false, numeric: false }
];

export function extraFieldFor(jenis) {
  const j = String(jenis || '').trim();
  if (!j) return null;
  return EXTRA_FIELD_TYPES.find((t) => t.match.test(j)) || null;
}

/* Deteksi platform dari teks kategori+nama layanan — kata kunci yang sama dengan yang dipakai
   DashboardPage.jsx buat ikon/tab platform, dipindah ke sini supaya server (lib/pesanan.js) bisa
   mendeteksi platform yang SAMA tanpa duplikat logic yang bisa diam-diam beda dari punya client. */
const PLATFORM_KEYWORDS = [
  ['instagram', 'ig'], ['youtube', 'yt'], ['tiktok', 'tt'], ['twitter', 'tw'], ['spotify', 'sp'],
  ['telegram', 'tg'], ['facebook', 'fb'], ['twitch', 'twitch'], ['reddit', 'rd'], ['linkedin', 'li'],
  ['snapchat', 'sc'], ['coinmarketcap', 'cmc'], ['whatsapp', 'wa'], ['kick', 'kick'], ['shopee', 'shp'],
  ['traffic', 'web']
];

export function deteksiPlatform(teks) {
  const t = String(teks || '').toLowerCase();
  if (t.indexOf('seo') > -1 || t.indexOf('backlink') > -1) return 'seo';
  for (const [kw, kode] of PLATFORM_KEYWORDS) { if (t.indexOf(kw) > -1) return kode; }
  return 'other';
}

/* Banyak pelanggan ketik username/handle polos di kolom Link (tanpa http/https) — provider SELALU
   butuh URL utuh (lihat lib/pesanan.js), jadi sebelumnya ini langsung ditolak dengan pesan error
   "Link harus URL lengkap", bukan diperbaiki otomatis. Pelanggan yang tidak sadar harus nambahin
   https://... sendiri jadi mengira form-nya rusak/tidak bisa dipakai. Base URL per platform di
   bawah dipakai buat melengkapi link itu otomatis SEBELUM divalidasi — provider tetap selalu
   terima URL utuh seperti sebelumnya, cuma pelanggan tidak perlu ngetik https://.../ sendiri lagi.
   Platform yang base URL-nya ambigu (Spotify — bisa artist/playlist/track/episode, Website Traffic,
   SEO Backlink, Lainnya) SENGAJA tidak dimasukkan — auto-tebak base URL-nya berisiko salah/nyasar
   ke alamat yang bukan maksud pelanggan, lebih aman tetap minta URL lengkap buat platform itu. */
const PLATFORM_LINK_BASE = {
  ig: 'https://instagram.com/', tt: 'https://tiktok.com/@', yt: 'https://youtube.com/@',
  tw: 'https://x.com/', tg: 'https://t.me/', fb: 'https://facebook.com/',
  twitch: 'https://twitch.tv/', rd: 'https://reddit.com/u/'
};

export function lengkapiLink(link, platform) {
  const trimmed = String(link || '').trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = PLATFORM_LINK_BASE[platform];
  if (!base) return trimmed;
  const handle = trimmed.replace(/^@+/, '');
  if (!handle || /\s/.test(handle)) return trimmed;
  return base + handle;
}
