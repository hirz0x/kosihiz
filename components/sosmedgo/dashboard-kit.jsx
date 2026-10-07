import React from 'react';

/* Ikon, pemetaan Font Awesome, dan fungsi pembantu murni yang dipakai DashboardPage.
   Dipisah supaya file utamanya lebih ringkas. */

/* Dibuat dari desain canvas SosmedGo. Data di halaman ini masih contoh. */
/* Ikon menu sidebar dari Font Awesome. */
export const FA_MENU = {
  neworder: 'fa-solid fa-cart-shopping',
  services: 'fa-solid fa-file-lines',
  orders: 'fa-solid fa-clipboard-list',
  addfunds: 'fa-solid fa-wallet',
  tickets: 'fa-solid fa-headset',
  updates: 'fa-solid fa-chart-line',
  refunds: 'fa-solid fa-rotate-left',
  massorder: 'fa-solid fa-list-ul',
  affiliates: 'fa-solid fa-users',
  soon: 'fa-solid fa-code'
};

export const FA_BY_PATH = {
  "@lainnya": "fa-solid fa-ellipsis",
  "@linkedin": "fa-brands fa-linkedin",
  "@whatsapp": "fa-brands fa-whatsapp",
  "@google": "fa-brands fa-google",
  "@kick": "fa-solid fa-video",
  "@shopee": "fa-solid fa-bag-shopping",
  "M6 10V7a6 6 0 0 1 12 0v3M5 10h14v11H5z": "fa-solid fa-lock",
  "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2M18 14h2M14 18h6": "fa-solid fa-qrcode",
  "M4 20L20 4M14 4h6v6M5 9l2-2": "fa-solid fa-wand-magic-sparkles",
  "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2": "fa-solid fa-clock",
  "M5 3h14v18H5zM9 8h6M9 12h6M9 16h4": "fa-solid fa-file-invoice",
  "M6 9l6 6 6-6": "fa-solid fa-chevron-down",
  "M12 2l3 6.3 7 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 7-1z": "fa-solid fa-star",
  "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z": "fa-solid fa-gear",
  "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3": "fa-solid fa-right-from-bracket",
  "M9 6l6 6-6 6": "fa-solid fa-chevron-right",
  "M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z": "fa-solid fa-moon",
  "M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19": "fa-solid fa-sun",
  "M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0": "fa-solid fa-bell",
  "M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18": "fa-solid fa-globe",
  "M4 7h16M4 12h16M4 17h16": "fa-solid fa-bars",
  "M6 3h12l3 6-9 12L3 9zM3 9h18": "fa-solid fa-gem",
  "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2": "fa-solid fa-clock-rotate-left",
  "M8 6V4h8v2": "fa-solid fa-bag-shopping",
  "M9 12l2 2 4-4": "fa-solid fa-square-check",
  "M5 12h14M13 6l6 6-6 6": "fa-solid fa-arrow-right",
  "M3 12h4l3-8 4 16 3-8h4": "fa-solid fa-gauge-high",
  "M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4": "fa-solid fa-arrows-up-down",
  "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4": "fa-solid fa-shield",
  "M3 5h18l-7 8v6l-4 2v-8z": "fa-solid fa-filter",
  "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12": "fa-solid fa-sliders",
  "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z": "fa-solid fa-heart",
  "M12 3l10 18H2zM12 10v4M12 17h.01": "fa-solid fa-triangle-exclamation",
  "M2 10h20": "fa-solid fa-credit-card",
  "M12 8h.01M11 12h1v5h1": "fa-solid fa-circle-info",
  "M4 5h16v11H9l-5 4z": "fa-solid fa-comment",
  "M21 3L3 10l7 3 3 7z": "fa-solid fa-paper-plane",
  "M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-6 1-9.5z": "fa-solid fa-fire",
  "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z": "fa-brands fa-instagram",
  "M2 7a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3zM10 8.5v7l6-3.5z": "fa-brands fa-youtube",
  "M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5h.5V7.8a7 7 0 1 0 6.5 6.9V9.4A7 7 0 0 0 21 10.6V7a4 4 0 0 1-4-4z": "fa-brands fa-tiktok",
  "M23 4.6a9 9 0 0 1-2.6.7 4.5 4.5 0 0 0 2-2.5 9 9 0 0 1-2.9 1.1 4.5 4.5 0 0 0-7.7 4.1A12.8 12.8 0 0 1 2.5 3.3a4.5 4.5 0 0 0 1.4 6 4.5 4.5 0 0 1-2-.6v.1a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 18.3a12.8 12.8 0 0 0 6.9 2c8.3 0 12.8-6.9 12.8-12.8v-.6A9 9 0 0 0 23 4.6z": "fa-brands fa-x-twitter",
  "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.6 14.4c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.9-9.3-1-.4.1-.7-.1-.8-.5-.1-.4.1-.7.5-.8 4-.9 7.4-.5 10.2 1.2.3.2.4.6.3.9z": "fa-brands fa-spotify",
  "M21.5 3.5L2.5 11l6 2.2L18 6.5l-7.5 8 .5 6 3.2-4 4.8 3.5z": "fa-brands fa-telegram",
  "M14 22v-8h3l.5-4H14V8c0-1 .3-2 2-2h2V2.3C17.4 2.2 16.3 2 15 2c-3 0-5 1.8-5 5v3H7v4h3v8z": "fa-brands fa-facebook-f",
  "M21 2H3v16h5v4l4-4h5l4-4V2zM11 11V7M16 11V7": "fa-brands fa-twitch",
  "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-3 11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z": "fa-brands fa-reddit-alien",
  "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2c2.8 3 2.8 17 0 20M12 2c-2.8 3-2.8 17 0 20": "fa-solid fa-globe",
  "M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1zM12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2zM9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5": "fa-solid fa-rocket"
};

/* Ikon Font Awesome. Jalur SVG lama dipetakan ke kelas ikon yang sesuai. */
export function FaIcon({ d, size, style }) {
  const cls = FA_BY_PATH[d] || 'fa-solid fa-circle';
  return (
    <i className={cls} aria-hidden="true" style={{ display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center', fontSize: size ? size + 'px' : undefined, width: size ? size + 'px' : undefined, ...style }} />
  );
}

/* Bonus deposit dari peringkat user. Nol kalau data peringkat belum ada atau bentuknya bukan data user. */
export function bonusDariPeringkat(p) {
  return p && p.index !== undefined ? p.tiers[p.index].bonus : 0;
}

/* Bentuk tiket dari server disesuaikan dengan yang dipakai tampilan tiket di halaman ini. */
export function tiketDariApi(t) {
  return { id: t.id, cat: t.kategori, sub: t.sub || '', orderId: t.orderId || '', status: t.status, unread: t.status === 'answered' && !t.userBaca, updated: t.diupdate, msgs: t.pesan.map(function (m) { return { from: m.from === 'admin' ? 'support' : 'user', text: m.text, time: m.time, lampiran: m.lampiran }; }) };
}

/* Batasi jumlah layanan yang tampil supaya halaman tidak berat. */
export function batasiGrup(groups, batas) {
  var sisa = batas, out = [];
  groups.forEach(function (g) {
    if (sisa <= 0) return;
    var items = g.items.slice(0, sisa);
    sisa -= items.length;
    if (items.length) out.push(Object.assign({}, g, { items: items }));
  });
  return out;
}
export function totalGrup(groups) {
  return groups.reduce(function (n, g) { return n + g.items.length; }, 0);
}

