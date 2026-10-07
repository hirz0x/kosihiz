import React from 'react';

function LandingFaq({ v }) {
  return (
    <>
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
    </>
  );
}

export default LandingFaq;
