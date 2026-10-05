import React from 'react';

/* Pengganti window.confirm. Dialog bawaan browser menampilkan "localhost:3000 menyatakan", jadi dibuat sendiri. */
export default function KotakKonfirmasi({ pesan, onJawab }) {
  return (
    <div onClick={() => onJawab(false)} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(5,5,7,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div role="dialog" aria-modal="true" aria-label="Konfirmasi" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '420px', background: '#121216', border: '1px solid #26262E', borderRadius: '16px', padding: '22px', color: '#F4F4F5', boxShadow: '0 24px 60px rgba(0,0,0,.5)', boxSizing: 'border-box', fontFamily: 'inherit' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>Konfirmasi</div>
        <div style={{ fontSize: '14px', color: '#A1A3AB', lineHeight: 1.6 }}>{pesan}</div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button type="button" onClick={() => onJawab(false)} style={{ background: '#17171B', border: '1px solid #26262E', color: '#F4F4F5', borderRadius: '10px', padding: '10px 16px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Batal</button>
          <button type="button" onClick={() => onJawab(true)} autoFocus style={{ background: '#E11D3A', border: 'none', color: '#FFFFFF', borderRadius: '10px', padding: '10px 16px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Oke</button>
        </div>
      </div>
    </div>
  );
}
