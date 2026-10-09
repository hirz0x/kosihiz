import React from 'react';
import { FaIcon } from './dashboard-kit';

function DashboardTicketDetail({ v }) {
  return v.is.ticket ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", margin: "-34px -40px -60px", minHeight: "calc(100vh - 80px)" }}>
            <div style={{ padding: "20px 40px", borderBottom: "1px solid var(--b1)" }}>
              <button type="button" onClick={v.goTicketsBack} style={{ background: "none", border: "none", padding: "0", cursor: "pointer", fontFamily: "inherit", fontSize: "11px", color: "var(--t5)" }}>
                ← {v.tr.ticket}: #{v.vt.id}
              </button>
              <h1 style={{ margin: "6px 0 0", fontSize: "18px", fontWeight: "700" }}>
                {v.vt.title}
              </h1>
            </div>
            <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "30px 24px 24px" }}>
              <div style={{ width: "100%", maxWidth: "520px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "22px" }}>
                {(v.vt.msgs || []).map((m, $index) => (
                  <React.Fragment key={$index}>
                    <div>
                      {m.mine ? (
                        <>
                          <div style={{ marginLeft: "auto", maxWidth: "440px", background: "var(--s1)", border: "1px solid var(--b3)", borderRadius: "14px", overflow: "hidden" }}>
                            {m.first ? (
                              <>
                                <div style={{ padding: "14px 16px 12px", fontSize: "12px", fontWeight: "700", lineHeight: "1.6", borderBottom: "1px solid var(--b3)" }}>
                                  {v.vt.title}
                                  {v.vt.orderId ? (
                                    <>
                                      <br />
                                      {v.tr.orderId}:{" "}
                                      <span style={{ fontWeight: "500" }}>
                                        {v.vt.orderId}
                                      </span>
                                    </>
                                  ) : null}
                                </div>
                              </>
                            ) : null}
                            <div style={{ padding: "12px 16px", fontSize: "12px", lineHeight: "1.7", whiteSpace: "pre-line" }}>
                              {m.text}{m.lampiran ? (m.lampiran.tipe === 'application/pdf' ? <a href={m.lampiran.data} download={m.lampiran.nama} style={{ display: 'block', marginTop: '8px', color: '#FF5A75', fontWeight: 600 }}>📄 {m.lampiran.nama}</a> : <img src={m.lampiran.data} alt={m.lampiran.nama} style={{ display: 'block', marginTop: '8px', maxWidth: '100%', borderRadius: '10px' }} />) : null}
                            </div>
                            <div style={{ padding: "10px 16px", borderTop: "1px solid var(--b2)", fontSize: "11px", color: "var(--rt)" }}>
                              {v.uname} - {m.time}
                            </div>
                          </div>
                        </>
                      ) : null}
                      {m.support ? (
                        <>
                          <div style={{ display: "flex", gap: "12px", maxWidth: "470px" }}>
                            <span style={{ width: "30px", height: "30px", flex: "none", borderRadius: "50%", background: "var(--accent)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800" }}>
                              {m.sInisial}
                            </span>
                            <div style={{ fontSize: "12px", lineHeight: "1.9", whiteSpace: "pre-line" }}>
                              {m.text}{m.lampiran ? (m.lampiran.tipe === 'application/pdf' ? <a href={m.lampiran.data} download={m.lampiran.nama} style={{ display: 'block', marginTop: '8px', color: '#FF5A75', fontWeight: 600 }}>📄 {m.lampiran.nama}</a> : <img src={m.lampiran.data} alt={m.lampiran.nama} style={{ display: 'block', marginTop: '8px', maxWidth: '100%', borderRadius: '10px' }} />) : null}
                              <div style={{ marginTop: "8px", fontSize: "11px", color: "var(--rt)" }}>
                                {m.sNama} - {m.time}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </React.Fragment>
                ))}
                {v.vtClosed ? (
                  <>
                    <div style={{ textAlign: "center", fontSize: "11px", color: "var(--t5)" }}>
                      {v.tr.waitReply}
                    </div>
                  </>
                ) : null}
                <form onSubmit={v.sendReply} style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid var(--b3)", background: "var(--s1)", borderRadius: "14px", padding: "6px 6px 6px 16px" }}>
                  <label htmlFor="reply" style={{ position: "absolute", left: "-9999px" }}>
                    {v.tr.message}
                  </label>
                  <input id="reply" type="text" placeholder={v.tr.message} value={v.replyTxt} onChange={v.setReply} style={{ flex: "1", minWidth: "0", background: "transparent", border: "none", outline: "none", color: "var(--hi)", fontFamily: "inherit", fontSize: "12px", height: "36px" }} />
                  <button type="submit" aria-label={v.tr.send} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "none", background: "var(--accent)", color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FaIcon d="M21 3L3 10l7 3 3 7z" size={15} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
  ) : null;
}

export default DashboardTicketDetail;
