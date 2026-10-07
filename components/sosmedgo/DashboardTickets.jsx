import React from 'react';
import { FaIcon } from './dashboard-kit';

function DashboardTickets({ v }) {
  return v.is.tickets ? (
        <>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "-80px" }}>
            <form className="card" style={{ width: "100%", maxWidth: "540px", padding: "20px", boxSizing: "border-box", position: "relative", zIndex: "2" }} onSubmit={v.sendTicket}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ width: "34px", height: "34px", borderRadius: "9px", color: "var(--accent-l)", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FaIcon d="M4 5h16v11H9l-5 4z" size={15} style={{ color: "var(--accent-l)" }} />
                </span>
                <span style={{ fontSize: "15px", fontWeight: "700" }}>
                  Tiket
                </span>
                <button type="button" className="ibtn" onClick={v.openTHist} aria-label="Riwayat tiket" aria-haspopup="dialog" style={{ marginLeft: "auto", width: "34px", height: "34px" }}>
                  <FaIcon d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2" size={14} />
                </button>
              </div>
              <span className="lbl">
                Kategori
              </span>
              <div role="group" aria-label="Kategori tiket" style={{ display: "flex", gap: "4px", background: "var(--segbg)", border: "1px solid var(--b2)", borderRadius: "10px", padding: "4px" }}>
                {(v.tcats || []).map((c, $index) => (
                  <React.Fragment key={$index}>
                    <button type="button" className="seg" onClick={c.pick} aria-pressed={c.on} style={{ background: c.bg, color: c.fg }}>
                      {c.t}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              <span className="lbl">
                Subkategori
              </span>
              <div role="group" aria-label="Subkategori tiket" style={{ display: "flex", gap: "4px", background: "var(--segbg)", border: "1px solid var(--b2)", borderRadius: "10px", padding: "4px", flexWrap: "wrap" }}>
                {(v.tsubs || []).map((c, $index) => (
                  <React.Fragment key={$index}>
                    <button type="button" className="seg" onClick={c.pick} aria-pressed={c.on} style={{ background: c.bg, color: c.fg }}>
                      {c.t}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              {v.tNeedsId ? (
                <>
                  <div>
                    <label className="lbl" htmlFor="t-id">
                      ID Pesanan
                    </label>
                    <input id="t-id" className="inp" type="text" placeholder="Contoh: 10234, 10235" value={v.tid} onChange={v.setTid} />
                  </div>
                </>
              ) : null}
              <label className="lbl" htmlFor="t-msg">
                Pesan
              </label>
              <textarea id="t-msg" className="inp" rows="6" style={{ height: "auto", padding: "14px", resize: "vertical" }} value={v.tmsg} onChange={v.setTmsg} />
              <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
                <label className="ghost" style={{ minWidth: "240px", justifyContent: "center", cursor: "pointer" }}>
                  📎 {v.tfile ? v.tfile.nama : "Lampirkan file"}
                  <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={v.pilihFile} style={{ display: "none" }} />
                </label>
                {v.tfile ? <button type="button" className="ghost" onClick={v.hapusFile} style={{ marginLeft: "8px" }}>Hapus</button> : null}
              </div>
              <button type="submit" className="submit" style={{ width: "100%", marginTop: "14px" }}>
                Kirim Tiket{" "}
                <FaIcon d="M21 3L3 10l7 3 3 7z" size={14} />
              </button>
              {v.tsent ? (
                <>
                  <div role="status" style={{ marginTop: "14px", fontSize: "12px", fontWeight: "600", color: "var(--gr)", background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.3)", borderRadius: "10px", padding: "12px 14px" }}>
                    ✓ Tiket terkirim. Admin akan membalas secepatnya.
                  </div>
                </>
              ) : null}
            </form>
          </div>
        </>
  ) : null;
}

export default DashboardTickets;
