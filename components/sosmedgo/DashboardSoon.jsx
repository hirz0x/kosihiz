import React from 'react';

function DashboardSoon({ v }) {
  return v.is.soon ? (
        <>
          <div className="card" style={{ padding: "60px 24px", textAlign: "center", marginTop: "-58px" }}>
            <div style={{ fontSize: "16px", fontWeight: "700" }}>
              Halaman ini belum dibuat di prototipe
            </div>
            <p style={{ margin: "8px 0 18px", fontSize: "13px", color: "var(--t4)" }}>
              Coba menu Pesanan Baru, Layanan, Pesanan, Isi Saldo, Tiket, Refund, Pesanan Massal, atau Afiliasi.
            </p>
            <button type="button" className="submit" onClick={v.goNew} style={{ display: "inline-flex", padding: "0 22px" }}>
              Ke Pesanan Baru
            </button>
          </div>
        </>
  ) : null;
}

export default DashboardSoon;
