import React from 'react';
import { FictionalAvatar } from './FictionalAvatar';

function LandingFitur({ v, state }) {
  return (
    <>
  <section id="fitur" style={{ padding: "40px 0 90px" }}>
    <div className="wrap" style={{ maxWidth: "860px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px", marginBottom: "34px" }}>
        <span className="badge">
          <span className="badge-ic">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 20L20 4M14 4h6v6M5 9l2-2M9 5l1 1" />
            </svg>
          </span>
          Fitur Utama
        </span>
        <h2 className="h2">
          <span className="red">
            SosmedGo
          </span>
          {" "}selangkah lebih
          <br />
          maju dari kompetitor!
        </h2>
        <p className="sub" style={{ maxWidth: "360px" }}>
          Layanan SMM berkualitas dan fitur tambahan yang membuatmu unggul di dunia social media marketing!
        </p>
      </div>
      <div aria-hidden="true" className="ls-preview" style={{ position: "relative" }}>
        <div className="card" style={{ display: "flex", overflow: "hidden", minHeight: "560px", borderRadius: "16px" }}>
          <div style={{ width: "110px", flex: "none", borderRight: "1px solid #1F1F25", padding: "16px 10px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "14px" }}>
              <img src="/icon.png" alt="" aria-hidden="true" width="14" height="14" style={{ borderRadius: "8px", display: "block" }} />
              <span style={{ fontSize: "9px", fontWeight: "800" }}>
                SosmedGo
              </span>
            </div>
            <div className="mini" style={{ padding: "6px", fontSize: "7px", color: "#8B8D96", display: "flex", gap: "4px", alignItems: "center" }}>
              <span style={{ width: "14px", height: "14px", borderRadius: "4px", background: "#E11D3A", color: "#FFF", fontSize: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800" }}>
                SG
              </span>
              Akun Saya
            </div>
            <span style={{ background: "#E11D3A", borderRadius: "6px", padding: "6px 8px", fontSize: "7px", fontWeight: "600" }}>
              Pesanan Baru
            </span>
            <span style={{ padding: "4px 8px", fontSize: "7px", color: "#8B8D96" }}>
              Pesanan Saya
            </span>
            <span style={{ padding: "4px 8px", fontSize: "7px", color: "#8B8D96" }}>
              Layanan
            </span>
            <span style={{ padding: "4px 8px", fontSize: "7px", color: "#8B8D96" }}>
              Deposit
            </span>
            <span style={{ padding: "4px 8px", fontSize: "7px", color: "#8B8D96" }}>
              Tiket
            </span>
            <span style={{ marginTop: "auto", fontSize: "7px", color: "#4B4D56" }}>
              sosmedgo v2.0
            </span>
          </div>
          <div style={{ flex: "1", minWidth: "0", padding: "16px 22px", display: "flex", flexDirection: "column", gap: "14px", background: "linear-gradient(180deg,#14090C,#111114 30%)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "8px", color: "#6B6E78" }}>
                Beranda ›{" "}
                <span style={{ color: "#FF5A75" }}>
                  Pesanan Baru
                </span>
              </span>
              <span style={{ fontSize: "8px", color: "#C9CBD1", display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ background: "#2A0E14", color: "#FF5A75", borderRadius: "999px", padding: "3px 8px" }}>
                  Rp [SALDO]
                </span>
                <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#2A0E14" }} />
              </span>
            </div>
            <div style={{ marginTop: "14px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700" }}>
                Selamat datang di SosmedGo,{" "}
                <span className="red">
                  akunkamu
                </span>
                {" "}👋
              </div>
              <div style={{ fontSize: "7px", color: "#6B6E78", marginTop: "4px" }}>
                Kelola semua pesanan dan saldo kamu dari satu tempat.
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: "8px" }}>
              {(v.stats || []).map((s, $index) => (
                <React.Fragment key={$index}>
                  <div className="mini" style={{ padding: "10px 10px 0", overflow: "hidden" }}>
                    <div style={{ fontSize: "6px", color: "#6B6E78" }}>
                      {s.l}
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: "700", margin: "4px 0 8px" }}>
                      {s.v}
                    </div>
                    <div style={{ margin: "0 -10px", padding: "5px 10px", fontSize: "6px", fontWeight: "600", background: s.bg, color: s.fg }}>
                      {s.a} →
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="mini" style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "8px", fontWeight: "700" }}>
                  Buat pesanan
                </div>
                <div style={{ display: "flex", gap: "4px", background: "#1E1E23", borderRadius: "6px", padding: "3px", fontSize: "6px" }}>
                  <span style={{ background: "#2A2A30", borderRadius: "4px", padding: "4px 8px" }}>
                    Pesanan Baru
                  </span>
                  <span style={{ padding: "4px 8px", color: "#8B8D96" }}>
                    Cari
                  </span>
                  <span style={{ padding: "4px 8px", color: "#8B8D96" }}>
                    Pesanan Massal
                  </span>
                </div>
                <div style={{ fontSize: "6px", color: "#8B8D96" }}>
                  Pilih Kategori
                </div>
                <div style={{ border: "1px solid #E11D3A", borderRadius: "6px", padding: "6px", fontSize: "6px" }}>
                  Instagram Followers
                </div>
                <div style={{ fontSize: "6px", color: "#8B8D96" }}>
                  Pilih Layanan
                </div>
                <div style={{ background: "#1E1E23", borderRadius: "6px", padding: "6px", fontSize: "6px" }}>
                  {state.layanan ? state.layanan.nama + ' — Rp ' + state.layanan.hargaTxt + '/1000' : 'Layanan dari katalog kami'}
                </div>
                <div style={{ fontSize: "6px", color: "#8B8D96" }}>
                  Link
                </div>
                <div style={{ background: "#1E1E23", borderRadius: "6px", padding: "6px", fontSize: "6px", color: "#4B4D56" }}>
                  Masukkan link di sini
                </div>
                <div style={{ fontSize: "6px", color: "#8B8D96" }}>
                  Jumlah
                </div>
                <div style={{ background: "#1E1E23", borderRadius: "6px", padding: "6px", fontSize: "6px", color: "#4B4D56" }}>
                  Min: 100 — Maks: 50.000
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <span style={{ flex: "1", background: "#1E1E23", borderRadius: "6px", padding: "6px", fontSize: "6px", color: "#8B8D96" }}>
                    Subtotal: Rp {state.layanan ? state.layanan.hargaTxt : '—'}
                  </span>
                  <span style={{ flex: "1", background: "#E11D3A", borderRadius: "6px", padding: "6px", fontSize: "6px", textAlign: "center", fontWeight: "600" }}>
                    Kirim Pesanan
                  </span>
                </div>
              </div>
              <div className="mini" style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", textAlign: "center" }}>
                <span style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#E11D3A", marginTop: "8px" }} />
                <div style={{ fontSize: "7px", fontWeight: "600" }}>
                  Instagram — Followers Indonesia — Refill 30 Hari
                </div>
                <div style={{ fontSize: "6px", color: "#6B6E78" }}>
                  ID Layanan: {state.layanan ? state.layanan.id : '—'}{state.layanan && state.layanan.waktu ? ' · Dikirim dalam ±' + state.layanan.waktu + ' menit' : ''}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "6px", width: "100%", marginTop: "8px", fontSize: "6px" }}>
                  <span style={{ color: "#C9CBD1" }}>
                    ⏱
                    <br />
                    Waktu Proses
                  </span>
                  <span style={{ color: "#C9CBD1" }}>
                    ✓
                    <br />
                    Terpercaya
                  </span>
                  <span style={{ color: "#C9CBD1" }}>
                    🛡
                    <br />
                    Garansi
                  </span>
                </div>
                <div style={{ width: "100%", textAlign: "left", borderTop: "1px solid #24242A", paddingTop: "8px", marginTop: "8px", fontSize: "6px", color: "#8B8D96", lineHeight: "1.8" }}>
                  <b style={{ color: "#E4E4E7" }}>
                    Cara pesan?
                  </b>
                  <br />
                  • Masukkan link postingan
                  <br />
                  • Pilih jumlah pesanan
                  <br />
                  • Selesaikan pembelian
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card ls-deco" style={{ position: "absolute", left: "-50px", top: "170px", width: "170px", padding: "10px", boxShadow: "0 20px 50px rgba(0,0,0,.6)", borderRadius: "12px" }}>
          <div style={{ display: "flex", gap: "3px", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#FF5F57" }} />
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#FEBC2E" }} />
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#28C840" }} />
            <span style={{ fontSize: "6px", color: "#6B6E78", marginLeft: "6px" }}>
              sosmedgo.com/update
            </span>
          </div>
          <div style={{ fontSize: "10px", fontWeight: "700", marginBottom: "8px" }}>
            ✕ Update
          </div>
          {(v.igN || []).map((n, $index) => (
            <React.Fragment key={$index}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "7px" }}>
                <span style={{ width: "18px", height: "18px", borderRadius: "50%", overflow: "hidden", flex: "none" }}><FictionalAvatar kind={n.kind} bg={n.bg} size={18} /></span>
                <span style={{ fontSize: "6px", color: "#C9CBD1", flex: "1" }}>
                  <b style={{ color: "#FFF" }}>
                    {n.u}
                  </b>
                  <br />
                  mulai mengikutimu
                </span>
                <span className="follow" style={{ fontSize: "7px", padding: "4px 9px" }}>
                  Follow
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="card ls-deco" style={{ position: "absolute", right: "-50px", top: "200px", width: "150px", padding: "12px", boxShadow: "0 20px 50px rgba(0,0,0,.6)", borderRadius: "12px" }}>
          <div style={{ fontSize: "9px", fontWeight: "700", display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ width: "14px", height: "14px", borderRadius: "4px", background: "#2A0E14", border: "1px solid #E11D3A" }} />
            Instagram
          </div>
          <div style={{ fontSize: "7px", color: "#6B6E78", margin: "8px 0 4px" }}>
            Ringkasan Insight
          </div>
          <div style={{ fontSize: "18px", fontWeight: "700" }}>
            24,597+
          </div>
          <div style={{ fontSize: "7px", color: "#8B8D96", display: "flex", gap: "6px", alignItems: "center", marginTop: "4px" }}>
            Followers{" "}
            <span style={{ background: "rgba(34,197,94,.15)", color: "#22C55E", borderRadius: "999px", padding: "2px 6px", fontWeight: "700" }}>
              ↑ 58%
            </span>
          </div>
          <svg viewBox="0 0 130 50" width="100%" height="46" style={{ display: "block", marginTop: "6px" }}>
            <path d="M0 40 C10 40 14 20 22 22 S34 46 44 38 S56 6 66 14 S78 44 88 36 S104 4 114 12 S124 30 130 20" fill="none" stroke="#E11D3A" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "56px 40px", marginTop: "70px" }}>
        {(v.features || []).map((f, $index) => (
          <React.Fragment key={$index}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <span className="feat-ic">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF5A75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={f.icon} />
                </svg>
              </span>
              <h3 style={{ margin: "0", fontSize: "15px", fontWeight: "600" }}>
                {f.t}
              </h3>
              <p className="sub" style={{ fontSize: "11px", lineHeight: "2" }}>
                {f.d}
              </p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
    </>
  );
}

export default LandingFitur;
