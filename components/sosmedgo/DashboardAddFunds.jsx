import React from 'react';
import { FaIcon } from './dashboard-kit';

function DashboardAddFunds({ v }) {
  return v.is.addfunds ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginTop: "-80px" }}>
            <form className="card" style={{ width: "100%", maxWidth: "540px", padding: "20px", boxSizing: "border-box", position: "relative", zIndex: "2" }} onSubmit={v.payFunds}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                <span style={{ width: "34px", height: "34px", borderRadius: "9px", color: "var(--accent-l)", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800" }}>
                  Rp
                </span>
                <span style={{ fontSize: "15px", fontWeight: "700" }}>
                  Isi saldo
                </span>
                <button type="button" className="ibtn" onClick={v.openDHist} aria-label="Riwayat deposit" aria-haspopup="dialog" style={{ marginLeft: "auto", width: "34px", height: "34px" }}>
                  <FaIcon d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2" size={14} />
                </button>
              </div>
              <div role="group" aria-label="Nominal" style={{ display: "flex", gap: "4px", background: "var(--segbg)", border: "1px solid var(--b2)", borderRadius: "10px", padding: "4px", flexWrap: "wrap" }}>
                {(v.amts || []).map((a, $index) => (
                  <React.Fragment key={$index}>
                    <button type="button" className="seg" onClick={a.pick} aria-pressed={a.on} style={{ background: a.bg, color: a.fg }}>
                      {a.t}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              <label className="lbl" htmlFor="nominal">
                Nominal (Rp)
              </label>
              <input id="nominal" className="inp" type="number" inputMode="numeric" placeholder="Minimal Rp 10.000" value={v.amtVal} onChange={v.setAmt} style={{ borderColor: v.amtBc }} />
              {v.amtKurang ? <span className="lbl" style={{ color: "#FF5A75", marginTop: "6px", display: "block" }}>Nominal minimal Rp 10.000.</span> : null}
              <span className="lbl" id="lbl-met">
                Metode
              </span>
              <div style={{ position: "relative" }}>
                <button type="button" className="dd" aria-labelledby="lbl-met" aria-haspopup="listbox" aria-expanded={v.mOpen} onClick={v.toggleM} style={{ paddingLeft: "12px" }}>
                  {v.met.badge ? (
                    <>
                      <span className="idpill">
                        {v.met.badge}
                      </span>
                    </>
                  ) : null}
                  <span style={{ flex: "1" }}>
                    {v.met.t}
                  </span>
                  <FaIcon d="M6 9l6 6 6-6" size={14} style={{ color: "#C9CBD1" }} />
                </button>
                {v.mOpen ? (
                  <>
                    <div role="listbox" className="ddpanel">
                      {(v.mets || []).map((m, $index) => (
                        <React.Fragment key={$index}>
                          <button type="button" role="option" aria-selected={m.on} className="ddopt" onClick={m.pick} style={{ background: m.rowBg }}>
                            {m.t}
                            {m.badge ? (
                              <>
                                <span className="idpill" style={{ marginLeft: "auto" }}>
                                  {m.badge}
                                </span>
                              </>
                            ) : null}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
              <span className="lbl">
                Instruksi
              </span>
              <div style={{ fontSize: "12px", color: "var(--t2)", lineHeight: "1.9", textAlign: "center" }}>
                {v.met.info}
                <br />
                <span style={{ color: "var(--t4)" }}>
                  {v.bonusTxt}
                </span>
              </div>
              <button type="submit" className="submit" disabled={v.amtKurang || v.bayarBusy} style={{ width: "100%", marginTop: "18px", opacity: v.amtKurang || v.bayarBusy ? 0.5 : 1, cursor: v.amtKurang || v.bayarBusy ? "not-allowed" : "pointer" }}>
                <i className="fa-solid fa-credit-card" aria-hidden="true" style={{ fontSize: 15, width: 15, display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center' }} />
                {v.bayarBusy ? 'Memproses...' : 'Bayar ' + v.amtFmt}
              </button>
              {v.paid ? (
                <>
                  <div role="status" style={{ marginTop: "14px", fontSize: "12px", fontWeight: "600", color: "var(--gr)", background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.3)", borderRadius: "10px", padding: "12px 14px" }}>
                    <span style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
                  <span>✓ Permintaan deposit dibuat.</span>
                  {v.lastDep ? (
                    <span style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      <button type="button" onClick={v.cekBayar} style={{ display: "inline-flex", alignItems: "center", height: "32px", padding: "0 14px", borderRadius: "999px", border: "1px solid var(--r4)", background: "var(--r1)", color: "var(--rt)", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>Cek pembayaran</button>
                    </span>
                  ) : null}
                  {v.cekMsg ? (<span style={{ fontSize: "12px", fontWeight: "500" }}>{v.cekMsg}</span>) : null}
                </span>
                  </div>
                </>
              ) : null}
            </form>
            <div className="card" style={{ width: "100%", maxWidth: "540px", padding: "20px", boxSizing: "border-box" }}>
              <i className="fa-solid fa-circle-info" aria-hidden="true" style={{ color: "var(--accent-l)", fontSize: 20, width: 20, display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center' }} />
              <div style={{ fontSize: "16px", fontWeight: "700", margin: "10px 0 6px" }}>
                {v.bonusJudul}
              </div>
              <div style={{ fontSize: "12px", color: "var(--rt2)", lineHeight: "1.7" }}>
                {v.bonusDesk}
              </div>
            </div>
          </div>
        </>
  ) : null;
}

export default DashboardAddFunds;
