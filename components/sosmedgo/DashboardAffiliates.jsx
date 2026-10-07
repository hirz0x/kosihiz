import React from 'react';

function DashboardAffiliates({ v }) {
  return v.is.affiliates ? (
        <>
          <div className="card aff-card" style={{ marginTop: "-58px", position: "relative", zIndex: "2", borderRadius: "18px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
              {(v.affStats || []).map((a, $index) => (
                <React.Fragment key={$index}>
                  <div style={{ padding: "26px 30px", borderBottom: "1px solid var(--b2)", borderRight: "1px solid var(--b2)" }}>
                    <div style={{ fontSize: "12px", color: "var(--t2)" }}>
                      {a.l}
                    </div>
                    <div style={{ fontSize: "22px", fontWeight: "700", marginTop: "10px", letterSpacing: "-.02em" }}>
                      {a.v}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: "12px", background: "var(--s0)", border: "1px solid var(--b3)", borderRadius: "12px", padding: "4px 16px 4px 4px" }}>
                <button type="button" className="ghost" onClick={v.copyRef} style={{ height: "38px" }}>
                  ⧉ {v.copyTxt}
                </button>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--rt)", wordBreak: "break-all" }}>
                  {v.refLink || (v.affGagal ? "Gagal memuat link. Muat ulang halaman." : "Memuat link...")}
                </span>
              </div>
              <p style={{ margin: "16px 0 0", fontSize: "12px", color: "var(--t4)", lineHeight: "1.7" }}>
                {v.afiliasiTxt}
              </p>
            </div>
            <div style={{ padding: "20px", borderTop: "1px solid var(--b2)" }}>
              <div style={{ fontSize: "14px", fontWeight: "700" }}>Pindahkan komisi ke saldo</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px" }}>
                <input type="number" inputMode="numeric" placeholder={"Jumlah (min " + v.minTarikTxt + ")"} value={v.wdJumlah} onChange={v.setWdJumlah} style={{ flex: "1 1 180px", minWidth: 0, height: "40px", padding: "0 12px", borderRadius: "10px", border: "1px solid var(--b3)", background: "var(--s0)", color: "var(--hi)", fontFamily: "inherit", fontSize: "16px" }} />
                <button type="button" className="ghost" onClick={v.tarikKomisi} disabled={v.wdBusy} style={{ height: "40px" }}>Pindahkan ke saldo</button>
              </div>
              <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {(v.wdList || []).map((p, idx) => (
                  <React.Fragment key={idx}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", fontSize: "13px" }}>
                      <span style={{ fontWeight: "600" }}>{p.jumlah}</span>
                      <span style={{ color: "var(--t3)" }}>{p.tujuan}</span>
                      <span style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ color: "var(--t4)", fontSize: "12px" }}>{p.tgl}</span>
                        <span className="pill" style={{ background: p.statusBg, color: p.statusFg }}>{p.statusTxt}</span>
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <div style={{ height: "1px", background: "var(--b2)", marginTop: "10px" }} />
        </>
  ) : null;
}

export default DashboardAffiliates;
