import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

/* Dibuat dari desain canvas SosmedGo. Data di halaman ini masih contoh. */
/* Avatar profil fiksi (ilustrasi, bukan foto orang nyata). */
const AVATAR_PARTS = {
  bun: [
    <path key="sh" d="M4 58 C6 44 16 40 28 40 C40 40 50 44 52 58Z" fill="#7A2E4A" />,
    <path key="hb" d="M14 30 C12 16 18 10 28 10 C38 10 44 16 42 30 L42 44 C40 50 16 50 14 44Z" fill="#2A1A14" />,
    <circle key="bun" cx="28" cy="10" r="6" fill="#2A1A14" />,
    <ellipse key="face" cx="28" cy="28" rx="10.5" ry="12" fill="#E8B896" />,
    <path key="fr" d="M17 25 C18 15 25 13 30 15 C36 16 39 21 39 26 C34 21 26 20 17 25Z" fill="#2A1A14" />,
    <circle key="e1" cx="24" cy="29" r="1.2" fill="#1A120E" />,
    <circle key="e2" cx="32" cy="29" r="1.2" fill="#1A120E" />,
    <path key="sm" d="M24 35 Q28 38 32 35" stroke="#8A3B3B" strokeWidth="1.4" strokeLinecap="round" fill="none" />,
    <circle key="ea1" cx="17.5" cy="33" r="1.4" fill="#F5C542" />,
    <circle key="ea2" cx="38.5" cy="33" r="1.4" fill="#F5C542" />
  ],
  beard: [
    <path key="sh" d="M4 58 C6 44 16 40 28 40 C40 40 50 44 52 58Z" fill="#2F4A6B" />,
    <ellipse key="face" cx="28" cy="27" rx="10" ry="11.5" fill="#B97A56" />,
    <path key="hair" d="M18 22 C18 12 24 9 29 9 C36 9 39 14 38 22 C34 17 24 16 18 22Z" fill="#1A1410" />,
    <path key="beard" d="M18 30 C18 42 24 44 28 44 C32 44 38 42 38 30 C36 36 32 38 28 38 C24 38 20 36 18 30Z" fill="#1A1410" />,
    <path key="br" d="M21 21 Q24 19.5 26 21 M30 21 Q32 19.5 35 21" stroke="#1A1410" strokeWidth="1.4" strokeLinecap="round" fill="none" />,
    <circle key="e1" cx="24" cy="25" r="1.2" fill="#1A120E" />,
    <circle key="e2" cx="32" cy="25" r="1.2" fill="#1A120E" />
  ],
  curly: [
    <path key="sh" d="M4 58 C6 44 16 40 28 40 C40 40 50 44 52 58Z" fill="#2F6B5A" />,
    <g key="hair" fill="#1C1410">
      <circle cx="15" cy="20" r="5" />
      <circle cx="21" cy="12" r="5.5" />
      <circle cx="30" cy="10" r="5.5" />
      <circle cx="39" cy="14" r="5" />
      <circle cx="42" cy="22" r="4" />
      <circle cx="14" cy="28" r="4" />
    </g>,
    <ellipse key="face" cx="28" cy="27" rx="10.5" ry="11.5" fill="#D9A07A" />,
    <g key="gl" fill="none" stroke="#111827" strokeWidth="1.4">
      <circle cx="24" cy="26" r="3.6" />
      <circle cx="32" cy="26" r="3.6" />
    </g>,
    <circle key="e1" cx="24" cy="26" r="1" fill="#111827" />,
    <circle key="e2" cx="32" cy="26" r="1" fill="#111827" />,
    <path key="sm" d="M24 33 Q28 36 32 33" stroke="#7A3B2A" strokeWidth="1.4" strokeLinecap="round" fill="none" />
  ],
  cap: [
    <path key="sh" d="M4 58 C6 44 16 40 28 40 C40 40 50 44 52 58Z" fill="#B5452C" />,
    <ellipse key="face" cx="28" cy="29" rx="10" ry="11" fill="#C98B63" />,
    <path key="cap" d="M16 22 C16 12 22 8 28 8 C34 8 40 12 40 22Z" fill="#E11D3A" />,
    <rect key="brim" x="13" y="20" width="30" height="4" rx="2" fill="#B81530" />,
    <circle key="e1" cx="24" cy="30" r="1.2" fill="#1A120E" />,
    <circle key="e2" cx="32" cy="30" r="1.2" fill="#1A120E" />,
    <path key="sm" d="M24 36 Q28 39 32 36" stroke="#5B2A1A" strokeWidth="1.4" strokeLinecap="round" fill="none" />
  ],
  bob: [
    <path key="sh" d="M4 58 C6 44 16 40 28 40 C40 40 50 44 52 58Z" fill="#5B3A6E" />,
    <path key="hb" d="M14 30 C12 16 18 10 28 10 C38 10 44 16 42 30 L42 38 C36 40 20 40 14 38Z" fill="#4A2C1C" />,
    <ellipse key="face" cx="28" cy="28" rx="10" ry="11.5" fill="#F0C9A8" />,
    <path key="fr" d="M17 26 C18 16 24 14 28 15 C34 15 39 19 39 26 L36 22 C30 20 24 21 17 26Z" fill="#4A2C1C" />,
    <circle key="e1" cx="24" cy="28" r="1.2" fill="#1A120E" />,
    <circle key="e2" cx="32" cy="28" r="1.2" fill="#1A120E" />,
    <path key="sm" d="M24 34 Q28 37 32 34" stroke="#8A3B3B" strokeWidth="1.4" strokeLinecap="round" fill="none" />
  ]
};

function FictionalAvatar({ kind, bg, size }) {
  const clipId = "av-clip-" + kind;
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <clipPath id={clipId}><circle cx="28" cy="28" r="28" /></clipPath>
      </defs>
      <g clipPath={"url(#" + clipId + ")"}>
        <rect width="56" height="56" fill={bg} />
        {AVATAR_PARTS[kind]}
      </g>
    </svg>
  );
}

class LandingPage extends React.Component {
  constructor(p) { super(p); this.state = { open: -1, stat: null, layanan: null, menu: false }; }
  componentWillUnmount() {
    if (this._io) this._io.disconnect();
    if (this._klik) document.removeEventListener('click', this._klik);
    document.documentElement.classList.remove('js-fade');
  }
  componentDidMount() {
    var self = this;
    /* Halaman selalu dibuka dari atas: posisi scroll lama dan hash menu (#layanan) dihapus. */
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    if (window.location.hash) window.history.replaceState(null, '', window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
    /* Efek fade-in: bagian halaman muncul saat masuk ke layar. Tanpa JS, semuanya tetap terlihat. */
    document.documentElement.classList.add('js-fade');
    var bagian = document.querySelectorAll('section');
    if (!('IntersectionObserver' in window)) {
      bagian.forEach(function (el) { el.classList.add('in'); });
    } else {
      this._io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); self._io.unobserve(en.target); }
        });
      }, { threshold: 0.01, rootMargin: '0px 0px -5% 0px' });
      bagian.forEach(function (el) { self._io.observe(el); });
    }
    /* Klik menu ke bagian (#layanan, #faq) langsung menampilkan bagian tujuannya. */
    this._klik = function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var tujuan = document.querySelector(a.getAttribute('href'));
      if (tujuan) tujuan.classList.add('in');
    };
    document.addEventListener('click', this._klik);
    fetch('/api/stats').then(function (r) { return r.ok ? r.json() : null; }).then(function (d) { if (d) self.setState({ stat: d }); }).catch(function () {});
    fetch('/api/services').then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      var list = d && Array.isArray(d.services) ? d.services : [];
      var s = list.filter(function (x) { return x.aktif && x.dasar > 0; })[0];
      if (!s) return;
      var harga = Math.round((s.dasar * (1 + (s.markup || 0) / 100)) / 100) * 100;
      self.setState({ layanan: { id: s.id, nama: s.nama, hargaTxt: harga.toLocaleString('id-ID'), waktu: s.waktuRata ? Math.round(s.waktuRata) : null } });
    }).catch(function () {});
  }
  renderVals() {
    var self = this;
    var I = {
      tt: 'M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5h.5V7.8a7 7 0 1 0 6.5 6.9V9.4A7 7 0 0 0 21 10.6V7a4 4 0 0 1-4-4z',
      yt: 'M2 7a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3zM10 8.5v7l6-3.5z',
      fb: 'M14 22v-8h3l.5-4H14V8c0-1 .3-2 2-2h2V2.3C17.4 2.2 16.3 2 15 2c-3 0-5 1.8-5 5v3H7v4h3v8z',
      ig: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
      x: 'M3 3h5l4 5.5L16.5 3H21l-6.6 7.6L21.5 21h-5l-4.4-6L7 21H2.5l7.1-8.1z'
    };
    var logoBase = [
      { name: 'TikTok', icon: I.tt }, { name: 'Twitter / X', icon: I.x }, { name: 'YouTube', icon: I.yt },
      { name: 'Facebook', icon: I.fb }, { name: 'Instagram', icon: I.ig }
    ];
    var pillBase = [
      { t: 'YouTube Subscribers', tag: 'Instan', icon: I.yt }, { t: 'Facebook Likes', tag: 'Instan', icon: I.fb },
      { t: 'Instagram Followers', tag: 'Refill', icon: I.ig }, { t: 'Twitter Followers', tag: 'Instan', icon: I.x },
      { t: 'TikTok Views', tag: 'Cepat', icon: I.tt }
    ];
    var bgs = ['#F4C7A1', '#E8C3A4', '#C9B79C', '#F4D9DE', '#B07752'];
    var testi = [];
    var testiNames = ['Nadia S.', 'Raka P.', 'Mira A.', 'Doni K.', 'Sinta W.', 'Yoga B.', 'Lia R.', 'Fajar H.', 'Ayu N.', 'Bima T.'];
    var testiKinds = ['bun', 'beard', 'bob', 'curly', 'cap'];
    var testiBgs = ['#F4B6C2', '#9CC4E8', '#A8E0C0', '#C9B6F2', '#FBD38D'];
    for (var i = 0; i < 10; i++) testi.push({ name: testiNames[i], kind: testiKinds[i % 5], bg: testiBgs[i % 5] });
    var faqData = [
      { q: 'Apa itu panel SMM?', a: 'Panel SMM adalah toko online tempat kamu membeli layanan sosial media seperti followers, likes, views, dan komentar dengan harga murah dan proses otomatis.' },
      { q: 'Layanan SMM apa saja yang bisa saya beli?', a: 'Instagram, TikTok, YouTube, Facebook, Telegram, Twitter/X, Spotify, dan banyak lagi. Daftar lengkap ada di halaman Layanan.' },
      { q: 'Apakah aman membeli layanan di SosmedGo?', a: 'Aman. Kami tidak pernah meminta password akun sosial media kamu — cukup username atau link postingan.' },
      { q: 'Apakah ada layanan support?', a: 'Ada. Tim support kami aktif 24/7 lewat tiket dan WhatsApp.' },
      { q: 'Bagaimana cara mulai memesan?', a: 'Daftar akun gratis, isi saldo, pilih layanan, masukkan link target dan jumlah, lalu kirim pesanan.' },
      { q: 'Kenapa harus pilih SosmedGo?', a: 'Harga termurah, proses otomatis 24 jam, garansi refill di layanan pilihan, dan API siap pakai untuk reseller.' }
    ];
    return {
      benefits: [
        { t: 'Layanan Berkualitas', icon: 'M4 4h16v16H4zM9 12l2 2 4-4' },
        { t: 'Harga Termurah', icon: 'M3 6h18v12H3zM3 10h18' },
        { t: 'Proses Cepat', icon: 'M13 2L4 14h7l-1 8 9-12h-7z' },
        { t: 'Support 24/7', icon: 'M3 12h4l3-8 4 16 3-8h4' }
      ],
      logos: logoBase.concat(logoBase),
      pills: pillBase.concat(pillBase),
      succ: [
        { t: 'Murah & Berkualitas', d: 'Layanan & tools kami terus diperbarui', icon: 'M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01' },
        { t: 'Tim Support 24/7', d: 'Kami siap bantu, kamu tidak sendirian', icon: 'M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H4zM17 14h3v6h-3zM20 20a4 4 0 0 1-4 3h-2' },
        { t: this.state.stat && this.state.stat.pesanan > 0 ? this.state.stat.pesanan.toLocaleString('id-ID') + '+ Pesanan' : 'Diproses otomatis', d: this.state.stat && this.state.stat.pesanan > 0 ? 'Sudah memproses ' + this.state.stat.pesanan.toLocaleString('id-ID') + ' pesanan' : 'Pesanan diproses otomatis oleh sistem', icon: 'M6 7h12l1 13H5zM9 7a3 3 0 0 1 6 0M9 13l2 2 4-4' }
      ],
      igN: [ { u: '@rina.putri', kind: 'bun', bg: '#F4B6C2' }, { u: '@budi_s', kind: 'beard', bg: '#9CC4E8' }, { u: '@dewi.ayu', kind: 'bob', bg: '#A8E0C0' } ],
      stats: [
        { l: 'Saldo Akun', v: 'Rp —', a: 'Isi Saldo', bg: '#2A0E14', fg: '#FF5A75' },
        { l: 'Pesanan Saya', v: '—', a: 'Lihat Pesanan', bg: 'rgba(34,197,94,.12)', fg: '#22C55E' },
        { l: 'Total Belanja', v: 'Rp —', a: 'Isi Saldo', bg: '#2A0E14', fg: '#FF5A75' },
        { l: 'Pesanan Selesai', v: '—', a: 'Lihat Pesanan', bg: '#1E1E23', fg: '#C9CBD1' }
      ],
      features: [
        { t: 'Pesanan Massal', d: 'Pilih layanan yang kamu mau, atur untuk dikirim sekaligus, dan mulai jualan. Cocok untuk volume pesanan besar.', icon: 'M4 6h16M4 12h16M4 18h10' },
        { t: 'Sistem Dripfeed', d: 'Kirim pesanan yang sama berkali-kali secara bertahap supaya pertumbuhan terlihat natural, lengkap dengan refill otomatis.', icon: 'M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z' },
        { t: 'Langganan Mudah', d: 'Atur jumlah likes yang otomatis masuk setiap kali kamu posting. Kamu tentukan kapan mulai dan kapan berhenti.', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0' },
        { t: 'Pembayaran Otomatis', d: 'Tidak perlu konfirmasi manual setiap deposit. Saldo masuk otomatis begitu pembayaran terverifikasi.', icon: 'M6 3h12l3 6-9 12L3 9zM3 9h18' },
        { t: 'Layanan Bulanan', d: 'Atur semua layanan yang ingin kamu terima selama sebulan, biarkan SosmedGo yang bekerja.', icon: 'M4 5h16v16H4zM4 10h16M9 3v4M15 3v4' },
        { t: 'API Siap Pakai', d: 'API terintegrasi penuh agar pelangganmu bisa memesan layanan kami lewat panel milikmu sendiri.', icon: 'M7 3h7l5 5v13H7zM10 13l-2 2 2 2M14 13l2 2-2 2' }
      ],
      testi: testi,
      bad: ['Pengiriman tidak jelas dan lambat', 'Layanan sering drop tanpa refill', 'Support susah dihubungi', 'Harga mahal untuk reseller', 'Deposit harus konfirmasi manual', 'Tidak ada API', 'Layanan jarang diperbarui', 'Status pesanan tidak real-time'],
      good: ['Proses otomatis dalam hitungan menit', 'Garansi refill di layanan pilihan', 'Support 24/7 via tiket & WhatsApp', 'Harga termurah, cocok dijual ulang', 'Deposit otomatis', 'API siap pakai untuk reseller', 'Layanan diperbarui rutin', 'Status pesanan real-time'],
      faqs: faqData.map(function (f, i) {
        var open = self.state.open === i;
        return { q: f.q, a: f.a, open: open, rot: open ? 'rotate(180deg)' : 'none', bc: open ? '#5A1A26' : '#1F1F25',
          toggle: function () { self.setState({ open: open ? -1 : i }); } };
      })
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <>
        <Head>
          <title>SosmedGo — Panel SMM Termurah</title>
          <link rel="preconnect" href="https://api.fontshare.com" />
          <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
        </Head>
        <style jsx global>{`
html{color-scheme:dark}
.js-fade section{opacity:0;transform:translateY(18px);transition:opacity .7s ease-out,transform .7s ease-out}
.js-fade section.in{opacity:1;transform:none}
@media (prefers-reduced-motion: reduce){.js-fade section{opacity:1;transform:none;transition:none}}
body{margin:0;background:#0A0A0C;overflow-x:hidden}
@media (min-width:1000px){
  .ls-hero-grid{display:block !important;text-align:center !important;max-width:1180px !important;padding-top:20px}
  .ls-hero-teks{position:relative;z-index:1;align-items:center !important;text-align:center}
  .ls-hero-visual{position:absolute !important;inset:-70px 0 -40px !important;margin:0 !important;max-width:none !important;height:auto !important;z-index:0;pointer-events:none}
}
@media (min-width:641px){
  .ls-mmenu,.ls-burger{display:none !important}
}
@media (max-width:900px){
  /* Navigasi digeser ke samping, bukan menumpuk jadi beberapa baris. */
  .ls-nav{flex-wrap:nowrap !important;overflow-x:auto !important;scrollbar-width:none;-webkit-overflow-scrolling:touch}
  .ls-nav::-webkit-scrollbar{display:none}
}
@media (max-width:640px){
  .ls-hero-visual{display:none !important}
  .ls-deco{display:none !important}
  .ls-panel{padding:0 16px 24px !important}
  .ls-nav-desk,.ls-acts{display:none !important}
  .ls-burger{display:flex !important}
  .field,input,select,textarea{font-size:16px !important}
  .wrap{padding:0 16px}
  .navlink{font-size:12px;padding:8px 10px}
  .btn{font-size:12px;padding:11px 18px}
  .btn-o{font-size:12px;padding:10px 16px}
  /* Pratinjau dashboard hanya hiasan, dan teksnya 7 piksel. Disembunyikan di layar kecil. */
  .ls-preview{display:none !important}
  /* Judul hero: ukuran dan jarak diperkecil supaya kata tidak tergeser ke baris lain. */
  .ls-h1{font-size:30px !important;gap:8px !important;line-height:1.15 !important}
  .ls-bolt{width:34px !important;height:34px !important}
  .ls-bolt svg{width:18px !important;height:18px !important}
}
section{position:relative}
a{color:#F4F4F5;text-decoration:none}a:hover{color:#FF5A75}
.wrap{max-width:1180px;margin:0 auto;padding:0 24px;box-sizing:border-box}
.navlink{font-size:13px;font-weight:600;color:#C9CBD1;padding:9px 14px;border-radius:999px}
.navlink:hover{color:#FFFFFF;background:#1A1A1F}
.btn{display:inline-flex;align-items:center;gap:8px;background:#E11D3A;color:#FFFFFF;font-weight:600;font-size:13px;border-radius:999px;padding:12px 22px;box-shadow:0 8px 24px rgba(225,29,58,.35);border:none;cursor:pointer;font-family:inherit}
.btn:hover{background:#C8102E;color:#FFFFFF}
.btn-o{display:inline-flex;align-items:center;gap:8px;background:#121215;color:#FFFFFF;font-weight:600;font-size:13px;border-radius:999px;padding:11px 20px;border:1px solid #26262C}
.btn-o:hover{border-color:#E11D3A;color:#FFFFFF}
.badge{display:inline-flex;align-items:center;gap:8px;background:#121215;border:1px solid #23232A;border-radius:999px;padding:4px 14px 4px 4px;font-size:12px;font-weight:600;color:#FF5A75}
.badge-ic{width:28px;height:28px;border-radius:50%;background:#2A0E14;display:flex;align-items:center;justify-content:center}
.h2{margin:0;font-size:clamp(28px,3.2vw,38px);font-weight:700;letter-spacing:-.03em;line-height:1.2;color:#FFFFFF}
.sub{margin:0;font-size:14px;line-height:1.75;color:#8B8D96}
.red{color:#FF2E4D}
.card{background:#111114;border:1px solid #1F1F25;border-radius:18px}
.mini{background:#17171B;border:1px solid #24242A;border-radius:12px}
.float-ic{position:absolute;border-radius:50%;background:radial-gradient(circle,#2A0E14,#16080B);border:1px solid #3A121B;display:flex;align-items:center;justify-content:center;box-shadow:0 0 40px rgba(225,29,58,.18)}
.feat-ic{width:34px;height:34px;border-radius:50%;background:#2A0E14;display:flex;align-items:center;justify-content:center}
.faq{width:100%;text-align:left;background:#111114;border:1px solid #1F1F25;border-radius:12px;color:#E4E4E7;font-family:inherit;font-size:13px;font-weight:500;padding:18px 18px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:12px}
.faq:hover{border-color:#3A121B}
.mq{display:flex;gap:56px;width:max-content;animation:mq 28s linear infinite}
.mq2{display:flex;gap:18px;width:max-content;animation:mq 50s linear infinite}
@keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.follow{font-size:9px;font-weight:700;color:#FFFFFF;background:#E11D3A;border-radius:999px;padding:5px 12px}
`}</style>
      <div style={{ fontFamily: "'Satoshi','Plus Jakarta Sans',system-ui,sans-serif", color: "#F4F4F5", background: "#0A0A0C", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "0", height: "760px", overflow: "hidden", pointerEvents: "none", background: "linear-gradient(180deg,#1A070C 0%,#0A0A0C 100%)" }}>
          <div style={{ position: "absolute", left: "50%", top: "-420px", width: "1400px", height: "800px", marginLeft: "-700px", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(225,29,58,.35),rgba(225,29,58,0) 60%)" }} />
          <div style={{ position: "absolute", left: "-10%", top: "-200px", width: "120%", height: "1px", background: "rgba(255,255,255,.05)", transform: "rotate(18deg)", transformOrigin: "left" }} />
          <div style={{ position: "absolute", left: "-10%", top: "600px", width: "120%", height: "1px", background: "rgba(255,255,255,.05)", transform: "rotate(-22deg)", transformOrigin: "left" }} />
          <div style={{ position: "absolute", left: "30%", top: "-100px", width: "1px", height: "1200px", background: "rgba(255,255,255,.04)", transform: "rotate(30deg)" }} />
          <div style={{ position: "absolute", left: "70%", top: "-100px", width: "1px", height: "1200px", background: "rgba(255,255,255,.04)", transform: "rotate(-30deg)" }} />
        </div>
        <div style={{ position: "relative", paddingTop: "18px" }}>
          <header className="wrap" style={{ maxWidth: "860px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px", background: "rgba(17,17,20,.85)", border: "1px solid #23232A", borderRadius: "16px", padding: "8px 8px 8px 18px", boxShadow: "0 10px 40px rgba(0,0,0,.4)" }}>
              <a href="#top" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img src="/icon.png" alt="" aria-hidden="true" width="24" height="24" style={{ borderRadius: "8px", display: "block" }} />
                <span style={{ fontSize: "16px", fontWeight: "800", letterSpacing: "-.03em" }}>
                  SosmedGo
                </span>
              </a>
              <nav aria-label="Navigasi utama" className="ls-nav ls-nav-desk" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "2px" }}>
                <Link className="navlink" href="/layanan">
                  Layanan
                </Link>
                <a className="navlink" href="#fitur">
                  API
                </a>
                <Link className="navlink" href="/blog">
                  Blog
                </Link>
              </nav>
              <button type="button" className="ls-burger" aria-label={this.state.menu ? "Tutup menu" : "Buka menu"} aria-expanded={this.state.menu} onClick={function () { this.setState({ menu: !this.state.menu }); }.bind(this)} style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#17171B", border: "1px solid #26262C", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4F4F5" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  {this.state.menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
              {this.state.menu ? (
                <div className="ls-mmenu" style={{ width: "100%", display: "flex", flexDirection: "column", gap: "2px", paddingTop: "10px", borderTop: "1px solid #23232A" }}>
                  
                  <Link className="navlink" href="/layanan" onClick={function () { this.setState({ menu: false }); }.bind(this)} style={{ padding: "12px 14px", fontSize: "14px" }}>Layanan</Link>
                  <a className="navlink" href="#fitur" onClick={function () { this.setState({ menu: false }); }.bind(this)} style={{ padding: "12px 14px", fontSize: "14px" }}>API</a>
                  <Link className="navlink" href="/blog" onClick={function () { this.setState({ menu: false }); }.bind(this)} style={{ padding: "12px 14px", fontSize: "14px" }}>Blog</Link><div style={{ display: "flex", gap: "8px", marginTop: "10px" }}><Link className="btn-o" href="/login" onClick={function () { this.setState({ menu: false }); }.bind(this)} style={{ flex: 1, justifyContent: "center", borderRadius: "10px", padding: "12px 14px" }}>Masuk</Link><Link className="btn" href="/register" onClick={function () { this.setState({ menu: false }); }.bind(this)} style={{ flex: 1, justifyContent: "center", borderRadius: "10px", padding: "12px 14px" }}>Daftar</Link></div>
                  
                </div>
              ) : null}
              <div className="ls-acts" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <Link className="btn-o" href="/login" style={{ borderRadius: "10px", padding: "9px 14px" }}>
                  Masuk{" "}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="10" cy="8" r="4" />
                    <path d="M3 21v-1a7 7 0 0 1 11-5.7M18 15v6M15 18h6" />
                  </svg>
                </Link>
                <Link className="btn" href="/register" style={{ borderRadius: "10px", padding: "10px 16px" }}>
                  Daftar{" "}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="10" cy="8" r="4" />
                    <path d="M3 21v-1a7 7 0 0 1 11-5.7M18 15v6M15 18h6" />
                  </svg>
                </Link>
              </div>
            </div>
          </header>
        </div>
        <section id="top" style={{ position: "relative", padding: "96px 0 40px" }}>
          <div aria-hidden="true" className="ls-deco" style={{ position: "absolute", inset: "0", maxWidth: "1400px", margin: "0 auto" }}>
            <span className="float-ic" style={{ left: "12%", top: "80px", width: "52px", height: "52px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2" strokeLinejoin="round">
                <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
              </svg>
            </span>
            <span className="float-ic" style={{ left: "18%", top: "200px", width: "84px", height: "84px" }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="#FF5A75">
                <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5h.5V7.8a7 7 0 1 0 6.5 6.9V9.4A7 7 0 0 0 21 10.6V7a4 4 0 0 1-4-4z" />
              </svg>
            </span>
            <span className="float-ic" style={{ left: "10%", top: "360px", width: "46px", height: "46px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF5A75">
                <path d="M7 4l13 8-13 8z" />
              </svg>
            </span>
            <span className="float-ic" style={{ right: "12%", top: "90px", width: "52px", height: "52px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2.2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="#FF5A75" />
              </svg>
            </span>
            <span className="float-ic" style={{ right: "18%", top: "200px", width: "84px", height: "84px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2.6" strokeLinecap="round">
                <path d="M4 4l16 16M20 4L4 20" />
              </svg>
            </span>
            <span className="float-ic" style={{ right: "10%", top: "360px", width: "46px", height: "46px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="10" cy="8" r="4" />
                <path d="M3 21v-1a7 7 0 0 1 11-5.7M17 20s-3-2-3-4a1.5 1.5 0 0 1 3-.5 1.5 1.5 0 0 1 3 .5c0 2-3 4-3 4z" />
              </svg>
            </span>
          </div>
          <div className="wrap ls-hero-grid" style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "22px" }}>
          <div className="ls-hero-teks" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "22px" }}>
            <span className="badge" style={{ padding: "4px 14px 4px 4px", color: "#E4E4E7" }}>
              <span style={{ background: "#2A0E14", color: "#FF5A75", borderRadius: "999px", padding: "5px 12px" }}>
                Provider Utama
              </span>
              {" "}SosmedGo — Panel SMM #1 di Indonesia{" "}
            </span>
            <h1 className="ls-h1" style={{ margin: "0", fontSize: "clamp(38px,5vw,62px)", fontWeight: "800", letterSpacing: "-.04em", lineHeight: "1.1", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "14px" }}>
              {" "}Panel SMM{" "}
              <span aria-hidden="true" className="ls-bolt" style={{ width: "clamp(46px,5vw,62px)", height: "clamp(46px,5vw,62px)", borderRadius: "50%", background: "#E11D3A", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 6px rgba(225,29,58,.2),0 10px 30px rgba(225,29,58,.5)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 17l6-6 4 4 8-8" />
                  <path d="M15 7h6v6" />
                </svg>
              </span>
              <span className="red">
                Terpercaya
              </span>
            </h1>
            <p className="sub" style={{ maxWidth: "520px", color: "#A1A3AB" }}>
              Tingkatkan kehadiran sosial media kamu dengan{" "}
              <span className="red">
                layanan cepat
              </span>
              {" "}untuk followers, likes, dan views. Diproses otomatis 24 jam.
            </p>
            <Link className="btn" href="/login" style={{ padding: "13px 26px" }}>
              Masuk{" "}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="10" cy="8" r="4" />
                <path d="M3 21v-1a7 7 0 0 1 11-5.7M18 15v6M15 18h6" />
              </svg>
            </Link>
            </div>
          <div aria-hidden="true" className="ls-hero-visual">
              <div style={{ position: "absolute", left: "50%", top: "50%", width: "520px", height: "520px", transform: "translate(-50%, -50%)", borderRadius: "50%", background: "radial-gradient(closest-side, rgba(225,29,58,.16), rgba(225,29,58,0))" }} />
              <div style={{ position: "absolute", left: "12%", top: "6%", width: "84px", height: "84px", borderRadius: "50%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.18)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: "0 12px 30px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" fill="#FF5A75" /></svg>
              </div>
              <div style={{ position: "absolute", right: "12%", top: "2%", width: "84px", height: "84px", borderRadius: "50%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.18)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: "0 12px 30px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" fill="#E1306C" /></svg>
              </div>
              <div style={{ position: "absolute", left: "18%", top: "38%", width: "112px", height: "112px", borderRadius: "50%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.18)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: "0 12px 30px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="46" height="46" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5h.5V7.8a7 7 0 1 0 6.5 6.9V9.4A7 7 0 0 0 21 10.6V7a4 4 0 0 1-4-4z" fill="#FFFFFF" /></svg>
              </div>
              <div style={{ position: "absolute", right: "18%", top: "34%", width: "112px", height: "112px", borderRadius: "50%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.18)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: "0 12px 30px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="42" height="42" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h5l4 5.5L16.5 3H21l-6.6 7.6L21.5 21h-5l-4.4-6L7 21H2.5l7.1-8.1z" fill="#FFFFFF" /></svg>
              </div>
              <div style={{ position: "absolute", left: "6%", bottom: "8%", width: "84px", height: "84px", borderRadius: "50%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.18)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: "0 12px 30px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="38" height="38" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 7a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3zM10 8.5v7l6-3.5z" fill="#FF0000" /></svg>
              </div>
              <div style={{ position: "absolute", right: "6%", bottom: "10%", width: "84px", height: "84px", borderRadius: "50%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.18)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: "0 12px 30px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6" fill="#FCA5A5" /></svg>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 22px", marginTop: "56px" }}>
              {(v.benefits || []).map((b, $index) => (
                <React.Fragment key={$index}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "600", color: "#E4E4E7" }}>
                    <span className="feat-ic" style={{ width: "28px", height: "28px" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d={b.icon} />
                      </svg>
                    </span>
                    {" "}{b.t}{" "}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div aria-label="Platform yang didukung" style={{ position: "relative", maxWidth: "820px", margin: "40px auto 0", overflow: "hidden", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 15%,#000 85%,transparent)", maskImage: "linear-gradient(90deg,transparent,#000 15%,#000 85%,transparent)" }}>
            <div className="mq">
              {(v.logos || []).map((l, $index) => (
                <React.Fragment key={$index}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "22px", fontWeight: "800", letterSpacing: "-.03em", color: "#3E3F47", whiteSpace: "nowrap" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#3E3F47" aria-hidden="true">
                      <path d={l.icon} />
                    </svg>
                    {l.name}{" "}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>
        <div style={{ borderTop: "1px solid #18181D" }} />
        <section style={{ padding: "40px 0 90px" }}>
          <div className="wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px" }}>
            <span className="badge">
              <span className="badge-ic">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
                </svg>
              </span>
              Kualitas Terjamin
            </span>
            <h2 className="h2">
              SosmedGo = satu cerita sukses demi cerita sukses!
            </h2>
            <p className="sub">
              Gabung bersama ribuan pelanggan puas dan raih kesuksesan besar.
            </p>
            <div style={{ width: "100%", maxWidth: "820px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px", marginTop: "22px" }}>
              {(v.succ || []).map((s, $index) => (
                <React.Fragment key={$index}>
                  <div className="card" style={{ padding: "26px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <span style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(150deg,#F0284A,#B5122F)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 24px rgba(225,29,58,.35)" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d={s.icon} />
                      </svg>
                    </span>
                    <span style={{ fontSize: "17px", fontWeight: "700" }}>
                      {s.t}
                    </span>
                    <span style={{ fontSize: "11px", color: "#8B8D96" }}>
                      {s.d}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>
        <section id="layanan" style={{ padding: "20px 0 90px" }}>
          <div className="wrap" style={{ maxWidth: "860px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px", marginBottom: "28px" }}>
              <span className="badge">
                <span className="badge-ic">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
                  </svg>
                </span>
                Layanan Kami
              </span>
              <h2 className="h2">
                SosmedGo bantu bisnis jasa SMM kamu berkembang
              </h2>
              <p className="sub" style={{ maxWidth: "720px" }}>
                Panel SosmedGo menyediakan layanan terbaik untuk bisnis reseller social media marketing kamu. Cek apa saja yang bisa kamu dapatkan!
              </p>
            </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
              <div className="card" style={{ flex: "1 1 200px", minWidth: "0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div aria-hidden="true" style={{ position: "relative", height: "280px", margin: "6px", borderRadius: "14px", background: "#1A0A0E", overflow: "hidden" }}>
                  <span style={{ position: "absolute", left: "-30px", top: "60px", width: "70px", height: "260px", background: "#E11D3A", transform: "rotate(-14deg)" }} />
                  <span style={{ position: "absolute", left: "70px", top: "-20px", width: "60px", height: "80px", background: "#E11D3A", transform: "rotate(-25deg)" }} />
                  <div style={{ position: "absolute", left: "40px", top: "40px", right: "-20px", bottom: "-10px", background: "#141418", border: "1px solid #26262C", borderRadius: "10px", padding: "10px" }}>
                    <div style={{ display: "flex", gap: "3px", alignItems: "center", marginBottom: "10px" }}>
                      <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#FF5F57" }} />
                      <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#FEBC2E" }} />
                      <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#28C840" }} />
                      <span style={{ fontSize: "7px", color: "#6B6E78", marginLeft: "6px" }}>
                        x.com
                      </span>
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: "700", marginBottom: "10px" }}>
                      ✕ Notifikasi Kamu
                    </div>
                    <div className="mini" style={{ padding: "7px", display: "flex", gap: "6px", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ width: "18px", height: "18px", borderRadius: "50%", overflow: "hidden", flex: "none" }}><FictionalAvatar kind="curly" bg="#C9B6F2" size={18} /></span>
                      <span style={{ fontSize: "7px", color: "#8B8D96" }}>
                        Follower Baru
                        <br />
                        <span style={{ color: "#E4E4E7" }}>
                          @akun1 mengikutimu
                        </span>
                      </span>
                    </div>
                    <div className="mini" style={{ padding: "7px", display: "flex", gap: "6px", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ width: "18px", height: "18px", borderRadius: "50%", overflow: "hidden", flex: "none" }}><FictionalAvatar kind="cap" bg="#FBD38D" size={18} /></span>
                      <span style={{ fontSize: "7px", color: "#8B8D96" }}>
                        Follower Baru
                        <br />
                        <span style={{ color: "#E4E4E7" }}>
                          @akun2 mengikutimu
                        </span>
                      </span>
                    </div>
                    <div className="mini" style={{ padding: "7px", display: "flex", gap: "6px", alignItems: "center" }}>
                      <span style={{ width: "18px", height: "18px", borderRadius: "50%", overflow: "hidden", flex: "none" }}><FictionalAvatar kind="bun" bg="#F4B6C2" size={18} /></span>
                      <span style={{ fontSize: "7px", color: "#FF5A75" }}>
                        Follower Baru
                      </span>
                    </div>
                  </div>
                  <span style={{ position: "absolute", left: "12px", top: "180px", display: "flex", alignItems: "center", gap: "6px", background: "#1E1E23", border: "1px solid #2E2E35", borderRadius: "999px", padding: "5px 10px 5px 5px", fontSize: "8px", fontWeight: "600", boxShadow: "0 8px 20px rgba(0,0,0,.5)" }}>
                    <span style={{ width: "14px", height: "14px", borderRadius: "50%", overflow: "hidden", flex: "none" }}><FictionalAvatar kind="cap" bg="#FBD38D" size={14} /></span>
                    Kamu dapat Followers Baru
                  </span>
                </div>
                <div style={{ padding: "16px 18px 20px", fontSize: "17px", fontWeight: "700", lineHeight: "1.3" }}>
                  Hidupkan
                  <br />
                  Twitter (X)
                </div>
              </div>
              <div className="card" style={{ flex: "3 1 420px", minWidth: "0", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "16px", padding: "48px 32px" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: "0", backgroundImage: "radial-gradient(rgba(255,255,255,.07) 1px,transparent 1.5px)", backgroundSize: "12px 12px", WebkitMaskImage: "radial-gradient(ellipse at center,#000 20%,transparent 70%)", maskImage: "radial-gradient(ellipse at center,#000 20%,transparent 70%)" }} />
                <span className="badge" style={{ position: "relative" }}>
                  <span className="badge-ic">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#FF5A75" aria-hidden="true">
                      <path d="M7 4l13 8-13 8z" />
                    </svg>
                  </span>
                  Dapatkan Views YouTube dengan Mudah!
                </span>
                <h3 style={{ position: "relative", margin: "0", fontSize: "30px", fontWeight: "700", letterSpacing: "-.03em" }}>
                  Panel{" "}
                  <span className="red">
                    YouTube
                  </span>
                  {" "}Original
                </h3>
                <p className="sub" style={{ position: "relative", maxWidth: "380px", fontSize: "12px" }}>
                  Tingkatkan popularitas channel pelangganmu. Tambah views, likes, subscribers, komentar, dan share — semua bisa lewat panel YouTube SMM kami.
                </p>
                <Link className="btn" href="/login" style={{ position: "relative" }}>
                  Lihat layanan{" "}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="4" y="4" width="16" height="16" rx="3" />
                    <path d="M9 12h6M12 9v6" />
                  </svg>
                </Link>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "16px", marginBottom: "16px" }}>
              <div className="card" style={{ padding: "22px 22px 0", display: "flex", flexDirection: "column", gap: "10px", overflow: "hidden" }}>
                <h3 style={{ margin: "0", fontSize: "16px", fontWeight: "700" }}>
                  Likes Facebook Kilat
                </h3>
                <p className="sub" style={{ fontSize: "11px" }}>
                  Dongkrak profil Facebook dengan likes, followers, teman, komentar, dan share yang mereka butuhkan.
                </p>
                <div aria-hidden="true" className="mini" style={{ marginTop: "14px", borderRadius: "12px 12px 0 0", borderBottom: "none", height: "170px", position: "relative", padding: "10px" }}>
                  <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#FF5F57" }} />
                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#FEBC2E" }} />
                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#28C840" }} />
                    <span style={{ fontSize: "7px", color: "#6B6E78", marginLeft: "6px" }}>
                      facebook.com/akunkamu
                    </span>
                  </div>
                  <div style={{ textAlign: "center", fontSize: "15px", fontWeight: "800", color: "#FF5A75", marginTop: "10px" }}>
                    facebook
                  </div>
                  <span style={{ position: "absolute", left: "24px", top: "80px", width: "40px", height: "40px", borderRadius: "50%", background: "#FBBF24", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", color: "#78350F" }}>
                    XD
                  </span>
                  <span style={{ position: "absolute", left: "50%", top: "62px", width: "72px", height: "72px", marginLeft: "-36px", borderRadius: "50%", border: "2px dashed #E11D3A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
                      <defs>
                        <clipPath id="fb-avatar-clip2"><circle cx="28" cy="28" r="28" /></clipPath>
                      </defs>
                      <g clipPath="url(#fb-avatar-clip2)">
                        <rect width="56" height="56" fill="#FBBF24" />
                        <path d="M2 58 C4 44 14 40 28 40 C42 40 52 44 54 58Z" fill="#1F2937" />
                        <rect x="24" y="34" width="8" height="8" fill="#B97A56" />
                        <g fill="#1C1410">
                          <circle cx="16" cy="20" r="5" />
                          <circle cx="22" cy="13" r="6" />
                          <circle cx="31" cy="12" r="6" />
                          <circle cx="39" cy="17" r="5.5" />
                          <circle cx="42" cy="24" r="3.5" />
                          <circle cx="14" cy="26" r="3" />
                        </g>
                        <ellipse cx="28" cy="26" rx="12" ry="13.5" fill="#C98B63" />
                        <g fill="none" stroke="#111827" strokeWidth="1.6">
                          <circle cx="23" cy="26" r="4" />
                          <circle cx="33" cy="26" r="4" />
                          <path d="M27 26 H29" />
                        </g>
                        <circle cx="23" cy="26" r="1.1" fill="#111827" />
                        <circle cx="33" cy="26" r="1.1" fill="#111827" />
                        <path d="M23 33 Q28 37 33 33" stroke="#5B2A1A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      </g>
                    </svg>
                  </span>
                  <span style={{ position: "absolute", left: "50%", top: "142px", transform: "translateX(-50%)", whiteSpace: "nowrap", fontSize: "9px", fontWeight: "700", color: "#E4E4E7", background: "#1E1E23", border: "1px solid #2A2A30", borderRadius: "999px", padding: "3px 9px" }}>
                    @raka.pratama
                  </span>
                  <span style={{ position: "absolute", right: "24px", top: "80px", width: "40px", height: "40px", borderRadius: "50%", background: "#FBBF24", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "800", color: "#78350F" }}>
                    O
                  </span>
                </div>
              </div>
              <div className="card" style={{ padding: "22px 22px 0", display: "flex", flexDirection: "column", gap: "10px", overflow: "hidden" }}>
                <h3 style={{ margin: "0", fontSize: "16px", fontWeight: "700" }}>
                  Layanan Instagram Terbaik
                </h3>
                <p className="sub" style={{ fontSize: "11px" }}>
                  Kalahkan algoritma dan masuk halaman trending! Tambah followers, likes, dan jangkauan.
                </p>
                <div aria-hidden="true" className="mini" style={{ marginTop: "14px", borderRadius: "12px 12px 0 0", borderBottom: "none", height: "170px", padding: "10px", display: "flex", flexDirection: "column", gap: "7px" }}>
                  <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#FF5F57" }} />
                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#FEBC2E" }} />
                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#28C840" }} />
                    <span style={{ fontSize: "7px", color: "#6B6E78", marginLeft: "6px" }}>
                      instagram.com/notifikasi
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: "700", margin: "2px 0" }}>
                    Notifikasi
                  </div>
                  {(v.igN || []).map((n, $index) => (
                    <React.Fragment key={$index}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#1E1E23", borderRadius: "8px", padding: "6px 8px" }}>
                        <span style={{ width: "22px", height: "22px", borderRadius: "50%", border: "2px solid #E11D3A", overflow: "hidden", flex: "none" }}><FictionalAvatar kind={n.kind} bg={n.bg} size={18} /></span>
                        <span style={{ fontSize: "7px", color: "#C9CBD1", flex: "1" }}>
                          <b style={{ color: "#FFFFFF" }}>
                            {n.u}
                          </b>
                          {" "}mulai mengikutimu
                        </span>
                        <span className="follow">
                          Follow
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="card" style={{ padding: "22px 22px 0", display: "flex", flexDirection: "column", gap: "10px", overflow: "hidden" }}>
                <h3 style={{ margin: "0", fontSize: "16px", fontWeight: "700" }}>
                  Viral di TikTok
                </h3>
                <p className="sub" style={{ fontSize: "11px" }}>
                  Bantu pelangganmu atau dirimu sendiri menjangkau audiens baru yang lebih luas lewat panel TikTok kami.
                </p>
                <div aria-hidden="true" className="mini" style={{ marginTop: "14px", borderRadius: "12px 12px 0 0", borderBottom: "none", height: "170px", position: "relative", overflow: "hidden", background: "linear-gradient(180deg,#2B1A20,#4A1E2A)" }}>
                  <svg viewBox="0 0 240 170" width="100%" height="170" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: "0" }}>
                    <style>{`
                      .tt-bob{animation:ttBob 2.4s ease-in-out infinite}
                      .tt-sway{animation:ttSway 3.2s ease-in-out infinite;transform-origin:120px 30px}
                      .tt-arm{animation:ttWave 1.6s ease-in-out infinite;transform-origin:166px 142px}
                      .tt-heart{animation:ttFloat 3s ease-out infinite;opacity:0}
                      .tt-heart.d1{animation-delay:1s}
                      .tt-heart.d2{animation-delay:2s}
                      @keyframes ttBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
                      @keyframes ttSway{0%,100%{transform:rotate(-1.5deg)}50%{transform:rotate(1.5deg)}}
                      @keyframes ttWave{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(10deg)}}
                      @keyframes ttFloat{0%{transform:translate(0,0) scale(.6);opacity:0}15%{opacity:.9}100%{transform:translate(10px,-70px) scale(1);opacity:0}}
                      .tt-eye{transform-box:fill-box;transform-origin:center;animation:ttBlink 4s infinite}
                      @keyframes ttBlink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
                      @media (prefers-reduced-motion: reduce){.tt-bob,.tt-sway,.tt-arm,.tt-heart,.tt-eye{animation:none}.tt-heart{opacity:0}}
                    `}</style>
                    <path d="M70 70 C60 20 120 0 150 20 C180 40 175 90 170 130 L80 170 C70 130 78 100 70 70Z" fill="#5A2E1A" />
                    <g className="tt-bob">
                      <path d="M90 70 C92 42 112 32 130 34 C150 38 156 58 152 82 C148 106 136 124 120 128 C104 124 92 104 90 82Z" fill="#E7B49A" />
                      <g className="tt-sway">
                        <path d="M84 84 C80 40 110 22 140 28 C160 34 166 50 164 64 C150 46 126 44 110 52 C96 60 92 72 92 96Z" fill="#5A2E1A" />
                      </g>
                      <g fill="#F08A8A" opacity=".35">
                        <circle cx="103" cy="92" r="6" />
                        <circle cx="139" cy="92" r="6" />
                      </g>
                      <path d="M106 66 Q112 62 118 65" stroke="#5A2E1A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <path d="M124 65 Q130 62 136 66" stroke="#5A2E1A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <ellipse className="tt-eye" cx="112" cy="75" rx="3" ry="4" fill="#2B1A20" />
                      <ellipse className="tt-eye" cx="130" cy="75" rx="3" ry="4" fill="#2B1A20" />
                      <path d="M111 97 Q121 106 131 97" stroke="#8A3B3B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    </g>
                    <path d="M60 170 C70 140 100 130 122 130 C150 132 170 145 180 170Z" fill="#3A3A42" />
                    <g className="tt-arm">
                      <path d="M166 142 Q192 116 184 74" stroke="#E7B49A" strokeWidth="11" strokeLinecap="round" fill="none" />
                      <circle cx="184" cy="68" r="8" fill="#E7B49A" />
                    </g>
                    <g transform="translate(150 40) scale(.6)"><path className="tt-heart" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="#FF5A75" /></g>
                    <g transform="translate(120 46) scale(.5)"><path className="tt-heart d1" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="#FF5A75" /></g>
                    <g transform="translate(176 90) scale(.4)"><path className="tt-heart d2" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="#FF5A75" /></g>
                  </svg>
                  <div style={{ position: "absolute", left: "0", right: "0", top: "0", padding: "8px 10px", display: "flex", justifyContent: "center", fontSize: "11px", fontWeight: "800" }}>
                    TikTok
                  </div>
                  <div style={{ position: "absolute", right: "10px", top: "50px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", fontSize: "7px" }}>
                    <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#111", border: "2px solid #FFFFFF" }} />
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF">
                      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
                    </svg>
                    256{" "}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF">
                      <path d="M4 5h16v11H9l-5 4z" />
                    </svg>
                    25{" "}
                  </div>
                </div>
              </div>
            </div>
            <div className="card" style={{ position: "relative", overflow: "hidden", padding: "72px 32px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px" }}>
              <div aria-hidden="true" className="ls-deco" style={{ position: "absolute", left: "50%", top: "50%", width: "720px", height: "720px", margin: "-360px 0 0 -360px", borderRadius: "50%", border: "70px solid rgba(225,29,58,.05)" }} />
              <div aria-hidden="true" className="ls-deco" style={{ position: "absolute", left: "50%", top: "50%", width: "440px", height: "440px", margin: "-220px 0 0 -220px", borderRadius: "50%", border: "60px solid rgba(225,29,58,.06)" }} />
              <span className="badge" style={{ position: "relative" }}>
                <span className="badge-ic">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
                  </svg>
                </span>
                Mulai Viral Hari Ini!
              </span>
              <h3 className="h2" style={{ position: "relative", fontSize: "28px" }}>
                Layanan SMM Melimpah
              </h3>
              <p className="sub" style={{ position: "relative", maxWidth: "470px", fontSize: "12px" }}>
                Layanan yang bisa kamu jual tidak terbatas pada tiga platform besar. Tambah eksposur pelangganmu di Telegram, Shopee, Spotify, Twitch, layanan SEO, dan masih banyak lagi.
              </p>
              <Link className="btn" href="/register" style={{ position: "relative" }}>
                Daftar Sekarang{" "}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9 12h6M12 9v6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
        <section id="fitur" style={{ padding: "40px 0 90px" }}>
          <div className="wrap" style={{ maxWidth: "860px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px", marginBottom: "34px" }}>
              <span className="badge">
                <span className="badge-ic">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M4 20L20 4M14 4h6v6M5 9l2-2M9 5l1 1" />
                  </svg>
                </span>
                Fitur Utama
              </span>
              <h2 className="h2">
                <span className="red">
                  SosmedGo
                </span>
                {" "}selangkah lebih
                <br />
                maju dari kompetitor!
              </h2>
              <p className="sub" style={{ maxWidth: "360px" }}>
                Layanan SMM berkualitas dan fitur tambahan yang membuatmu unggul di dunia social media marketing!
              </p>
            </div>
            <div aria-hidden="true" className="ls-preview" style={{ position: "relative" }}>
              <div className="card" style={{ display: "flex", overflow: "hidden", minHeight: "560px", borderRadius: "16px" }}>
                <div style={{ width: "110px", flex: "none", borderRight: "1px solid #1F1F25", padding: "16px 10px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "14px" }}>
                    <img src="/icon.png" alt="" aria-hidden="true" width="14" height="14" style={{ borderRadius: "8px", display: "block" }} />
                    <span style={{ fontSize: "9px", fontWeight: "800" }}>
                      SosmedGo
                    </span>
                  </div>
                  <div className="mini" style={{ padding: "6px", fontSize: "7px", color: "#8B8D96", display: "flex", gap: "4px", alignItems: "center" }}>
                    <span style={{ width: "14px", height: "14px", borderRadius: "4px", background: "#E11D3A", color: "#FFF", fontSize: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800" }}>
                      SG
                    </span>
                    Akun Saya
                  </div>
                  <span style={{ background: "#E11D3A", borderRadius: "6px", padding: "6px 8px", fontSize: "7px", fontWeight: "600" }}>
                    Pesanan Baru
                  </span>
                  <span style={{ padding: "4px 8px", fontSize: "7px", color: "#8B8D96" }}>
                    Pesanan Saya
                  </span>
                  <span style={{ padding: "4px 8px", fontSize: "7px", color: "#8B8D96" }}>
                    Layanan
                  </span>
                  <span style={{ padding: "4px 8px", fontSize: "7px", color: "#8B8D96" }}>
                    Deposit
                  </span>
                  <span style={{ padding: "4px 8px", fontSize: "7px", color: "#8B8D96" }}>
                    Tiket
                  </span>
                  <span style={{ marginTop: "auto", fontSize: "7px", color: "#4B4D56" }}>
                    sosmedgo v2.0
                  </span>
                </div>
                <div style={{ flex: "1", minWidth: "0", padding: "16px 22px", display: "flex", flexDirection: "column", gap: "14px", background: "linear-gradient(180deg,#14090C,#111114 30%)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "8px", color: "#6B6E78" }}>
                      Beranda ›{" "}
                      <span style={{ color: "#FF5A75" }}>
                        Pesanan Baru
                      </span>
                    </span>
                    <span style={{ fontSize: "8px", color: "#C9CBD1", display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ background: "#2A0E14", color: "#FF5A75", borderRadius: "999px", padding: "3px 8px" }}>
                        Rp [SALDO]
                      </span>
                      <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#2A0E14" }} />
                    </span>
                  </div>
                  <div style={{ marginTop: "14px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "700" }}>
                      Selamat datang di SosmedGo,{" "}
                      <span className="red">
                        akunkamu
                      </span>
                      {" "}👋
                    </div>
                    <div style={{ fontSize: "7px", color: "#6B6E78", marginTop: "4px" }}>
                      Kelola semua pesanan dan saldo kamu dari satu tempat.
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: "8px" }}>
                    {(v.stats || []).map((s, $index) => (
                      <React.Fragment key={$index}>
                        <div className="mini" style={{ padding: "10px 10px 0", overflow: "hidden" }}>
                          <div style={{ fontSize: "6px", color: "#6B6E78" }}>
                            {s.l}
                          </div>
                          <div style={{ fontSize: "12px", fontWeight: "700", margin: "4px 0 8px" }}>
                            {s.v}
                          </div>
                          <div style={{ margin: "0 -10px", padding: "5px 10px", fontSize: "6px", fontWeight: "600", background: s.bg, color: s.fg }}>
                            {s.a} →
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div className="mini" style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ fontSize: "8px", fontWeight: "700" }}>
                        Buat pesanan
                      </div>
                      <div style={{ display: "flex", gap: "4px", background: "#1E1E23", borderRadius: "6px", padding: "3px", fontSize: "6px" }}>
                        <span style={{ background: "#2A2A30", borderRadius: "4px", padding: "4px 8px" }}>
                          Pesanan Baru
                        </span>
                        <span style={{ padding: "4px 8px", color: "#8B8D96" }}>
                          Cari
                        </span>
                        <span style={{ padding: "4px 8px", color: "#8B8D96" }}>
                          Pesanan Massal
                        </span>
                      </div>
                      <div style={{ fontSize: "6px", color: "#8B8D96" }}>
                        Pilih Kategori
                      </div>
                      <div style={{ border: "1px solid #E11D3A", borderRadius: "6px", padding: "6px", fontSize: "6px" }}>
                        Instagram Followers
                      </div>
                      <div style={{ fontSize: "6px", color: "#8B8D96" }}>
                        Pilih Layanan
                      </div>
                      <div style={{ background: "#1E1E23", borderRadius: "6px", padding: "6px", fontSize: "6px" }}>
                        {this.state.layanan ? this.state.layanan.nama + ' — Rp ' + this.state.layanan.hargaTxt + '/1000' : 'Layanan dari katalog kami'}
                      </div>
                      <div style={{ fontSize: "6px", color: "#8B8D96" }}>
                        Link
                      </div>
                      <div style={{ background: "#1E1E23", borderRadius: "6px", padding: "6px", fontSize: "6px", color: "#4B4D56" }}>
                        Masukkan link di sini
                      </div>
                      <div style={{ fontSize: "6px", color: "#8B8D96" }}>
                        Jumlah
                      </div>
                      <div style={{ background: "#1E1E23", borderRadius: "6px", padding: "6px", fontSize: "6px", color: "#4B4D56" }}>
                        Min: 100 — Maks: 50.000
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <span style={{ flex: "1", background: "#1E1E23", borderRadius: "6px", padding: "6px", fontSize: "6px", color: "#8B8D96" }}>
                          Subtotal: Rp {this.state.layanan ? this.state.layanan.hargaTxt : '—'}
                        </span>
                        <span style={{ flex: "1", background: "#E11D3A", borderRadius: "6px", padding: "6px", fontSize: "6px", textAlign: "center", fontWeight: "600" }}>
                          Kirim Pesanan
                        </span>
                      </div>
                    </div>
                    <div className="mini" style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", textAlign: "center" }}>
                      <span style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#E11D3A", marginTop: "8px" }} />
                      <div style={{ fontSize: "7px", fontWeight: "600" }}>
                        Instagram — Followers Indonesia — Refill 30 Hari
                      </div>
                      <div style={{ fontSize: "6px", color: "#6B6E78" }}>
                        ID Layanan: {this.state.layanan ? this.state.layanan.id : '—'}{this.state.layanan && this.state.layanan.waktu ? ' · Dikirim dalam ±' + this.state.layanan.waktu + ' menit' : ''}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "6px", width: "100%", marginTop: "8px", fontSize: "6px" }}>
                        <span style={{ color: "#C9CBD1" }}>
                          ⏱
                          <br />
                          Waktu Proses
                        </span>
                        <span style={{ color: "#C9CBD1" }}>
                          ✓
                          <br />
                          Terpercaya
                        </span>
                        <span style={{ color: "#C9CBD1" }}>
                          🛡
                          <br />
                          Garansi
                        </span>
                      </div>
                      <div style={{ width: "100%", textAlign: "left", borderTop: "1px solid #24242A", paddingTop: "8px", marginTop: "8px", fontSize: "6px", color: "#8B8D96", lineHeight: "1.8" }}>
                        <b style={{ color: "#E4E4E7" }}>
                          Cara pesan?
                        </b>
                        <br />
                        • Masukkan link postingan
                        <br />
                        • Pilih jumlah pesanan
                        <br />
                        • Selesaikan pembelian
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card ls-deco" style={{ position: "absolute", left: "-50px", top: "170px", width: "170px", padding: "10px", boxShadow: "0 20px 50px rgba(0,0,0,.6)", borderRadius: "12px" }}>
                <div style={{ display: "flex", gap: "3px", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#FF5F57" }} />
                  <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#FEBC2E" }} />
                  <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#28C840" }} />
                  <span style={{ fontSize: "6px", color: "#6B6E78", marginLeft: "6px" }}>
                    sosmedgo.com/update
                  </span>
                </div>
                <div style={{ fontSize: "10px", fontWeight: "700", marginBottom: "8px" }}>
                  ✕ Update
                </div>
                {(v.igN || []).map((n, $index) => (
                  <React.Fragment key={$index}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "7px" }}>
                      <span style={{ width: "18px", height: "18px", borderRadius: "50%", overflow: "hidden", flex: "none" }}><FictionalAvatar kind={n.kind} bg={n.bg} size={18} /></span>
                      <span style={{ fontSize: "6px", color: "#C9CBD1", flex: "1" }}>
                        <b style={{ color: "#FFF" }}>
                          {n.u}
                        </b>
                        <br />
                        mulai mengikutimu
                      </span>
                      <span className="follow" style={{ fontSize: "7px", padding: "4px 9px" }}>
                        Follow
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div className="card ls-deco" style={{ position: "absolute", right: "-50px", top: "200px", width: "150px", padding: "12px", boxShadow: "0 20px 50px rgba(0,0,0,.6)", borderRadius: "12px" }}>
                <div style={{ fontSize: "9px", fontWeight: "700", display: "flex", gap: "6px", alignItems: "center" }}>
                  <span style={{ width: "14px", height: "14px", borderRadius: "4px", background: "#2A0E14", border: "1px solid #E11D3A" }} />
                  Instagram
                </div>
                <div style={{ fontSize: "7px", color: "#6B6E78", margin: "8px 0 4px" }}>
                  Ringkasan Insight
                </div>
                <div style={{ fontSize: "18px", fontWeight: "700" }}>
                  24,597+
                </div>
                <div style={{ fontSize: "7px", color: "#8B8D96", display: "flex", gap: "6px", alignItems: "center", marginTop: "4px" }}>
                  Followers{" "}
                  <span style={{ background: "rgba(34,197,94,.15)", color: "#22C55E", borderRadius: "999px", padding: "2px 6px", fontWeight: "700" }}>
                    ↑ 58%
                  </span>
                </div>
                <svg viewBox="0 0 130 50" width="100%" height="46" style={{ display: "block", marginTop: "6px" }}>
                  <path d="M0 40 C10 40 14 20 22 22 S34 46 44 38 S56 6 66 14 S78 44 88 36 S104 4 114 12 S124 30 130 20" fill="none" stroke="#E11D3A" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "56px 40px", marginTop: "70px" }}>
              {(v.features || []).map((f, $index) => (
                <React.Fragment key={$index}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <span className="feat-ic">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d={f.icon} />
                      </svg>
                    </span>
                    <h3 style={{ margin: "0", fontSize: "15px", fontWeight: "600" }}>
                      {f.t}
                    </h3>
                    <p className="sub" style={{ fontSize: "11px", lineHeight: "2" }}>
                      {f.d}
                    </p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>
        <section style={{ padding: "20px 0 90px" }}>
          <div className="wrap" style={{ maxWidth: "860px" }}>
            <div style={{ background: "#100A0C", border: "1px solid #1F1418", borderRadius: "28px", padding: "64px 0 50px", position: "relative", overflow: "visible" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px", padding: "0 24px" }}>
                <span className="badge">
                  <span className="badge-ic">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                      <path d="M4 20L20 4M14 4h6v6" />
                    </svg>
                  </span>
                  Testimoni
                </span>
                <h2 className="h2">
                  Apa kata pelanggan kami?
                </h2>
                <p className="sub" style={{ maxWidth: "400px" }}>
                  Kami menghargai pelanggan, dan mereka menghargai layanan kami. Lihat apa kata mereka.
                </p>
              </div>
            </div>
          </div>
          <div style={{ position: "relative", marginTop: "28px", overflow: "hidden", padding: "0 0 10px" }}>
            <div className="mq2">
              {(v.testi || []).map((t, $index) => (
                <React.Fragment key={$index}>
                  <div className="card" style={{ width: "360px", flex: "none", borderRadius: "14px", overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px" }}>
                      <span style={{ width: "38px", height: "38px", borderRadius: "50%", overflow: "hidden", flex: "none" }}><FictionalAvatar kind={t.kind} bg={t.bg} size={38} /></span>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "600" }}>
                          {t.name}
                        </div>
                        <div style={{ color: "#E11D3A", fontSize: "11px", letterSpacing: "2px" }}>
                          ★★★★★
                        </div>
                      </div>
                    </div>
                    <div style={{ borderTop: "1px solid #1F1F25", padding: "14px 16px 18px", fontSize: "12px", lineHeight: "1.7", color: "#A1A3AB" }}>
                      [Tempel testimoni asli dari pelanggan SosmedGo di sini — 2 sampai 4 kalimat.]
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
            <span className="badge" style={{ color: "#E4E4E7" }}>
              <span className="badge-ic">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 20L20 4M14 4h6v6" />
                </svg>
              </span>
              {this.state.stat ? this.state.stat.pengguna.toLocaleString('id-ID') + ' pengguna terdaftar' : 'Diproses otomatis 24 jam'}
            </span>
          </div>
        </section>
        <section style={{ padding: "10px 0 90px" }}>
          <div className="wrap" style={{ maxWidth: "860px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px", marginBottom: "34px" }}>
              <span className="badge">
                <span className="badge-ic">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M4 20L20 4M14 4h6v6" />
                  </svg>
                </span>
                Perbandingan
              </span>
              <h2 className="h2">
                <span className="red">
                  SosmedGo
                </span>
                {" "}kasih kamu panel SMM terbaik
                <br />
                untuk mengalahkan kompetitor!
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "16px" }}>
              <div className="card" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#1E1E23", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B8D96" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </span>
                  <span style={{ fontSize: "15px", fontWeight: "700" }}>
                    Panel Lain
                  </span>
                </div>
                {(v.bad || []).map((x, $index) => (
                  <React.Fragment key={$index}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", fontSize: "12px", color: "#8B8D96" }}>
                      <span style={{ width: "18px", height: "18px", flex: "none", borderRadius: "50%", border: "1px solid #3A121B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="4" strokeLinecap="round" aria-hidden="true">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </span>
                      {x}{" "}
                    </div>
                  </React.Fragment>
                ))}
                <div style={{ marginTop: "18px" }}>
                  <div style={{ fontSize: "13px", color: "#8B8D96" }}>
                    Hasil
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#FF5A75", marginTop: "4px" }}>
                    Lambat & Mahal ✕
                  </div>
                  <div style={{ fontSize: "11px", color: "#6B6E78", marginTop: "4px" }}>
                    Bisnis jalan di tempat
                  </div>
                </div>
              </div>
              <div className="card" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "14px", borderColor: "#5A1A26", background: "linear-gradient(170deg,#1C0B10,#111114 60%)", boxShadow: "0 30px 60px rgba(225,29,58,.12)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <img src="/icon.png" alt="" aria-hidden="true" width="26" height="26" style={{ borderRadius: "8px", display: "block" }} />
                  <span style={{ fontSize: "15px", fontWeight: "700" }}>
                    sosmedgo.com
                  </span>
                </div>
                {(v.good || []).map((x, $index) => (
                  <React.Fragment key={$index}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", fontSize: "12px", color: "#E4E4E7" }}>
                      <span style={{ width: "18px", height: "18px", flex: "none", borderRadius: "50%", background: "#E11D3A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 12l5 5 9-10" />
                        </svg>
                      </span>
                      {x}{" "}
                    </div>
                  </React.Fragment>
                ))}
                <div style={{ marginTop: "18px" }}>
                  <div style={{ fontSize: "13px", color: "#8B8D96" }}>
                    Hasil
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#FF2E4D", marginTop: "4px" }}>
                    Cepat & Hemat ✓
                  </div>
                  <div style={{ fontSize: "11px", color: "#8B8D96", marginTop: "4px" }}>
                    Bonus deposit 10% untuk peringkat Starter dan Junior
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="faq" style={{ padding: "30px 0 90px" }}>
          <div className="wrap" style={{ maxWidth: "860px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px", marginBottom: "28px" }}>
              <span className="badge">
                <span className="badge-ic">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M4 20L20 4M14 4h6v6" />
                  </svg>
                </span>
                Menjawab pertanyaan yang sering diajukan
              </span>
              <h2 className="h2">
                Pertanyaan yang Sering Diajukan
              </h2>
              <p className="sub" style={{ fontSize: "12px" }}>
                Masih ada yang mengganjal? Yuk kita jawab!
              </p>
            </div>
            <div style={{ background: "#0E0E11", border: "1px solid #1A1A1F", borderRadius: "18px", padding: "8px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "8px", alignItems: "start" }}>
                {(v.faqs || []).map((q, $index) => (
                  <React.Fragment key={$index}>
                    <div>
                      <button type="button" className="faq" onClick={q.toggle} aria-expanded={q.open} style={{ borderColor: q.bc }}>
                        <span>
                          {q.q}
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9CBD1" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" style={{ transform: q.rot }}>
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                      {q.open ? (
                        <>
                          <p style={{ margin: "0", padding: "12px 18px 6px", fontSize: "12px", lineHeight: "1.8", color: "#8B8D96" }}>
                            {q.a}
                          </p>
                        </>
                      ) : null}
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div className="card" style={{ marginTop: "8px", position: "relative", overflow: "hidden", padding: "44px 34px", borderRadius: "12px" }}>
                <svg aria-hidden="true" viewBox="0 0 120 200" width="120" height="200" style={{ position: "absolute", right: "10px", top: "-10px", opacity: ".15" }}>
                  <path d="M60 200 C60 140 62 80 70 10" stroke="#E11D3A" strokeWidth="3" fill="none" />
                  <ellipse cx="44" cy="40" rx="22" ry="10" fill="#E11D3A" transform="rotate(-35 44 40)" />
                  <ellipse cx="88" cy="60" rx="22" ry="10" fill="#E11D3A" transform="rotate(30 88 60)" />
                  <ellipse cx="40" cy="90" rx="24" ry="11" fill="#E11D3A" transform="rotate(-30 40 90)" />
                  <ellipse cx="88" cy="112" rx="24" ry="11" fill="#E11D3A" transform="rotate(30 88 112)" />
                  <ellipse cx="38" cy="142" rx="24" ry="11" fill="#E11D3A" transform="rotate(-30 38 142)" />
                </svg>
                <h3 style={{ margin: "0 0 12px", fontSize: "24px", fontWeight: "700", letterSpacing: "-.02em" }}>
                  Mau jadi{" "}
                  <span className="red">
                    reseller?
                  </span>
                </h3>
                <p className="sub" style={{ fontSize: "12px", marginBottom: "22px" }}>
                  Mulai jual layanan SMM dengan brand kamu sendiri bersama SosmedGo.
                </p>
                <a className="btn-o" href="#">
                  Lihat Program Reseller{" "}
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#2A0E14", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
        <section style={{ padding: "30px 0 70px" }}>
          <div className="wrap" style={{ maxWidth: "860px" }}>
            <div className="card" style={{ position: "relative", overflow: "hidden", padding: "70px 0 40px", borderRadius: "20px" }}>
              <div aria-hidden="true" className="ls-deco" style={{ position: "absolute", left: "50%", top: "50%", width: "760px", height: "760px", margin: "-380px 0 0 -380px", borderRadius: "50%", border: "70px solid rgba(225,29,58,.05)" }} />
              <div aria-hidden="true" className="ls-deco" style={{ position: "absolute", left: "50%", top: "50%", width: "460px", height: "460px", margin: "-230px 0 0 -230px", borderRadius: "50%", border: "60px solid rgba(225,29,58,.06)" }} />
              <div aria-hidden="true" className="card ls-deco" style={{ position: "absolute", left: "16px", top: "150px", display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px 8px 8px", borderRadius: "10px", background: "#17171B" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "6px", overflow: "hidden", flex: "none" }}><FictionalAvatar kind="curly" bg="#C9B6F2" size={24} /></span>
                <span style={{ fontSize: "10px", fontWeight: "600" }}>
                  Kamu dapat followers baru! 🎉
                </span>
              </div>
              <div aria-hidden="true" className="card ls-deco" style={{ position: "absolute", right: "-1px", top: "60px", width: "170px", padding: "14px", borderRadius: "12px 0 0 12px", background: "#17171B" }}>
                <div style={{ fontSize: "9px", color: "#FF5A75", display: "flex", justifyContent: "space-between" }}>
                  ▣ Toko Baju Saya{" "}
                  <span>
                    ↗
                  </span>
                </div>
                <div style={{ fontSize: "8px", color: "#8B8D96", margin: "10px 0 4px" }}>
                  Penjualan Bersih
                </div>
                <div style={{ fontSize: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                  Rp 10.000{" "}
                  <span style={{ fontSize: "7px", background: "#2A0E14", color: "#FF5A75", borderRadius: "999px", padding: "2px 6px" }}>
                    +10%
                  </span>
                </div>
              </div>
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px", padding: "0 24px" }}>
                <span className="badge">
                  <span className="badge-ic">
                    <svg width="13" height="13" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                      <circle cx="16" cy="16" r="12" stroke="#FF5A75" strokeWidth="3" />
                      <path d="M10.5 21V13l5.5 4.6 5.5-4.6v8" stroke="#FF5A75" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </span>
                  Panel SMM #1
                </span>
                <h2 className="h2" style={{ fontSize: "26px", lineHeight: "1.45" }}>
                  Mulai dengan{" "}
                  <span className="red">
                    SosmedGo
                  </span>
                  {" "}dan lejitkan
                  <br />
                  kehadiran online kamu!
                </h2>
                <p className="sub" style={{ fontSize: "11px" }}>
                  Kami panel SMM terdepan karena satu alasan. Ayo buktikan sendiri.
                </p>
                <Link className="btn-o" href="/login">
                  Gabung keluarga SosmedGo!{" "}
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#2A0E14", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2" aria-hidden="true">
                      <rect x="5" y="3" width="14" height="18" rx="2" />
                      <path d="M9 8h6M9 12h6" />
                    </svg>
                  </span>
                </Link>
              </div>
              <div style={{ position: "relative", marginTop: "60px", overflow: "hidden" }}>
                <div className="mq2" style={{ animationDuration: "30s" }}>
                  {(v.pills || []).map((p, $index) => (
                    <React.Fragment key={$index}>
                      <span style={{ display: "flex", alignItems: "center", gap: "8px", background: "#17171B", border: "1px solid #24242A", borderRadius: "999px", padding: "5px 6px 5px 6px", fontSize: "10px", fontWeight: "600", whiteSpace: "nowrap" }}>
                        <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#2A0E14", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="#FF5A75" aria-hidden="true">
                            <path d={p.icon} />
                          </svg>
                        </span>
                        {" "}{p.t}{" "}
                        <span style={{ background: "#2A0E14", color: "#FF5A75", borderRadius: "999px", padding: "4px 10px", fontSize: "9px" }}>
                          {p.tag}
                        </span>
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section style={{ padding: "0 0 60px" }}>
          <div className="wrap" style={{ maxWidth: "1060px" }}>
            <div className="ls-panel" style={{ background: "#0E0E11", borderRadius: "28px", padding: "0 100px 30px", position: "relative" }}>
              <div className="card" style={{ position: "relative", top: "-24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "10px 10px 10px 14px", borderRadius: "12px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "#8B8D96" }}>
                  <span className="feat-ic">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                      <path d="M4 20L20 4M14 4h6v6" />
                    </svg>
                  </span>
                  <span>Kami menghargai{" "}
                  <span style={{ color: "#E4E4E7" }}>
                    pelanggan
                  </span>
                  , dan mereka menghargai{" "}
                  <span style={{ color: "#E4E4E7" }}>
                    layanan kami
                  </span></span>
                </span>
                <Link className="btn" href="/register" style={{ borderRadius: "10px" }}>
                  Daftar{" "}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="10" cy="8" r="4" />
                    <path d="M3 21v-1a7 7 0 0 1 11-5.7M18 15v6M15 18h6" />
                  </svg>
                </Link>
              </div>
              <footer className="card" style={{ marginTop: "70px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "16px 18px", borderRadius: "12px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                  <a href="#top" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <img src="/icon.png" alt="" aria-hidden="true" width="20" height="20" style={{ borderRadius: "8px", display: "block" }} />
                    <span style={{ fontSize: "14px", fontWeight: "800" }}>
                      SosmedGo
                    </span>
                  </a>
                  <span style={{ fontSize: "10px", color: "#6B6E78" }}>
                    <span className="red">
                      © SOSMEDGO
                    </span>
                    {" "}Hak Cipta 2026. Semua hak dilindungi.
                  </span>
                </span>
                <a href="#" style={{ fontSize: "10px", color: "#FF5A75" }}>
                  Ketentuan Layanan
                </a>
              </footer>
            </div>
          </div>
        </section>
      </div>
      </>
    );
  }
}

export default LandingPage;
