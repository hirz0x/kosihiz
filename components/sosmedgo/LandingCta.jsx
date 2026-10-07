import React from 'react';
import Link from 'next/link';
import { FictionalAvatar } from './FictionalAvatar';

function LandingCta({ v }) {
  return (
    <>
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
    </>
  );
}

export default LandingCta;
