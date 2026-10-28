import React, { useState } from 'react';
import Link from 'next/link';
import BlogLayout from '../components/sosmedgo/BlogLayout';

/* Pusat bantuan publik. Semua isi di sini merujuk fitur yang BENAR-BENAR ada di aplikasi
 * (lihat lib/pesanan.js, DashboardPage.jsx, DashboardAddFunds.jsx, ketentuan-layanan.js) — bukan
 * klaim pemasaran. Sengaja TIDAK mencantumkan kanal kontak selain sistem tiket dashboard, karena
 * itu satu-satunya jalur bantuan yang benar-benar terpasang di aplikasi ini saat ini. */

const kotak = { background: '#0E0E11', border: '1px solid #1A1A1F', borderRadius: '18px' };

const TOC = [
  ['order', 'Cara melakukan order'],
  ['status', 'Status pesanan'],
  ['deposit', 'Deposit & status pembayaran'],
  ['saldo', 'Saldo & riwayat transaksi'],
  ['refill', 'Refill, garansi & batasan layanan'],
  ['masalah', 'Pesanan gagal, pending, atau tidak sesuai'],
  ['faq', 'Pertanyaan umum'],
  ['kontak', 'Hubungi bantuan']
];

const FAQ = [
  {
    q: 'Kenapa status pesanan saya masih "Menunggu"?',
    a: 'Pesanan baru masuk dengan status Menunggu sebelum provider mulai mengerjakannya, lalu berubah sendiri jadi Diproses dan akhirnya Selesai. Perubahan status dicek otomatis secara berkala — tidak perlu melakukan apa pun, cukup pantau dari tab Pesanan. Kalau sudah lama sekali tanpa perubahan, hubungi bantuan lewat tiket kategori Pesanan.'
  },
  {
    q: 'Bisakah saya membatalkan pesanan?',
    a: 'Pesanan hanya bisa dibatalkan selagi statusnya masih Menunggu. Begitu provider mulai memproses (status Diproses), pesanan tidak bisa dibatalkan lagi dari dashboard.'
  },
  {
    q: 'Saldo saya berkurang tapi pesanan tertulis gagal, bagaimana?',
    a: 'Pemotongan saldo dan pembuatan pesanan ke provider adalah satu rangkaian — kalau provider menolak permintaannya, saldo yang sudah terpotong dikembalikan otomatis ke akun kamu di alur yang sama, tanpa perlu mengajukan apa pun. Kalau pesan di layar menyebut saldo belum berhasil dikembalikan otomatis, itu artinya butuh ditindaklanjuti manual — hubungi bantuan lewat tiket secepatnya dengan menyertakan ID pesanan.'
  },
  {
    q: 'Kenapa saya klik tombol kirim sekali tapi takut terkirim dua kali saat koneksi lambat?',
    a: 'Sistem mencegah ini dari dua sisi: tombol kirim dinonaktifkan sementara selama permintaan diproses, dan di sisi server permintaan yang identik (misalnya karena koneksi putus lalu kamu klik ulang) dikenali sebagai percobaan yang sama — pesanan dan pemotongan saldo tidak akan terjadi dua kali untuk percobaan yang sama.'
  },
  {
    q: 'Berapa lama proses deposit lewat QRIS?',
    a: 'Normalnya saldo masuk otomatis begitu pembayaran terverifikasi, biasanya dalam hitungan detik sampai beberapa menit. Kalau sudah membayar tapi status di halaman Isi Saldo belum berubah, gunakan tombol "Cek pembayaran" untuk memaksa pengecekan ulang sebelum menghubungi bantuan.'
  },
  {
    q: 'Apakah saldo yang sudah diisi bisa ditarik kembali?',
    a: 'Saldo yang sudah dipakai untuk pesanan yang berjalan atau selesai tidak bisa ditarik kembali. Pengecualian: pesanan yang dibatalkan sebelum diproses, atau pengajuan refund yang disetujui untuk pesanan yang dibatalkan/sebagian oleh provider.'
  },
  {
    q: 'Bagaimana cara menghubungi tim bantuan?',
    a: 'Satu-satunya jalur resmi saat ini adalah sistem tiket di dalam dashboard (perlu login) — lihat bagian "Hubungi bantuan" di bawah untuk kategorinya.'
  }
];

export default function Bantuan() {
  const [open, setOpen] = useState({});
  const toggle = (i) => setOpen((o) => ({ ...o, [i]: !o[i] }));

  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };

  return (
    <BlogLayout
      judul="Pusat Bantuan"
      deskripsi="Panduan order, status pesanan, deposit, refund, dan cara menghubungi bantuan SosmedGo."
      lebar={900}
      path="/bantuan"
      ldJson={ldJson}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width:640px){
          .bt-toc{grid-template-columns:1fr !important}
        }
      ` }} />
      <div style={{ fontSize: '12px', color: '#6B6E78', marginBottom: '14px' }}>
        <Link href="/" style={{ color: '#A1A3AB', textDecoration: 'none' }}>Beranda</Link> <span style={{ color: '#E11D3A' }}>›</span> <span style={{ color: '#FF5A75' }}>Bantuan</span>
      </div>
      <h1 style={{ margin: '0 0 10px', fontSize: 'clamp(30px,4.5vw,46px)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.15 }}>Pusat Bantuan</h1>
      <p style={{ margin: '0 0 28px', color: '#A1A3AB', fontSize: '15px', lineHeight: 1.7, maxWidth: '640px' }}>
        Panduan singkat soal order, status pesanan, deposit, dan saldo di SosmedGo. Kalau jawabannya belum ada di sini, bagian{' '}
        <a href="#kontak" style={{ color: '#FF5A75' }}>Hubungi bantuan</a> di bawah menunjukkan cara menghubungi tim kami.
      </p>

      <nav aria-label="Daftar isi" className="bt-toc" style={{ ...kotak, padding: '18px 20px', marginBottom: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px' }}>
        {TOC.map(([id, label]) => (
          <a key={id} href={'#' + id} style={{ color: '#D4D4D8', textDecoration: 'none', fontSize: '13px', padding: '6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#E11D3A' }}>→</span> {label}
          </a>
        ))}
      </nav>

      <section id="order" style={{ ...kotak, padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 14px', fontSize: '20px', fontWeight: 700 }}>Cara melakukan order</h2>
        <ol style={{ margin: 0, padding: '0 0 0 20px', color: '#D4D4D8', fontSize: '14px', lineHeight: 1.9 }}>
          <li>Daftar akun atau masuk, lalu isi saldo lewat halaman <strong>Isi Saldo</strong> (lihat bagian Deposit di bawah).</li>
          <li>Buka <strong>Buat Pesanan</strong>, pilih platform dan layanan yang diinginkan.</li>
          <li>Masukkan link profil/postingan tujuan — harus link lengkap (diawali <code>http://</code> atau <code>https://</code>), bukan hanya username.</li>
          <li>Isi jumlah sesuai batas Min–Maks layanan tersebut (tertera di halaman Layanan dan di detail pesanan sebelum dikirim).</li>
          <li>Periksa subtotal, lalu kirim pesanan. Saldo terpotong otomatis sejumlah subtotal tersebut.</li>
        </ol>
        <p style={{ margin: '14px 0 0', color: '#8B8D96', fontSize: '13px', lineHeight: 1.8 }}>
          Tombol kirim dinonaktifkan sementara selagi pesanan diproses untuk mencegah terkirim dua kali akibat klik berulang, dan permintaan yang sama persis (misalnya karena koneksi putus lalu dicoba ulang) tidak akan membuat pesanan kedua atau memotong saldo dua kali.
        </p>
      </section>

      <section id="status" style={{ ...kotak, padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 14px', fontSize: '20px', fontWeight: 700 }}>Status pesanan</h2>
        <div style={{ display: 'grid', gap: '10px' }}>
          {[
            ['Menunggu', 'Pesanan baru dibuat, belum mulai dikerjakan provider. Masih bisa dibatalkan dari dashboard pada status ini.'],
            ['Diproses', 'Provider sedang mengerjakan pesanan. Tidak bisa dibatalkan lagi pada status ini.'],
            ['Sebagian', 'Provider hanya memenuhi sebagian dari jumlah yang dipesan. Bisa diajukan refund untuk selisihnya (lihat bagian Pengajuan refund).'],
            ['Selesai', 'Pesanan tuntas sesuai jumlah yang dipesan. Kalau layanannya mencantumkan garansi refill, pengajuan refill tersedia di status ini.'],
            ['Dibatalkan', 'Pesanan dibatalkan (oleh kamu selagi Menunggu, atau oleh provider). Bisa diajukan refund kalau sudah terpotong saldo.']
          ].map(([t, d]) => (
            <div key={t} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ flex: 'none', background: '#E11D3A', color: '#FFFFFF', borderRadius: '999px', padding: '4px 12px', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', marginTop: '2px' }}>{t}</span>
              <span style={{ color: '#A1A3AB', fontSize: '14px', lineHeight: 1.7 }}>{d}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="deposit" style={{ ...kotak, padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 14px', fontSize: '20px', fontWeight: 700 }}>Deposit & status pembayaran</h2>
        <p style={{ margin: '0 0 10px', color: '#D4D4D8', fontSize: '14px', lineHeight: 1.8 }}>
          Isi saldo lewat halaman <strong>Isi Saldo</strong> di dashboard, pembayaran lewat QRIS dengan nominal minimal Rp 10.000. Status permintaan deposit:
        </p>
        <div style={{ display: 'grid', gap: '10px', marginBottom: '14px' }}>
          {[
            ['Menunggu', 'Permintaan dibuat, menunggu pembayaran atau verifikasi.'],
            ['Berhasil', 'Pembayaran terverifikasi, saldo sudah masuk ke akun.'],
            ['Gagal', 'Pembayaran tidak selesai (misalnya kode QRIS kedaluwarsa sebelum dibayar).']
          ].map(([t, d]) => (
            <div key={t} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ flex: 'none', background: '#17171B', border: '1px solid #26262E', color: '#F4F4F5', borderRadius: '999px', padding: '4px 12px', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', marginTop: '2px' }}>{t}</span>
              <span style={{ color: '#A1A3AB', fontSize: '14px', lineHeight: 1.7 }}>{d}</span>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, color: '#8B8D96', fontSize: '13px', lineHeight: 1.8 }}>
          Status biasanya berubah otomatis begitu pembayaran terverifikasi. Kalau sudah membayar tapi status belum berubah, gunakan tombol <strong>"Cek pembayaran"</strong> di halaman Isi Saldo untuk memaksa pengecekan ulang sebelum menghubungi bantuan.
        </p>
      </section>

      <section id="saldo" style={{ ...kotak, padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 14px', fontSize: '20px', fontWeight: 700 }}>Saldo & riwayat transaksi</h2>
        <p style={{ margin: 0, color: '#D4D4D8', fontSize: '14px', lineHeight: 1.8 }}>
          Saldo berjalan ditampilkan di bagian atas dashboard dan terpotong otomatis setiap kali membuat pesanan. Riwayat deposit dan riwayat pesanan masing-masing bisa dibuka dari dashboard untuk melihat detail setiap transaksi — nominal, waktu, dan statusnya. Saldo yang sudah dipakai untuk pesanan yang berjalan atau selesai tidak bisa ditarik kembali, kecuali pesanan dibatalkan sebelum diproses atau pengajuan refund disetujui.
        </p>
      </section>

      <section id="refill" style={{ ...kotak, padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 14px', fontSize: '20px', fontWeight: 700 }}>Refill, garansi & batasan layanan</h2>
        <p style={{ margin: '0 0 10px', color: '#D4D4D8', fontSize: '14px', lineHeight: 1.8 }}>
          Garansi refill hanya berlaku untuk layanan yang memang mencantumkan garansi tersebut (tertera di halaman Layanan dan detail pesanan), dan hanya untuk penurunan jumlah (drop) setelah pesanan selesai — bukan untuk hasil yang sejak awal sudah sesuai jumlah pesanan.
        </p>
        <p style={{ margin: 0, color: '#D4D4D8', fontSize: '14px', lineHeight: 1.8 }}>
          Setiap layanan punya batas jumlah minimum dan maksimum per pesanan serta estimasi waktu pengerjaan — semuanya tertera di halaman <Link href="/layanan" style={{ color: '#FF5A75' }}>Layanan</Link> sebelum kamu checkout, supaya tidak ada kejutan setelah pesanan dikirim.
        </p>
      </section>

      <section id="masalah" style={{ ...kotak, padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 14px', fontSize: '20px', fontWeight: 700 }}>Pesanan gagal, pending, atau tidak sesuai</h2>
        <div style={{ display: 'grid', gap: '14px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>Pesanan gagal dikirim ke provider</div>
            <div style={{ color: '#A1A3AB', fontSize: '14px', lineHeight: 1.7 }}>Saldo yang sudah terpotong dikembalikan otomatis. Pesan di layar akan menyebut secara eksplisit kalau pengembalian itu butuh ditindaklanjuti manual — kalau begitu, segera hubungi bantuan dengan menyertakan waktu kejadian.</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>Pesanan tertahan lama di status Menunggu/Diproses</div>
            <div style={{ color: '#A1A3AB', fontSize: '14px', lineHeight: 1.7 }}>Status diperbarui otomatis secara berkala mengikuti data dari provider. Kalau sudah jauh melewati estimasi waktu layanan tersebut, buka tiket kategori <strong>Pesanan</strong> dengan menyertakan ID pesanan.</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>Hasil tidak sesuai (kurang/sebagian/drop)</div>
            <div style={{ color: '#A1A3AB', fontSize: '14px', lineHeight: 1.7 }}>Untuk pesanan berstatus Dibatalkan atau Sebagian dengan saldo yang sudah terpotong, ajukan refund dari tab Pesanan di dashboard. Untuk penurunan jumlah (drop) pada layanan bergaransi refill, ajukan refill lewat tiket kategori <strong>Pesanan {'>'} Refill</strong>.</div>
          </div>
        </div>
      </section>

      <section id="faq" style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 14px', fontSize: '20px', fontWeight: 700 }}>Pertanyaan umum</h2>
        <div style={{ ...kotak, padding: '8px' }}>
          {FAQ.map((f, i) => (
            <div key={i} style={{ borderBottom: i < FAQ.length - 1 ? '1px solid #1A1A1F' : 'none' }}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={!!open[i]}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: 'transparent', border: 'none', color: '#F4F4F5', fontFamily: 'inherit', fontSize: '14px', fontWeight: 600, textAlign: 'left', padding: '16px 14px', cursor: 'pointer' }}
              >
                <span>{f.q}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9CBD1" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: 0, transform: open[i] ? 'rotate(180deg)' : 'none' }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {open[i] ? (
                <p style={{ margin: 0, padding: '0 14px 16px', fontSize: '13px', lineHeight: 1.8, color: '#A1A3AB' }}>{f.a}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section id="kontak" style={{ ...kotak, padding: '24px' }}>
        <h2 style={{ margin: '0 0 14px', fontSize: '20px', fontWeight: 700 }}>Hubungi bantuan</h2>
        <p style={{ margin: '0 0 14px', color: '#D4D4D8', fontSize: '14px', lineHeight: 1.8 }}>
          Jalur bantuan resmi SosmedGo adalah sistem tiket di dalam dashboard (perlu masuk ke akun kamu dulu). Pilih kategori yang paling sesuai supaya lebih cepat ditangani:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '10px', marginBottom: '18px' }}>
          {[
            ['Pesanan', 'Refill, batalkan, atau percepat pesanan.'],
            ['Layanan', 'Info layanan atau request layanan baru.'],
            ['Pembayaran', 'Deposit belum masuk, atau soal bonus.'],
            ['Lainnya', 'Hal lain yang tidak masuk kategori di atas.']
          ].map(([t, d]) => (
            <div key={t} style={{ background: '#17171B', border: '1px solid #26262E', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>{t}</div>
              <div style={{ color: '#8B8D96', fontSize: '12px', lineHeight: 1.6 }}>{d}</div>
            </div>
          ))}
        </div>
        <Link href="/login" style={{ display: 'inline-block', background: '#E11D3A', color: '#FFFFFF', borderRadius: '10px', padding: '12px 22px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
          Masuk untuk membuka tiket
        </Link>
      </section>
    </BlogLayout>
  );
}
