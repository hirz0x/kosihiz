import React from 'react';

/* Notifikasi singkat di pojok kanan bawah. Dipakai bersama oleh dashboard user dan admin.
   toast = { ok: true | false | 'info', text, kunci? }. Penutupan otomatis diatur pemanggil.
   aria-live "assertive" dan animasi muncul supaya lebih terasa, karena sebelumnya sering tidak disadari user. */
export default function Toast({ toast, onClose }) {
  if (!toast) return null;
  const tipe = toast.ok === true ? 'ok' : toast.ok === 'info' ? 'info' : 'err';
  const warna = { ok: '#15803D', err: '#B91C1C', info: '#1D4ED8' }[tipe];
  const ikon = { ok: '✓', err: '!', info: 'i' }[tipe];
  return (
    <div
      key={toast.kunci || toast.text + tipe}
      role="status"
      aria-live="assertive"
      style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 300, maxWidth: 'min(420px, calc(100vw - 32px))', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', background: warna, color: '#FFFFFF', boxShadow: '0 16px 40px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.12)', fontSize: '13px', fontWeight: 600, animation: 'sgToastMasuk .35s cubic-bezier(.34,1.56,.64,1)' }}
    >
      <style>{'@keyframes sgToastMasuk{0%{transform:translateY(18px) scale(.92);opacity:0}100%{transform:translateY(0) scale(1);opacity:1}}'}</style>
      <span aria-hidden="true" style={{ width: '24px', height: '24px', flex: 'none', borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>{ikon}</span>
      <span style={{ flex: 1, lineHeight: 1.5 }}>{toast.text}</span>
      {onClose ? (
        <button type="button" onClick={onClose} aria-label="Tutup notifikasi" style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: '0 2px' }}>✕</button>
      ) : null}
    </div>
  );
}
