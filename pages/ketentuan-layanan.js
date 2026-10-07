import React from 'react';
import BlogLayout from '../components/sosmedgo/BlogLayout';
import Markdown from '../components/sosmedgo/Markdown';

const ISI = `
Terakhir diperbarui: 2026.

Ketentuan Layanan ini mengatur penggunaan kamu atas platform SosmedGo (panel SMM). Dengan membuat akun atau menggunakan layanan kami, kamu dianggap menyetujui ketentuan di bawah ini.

## 1. Tentang Layanan

SosmedGo menyediakan layanan social media marketing (SMM) berupa penambahan followers, likes, views, dan interaksi sosial lain untuk berbagai platform, yang diproses melalui provider pihak ketiga. Hasil, kecepatan, dan kualitas layanan mengikuti kondisi provider dan dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu.

## 2. Akun Pengguna

- Kamu wajib mendaftar menggunakan data yang benar dan menjaga kerahasiaan password akun kamu.
- Kamu bertanggung jawab penuh atas semua aktivitas yang terjadi melalui akun kamu, termasuk pemesanan dan transaksi saldo.
- Kami berhak menonaktifkan atau menangguhkan akun yang terindikasi melanggar ketentuan ini, melakukan kecurangan, atau disalahgunakan untuk aktivitas ilegal.

## 3. Pemesanan dan Saldo

- Pemesanan diproses menggunakan saldo akun kamu yang diisi melalui metode pembayaran yang tersedia di platform.
- Pastikan link dan jumlah pesanan sudah benar sebelum mengirim pesanan — kesalahan input dari pengguna (link privat, link salah, jumlah tidak sesuai) bukan tanggung jawab kami.
- Status pesanan (pending, in progress, completed, partial, canceled) mengikuti data dari provider dan dapat berubah tanpa pemberitahuan real-time yang sempurna.

## 4. Kebijakan Refund dan Garansi

- Garansi/refill hanya berlaku untuk layanan yang mencantumkan masa garansi, dan hanya untuk penurunan jumlah (drop), bukan untuk hasil yang sudah sesuai pesanan.
- Pengajuan refund akan ditinjau oleh tim kami; keputusan akhir ada di pihak SosmedGo berdasarkan data dari provider.
- Saldo yang sudah digunakan untuk pesanan yang berjalan atau selesai tidak dapat ditarik kembali, kecuali pesanan dibatalkan sebelum diproses atau refund disetujui.

## 5. Larangan Penggunaan

Kamu dilarang menggunakan SosmedGo untuk:

- Aktivitas ilegal, penipuan, atau pelanggaran hak pihak lain.
- Menargetkan akun atau konten yang melanggar ketentuan platform sosial media terkait (termasuk konten yang melanggar hukum).
- Mencoba mengeksploitasi, meretas, atau mengganggu sistem SosmedGo maupun provider.
- Menyalahgunakan program referral/afiliasi dengan akun palsu atau transaksi fiktif.

Pelanggaran atas larangan ini dapat berujung pada penangguhan akun tanpa pengembalian saldo.

## 6. Perubahan Harga dan Layanan

Harga layanan dapat berubah sewaktu-waktu mengikuti harga dari provider dan kebijakan markup kami. Kami juga dapat menambah, mengubah, atau menghentikan layanan tertentu kapan pun diperlukan.

## 7. Batasan Tanggung Jawab

SosmedGo berusaha menyediakan layanan dengan sebaik mungkin, namun tidak menjamin hasil 100% bebas dari kendala teknis, keterlambatan, atau perubahan kebijakan platform sosial media pihak ketiga. Kami tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan layanan ini.

## 8. Privasi Data

Data pribadi kamu (email, username, riwayat transaksi) digunakan hanya untuk keperluan operasional layanan dan tidak dibagikan ke pihak ketiga tanpa izin, kecuali diwajibkan oleh hukum yang berlaku.

## 9. Perubahan Ketentuan

Kami dapat memperbarui Ketentuan Layanan ini sewaktu-waktu. Perubahan akan berlaku efektif sejak dipublikasikan di halaman ini. Penggunaan layanan setelah perubahan berarti kamu menyetujui ketentuan yang baru.

## 10. Kontak

Ada pertanyaan soal ketentuan ini? Hubungi kami lewat halaman tiket bantuan di dashboard akun kamu.
`.trim();

export default function KetentuanLayanan() {
  return (
    <BlogLayout judul="Ketentuan Layanan" deskripsi="Ketentuan penggunaan layanan SosmedGo — akun, pemesanan, refund, dan tanggung jawab pengguna.">
      <h1 style={{ margin: '0 0 28px', fontSize: 'clamp(30px,4.5vw,46px)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.15 }}>Ketentuan Layanan</h1>
      <div style={{ background: '#0E0E11', border: '1px solid #1A1A1F', borderRadius: '18px', padding: '28px', fontSize: '16px', lineHeight: 1.75, color: '#D4D4D8' }}>
        <Markdown teks={ISI} />
      </div>
    </BlogLayout>
  );
}
