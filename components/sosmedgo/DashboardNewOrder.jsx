import React from 'react';
import { FaIcon } from './dashboard-kit';

function DashboardNewOrder({ v }) {
  return v.is.neworder ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div>
              <h1 style={{ margin: "0", fontSize: "26px", fontWeight: "700", letterSpacing: "-.02em" }}>
                {v.tr.welcome}{" "}
                <span style={{ color: "var(--accent)" }}>
                  {v.uname}
                </span>
                {" "}👋
              </h1>
              <p style={{ margin: "8px 0 0", fontSize: "12px", color: "var(--t4)" }}>
                {v.tr.welcomeSub}
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "14px" }}>
              {(v.stats || []).map((s, $index) => (
                <React.Fragment key={$index}>
                  <div className="card" style={{ padding: "16px 14px 12px", display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ width: "42px", height: "42px", borderRadius: "10px", background: s.tint, border: `1px solid ${s.line}`, color: s.c, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className={s.fa} aria-hidden="true" style={{ fontSize: "18px" }} />
                      </span>
                      <div>
                        <div style={{ fontSize: "11px", color: "var(--t4)" }}>
                          {s.l}
                        </div>
                        <div style={{ fontSize: "21px", fontWeight: "700", marginTop: "3px", letterSpacing: "-.02em" }}>
                          {s.v}
                        </div>
                      </div>
                    </div>
                    <button type="button" onClick={s.go} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", fontWeight: "600", color: s.c, background: s.tint, border: `1px solid ${s.line}`, borderRadius: "8px", padding: "10px 12px", cursor: "pointer" }}>
                      {s.a}
                      <span>
                        →
                      </span>
                    </button>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div role="group" aria-label="Filter platform" className="plat-grid" style={{ "--plat-cols": v.platCols }}>
              {(v.plats || []).map((p, $index) => (
                <React.Fragment key={$index}>
                  <button type="button" className="ptab" onClick={p.pick} aria-pressed={p.on} style={{ background: p.bg, borderColor: p.bc, color: p.fg }}>
                    <FaIcon d={p.icon} size={18} style={{ flex: "none" }} />
                    {p.n}
                  </button>
                </React.Fragment>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-start" }}>
              <form className="card" style={{ flex: "1 1 440px", minWidth: "0", padding: "20px" }} onSubmit={v.submitOrder}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ width: "34px", height: "34px", borderRadius: "9px", color: "var(--accent-l)", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fa-solid fa-square-check" aria-hidden="true" style={{ color: "var(--accent-l)", fontSize: 15, width: 15, display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center' }} />
                  </span>
                  <span style={{ fontSize: "15px", fontWeight: "700" }}>
                    {v.tr.place}
                  </span>
                </div>
                <div role="tablist" style={{ display: "flex", gap: "4px", background: "var(--segbg)", border: "1px solid var(--b2)", borderRadius: "10px", padding: "4px" }}>
                  {(v.otabs || []).map((o, $index) => (
                    <React.Fragment key={$index}>
                      <button type="button" role="tab" className="seg" onClick={o.pick} aria-selected={o.on} style={{ flex: "0 0 auto", background: o.bg, color: o.fg, boxShadow: o.sh }}>
                        {o.t}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
                {v.isNew ? (
                  <>
                    <div>
                      <span className="lbl" id="lbl-kat">
                        {v.tr.category}
                      </span>
                      <div style={{ position: "relative" }}>
                        <button type="button" className="dd" aria-labelledby="lbl-kat" aria-haspopup="listbox" aria-expanded={v.catOpen} onClick={v.toggleCat} style={{ borderColor: v.catBc }}>
                          <span className="ddic" style={{ background: v.cat.bg }}>
                            <FaIcon d={v.cat.icon} size={13} style={{ color: "#FFFFFF" }} />
                          </span>
                          <span style={{ flex: "1", minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {v.cat.t}
                          </span>
                          <FaIcon d="M6 9l6 6 6-6" size={14} style={{ color: "#C9CBD1" }} />
                        </button>
                        {v.catOpen ? (
                          <>
                            <div role="listbox" className="ddpanel">
                              {(v.catOpts || []).map((c, $index) => (
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
                      <span className="lbl" id="lbl-svc">
                        {v.tr.service}
                      </span>
                      <div style={{ position: "relative" }}>
                        <button type="button" className="dd" aria-labelledby="lbl-svc" aria-haspopup="listbox" aria-expanded={v.svcOpen} onClick={v.toggleSvc} style={{ borderColor: v.svcBc }}>
                          <span className="idpill" style={{ marginLeft: "4px" }}>
                            {v.svc.id}
                          </span>
                          <span style={{ flex: "1", minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {v.svc.name} — {v.svc.priceTxt}
                          </span>
                          <FaIcon d="M6 9l6 6 6-6" size={14} style={{ color: "#C9CBD1" }} />
                        </button>
                        {v.svcOpen ? (
                          <>
                            <div role="listbox" className="ddpanel">
                              {(v.svcOpts || []).map((o, $index) => (
                                <React.Fragment key={$index}>
                                  <button type="button" role="option" aria-selected={o.on} className="ddopt" onClick={o.pick} style={{ background: o.rowBg }}>
                                    <span className="idpill">
                                      {o.id}
                                    </span>
                                    <span style={{ flex: "1", minWidth: "0" }}>
                                      {o.name} —{" "}
                                      <span style={{ color: "var(--rt)" }}>
                                        {o.priceTxt}
                                      </span>
                                    </span>
                                  </button>
                                </React.Fragment>
                              ))}
                            </div>
                          </>
                        ) : null}
                      </div>
                      <label className="lbl" htmlFor="link">
                        Link
                      </label>
                      <input id="link" className="inp" type="url" placeholder={v.linkPh} value={v.link} onChange={v.setLink} />
                      <label className="lbl" htmlFor="jumlah">
                        {v.tr.qty}
                      </label>
                      <input id="jumlah" className="inp" type="number" inputMode="numeric" value={v.qty} onChange={v.setQty} />
                      <div style={{ fontSize: "10px", color: v.qtyColor, marginTop: "6px" }}>
                        {v.qtyHint}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px" }}>
                        <div style={{ flex: "1 1 200px", display: "flex", alignItems: "center", gap: "10px", height: "48px", boxSizing: "border-box", padding: "0 14px 0 8px", border: "1px solid var(--b3)", borderRadius: "10px", background: "var(--s0)" }}>
                          <span className="ddic" style={{ background: "var(--r1)", border: "1px solid var(--r4)" }}>
                            <i className="fa-solid fa-square-check" aria-hidden="true" style={{ color: "var(--accent-l)", fontSize: 13, width: 13, display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center' }} />
                          </span>
                          <span style={{ fontSize: "13px", fontWeight: "600" }}>
                            {v.tr.subtotal}
                          </span>
                          <span style={{ marginLeft: "auto", fontSize: "14px", fontWeight: "700", color: "var(--rt)" }}>
                            {v.subtotal}
                          </span>
                        </div>
                        <button type="submit" className="submit" disabled={v.sending} style={{ flex: "1 1 220px", opacity: v.sending ? 0.6 : 1, cursor: v.sending ? "not-allowed" : "pointer" }}>
                          {v.sending ? v.tr.memproses : v.tr.submit}{" "}
                          <FaIcon d="M5 12h14M13 6l6 6-6 6" size={14} />
                        </button>
                      </div>
                      {v.sent ? (
                        <>
                          <div role="status" style={{ marginTop: "14px", fontSize: "12px", fontWeight: "600", color: v.sentFg, background: v.sentBg, border: "1px solid " + v.sentBc, borderRadius: "10px", padding: "12px 14px" }}>
                            {v.sentMsg}
                          </div>
                        </>
                      ) : null}
                    </div>
                  </>
                ) : null}
                {v.isSearch ? (
                  <>
                    <div>
                      <label className="lbl" htmlFor="cari">
                        Cari layanan
                      </label>
                      <input id="cari" className="inp" type="search" placeholder="Contoh: followers indonesia" value={v.q} onChange={v.setQ} />
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "14px" }}>
                        {(v.found || []).map((f, $index) => (
                          <React.Fragment key={$index}>
                            <button type="button" onClick={f.pick} style={{ textAlign: "left", background: "var(--s0)", border: "1px solid var(--b3)", borderRadius: "10px", padding: "12px 14px", color: "var(--t1)", fontSize: "12px", cursor: "pointer", display: "flex", gap: "10px", alignItems: "center" }}>
                              <span className="idpill">
                                {f.id}
                              </span>
                              {f.name}
                              <span style={{ marginLeft: "auto", color: "var(--rt)", fontWeight: "700" }}>
                                {f.priceTxt}
                              </span>
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
                {v.isMass ? (
                  <>
                    <div>
                      <label className="lbl" htmlFor="massal">
                        Satu pesanan per baris: id_layanan | link | jumlah
                      </label>
                      <textarea id="massal" className="inp" rows="8" style={{ height: "auto", padding: "14px", resize: "vertical", fontFamily: "ui-monospace,Menlo,monospace", fontSize: "12px", lineHeight: "1.7" }} placeholder={"101 | https://instagram.com/akun1 | 1000\n301 | https://tiktok.com/@akun2 | 500"} />
                      <button type="button" className="submit" style={{ width: "100%", marginTop: "16px" }}>
                        Kirim Pesanan Massal
                      </button>
                    </div>
                  </>
                ) : null}
              </form>
              <section aria-label="Detail layanan" className="card" style={{ flex: "1 1 400px", minWidth: "0", overflow: "hidden" }}>
                {v.hasSvc ? (
                  <>
                    <div>
                      <div className="dethead" style={{ padding: "24px", textAlign: "center", background: "linear-gradient(160deg,var(--g2),var(--r1) 70%)", borderBottom: "1px solid var(--r6)" }}>
                        <span style={{ width: "42px", height: "42px", margin: "0 auto 12px", borderRadius: "12px", color: v.svc.platColor, background: `rgba(${v.svc.platRgb},.12)`, border: `1px solid rgba(${v.svc.platRgb},.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <FaIcon d={v.svc.icon} size={18} style={{ color: v.svc.platColor }} />
                        </span>
                        <div style={{ fontSize: "14px", fontWeight: "600", lineHeight: "1.5" }}>
                          {v.svc.id} — {v.svc.name} — {v.svc.priceTxt}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 16px", marginTop: "10px", fontSize: "11px", color: "var(--t3)" }}>
                          <span>
                            • {v.tr.svcId}: {v.svc.id}
                          </span>
                          <span>
                            • {v.tr.start}: {v.svc.start}
                          </span>
                          <span style={{ color: "var(--rt)" }}>
                            • {v.tr.trusted}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", borderBottom: "1px solid var(--b2)" }}>
                        <div style={{ padding: "18px 10px", textAlign: "center" }}>
                          <FaIcon d="M3 12h4l3-8 4 16 3-8h4" size={18} style={{ color: "var(--gr)" }} />
                          <div style={{ fontSize: "12px", fontWeight: "600", marginTop: "8px" }}>
                            {v.tr.speed}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--t4)", marginTop: "3px" }}>
                            {v.svc.speed}
                          </div>
                        </div>
                        <div style={{ padding: "18px 10px", textAlign: "center", borderLeft: "1px solid var(--b2)", borderRight: "1px solid var(--b2)" }}>
                          <FaIcon d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4" size={18} style={{ color: "var(--am)" }} />
                          <div style={{ fontSize: "12px", fontWeight: "600", marginTop: "8px" }}>
                            {v.tr.minmax}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--t4)", marginTop: "3px" }}>
                            {v.svc.minTxt} — {v.svc.maxTxt}
                          </div>
                        </div>
                        <div style={{ padding: "18px 10px", textAlign: "center" }}>
                          <FaIcon d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" size={18} style={{ color: "var(--bl)" }} />
                          <div style={{ fontSize: "12px", fontWeight: "600", marginTop: "8px" }}>
                            {v.tr.guar}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--t4)", marginTop: "3px" }}>
                            {v.svc.refill}
                          </div>
                        </div>
                      </div>
                      <div style={{ padding: "18px 24px 24px" }}>
                        <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>
                          {v.tr.desc}
                        </div>
                        <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "7px", fontSize: "12px", color: "var(--t3)", lineHeight: "1.5" }}>
                          {(v.svc.desc || []).map((d, $index) => (
                            <React.Fragment key={$index}>
                              <li>
                                • {d}
                              </li>
                            </React.Fragment>
                          ))}
                        </ul>
                        <div style={{ marginTop: "16px", fontSize: "11px", color: "var(--t3)", lineHeight: "1.7" }}>
                          <b style={{ color: "var(--t1)" }}>
                            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" style={{ color: "var(--am)", marginRight: "6px" }} />{v.tr.notes}:
                          </b>
                          <br />
                          • {v.tr.n1}
                          <br />
                          • {v.tr.n2}
                          <br />
                          • {v.tr.n3}
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
                {v.noSvc ? (
                  <>
                    <div style={{ padding: "60px 24px", textAlign: "center", fontSize: "13px", color: "var(--t5)" }}>
                      Belum ada layanan untuk platform ini.
                    </div>
                  </>
                ) : null}
              </section>
            </div>
          </div>
        </>
  ) : null;
}

export default DashboardNewOrder;
