import React from 'react';
import Link from 'next/link';
import BlogLayout from '../../components/sosmedgo/BlogLayout';
import Markdown from '../../components/sosmedgo/Markdown';
import { cariArtikel } from '../../lib/artikel';
import { ambilSemuaArtikel } from '../../lib/artikelStore';

export default function ArtikelPage({ artikel }) {
  return (
    <BlogLayout judul={artikel.judul} deskripsi={artikel.ringkasan}>
      <Link href="/blog" style={{ color: '#A1A3AB', textDecoration: 'none', fontSize: '14px' }}>← Semua artikel</Link>
      <div style={{ marginTop: '28px', fontSize: '13px', color: '#6B6E78' }}>{artikel.tanggal}</div>
      <h1 style={{ margin: '10px 0 28px', fontSize: 'clamp(30px,4.5vw,46px)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.15 }}>{artikel.judul}</h1>
      {artikel.gambar ? <img src={artikel.gambar} alt="" style={{ display: 'block', width: '100%', borderRadius: '18px', border: '1px solid #1A1A1F', marginBottom: '24px' }} /> : null}
      <div style={{ background: '#0E0E11', border: '1px solid #1A1A1F', borderRadius: '18px', padding: '28px', fontSize: '16px', lineHeight: 1.75, color: '#D4D4D8' }}>
        <Markdown teks={artikel.isi} />
      </div>
    </BlogLayout>
  );
}

export async function getServerSideProps({ params }) {
  const artikel = cariArtikel(await ambilSemuaArtikel(), params.slug);
  if (!artikel || artikel.terbit === false) return { notFound: true };
  return { props: { artikel } };
}
