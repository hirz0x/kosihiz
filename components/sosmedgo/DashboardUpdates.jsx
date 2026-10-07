import React from 'react';
import { FaIcon } from './dashboard-kit';

function DashboardUpdates({ v }) {
  return v.is.updates ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "-58px" }}>
            <div role="group" aria-label="Filter update" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
              {(v.updFilters || []).map((f, $index) => (
                <React.Fragment key={$index}>
                  <button type="button" className="chip" onClick={f.pick} aria-pressed={f.on} style={{ padding: "0 16px", background: f.bg, color: f.fg, borderColor: f.bc }}>
                    {f.t}
                  </button>
                </React.Fragment>
              ))}
            </div>
            {(v.updPageDays || []).map((d, $index) => (
              <React.Fragment key={$index}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "700" }}>
                    <span className="ddic" style={{ width: "24px", height: "24px", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.3)", color: "var(--accent-l)", fontSize: "10px" }}>
                      ▦
                    </span>
                    {d.date}
                  </div>
                  {(d.items || []).map((u, $index) => (
                    <React.Fragment key={$index}>
                      <div className="card" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "12px" }}>
                        <span className="ddic" style={{ width: "30px", height: "30px", color: "var(--accent-l)", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.3)" }}>
                          <FaIcon d={u.icon} size={14} style={{ color: "var(--accent-l)" }} />
                        </span>
                        <span className="idpill">
                          {u.id}
                        </span>
                        <span style={{ flex: "1", minWidth: "220px", fontSize: "13px", fontWeight: "600" }}>
                          {u.name}
                        </span>
                        <span className="pill" style={{ background: u.bg, color: u.fg }}>
                          {u.msg}
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </React.Fragment>
            ))}
            {v.updEmpty ? (
              <>
                <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--t5)", fontSize: "13px" }}>
                  {v.tr.noUpd}
                </div>
              </>
            ) : null}
          </div>
        </>
  ) : null;
}

export default DashboardUpdates;
