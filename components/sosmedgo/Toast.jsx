import React from 'react';

/* Notifikasi singkat di pojok kanan atas. Dipakai bersama oleh dashboard user dan admin.
   toast = { ok: true | false | 'info', text }. Penutupan otomatis diatur pemanggil. */
export default function Toast({ toast, onClose }) {
  if (!toast) return null;
  const tipe = toast.ok === true ? 'ok' : toast.ok === 'info' ? 'info' : 'err';
  const warna = { ok: '#15803D', err: '#B91C1C', info: '#1D4ED8' }[tipe];
  const ikon = { ok: '✓', err: '!', info: 'i' }[tipe];
  return (
    <div role="status" aria-live="polite" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 300, maxWidth: 'min(420px, calc(100vw - 32px))', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', background: warna, color: '#FFFFFF', boxShadow: '0 12px 30px rgba(0,0,0,.35)', fontSize: '13px', fontWeight: 600 }}>
      <span aria-hidden="true" style={{ width: '22px', height: '22px', flex: 'none', borderRadius: '50%', background: 'rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{ikon}</span>
      <span style={{ flex: 1, lineHeight: 1.5 }}>{toast.text}</span>
      {onClose ? (
        <button type="button" onClick={onClose} aria-label="Tutup notifikasi" style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: '0 2px' }}>✕</button>
      ) : null}
    </div>
  );
}
