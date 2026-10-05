import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import BlogLayout from '../../components/sosmedgo/BlogLayout';

/* Daftar layanan untuk pengunjung, tampilannya mengikuti halaman Layanan di dashboard.
 * Data dari /api/services. Harga sudah termasuk markup. Tombol beli mengarah ke halaman masuk. */

const PER_HALAMAN = 40;

const hargaDari = (s) => Math.round((s.dasar * (1 + (s.markup || 0) / 100)) / 100) * 100;

const IKON_MERAH = (
  <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#E11D3A', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 5h18l-7 9v5l-4 2v-7z" /></svg>
  </span>
);

export default function Layanan() {
  const [list, setList] = useState(null);
  const [gagal, setGagal] = useState(false);
  const [cari, setCari] = useState('');
  const [kat, setKat] = useState('Semua');
  const [tampil, setTampil] = useState(PER_HALAMAN);

  useEffect(() => {
    fetch('/api/services')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('gagal'))))
      .then((d) => setList((d.services || []).filter((s) => s.aktif && s.dasar > 0)))
      .catch(() => setGagal(true));
  }, []);

  useEffect(() => { setTampil(PER_HALAMAN); }, [cari, kat]);

  const kategori = useMemo(() => ['Semua', ...Array.from(new Set((list || []).map((s) => s.kategori))).sort()], [list]);

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return (list || []).filter((s) => (kat === 'Semua' || s.kategori === kat) && (!q || String(s.nama).toLowerCase().includes(q) || String(s.id) === q));
  }, [list, cari, kat]);

  /* Jumlah layanan per kategori dari seluruh hasil, bukan hanya yang sedang tampil. */
  const jumlahKat = useMemo(() => {
    const m = {};
    hasil.forEach((s) => { m[s.kategori] = (m[s.kategori] || 0) + 1; });
    return m;
  }, [hasil]);

  /* Layanan yang tampil dikelompokkan per kategori, mengikuti urutan kemunculannya. */
  const kelompok = useMemo(() => {
    const urut = [];
    const indeks = {};
    hasil.slice(0, tampil).forEach((s) => {
      if (indeks[s.kategori] === undefined) {
        indeks[s.kategori] = urut.length;
        urut.push({ nama: s.kategori, items: [] });
      }
      urut[indeks[s.kategori]].items.push(s);
    });
    return urut;
  }, [hasil, tampil]);

  const pil = { background: '#17171B', border: '1px solid #26262E', borderRadius: '999px', height: '46px', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 16px', color: '#F4F4F5', fontSize: '14px', fontWeight: 600, boxSizing: 'border-box' };
  const kotak = { background: '#0E0E11', border: '1px solid #1A1A1F', borderRadius: '16px' };
  const chip = { border: '1px solid #26262E', borderRadius: '10px', padding: '7px 12px', fontSize: '12px', color: '#D4D4D8', whiteSpace: 'nowrap' };

  return (
    <BlogLayout judul="Layanan" deskripsi="Daftar layanan SMM SosmedGo lengkap dengan harga per 1000 dan estimasi waktu." lebar={1100}>
      <style>{`
        @media (max-width:640px){
          .lay-banner{margin:-36px -12px 22px !important;padding:36px 16px 26px !important;border-radius:16px !important}
          .lay-banner h1{font-size:30px !important}
          .lay-kontrol{flex-direction:column;align-items:stretch !important}
          .lay-kontrol > *{flex:1 1 auto !important;width:100% !important;min-width:0 !important;box-sizing:border-box}
          .lay-pil select,.lay-pil input{font-size:16px !important}
          .lay-baris{padding:14px 14px !important}
          .lay-tombol{margin-left:0 !important;width:100%}
          .lay-tombol a{display:block;text-align:center}
          .lay-bawah{gap:8px !important}
        }
      `}</style>
      <div className="lay-banner" style={{ position: 'relative', margin: '-56px -20px 28px', padding: '56px 20px 36px', borderRadius: '20px', background: 'radial-gradient(700px 260px at 70% 0%, rgba(225,29,58,.22), rgba(225,29,58,0)), repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 1px, transparent 1px 44px), repeating-linear-gradient(90deg, rgba(255,255,255,.035) 0 1px, transparent 1px 44px)', border: '1px solid #1A1A1F' }}>
        <div style={{ fontSize: '12px', color: '#6B6E78', marginBottom: '14px' }}>
          <Link href="/" style={{ color: '#A1A3AB', textDecoration: 'none' }}>Beranda</Link> <span style={{ color: '#E11D3A' }}>›</span> <span style={{ color: '#FF5A75' }}>Layanan</span>
        </div>
        <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(32px,4.5vw,46px)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.1 }}>Layanan</h1>
        <p style={{ margin: 0, color: '#A1A3AB', fontSize: '15px' }}>Lihat daftar layanan di sini. Harga per 1000 sudah termasuk markup.</p>
      </div>

      {gagal ? (
        <div style={{ ...kotak, padding: '36px 24px', textAlign: 'center', color: '#A1A3AB' }}>
          Daftar layanan belum bisa dimuat. Coba muat ulang halaman.
        </div>
      ) : list === null ? (
        <div style={{ ...kotak, padding: '36px 24px', textAlign: 'center', color: '#A1A3AB' }}>
          Memuat layanan...
        </div>
      ) : list.length === 0 ? (
        <div style={{ ...kotak, padding: '36px 24px', textAlign: 'center', color: '#A1A3AB' }}>
          Belum ada layanan yang tersedia.
        </div>
      ) : (
        <>
          <div className="lay-kontrol" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
            <label className="lay-pil" style={{ ...pil, position: 'relative', minWidth: '240px', cursor: 'pointer' }}>
              {IKON_MERAH}
              <select value={kat} onChange={(e) => setKat(e.target.value)} style={{ background: 'transparent', border: 'none', color: '#F4F4F5', fontFamily: 'inherit', fontSize: '14px', fontWeight: 600, outline: 'none', flex: 1, minWidth: 0, cursor: 'pointer' }}>
                {kategori.map((k) => <option key={k} value={k} style={{ background: '#0E0E11' }}>{k === 'Semua' ? 'Semua kategori' : k}</option>)}
              </select>
            </label>
            <div className="lay-pil" style={{ ...pil, flex: '0 1 340px', padding: '0 6px 0 16px' }}>
              <input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari layanan" style={{ background: 'transparent', border: 'none', color: '#F4F4F5', fontFamily: 'inherit', fontSize: '14px', outline: 'none', flex: 1, minWidth: 0, fontWeight: 400 }} />
              <span style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#E11D3A', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
              </span>
            </div>
          </div>

          {hasil.length === 0 ? (
            <div style={{ ...kotak, padding: '36px 24px', textAlign: 'center', color: '#A1A3AB' }}>
              Tidak ada layanan yang cocok.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {kelompok.map((g) => (
                <div key={g.nama} style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ ...kotak, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <span style={{ width: '32px', height: '32px', borderRadius: '9px', background: '#E11D3A', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', flexShrink: 0 }}>{g.nama.charAt(0).toUpperCase()}</span>
                      <span style={{ fontSize: '15px', fontWeight: 700 }}>{g.nama}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#6B6E78', whiteSpace: 'nowrap' }}>{jumlahKat[g.nama]} layanan</span>
                  </div>

                  {g.items.map((s) => (
                    <div key={s.id} className="lay-baris" style={{ ...kotak, padding: '16px 18px', display: 'grid', gap: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ background: '#E11D3A', color: '#FFFFFF', borderRadius: '999px', padding: '5px 12px', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap' }}>ID: {s.id}</span>
                        <span style={{ fontSize: '15px', fontWeight: 600, flex: '1 1 260px', lineHeight: 1.4 }}>{s.nama}</span>
                        <span style={{ border: '1px solid #26262E', borderRadius: '10px', overflow: 'hidden', display: 'inline-flex', fontSize: '14px', whiteSpace: 'nowrap' }}>
                          <span style={{ padding: '8px 12px', color: '#FF5A75', fontWeight: 700 }}>≈ Rp {hargaDari(s).toLocaleString('id-ID')}</span>
                          <span style={{ padding: '8px 12px', color: '#6B6E78', borderLeft: '1px solid #26262E' }}>1000</span>
                        </span>
                      </div>
                      <div className="lay-bawah" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ ...chip, display: 'inline-flex', overflow: 'hidden', padding: 0 }}>
                          <span style={{ padding: '7px 12px' }}>Min: {Number(s.min).toLocaleString('id-ID')}</span>
                          <span style={{ padding: '7px 12px', borderLeft: '1px solid #26262E' }}>Maks: {Number(s.maks).toLocaleString('id-ID')}</span>
                        </span>
                        {s.refill
                          ? <span style={{ ...chip, border: '1px solid rgba(34,197,94,.35)', background: 'rgba(34,197,94,.12)', color: '#4ADE80' }}>↻ Refill: Tersedia</span>
                          : <span style={{ ...chip, color: '#6B6E78' }}>↻ Refill: Tidak tersedia</span>}
                        {s.waktuRata ? <span style={{ ...chip, background: 'rgba(34,197,94,.08)', color: '#4ADE80' }}>± {Math.round(s.waktuRata)} menit</span> : null}
                        <span className="lay-tombol" style={{ marginLeft: 'auto' }}>
                          <Link href="/login" style={{ display: 'inline-block', background: '#E11D3A', color: '#FFFFFF', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Beli Sekarang</Link>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {hasil.length > tampil ? (
            <div style={{ textAlign: 'center', marginTop: '22px' }}>
              <button type="button" onClick={() => setTampil(tampil + PER_HALAMAN)} style={{ background: '#17171B', border: '1px solid #26262E', color: '#F4F4F5', borderRadius: '12px', padding: '12px 22px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Muat lebih banyak ({(hasil.length - tampil).toLocaleString('id-ID')} lagi)
              </button>
            </div>
          ) : null}
        </>
      )}
    </BlogLayout>
  );
}
