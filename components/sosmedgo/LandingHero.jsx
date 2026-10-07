import React from 'react';
import Link from 'next/link';

function LandingHero({ v }) {
  return (
    <>
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
    </>
  );
}

export default LandingHero;
