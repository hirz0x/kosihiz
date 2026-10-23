import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AuthAside from './AuthAside';

/* Dibuat dari desain canvas SosmedGo. Data di halaman ini masih contoh. */
class LoginPage extends React.Component {
  constructor(p) { super(p); this.state = { show: false, busy: false, err: '', mfa: false, kode: '', ingat: false }; this.mode = 'masuk'; this.submit = this.submit.bind(this); this.toggleIngat = this.toggleIngat.bind(this); }
  toggleIngat(e) {
    this.setState({ ingat: e.target.checked });
  }
  renderMfa() {
    var self = this;
    var siap = this.state.kode.length === 6 && !this.state.busy;
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0C', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', boxSizing: 'border-box' }}>
        <form onSubmit={this.submit} style={{ width: '100%', maxWidth: '380px', background: '#121216', border: '1px solid #26262E', borderRadius: '16px', padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>Verifikasi dua langkah</div>
          <div style={{ fontSize: '13px', color: '#9A9AA5', lineHeight: 1.5 }}>Masukkan 6 digit kode dari aplikasi authenticator kamu.</div>
          <input id="mfa-login" className="inp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} autoFocus value={this.state.kode} onChange={function (e) { self.setState({ kode: e.target.value.replace(/\D/g, '') }); }} style={{ height: '46px', fontSize: '16px', letterSpacing: '.3em', textAlign: 'center' }} />
          {this.state.err ? <div role="alert" style={{ fontSize: '12px', color: '#FF5A75' }}>{this.state.err}</div> : null}
          <button type="submit" className="submit" disabled={!siap} style={{ color: '#FFFFFF', opacity: siap ? 1 : 0.6 }}>{this.state.busy ? 'Memeriksa...' : 'Verifikasi'}</button>
        </form>
      </div>
    );
  }
  async submit(e) {
    e.preventDefault();
    this.setState({ busy: true, err: '' });
    const body = this.mode === 'daftar'
      ? { username: document.getElementById('r-username').value, email: document.getElementById('r-email').value, password: document.getElementById('r-password').value, confirm: document.getElementById('r-confirm').value }
      : { email: document.getElementById('username').value, password: document.getElementById('password').value };
    const url = this.mode === 'daftar' ? '/api/auth/register' : this.state.mfa ? '/api/auth/mfa' : '/api/auth/login';
    const kirim = this.state.mfa ? { kode: this.state.kode, ingat: this.state.ingat } : Object.assign({}, body, { ingat: this.state.ingat });
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(kirim) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Gagal.');
      if (d.mfa) { this.setState({ busy: false, mfa: true, kode: '', err: '' }); return; }
      if (d.perluKonfirmasi) { this.setState({ busy: false, err: 'Akun dibuat. Cek email untuk konfirmasi, lalu masuk.' }); return; }
      /* Dibaca sekali oleh dashboard buat nampilin peringatan "pastikan link/ID pesanan benar" —
         ditandai di sini (bukan tersimpan terus) supaya munculnya tiap habis login, bukan cuma sekali per tab. */
      try { sessionStorage.setItem('sg_warn_order_pending', '1'); } catch (e) {}
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
      noop: function (e) { if (e && e.preventDefault) e.preventDefault(); }
    };
  }

  render() {
    if (this.state.mfa) return this.renderMfa();
    const v = this.renderVals();
    return (
      <>
        <Head>
          <title>SosmedGo — Masuk</title>
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
.chk{width:16px;height:16px;margin:0;accent-color:#E11D3A}
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
                Masuk ke SosmedGo
              </h1>
              <p style={{ margin: "0 0 36px", fontSize: "14px", color: "#8B8D96" }}>
                Belum punya akun?{" "}
                <Link href="/register" style={{ fontWeight: "600" }}>
                  Daftar
                </Link>
              </p>
              <label className="lbl" htmlFor="username">
                Username
              </label>
              <div style={{ position: "relative", marginBottom: "26px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6E78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input id="username" className="field" type="text" autoComplete="username" style={{ paddingLeft: "42px" }} />
              </div>
              <label className="lbl" htmlFor="password">
                Password
              </label>
              <div style={{ position: "relative" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6E78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input id="password" className="field" type={v.pwType} autoComplete="current-password" style={{ paddingLeft: "42px", paddingRight: "50px" }} />
                <button type="button" onClick={v.togglePw} aria-label={v.pwLabel} style={{ position: "absolute", right: "1px", top: "1px", width: "44px", height: "44px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6E78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
              <a href="/lupa-password" style={{ fontSize: "12px", margin: "8px 0 18px", width: "fit-content" }}>
                Lupa password?
              </a>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#C9CBD1", cursor: "pointer", minHeight: "44px", marginBottom: "14px" }}>
                <input type="checkbox" className="chk" checked={this.state.ingat} onChange={this.toggleIngat} />
                Ingat saya{" "}
              </label>
              {this.state.err ? <div role="alert" style={{ fontSize: "12px", color: "#FF5A75", marginBottom: "10px" }}>{this.state.err}</div> : null}
              <button type="submit" className="submit" disabled={this.state.busy} style={{ color: "#FFFFFF", boxSizing: "border-box", opacity: this.state.busy ? 0.6 : 1 }}>
                {this.state.busy ? "Memproses..." : "Masuk"}
              </button>
              
            </form>
          </div>
        </main>
        <AuthAside />
      </div>
      </>
    );
  }
}

export default LoginPage;
