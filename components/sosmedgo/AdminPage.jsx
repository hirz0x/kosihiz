import React, { useState, useEffect, useMemo } from 'react';
import Toast from './Toast';
import Head from 'next/head';
import Link from 'next/link';
import { ACCENTS, accentVarsFor } from './theme';
import Markdown from './Markdown';

/* Halaman admin SosmedGo. Gaya mengikuti panel user. Data diambil dari database dan provider. */

const ICON = {
  home: 'M3 10l9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM9 21V12h6v9',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  cart: 'M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2M9 21h.01M18 21h.01',
  wallet: 'M21 12V7H3v12h9M3 11h18M18 15v6M15 18l3 3 3-3',
  money: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  layers: 'M12 2l10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5',
  ticket: 'M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H4zM17 14h3v6h-3z',
  update: 'M3 12h4l3-8 4 16 3-8h4',
  refund: 'M21 12V7H3v12h8M3 11h18M15 18h6M18 15l-3 3 3 3',
  affiliate: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M16 3.1a4 4 0 0 1 0 7.8M22 21a7 7 0 0 0-4-6.3',
  rank: 'M6 3h12l4 6-10 12L2 9zM2 9h20M10 3 8 9l4 12 4-12-2-6',
  lock: 'M6 10V7a6 6 0 0 1 12 0v3M5 10h14v11H5z',
  shield: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2M18 14h2M14 18h6',
  bell: 'M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0',
  chart: 'M4 20h16M7 16v-6M12 16V6M17 16v-3',
  bars: 'M4 7h16M4 12h16M4 17h16',
  back: 'M19 12H5M11 6l-6 6 6 6',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  chev: 'M9 6l6 6-6 6',
  sun: 'M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  moon: 'M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z',
  mode: 'M4 4h16v12H4zM8 20h8M12 16v4'
};

/* Ikon admin dari Font Awesome, sama dengan dashboard user. Kuncinya jalur SVG lama. */
const FA_ADMIN = {
  [ICON.home]: 'fa-solid fa-house',
  [ICON.users]: 'fa-solid fa-users',
  [ICON.cart]: 'fa-solid fa-cart-shopping',
  [ICON.wallet]: 'fa-solid fa-wallet',
  [ICON.money]: 'fa-solid fa-money-bill-wave',
  [ICON.layers]: 'fa-solid fa-layer-group',
  [ICON.ticket]: 'fa-solid fa-headset',
  [ICON.update]: 'fa-solid fa-chart-line',
  [ICON.refund]: 'fa-solid fa-rotate-left',
  [ICON.affiliate]: 'fa-solid fa-user-group',
  [ICON.rank]: 'fa-solid fa-gem',
  [ICON.lock]: 'fa-solid fa-lock',
  [ICON.shield]: 'fa-solid fa-shield-halved',
  [ICON.bell]: 'fa-solid fa-bell',
  [ICON.chart]: 'fa-solid fa-chart-column',
  [ICON.bars]: 'fa-solid fa-bars',
  [ICON.back]: 'fa-solid fa-arrow-left',
  [ICON.logout]: 'fa-solid fa-right-from-bracket',
  [ICON.chev]: 'fa-solid fa-chevron-right',
  [ICON.sun]: 'fa-solid fa-sun',
  [ICON.moon]: 'fa-solid fa-moon',
  [ICON.mode]: 'fa-solid fa-circle-half-stroke'
};

const TABS_MAIN = [
  { id: 'Ringkasan', icon: ICON.home },
  { id: 'Statistik', icon: ICON.chart },
  { id: 'Pengguna', icon: ICON.users },
  { id: 'Pesanan', icon: ICON.cart },
  { id: 'Deposit', icon: ICON.wallet },
  { id: 'Layanan', icon: ICON.layers }
];
const TABS_SUPPORT = [
  { id: 'Tiket', icon: ICON.ticket },
  { id: 'Update', icon: ICON.update },
  { id: 'Refund', icon: ICON.refund },
  { id: 'Afiliasi', icon: ICON.affiliate },
  { id: 'Peringkat', icon: ICON.rank },
  { id: 'Blog', icon: ICON.layers }
];
const TAB_CRUMB = { Ringkasan: 'Ringkasan', Statistik: 'Statistik', Pengguna: 'Pengguna', Pesanan: 'Pesanan', Deposit: 'Deposit', Layanan: 'Layanan', Tiket: 'Tiket', Update: 'Update', Refund: 'Refund', Afiliasi: 'Afiliasi', Peringkat: 'Peringkat', Blog: 'Blog', Pengaturan: 'Pengaturan' };


/* Saldo provider di bawah ini dianggap menipis kalau kurang dari batas ini (dalam Rupiah). */
const PROVIDER_LOW = 500000;

const NOTIF_ITEMS = [
  ['order', 'Pesanan baru', 'Saat ada pesanan masuk'],
  ['deposit', 'Deposit masuk', 'Saat user mengirim deposit'],
  ['ticket', 'Tiket baru', 'Saat user membuka tiket'],
  ['refund', 'Refund diajukan', 'Saat user mengajukan refund'],
  ['withdraw', 'Penarikan afiliasi', 'Saat ada permintaan penarikan']
];



/* dasar = harga modal per 1000. markup = persen tambahan untuk harga jual. */
const SOCIAL_ICON = {
  ig: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
  yt: 'M2 7a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3zM10 8.5v7l6-3.5z',
  tt: 'M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5h.5V7.8a7 7 0 1 0 6.5 6.9V9.4A7 7 0 0 0 21 10.6V7a4 4 0 0 1-4-4z',
  tw: 'M23 4.6a9 9 0 0 1-2.6.7 4.5 4.5 0 0 0 2-2.5 9 9 0 0 1-2.9 1.1 4.5 4.5 0 0 0-7.7 4.1A12.8 12.8 0 0 1 2.5 3.3a4.5 4.5 0 0 0 1.4 6 4.5 4.5 0 0 1-2-.6v.1a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 18.3a12.8 12.8 0 0 0 6.9 2c8.3 0 12.8-6.9 12.8-12.8v-.6A9 9 0 0 0 23 4.6z',
  sp: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.6 14.4c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.9-9.3-1-.4.1-.7-.1-.8-.5-.1-.4.1-.7.5-.8 4-.9 7.4-.5 10.2 1.2.3.2.4.6.3.9z',
  tg: 'M21.5 3.5L2.5 11l6 2.2L18 6.5l-7.5 8 .5 6 3.2-4 4.8 3.5z',
  fb: 'M14 22v-8h3l.5-4H14V8c0-1 .3-2 2-2h2V2.3C17.4 2.2 16.3 2 15 2c-3 0-5 1.8-5 5v3H7v4h3v8z'
};

/* Info layanan untuk riwayat update. Sama dengan daftar di dashboard user. */
/* Ikon platform dari Font Awesome (brand). Kuncinya sama dengan SOCIAL_ICON. */
const SOCIAL_FA = {
  [SOCIAL_ICON.ig]: 'fa-brands fa-instagram',
  [SOCIAL_ICON.yt]: 'fa-brands fa-youtube',
  [SOCIAL_ICON.tt]: 'fa-brands fa-tiktok',
  [SOCIAL_ICON.tw]: 'fa-brands fa-x-twitter',
  [SOCIAL_ICON.sp]: 'fa-brands fa-spotify',
  [SOCIAL_ICON.tg]: 'fa-brands fa-telegram',
  [SOCIAL_ICON.fb]: 'fa-brands fa-facebook-f'
};

/* Jenis perubahan: label, warna latar, warna teks. Sama dengan dashboard user. */
const UPS = {
  up: { label: 'Harga naik', bg: 'rgba(var(--accent-rgb),.1)', fg: 'var(--rt)' },
  down: { label: 'Harga turun', bg: 'rgba(34,197,94,.1)', fg: '#22C55E' },
  off: { label: 'Layanan dinonaktifkan', bg: 'var(--s4)', fg: 'var(--t3)' },
  new: { label: 'Layanan baru ditambahkan', bg: 'rgba(59,130,246,.1)', fg: '#60A5FA' }
};

/* Riwayat perubahan layanan. Data sama dengan halaman Update di dashboard user. */


const LABEL_KATEGORI = { order: 'Pesanan', service: 'Layanan', payment: 'Pembayaran', other: 'Lainnya' };
const LABEL_STATUS_TIKET = { open: 'Terbuka', answered: 'Dibalas', closed: 'Ditutup' };
const LABEL_STATUS_REFUND = { menunggu: 'Menunggu', disetujui: 'Diterima', ditolak: 'Ditolak' };
const refundAdmin = (r) => ({ id: r.id, user: r.username || '—', pesanan: r.pesanan, jumlah: r.jumlah, alasan: r.alasan || '', status: LABEL_STATUS_REFUND[r.status] || r.status });
const tiketAdmin = (t) => ({ id: t.id, user: t.username || '—', kategori: LABEL_KATEGORI[t.kategori] || t.kategori, orderId: t.orderId || '', status: LABEL_STATUS_TIKET[t.status] || t.status, update: t.diupdate, msgs: t.pesan.map((m) => ({ from: m.from, text: m.text, time: m.time })), tingkat: t.tingkat || 0 });



const rp = (n) => 'Rp ' + n.toLocaleString('id-ID');
/* Tanggal WIB dari waktu ISO. */
const tanggalWib = (iso) => new Date(new Date(iso).getTime() + 7 * 3600 * 1000).toISOString().slice(0, 10);

/* Harga jual = harga dasar + markup, dibulatkan ke ratusan rupiah. */
const hargaJual = (s) => Math.round((s.dasar * (1 + s.markup / 100)) / 100) * 100;

const STATUS_COLOR = {
  Aktif: '#22C55E', Selesai: '#22C55E', Berhasil: '#22C55E', Diterima: '#22C55E', Terbit: '#22C55E',
  Diproses: '#60A5FA', Dibalas: '#60A5FA', 'In progress': '#60A5FA', Processing: '#60A5FA', Completed: '#22C55E', Partial: '#F59E0B', Canceled: '#FF5A75', Refunded: '#FF5A75',
  Pending: '#F59E0B', Menunggu: '#F59E0B', Terbuka: '#F59E0B',
  Refund: '#FF5A75', Diblokir: '#FF5A75', Ditolak: '#FF5A75',
  Nonaktif: '#8B8D96', Ditutup: '#8B8D96'
};

const PILL = { Berhasil: '#14532D', Diterima: '#14532D', Selesai: '#14532D', Aktif: '#14532D', Terbit: '#14532D', Menunggu: '#78350F', Pending: '#78350F', Terbuka: '#78350F', Diproses: '#1E3A8A', Dibalas: '#1E3A8A', 'In progress': '#1E3A8A', Processing: '#1E3A8A', Completed: '#14532D', Partial: '#78350F', Canceled: '#7F1D1D', Refunded: '#7F1D1D', Ditolak: '#7F1D1D', Refund: '#7F1D1D', Diblokir: '#7F1D1D', Nonaktif: '#3F3F46', Ditutup: '#3F3F46' };

/* Statistik: rentang tanggal dihitung dari hari ini (WIB). Angkanya diambil dari /api/statistik. */
const TODAY = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
const hariLalu = (n) => new Date(Date.parse(TODAY + 'T00:00:00Z') - n * 86400000).toISOString().slice(0, 10);
const RANGE_OPTS = ['7 Hari', '30 Hari', 'Bulan Ini', 'Bulan Lalu', 'Sepanjang Waktu', 'Custom'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const CHART_COLORS = {
  dark: { deposit: '#3457F0', revenue: '#F5A524', order: '#34D377', komisi: '#A78BFA' },
  light: { deposit: '#2446D6', revenue: '#D97706', order: '#16A34A', komisi: '#7C3AED' }
};
const CHART_SERIES = [
  { key: 'deposit', name: 'Deposit', axis: 'left' },
  { key: 'revenue', name: 'Revenue', axis: 'left' },
  { key: 'order', name: 'Pesanan', axis: 'right' },
  { key: 'komisi', name: 'Komisi', axis: 'left' }
];
const W = 900, PL = 12, PR = 12, PT = 16, PB = 34;

function Svg({ d, size = 17 }) {
  return (
    <i className={FA_ADMIN[d] || 'fa-solid fa-circle'} aria-hidden="true" style={{ display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center', fontSize: size + 'px', width: size + 'px' }} />
  );
}

function Badge({ text }) {
  const c = STATUS_COLOR[text] || '#A1A3AB';
  return (
    <span className="pill" style={{ color: '#F4F4F5', background: PILL[text] || '#3F3F46', border: '1px solid ' + c + '55' }}>{text}</span>
  );
}

function StatCard({ s }) {
  return (
    <div className="card" style={{ padding: '16px 14px 12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ width: '42px', height: '42px', flex: 'none', borderRadius: '10px', background: s.tint, border: '1px solid ' + s.line, color: s.c, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Svg d={s.icon} size={18} sw={2} />
        </span>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--t4)' }}>{s.l}</div>
          <div style={{ fontSize: '21px', fontWeight: '700', marginTop: '3px', letterSpacing: '-.02em' }}>{s.v}</div>
          {s.sub ? <div style={{ fontSize: '11px', color: s.subColor || 'var(--t4)', marginTop: '4px' }}>{s.sub}</div> : null}
        </div>
      </div>
      {s.onClick ? (
        <button type="button" onClick={s.onClick} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: '600', color: s.c, background: s.tint, border: '1px solid ' + s.line, borderRadius: '8px', padding: '10px 12px', cursor: 'pointer' }}>
          {s.a} <span>→</span>
        </button>
      ) : null}
    </div>
  );
}

function Toggle({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className="sw" style={{ background: on ? 'var(--accent)' : 'var(--b5)' }}>
      <span style={{ left: on ? '21px' : '3px' }} />
    </button>
  );
}

function resolveRange(r, from, to) {
  switch (r) {
    case '7 Hari': return [hariLalu(6), TODAY];
    case '30 Hari': return [hariLalu(29), TODAY];
    case 'Bulan Ini': return [TODAY.slice(0, 8) + '01', TODAY];
    case 'Bulan Lalu': {
      const akhir = new Date(Date.parse(TODAY.slice(0, 8) + '01T00:00:00Z') - 86400000).toISOString().slice(0, 10);
      return [akhir.slice(0, 8) + '01', akhir];
    }
    case 'Sepanjang Waktu': return ['2026-07-01', TODAY];
    default: return [from, to];
  }
}

function daysBetween(a, b) {
  if (!a || !b) return [];
  const [s, e] = a <= b ? [a, b] : [b, a];
  const out = [];
  for (let t = Date.parse(s + 'T00:00:00Z'), end = Date.parse(e + 'T00:00:00Z'); t <= end; t += 86400000) {
    out.push(new Date(t).toISOString().slice(0, 10));
  }
  return out;
}

const rnd = (x) => { const v = Math.sin(x * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); };

function niceMax(m) {
  if (m <= 0) return 4000;
  const step = 10 ** Math.floor(Math.log10(m)) / 2;
  return (Math.floor(m / step) + 1) * step;
}

function niceCount(m) {
  if (m <= 0) return 4;
  return Math.ceil(m / 4) * 4;
}

const fmtRb = (n) => (n >= 1000 ? Math.round(n / 1000) + 'rb' : String(n));
const fmtDay = (iso) => { const [, m, d] = iso.split('-'); return Number(d) + ' ' + MON[Number(m) - 1]; };

function smoothPath(pts) {
  const n = pts.length;
  if (n < 2) return n ? `M${pts[0].x},${pts[0].y}` : '';
  const m = [];
  for (let i = 0; i < n - 1; i++) m.push((pts[i + 1].y - pts[i].y) / (pts[i + 1].x - pts[i].x));
  const t = [m[0]];
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2);
  t.push(m[n - 2]);
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const dx = (pts[i + 1].x - pts[i].x) / 3;
    d += `C${pts[i].x + dx},${pts[i].y + t[i] * dx} ${pts[i + 1].x - dx},${pts[i + 1].y - t[i + 1] * dx} ${pts[i + 1].x},${pts[i + 1].y}`;
  }
  return d;
}

/* Grafik garis dengan dua sumbu Y, area gradasi, dan tooltip saat hover. Lebar mengikuti kontainer. */
function TrendChart({ data, series }) {
  const box = React.useRef(null);
  const rectRef = React.useRef(null);
  const frame = React.useRef(0);
  const pointerX = React.useRef(0);
  const uid = React.useId();
  const [width, setWidth] = React.useState(900);
  const [hover, setHover] = React.useState(null);
  const [hoverX, setHoverX] = React.useState(0);

  React.useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const ro = new ResizeObserver((entries) => setWidth(Math.max(320, entries[0].contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const n = data.length;
  const H = 420, PLc = 64, PRc = 60, PTc = 18, PBc = 40;
  const plotW = width - PLc - PRc;
  const plotH = H - PTc - PBc;
  const base = PTc + plotH;

  const { xs, yAt, staticLayer } = React.useMemo(() => {
    const left = series.filter((s) => s.axis === 'left');
    const right = series.filter((s) => s.axis === 'right');
    const lMax = niceMax(Math.max(0, ...data.flatMap((d) => left.map((s) => d[s.key]))));
    const rMax = niceCount(Math.max(0, ...data.flatMap((d) => right.map((s) => d[s.key]))));
    const xPos = data.map((_, i) => PLc + (n <= 1 ? plotW / 2 : (i * plotW) / (n - 1)));
    const yFn = (s, v) => PTc + plotH - (v / (s.axis === 'left' ? lMax : rMax)) * plotH;
    const step = n <= 10 ? 1 : Math.ceil(n / 8);

    const layer = (
      <>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`${uid}-${s.key}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={s.color} stopOpacity="0.28" />
              <stop offset="1" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {[0, 1, 2, 3, 4].map((i) => {
          const y = PTc + (plotH * i) / 4;
          return (
            <g key={i}>
              <line x1={PLc} x2={width - PRc} y1={y} y2={y} style={{ stroke: 'var(--b2)' }} strokeWidth="1" />
              <text x={PLc - 10} y={y + 4} textAnchor="end" fontSize="14" style={{ fill: 'var(--t5)' }}>{fmtRb((lMax * (4 - i)) / 4)}</text>
              <text x={width - PRc + 10} y={y + 4} textAnchor="start" fontSize="14" style={{ fill: 'var(--t5)' }}>{Math.round((rMax * (4 - i)) / 4)}</text>
            </g>
          );
        })}
        {series.map((s) => {
          const pts = data.map((d, i) => ({ x: xPos[i], y: yFn(s, d[s.key]) }));
          const line = smoothPath(pts);
          const area = `${line}L${pts[n - 1].x},${base}L${pts[0].x},${base}Z`;
          return (
            <g key={s.key}>
              <path d={area} fill={`url(#${uid}-${s.key})`} />
              <path d={line} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            </g>
          );
        })}
        {data.map((d, i) => (i % step === 0 || i === n - 1) ? (
          <text key={d.date} x={xPos[i]} y={H - 10} fontSize="14" textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'} style={{ fill: 'var(--t5)' }}>{fmtDay(d.date)}</text>
        ) : null)}
      </>
    );
    return { xs: xPos, yAt: yFn, staticLayer: layer };
  }, [data, series, width]);

  const onPointerMove = (e) => {
    pointerX.current = e.clientX;
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const r = rectRef.current || box.current.getBoundingClientRect();
      /* Garis penanda mengikuti kursor secara halus. Titik data memakai tanggal terdekat. */
      const x = Math.min(width - PRc, Math.max(PLc, pointerX.current - r.left));
      const i = Math.round(((x - PLc) / plotW) * (n - 1));
      setHover(Math.min(n - 1, Math.max(0, i)));
      setHoverX(x);
    });
  };
  const onPointerLeave = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    setHover(null);
  };

  const tipLeft = hover !== null ? (hoverX / width) * 100 : 0;

  return (
    <div
      ref={box}
      style={{ position: 'relative', outline: 'none' }}
      tabIndex={0}
      aria-label="Grafik tren. Gunakan panah kiri dan kanan untuk memilih tanggal."
      onPointerEnter={() => { rectRef.current = box.current.getBoundingClientRect(); }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onKeyDown={(e) => {
        if (e.key === 'Escape') return setHover(null);
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        const cur = hover ?? n - 1;
        const next = e.key === 'ArrowRight' ? Math.min(n - 1, cur + 1) : Math.max(0, cur - 1);
        setHover(next);
        setHoverX(xs[next]);
      }}
    >
      <svg width={width} height={H} style={{ display: 'block' }} aria-hidden="true">
        {staticLayer}
        {hover !== null ? (
          <g>
            <line x1={hoverX} x2={hoverX} y1={PTc} y2={base} style={{ stroke: 'var(--t5)' }} strokeWidth="1" strokeDasharray="3 3" />
            {series.map((s) => (
              <circle key={s.key} cx={xs[hover]} cy={yAt(s, data[hover][s.key])} r="4" fill={s.color} strokeWidth="2" style={{ stroke: 'var(--s1)', transition: 'cx .12s ease-out, cy .12s ease-out' }} />
            ))}
          </g>
        ) : null}
      </svg>
      {hover !== null ? (
        <div role="status" style={{
          position: 'absolute', top: '6px', pointerEvents: 'none', zIndex: 2,
          left: tipLeft + '%', transition: 'left .12s ease-out',
          transform: tipLeft > 60 ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
          background: 'var(--s2)', border: '1px solid var(--b5)', borderRadius: '10px',
          padding: '10px 12px', minWidth: '220px', boxShadow: '0 16px 32px rgba(0,0,0,.45)', fontSize: '14px'
        }}>
          <div style={{ color: 'var(--t3)', marginBottom: '6px' }}>{fmtDay(data[hover].date)}</div>
          {series.map((s) => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '2px 0' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flex: 'none' }} />
              <span style={{ color: 'var(--t3)' }}>{s.name}</span>
              <span style={{ marginLeft: 'auto', paddingLeft: '16px', fontWeight: '700', color: 'var(--hi)', fontVariantNumeric: 'tabular-nums' }}>
                {s.key === 'order' ? data[hover][s.key] + ' pesanan' : rp(data[hover][s.key])}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TrendTable({ rows }) {
  return (
    <div style={{ overflowX: 'auto', maxHeight: '420px' }}>
      <table className="tbl" style={{ fontVariantNumeric: 'tabular-nums' }}>
        <thead><tr><th>Tanggal</th><th>Deposit</th><th>Revenue</th><th>Komisi</th><th>Order</th></tr></thead>
        <tbody>
          {rows.map((d) => (
            <tr key={d.date}>
              <td className="muted">{d.date}</td>
              <td>{rp(d.deposit)}</td>
              <td>{rp(d.revenue)}</td>
              <td>{rp(d.komisi)}</td>
              <td>{d.order}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrdersTable({ rows }) {
  return (
    <table className="tbl">
      <thead>
        <tr><th>ID</th><th>Provider</th><th>Layanan</th><th>Link</th><th>Jumlah</th><th>Biaya</th><th>Status</th><th>Dibuat</th><th>Durasi</th></tr>
      </thead>
      <tbody>
        {rows.map((o) => (
          <tr key={o.id}>
            <td className="muted">{o.id}</td>
            <td className="muted">{o.providerOrder}</td>
            <td style={{ whiteSpace: 'normal', minWidth: '240px', maxWidth: '360px' }}>{o.layananNama}</td>
            <td className="muted" style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.link}</td>
            <td>{Number(o.jumlah).toLocaleString('id-ID')}</td>
            <td>{rp(o.biaya)}</td>
            <td><Badge text={o.status} /></td>
            <td className="muted">{String(o.dibuat).slice(0, 16).replace('T', ' ')}</td>
            <td>{o.selesaiAt ? 'Selesai dalam ' + Math.max(0, Math.round((new Date(o.selesaiAt) - new Date(o.dibuat)) / 60000)) + ' menit' : (['Completed', 'Canceled', 'Refunded', 'Partial'].includes(o.status) ? '—' : 'Berjalan ' + Math.max(0, Math.round((Date.now() - new Date(o.dibuat)) / 60000)) + ' menit')}</td>
          </tr>
        ))}
        {rows.length === 0 && <tr><td colSpan={8} className="muted">Belum ada pesanan.</td></tr>}
      </tbody>
    </table>
  );
}

export default function AdminPage() {
  const [theme, setTheme] = useState('dark');
  const [themeMode, setThemeMode] = useState('dark');
  const [accent, setAccent] = useState('red');
  const [tab, setTab] = useState('Ringkasan');
  const [navOpen, setNavOpen] = useState(false);
  const bukaTab = (t) => { setTab(t); setNavOpen(false); };
  const [q, setQ] = useState('');
  const [pengguna, setPengguna] = useState([]);
  const [saldoProv, setSaldoProv] = useState({ saldo: null, currency: '', error: '' });
  const saldoTxt = saldoProv.saldo === null ? '—' : (saldoProv.currency && saldoProv.currency !== 'IDR' ? saldoProv.saldo + ' ' + saldoProv.currency : rp(saldoProv.saldo));
  const provMenipis = saldoProv.saldo !== null && (!saldoProv.currency || saldoProv.currency === 'IDR') && saldoProv.saldo < PROVIDER_LOW;
  const muatPengguna = () => fetch('/api/pengguna').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d && Array.isArray(d.pengguna)) setPengguna(d.pengguna); }).catch(() => {});
  const [orderFilter, setOrderFilter] = useState('Semua');
  const [deposits, setDeposits] = useState([]);
  const muatDeposit = () => fetch('/api/deposits').then((r) => r.json()).then((d) => {
    if (Array.isArray(d.deposits)) setDeposits(d.deposits.map((x) => ({ id: x.id, user: x.username || x.userId, metode: x.metode, nominal: x.nominal, waktu: String(x.dibuat).slice(0, 16).replace('T', ' '), status: x.label })));
  }).catch(() => {});
  const [services, setServices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const muatTiket = () => fetch('/api/tickets').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d && Array.isArray(d.tickets)) setTickets(d.tickets.map(tiketAdmin)); }).catch(() => {});
  const [selTicket, setSelTicket] = useState(null);
  const [reply, setReply] = useState('');
  const [refunds, setRefunds] = useState([]);
  const muatRefund = () => fetch('/api/refunds').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d && Array.isArray(d.refunds)) setRefunds(d.refunds.map(refundAdmin)); }).catch(() => {});
  const [ringkasAfiliasi, setRingkasAfiliasi] = useState({ totalAfiliasi: 0, totalKomisi: 0, komisiTersedia: 0 });
  const muatAfiliasiAdmin = () => fetch('/api/affiliates').then((r) => (r.ok ? r.json() : null)).then((d) => {
    if (d && typeof d.totalAfiliasi === 'number') setRingkasAfiliasi({ totalAfiliasi: d.totalAfiliasi, totalKomisi: d.totalKomisi, komisiTersedia: d.komisiTersedia });
  }).catch(() => {});
  const [ranks, setRanks] = useState([]);
  const muatPeringkat = () => fetch('/api/peringkat').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d && Array.isArray(d.tiers)) setRanks(d.tiers); }).catch(() => {});
  const simpanPeringkat = async () => {
    const r = await fetch('/api/peringkat', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mins: ranks.map((x) => x.min) }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { tampilkanToast(false, d.error || 'Gagal menyimpan peringkat.'); return; }
    tampilkanToast(true, 'Batas peringkat tersimpan.');
    await muatPeringkat();
  };
  /* Blog: artikel disimpan sebagai satu daftar utuh lewat /api/artikel. artikelSel: -1 tertutup, -2 artikel baru, >=0 indeks yang diubah. */
  const [artikelList, setArtikelList] = useState([]);
  const [artikelSel, setArtikelSel] = useState(-1);
  const kosongArtikel = { slug: '', judul: '', ringkasan: '', tanggal: TODAY, isiTeks: '', gambar: '', terbit: true };
  const [artikelForm, setArtikelForm] = useState(kosongArtikel);
  const [artikelBusy, setArtikelBusy] = useState(false);
  const [artikelPratinjau, setArtikelPratinjau] = useState(false);
  const muatArtikel = () => fetch('/api/artikel').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d && Array.isArray(d.artikel)) setArtikelList(d.artikel); }).catch(() => {});
  useEffect(() => { if (tab === 'Blog') muatArtikel(); }, [tab]);
  const pilihArtikel = (i) => {
    const a = artikelList[i];
    setArtikelSel(i);
    setArtikelForm({ slug: a.slug, judul: a.judul, ringkasan: a.ringkasan, tanggal: a.tanggal, isiTeks: typeof a.isi === 'string' ? a.isi : (a.isi || []).join('\n\n'), gambar: a.gambar || '', terbit: a.terbit !== false });
    setArtikelPratinjau(false);
  };
  const artikelBaru = () => { setArtikelSel(-2); setArtikelForm(kosongArtikel); setArtikelPratinjau(false); };
  /* Foto diperkecil di browser (lebar maks 1200px, JPEG) supaya tetap muat di database. */
  const pilihGambar = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { tampilkanToast(false, 'Foto harus JPG, PNG, atau WEBP.'); return; }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const skala = Math.min(1, 1200 / img.width);
      const kanvas = document.createElement('canvas');
      kanvas.width = Math.round(img.width * skala);
      kanvas.height = Math.round(img.height * skala);
      const ctx = kanvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, kanvas.width, kanvas.height);
      ctx.drawImage(img, 0, 0, kanvas.width, kanvas.height);
      const hasil = kanvas.toDataURL('image/jpeg', 0.82);
      URL.revokeObjectURL(url);
      if (hasil.length > 450000) { tampilkanToast(false, 'Foto masih terlalu besar. Pakai foto yang lebih kecil.'); return; }
      setArtikelForm((f) => ({ ...f, gambar: hasil }));
    };
    img.onerror = () => { URL.revokeObjectURL(url); tampilkanToast(false, 'Foto tidak bisa dibaca.'); };
    img.src = url;
  };
  const kirimArtikel = async (daftar) => {
    const r = await fetch('/api/artikel', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ artikel: daftar }) });
    const d = await r.json().catch(() => ({}));
    return { ok: r.ok, d };
  };
  const simpanArtikel = async () => {
    const baru = { slug: artikelForm.slug, judul: artikelForm.judul, ringkasan: artikelForm.ringkasan, tanggal: artikelForm.tanggal, isi: artikelForm.isiTeks, gambar: artikelForm.gambar, terbit: artikelForm.terbit };
    const daftar = artikelSel >= 0 ? artikelList.map((a, i) => (i === artikelSel ? baru : a)) : [...artikelList, baru];
    setArtikelBusy(true);
    const { ok, d } = await kirimArtikel(daftar);
    setArtikelBusy(false);
    if (!ok) { tampilkanToast(false, d.error || 'Gagal menyimpan artikel.'); return; }
    tampilkanToast(true, 'Artikel tersimpan.');
    setArtikelList(d.artikel);
    setArtikelSel(-1);
    setArtikelForm(kosongArtikel);
  };
  const hapusArtikel = async (i) => {
    if (!window.confirm('Hapus artikel "' + artikelList[i].judul + '"?')) return;
    const { ok, d } = await kirimArtikel(artikelList.filter((_, j) => j !== i));
    if (!ok) { tampilkanToast(false, d.error || 'Gagal menghapus artikel.'); return; }
    tampilkanToast(true, 'Artikel dihapus.');
    setArtikelList(d.artikel);
    setArtikelSel(-1);
  };
  const [kurs, setKurs] = useState(16000);
  const [massMarkup, setMassMarkup] = useState('');
  const [selSvc, setSelSvc] = useState({});
  const [svcQ, setSvcQ] = useState('');
  const [svcCat, setSvcCat] = useState('all');
  const [svcPage, setSvcPage] = useState(1);
  const [kursDirty, setKursDirty] = useState(false);
  const [svcDirty, setSvcDirty] = useState({});
  const [svcSaving, setSvcSaving] = useState(false);
  const [syncedAt, setSyncedAt] = useState(null);
  const [liveOrders, setLiveOrders] = useState([]);
  const [ordersBusy, setOrdersBusy] = useState(false);
  const [ordersMsg, setOrdersMsg] = useState(null);
  const [updLog, setUpdLog] = useState([]);
  const hapusRiwayatAdmin = async (rid) => {
    if (!window.confirm('Hapus catatan riwayat ini? Layanannya tidak ikut terhapus.')) return;
    const r = await fetch('/api/riwayat?id=' + encodeURIComponent(rid), { method: 'DELETE' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { tampilkanToast(false, d.error || 'Gagal menghapus riwayat.'); return; }
    tampilkanToast(true, 'Catatan riwayat dihapus.');
    await muatRiwayat();
  };
  const muatRiwayat = () => fetch('/api/riwayat').then((r) => (r.ok ? r.json() : null)).then((d) => {
    if (d && Array.isArray(d.riwayat)) setUpdLog(d.riwayat.map((x) => ({ rid: x.id, date: x.tanggal, id: x.layananId, type: x.tipe, from: x.lama, to: x.baru })));
  }).catch(() => {});
  const [updF, setUpdF] = useState('all');
  const [depF, setDepF] = useState('Semua');
  const [siap, setSiap] = useState(false);
  /* Kalau data layanan lambat atau gagal, layar pemuatan tetap berakhir setelah beberapa detik. */
  useEffect(() => {
    const t = setTimeout(() => setSiap(true), 4000);
    return () => clearTimeout(t);
  }, []);
  const [undian, setUndian] = useState(null);
  const muatUndian = () => fetch('/api/undian').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) setUndian(d); }).catch(() => {});
  const undiUndian = async () => {
    if (!window.confirm('Undi pemenang undian bulan ini sekarang? Hanya bisa dilakukan sekali per bulan.')) return;
    const r = await fetch('/api/undian', { method: 'POST' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { tampilkanToast(false, d.error || 'Undian gagal.'); return; }
    tampilkanToast(true, 'Pemenang: ' + d.pemenang.username + '. Hadiah sudah masuk ke saldo.');
    await muatUndian();
  };
  const [toast, setToast] = useState(null);
  const tampilkanToast = (ok, text) => setToast({ ok, text });
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);
  const [supportProfil, setSupportProfil] = useState({ nama: 'Tim Support', inisial: 'SG' });
  const simpanSupport = async () => {
    const r = await fetch('/api/support', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(supportProfil) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { tampilkanToast(false, d.error || 'Gagal menyimpan profil support.'); return; }
    setSupportProfil({ nama: d.nama, inisial: d.inisial });
    tampilkanToast(true, 'Profil tim support tersimpan.');
  };
  const [rec, setRec] = useState({ id: '', tipe: 'up', lama: '', baru: '' });
  /* Pilih layanan pertama dari katalog asli, begitu katalog dimuat. */
  useEffect(() => {
    if (services.length && !services.some((s) => String(s.id) === rec.id)) setRec((r) => ({ ...r, id: String(services[0].id) }));
  }, [services]);
  const [settingsTab, setSettingsTab] = useState('Keamanan');
  const [pwOld, setPwOld] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwNew2, setPwNew2] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [twofa, setTwofa] = useState(false);
  const [notif, setNotif] = useState({ order: true, deposit: true, ticket: true, refund: true, withdraw: true });
  const [range, setRange] = useState('7 Hari');
  const [cFrom, setCFrom] = useState(hariLalu(6));
  const [cTo, setCTo] = useState(TODAY);
  const [showTable, setShowTable] = useState(false);
  const [statistik, setStatistik] = useState({ cur: [], prev: [], komisiTersedia: 0 });

  const isDark = theme === 'dark';
  const colors = isDark ? CHART_COLORS.dark : CHART_COLORS.light;
  const series = CHART_SERIES.map((s) => ({ ...s, color: colors[s.key] }));
  const accentVars = accentVarsFor({ accent, theme });
  const A = ACCENTS[accent] || ACCENTS.red;

  const users = pengguna.filter((u) => u.username.toLowerCase().includes(q.toLowerCase()));
  const orders = liveOrders.filter((o) => orderFilter === 'Semua' || o.status === orderFilter);
  const pendingDeposits = deposits.filter((d) => d.status === 'Menunggu').length;
  useEffect(() => { muatDeposit(); }, []);
  useEffect(() => { muatTiket(); }, []);
  useEffect(() => { muatRefund(); }, []);
  useEffect(() => { muatAfiliasiAdmin(); }, []);
  useEffect(() => { muatPeringkat(); }, []);
  useEffect(() => { muatUndian(); }, []);
  useEffect(() => { muatRiwayat(); }, []);
  useEffect(() => { fetch('/api/support').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d && d.nama) setSupportProfil({ nama: d.nama, inisial: d.inisial }); }).catch(() => {}); }, []);
  useEffect(() => { muatPengguna(); }, []);
  useEffect(() => {
    fetch('/api/provider', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'balance' }) })
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok || d.error) throw new Error(d.error || 'Gagal mengambil saldo provider.');
        setSaldoProv({ saldo: Number(d.balance), currency: d.currency || '', error: '' });
      })
      .catch((e) => setSaldoProv({ saldo: null, currency: '', error: e.message || 'Gagal mengambil saldo provider.' }));
  }, []);
  const openTickets = tickets.filter((t) => t.status !== 'Ditutup').length;
  const pendingRefunds = refunds.filter((r) => r.status === 'Menunggu').length;
  const badges = { Deposit: pendingDeposits, Tiket: openTickets, Refund: pendingRefunds };
  const totalPending = pendingDeposits + openTickets + pendingRefunds;
  const ticket = tickets.find((t) => t.id === selTicket) || null;
  const [rFrom, rTo] = resolveRange(range, cFrom, cTo);
  const trend = statistik.cur;
  const trendTotals = trend.reduce((acc, d) => ({
    deposit: acc.deposit + d.deposit, revenue: acc.revenue + d.revenue,
    komisi: acc.komisi + d.komisi, order: acc.order + d.order
  }), { deposit: 0, revenue: 0, komisi: 0, order: 0 });
  const prevDays = (() => {
    const days = daysBetween(rFrom, rTo);
    if (!days.length) return [];
    const n = days.length;
    const shift = (k) => new Date(Date.parse(days[0] + 'T00:00:00Z') + k * 86400000).toISOString().slice(0, 10);
    return daysBetween(shift(-n), shift(-1));
  })();
  const prevTotals = statistik.prev.reduce((acc, d) => ({
    deposit: acc.deposit + d.deposit, revenue: acc.revenue + d.revenue,
    komisi: acc.komisi + d.komisi, order: acc.order + d.order
  }), { deposit: 0, revenue: 0, komisi: 0, order: 0 });
  const prevFrom = prevDays.length ? prevDays[0] : '';
  const prevTo = prevDays.length ? prevDays[prevDays.length - 1] : '';
  useEffect(() => {
    if (!rFrom || !rTo) return undefined;
    let batal = false;
    const ambil = (dari, sampai) => (dari && sampai
      ? fetch('/api/statistik?from=' + dari + '&to=' + sampai).then((r) => (r.ok ? r.json() : null))
      : Promise.resolve(null));
    Promise.all([ambil(rFrom, rTo), ambil(prevFrom, prevTo)]).then(([cur, prev]) => {
      if (batal) return;
      setStatistik({
        cur: cur && Array.isArray(cur.hari) ? cur.hari : [],
        prev: prev && Array.isArray(prev.hari) ? prev.hari : [],
        komisiTersedia: cur && typeof cur.komisiTersedia === 'number' ? cur.komisiTersedia : 0
      });
    }).catch(() => {});
    return () => { batal = true; };
  }, [rFrom, rTo, prevFrom, prevTo]);
  const compareLine = (cur, prev) => {
    if (!prevDays.length || prev <= 0) return { sub: 'Tidak ada data pembanding', subColor: 'var(--t5)' };
    const p = Math.round(((cur - prev) / prev) * 100);
    return p >= 0
      ? { sub: '▲ naik ' + p + '% dibanding periode sebelumnya', subColor: '#22C55E' }
      : { sub: '▼ turun ' + Math.abs(p) + '% dibanding periode sebelumnya', subColor: '#FF5A75' };
  };

  const setDepositStatus = (id, status) => {
    const aksi = status === 'Berhasil' ? 'setujui' : 'tolak';
    fetch('/api/deposits', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, aksi }) })
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then((res) => { if (!res.ok) tampilkanToast(false, res.d.error); else tampilkanToast(true, status === 'Berhasil' ? 'Deposit disetujui. Saldo user sudah bertambah.' : 'Deposit ditolak.'); muatDeposit(); })
      .catch(() => muatDeposit());
  };
  const toggleService = (id) => { setServices((list) => list.map((s) => (s.id === id ? { ...s, aktif: !s.aktif } : s))); tandai([id]); };
  const setRefundStatus = async (id, aksi) => {
    const r = await fetch('/api/refunds', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, aksi }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { tampilkanToast(false, d.error || 'Gagal memproses refund.'); return; }
    tampilkanToast(true, aksi === 'setujui' ? 'Refund disetujui. Saldo user sudah bertambah.' : 'Refund ditolak.');
    await muatRefund();
  };
  const setRankMin = (i, val) => setRanks((list) => list.map((r, j) => (j === i ? { ...r, min: Math.max(0, Number(val) || 0) } : r)));

  /* Katalog dan pesanan diambil dari penyimpanan di server. */
  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((d) => {
        setSiap(true);
        if (Array.isArray(d.services)) setServices(d.services);
        if (d.settings && d.settings.kurs) setKurs(d.settings.kurs);
        if (d.disinkron) setSyncedAt(d.disinkron);
      })
      .catch(() => {});
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.orders)) setLiveOrders(d.orders); })
      .catch(() => {});
  }, []);

  const [provBusy, setProvBusy] = useState(false);
  const [provMsg, setProvMsg] = useState(null);

  /* Panggilan selalu lewat server kita, supaya API key tidak ikut ke browser. */
  const callProvider = async (action, params) => {
    const r = await fetch('/api/provider', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...params })
    });
    const data = await r.json();
    if (!r.ok || (data && data.error)) throw new Error((data && data.error) || 'Gagal memanggil provider.');
    return data;
  };

  const cekProvider = async () => {
    setProvBusy(true);
    setProvMsg(null);
    try {
      const d = await callProvider('balance');
      setProvMsg({ ok: true, text: 'Tersambung. Saldo provider: ' + d.balance + ' ' + (d.currency || '') });
    } catch (e) {
      setProvMsg({ ok: false, text: e.message });
    }
    setProvBusy(false);
  };

  const importServices = async () => {
    setProvBusy(true);
    setProvMsg(null);
    try {
      const r = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kurs })
      });
      const d = await r.json();
      if (!r.ok || d.error) throw new Error(d.error || 'Gagal menarik layanan.');
      const katalog = await (await fetch('/api/services')).json();
      setServices(katalog.services || []);
      setSyncedAt(katalog.disinkron || null);
      setSelSvc({});
      setSvcDirty({});
      setSvcQ('');
      setSvcCat('all');
      setSvcPage(1);
      setProvMsg({ ok: true, text: d.jumlah + ' layanan dari ' + d.kategori + ' kategori tersimpan. Markup yang sudah diatur tetap dipertahankan.' });
    } catch (e) {
      setProvMsg({ ok: false, text: e.message });
    }
    setProvBusy(false);
  };

  const usd = (rupiah) => '$' + (rupiah / kurs).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const SVC_PER_PAGE = 50;
  /* Hasil hitungan berat disimpan, supaya tidak diulang tiap kali layar berubah. */
  const svcCats = useMemo(() => Array.from(new Set(services.map((x) => x.kategori).filter(Boolean))).sort(), [services]);
  /* Nama layanan diubah ke huruf kecil sekali saja, bukan tiap render. */
  const svcIndex = useMemo(() => services.map((x) => (x.nama + ' ' + x.id).toLowerCase()), [services]);
  const svcFiltered = useMemo(() => {
    const q = svcQ.trim().toLowerCase();
    return services.filter((x, i) => {
      if (svcCat !== 'all' && x.kategori !== svcCat) return false;
      return q === '' || svcIndex[i].includes(q);
    });
  }, [services, svcIndex, svcQ, svcCat]);
  const svcPages = Math.max(1, Math.ceil(svcFiltered.length / SVC_PER_PAGE));
  const svcPageSafe = Math.min(svcPage, svcPages);
  const svcRows = svcFiltered.slice((svcPageSafe - 1) * SVC_PER_PAGE, svcPageSafe * SVC_PER_PAGE);
  const selectedIds = useMemo(() => svcFiltered.map((x) => x.id).filter((id) => selSvc[id]), [svcFiltered, selSvc]);
  const selCount = selectedIds.length;
  const allSelected = useMemo(() => svcFiltered.length > 0 && svcFiltered.every((x) => selSvc[x.id]), [svcFiltered, selSvc]);
  const toggleAll = () => setSelSvc(allSelected ? {} : Object.fromEntries(svcFiltered.map((x) => [x.id, true])));
  const toggleSel = (id) => setSelSvc((m) => ({ ...m, [id]: !m[id] }));
  const tandai = (ids) => setSvcDirty((d) => { const n = { ...d }; ids.forEach((id) => { n[id] = true; }); return n; });

  const dirtyCount = Object.keys(svcDirty).length;
  const adaPerubahan = dirtyCount > 0 || kursDirty;
  const labelSimpan = svcSaving
    ? 'Menyimpan...'
    : dirtyCount > 0
      ? 'Simpan ' + dirtyCount + ' perubahan'
      : kursDirty
        ? 'Simpan kurs'
        : 'Semua perubahan tersimpan';

  const simpanLayanan = async () => {
    const ids = Object.keys(svcDirty);
    setSvcSaving(true);
    try {
      const updates = services.filter((x) => svcDirty[x.id]).map((x) => ({ id: x.id, markup: x.markup, aktif: x.aktif }));
      const r = await fetch('/api/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates, kurs })
      });
      const d = await r.json();
      if (!r.ok || d.error) throw new Error(d.error || 'Gagal menyimpan.');
      setSvcDirty({});
      setKursDirty(false);
      tampilkanToast(true, 'Perubahan layanan tersimpan.');
      /* Kurs baru mengubah harga dasar di server, jadi katalog dimuat ulang. */
      const segar = await (await fetch('/api/services')).json();
      if (Array.isArray(segar.services) && segar.services.length) setServices(segar.services);
      setProvMsg({ ok: true, text: ids.length ? ids.length + ' layanan tersimpan.' : 'Kurs tersimpan.' });
    } catch (e) {
      setProvMsg({ ok: false, text: e.message });
    }
    setSvcSaving(false);
  };

  const applyMarkup = (ids) => {
    const m = Number(massMarkup);
    if (massMarkup === '' || !Number.isFinite(m) || m < 0) return;
    const kena = new Set(ids === null ? services.map((x) => x.id) : ids);
    setServices((list) => list.map((x) => (kena.has(x.id) ? { ...x, markup: m } : x)));
    tandai(Array.from(kena));
  };
  const resetMarkup = () => { setServices((list) => list.map((x) => ({ ...x, markup: 0 }))); tandai(services.map((x) => x.id)); };
  const setServiceMarkup = (id, val) => { setServices((list) => list.map((x) => (x.id === id ? { ...x, markup: Math.max(0, Number(val) || 0) } : x))); tandai([id]); };

  const updMsg = (u) => (u.from ? UPS[u.type].label + ' dari ' + u.from + ' ke ' + u.to : UPS[u.type].label);
  const updDays = (() => {
    const out = [];
    const idx = {};
    updLog.filter((u) => updF === 'all' || u.type === updF).forEach((u) => {
      if (!(u.date in idx)) { idx[u.date] = out.length; out.push({ date: u.date, items: [] }); }
      const svc = services.find((s) => String(s.id) === String(u.id));
      out[idx[u.date]].items.push({ rid: u.rid, id: u.id, name: svc ? svc.nama : 'Layanan ' + u.id, icon: ICON.layers, bg: UPS[u.type].bg, fg: UPS[u.type].fg, msg: updMsg(u) });
    });
    return out;
  })();
  const addUpdate = async () => {
    const needPrice = rec.tipe === 'up' || rec.tipe === 'down';
    if (needPrice && (!rec.lama.trim() || !rec.baru.trim())) return;
    const r = await fetch('/api/riwayat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ layananId: rec.id, tipe: rec.tipe, lama: needPrice ? rec.lama.trim() : '', baru: needPrice ? rec.baru.trim() : '' }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { tampilkanToast(false, d.error || 'Gagal mencatat perubahan.'); return; }
    setRec((x) => ({ ...x, lama: '', baru: '' }));
    tampilkanToast(true, 'Perubahan layanan tercatat.');
    await muatRiwayat();
  };

  const segarkanPesanan = async () => {
    setOrdersBusy(true);
    setOrdersMsg(null);
    try {
      const r = await fetch('/api/orders', { method: 'PATCH' });
      const d = await r.json();
      if (!r.ok || d.error) throw new Error(d.error || 'Gagal menyegarkan.');
      setLiveOrders(d.orders || []);
      setOrdersMsg({ ok: true, text: d.diperbarui + ' pesanan diperbarui dari provider.' });
    } catch (e) {
      setOrdersMsg({ ok: false, text: e.message });
    }
    setOrdersBusy(false);
  };

  const updatePwd = () => {
    if (!pwOld || !pwNew) return setPwMsg('Isi semua kolom password.');
    if (pwNew.length < 8) return setPwMsg('Password baru minimal 8 karakter.');
    if (pwNew !== pwNew2) return setPwMsg('Konfirmasi password tidak sama.');
    setPwOld(''); setPwNew(''); setPwNew2('');
    setPwMsg('Password berhasil diperbarui.');
  };

  const kirimTiket = async (body) => {
    const r = await fetch('/api/tickets', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { tampilkanToast(false, d.error || 'Gagal menyimpan tiket.'); return false; }
    tampilkanToast(true, body.aksi === 'tutup' ? 'Tiket ditutup.' : 'Balasan terkirim.');
    await muatTiket();
    return true;
  };
  const sendReply = async () => {
    if (!ticket || !reply.trim()) return;
    const teks = reply.trim();
    setReply('');
    if (!(await kirimTiket({ id: ticket.id, aksi: 'balas', text: teks }))) setReply(teks);
  };
  const closeTicket = () => kirimTiket({ id: selTicket, aksi: 'tutup' });

  const themeOpts = [['light', 'Terang'], ['dark', 'Gelap'], ['auto', 'Otomatis']].map((m) => ({
    k: m[0], t: m[1], on: themeMode === m[0],
    pick: m[0] === 'auto'
      ? () => { const dark = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : true; setThemeMode('auto'); setTheme(dark ? 'dark' : 'light'); }
      : () => { setThemeMode(m[0]); setTheme(m[0]); }
  }));
  const accentOpts = Object.keys(ACCENTS).map((k) => ({ k, t: ACCENTS[k].label, c: ACCENTS[k].c, on: accent === k, pick: () => setAccent(k) }));

  /* Angka ringkasan dihitung dari pesanan asli. */
  const hariIni = tanggalWib(new Date().toISOString());
  const bulanIni = hariIni.slice(0, 7);
  const pesananHariIni = liveOrders.filter((o) => o.dibuat && tanggalWib(o.dibuat) === hariIni).length;
  const pendapatanBulanIni = liveOrders
    .filter((o) => o.dibuat && o.status !== 'Canceled' && tanggalWib(o.dibuat).slice(0, 7) === bulanIni)
    .reduce((s, o) => s + (Number(o.biaya) || 0), 0);
  const stats = [
    { c: A.l, tint: 'rgba(var(--accent-rgb),.12)', line: 'rgba(var(--accent-rgb),.3)', l: 'Total Pengguna', v: String(pengguna.length), a: 'Lihat Pengguna', icon: ICON.users, onClick: () => setTab('Pengguna') },
    { c: isDark ? '#FB923C' : '#C2410C', tint: isDark ? 'rgba(249,115,22,.12)' : 'rgba(249,115,22,.07)', line: isDark ? 'rgba(249,115,22,.3)' : 'rgba(249,115,22,.22)', l: 'Pesanan Hari Ini', v: String(pesananHariIni), a: 'Lihat Pesanan', icon: ICON.cart, onClick: () => setTab('Pesanan') },
    { c: isDark ? '#4ADE80' : '#15803D', tint: isDark ? 'rgba(34,197,94,.12)' : 'rgba(34,197,94,.07)', line: isDark ? 'rgba(34,197,94,.3)' : 'rgba(34,197,94,.22)', l: 'Pendapatan Bulan Ini', v: rp(pendapatanBulanIni), a: 'Lihat Pesanan', icon: ICON.money, onClick: () => setTab('Pesanan') },
    { c: isDark ? '#60A5FA' : '#1D4ED8', tint: isDark ? 'rgba(59,130,246,.12)' : 'rgba(59,130,246,.07)', line: isDark ? 'rgba(59,130,246,.3)' : 'rgba(59,130,246,.22)', l: 'Tiket Terbuka', v: String(openTickets), a: 'Buka Tiket', icon: ICON.ticket, onClick: () => setTab('Tiket') }
  ];

  const navBtn = (t) => {
    const on = tab === t.id;
    const n = badges[t.id] || 0;
    return (
      <button key={t.id} type="button" className={'sb' + (on ? ' on' : '')} aria-current={on ? 'page' : undefined} onClick={() => bukaTab(t.id)}>
        <Svg d={t.icon} />
        <span style={{ flex: '1' }}>{t.id}</span>
        {n > 0 ? <span className="count" style={{ background: on ? 'rgba(255,255,255,.25)' : 'var(--accent)' }}>{n}</span> : null}
        {on ? <Svg d={ICON.chev} size={14} sw={2.4} /> : null}
      </button>
    );
  };

  return (
    <>
      <Head>
        <title>SosmedGo — Admin</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
      </Head>
      <style jsx global>{`
.theme-dark{--bg:#0B0B0E;--s0:#0D0D10;--s1:#111115;--s2:#141418;--s3:#16161A;--s4:#1E1E23;--b1:#18181D;--b2:#1E1E24;--b3:#23232A;--b4:#26262C;--b5:#2A2A30;--b6:#3A3A42;--tx:#F4F4F5;--t1:#E4E4E7;--t2:#C9CBD1;--t3:#A1A3AB;--t4:#8B8D96;--t5:#6B6E78;--t6:#4B4D56;--rt:#FF5A75;--rt2:#FFB3C0;--gr:#22C55E;--am:#F59E0B;--bl:#60A5FA;--hi:#FFFFFF}
.theme-light{--bg:#FFFFFF;--s0:#FFFFFF;--s1:#FFFFFF;--s2:#FFFFFF;--s3:#F1F5F9;--s4:#E2E8F0;--b1:#F1F5F9;--b2:#E2E8F0;--b3:#E2E8F0;--b4:#CBD5E1;--b5:#CBD5E1;--b6:#94A3B8;--tx:#0F172A;--t1:#1E293B;--t2:#334155;--t3:#475569;--t4:#64748B;--t5:#94A3B8;--t6:#CBD5E1;--rt2:#9F1239;--gr:#15803D;--am:#B45309;--bl:#2563EB;--hi:#0F172A}
.theme-light .card{border-color:#E2E8F0;box-shadow:0 4px 16px rgba(16,24,40,.07)}
.theme-light .dash-head{background:linear-gradient(180deg,rgba(var(--accent-rgb),.06) 0%,rgba(var(--accent-rgb),0) 100%)}
body{margin:0;background:var(--bg)}
a{color:var(--t2);text-decoration:none}a:hover{color:var(--hi)}
button{font-family:inherit}
.sb{width:100%;display:flex;align-items:center;gap:12px;font-size:13px;font-weight:500;color:var(--t3);padding:11px 12px;border-radius:12px;border:none;background:transparent;cursor:pointer;text-align:left;min-height:44px;box-sizing:border-box;text-decoration:none}
.sb:hover{background:var(--s3);color:var(--hi)}
.sb.on{background:var(--accent);color:#FFFFFF;font-weight:600;box-shadow:0 8px 22px rgba(var(--accent-rgb),.3)}
.count{font-size:10px;font-weight:700;color:#FFFFFF;border-radius:6px;padding:2px 7px}
.card{background:var(--s1);border:1px solid var(--b2);border-radius:16px}
.ibtn{height:38px;border-radius:10px;background:var(--s2);border:1px solid var(--b3);display:flex;align-items:center;justify-content:center;gap:6px;padding:0 12px;cursor:pointer;color:var(--t2);font-size:11px;font-weight:600;position:relative}
.ibtn:hover{border-color:var(--b6)}
.ibtn .dot{position:absolute;top:8px;right:9px;width:7px;height:7px;border-radius:50%;background:var(--accent)}
.ddic{width:28px;height:28px;flex:none;border-radius:8px;display:flex;align-items:center;justify-content:center}
.ghost{height:36px;border-radius:9px;border:1px solid var(--b5);background:var(--s1);color:var(--t1);font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:0 12px}
.ghost:hover{border-color:var(--rt)}
.ghost.ok{color:#22C55E;border-color:rgba(34,197,94,.35)}
.ghost.no{color:#FF5A75;border-color:rgba(255,90,117,.35)}
.submit{height:44px;border-radius:10px;border:1px solid var(--accent-h);background:var(--accent);color:#FFFFFF;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 18px;box-shadow:0 10px 26px rgba(var(--accent-rgb),.3)}
.submit:hover{background:var(--accent-h)}
.submit:disabled{opacity:.5;cursor:not-allowed}
.chip{display:inline-flex;align-items:center;height:38px;border:1px solid var(--b3);background:var(--s1);border-radius:999px;padding:0 16px;color:var(--t2);font-size:12px;font-weight:600;cursor:pointer;margin:0 6px 14px 0}
.chip:hover{border-color:var(--b6)}
.chip.on{background:var(--accent);border-color:var(--accent);color:#FFFFFF}
.inp{width:100%;max-width:340px;box-sizing:border-box;height:44px;background:var(--s0);border:1px solid var(--b3);border-radius:10px;padding:0 14px;color:var(--hi);font-family:inherit;font-size:13px;outline:none;margin-bottom:14px}
.inp:focus,.ta:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(var(--accent-rgb),.15)}
.inp::placeholder,.ta::placeholder{color:var(--t6)}
.ta{width:100%;box-sizing:border-box;min-height:84px;background:var(--s0);border:1px solid var(--b3);border-radius:10px;padding:10px 14px;color:var(--hi);font-family:inherit;font-size:13px;outline:none;resize:vertical}
.pill{display:inline-block;font-size:11px;font-weight:600;border-radius:999px;padding:4px 10px;white-space:nowrap}
.tbl{width:100%;border-collapse:collapse;font-size:13px}
.tbl th{text-align:left;font-weight:600;font-size:11px;color:var(--t4);padding:14px 16px;border-bottom:1px solid var(--b2);white-space:nowrap}
.tbl td{padding:13px 16px;border-bottom:1px solid var(--b1);white-space:nowrap;color:var(--t1)}
.tbl tr:last-child td{border-bottom:0}
.tbl tr.click{cursor:pointer}
.tbl tr.click:hover td{background:var(--s3)}
.muted{color:var(--t4)}
.sub{display:inline-flex;align-items:center;gap:8px;border:1px solid transparent;border-radius:10px;padding:10px 12px;background:transparent;color:var(--t3);font-size:12px;font-weight:600;cursor:pointer}
.sub:hover{color:var(--hi);background:var(--s2)}
.sub.on{color:var(--hi);background:var(--s2);border-color:var(--b5)}
.sw{width:44px;height:26px;border-radius:999px;border:none;cursor:pointer;position:relative;flex:none;padding:0}
.sw span{position:absolute;top:3px;width:20px;height:20px;border-radius:50%;background:#FFFFFF;transition:left .15s}
.ux-grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:6px}
.ux-grid5{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
@media (max-width:640px){.ux-grid5{grid-template-columns:repeat(3,minmax(0,1fr))}}
.ux-card{background:var(--s1);border:2px solid var(--b3);border-radius:14px;padding:10px;cursor:pointer;display:flex;flex-direction:column;gap:10px;font-family:inherit;color:var(--t1)}
.ux-card:hover{border-color:var(--b6)}
.ux-prev{position:relative;display:block;height:72px;border-radius:8px;border:1px solid var(--b3);overflow:hidden}
.ux-bar{position:absolute;left:0;right:0;top:0;height:8px}
.ux-side{position:absolute;left:8px;top:16px;bottom:8px;width:24%;border-radius:4px}
.ux-dot{position:absolute;right:10px;bottom:10px;width:12px;height:12px;border-radius:50%}
.ux-name{font-size:12px;font-weight:600}
.idpill{flex:none;font-size:11px;font-weight:700;color:var(--rt);background:var(--r3);border:1px solid var(--r5);border-radius:999px;padding:3px 10px}
.bubble{border-radius:12px;padding:10px 14px;font-size:13px;line-height:1.5;max-width:80%;white-space:pre-wrap}
.adm-layout{display:flex;flex-wrap:wrap}
.adm-aside{flex:1 1 230px;max-width:250px;min-width:0;border-right:1px solid var(--b1);padding:22px 16px;display:flex;flex-direction:column;gap:2px;box-sizing:border-box}
.adm-main{flex:999 1 640px;min-width:0;display:flex;flex-direction:column}
.nav-toggle{display:none;align-items:center;justify-content:center;width:38px;height:38px;flex:none;border-radius:10px;background:var(--s2);border:1px solid var(--b3);color:var(--t2);cursor:pointer}
@media (max-width:900px){
  .nav-toggle{display:inline-flex}
  .dash-crumb{flex:1 1 auto;min-width:0}
  .adm-aside{display:none !important}
  .adm-aside.buka{display:flex !important;max-width:none !important;flex:1 1 100% !important;border-right:0 !important;border-bottom:1px solid var(--b1) !important}
  .dash-head{padding:12px 16px !important}
  .dash-main{padding:18px 16px 48px !important}
}
@media (max-width:640px){
  /* iOS memperbesar halaman kalau font input di bawah 16px. */
  .inp,.ta,input,select,textarea{font-size:16px !important}
  .dash-main{gap:16px !important}
}
`}</style>

      <div className={isDark ? 'theme-dark' : 'theme-light'} style={{ ...accentVars, fontFamily: "'Inter',system-ui,sans-serif", color: 'var(--tx)', background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexWrap: 'wrap' }}>
        <aside className={"adm-aside" + (navOpen ? " buka" : "")}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '22px', padding: '6px' }}>
            <img src="/icon.png" alt="" aria-hidden="true" className="logo-mark" width="24" height="24" style={{ borderRadius: "8px", display: "block" }} />
            <span style={{ fontSize: '17px', fontWeight: '800', color: 'var(--hi)', letterSpacing: '-.03em' }}>SosmedGo</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--s2)', border: '1px solid var(--b3)', borderRadius: '12px', padding: '10px', marginBottom: '14px' }}>
            <span style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>A</span>
            <span style={{ flex: '1', lineHeight: '1.35' }}>
              <span style={{ display: 'block', fontSize: '10px', color: 'var(--t5)' }}>Akun admin</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--hi)' }}>Administrator</span>
            </span>
          </div>

          <nav aria-label="Menu admin" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {TABS_MAIN.map(navBtn)}
          </nav>
          <div style={{ height: '1px', background: 'var(--b2)', margin: '14px 10px' }} />
          <nav aria-label="Menu dukungan" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {TABS_SUPPORT.map(navBtn)}
          </nav>
          <div style={{ height: '1px', background: 'var(--b2)', margin: '14px 10px' }} />
          <button type="button" className={'sb' + (tab === 'Pengaturan' ? ' on' : '')} aria-current={tab === 'Pengaturan' ? 'page' : undefined} onClick={() => bukaTab('Pengaturan')}>
            <Svg d={ICON.lock} /> Pengaturan
          </button>
          <Link href="/dashboard" className="sb"><Svg d={ICON.back} /> Ke panel user</Link>
          <a href="/api/admin-logout" className="sb"><Svg d={ICON.logout} /> Keluar</a>
        </aside>

        <div className="adm-main">
          <header className="dash-head" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px', padding: '18px 40px', borderBottom: '1px solid var(--b1)' }}>
            <button type="button" className="nav-toggle" onClick={() => setNavOpen(!navOpen)} aria-label="Menu" aria-expanded={navOpen}>
              <Svg d={ICON.bars} size={16} />
            </button>
            <div className="dash-crumb">
              <div style={{ fontSize: '13px', color: 'var(--t2)' }}>
                Admin <span style={{ color: 'var(--t6)' }}>›</span>{' '}
                <span style={{ color: 'var(--rt)', fontWeight: '600' }}>{TAB_CRUMB[tab]}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--t5)', marginTop: '4px' }}>Kelola pengguna, pesanan, deposit, tiket, dan afiliasi</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button type="button" className="ibtn" onClick={() => { setThemeMode(isDark ? 'light' : 'dark'); setTheme(isDark ? 'light' : 'dark'); }} aria-label="Ganti tema" style={{ padding: '0 12px' }}>
                <Svg d={isDark ? ICON.sun : ICON.moon} size={15} sw={2} />
                {isDark ? 'Terang' : 'Gelap'}
              </button>
              <button type="button" className="ibtn" aria-label="Notifikasi admin" onClick={() => setTab(pendingDeposits ? 'Deposit' : openTickets ? 'Tiket' : 'Ringkasan')} style={{ width: '38px', padding: 0 }}>
                <Svg d={ICON.bell} size={15} sw={2} />
                {totalPending > 0 ? <span className="dot" /> : null}
              </button>
              <span style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>A</span>
            </div>
          </header>

          <main className="dash-main" style={{ padding: '34px 40px 60px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div>
              <h1 style={{ margin: '0', fontSize: '26px', fontWeight: '700', letterSpacing: '-.02em' }}>
                {tab === 'Pengaturan' ? 'Pengaturan' : TAB_CRUMB[tab]} <span style={{ color: 'var(--accent-l)' }}>admin</span>
              </h1>
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--t4)' }}>Data di halaman ini diambil dari database dan provider.</p>
            </div>

            {tab === 'Ringkasan' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '14px' }}>
                  {stats.map((s) => <StatCard key={s.l} s={s} />)}
                </div>
                <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700' }}>Saldo provider</div>
                      <div className="muted" style={{ fontSize: '12px', marginTop: '4px' }}>Saldo di smmsoc.com: <strong style={{ color: 'var(--hi)' }}>{saldoTxt}</strong></div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '12px' }}>
                    <div style={{ background: 'var(--s2)', border: '1px solid var(--b3)', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700' }}>smmsoc.com</span>
                        {provMenipis ? <span className="pill" style={{ background: '#7F1D1D', color: '#F4F4F5' }}>Saldo menipis</span> : null}
                      </div>
                      {saldoProv.saldo !== null ? (
                        <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '8px', letterSpacing: '-.02em' }}>{saldoTxt}</div>
                      ) : (
                        <div className="muted" style={{ fontSize: '12px', marginTop: '8px' }}>{saldoProv.error || 'Memuat saldo...'}</div>
                      )}
                      <div className="muted" style={{ fontSize: '11px', marginTop: '4px' }}>Semua layanan dari provider ini</div>
                    </div>
                  </div>
                  <div className="muted" style={{ fontSize: '11px' }}>Saldo menipis jika di bawah {rp(PROVIDER_LOW)}.</div>
                </div>

                <div className="card" style={{ overflowX: 'auto' }}>
                  <div style={{ padding: '16px 18px', fontSize: '14px', fontWeight: '700', borderBottom: '1px solid var(--b2)' }}>Pesanan Terbaru</div>
                  <OrdersTable rows={liveOrders.slice(0, 5)} />
                </div>
              </>
            )}

            <Toast toast={toast} onClose={() => setToast(null)} />
            {tab === 'Statistik' && (
              <>
                <div className="muted" style={{ fontSize: '12px' }}>
                  Saldo komisi belum diklaim (semua pengguna) saat ini: <strong style={{ color: 'var(--hi)' }}>{rp(statistik.komisiTersedia)}</strong>
                </div>
                <div>
                  {RANGE_OPTS.map((r) => (
                    <button key={r} type="button" className={'chip' + (range === r ? ' on' : '')} aria-pressed={range === r} onClick={() => setRange(r)}>{r}</button>
                  ))}
                </div>
                {range === 'Custom' ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginTop: '-6px' }}>
                    <input className="inp" type="date" style={{ maxWidth: '180px', margin: 0 }} value={cFrom} onChange={(e) => setCFrom(e.target.value)} aria-label="Dari tanggal" />
                    <span className="muted" style={{ fontSize: '12px' }}>sampai</span>
                    <input className="inp" type="date" style={{ maxWidth: '180px', margin: 0 }} value={cTo} onChange={(e) => setCTo(e.target.value)} aria-label="Sampai tanggal" />
                  </div>
                ) : null}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '14px' }}>
                  <StatCard s={{ c: colors.deposit, tint: 'rgba(59,130,246,.12)', line: 'rgba(59,130,246,.3)', l: 'Total Deposit', v: rp(trendTotals.deposit), icon: ICON.wallet, ...compareLine(trendTotals.deposit, prevTotals.deposit) }} />
                  <StatCard s={{ c: colors.revenue, tint: 'rgba(245,165,36,.12)', line: 'rgba(245,165,36,.3)', l: 'Total Revenue', v: rp(trendTotals.revenue), icon: ICON.money, ...compareLine(trendTotals.revenue, prevTotals.revenue) }} />
                  <StatCard s={{ c: colors.order, tint: 'rgba(52,211,119,.12)', line: 'rgba(52,211,119,.3)', l: 'Total Pesanan', v: trendTotals.order + ' pesanan', icon: ICON.cart, ...compareLine(trendTotals.order, prevTotals.order) }} />
                  <StatCard s={{ c: colors.komisi, tint: 'rgba(167,139,250,.12)', line: 'rgba(167,139,250,.3)', l: 'Total Komisi', v: rp(trendTotals.komisi), icon: ICON.affiliate, ...compareLine(trendTotals.komisi, prevTotals.komisi) }} />
                </div>

                <div className="card" style={{ padding: '16px 16px 10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px 16px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>Tren deposit, revenue, pesanan &amp; komisi</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '12px', color: 'var(--t3)' }}>
                      {series.map((s) => (
                        <span key={s.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }} />
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  {trend.length === 0 ? (
                    <div className="muted" style={{ fontSize: '12px', padding: '20px 0' }}>Pilih tanggal mulai dan selesai dulu.</div>
                  ) : showTable ? (
                    <TrendTable rows={trend} />
                  ) : (
                    <TrendChart data={trend} series={series} />
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="button" className="ghost" onClick={() => setShowTable((s) => !s)}>{showTable ? 'Tampilkan grafik' : 'Tampilkan tabel'}</button>
                </div>
              </>
            )}

            {tab === 'Pengguna' && (
              <>
                <input className="inp" placeholder="Cari username" value={q} onChange={(e) => setQ(e.target.value)} />
                <div className="card" style={{ overflowX: 'auto' }}>
                  <table className="tbl">
                    <thead><tr><th>Username</th><th>Saldo</th><th>Pesanan</th><th>Total belanja</th><th>Daftar</th><th>Pengajak</th></tr></thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td style={{ fontWeight: '600' }}>{u.username}</td>
                          <td>{rp(u.saldo)}</td>
                          <td>{u.pesanan}</td>
                          <td>{rp(u.belanja)}</td>
                          <td className="muted">{u.daftar}</td>
                          <td className="muted">{u.pengajak || '—'}</td>
                        </tr>
                      ))}
                      {users.length === 0 && <tr><td colSpan={6} className="muted">Tidak ada pengguna yang cocok.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {tab === 'Pesanan' && (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                  <div>
                    {['Semua', 'Pending', 'In progress', 'Completed', 'Partial', 'Canceled'].map((f) => (
                      <button key={f} type="button" className={'chip' + (orderFilter === f ? ' on' : '')} onClick={() => setOrderFilter(f)}>{f}</button>
                    ))}
                  </div>
                  <button type="button" className="ghost" onClick={segarkanPesanan} disabled={ordersBusy} style={{ marginLeft: 'auto', marginBottom: '14px' }}>
                    {ordersBusy ? 'Menyegarkan...' : 'Segarkan status'}
                  </button>
                </div>
                {ordersMsg ? (
                  <div style={{ fontSize: '12px', marginTop: '-8px', color: ordersMsg.ok ? '#22C55E' : '#FF5A75' }}>{ordersMsg.text}</div>
                ) : null}
                <div className="card" style={{ overflowX: 'auto' }}>
                  <OrdersTable rows={orders} />
                </div>
              </>
            )}

            {tab === 'Deposit' && (
              <>
              <div role="group" aria-label="Filter status deposit" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Semua', 'Menunggu', 'Berhasil', 'Ditolak'].map((f) => (
                  <button key={f} type="button" className={'chip' + (depF === f ? ' on' : '')} aria-pressed={depF === f} onClick={() => setDepF(f)} style={{ margin: 0 }}>{f}</button>
                ))}
              </div>
              <div className="card" style={{ overflowX: 'auto' }}>
                <table className="tbl">
                  <thead><tr><th>ID</th><th>User</th><th>Metode</th><th>Nominal</th><th>Waktu</th><th>Status</th><th>Aksi</th></tr></thead>
                  <tbody>
                    {deposits.filter((d) => depF === 'Semua' || d.status === depF).map((d) => (
                      <tr key={d.id}>
                        <td className="muted">{d.id}</td>
                        <td>{d.user}</td>
                        <td>{d.metode}</td>
                        <td>{rp(d.nominal)}</td>
                        <td className="muted">{d.waktu}</td>
                        <td><Badge text={d.status} /></td>
                        <td>
                          {d.status === 'Menunggu' ? (
                            <>
                              {d.metode === 'Paymenku' ? (
                                <span className="muted" style={{ fontSize: '12px' }}>Menunggu pembayaran</span>
                              ) : (
                                <button type="button" className="ghost ok" onClick={() => setDepositStatus(d.id, 'Berhasil')}>Setujui</button>
                              )}{' '}
                              <button type="button" className="ghost no" onClick={() => setDepositStatus(d.id, 'Ditolak')}>Tolak</button>
                            </>
                          ) : <span className="muted">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </>
            )}

            {tab === 'Layanan' && (
              <>
                <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>Markup massal</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                    <input className="inp" type="number" min="0" placeholder="Markup %" value={massMarkup} onChange={(e) => setMassMarkup(e.target.value)} style={{ maxWidth: '160px', margin: 0 }} aria-label="Markup persen" />
                    <button type="button" className="submit" disabled={massMarkup === ''} onClick={() => applyMarkup(null)}>Terapkan ke semua ({services.length})</button>
                    <button type="button" className="ghost" disabled={selCount === 0 || massMarkup === ''} onClick={() => applyMarkup(selectedIds)}>Terapkan ke {selCount} dipilih</button>
                    <button type="button" className="ghost" onClick={resetMarkup}>Reset ke harga dasar</button>
                    <button type="button" className="submit" disabled={!adaPerubahan || svcSaving} onClick={simpanLayanan}>
                      {labelSimpan}
                    </button>
                  </div>
                  <div className="muted" style={{ fontSize: '12px' }}>
                    Contoh: harga dasar Rp 12.000 dengan markup {massMarkup || 0}% menjadi {rp(hargaJual({ dasar: 12000, markup: Number(massMarkup) || 0 }))} ({usd(hargaJual({ dasar: 12000, markup: Number(massMarkup) || 0 }))}).
                  </div>
                </div>

                <div className="card" style={{ padding: '18px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700' }}>Kurs USD</div>
                    <div className="muted" style={{ fontSize: '12px', marginTop: '4px' }}>Harga dasar dari provider dihitung memakai kurs ini.</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="muted" style={{ fontSize: '12px' }}>Rp per $1</span>
                    <input className="inp" type="number" min="1" value={kurs} onChange={(e) => { setKurs(Math.max(1, Number(e.target.value) || 1)); setKursDirty(true); }} style={{ maxWidth: '150px', margin: 0 }} aria-label="Kurs Rupiah per dolar" />
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                  <input className="inp" placeholder="Cari nama atau ID layanan" value={svcQ} onChange={(e) => { setSvcQ(e.target.value); setSvcPage(1); }} style={{ maxWidth: '320px', margin: 0 }} />
                  <select className="inp" value={svcCat} onChange={(e) => { setSvcCat(e.target.value); setSvcPage(1); }} style={{ maxWidth: '360px', margin: 0, height: '44px', cursor: 'pointer' }} aria-label="Kategori">
                    <option value="all">Semua kategori ({svcCats.length})</option>
                    {svcCats.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <span className="muted" style={{ fontSize: '12px' }}>{svcFiltered.length} layanan</span>
                </div>

                <div className="card" style={{ overflowX: 'auto' }}>
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th><input type="checkbox" aria-label="Pilih semua hasil filter" checked={allSelected} onChange={toggleAll} style={{ accentColor: 'var(--accent)' }} /></th>
                        <th>ID</th><th>Nama Layanan</th><th>Kategori</th><th>Harga dasar</th><th>Markup</th><th>Harga jual</th><th>Harga USD</th><th>Min</th><th>Maks</th><th>Status</th><th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {svcRows.map((s) => {
                        const harga = hargaJual(s);
                        return (
                          <tr key={s.id}>
                            <td><input type="checkbox" checked={!!selSvc[s.id]} onChange={() => toggleSel(s.id)} aria-label={'Pilih ' + s.nama} style={{ accentColor: 'var(--accent)' }} /></td>
                            <td className="muted">{s.id}</td>
                            <td style={{ whiteSpace: 'normal', minWidth: '280px', maxWidth: '420px' }}>{s.nama}</td>
                            <td className="muted" style={{ whiteSpace: 'normal', minWidth: '160px', maxWidth: '240px' }}>{s.kategori || '—'}</td>
                            <td>{rp(s.dasar)}</td>
                            <td>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <input className="inp" type="number" min="0" value={s.markup} onChange={(e) => setServiceMarkup(s.id, e.target.value)} style={{ maxWidth: '84px', margin: 0, height: '34px' }} aria-label={'Markup ' + s.nama} />
                                <span className="muted">%</span>
                              </span>
                            </td>
                            <td>{rp(harga)}</td>
                            <td>{usd(harga)}</td>
                            <td>{s.min}</td>
                            <td>{s.maks}</td>
                            <td><Badge text={s.aktif ? 'Aktif' : 'Nonaktif'} /></td>
                            <td><button type="button" className="ghost" onClick={() => toggleService(s.id)}>{s.aktif ? 'Nonaktifkan' : 'Aktifkan'}</button></td>
                          </tr>
                        );
                      })}
                      {svcRows.length === 0 && <tr><td colSpan={12} className="muted">{services.length === 0 ? "Belum ada layanan. Buka Pengaturan → Provider lalu klik Ambil daftar layanan." : "Tidak ada layanan yang cocok."}</td></tr>}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <span className="muted" style={{ fontSize: '12px' }}>Halaman {svcPageSafe} dari {svcPages}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" className="ghost" disabled={svcPageSafe <= 1} onClick={() => setSvcPage(svcPageSafe - 1)}>Sebelumnya</button>
                    <button type="button" className="ghost" disabled={svcPageSafe >= svcPages} onClick={() => setSvcPage(svcPageSafe + 1)}>Berikutnya</button>
                  </div>
                </div>
              </>
            )}
            {tab === 'Tiket' && (
              <>
                <div className="card" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>Profil tim support</span>
                  <input className="inp" value={supportProfil.nama} onChange={(e) => setSupportProfil((p) => ({ ...p, nama: e.target.value }))} placeholder="Nama" aria-label="Nama tim support" style={{ maxWidth: '240px', margin: 0 }} />
                  <input className="inp" value={supportProfil.inisial} onChange={(e) => setSupportProfil((p) => ({ ...p, inisial: e.target.value }))} placeholder="Inisial" aria-label="Inisial avatar" style={{ maxWidth: '90px', margin: 0 }} />
                  <button type="button" className="submit" onClick={simpanSupport}>Simpan profil</button>
                </div>
                <div className="card" style={{ overflowX: 'auto' }}>
                  <table className="tbl">
                    <thead><tr><th>ID</th><th>User</th><th>Kategori</th><th>Pesanan</th><th>Terakhir</th><th>Status</th></tr></thead>
                    <tbody>
                      {[...tickets].sort((x, y) => (y.tingkat || 0) - (x.tingkat || 0)).map((t) => (
                        <tr key={t.id} className="click" onClick={() => { setSelTicket(t.id); setReply(''); }} style={{ background: selTicket === t.id ? 'var(--s3)' : undefined }}>
                          <td className="muted">#{t.id}</td>
                          <td>{t.user}</td>
                          <td>{t.kategori}</td>
                          <td className="muted">{t.orderId || '—'}</td>
                          <td className="muted">{t.update}</td>
                          <td><Badge text={t.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {ticket ? (
                  <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '700' }}>Tiket #{ticket.id} · {ticket.user}</div>
                      <button type="button" className="ghost" onClick={closeTicket} disabled={ticket.status === 'Ditutup'}>Tutup tiket</button>
                    </div>
                    {ticket.msgs.map((m, i) => {
                      const admin = m.from === 'admin';
                      return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: admin ? 'flex-end' : 'flex-start', gap: '4px' }}>
                          <div className="bubble" style={{ background: admin ? 'var(--r3)' : 'var(--s3)', border: '1px solid ' + (admin ? 'var(--r5)' : 'var(--b3)'), color: 'var(--t1)' }}>{m.text}</div>
                          <div style={{ fontSize: '10px', color: 'var(--t5)' }}>{admin ? supportProfil.nama : ticket.user} · {m.time}</div>
                        </div>
                      );
                    })}
                    {ticket.status !== 'Ditutup' ? (
                      <>
                        <textarea className="ta" placeholder="Tulis balasan..." value={reply} onChange={(e) => setReply(e.target.value)} />
                        <div><button type="button" className="submit" onClick={sendReply} disabled={!reply.trim()}>Kirim balasan</button></div>
                      </>
                    ) : <div className="muted" style={{ fontSize: '12px' }}>Tiket ini sudah ditutup.</div>}
                  </div>
                ) : (
                  <div className="muted" style={{ fontSize: '12px' }}>Pilih tiket di atas untuk melihat dan membalas.</div>
                )}
              </>
            )}

            {tab === 'Update' && (
              <>
                <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>Catat perubahan layanan</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                    <select className="inp" value={rec.id} onChange={(e) => setRec((r) => ({ ...r, id: e.target.value }))} style={{ maxWidth: '380px', margin: 0 }} aria-label="Layanan">
                      {services.length === 0 ? <option value="">Belum ada layanan. Tarik dulu di Pengaturan.</option> : null}
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>{s.id} · {s.nama}</option>
                      ))}
                    </select>
                    <select className="inp" value={rec.tipe} onChange={(e) => setRec((r) => ({ ...r, tipe: e.target.value }))} style={{ maxWidth: '220px', margin: 0 }} aria-label="Jenis perubahan">
                      {Object.keys(UPS).map((k) => (
                        <option key={k} value={k}>{UPS[k].label}</option>
                      ))}
                    </select>
                    {rec.tipe === 'up' || rec.tipe === 'down' ? (
                      <>
                        <input className="inp" placeholder="Harga lama (cth: Rp 580)" value={rec.lama} onChange={(e) => setRec((r) => ({ ...r, lama: e.target.value }))} style={{ maxWidth: '200px', margin: 0 }} aria-label="Harga lama" />
                        <input className="inp" placeholder="Harga baru (cth: Rp 600)" value={rec.baru} onChange={(e) => setRec((r) => ({ ...r, baru: e.target.value }))} style={{ maxWidth: '200px', margin: 0 }} aria-label="Harga baru" />
                      </>
                    ) : null}
                    <button type="button" className="submit" onClick={addUpdate} disabled={(rec.tipe === 'up' || rec.tipe === 'down') && (!rec.lama.trim() || !rec.baru.trim())}>Catat</button>
                  </div>
                </div>

                <div role="group" aria-label="Filter update" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[['all', 'Semua'], ['up', 'Harga naik'], ['down', 'Harga turun'], ['off', 'Dinonaktifkan'], ['new', 'Layanan baru']].map((f) => (
                    <button key={f[0]} type="button" className={'chip' + (updF === f[0] ? ' on' : '')} aria-pressed={updF === f[0]} onClick={() => setUpdF(f[0])} style={{ margin: 0 }}>{f[1]}</button>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {updDays.map((d) => (
                    <div key={d.date} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700' }}>
                        <span className="ddic" style={{ width: '24px', height: '24px', background: 'rgba(var(--accent-rgb),.12)', border: '1px solid rgba(var(--accent-rgb),.3)', color: 'var(--accent-l)', fontSize: '10px' }}>▦</span>
                        {d.date}
                      </div>
                      {d.items.map((u, i) => (
                        <div key={i} className="card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px' }}>
                          <span className="ddic" style={{ width: '30px', height: '30px', background: 'rgba(var(--accent-rgb),.12)', border: '1px solid rgba(var(--accent-rgb),.3)', color: 'var(--accent-l)' }}>
                            <i className={(SOCIAL_FA[u.icon] || 'fa-solid fa-layer-group')} aria-hidden="true" style={{ color: 'var(--accent-l)', fontSize: '14px' }} />
                          </span>
                          <span className="idpill">{u.id}</span>
                          <span style={{ flex: '1', minWidth: '220px', fontSize: '13px', fontWeight: '600' }}>{u.name}</span>
                          <span className="pill" style={{ background: u.bg, color: u.fg }}>{u.msg}</span>
                          {u.rid ? (<button type="button" className="ghost no" onClick={function () { hapusRiwayatAdmin(u.rid); }} style={{ padding: '4px 10px', fontSize: '11px' }}>Hapus</button>) : null}
                        </div>
                      ))}
                    </div>
                  ))}
                  {updDays.length === 0 ? (
                    <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--t5)', fontSize: '13px' }}>Tidak ada update.</div>
                  ) : null}
                </div>

              </>
            )}

            {tab === 'Refund' && (
              <div className="card" style={{ overflowX: 'auto' }}>
                <table className="tbl">
                  <thead><tr><th>ID</th><th>User</th><th>Pesanan</th><th>Jumlah</th><th>Alasan</th><th>Status</th><th>Aksi</th></tr></thead>
                  <tbody>
                    {refunds.map((r) => (
                      <tr key={r.id}>
                        <td className="muted">{r.id}</td>
                        <td>{r.user}</td>
                        <td className="muted">{r.pesanan}</td>
                        <td>{rp(r.jumlah)}</td>
                        <td className="muted">{r.alasan}</td>
                        <td><Badge text={r.status} /></td>
                        <td>
                          {r.status === 'Menunggu' ? (
                            <>
                              <button type="button" className="ghost ok" onClick={() => setRefundStatus(r.id, 'setujui')}>Setujui</button>{' '}
                              <button type="button" className="ghost no" onClick={() => setRefundStatus(r.id, 'tolak')}>Tolak</button>
                            </>
                          ) : <span className="muted">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'Afiliasi' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '14px' }}>
                  <StatCard s={{ c: isDark ? '#A78BFA' : '#6D28D9', tint: 'rgba(139,92,246,.12)', line: 'rgba(139,92,246,.3)', l: 'Total Afiliasi', v: String(ringkasAfiliasi.totalAfiliasi), icon: ICON.affiliate }} />
                  <StatCard s={{ c: isDark ? '#4ADE80' : '#15803D', tint: 'rgba(34,197,94,.12)', line: 'rgba(34,197,94,.3)', l: 'Total Komisi Dibagikan', v: rp(ringkasAfiliasi.totalKomisi), icon: ICON.money }} />
                  <StatCard s={{ c: isDark ? '#FB923C' : '#C2410C', tint: 'rgba(249,115,22,.12)', line: 'rgba(249,115,22,.3)', l: 'Komisi Belum Dipakai', v: rp(ringkasAfiliasi.komisiTersedia), icon: ICON.wallet }} />
                </div>
                <div className="muted" style={{ fontSize: '12px' }}>Komisi 5% dari deposit referral. User memindahkannya ke saldo untuk belanja layanan.</div>
              </>
            )}

            {tab === 'Blog' && (
              <>
                <div className="card" style={{ padding: '18px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700' }}>Artikel blog</div>
                    <div className="muted" style={{ fontSize: '12px', marginTop: '4px' }}>Artikel yang terbit tampil di halaman /blog. Draf hanya terlihat di sini.</div>
                  </div>
                  <button type="button" className="submit" onClick={artikelBaru}>Tulis artikel baru</button>
                </div>
                <div className="card" style={{ overflowX: 'auto' }}>
                  <table className="tbl">
                    <thead><tr><th>Tanggal</th><th>Judul</th><th>Slug</th><th>Status</th><th></th></tr></thead>
                    <tbody>
                      {artikelList.length === 0 && <tr><td colSpan={5} className="muted">Belum ada artikel.</td></tr>}
                      {artikelList.map((a, i) => (
                        <tr key={a.slug}>
                          <td className="muted">{a.tanggal}</td>
                          <td style={{ fontWeight: '700' }}>{a.judul}</td>
                          <td className="muted">{a.slug}</td>
                          <td>{a.terbit === false ? 'Draf' : 'Terbit'}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            <button type="button" className="sub" onClick={() => pilihArtikel(i)}>Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {artikelSel !== -1 && (
                  <div className="card" style={{ padding: '22px', display: 'grid', gridTemplateColumns: '1fr', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800' }}>{artikelSel >= 0 ? 'Edit artikel' : 'Artikel baru'}</div>
                    <label style={{ display: 'grid', gap: '6px' }}>
                      <span className="muted" style={{ fontSize: '12px' }}>Judul</span>
                      <input className="inp" style={{ width: '100%', maxWidth: 'none', marginBottom: 0, boxSizing: 'border-box', fontSize: '17px', fontWeight: '700', padding: '12px 14px' }} placeholder="Judul artikel" value={artikelForm.judul} onChange={(e) => setArtikelForm({ ...artikelForm, judul: e.target.value })} />
                    </label>
                    <label style={{ display: 'grid', gap: '6px' }}>
                      <span className="muted" style={{ fontSize: '12px' }}>Slug (URL)</span>
                      <input className="inp" style={{ width: '100%', maxWidth: 'none', marginBottom: 0, boxSizing: 'border-box' }} placeholder="slug-url-artikel" value={artikelForm.slug} onChange={(e) => setArtikelForm({ ...artikelForm, slug: e.target.value })} />
                    </label>
                    <label style={{ display: 'grid', gap: '6px' }}>
                      <span className="muted" style={{ fontSize: '12px' }}>Ringkasan singkat</span>
                      <textarea className="inp" style={{ width: '100%', maxWidth: 'none', marginBottom: 0, boxSizing: 'border-box' }} rows={2} placeholder="Ringkasan singkat" value={artikelForm.ringkasan} onChange={(e) => setArtikelForm({ ...artikelForm, ringkasan: e.target.value })} />
                    </label>
                    <label style={{ display: 'grid', gap: '6px', justifySelf: 'start' }}>
                      <span className="muted" style={{ fontSize: '12px' }}>Tanggal</span>
                      <input className="inp" type="date" style={{ width: '200px' }} value={artikelForm.tanggal} onChange={(e) => setArtikelForm({ ...artikelForm, tanggal: e.target.value })} />
                    </label>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      <span className="muted" style={{ fontSize: '12px' }}>Gambar sampul (opsional, JPG, PNG, atau WEBP)</span>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {artikelForm.gambar ? <img src={artikelForm.gambar} alt="" style={{ width: '200px', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #26262E' }} /> : null}
                        <label className="sub" style={{ cursor: 'pointer' }}>
                          {artikelForm.gambar ? 'Ganti gambar' : 'Pilih gambar'}
                          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pilihGambar} style={{ display: 'none' }} />
                        </label>
                        {artikelForm.gambar ? <button type="button" className="sub" onClick={() => setArtikelForm({ ...artikelForm, gambar: '' })}>Hapus</button> : null}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span className="muted" style={{ fontSize: '12px' }}>Isi artikel (Markdown: ## judul, - daftar, **tebal**, baris kosong untuk paragraf baru)</span>
                        <button type="button" className="sub" onClick={() => setArtikelPratinjau(!artikelPratinjau)}>{artikelPratinjau ? 'Tulis' : 'Pratinjau'}</button>
                      </div>
                      {artikelPratinjau ? (
                        <div style={{ background: '#0A0A0C', border: '1px solid #26262E', borderRadius: '12px', padding: '20px', minHeight: '420px', fontSize: '15px', lineHeight: 1.7, color: '#D4D4D8' }}>
                          <Markdown teks={artikelForm.isiTeks} />
                        </div>
                      ) : (
                        <textarea className="inp" style={{ width: '100%', maxWidth: 'none', marginBottom: 0, boxSizing: 'border-box', minHeight: '420px', fontFamily: 'ui-monospace, Menlo, Consolas, monospace', fontSize: '13.5px', lineHeight: 1.6 }} placeholder="Tulis isi artikel di sini." value={artikelForm.isiTeks} onChange={(e) => setArtikelForm({ ...artikelForm, isiTeks: e.target.value })} />
                      )}
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <input type="checkbox" checked={artikelForm.terbit} onChange={(e) => setArtikelForm({ ...artikelForm, terbit: e.target.checked })} />
                      Terbitkan (kalau dimatikan, tersimpan sebagai draf)
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button type="button" className="submit" onClick={simpanArtikel} disabled={artikelBusy}>{artikelBusy ? 'Menyimpan...' : 'Simpan'}</button>
                      {artikelSel >= 0 ? <button type="button" className="sub" onClick={() => hapusArtikel(artikelSel)}>Hapus artikel</button> : null}
                      <button type="button" className="sub" onClick={() => { setArtikelSel(-1); setArtikelForm(kosongArtikel); }}>Batal</button>
                    </div>
                  </div>
                )}
              </>
            )}

            {tab === 'Peringkat' && (
              <>
                <div className="card" style={{ padding: '18px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700' }}>Undian bulanan {undian ? undian.bulan : ''}</div>
                    <div className="muted" style={{ fontSize: '12px', marginTop: '4px' }}>
                      {undian && undian.pemenang ? 'Pemenang: ' + undian.pemenang.username + ' (Rp ' + undian.pemenang.hadiah.toLocaleString('id-ID') + ')' : 'Peserta: ' + (undian ? undian.jumlahPeserta : 0) + ' user Insider ke atas. Hadiah Rp ' + (undian ? undian.hadiah : 500000).toLocaleString('id-ID') + '.'}
                    </div>
                  </div>
                  <button type="button" className="submit" onClick={undiUndian} disabled={!undian || !!undian.pemenang || undian.jumlahPeserta === 0}>Undi pemenang</button>
                </div>
                <div className="card" style={{ overflowX: 'auto' }}>
                  <table className="tbl">
                    <thead><tr><th>Peringkat</th><th>Minimal total belanja</th><th>Rentang</th><th>Keuntungan</th><th>Jumlah user</th></tr></thead>
                    <tbody>
                      {ranks.map((r, i) => {
                        const next = ranks[i + 1];
                        const range2 = next ? rp(r.min) + ' – ' + rp(next.min - 1) : rp(r.min) + ' ke atas';
                        return (
                          <tr key={r.nama}>
                            <td style={{ fontWeight: '700' }}>{r.nama}</td>
                            <td>
                              {i === 0 ? <span className="muted">Rp 0 (tetap)</span> : (
                                <input className="inp" type="number" min="0" value={r.min} onChange={(e) => setRankMin(i, e.target.value)} style={{ maxWidth: '160px', margin: 0 }} />
                              )}
                            </td>
                            <td className="muted">{range2}</td>
                            <td style={{ whiteSpace: 'normal', minWidth: '260px' }} className="muted">{r.benefit.join(' · ')}</td>
                            <td>{r.pengguna.toLocaleString('id-ID')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button type="button" className="submit" onClick={simpanPeringkat}>Simpan peringkat</button>
                  <span className="muted" style={{ fontSize: '12px' }}>Ubah angka minimal belanja untuk mengatur batas tiap peringkat. Rentang di tabel akan menyesuaikan otomatis.</span>
                </div>
              </>
            )}

            {tab === 'Pengaturan' && (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {[['Keamanan', ICON.lock], ['2FA', ICON.shield], ['Notifikasi', ICON.bell], ['Tampilan', ICON.mode], ['Provider', ICON.layers]].map(([name, icon]) => (
                    <button key={name} type="button" className={'sub' + (settingsTab === name ? ' on' : '')} onClick={() => setSettingsTab(name)}>
                      <Svg d={icon} size={14} sw={2} /> {name}
                    </button>
                  ))}
                </div>

                {settingsTab === 'Keamanan' && (
                  <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '520px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700' }}>Ganti password</div>
                    <input className="inp" style={{ maxWidth: 'none' }} type="password" placeholder="Password lama" value={pwOld} onChange={(e) => setPwOld(e.target.value)} />
                    <input className="inp" style={{ maxWidth: 'none' }} type="password" placeholder="Password baru (min. 8 karakter)" value={pwNew} onChange={(e) => setPwNew(e.target.value)} />
                    <input className="inp" style={{ maxWidth: 'none' }} type="password" placeholder="Ulangi password baru" value={pwNew2} onChange={(e) => setPwNew2(e.target.value)} />
                    {pwMsg ? <div style={{ fontSize: '12px', color: pwMsg.startsWith('Password berhasil') ? '#22C55E' : '#FF5A75' }}>{pwMsg}</div> : null}
                    <div><button type="button" className="submit" onClick={updatePwd}>Perbarui password</button></div>
                  </div>
                )}

                {settingsTab === '2FA' && (
                  <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', maxWidth: '520px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700' }}>Autentikasi dua langkah (2FA)</div>
                      <div className="muted" style={{ fontSize: '12px', marginTop: '4px' }}>{twofa ? 'Aktif. Login admin butuh kode tambahan.' : 'Nonaktif. Disarankan untuk akun admin.'}</div>
                    </div>
                    <Toggle on={twofa} onChange={setTwofa} label="Aktifkan 2FA" />
                  </div>
                )}

                {settingsTab === 'Notifikasi' && (
                  <div className="card" style={{ maxWidth: '520px' }}>
                    {NOTIF_ITEMS.map(([key, title, desc], i) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px 18px', borderBottom: i < NOTIF_ITEMS.length - 1 ? '1px solid var(--b2)' : 'none' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600' }}>{title}</div>
                          <div className="muted" style={{ fontSize: '12px', marginTop: '3px' }}>{desc}</div>
                        </div>
                        <Toggle on={notif[key]} onChange={(val) => setNotif((n) => ({ ...n, [key]: val }))} label={title} />
                      </div>
                    ))}
                  </div>
                )}

                {settingsTab === 'Tampilan' && (
                  <div className="card" style={{ padding: '22px', maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700' }}>Mode tema</div>
                      <div className="ux-grid3" style={{ marginTop: '12px' }}>
                        {themeOpts.map((o) => (
                          <button key={o.k} type="button" className="ux-card" aria-pressed={o.on} onClick={o.pick} style={{ borderColor: o.on ? 'var(--accent)' : 'var(--b3)' }}>
                            <span className="ux-prev" style={{ background: o.k === 'light' ? '#FFFFFF' : o.k === 'dark' ? '#0B0B0E' : 'linear-gradient(90deg,#FFFFFF 50%,#0B0B0E 50%)' }}>
                              <span className="ux-side" style={{ background: o.k === 'dark' ? '#16161A' : '#E6E8EC' }} />
                              <span className="ux-dot" style={{ background: 'var(--accent)' }} />
                            </span>
                            <span className="ux-name">{o.t}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700' }}>Warna tema</div>
                      <div className="ux-grid5" style={{ marginTop: '12px' }}>
                        {accentOpts.map((o) => (
                          <button key={o.k} type="button" className="ux-card" aria-pressed={o.on} onClick={o.pick} style={{ borderColor: o.on ? o.c : 'var(--b3)' }}>
                            <span className="ux-prev" style={{ background: 'var(--s2)' }}>
                              <span className="ux-bar" style={{ background: o.c }} />
                              <span className="ux-side" style={{ background: '#E6E8EC', top: '8px' }} />
                              <span className="ux-dot" style={{ background: o.c }} />
                            </span>
                            <span className="ux-name">{o.t}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'Provider' && (
                  <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '640px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700' }}>Provider layanan</div>
                    <div className="muted" style={{ fontSize: '12px' }}>
                      Tersambung ke <strong style={{ color: 'var(--hi)' }}>smmsoc.com</strong>. API key disimpan di file <strong style={{ color: 'var(--hi)' }}>.env.local</strong> di server, dan tidak pernah dikirim ke browser.
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <button type="button" className="submit" onClick={cekProvider} disabled={provBusy}>Cek koneksi &amp; saldo</button>
                      <button type="button" className="ghost" onClick={importServices} disabled={provBusy}>Ambil daftar layanan</button>
                    </div>
                    {provBusy ? <div className="muted" style={{ fontSize: '12px' }}>Menghubungi provider...</div> : null}
                    {provMsg ? (
                      <div style={{ fontSize: '12px', color: provMsg.ok ? '#22C55E' : '#FF5A75', lineHeight: '1.6' }}>{provMsg.text}</div>
                    ) : null}
                    <div className="muted" style={{ fontSize: '11px', lineHeight: '1.6' }}>
                      Harga dasar dihitung dari rate provider dikali kurs di tab Layanan ({rp(kurs)} per $1). Markup diatur sendiri setelah layanan masuk.
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
