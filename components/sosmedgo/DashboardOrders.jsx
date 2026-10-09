import React from 'react';
import { FaIcon } from './dashboard-kit';

function DashboardOrders({ v }) {
  return v.is.orders ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "-58px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
              <div style={{ position: "relative" }}>
                <button type="button" className="chip" onClick={v.toggleOF} aria-haspopup="listbox" aria-expanded={v.ofOpen}>
                  <span className="ocircle">
                    <FaIcon d="M3 5h18l-7 8v6l-4 2v-8z" size={12} style={{ color: "#FFFFFF" }} />
                  </span>
                  {v.ofLabel}
                  <FaIcon d="M6 9l6 6 6-6" size={12} />
                </button>
                {v.ofOpen ? (
                  <>
                    <div role="listbox" className="ddpanel" style={{ width: "200px", right: "auto" }}>
                      {(v.ofOpts || []).map((c, $index) => (
                        <React.Fragment key={$index}>
                          <button type="button" role="option" aria-selected={c.on} className="ddopt" onClick={c.pick} style={{ background: c.rowBg }}>
                            {c.t}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "44px", border: "1px solid var(--b3)", background: "var(--s1)", borderRadius: "999px", padding: "0 4px 0 16px", minWidth: "240px" }}>
                <label htmlFor="o-cari" style={{ position: "absolute", left: "-9999px" }}>
                  Cari pesanan
                </label>
                <input id="o-cari" type="search" placeholder="Cari ID atau link" value={v.oq} onChange={v.setOq} style={{ flex: "1", minWidth: "0", background: "transparent", border: "none", outline: "none", color: "var(--hi)", fontFamily: "inherit", fontSize: "12px" }} />
                <span className="ocircle" style={{ width: "34px", height: "34px" }}>
                  <i className="fa-solid fa-magnifying-glass" aria-hidden="true" style={{ color: "#FFFFFF", fontSize: 15, width: 15, display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center' }} />
                </span>
              </div>
            </div>
            {(v.orders || []).map((o, $index) => (
              <React.Fragment key={$index}>
                <div className="card" style={{ borderRadius: "14px", overflow: "hidden" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", padding: "12px 12px 12px 14px", borderBottom: "1px solid var(--b2)" }}>
                    <span className="ddic" style={{ width: "32px", height: "32px", color: o.platColor, background: `rgba(${o.platRgb},.12)`, border: `1px solid rgba(${o.platRgb},.3)` }}>
                      <FaIcon d={o.icon} size={15} style={{ color: o.platColor }} />
                    </span>
                    <span className="idpill" style={{ background: "var(--accent)", color: "#FFFFFF", borderColor: "var(--accent)" }}>
                      ID: {o.id}
                    </span>
                    <span style={{ flex: "1", minWidth: "220px", fontSize: "13px", fontWeight: "600" }}>
                      {o.svcId} — {o.name}{" "}
                      <span style={{ color: "var(--t4)", fontWeight: "500", marginLeft: "10px" }}>
                        <FaIcon d="M3 5h18v16H3zM3 10h18M8 3v4M16 3v4" size={12} style={{ display: "inline-block", marginRight: "4px", verticalAlign: "-2px" }} />{o.date}
                      </span>
                    </span>
                    <span className="pill" style={{ background: /Selesai|Completed/i.test(o.sTxt) ? "#14532D" : /Batal|Cancel|Ditolak/i.test(o.sTxt) ? "#7F1D1D" : o.sBg, color: /Selesai|Completed/i.test(o.sTxt) ? "#F0FDF4" : /Batal|Cancel|Ditolak/i.test(o.sTxt) ? "#FEF2F2" : o.sFg, border: "none", fontWeight: "600", padding: "8px 16px", borderRadius: "999px", fontSize: "13px" }}>
                      {o.sTxt}
                    </span>
                    <button type="button" className="ibtn" aria-label="Laporkan masalah" onClick={v.goTickets}>
                      <FaIcon d="M12 3l10 18H2zM12 10v4M12 17h.01" size={15} />
                    </button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", padding: "10px 12px 10px 14px" }}>
                    <span className="pill" style={{ border: "1px solid var(--b3)", paddingLeft: "4px" }}>
                      <span className="ocircle">
                        <FaIcon d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" size={11} />
                      </span>
                      <span style={{ maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {o.link}
                      </span>
                    </span>
                    <span className="pill" style={{ border: "1px solid var(--b3)", paddingLeft: "4px" }}>
                      <span className="ocircle" style={{ fontSize: "9px", fontWeight: "800" }}>
                        Rp
                      </span>
                      Biaya: {o.charge}
                    </span>
                    <span className="pill" style={{ border: "1px solid var(--b3)", paddingLeft: "4px" }}>
                      <span className="ocircle">
                        #
                      </span>
                      Jumlah: {o.qtyTxt}
                    </span>
                    <span className="pill" style={{ border: "1px solid var(--b3)", paddingLeft: "4px" }}>
                      <span className="ocircle">
                        ↕
                      </span>
                      Start count: {o.startC}
                    </span>
                    <span className="pill" style={{ border: "1px solid var(--b3)", paddingLeft: "4px" }}>
                      <span className="ocircle">
                        ⌛
                      </span>
                      Sisa: {o.remains}
                    </span>
                    <span style={{ marginLeft: "auto" }}>
                      {o.canCancel ? (
                        <>
                          <button type="button" className="ghost" onClick={o.cancel}>
                            Batalkan ✕
                          </button>
                        </>
                      ) : null}
                      {o.canRefill ? (
                        <>
                          <button type="button" className="ghost" onClick={o.refill}>
                            ↻ {o.refillTxt}
                          </button>
                        </>
                      ) : null}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            ))}
            {v.oEmpty ? (
              <>
                <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--t5)", fontSize: "13px" }}>
                  Tidak ada pesanan.
                </div>
              </>
            ) : null}
          </div>
        </>
  ) : null;
}

export default DashboardOrders;
