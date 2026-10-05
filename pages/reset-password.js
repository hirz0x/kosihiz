import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const WARNA = { latar: '#0A0A0C', kartu: '#121216', garis: '#26262E', aksen: '#E11D3A', teks: '#F4F4F5', redup: '#9A9AA5' };

export default function ResetPassword() {
  const [token, setToken] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [selesai, setSelesai] = useState(false);

  useEffect(() => {
    const h = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const t = h.get('access_token') || '';
    setToken(t);
    if (t) window.history.replaceState(null, '', window.location.pathname);
    else setErr('Link reset tidak valid atau sudah kedaluwarsa. Minta link baru.');
  }, []);

  const simpan = async (e) => {
    e.preventDefault();
    if (pw !== pw2) { setErr('Konfirmasi password tidak sama.'); return; }
    if (pw.length < 8) { setErr('Password minimal 8 karakter.'); return; }
    setBusy(true);
    setErr('');
    try {
      const r = await fetch('/api/auth/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accessToken: token, password: pw }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || 'Password gagal diperbarui.');
      setSelesai(true);
    } catch (ex) {
      setErr(ex.message);
    }
    setBusy(false);
  };

  const input = { height: '46px', background: '#0D0D10', border: '1px solid ' + WARNA.garis, borderRadius: '10px', padding: '0 14px', color: WARNA.teks, fontSize: '16px', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' };
  const siap = !busy && token && pw && pw2;

  return (
    <>
      <Head>
        <title>Buat password baru · SosmedGo</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ minHeight: '100vh', background: WARNA.latar, color: WARNA.teks, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '380px', background: WARNA.kartu, border: '1px solid ' + WARNA.garis, borderRadius: '16px', padding: '24px 22px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Buat password baru</h1>
          {selesai ? (
            <div style={{ marginTop: '12px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: WARNA.redup, lineHeight: 1.6 }}>Password kamu sudah diperbarui. Silakan login dengan password baru.</p>
              <p style={{ margin: '16px 0 0', textAlign: 'center' }}><Link href="/login" style={{ color: WARNA.aksen, fontWeight: 700 }}>Ke halaman login</Link></p>
            </div>
          ) : (
            <form onSubmit={simpan} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              <label htmlFor="rp-1" style={{ fontSize: '12px', color: WARNA.redup }}>Password baru</label>
              <input id="rp-1" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} disabled={busy || !token} style={input} />
              <label htmlFor="rp-2" style={{ fontSize: '12px', color: WARNA.redup }}>Konfirmasi password baru</label>
              <input id="rp-2" type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} disabled={busy || !token} style={input} />
              {err ? <div role="alert" style={{ fontSize: '12px', color: '#FF5A75' }}>{err}</div> : null}
              <button type="submit" disabled={!siap} style={{ marginTop: '8px', height: '46px', borderRadius: '10px', border: 'none', background: WARNA.aksen, color: '#FFFFFF', fontWeight: 700, fontSize: '14px', cursor: busy ? 'wait' : 'pointer', opacity: siap ? 1 : 0.6, fontFamily: 'inherit' }}>
                {busy ? 'Menyimpan...' : 'Simpan password'}
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
