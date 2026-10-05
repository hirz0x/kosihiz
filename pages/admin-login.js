import React, { useState } from 'react';
import Head from 'next/head';

const WARNA = { latar: '#0A0A0C', kartu: '#121216', garis: '#26262E', aksen: '#E11D3A', teks: '#F4F4F5', redup: '#9A9AA5' };

const kolom = {
  display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px'
};
const label = { fontSize: '12px', fontWeight: 600, color: WARNA.redup };
const input = {
  height: '46px', width: '100%', boxSizing: 'border-box', background: '#0D0D10', border: '1px solid ' + WARNA.garis,
  borderRadius: '10px', padding: '0 14px', color: WARNA.teks, fontSize: '16px', outline: 'none', fontFamily: 'inherit'
};

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [lihat, setLihat] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const masuk = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr('');
    try {
      const r = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || 'Gagal masuk. Coba lagi.');
      window.location.href = '/admin';
    } catch (ex) {
      setErr(ex.message);
      setPassword('');
      setBusy(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login admin · SosmedGo</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ minHeight: '100vh', background: WARNA.latar, color: WARNA.teks, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
            <span aria-hidden="true" style={{ width: '32px', height: '32px', borderRadius: '9px', background: WARNA.aksen, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>SG</span>
            <span style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-.02em' }}>SosmedGo</span>
          </div>
          <form onSubmit={masuk} style={{ background: WARNA.kartu, border: '1px solid ' + WARNA.garis, borderRadius: '16px', padding: '24px 22px', boxShadow: '0 24px 60px rgba(0,0,0,.4)' }}>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, letterSpacing: '-.02em' }}>Login admin</h1>
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: WARNA.redup, lineHeight: 1.5 }}>Masuk untuk mengelola panel SosmedGo.</p>

            <div style={kolom}>
              <label htmlFor="adm-user" style={label}>Username</label>
              <input id="adm-user" style={input} value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoCapitalize="none" spellCheck={false} required maxLength={64} disabled={busy} />
            </div>

            <div style={kolom}>
              <label htmlFor="adm-pw" style={label}>Kata sandi</label>
              <div style={{ position: 'relative' }}>
                <input id="adm-pw" type={lihat ? 'text' : 'password'} style={{ ...input, paddingRight: '64px' }} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required maxLength={128} disabled={busy} />
                <button type="button" onClick={() => setLihat((v) => !v)} aria-label={lihat ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', height: '34px', padding: '0 10px', background: 'transparent', border: 'none', color: WARNA.redup, cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit' }}>
                  {lihat ? 'Sembunyikan' : 'Lihat'}
                </button>
              </div>
            </div>

            {err ? (
              <div role="alert" style={{ marginTop: '16px', background: '#2A0C12', border: '1px solid #7F1D2D', color: '#FCA5B1', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', lineHeight: 1.5 }}>
                {err}
              </div>
            ) : null}

            <button type="submit" disabled={busy || !username || !password} style={{ marginTop: '20px', width: '100%', height: '46px', borderRadius: '10px', border: 'none', background: WARNA.aksen, color: '#FFFFFF', fontWeight: 700, fontSize: '14px', cursor: busy ? 'wait' : 'pointer', opacity: busy || !username || !password ? 0.6 : 1, fontFamily: 'inherit' }}>
              {busy ? 'Memeriksa...' : 'Masuk'}
            </button>
          </form>
          <p style={{ margin: '16px 0 0', textAlign: 'center', fontSize: '11px', color: WARNA.redup }}>Akses terbatas. Percobaan login yang gagal dibatasi otomatis.</p>
        </div>
      </main>
    </>
  );
}
