import React from 'react';
import { FaIcon } from './dashboard-kit';

function DashboardRefunds({ v }) {
  return v.is.refunds ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "-58px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
              <span className="chip">
                <span className="ocircle">
                  <FaIcon d="M3 5h18l-7 8v6l-4 2v-8z" size={12} style={{ color: "#FFFFFF" }} />
                </span>
                Semua
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "44px", border: "1px solid var(--b3)", background: "var(--s1)", borderRadius: "999px", padding: "0 4px 0 16px", minWidth: "240px" }}>
                <label htmlFor="r-cari" style={{ position: "absolute", left: "-9999px" }}>
                  Cari refund
                </label>
                <input id="r-cari" type="search" placeholder="Cari ID pesanan" value={v.rq} onChange={v.setRq} style={{ flex: "1", minWidth: "0", background: "transparent", border: "none", outline: "none", color: "var(--hi)", fontFamily: "inherit", fontSize: "12px" }} />
                <span className="ocircle" style={{ width: "34px", height: "34px" }}>
                  <i className="fa-solid fa-magnifying-glass" aria-hidden="true" style={{ color: "#FFFFFF", fontSize: 15, width: 15, display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center' }} />
                </span>
              </div>
            </div>
            {(v.refunds || []).map((r, $index) => (
              <React.Fragment key={$index}>
                <div className="card" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px", padding: "14px 14px 14px 16px", borderRadius: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--rt)" }}>
                    {r.id}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: "600" }}>
                    ▢ {r.date}
                  </span>
                  <span style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
                    <span className="pill" style={{ background: "var(--r1)", color: "var(--rt)", border: "1px solid var(--r4)" }}>
                      + {r.amt}
                    </span>
                    {r.ajukan ? (
                      <button type="button" className="pill" onClick={r.ajukanFn} style={{ background: "var(--rt)", color: "#FFFFFF", border: "none", cursor: "pointer" }}>
                        Ajukan refund
                      </button>
                    ) : null}
                    <span className="pill" style={{ background: r.statusBg, color: r.statusFg }}>
                      {r.statusTxt}
                    </span>
                  </span>
                </div>
              </React.Fragment>
            ))}
            {v.rEmpty ? (
              <>
                <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--t5)", fontSize: "13px" }}>
                  Belum ada refund.
                </div>
              </>
            ) : null}
          </div>
        </>
  ) : null;
}

export default DashboardRefunds;
