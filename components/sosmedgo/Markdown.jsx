import React from 'react';

/* Markdown sederhana untuk artikel: judul (## dan ###), daftar (- ), paragraf, dan **tebal**. Teks di-escape oleh React. */

function inline(teks, kunci) {
  return String(teks).split(/(\*\*[^*]+\*\*)/g).map((b, i) => {
    if (b.length > 4 && b.startsWith('**') && b.endsWith('**')) return <strong key={kunci + '-' + i}>{b.slice(2, -2)}</strong>;
    return <React.Fragment key={kunci + '-' + i}>{b}</React.Fragment>;
  });
}

export default function Markdown({ teks }) {
  const baris = String(teks || '').replace(/\r/g, '').split('\n');
  const hasil = [];
  let paragraf = [];
  let daftar = [];

  const tulisParagraf = () => {
    if (paragraf.length === 0) return;
    const k = 'p' + hasil.length;
    hasil.push(<p key={k} style={{ margin: 0 }}>{inline(paragraf.join(' '), k)}</p>);
    paragraf = [];
  };
  const tulisDaftar = () => {
    if (daftar.length === 0) return;
    const k = 'u' + hasil.length;
    hasil.push(<ul key={k} style={{ margin: 0, paddingLeft: '22px', display: 'grid', gap: '6px' }}>{daftar.map((t, i) => <li key={i}>{inline(t, k + '-' + i)}</li>)}</ul>);
    daftar = [];
  };

  baris.forEach((raw) => {
    const t = raw.trim();
    if (!t) { tulisParagraf(); tulisDaftar(); return; }
    if (t.startsWith('### ')) { tulisParagraf(); tulisDaftar(); const k = 'h' + hasil.length; hasil.push(<h3 key={k} style={{ margin: '8px 0 0', fontSize: '18px', fontWeight: 700, color: '#F4F4F5' }}>{inline(t.slice(4), k)}</h3>); return; }
    if (t.startsWith('## ')) { tulisParagraf(); tulisDaftar(); const k = 'h' + hasil.length; hasil.push(<h2 key={k} style={{ margin: '8px 0 0', fontSize: '22px', fontWeight: 800, color: '#F4F4F5' }}>{inline(t.slice(3), k)}</h2>); return; }
    if (/^[-*] /.test(t)) { tulisParagraf(); daftar.push(t.slice(2)); return; }
    tulisDaftar();
    paragraf.push(t);
  });
  tulisParagraf();
  tulisDaftar();

  return <div style={{ display: 'grid', gap: '16px' }}>{hasil}</div>;
}
