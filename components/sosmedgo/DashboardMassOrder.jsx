import React from 'react';

function DashboardMassOrder({ v }) {
  return v.is.massorder ? (
        <>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "-80px" }}>
            <form className="card" style={{ width: "100%", maxWidth: "540px", padding: "20px", boxSizing: "border-box", position: "relative", zIndex: "2" }} onSubmit={v.sendMass}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ width: "34px", height: "34px", borderRadius: "9px", color: "var(--accent-l)", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fa-solid fa-square-check" aria-hidden="true" style={{ color: "var(--accent-l)", fontSize: 15, width: 15, display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center' }} />
                </span>
                <span style={{ fontSize: "15px", fontWeight: "700" }}>
                  Pesanan massal
                </span>
              </div>
              <label className="lbl" htmlFor="mass-txt">
                Satu pesanan per baris dengan format
              </label>
              <textarea id="mass-txt" className="inp" rows="12" placeholder="id_layanan | link | jumlah" value={v.massTxt} onChange={v.setMass} style={{ height: "auto", padding: "14px", resize: "vertical", fontFamily: "ui-monospace,Menlo,monospace", fontSize: "12px", lineHeight: "1.8" }} />
              <div style={{ fontSize: "11px", color: "var(--t5)", marginTop: "8px" }}>
                Contoh:{" "}
                <span style={{ color: "var(--rt)", fontFamily: "ui-monospace,Menlo,monospace" }}>
                  101 | https://instagram.com/akunkamu | 1000
                </span>
              </div>
              <button type="submit" className="submit" disabled={v.massBusy} style={{ width: "100%", marginTop: "16px", opacity: v.massBusy ? 0.6 : 1, cursor: v.massBusy ? "not-allowed" : "pointer" }}>
                {v.massBusy ? "Mengirim..." : "Kirim"}
              </button>
              {v.massRes ? (
                <>
                  <div role="status" style={{ marginTop: "14px", fontSize: "12px", lineHeight: "1.7", borderRadius: "10px", padding: "12px 14px", background: v.massBg, border: `1px solid ${v.massBc}`, color: v.massFg, whiteSpace: "pre-line" }}>
                    {v.massMsg}
                  </div>
                </>
              ) : null}
            </form>
          </div>
        </>
  ) : null;
}

export default DashboardMassOrder;
