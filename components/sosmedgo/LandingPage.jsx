import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

/* Dibuat dari desain canvas SosmedGo. Data di halaman ini masih contoh. */
import { FictionalAvatar } from './FictionalAvatar';
import LandingHero from './LandingHero';
import LandingTrustLayanan from './LandingTrustLayanan';
import LandingFitur from './LandingFitur';
import LandingSosial from './LandingSosial';
import LandingFaq from './LandingFaq';
import LandingCta from './LandingCta';

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
          <meta name="description" content="SosmedGo adalah panel SMM termurah di Indonesia untuk followers, likes, views, dan layanan social media marketing lainnya. Proses otomatis 24 jam, harga bersaing, dan API siap pakai untuk reseller." />
          <link rel="canonical" href="https://smmsosmedgo.store/" />
          <link rel="preconnect" href="https://api.fontshare.com" />
          <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'SosmedGo',
                url: 'https://smmsosmedgo.store/',
                logo: 'https://smmsosmedgo.store/icon.png',
                sameAs: []
              })
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'SosmedGo',
                url: 'https://smmsosmedgo.store/'
              })
            }}
          />
        </Head>
        <style jsx global>{`
html{color-scheme:dark}
.js-fade section{opacity:0;transform:translateY(18px);transition:opacity .7s ease-out,transform .7s ease-out}
.js-fade section.in{opacity:1;transform:none}
@media (prefers-reduced-motion: reduce){.js-fade section{opacity:1;transform:none;transition:none}}
body{margin:0;background:#0A0A0C;overflow-x:hidden;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
html{scroll-behavior:smooth}
a,button{transition:background-color .15s ease,border-color .15s ease,color .15s ease,box-shadow .15s ease,transform .15s cubic-bezier(.4,0,.2,1),opacity .15s ease;-webkit-tap-highlight-color:transparent}
button:active:not(:disabled){transform:scale(.97)}
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
.btn:hover{background:#C8102E;color:#FFFFFF;transform:translateY(-1px);box-shadow:0 12px 30px rgba(225,29,58,.45)}
.btn:active{transform:translateY(0) scale(.97);box-shadow:0 6px 16px rgba(225,29,58,.35)}
.btn-o{display:inline-flex;align-items:center;gap:8px;background:#121215;color:#FFFFFF;font-weight:600;font-size:13px;border-radius:999px;padding:11px 20px;border:1px solid #26262C}
.btn-o:hover{border-color:#E11D3A;color:#FFFFFF;transform:translateY(-1px)}
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
        <LandingHero v={v} />
        <LandingTrustLayanan v={v} />
        <LandingFitur v={v} state={this.state} />
        <LandingSosial v={v} state={this.state} />
        <LandingFaq v={v} />
        <LandingCta v={v} />
      </div>
      </>
    );
  }
}

export default LandingPage;
