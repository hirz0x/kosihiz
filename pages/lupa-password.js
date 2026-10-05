import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const WARNA = { latar: '#0A0A0C', kartu: '#121216', garis: '#26262E', aksen: '#E11D3A', teks: '#F4F4F5', redup: '#9A9AA5' };

export default function LupaPassword() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [terkirim, setTerkirim] = useState(false);

  const kirim = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const r = await fetch('/api/auth/lupa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || 'Gagal mengirim link.');
      setTerkirim(true);
    } catch (ex) {
      setErr(ex.message);
    }
    setBusy(false);
  };

  return (
    <>
      <Head>
        <title>Lupa password · SosmedGo</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ minHeight: '100vh', background: WARNA.latar, color: WARNA.teks, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '380px', background: WARNA.kartu, border: '1px solid ' + WARNA.garis, borderRadius: '16px', padding: '24px 22px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Lupa password</h1>
          {terkirim ? (
            <p style={{ margin: '12px 0 0', fontSize: '13px', color: WARNA.redup, lineHeight: 1.6 }}>
              Jika email itu terdaftar, link untuk membuat password baru sudah dikirim. Cek kotak masuk dan folder spam kamu.
            </p>
          ) : (
            <form onSubmit={kirim} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: WARNA.redup, lineHeight: 1.6 }}>Masukkan email akun kamu. Kami akan mengirim link untuk membuat password baru.</p>
              <label htmlFor="lupa-email" style={{ fontSize: '12px', color: WARNA.redup, marginTop: '6px' }}>Email</label>
              <input id="lupa-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} style={{ height: '46px', background: '#0D0D10', border: '1px solid ' + WARNA.garis, borderRadius: '10px', padding: '0 14px', color: WARNA.teks, fontSize: '16px', outline: 'none', fontFamily: 'inherit' }} />
              {err ? <div role="alert" style={{ fontSize: '12px', color: '#FF5A75' }}>{err}</div> : null}
              <button type="submit" disabled={busy || !email} style={{ marginTop: '8px', height: '46px', borderRadius: '10px', border: 'none', background: WARNA.aksen, color: '#FFFFFF', fontWeight: 700, fontSize: '14px', cursor: busy ? 'wait' : 'pointer', opacity: busy || !email ? 0.6 : 1, fontFamily: 'inherit' }}>
                {busy ? 'Mengirim...' : 'Kirim link reset'}
              </button>
            </form>
          )}
          <p style={{ margin: '18px 0 0', textAlign: 'center', fontSize: '13px' }}>
            <Link href="/login" style={{ color: WARNA.aksen, fontWeight: 700 }}>Kembali ke login</Link>
          </p>
        </div>
      </main>
    </>
  );
}
