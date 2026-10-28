import React from 'react';
import Link from 'next/link';
import BlogLayout from '../../components/sosmedgo/BlogLayout';
import Markdown from '../../components/sosmedgo/Markdown';
import { cariArtikel } from '../../lib/artikel';
import { ambilSemuaArtikel } from '../../lib/artikelStore';

const BASE = (process.env.APP_URL || 'https://smmsosmedgo.store').replace(/\/$/, '');

export default function ArtikelPage({ artikel }) {
  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: artikel.judul,
    description: artikel.ringkasan,
    datePublished: artikel.tanggal,
    image: artikel.gambar ? (artikel.gambar.startsWith('http') ? artikel.gambar : BASE + artikel.gambar) : BASE + '/icon.png',
    author: { '@type': 'Organization', name: 'SosmedGo' },
    publisher: { '@type': 'Organization', name: 'SosmedGo', logo: { '@type': 'ImageObject', url: BASE + '/icon.png' } },
    mainEntityOfPage: BASE + '/blog/' + artikel.slug
  };
  return (
    <BlogLayout judul={artikel.judul} deskripsi={artikel.ringkasan} path={'/blog/' + artikel.slug} gambar={artikel.gambar} ldJson={ldJson}>
      <Link href="/blog" style={{ color: '#A1A3AB', textDecoration: 'none', fontSize: '14px' }}>← Semua artikel</Link>
      <div style={{ marginTop: '28px', fontSize: '13px', color: '#6B6E78' }}>{artikel.tanggal}</div>
      <h1 style={{ margin: '10px 0 28px', fontSize: 'clamp(30px,4.5vw,46px)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.15 }}>{artikel.judul}</h1>
      {artikel.gambar ? <img src={artikel.gambar} alt={artikel.judul} style={{ display: 'block', width: '100%', borderRadius: '18px', border: '1px solid #1A1A1F', marginBottom: '24px' }} /> : null}
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
