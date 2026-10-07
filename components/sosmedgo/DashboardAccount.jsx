import React from 'react';
import { FaIcon } from './dashboard-kit';

function DashboardAccount({ v }) {
  return v.is.account ? (
        <>
          <div className="acc-bleed" style={{ display: "flex", flexWrap: "wrap", minHeight: "calc(100vh - 80px)" }}>
            <aside className="acc-aside" style={{ flex: "1 1 220px", maxWidth: "260px", minWidth: "0", borderRight: "1px solid var(--b1)", padding: "22px 20px", boxSizing: "border-box" }}>
              <div style={{ position: "relative", width: "52px", height: "52px", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "800", boxShadow: "0 0 0 3px var(--r3)" }}>
                {v.uinit}{" "}
                <span style={{ position: "absolute", right: "-2px", bottom: "-2px", width: "18px", height: "18px", borderRadius: "50%", background: "var(--s2)", border: "1px solid var(--b5)", fontSize: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  ✎
                </span>
              </div>
              <div style={{ fontSize: "18px", fontWeight: "700", marginTop: "16px" }}>
                {v.uname}
              </div>
              <div style={{ fontSize: "12px", color: "var(--rt)", marginTop: "4px" }}>
                {v.uemail}
              </div>
              <span className="pill" style={{ marginTop: "14px", background: v.isLight ? "#FFEDD5" : "#7A2E0B", color: v.isLight ? "#9A3412" : "#FED7AA" }}>
                <i className="fa-solid fa-trophy" aria-hidden="true" style={{ fontSize: "11px", marginRight: "6px" }} />
                {v.rankName}
              </span>
              <nav aria-label="Pengaturan akun" style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "26px" }}>
                {(v.atabs || []).map((t, $index) => (
                  <React.Fragment key={$index}>
                    <button type="button" className="atab" onClick={t.pick} aria-current={t.cur} style={{ background: t.bg, color: t.fg, borderColor: t.bc }}>
                      <FaIcon d={t.icon} size={15} />
                      {t.t}
                    </button>
                  </React.Fragment>
                ))}
              </nav>
            </aside>
            <div style={{ flex: "999 1 480px", minWidth: "0" }}>
              <div className="acc-head-pad" style={{ padding: "36px 50px", borderBottom: "1px solid var(--b1)" }}>
                <h1 style={{ margin: "0", fontSize: "22px", fontWeight: "700" }}>
                  {v.atab.t}
                </h1>
                <p style={{ margin: "8px 0 0", fontSize: "12px", color: "var(--rt)" }}>
                  {v.atab.sub}
                </p>
                {v.bannerTxt ? (
                  <p role="note" style={{ margin: "12px 0 0", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--b3)", background: "var(--s2)", fontSize: "12px", color: "var(--t3)", lineHeight: "1.6" }}>
                    {v.bannerTxt}
                  </p>
                ) : null}
              </div>
              {v.aIs.security ? (
                <>
                  <div>
                    <form className="acc-pad" style={{ padding: "30px 50px", borderBottom: "1px solid var(--b1)" }} onSubmit={v.savePw}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700" }}>
                        <span className="ddic" style={{ width: "34px", height: "34px", borderRadius: "9px", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.3)", color: "var(--accent-l)", fontSize: "14px" }}>
                          <i className="fa-solid fa-lock" aria-hidden="true" />
                        </span>
                        Ganti password
                      </div>
                      <label className="lbl" htmlFor="a-cur">
                        Password saat ini
                      </label>
                      <input id="a-cur" className="inp" type="password" autoComplete="current-password" value={v.pwF.cur} onChange={v.pwSet('cur')} />
                      <label className="lbl" htmlFor="a-new">
                        Password baru
                      </label>
                      <input id="a-new" className="inp" type="password" autoComplete="new-password" value={v.pwF.baru} onChange={v.pwSet('baru')} />
                      <label className="lbl" htmlFor="a-new2">
                        Konfirmasi password baru
                      </label>
                      <input id="a-new2" className="inp" type="password" autoComplete="new-password" value={v.pwF.baru2} onChange={v.pwSet('baru2')} />
                      <button type="submit" className="submit" style={{ width: "100%", marginTop: "18px" }}>
                        Ganti password
                      </button>
                      {v.pwSaved ? (
                        <>
                          <div role="status" style={{ marginTop: "12px", fontSize: "12px", fontWeight: "600", color: "var(--gr)" }}>
                            ✓ Password diperbarui.
                          </div>
                        </>
                      ) : null}
                    </form>
                    <form className="acc-pad" style={{ padding: "30px 50px" }} onSubmit={v.saveEmail}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700" }}>
                        <span className="ddic" style={{ width: "34px", height: "34px", borderRadius: "9px", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.3)", color: "var(--accent-l)", fontSize: "14px" }}>
                          <i className="fa-solid fa-envelope" aria-hidden="true" />
                        </span>
                        Ganti email
                      </div>
                      <label className="lbl" htmlFor="a-em">
                        Email saat ini
                      </label>
                      <input id="a-em" className="inp" type="email" value={v.uemail} readOnly style={{ color: "var(--t4)" }} />
                      <label className="lbl" htmlFor="a-em2">
                        Email baru
                      </label>
                      <input id="a-em2" className="inp" type="email" autoComplete="email" value={v.emF.baru} onChange={v.emSet('baru')} />
                      <label className="lbl" htmlFor="a-pw3">
                        Password saat ini
                      </label>
                      <input id="a-pw3" className="inp" type="password" autoComplete="current-password" value={v.emF.pw} onChange={v.emSet('pw')} />
                      <button type="submit" className="submit" style={{ width: "100%", marginTop: "18px" }}>
                        Ganti email
                      </button>
                      {v.emSaved ? (
                        <>
                          <div role="status" style={{ marginTop: "12px", fontSize: "12px", fontWeight: "600", color: "var(--gr)" }}>
                            ✓ Link verifikasi dikirim ke email baru.
                          </div>
                        </>
                      ) : null}
                    </form>
                  </div>
                </>
              ) : null}
              {v.aIs.twofa ? (
                <>
                  <div className="acc-pad" style={{ padding: "30px 50px", maxWidth: "760px", display: "flex", flexDirection: "column", gap: "18px" }}>
                    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ fontSize: "14px", fontWeight: "700" }}>Autentikasi dua langkah (2FA)</div>
                      <div style={{ fontSize: "12px", color: "var(--t4)", lineHeight: "1.6" }}>
                        Status: {v.mfa.aktif === null ? "Memuat..." : v.mfa.aktif ? "Aktif" : "Tidak aktif"}
                      </div>
                    </div>
                    {v.mfa.aktif === false && !v.mfa.setup ? (
                      <div>
                        <button type="button" className="submit" onClick={v.mfa.mulai} style={{ padding: "0 18px" }}>Aktifkan 2FA</button>
                      </div>
                    ) : null}
                    {v.mfa.setup ? (
                      <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ fontSize: "12px", color: "var(--t3)", lineHeight: "1.6" }}>Pindai QR ini dengan aplikasi authenticator, lalu masukkan 6 digit kodenya.</div>
                        <img src={"data:image/svg+xml;utf8," + encodeURIComponent(v.mfa.setup.qr)} alt="QR code 2FA" width="180" height="180" style={{ background: "#FFFFFF", borderRadius: "10px", padding: "8px", alignSelf: "flex-start" }} />
                        <div style={{ fontSize: "11px", color: "var(--t4)", wordBreak: "break-all" }}>Atau masukkan kunci ini manual: {v.mfa.setup.kunci}</div>
                        <label className="lbl" htmlFor="mfa-kode">Kode 6 digit</label>
                        <input id="mfa-kode" className="inp" inputMode="numeric" autoComplete="one-time-code" value={v.mfa.kode} onChange={v.mfa.setKode} style={{ height: "46px", fontSize: "16px", letterSpacing: ".3em" }} />
                        <div>
                          <button type="button" className="submit" onClick={v.mfa.konfirmasi} disabled={v.mfa.kode.length !== 6} style={{ padding: "0 18px" }}>Konfirmasi dan aktifkan</button>
                        </div>
                      </div>
                    ) : null}
                    {v.mfa.aktif === true ? (
                      <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ fontSize: "12px", color: "var(--t3)", lineHeight: "1.6" }}>Untuk menonaktifkan 2FA, masukkan kode 6 digit dari authenticator.</div>
                        <input id="mfa-kode-off" className="inp" inputMode="numeric" autoComplete="one-time-code" value={v.mfa.kode} onChange={v.mfa.setKode} style={{ height: "46px", fontSize: "16px", letterSpacing: ".3em" }} />
                        <div>
                          <button type="button" className="ghost" onClick={v.mfa.nonaktifkan} disabled={v.mfa.kode.length !== 6} style={{ padding: "0 18px" }}>Nonaktifkan 2FA</button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : null}
{v.aIs.ux ? (
                <>
                  <div className="acc-pad" style={{ padding: "30px 50px", maxWidth: "640px" }}>
                    <span className="lbl" style={{ marginTop: "0" }}>
                      Mode tema
                    </span>
                    <div className="ux-grid3">
                      {(v.themeOpts || []).map((o, $index) => (
                        <button key={$index} type="button" className="ux-card" aria-pressed={o.on} onClick={o.pick} style={{ borderColor: o.on ? "var(--accent)" : "var(--b3)" }}>
                          <span className="ux-prev" style={{ background: o.k === "light" ? "#FFFFFF" : o.k === "dark" ? "#0B0B0E" : "linear-gradient(90deg,#FFFFFF 50%,#0B0B0E 50%)" }}>
                            <span className="ux-side" style={{ background: o.k === "dark" ? "#16161A" : "#E6E8EC" }} />
                            <span className="ux-dot" style={{ background: "var(--accent)" }} />
                          </span>
                          <span className="ux-name">{o.t}</span>
                        </button>
                      ))}
                    </div>
                    <span className="lbl">
                      Warna tema
                    </span>
                    <div className="ux-grid5">
                      {(v.accentOpts || []).map((o, $index) => (
                        <button key={$index} type="button" className="ux-card" aria-pressed={o.on} onClick={o.pick} style={{ borderColor: o.on ? o.c : "var(--b3)" }}>
                          <span className="ux-prev" style={{ background: "var(--s2)" }}>
                            <span className="ux-bar" style={{ background: o.c }} />
                            <span className="ux-side" style={{ background: "#E6E8EC", top: "8px" }} />
                            <span className="ux-dot" style={{ background: o.c }} />
                          </span>
                          <span className="ux-name">{o.t}</span>
                        </button>
                      ))}
                    </div>
                    <span className="lbl">
                      Bahasa
                    </span>
                    <div style={{ display: "flex", gap: "4px", background: "var(--segbg)", border: "1px solid var(--b2)", borderRadius: "10px", padding: "4px" }}>
                      {(v.langs || []).map((c, $index) => (
                        <React.Fragment key={$index}>
                          <button type="button" className="seg" onClick={c.pick} aria-pressed={c.on} style={{ background: c.bg, color: c.fg }}>
                            {c.t}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                    <span className="lbl">
                      Mata uang tampilan
                    </span>
                    <div style={{ display: "flex", gap: "4px", background: "var(--segbg)", border: "1px solid var(--b2)", borderRadius: "10px", padding: "4px" }}>
                      {(v.curSeg || []).map((c, $index) => (
                        <React.Fragment key={$index}>
                          <button type="button" className="seg" onClick={c.pick} aria-pressed={c.on} style={{ background: c.bg, color: c.fg }}>
                            {c.t}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
              {v.aIs.tzapi ? (
                <>
                  <div className="acc-pad" style={{ padding: "30px 50px", maxWidth: "760px", display: "flex", flexDirection: "column", gap: "30px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700" }}>
                        <span className="ddic" style={{ width: "34px", height: "34px", borderRadius: "9px", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.3)", color: "var(--accent-l)" }}>
                          <i className="fa-solid fa-clock" aria-hidden="true" style={{ fontSize: "14px" }} />
                        </span>
                        Zona waktu
                      </div>
                      <label className="lbl" htmlFor="tz-select" style={{ margin: "0" }}>
                        Zona waktu tampilan
                      </label>
                      <select id="tz-select" className="inp" value={v.tzValue} onChange={v.setTz} style={{ height: "46px", cursor: "pointer" }}>
                        {(v.tzOpts || []).map((o, $index) => (
                          <option key={$index} value={o[0]}>{o[1]}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700" }}>
                        <span className="ddic" style={{ width: "34px", height: "34px", borderRadius: "9px", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.3)", color: "var(--accent-l)" }}>
                          <i className="fa-solid fa-key" aria-hidden="true" style={{ fontSize: "14px" }} />
                        </span>
                        API key
                      </div>
                      <label className="lbl" htmlFor="api-key" style={{ margin: "0" }}>
                        API key
                      </label>
                      <input id="api-key" className="inp" readOnly value={v.apiKey} aria-label="API key" style={{ height: "46px", fontFamily: "ui-monospace,Menlo,monospace", fontSize: "12px" }} />
                      <div style={{ fontSize: "11px", color: "var(--t4)" }}>{v.apiInfoTxt}</div>
                      <div>
                        <button type="button" className="submit" onClick={v.regenKey} style={{ padding: "0 18px" }}>
                          <i className="fa-solid fa-rotate" aria-hidden="true" style={{ fontSize: "12px" }} />
                          Buat ulang
                        </button>
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "11px", color: "var(--t4)" }}>
                        Buat pesanan dengan POST /api/v1/order dan header Authorization: Bearer API-KEY-KAMU. Jangan bagikan API key kamu.
                      </p>
                    </div>
                  </div>
                </>
              ) : null}
              {v.aIs.invoice ? (
                <>
                  <form className="acc-pad" style={{ padding: "30px 50px", maxWidth: "760px", display: "flex", flexDirection: "column", gap: "12px" }} onSubmit={v.saveInv}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700" }}>
                      <span className="ddic" style={{ width: "34px", height: "34px", borderRadius: "9px", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.3)", color: "var(--accent-l)" }}>
                        <i className="fa-solid fa-file-invoice" aria-hidden="true" style={{ fontSize: "14px" }} />
                      </span>
                      Detail invoice
                    </div>
                    <label className="lbl" htmlFor="i-det" style={{ margin: "0" }}>
                      Detail invoice
                    </label>
                    <textarea id="i-det" className="inp" rows="8" value={v.invText} onChange={v.setInvText} placeholder="Nama usaha, alamat, NPWP (opsional), atau catatan lain yang tampil di invoice" style={{ height: "auto", minHeight: "180px", padding: "14px", resize: "vertical", lineHeight: "1.6" }} />
                    <div>
                      <button type="submit" className="submit" style={{ padding: "0 22px" }}>
                        Simpan
                      </button>
                    </div>
                    {v.invSaved ? (
                      <>
                        <div role="status" style={{ marginTop: "4px", fontSize: "12px", fontWeight: "600", color: "var(--gr)" }}>
                          ✓ Tersimpan.
                        </div>
                      </>
                    ) : null}
                  </form>
                </>
              ) : null}
              {v.aIs.notif ? (
                <>
                  <div className="acc-pad" style={{ padding: "30px 50px", maxWidth: "640px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {(v.notifs || []).map((n, $index) => (
                      <React.Fragment key={$index}>
                        <div className="card" style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: "14px", borderRadius: "12px" }}>
                          <div style={{ flex: "1" }}>
                            <div style={{ fontSize: "13px", fontWeight: "600" }}>
                              {n.t}
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--t4)", marginTop: "4px" }}>
                              {n.d}
                            </div>
                          </div>
                          <button type="button" className="sw" role="switch" aria-checked={n.on} aria-label={n.t} onClick={n.toggle} style={{ background: n.bg }}>
                            <span style={{ left: n.left }} />
                          </button>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </>
  ) : null;
}

export default DashboardAccount;
