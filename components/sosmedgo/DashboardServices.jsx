import React from 'react';
import { FaIcon } from './dashboard-kit';

function DashboardServices({ v }) {
  return v.is.services ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "-58px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ position: "relative" }}>
                  <button type="button" className="chip" onClick={v.toggleSCat} aria-haspopup="listbox" aria-expanded={v.sCatOpen}>
                    <span className="ocircle">
                      <FaIcon d="M3 5h18l-7 8v6l-4 2v-8z" size={12} style={{ color: "#FFFFFF" }} />
                    </span>
                    {v.sCatLabel}
                    <FaIcon d="M6 9l6 6 6-6" size={12} />
                  </button>
                  {v.sCatOpen ? (
                    <>
                      <div role="listbox" className="ddpanel" style={{ width: "260px", right: "auto" }}>
                        {(v.sCatOpts || []).map((c, $index) => (
                          <React.Fragment key={$index}>
                            <button type="button" role="option" aria-selected={c.on} className="ddopt" onClick={c.pick} style={{ background: c.rowBg }}>
                              <span className="ddic" style={{ background: c.bg }}>
                                <FaIcon d={c.icon} size={13} style={{ color: "#FFFFFF" }} />
                              </span>
                              {c.t}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
                <button type="button" className="chip" onClick={v.openF} aria-haspopup="dialog">
                  <span className="ocircle">
                    <FaIcon d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" size={12} style={{ color: "#FFFFFF" }} />
                  </span>
                  Filter Lanjutan
                  {v.fCount ? (
                    <>
                      <span style={{ fontSize: "10px", fontWeight: "800", background: "var(--accent)", borderRadius: "999px", padding: "2px 7px" }}>
                        {v.fCount}
                      </span>
                    </>
                  ) : null}
                  <FaIcon d="M6 9l6 6 6-6" size={12} />
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "44px", border: "1px solid var(--b3)", background: "var(--s1)", borderRadius: "999px", padding: "0 4px 0 16px", minWidth: "240px" }}>
                <label htmlFor="s-cari" style={{ position: "absolute", left: "-9999px" }}>
                  Cari layanan
                </label>
                <input id="s-cari" type="search" placeholder="Cari layanan" value={v.sq} onChange={v.setSq} style={{ flex: "1", minWidth: "0", background: "transparent", border: "none", outline: "none", color: "var(--hi)", fontFamily: "inherit", fontSize: "12px" }} />
                <span className="ocircle" style={{ width: "34px", height: "34px" }}>
                  <i className="fa-solid fa-magnifying-glass" aria-hidden="true" style={{ color: "#FFFFFF", fontSize: 15, width: 15, display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center' }} />
                </span>
              </div>
            </div>
            {(v.sGroups || []).map((g, $index) => (
              <React.Fragment key={$index}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "10px" }}>
                  <div className="card" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderRadius: "12px" }}>
                    <span className="ddic" style={{ background: g.bg }}>
                      <FaIcon d={g.icon} size={13} style={{ color: "#FFFFFF" }} />
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: "700" }}>
                      {g.t}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--t5)", marginLeft: "auto" }}>
                      {g.count} layanan
                    </span>
                  </div>
                  {(g.items || []).map((s, $index) => (
                    <React.Fragment key={$index}>
                      <div className="card" style={{ borderRadius: "14px", overflow: "hidden" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", padding: "12px 12px 12px 14px", borderBottom: "1px solid var(--b2)" }}>
                          <span className="idpill" style={{ background: "var(--accent)", color: "#FFFFFF", borderColor: "var(--accent)" }}>
                            ID: {s.id}
                          </span>
                          <span style={{ flex: "1", minWidth: "200px", fontSize: "13px", fontWeight: "600" }}>
                            {s.name}
                          </span>
                          <span style={{ display: "flex", border: "1px solid var(--b3)", borderRadius: "8px", overflow: "hidden", fontSize: "12px", fontWeight: "700" }}>
                            <span style={{ padding: "9px 12px" }}>
                              ≈ Rp {s.priceFmt}
                            </span>
                            <span style={{ padding: "9px 12px", borderLeft: "1px solid var(--b3)", color: "var(--t3)" }}>
                              1000
                            </span>
                          </span>
                          <button type="button" className="ibtn" onClick={s.fav} aria-pressed={s.isFav} aria-label="Favorit" style={{ color: s.favC }}>
                            <FaIcon d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" size={16} />
                          </button>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", padding: "10px 12px 10px 14px" }}>
                          <span style={{ display: "inline-flex", border: "1px solid var(--b3)", borderRadius: "999px", fontSize: "11px", fontWeight: "600" }}>
                            <span style={{ padding: "7px 12px" }}>
                              ⌄ Min: {s.minTxt}
                            </span>
                            <span style={{ padding: "7px 12px", borderLeft: "1px solid var(--b3)" }}>
                              ⌃ Maks: {s.maxTxt}
                            </span>
                          </span>
                          <span className="pill" style={{ background: s.tBg, color: s.tFg }}>
                            ⏱ {s.start}
                          </span>
                          <span className="pill" style={{ background: s.rBg, color: s.rFg }}>
                            ↻ Refill: {s.refill}
                          </span>
                          <span style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                            <button type="button" className="ghost" onClick={s.toggleDesc} aria-expanded={s.descOpen}>
                              Deskripsi ▤
                            </button>
                            <button type="button" className="submit" onClick={s.buy} style={{ height: "40px", padding: "0 18px" }}>
                              Beli Sekarang
                            </button>
                          </span>
                        </div>
                        {s.descOpen ? (
                          <>
                            <ul style={{ margin: "0", padding: "12px 18px 16px 30px", borderTop: "1px solid var(--b2)", fontSize: "12px", color: "var(--t3)", lineHeight: "1.9" }}>
                              {(s.desc || []).map((d, $index) => (
                                <React.Fragment key={$index}>
                                  <li>
                                    {d}
                                  </li>
                                </React.Fragment>
                              ))}
                            </ul>
                          </>
                        ) : null}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </React.Fragment>
            ))}
            {v.sSisa > 0 ? (
              <div style={{ display: "flex", justifyContent: "center", paddingTop: "8px" }}>
                <button type="button" className="ghost" onClick={v.sMuatLebih} style={{ padding: "0 18px" }}>Tampilkan {Math.min(40, v.sSisa)} layanan lagi ({v.sSisa} tersisa)</button>
              </div>
            ) : null}
            {v.sEmpty ? (
              <>
                <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--t5)", fontSize: "13px" }}>
                  Layanan tidak ditemukan.
                </div>
              </>
            ) : null}
            {v.fOpen ? (
              <>
                <div style={{ position: "fixed", inset: "0", zIndex: "100", background: "rgba(5,5,7,.72)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px", overflow: "auto", boxSizing: "border-box" }}>
                  <div role="dialog" aria-modal="true" aria-labelledby="f-title" style={{ width: "100%", maxWidth: "460px", background: "var(--s1)", border: "1px solid var(--b4)", borderRadius: "16px", boxShadow: "0 40px 90px rgba(0,0,0,.7)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 18px", borderBottom: "1px solid var(--b2)" }}>
                      <span className="ddic" style={{ background: "var(--r1)", border: "1px solid var(--r4)" }}>
                        <FaIcon d="M3 5h18l-7 8v6l-4 2v-8z" size={13} style={{ color: "var(--accent-l)" }} />
                      </span>
                      <h2 id="f-title" style={{ margin: "0", fontSize: "14px", fontWeight: "700" }}>
                        Filter
                      </h2>
                      <button type="button" className="ibtn" onClick={v.closeF} aria-label="Tutup filter" style={{ marginLeft: "auto", width: "32px", height: "32px" }}>
                        ✕
                      </button>
                    </div>
                    <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--b2)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "700", marginBottom: "12px" }}>
                        <span className="ddic" style={{ background: "var(--r1)", border: "1px solid var(--r4)", color: "var(--rt)" }}>
                          ⌕
                        </span>
                        <label htmlFor="f-kw">
                          Kata kunci
                        </label>
                      </div>
                      <input id="f-kw" className="inp" type="search" placeholder="Cari" value={v.fd.kw} onChange={v.fSetKw} />
                    </div>
                    <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--b2)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "700", marginBottom: "12px" }}>
                        <span className="ddic" style={{ background: "var(--r1)", border: "1px solid var(--r4)", color: "var(--rt)", fontSize: "9px", fontWeight: "800" }}>
                          Rp
                        </span>
                        Rentang harga / 1K
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input className="inp" type="number" inputMode="numeric" placeholder="Min" aria-label="Harga minimal" value={v.fd.pmin} onChange={v.fSetMin} />
                        <input className="inp" type="number" inputMode="numeric" placeholder="Maks" aria-label="Harga maksimal" value={v.fd.pmax} onChange={v.fSetMax} />
                      </div>
                    </div>
                    {(v.fGroups || []).map((g, $index) => (
                      <React.Fragment key={$index}>
                        <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--b2)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "700", marginBottom: "12px" }}>
                            <span className="ddic" style={{ background: "var(--r1)", border: "1px solid var(--r4)" }}>
                              <FaIcon d={g.icon} size={13} style={{ color: "var(--accent-l)" }} />
                            </span>
                            {g.t}
                          </div>
                          <div role="group" aria-label={g.t} style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {(g.chips || []).map((c, $index) => (
                              <React.Fragment key={$index}>
                                <button type="button" onClick={c.toggle} aria-pressed={c.on} style={{ border: `1px solid ${c.bc}`, background: c.bg, color: c.fg, borderRadius: "999px", padding: "9px 14px", fontSize: "11px", fontWeight: "700", cursor: "pointer", minHeight: "36px" }}>
                                  {c.t}
                                </button>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                    <div style={{ display: "flex", gap: "10px", padding: "16px 18px" }}>
                      <button type="button" className="submit" onClick={v.applyF} style={{ flex: "1" }}>
                        Terapkan ✓
                      </button>
                      <button type="button" className="ghost" onClick={v.clearF} style={{ flex: "1", height: "48px", justifyContent: "center" }}>
                        Hapus Filter ↻
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </>
  ) : null;
}

export default DashboardServices;
