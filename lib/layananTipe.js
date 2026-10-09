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
