import React from 'react';
import { FictionalAvatar } from './FictionalAvatar';

function LandingSosial({ v, state }) {
  return (
    <>
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
        {state.stat ? state.stat.pengguna.toLocaleString('id-ID') + ' pengguna terdaftar' : 'Diproses otomatis 24 jam'}
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
    </>
  );
}

export default LandingSosial;
