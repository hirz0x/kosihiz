import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

/* Dibuat dari desain canvas SosmedGo. Data di halaman ini masih contoh. */
class RegisterPage extends React.Component {
  constructor(p) { super(p); this.state = { show: false, busy: false, err: '' }; this.mode = 'daftar'; this.submit = this.submit.bind(this); }
  async submit(e) {
    e.preventDefault();
    this.setState({ busy: true, err: '' });
    const body = this.mode === 'daftar'
      ? { username: document.getElementById('r-username').value, email: document.getElementById('r-email').value, password: document.getElementById('r-password').value, confirm: document.getElementById('r-confirm').value, ref: new URLSearchParams(window.location.search).get('ref') || '' }
      : { email: document.getElementById('username').value, password: document.getElementById('password').value };
    const url = this.mode === 'daftar' ? '/api/auth/register' : '/api/auth/login';
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Gagal.');
      if (d.perluKonfirmasi) { this.setState({ busy: false, err: 'Akun dibuat. Cek email untuk konfirmasi, lalu masuk.' }); return; }
      window.location.href = '/dashboard';
    } catch (ex) {
      this.setState({ busy: false, err: ex.message });
    }
  }
  renderVals() {
    var self = this;
    return {
      pwType: this.state.show ? 'text' : 'password',
      pwLabel: this.state.show ? 'Sembunyikan password' : 'Tampilkan password',
      togglePw: function () { self.setState({ show: !self.state.show }); },
      noop: function (e) { if (e && e.preventDefault) e.preventDefault(); },
      menu: ['Pesanan Saya', 'Layanan', 'Isi Saldo', 'Referral', 'Tiket', 'Update', 'Ketentuan', 'API', 'Pengaturan', 'Status Saya'],
      stats: [
        { l: 'Saldo Akun', v: 'Rp 150.000', a: 'Isi Saldo', ib: '#2A0E14', fg: '#FF5A75' },
        { l: 'Pesanan Saya', v: '12', a: 'Lihat Pesanan', ib: 'rgba(34,197,94,.1)', fg: '#22C55E' },
        { l: 'Total Belanja', v: 'Rp 450.000', a: 'Isi Saldo', ib: 'rgba(245,158,11,.1)', fg: '#F59E0B' }
      ]
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <>
        <Head>
          <title>SosmedGo — Daftar</title>
          <link rel="preconnect" href="https://api.fontshare.com" />
          <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
        </Head>
        <style jsx global>{`
html{color-scheme:dark}
body{margin:0;background:#0A0A0C;overflow-x:hidden}
@media (max-width:900px){
  /* Panel pratinjau hanya hiasan, jadi disembunyikan di layar kecil. */
  .auth-aside{display:none !important}
}
@media (max-width:640px){
  /* iOS memperbesar halaman kalau font input di bawah 16px. */
  .field,input,select,textarea{font-size:16px !important}
}
.field:-webkit-autofill,.field:-webkit-autofill:hover,.field:-webkit-autofill:focus{-webkit-text-fill-color:#FFFFFF;-webkit-box-shadow:0 0 0 1000px #111114 inset;caret-color:#FFFFFF;transition:background-color 9999s ease-in-out 0s}
a{color:#FF5A75;text-decoration:none}a:hover{color:#E11D3A}
.field{width:100%;box-sizing:border-box;height:46px;background:#111114;border:1px solid #23232A;border-radius:10px;padding:0 14px;color:#FFFFFF;font-family:inherit;font-size:14px;outline:none}
.field::placeholder{color:#55575F}
.field:focus{border-color:#E11D3A;box-shadow:0 0 0 3px rgba(225,29,58,.15)}
.lbl{font-size:14px;font-weight:500;color:#E4E4E7;margin-bottom:10px;display:block}
.submit{width:100%;height:48px;border-radius:10px;border:1px solid #FF4D6A;background:#E11D3A;color:#FFFFFF;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 10px 28px rgba(225,29,58,.3)}
.submit:hover{background:#C8102E}
.gbtn{display:inline-flex;align-items:center;gap:8px;background:#111114;border:1px solid #23232A;border-radius:8px;padding:10px 14px;font-size:12px;font-weight:600;color:#E4E4E7;cursor:pointer;font-family:inherit}
.gbtn:hover{border-color:#3A3A42}
.chk{width:20px;height:20px;margin:0;accent-color:#E11D3A}
.mi{display:flex;align-items:center;gap:10px;font-size:9px;color:#A1A3AB;padding:8px 10px}
`}</style>
      <div style={{ fontFamily: "'Satoshi','Plus Jakarta Sans',system-ui,sans-serif", color: "#F4F4F5", background: "#0A0A0C", minHeight: "100vh", display: "flex", flexWrap: "wrap" }}>
        <main style={{ flex: "1 1 520px", minWidth: "0", display: "flex", flexDirection: "column", padding: "22px 24px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "500", color: "#8B8D96", width: "fit-content", minHeight: "44px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Kembali{" "}
          </Link>
          <div style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", padding: "30px 0 60px" }}>
            <form style={{ width: "100%", maxWidth: "430px", display: "flex", flexDirection: "column" }} onSubmit={this.submit}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <img src="/icon.png" alt="" aria-hidden="true" width="26" height="26" style={{ borderRadius: "8px", display: "block" }} />
                <span style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "-.03em" }}>
                  SosmedGo
                </span>
              </span>
              <h1 style={{ margin: "0 0 10px", fontSize: "22px", fontWeight: "600", letterSpacing: "-.02em" }}>
                Daftar ke SosmedGo
              </h1>
              <p style={{ margin: "0 0 36px", fontSize: "14px", color: "#8B8D96" }}>
                Sudah punya akun?{" "}
                <Link href="/login" style={{ fontWeight: "600" }}>
                  Masuk
                </Link>
              </p>
              <label className="lbl" htmlFor="r-username">
                Username
              </label>
              <input id="r-username" className="field" type="text" autoComplete="username" style={{ marginBottom: "6px" }} />
              <div style={{ fontSize: "11px", color: "#8B8D96", marginBottom: "16px" }}>3-20 karakter: huruf kecil, angka, titik, atau garis bawah.</div>
              <label className="lbl" htmlFor="r-email">
                Email
              </label>
              <input id="r-email" className="field" type="email" autoComplete="email" style={{ marginBottom: "22px" }} />
              <label className="lbl" htmlFor="r-password">
                Password
              </label>
              <div style={{ position: "relative", marginBottom: "22px" }}>
                <input id="r-password" className="field" type={v.pwType} autoComplete="new-password" style={{ paddingRight: "50px" }} />
                <button type="button" onClick={v.togglePw} aria-label={v.pwLabel} style={{ position: "absolute", right: "1px", top: "1px", width: "44px", height: "44px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6E78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
              <label className="lbl" htmlFor="r-confirm">
                Konfirmasi password
              </label>
              <input id="r-confirm" className="field" type={v.pwType} autoComplete="new-password" style={{ marginBottom: "22px" }} />
              {this.state.err ? <div role="alert" style={{ fontSize: "12px", color: "#FF5A75", marginBottom: "10px" }}>{this.state.err}</div> : null}
              <button type="submit" className="submit" disabled={this.state.busy} style={{ color: "#FFFFFF", boxSizing: "border-box", opacity: this.state.busy ? 0.6 : 1 }}>
                {this.state.busy ? "Memproses..." : "Daftar"}
              </button>
              
            </form>
          </div>
        </main>
        <aside aria-hidden="true" className="auth-aside" style={{ position: "relative", flex: "1 1 520px", minWidth: "0", borderLeft: "1px solid #17171C", overflow: "hidden", minHeight: "760px", background: "#141417" }}>
          <div style={{ position: "absolute", left: "60px", top: "-260px", width: "1200px", height: "1200px", borderRadius: "50%", background: "radial-gradient(circle,#150A0D,#120709 55%,#0A0A0C 70%)" }} />
          <div style={{ position: "absolute", left: "220px", top: "-200px", width: "600px", height: "500px", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(225,29,58,.25),rgba(225,29,58,0) 65%)" }} />
          <div style={{ position: "absolute", left: "150px", top: "60px", width: "900px", height: "830px", background: "#0F0F12", border: "1px solid #24242A", borderRadius: "22px", display: "flex", overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
            <div style={{ width: "170px", flex: "none", borderRight: "1px solid #1E1E23", padding: "22px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "22px" }}>
                <img src="/icon.png" alt="" aria-hidden="true" width="20" height="20" style={{ borderRadius: "8px", display: "block" }} />
                <span style={{ fontSize: "14px", fontWeight: "800" }}>
                  SosmedGo
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#0F0F12", border: "1px solid #24242A", borderRadius: "10px", padding: "8px", marginBottom: "14px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#E11D3A", fontSize: "8px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  SG
                </span>
                <span style={{ fontSize: "8px", color: "#6B6E78", lineHeight: "1.4" }}>
                  Akun Saya
                  <br />
                  <span style={{ color: "#E4E4E7", fontSize: "9px" }}>
                    akun kamu
                  </span>
                </span>
              </div>
              <div className="mi" style={{ background: "#E11D3A", color: "#FFFFFF", borderRadius: "8px", fontWeight: "600" }}>
                🛒 Pesanan Baru
                <span style={{ marginLeft: "auto" }}>
                  ›
                </span>
              </div>
              {(v.menu || []).map((m, $index) => (
                <React.Fragment key={$index}>
                  <div className="mi">
                    <span style={{ width: "12px", height: "12px", border: "1.5px solid #6B6E78", borderRadius: "3px" }} />
                    {m}
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "18px 30px", borderBottom: "1px solid #1E1E23" }}>
                <div style={{ fontSize: "10px", color: "#6B6E78" }}>
                  Beranda ›{" "}
                  <span style={{ color: "#FF5A75" }}>
                    Pesanan Baru
                  </span>
                </div>
                <div style={{ fontSize: "8px", color: "#4B4D56", marginTop: "4px" }}>
                  Buat pesanan kamu dari sini.
                </div>
              </div>
              <div style={{ padding: "34px 30px 24px", display: "flex", flexDirection: "column", gap: "22px", background: "linear-gradient(180deg,#150A0D,#0F0F12 40%)" }}>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: "700" }}>
                    Selamat datang di SosmedGo{" "}
                    <span style={{ color: "#FF5A75" }}>
                      akun kamu
                    </span>
                    {" "}👋
                  </div>
                  <div style={{ fontSize: "9px", color: "#6B6E78", marginTop: "8px", maxWidth: "260px", lineHeight: "1.6" }}>
                    Kelola saldo dan semua pesanan kamu dengan mudah dari satu dashboard.
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "14px" }}>
                  {(v.stats || []).map((s, $index) => (
                    <React.Fragment key={$index}>
                      <div style={{ background: "#141417", border: "1px solid #24242A", borderRadius: "12px", overflow: "hidden" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", padding: "16px 14px" }}>
                          <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: s.ib, border: `1px solid ${s.fg}` }} />
                          <div>
                            <div style={{ fontSize: "8px", color: "#6B6E78" }}>
                              {s.l}
                            </div>
                            <div style={{ fontSize: "17px", fontWeight: "600", marginTop: "3px" }}>
                              {s.v}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px", fontSize: "8px", fontWeight: "600", background: s.ib, color: s.fg }}>
                          {s.a}
                          <span>
                            →
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "14px" }}>
                  <div style={{ flex: "1.2", background: "#141417", border: "1px solid #24242A", borderRadius: "14px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", fontWeight: "600" }}>
                      <span style={{ width: "26px", height: "26px", borderRadius: "8px", background: "#E11D3A" }} />
                      Buat pesanan
                    </div>
                    <div style={{ display: "flex", gap: "4px", background: "#1E1E23", borderRadius: "8px", padding: "4px", fontSize: "8px" }}>
                      <span style={{ background: "#2A2A30", borderRadius: "6px", padding: "7px 14px" }}>
                        Pesanan Baru
                      </span>
                      <span style={{ padding: "7px 14px", color: "#8B8D96" }}>
                        Cari
                      </span>
                      <span style={{ padding: "7px 14px", color: "#8B8D96" }}>
                        Pesanan Massal
                      </span>
                    </div>
                    <div style={{ fontSize: "8px", fontWeight: "600" }}>
                      Pilih Kategori
                    </div>
                    <div style={{ border: "1px solid #E11D3A", borderRadius: "8px", padding: "8px 10px", fontSize: "8px", display: "flex", justifyContent: "space-between", boxShadow: "0 0 0 3px rgba(225,29,58,.12)" }}>
                      <span>
                        📷 Pilih Kategori
                      </span>
                      <span>
                        ⌄
                      </span>
                    </div>
                    <div style={{ fontSize: "8px", fontWeight: "600" }}>
                      Pilih Layanan
                    </div>
                    <div style={{ border: "1px solid #24242A", borderRadius: "8px", padding: "8px 10px", fontSize: "7px", display: "flex", justifyContent: "space-between" }}>
                      <span>
                        <span style={{ background: "#2A0E14", color: "#FF5A75", borderRadius: "999px", padding: "2px 6px", marginRight: "6px" }}>
                          101
                        </span>
                        Instagram Followers Indonesia — Refill 30H — Rp 15.000/1000
                      </span>
                      <span>
                        ⌄
                      </span>
                    </div>
                    <div style={{ fontSize: "8px", fontWeight: "600" }}>
                      Link
                    </div>
                    <div style={{ border: "1px solid #24242A", borderRadius: "8px", padding: "8px 10px", fontSize: "7px", color: "#4B4D56" }}>
                      Masukkan link di sini
                    </div>
                    <div style={{ fontSize: "8px", fontWeight: "600" }}>
                      Jumlah
                    </div>
                    <div style={{ border: "1px solid #24242A", borderRadius: "8px", padding: "8px 10px", fontSize: "7px", color: "#4B4D56" }}>
                      Min: 100 — Maks: 50.000
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                      <span style={{ flex: "1", border: "1px solid #24242A", borderRadius: "8px", padding: "9px 10px", fontSize: "7px", color: "#8B8D96" }}>
                        Subtotal: Rp 15.000
                      </span>
                      <span style={{ flex: "1", background: "#E11D3A", borderRadius: "8px", padding: "9px 10px", fontSize: "8px", textAlign: "center", fontWeight: "600" }}>
                        Kirim Pesanan
                      </span>
                    </div>
                  </div>
                  <div style={{ flex: "1", background: "#141417", border: "1px solid #24242A", borderRadius: "14px", padding: "18px", display: "flex", flexDirection: "column", gap: "14px", textAlign: "center" }}>
                    <div style={{ fontSize: "10px", fontWeight: "600", marginTop: "20px" }}>
                      Instagram — Followers Indonesia
                    </div>
                    <div style={{ fontSize: "7px", color: "#6B6E78" }}>
                      ID Layanan: 101
                    </div>
                    <div style={{ borderTop: "1px solid #24242A", paddingTop: "16px" }}>
                      <div style={{ fontSize: "16px", color: "#FF5A75" }}>
                        ⏱
                      </div>
                      <div style={{ fontSize: "9px", fontWeight: "600", marginTop: "6px" }}>
                        Waktu Proses
                      </div>
                      <div style={{ fontSize: "7px", color: "#6B6E78", marginTop: "3px" }}>
                        Dikirim dalam ±{" "}
                        <span style={{ color: "#FF5A75" }}>
                          30 menit
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "left", borderTop: "1px solid #24242A", paddingTop: "14px", fontSize: "8px", color: "#8B8D96", lineHeight: "1.9" }}>
                      <b style={{ color: "#E4E4E7", fontSize: "10px" }}>
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
          </div>
          <div style={{ position: "absolute", left: "40px", top: "680px", display: "flex", alignItems: "center", gap: "10px", background: "#141417", border: "1px solid #24242A", borderRadius: "12px", padding: "10px 16px 10px 10px", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}>
            <span style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#E8C3A4" }} />
            <span style={{ fontSize: "12px", fontWeight: "500" }}>
              Kamu dapat followers baru! 🎉
            </span>
          </div>
          <div style={{ position: "absolute", left: "58px", top: "770px", width: "210px", background: "#141417", border: "1px solid #24242A", borderRadius: "14px", padding: "16px 18px", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#FF5A75" }}>
              <span>
                ▣ Toko Baju Saya
              </span>
              <span>
                ↗
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "#C9CBD1", margin: "14px 0 6px" }}>
              Penjualan Bersih
            </div>
            <div style={{ fontSize: "22px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
              Rp 12.450.000{" "}
              <span style={{ fontSize: "9px", background: "#2A0E14", color: "#FF5A75", borderRadius: "999px", padding: "4px 8px" }}>
                +18%
              </span>
            </div>
          </div>
        </aside>
      </div>
      </>
    );
  }
}

export default RegisterPage;
