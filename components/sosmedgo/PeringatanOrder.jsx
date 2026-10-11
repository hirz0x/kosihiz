import React from 'react';

const WA_HREF = 'https://whatsapp.com/channel/0029VbDlg3EIt5s051wllX3B';
const TG_HREF = 'https://t.me/smmsosmedgo';

/* Peringatan sebelum order, muncul sekali tiap habis login. Cuma satu tombol tutup (bukan
   konfirmasi ya/tidak) karena ini sekadar info, bukan aksi yang perlu dibatalkan. */
export default function PeringatanOrder({ onClose, onHubungiAdmin }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(5,5,7,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'sgOverlayMasuk .15s ease-out' }}>
      <style>{'@keyframes sgOverlayMasuk{0%{opacity:0}100%{opacity:1}}@keyframes sgKotakMasuk{0%{opacity:0;transform:translateY(10px) scale(.96)}100%{opacity:1;transform:translateY(0) scale(1)}}'}</style>
      <div role="dialog" aria-modal="true" aria-label="Sebelum order" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '420px', background: 'var(--s1)', border: '1px solid var(--b3)', borderRadius: '18px', padding: '24px', color: 'var(--tx)', boxShadow: '0 24px 60px rgba(0,0,0,.4)', boxSizing: 'border-box', fontFamily: 'inherit', animation: 'sgKotakMasuk .2s cubic-bezier(.34,1.56,.64,1)' }}>
        <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'var(--g2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--am)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.9 1.8 18a1.8 1.8 0 0 0 1.5 2.7h17.4a1.8 1.8 0 0 0 1.5-2.7L13.7 3.9a1.8 1.8 0 0 0-3.4 0Z" /><line x1="12" y1="9.5" x2="12" y2="13.5" /><line x1="12" y1="16.5" x2="12.01" y2="16.5" /></svg>
        </div>
        <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--hi)' }}>Sebelum order</div>
        <div style={{ fontSize: '14px', color: 'var(--t3)', lineHeight: 1.6 }}>
          Cek dulu channel WhatsApp atau Telegram kami untuk tahu layanan mana yang sedang lancar, sebelum order. Kalau masih ragu, hubungi admin dulu lewat tiket.
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <a href={WA_HREF} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', textDecoration: 'none', background: 'rgba(37,211,102,.1)', border: '1px solid rgba(37,211,102,.35)', color: '#25D366', borderRadius: '10px', padding: '9px 10px', fontSize: '13px', fontWeight: 600 }}>
            <i className="fa-brands fa-whatsapp" /> WhatsApp
          </a>
          <a href={TG_HREF} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', textDecoration: 'none', background: 'rgba(34,158,217,.1)', border: '1px solid rgba(34,158,217,.35)', color: '#229ED9', borderRadius: '10px', padding: '9px 10px', fontSize: '13px', fontWeight: 600 }}>
            <i className="fa-brands fa-telegram" /> Telegram
          </a>
        </div>
        <button type="button" onClick={onHubungiAdmin} style={{ width: '100%', marginTop: '8px', background: 'transparent', border: 'none', color: 'var(--t4)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline', padding: '4px' }}>
          Atau hubungi admin lewat tiket
        </button>
        <button type="button" onClick={onClose} autoFocus style={{ width: '100%', marginTop: '10px', background: 'var(--accent)', border: 'none', color: '#FFFFFF', borderRadius: '10px', padding: '11px 16px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          Mengerti
        </button>
      </div>
    </div>
  );
}
