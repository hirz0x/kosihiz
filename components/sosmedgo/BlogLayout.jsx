import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const MENU = [
  { href: '/', label: 'Beranda' },
  { href: '/layanan', label: 'Layanan' },
  { href: '/blog', label: 'Blog' },
  { href: '/login', label: 'Masuk' },
  { href: '/register', label: 'Daftar' }
];

export default function BlogLayout({ judul, deskripsi, lebar = 860, children }) {
  const [menuBuka, setMenuBuka] = useState(false);

  return (
    <>
      <Head>
        <title>{judul + ' — SosmedGo'}</title>
        <meta name="description" content={deskripsi} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/icon.png" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
        <style>{`
          html,body{margin:0;background:#0A0A0C;color:#F4F4F5;font-family:'Plus Jakarta Sans',system-ui,sans-serif;color-scheme:dark;-webkit-text-size-adjust:100%;overflow-x:hidden;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
          html{scroll-behavior:smooth}
          a,button{transition:background-color .15s ease,border-color .15s ease,color .15s ease,box-shadow .15s ease,transform .15s cubic-bezier(.4,0,.2,1),opacity .15s ease;-webkit-tap-highlight-color:transparent}
          button:active:not(:disabled){transform:scale(.97)}
          .bl-wrap{max-width:1180px;margin:0 auto;padding:20px 20px 0}
          .bl-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:10px 14px;background:rgba(20,20,24,.6);border:1px solid #26262E;border-radius:16px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
          .bl-nav{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
          .bl-nav a{text-decoration:none;font-size:14px;font-weight:600;padding:8px 12px;border-radius:10px;white-space:nowrap}
          .bl-nav a:hover{background:rgba(255,255,255,.06)}
          .bl-burger{display:none;width:42px;height:42px;border-radius:12px;background:#17171B;border:1px solid #26262E;align-items:center;justify-content:center;cursor:pointer;padding:0}
          .bl-burger:hover{border-color:#3A3A42}
          .bl-mmenu{display:none}
          @media (max-width:640px){
            .bl-wrap{padding:12px 12px 0}
            .bl-head{padding:8px 10px;border-radius:14px;flex-wrap:nowrap}
            .bl-nav{display:none}
            .bl-burger{display:flex}
            .bl-mmenu.buka{display:flex;flex-direction:column;gap:2px;margin-top:8px;padding:10px 14px 14px;background:rgba(20,20,24,.92);border:1px solid #26262E;border-radius:18px}
            .bl-mmenu a{text-decoration:none;font-size:14px;font-weight:600;padding:12px 14px;border-radius:10px;color:#D4D4D8}
            .bl-btn-baris{display:flex;gap:8px;margin-top:10px}
            .bl-btn-baris a{flex:1;text-align:center;padding:12px 14px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none}
            .bl-btn-o{background:#17171B;border:1px solid #26262E;color:#F4F4F5}
            .bl-btn{background:#E11D3A;color:#FFFFFF}
            .bl-main{padding:36px 0 64px !important}
            input,select,textarea{font-size:16px !important}
          }
        `}</style>
      </Head>
      <div style={{ minHeight: '100vh', background: 'radial-gradient(900px 420px at 50% -120px, rgba(225,29,58,.22), rgba(225,29,58,0)), #0A0A0C' }}>
        <div className="bl-wrap">
          <header className="bl-head">
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#F4F4F5', textDecoration: 'none', fontWeight: 800 }}>
              <img src="/icon.png" alt="" width="30" height="30" style={{ borderRadius: '8px' }} />
              SosmedGo
            </Link>
            <nav className="bl-nav">
              <Link href="/" style={{ color: '#D4D4D8' }}>Beranda</Link>
              <Link href="/layanan" style={{ color: '#D4D4D8' }}>Layanan</Link>
              <Link href="/blog" style={{ color: '#FF5A75', background: '#2A0E14' }}>Blog</Link>
              <Link href="/login" style={{ color: '#F4F4F5', background: '#17171B', border: '1px solid #26262E', padding: '8px 14px' }}>Masuk</Link>
              <Link href="/register" style={{ color: '#FFFFFF', background: '#E11D3A', padding: '8px 14px' }}>Daftar</Link>
            </nav>
            <button type="button" className="bl-burger" aria-label={menuBuka ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuBuka} onClick={() => setMenuBuka(!menuBuka)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4F4F5" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                {menuBuka ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </header>
          <nav className={'bl-mmenu' + (menuBuka ? ' buka' : '')} aria-label="Menu utama">
            {MENU.filter((m) => m.label !== 'Masuk' && m.label !== 'Daftar').map((m) => (
              <Link key={m.href} href={m.href} onClick={() => setMenuBuka(false)} style={m.label === 'Blog' ? { color: '#FF5A75' } : undefined}>
                {m.label}
              </Link>
            ))}
            <div className="bl-btn-baris">
              <Link href="/login" onClick={() => setMenuBuka(false)} className="bl-btn-o">Masuk</Link>
              <Link href="/register" onClick={() => setMenuBuka(false)} className="bl-btn">Daftar</Link>
            </div>
          </nav>
          <main className="bl-main" style={{ maxWidth: lebar + 'px', margin: '0 auto', padding: '56px 0 90px' }}>
            {children}
          </main>
          <footer style={{ borderTop: '1px solid #1A1A1F', padding: '24px 0 36px', textAlign: 'center', color: '#6B6E78', fontSize: '13px' }}>
            © SosmedGo
          </footer>
        </div>
      </div>
    </>
  );
}
