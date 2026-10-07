import React from 'react';
import Link from 'next/link';
import { FictionalAvatar } from './FictionalAvatar';

function LandingTrustLayanan({ v }) {
  return (
    <>
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
    </>
  );
}

export default LandingTrustLayanan;
