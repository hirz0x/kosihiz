import React from 'react';
import Link from 'next/link';
import BlogLayout from '../../components/sosmedgo/BlogLayout';
import { ambilSemuaArtikel } from '../../lib/artikelStore';

export default function Blog({ artikel }) {
  const daftar = artikel.filter((a) => a.terbit !== false).sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));

  return (
    <BlogLayout judul="Blog" deskripsi="Artikel seputar social media marketing dan tips reseller dari SosmedGo.">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(32px,4.5vw,46px)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.1 }}>
          Blog <span style={{ color: '#E11D3A' }}>SosmedGo</span>
        </h1>
        <p style={{ margin: 0, color: '#A1A3AB', fontSize: '16px' }}>Tips dan panduan seputar social media marketing.</p>
      </div>

      {daftar.length === 0 ? (
        <div style={{ background: '#0E0E11', border: '1px solid #1A1A1F', borderRadius: '18px', padding: '36px 24px', textAlign: 'center', color: '#A1A3AB' }}>
          Belum ada artikel. Artikel baru akan muncul di sini.
        </div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {daftar.map((a) => (
              <Link key={a.slug} href={'/blog/' + a.slug} style={{ display: 'flex', flexDirection: 'column', background: '#0E0E11', border: '1px solid #1A1A1F', borderRadius: '18px', overflow: 'hidden', color: '#F4F4F5', textDecoration: 'none' }}>
                <div style={{ aspectRatio: '16 / 10', background: 'linear-gradient(160deg,#2A0E14,#0A0A0C)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {a.gambar ? (
                    <img src={a.gambar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <img src="/icon.png" alt="" width="64" height="64" style={{ borderRadius: '16px' }} />
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '18px 18px 20px', flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.35 }}>{a.judul}</div>
                  <div style={{ fontSize: '12px', color: '#6B6E78' }}>{a.tanggal}</div>
                  {a.ringkasan ? <div style={{ fontSize: '14px', color: '#A1A3AB', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.ringkasan}</div> : null}
                  <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                    <span style={{ display: 'block', textAlign: 'center', background: '#E11D3A', color: '#FFFFFF', borderRadius: '999px', padding: '10px 14px', fontSize: '14px', fontWeight: 600 }}>Baca artikel</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </BlogLayout>
  );
}

export async function getServerSideProps() {
  return { props: { artikel: await ambilSemuaArtikel() } };
}
