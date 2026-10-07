import React from 'react';

/* Konstanta, ikon, dan komponen presentasional admin yang tidak bergantung pada state AdminPage.
   Dipisah dari AdminPage.jsx supaya file utamanya lebih ringkas. */

/* Halaman admin SosmedGo. Gaya mengikuti panel user. Data diambil dari database dan provider. */

export const ICON = {
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
export const FA_ADMIN = {
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

export const TABS_MAIN = [
  { id: 'Ringkasan', icon: ICON.home },
  { id: 'Statistik', icon: ICON.chart },
  { id: 'Pengguna', icon: ICON.users },
  { id: 'Pesanan', icon: ICON.cart },
  { id: 'Deposit', icon: ICON.wallet },
  { id: 'Layanan', icon: ICON.layers }
];
export const TABS_SUPPORT = [
  { id: 'Tiket', icon: ICON.ticket },
  { id: 'Update', icon: ICON.update },
  { id: 'Refund', icon: ICON.refund },
  { id: 'Afiliasi', icon: ICON.affiliate },
  { id: 'Peringkat', icon: ICON.rank },
  { id: 'Blog', icon: ICON.layers }
];
export const TAB_CRUMB = { Ringkasan: 'Ringkasan', Statistik: 'Statistik', Pengguna: 'Pengguna', Pesanan: 'Pesanan', Deposit: 'Deposit', Layanan: 'Layanan', Tiket: 'Tiket', Update: 'Update', Refund: 'Refund', Afiliasi: 'Afiliasi', Peringkat: 'Peringkat', Blog: 'Blog', Pengaturan: 'Pengaturan' };


/* Saldo provider di bawah ini dianggap menipis kalau kurang dari batas ini (dalam Rupiah). */
export const PROVIDER_LOW = 500000;

export const NOTIF_ITEMS = [
  ['order', 'Pesanan baru', 'Saat ada pesanan masuk'],
  ['deposit', 'Deposit masuk', 'Saat user mengirim deposit'],
  ['ticket', 'Tiket baru', 'Saat user membuka tiket'],
  ['refund', 'Refund diajukan', 'Saat user mengajukan refund'],
  ['withdraw', 'Penarikan afiliasi', 'Saat ada permintaan penarikan']
];



/* dasar = harga modal per 1000. markup = persen tambahan untuk harga jual. */
export const SOCIAL_ICON = {
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
export const SOCIAL_FA = {
  [SOCIAL_ICON.ig]: 'fa-brands fa-instagram',
  [SOCIAL_ICON.yt]: 'fa-brands fa-youtube',
  [SOCIAL_ICON.tt]: 'fa-brands fa-tiktok',
  [SOCIAL_ICON.tw]: 'fa-brands fa-x-twitter',
  [SOCIAL_ICON.sp]: 'fa-brands fa-spotify',
  [SOCIAL_ICON.tg]: 'fa-brands fa-telegram',
  [SOCIAL_ICON.fb]: 'fa-brands fa-facebook-f'
};

/* Jenis perubahan: label, warna latar, warna teks. Sama dengan dashboard user. */
export const UPS = {
  up: { label: 'Harga naik', bg: 'rgba(var(--accent-rgb),.1)', fg: 'var(--rt)' },
  down: { label: 'Harga turun', bg: 'rgba(34,197,94,.1)', fg: '#22C55E' },
  off: { label: 'Layanan dinonaktifkan', bg: 'var(--s4)', fg: 'var(--t3)' },
  new: { label: 'Layanan baru ditambahkan', bg: 'rgba(59,130,246,.1)', fg: '#60A5FA' }
};

/* Riwayat perubahan layanan. Data sama dengan halaman Update di dashboard user. */


export const LABEL_KATEGORI = { order: 'Pesanan', service: 'Layanan', payment: 'Pembayaran', other: 'Lainnya' };
export const LABEL_STATUS_TIKET = { open: 'Terbuka', answered: 'Dibalas', closed: 'Ditutup' };
export const LABEL_STATUS_REFUND = { menunggu: 'Menunggu', disetujui: 'Diterima', ditolak: 'Ditolak' };
export const refundAdmin = (r) => ({ id: r.id, user: r.username || '—', pesanan: r.pesanan, jumlah: r.jumlah, alasan: r.alasan || '', status: LABEL_STATUS_REFUND[r.status] || r.status });
export const tiketAdmin = (t) => ({ id: t.id, user: t.username || '—', kategori: LABEL_KATEGORI[t.kategori] || t.kategori, orderId: t.orderId || '', status: LABEL_STATUS_TIKET[t.status] || t.status, update: t.diupdate, msgs: t.pesan.map((m) => ({ from: m.from, text: m.text, time: m.time, lampiran: m.lampiran })), tingkat: t.tingkat || 0 });



export const rp = (n) => 'Rp ' + n.toLocaleString('id-ID');
/* Tanggal WIB dari waktu ISO. */
export const tanggalWib = (iso) => new Date(new Date(iso).getTime() + 7 * 3600 * 1000).toISOString().slice(0, 10);

/* Harga jual = harga dasar + markup, dibulatkan ke ratusan rupiah. */
export const hargaJual = (s) => Math.round((s.dasar * (1 + s.markup / 100)) / 100) * 100;

export const STATUS_COLOR = {
  Aktif: '#22C55E', Selesai: '#22C55E', Berhasil: '#22C55E', Diterima: '#22C55E', Terbit: '#22C55E',
  Diproses: '#60A5FA', Dibalas: '#60A5FA', 'In progress': '#60A5FA', Processing: '#60A5FA', Completed: '#22C55E', Partial: '#F59E0B', Canceled: '#FF5A75', Refunded: '#FF5A75',
  Pending: '#F59E0B', Menunggu: '#F59E0B', Terbuka: '#F59E0B',
  Refund: '#FF5A75', Diblokir: '#FF5A75', Ditolak: '#FF5A75',
  Nonaktif: '#8B8D96', Ditutup: '#8B8D96'
};

export const PILL = { Berhasil: '#14532D', Diterima: '#14532D', Selesai: '#14532D', Aktif: '#14532D', Terbit: '#14532D', Menunggu: '#78350F', Pending: '#78350F', Terbuka: '#78350F', Diproses: '#1E3A8A', Dibalas: '#1E3A8A', 'In progress': '#1E3A8A', Processing: '#1E3A8A', Completed: '#14532D', Partial: '#78350F', Canceled: '#7F1D1D', Refunded: '#7F1D1D', Ditolak: '#7F1D1D', Refund: '#7F1D1D', Diblokir: '#7F1D1D', Nonaktif: '#3F3F46', Ditutup: '#3F3F46' };

/* Statistik: rentang tanggal dihitung dari hari ini (WIB). Angkanya diambil dari /api/statistik. */
export const TODAY = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
export const hariLalu = (n) => new Date(Date.parse(TODAY + 'T00:00:00Z') - n * 86400000).toISOString().slice(0, 10);
export const RANGE_OPTS = ['7 Hari', '30 Hari', 'Bulan Ini', 'Bulan Lalu', 'Sepanjang Waktu', 'Custom'];
export const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
export const CHART_COLORS = {
  dark: { deposit: '#3457F0', revenue: '#F5A524', order: '#34D377', komisi: '#A78BFA' },
  light: { deposit: '#2446D6', revenue: '#D97706', order: '#16A34A', komisi: '#7C3AED' }
};
export const CHART_SERIES = [
  { key: 'deposit', name: 'Deposit', axis: 'left' },
  { key: 'revenue', name: 'Revenue', axis: 'left' },
  { key: 'order', name: 'Pesanan', axis: 'right' },
  { key: 'komisi', name: 'Komisi', axis: 'left' }
];
export const W = 900, PL = 12, PR = 12, PT = 16, PB = 34;

export function Svg({ d, size = 17 }) {
  return (
    <i className={FA_ADMIN[d] || 'fa-solid fa-circle'} aria-hidden="true" style={{ display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center', fontSize: size + 'px', width: size + 'px' }} />
  );
}

export function Badge({ text }) {
  const c = STATUS_COLOR[text] || '#A1A3AB';
  return (
    <span className="pill" style={{ color: '#F4F4F5', background: PILL[text] || '#3F3F46', border: '1px solid ' + c + '55' }}>{text}</span>
  );
}

export function StatCard({ s }) {
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

export function Toggle({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className="sw" style={{ background: on ? 'var(--accent)' : 'var(--b5)' }}>
      <span style={{ left: on ? '21px' : '3px' }} />
    </button>
  );
}

export function resolveRange(r, from, to) {
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

export function daysBetween(a, b) {
  if (!a || !b) return [];
  const [s, e] = a <= b ? [a, b] : [b, a];
  const out = [];
  for (let t = Date.parse(s + 'T00:00:00Z'), end = Date.parse(e + 'T00:00:00Z'); t <= end; t += 86400000) {
    out.push(new Date(t).toISOString().slice(0, 10));
  }
  return out;
}

export const rnd = (x) => { const v = Math.sin(x * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); };

export function niceMax(m) {
  if (m <= 0) return 4000;
  const step = 10 ** Math.floor(Math.log10(m)) / 2;
  return (Math.floor(m / step) + 1) * step;
}

export function niceCount(m) {
  if (m <= 0) return 4;
  return Math.ceil(m / 4) * 4;
}

export const fmtRb = (n) => (n >= 1000 ? Math.round(n / 1000) + 'rb' : String(n));
export const fmtDay = (iso) => { const [, m, d] = iso.split('-'); return Number(d) + ' ' + MON[Number(m) - 1]; };

export function smoothPath(pts) {
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
export function TrendChart({ data, series }) {
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

export function TrendTable({ rows }) {
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

export function OrdersTable({ rows, onRefund }) {
  return (
    <table className="tbl">
      <thead>
        <tr><th>ID</th><th>Provider</th><th>Layanan</th><th>Link</th><th>Jumlah</th><th>Biaya</th><th>Status</th><th>Dibuat</th><th>Durasi</th><th>Aksi</th></tr>
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
            <td>{onRefund && ['Canceled', 'Partial'].includes(o.status) ? <button type="button" className="sub" onClick={() => onRefund(o.id)}>Refund</button> : null}</td>
            <td>{o.selesaiAt ? 'Selesai dalam ' + Math.max(0, Math.round((new Date(o.selesaiAt) - new Date(o.dibuat)) / 60000)) + ' menit' : (['Completed', 'Canceled', 'Refunded', 'Partial'].includes(o.status) ? '—' : 'Berjalan ' + Math.max(0, Math.round((Date.now() - new Date(o.dibuat)) / 60000)) + ' menit')}</td>
          </tr>
        ))}
        {rows.length === 0 && <tr><td colSpan={10} className="muted">Belum ada pesanan.</td></tr>}
      </tbody>
    </table>
  );
}

