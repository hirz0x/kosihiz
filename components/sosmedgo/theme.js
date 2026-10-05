/* Pilihan warna aksen dan fungsi pembuat variabel CSS-nya. Dipakai bersama oleh panel admin. */
export const ACCENTS = {
  blue: { label: 'Biru', c: '#3B82F6', rgb: '59,130,246', h: '#2563EB', l: '#60A5FA' },
  red: { label: 'Merah', c: '#E11D3A', rgb: '225,29,58', h: '#C8102E', l: '#FF5A75' },
  green: { label: 'Hijau', c: '#22C55E', rgb: '34,197,94', h: '#16A34A', l: '#4ADE80' },
  purple: { label: 'Ungu', c: '#A855F7', rgb: '168,85,247', h: '#9333EA', l: '#C084FC' },
  orange: { label: 'Oranye', c: '#F97316', rgb: '249,115,22', h: '#EA580C', l: '#FB923C' }
};

/* Campur dua warna hex: t bagian a, sisanya b. */
export function mixHex(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.substr(i, 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.substr(i, 2), 16));
  return '#' + [0, 1, 2].map((k) => Math.round(pa[k] * t + pb[k] * (1 - t)).toString(16).padStart(2, '0')).join('');
}

/* Variabel warna aksen + latar tint yang dihitung dari warna aksen dan mode. st = { accent, theme } */
export function accentVarsFor(st) {
  const A = ACCENTS[st.accent] || ACCENTS.red;
  const dark = st.theme === 'dark';
  const base = dark ? '#0B0B0E' : '#FFFFFF';
  const share = dark
    ? { r1: 0.07, r2: 0.1, r3: 0.16, r4: 0.26, r5: 0.38, r6: 0.13, g1: 0.04, g2: 0.1 }
    : { r1: 0.05, r2: 0.05, r3: 0.1, r4: 0.25, r5: 0.4, r6: 0.2, g1: 0.03, g2: 0.07 };
  /* Varian terang enak dibaca di latar gelap; di latar putih dipakai varian pekat. */
  const text = dark ? A.l : A.h;
  const vars = { '--accent': A.c, '--accent-rgb': A.rgb, '--accent-h': A.h, '--accent-l': text, '--rt': text };
  Object.keys(share).forEach((k) => { vars['--' + k] = mixHex(A.c, base, share[k]); });
  return vars;
}
