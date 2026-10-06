import React from 'react';
import Toast from './Toast';
import KotakKonfirmasi from './Konfirmasi';
import { namaIndo } from './terjemah';
import Head from 'next/head';
import Link from 'next/link';
import { ACCENTS, accentVarsFor } from './theme';

/* Dibuat dari desain canvas SosmedGo. Data di halaman ini masih contoh. */
/* Ikon menu sidebar dari Font Awesome. */
const FA_MENU = {
  neworder: 'fa-solid fa-cart-shopping',
  services: 'fa-solid fa-file-lines',
  orders: 'fa-solid fa-clipboard-list',
  addfunds: 'fa-solid fa-wallet',
  tickets: 'fa-solid fa-headset',
  updates: 'fa-solid fa-chart-line',
  refunds: 'fa-solid fa-rotate-left',
  massorder: 'fa-solid fa-list-ul',
  affiliates: 'fa-solid fa-users',
  soon: 'fa-solid fa-code'
};

const FA_BY_PATH = {
  "@lainnya": "fa-solid fa-ellipsis",
  "@linkedin": "fa-brands fa-linkedin",
  "@whatsapp": "fa-brands fa-whatsapp",
  "@google": "fa-brands fa-google",
  "@kick": "fa-solid fa-video",
  "@shopee": "fa-solid fa-bag-shopping",
  "M6 10V7a6 6 0 0 1 12 0v3M5 10h14v11H5z": "fa-solid fa-lock",
  "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2M18 14h2M14 18h6": "fa-solid fa-qrcode",
  "M4 20L20 4M14 4h6v6M5 9l2-2": "fa-solid fa-wand-magic-sparkles",
  "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2": "fa-solid fa-clock",
  "M5 3h14v18H5zM9 8h6M9 12h6M9 16h4": "fa-solid fa-file-invoice",
  "M6 9l6 6 6-6": "fa-solid fa-chevron-down",
  "M12 2l3 6.3 7 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 7-1z": "fa-solid fa-star",
  "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z": "fa-solid fa-gear",
  "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3": "fa-solid fa-right-from-bracket",
  "M9 6l6 6-6 6": "fa-solid fa-chevron-right",
  "M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z": "fa-solid fa-moon",
  "M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19": "fa-solid fa-sun",
  "M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0": "fa-solid fa-bell",
  "M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18": "fa-solid fa-globe",
  "M4 7h16M4 12h16M4 17h16": "fa-solid fa-bars",
  "M6 3h12l3 6-9 12L3 9zM3 9h18": "fa-solid fa-gem",
  "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2": "fa-solid fa-clock-rotate-left",
  "M8 6V4h8v2": "fa-solid fa-bag-shopping",
  "M9 12l2 2 4-4": "fa-solid fa-square-check",
  "M5 12h14M13 6l6 6-6 6": "fa-solid fa-arrow-right",
  "M3 12h4l3-8 4 16 3-8h4": "fa-solid fa-gauge-high",
  "M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4": "fa-solid fa-arrows-up-down",
  "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4": "fa-solid fa-shield",
  "M3 5h18l-7 8v6l-4 2v-8z": "fa-solid fa-filter",
  "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12": "fa-solid fa-sliders",
  "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z": "fa-solid fa-heart",
  "M12 3l10 18H2zM12 10v4M12 17h.01": "fa-solid fa-triangle-exclamation",
  "M2 10h20": "fa-solid fa-credit-card",
  "M12 8h.01M11 12h1v5h1": "fa-solid fa-circle-info",
  "M4 5h16v11H9l-5 4z": "fa-solid fa-comment",
  "M21 3L3 10l7 3 3 7z": "fa-solid fa-paper-plane",
  "M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-6 1-9.5z": "fa-solid fa-fire",
  "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z": "fa-brands fa-instagram",
  "M2 7a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3zM10 8.5v7l6-3.5z": "fa-brands fa-youtube",
  "M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5h.5V7.8a7 7 0 1 0 6.5 6.9V9.4A7 7 0 0 0 21 10.6V7a4 4 0 0 1-4-4z": "fa-brands fa-tiktok",
  "M23 4.6a9 9 0 0 1-2.6.7 4.5 4.5 0 0 0 2-2.5 9 9 0 0 1-2.9 1.1 4.5 4.5 0 0 0-7.7 4.1A12.8 12.8 0 0 1 2.5 3.3a4.5 4.5 0 0 0 1.4 6 4.5 4.5 0 0 1-2-.6v.1a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 18.3a12.8 12.8 0 0 0 6.9 2c8.3 0 12.8-6.9 12.8-12.8v-.6A9 9 0 0 0 23 4.6z": "fa-brands fa-x-twitter",
  "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.6 14.4c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.9-9.3-1-.4.1-.7-.1-.8-.5-.1-.4.1-.7.5-.8 4-.9 7.4-.5 10.2 1.2.3.2.4.6.3.9z": "fa-brands fa-spotify",
  "M21.5 3.5L2.5 11l6 2.2L18 6.5l-7.5 8 .5 6 3.2-4 4.8 3.5z": "fa-brands fa-telegram",
  "M14 22v-8h3l.5-4H14V8c0-1 .3-2 2-2h2V2.3C17.4 2.2 16.3 2 15 2c-3 0-5 1.8-5 5v3H7v4h3v8z": "fa-brands fa-facebook-f",
  "M21 2H3v16h5v4l4-4h5l4-4V2zM11 11V7M16 11V7": "fa-brands fa-twitch",
  "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-3 11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z": "fa-brands fa-reddit-alien",
  "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2c2.8 3 2.8 17 0 20M12 2c-2.8 3-2.8 17 0 20": "fa-solid fa-globe",
  "M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1zM12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2zM9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5": "fa-solid fa-rocket"
};

/* Ikon Font Awesome. Jalur SVG lama dipetakan ke kelas ikon yang sesuai. */
function FaIcon({ d, size, style }) {
  const cls = FA_BY_PATH[d] || 'fa-solid fa-circle';
  return (
    <i className={cls} aria-hidden="true" style={{ display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center', fontSize: size ? size + 'px' : undefined, width: size ? size + 'px' : undefined, ...style }} />
  );
}

/* Bonus deposit dari peringkat user. Nol kalau data peringkat belum ada atau bentuknya bukan data user. */
function bonusDariPeringkat(p) {
  return p && p.index !== undefined ? p.tiers[p.index].bonus : 0;
}

/* Bentuk tiket dari server disesuaikan dengan yang dipakai tampilan tiket di halaman ini. */
function tiketDariApi(t) {
  return { id: t.id, cat: t.kategori, sub: t.sub || '', orderId: t.orderId || '', status: t.status, unread: t.status === 'answered' && !t.userBaca, updated: t.diupdate, msgs: t.pesan.map(function (m) { return { from: m.from === 'admin' ? 'support' : 'user', text: m.text, time: m.time, lampiran: m.lampiran }; }) };
}

/* Batasi jumlah layanan yang tampil supaya halaman tidak berat. */
function batasiGrup(groups, batas) {
  var sisa = batas, out = [];
  groups.forEach(function (g) {
    if (sisa <= 0) return;
    var items = g.items.slice(0, sisa);
    sisa -= items.length;
    if (items.length) out.push(Object.assign({}, g, { items: items }));
  });
  return out;
}
function totalGrup(groups) {
  return groups.reduce(function (n, g) { return n + g.items.length; }, 0);
}

class DashboardPage extends React.Component {
  constructor(p) {
    super(p);
    this.state = {
      page: 'neworder', hdd: '', cur: 'IDR',
      plat: 'all', cat: 'new', svcId: 103, open: '', tab: 'new', qty: '', link: '', q: '', sent: false,
      navOpen: false,
      catalog: null, myOrders: [], saldo: 0, username: '', email: '', depErr: '', sending: false, sentOk: false, sentText: '',
      scat: 'all', sq: '', favs: {}, descId: 0, sOpen: '',
      ostat: 'all', oq: '', ofOpen: false, ostatus: {}, refundList: [], aff: null, wdJumlah: '', wdTujuan: '', wdBusy: false, peringkat: null, riwayat: [], bayarUrl: '', lastDep: '', cekMsg: '', toast: null, support: { nama: 'Tim Support', inisial: 'SG' }, pwForm: { cur: '', baru: '', baru2: '' }, emForm: { baru: '', pw: '' }, prefLoaded: false, invText: '', apiInfo: null, apiBaru: '', mfaAktif: null, mfaSetup: null, mfaKode: '', notifList: [], notifUnread: 0, sLimit: 40, kurs: 16000, siap: false,
      amtKey: 50000, amtCustom: '', met: 'qris', mOpen: false, paid: false, bayarBusy: false, dHistOpen: false, payHist: [],
      tcat: 'order', tsub: 'refill', tid: '', tmsg: '', tfile: null, tsent: false, tHistOpen: false, viewT: 0, replyTxt: '',
      tickets: [],
      rq: '', copied: false, theme: 'dark', themeMode: 'dark', accent: 'red', rankOpen: false, updOpen: false, updSeen: false, updF: 'all', fOpen: false, fd: { kw: '', pmin: '', pmax: '', ct: [], pl: [], ty: [] }, fa: { kw: '', pmin: '', pmax: '', ct: [], pl: [], ty: [] }, massTxt: '', massRes: null,
      atab: 'security', pwSaved: false, emSaved: false, twofa: false, lang: 'id', tz: 'WIB', keyN: 1, invSaved: false,
      notif: { order: true, deposit: true, ticket: true, promo: false }
    };
  }
  muatTiket() {
    var self = this;
    return fetch('/api/tickets?as=user')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && Array.isArray(d.tickets)) self.setState({ tickets: d.tickets.map(tiketDariApi) }); })
      .catch(function () {});
  }
  bacaTiket(id) {
    var self = this;
    fetch('/api/tickets?as=user', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id, aksi: 'baca' }) })
      .then(function () { return self.muatTiket(); })
      .catch(function () {});
  }
  muatRefund() {
    var self = this;
    return fetch('/api/refunds?as=user')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && Array.isArray(d.refunds)) self.setState({ refundList: d.refunds }); })
      .catch(function () {});
  }
  ajukanRefund(orderId) {
    var self = this;
    fetch('/api/refunds?as=user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: String(orderId) }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) { self.tampilkanToast(false, res.d.error || 'Refund gagal diajukan.'); return; }
        self.tampilkanToast(true, 'Refund diajukan. Menunggu persetujuan admin.');
        self.muatRefund();
      })
      .catch(function () { self.tampilkanToast(false, 'Refund gagal diajukan. Coba lagi.'); });
  }
  muatAfiliasi() {
    var self = this;
    return fetch('/api/affiliates?as=user')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && d.username) self.setState({ aff: d, affGagal: false }); else self.setState({ affGagal: true }); })
      .catch(function () { self.setState({ affGagal: true }); });
  }
  tarikKomisi() {
    var self = this;
    if (this.state.wdBusy) return;
    this.setState({ wdBusy: true });
    fetch('/api/affiliates?as=user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jumlah: this.state.wdJumlah }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) { self.tampilkanToast(false, res.d.error || 'Penarikan gagal diajukan.'); return; }
        self.setState({ wdJumlah: '', wdTujuan: '' });
        self.tampilkanToast(true, 'Komisi dipindah ke saldo.');
        self.muatAfiliasi();
        fetch('/api/me').then(function (r) { return r.ok ? r.json() : null; }).then(function (m) { if (m) self.setState({ saldo: m.saldo }); }).catch(function () {});
      })
      .catch(function () { self.tampilkanToast(false, 'Penarikan gagal diajukan. Coba lagi.'); })
      .then(function () { self.setState({ wdBusy: false }); });
  }
  muatPeringkat() {
    var self = this;
    return fetch('/api/peringkat?as=user')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && Array.isArray(d.tiers) && d.index !== undefined) self.setState({ peringkat: d }); })
      .catch(function () {});
  }
  muatRiwayat() {
    var self = this;
    return fetch('/api/riwayat')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && Array.isArray(d.riwayat)) self.setState({ riwayat: d.riwayat }); })
      .catch(function () {});
  }
  cekBayar(idArg, diam) {
    var self = this;
    var id = idArg || this.state.lastDep;
    if (!id) return;
    if (!diam) this.tampilkanToast('info', 'Mengecek pembayaran...');
    fetch('/api/deposits/cek?id=' + encodeURIComponent(id))
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) {
          if (diam) { try { localStorage.removeItem('sg_dep_pending'); } catch (e) {} self.setState({ paid: false, lastDep: '' }); return; }
          self.tampilkanToast(false, res.d.error || 'Gagal mengecek.'); return;
        }
        if (res.d.status === 'disetujui') {
          try { localStorage.removeItem('sg_dep_pending'); } catch (e) {}
          self.tampilkanToast(true, 'Pembayaran diterima, saldo sudah bertambah.');
          fetch('/api/me').then(function (r) { return r.ok ? r.json() : null; }).then(function (m) { if (m) self.setState({ saldo: m.saldo }); }).catch(function () {});
        } else if (res.d.status !== 'menunggu') {
          try { localStorage.removeItem('sg_dep_pending'); } catch (e) {}
          self.setState({ paid: false, lastDep: '' });
        } else {
          self.setState({ paid: true });
          if (!diam) self.tampilkanToast('info', 'Belum dibayar (status: ' + (res.d.paymenku || 'menunggu') + ').');
        }
      })
      .catch(function () { if (!diam) self.tampilkanToast(false, 'Gagal mengecek pembayaran.'); });
  }
  tampilkanToast(ok, text) {
    var self = this;
    clearTimeout(this._toastTimer);
    this.setState({ toast: { ok: ok, text: text } });
    this._toastTimer = setTimeout(function () { self.setState({ toast: null }); }, 5000);
  }
  tutupToast() {
    clearTimeout(this._toastTimer);
    this.setState({ toast: null });
  }
  tampilkanToast(ok, text) {
    var self = this;
    clearTimeout(this._toastTimer);
    this.setState({ toast: { ok: ok, text: text } });
    this._toastTimer = setTimeout(function () { self.setState({ toast: null }); }, 5000);
  }
  componentWillUnmount() {
    clearTimeout(this._siapTimer);
    clearTimeout(this._toastTimer);
  }
  gantiPassword() {
    var self = this;
    var f = this.state.pwForm;
    if (!f.cur || !f.baru) { this.tampilkanToast(false, 'Isi password saat ini dan password baru.'); return; }
    if (f.baru !== f.baru2) { this.tampilkanToast(false, 'Konfirmasi password baru tidak sama.'); return; }
    fetch('/api/account/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ passwordLama: f.cur, passwordBaru: f.baru }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) { self.tampilkanToast(false, res.d.error || 'Password gagal diperbarui.'); return; }
        self.setState({ pwForm: { cur: '', baru: '', baru2: '' } });
        self.tampilkanToast(true, 'Password berhasil diperbarui.');
      })
      .catch(function () { self.tampilkanToast(false, 'Password gagal diperbarui. Coba lagi.'); });
  }
  gantiEmail() {
    var self = this;
    var f = this.state.emForm;
    if (!f.baru || !f.pw) { this.tampilkanToast(false, 'Isi email baru dan password saat ini.'); return; }
    fetch('/api/account/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ emailBaru: f.baru, password: f.pw }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) { self.tampilkanToast(false, res.d.error || 'Email gagal diganti.'); return; }
        self.setState({ emForm: { baru: '', pw: '' } });
        self.tampilkanToast(true, 'Link verifikasi dikirim ke email baru. Cek kotak masuk kamu.');
      })
      .catch(function () { self.tampilkanToast(false, 'Email gagal diganti. Coba lagi.'); });
  }
  muatNotif() {
    var self = this;
    return fetch('/api/notif')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d) self.setState({ notifList: d.notif || [], notifUnread: d.belumDibaca || 0 }); })
      .catch(function () {});
  }
  bacaNotif() {
    var self = this;
    fetch('/api/notif', { method: 'PATCH' }).then(function () { self.setState({ notifUnread: 0 }); }).catch(function () {});
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.updOpen && this.state.updOpen) {
      this.muatNotif();
      this.bacaNotif();
    }
    /* Data halaman tertentu dimuat saat halaman itu dibuka, supaya dashboard tidak memuat semuanya sekaligus. */
    if (prevState.page !== this.state.page) {
      if (this.state.page === 'tickets') this.muatTiket();
      if (this.state.page === 'refunds') this.muatRefund();
      if (this.state.page === 'affiliates') this.muatAfiliasi();
      if (this.state.page === 'updates') this.muatRiwayat();
    }
    if (prevState.atab !== this.state.atab) {
      if (this.state.atab === 'twofa') this.muatMfa();
      if (this.state.atab === 'tzapi') this.muatApiInfo();
    }
    if (!this.state.prefLoaded) return;
    var ubah = {};
    if (prevState.lang !== this.state.lang) ubah.lang = this.state.lang;
    if (prevState.tz !== this.state.tz) ubah.tz = this.state.tz;
    if (prevState.notif !== this.state.notif) ubah.notif = this.state.notif;
    if (prevState.themeMode !== this.state.themeMode) ubah.themeMode = this.state.themeMode;
    if (prevState.accent !== this.state.accent) ubah.accent = this.state.accent;
    if (prevState.cur !== this.state.cur) ubah.cur = this.state.cur;
    if (Object.keys(ubah).length) this.simpanPref(ubah);
  }
  simpanPref(ubah) {
    var self = this;
    return fetch('/api/preferensi', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ubah) })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { self.tampilkanToast(false, 'Preferensi gagal disimpan.'); });
  }
  muatPreferensi() {
    var self = this;
    return fetch('/api/preferensi')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (p) {
        if (!p) return;
        var dark = p.themeMode === 'auto' && typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : p.themeMode !== 'light';
        self.setState({ lang: p.lang, tz: p.tz, notif: p.notif, invText: p.invoice || '', themeMode: p.themeMode || 'dark', theme: dark ? 'dark' : 'light', accent: p.accent || 'red', cur: p.cur || 'IDR' }, function () {
          self.setState({ prefLoaded: true });
        });
      })
      .catch(function () {});
  }
  muatApiInfo() {
    var self = this;
    return fetch('/api/apikey')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d) self.setState({ apiInfo: d.info || null }); })
      .catch(function () {});
  }
  buatApiKey(sudahYakin) {
    var self = this;
    if (this.state.apiInfo && sudahYakin !== true) { this.setState({ konfirm: { pesan: 'Buat API key baru? Key lama langsung tidak berlaku.', lanjut: function () { self.buatApiKey(true); } } }); return; }
    fetch('/api/apikey', { method: 'POST' })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) { self.tampilkanToast(false, res.d.error || 'API key gagal dibuat.'); return; }
        self.setState({ apiBaru: res.d.key, apiInfo: res.d.info });
        self.tampilkanToast(true, 'API key baru dibuat. Simpan sekarang, karena kunci lengkapnya tidak ditampilkan lagi.');
      })
      .catch(function () { self.tampilkanToast(false, 'API key gagal dibuat. Coba lagi.'); });
  }
  muatMfa() {
    var self = this;
    return fetch('/api/mfa')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d) self.setState({ mfaAktif: !!d.aktif }); })
      .catch(function () {});
  }
  mulaiMfa() {
    var self = this;
    fetch('/api/mfa/daftar', { method: 'POST' })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) { self.tampilkanToast(false, res.d.error || 'Gagal memulai 2FA.'); return; }
        self.setState({ mfaSetup: { factorId: res.d.factorId, qr: res.d.qr, kunci: res.d.kunci }, mfaKode: '' });
      })
      .catch(function () { self.tampilkanToast(false, 'Gagal memulai 2FA. Coba lagi.'); });
  }
  konfirmasiMfa() {
    var self = this;
    var s = this.state.mfaSetup;
    if (!s) return;
    fetch('/api/mfa/konfirmasi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ factorId: s.factorId, kode: this.state.mfaKode }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) { self.tampilkanToast(false, res.d.error || 'Kode salah.'); return; }
        self.setState({ mfaSetup: null, mfaKode: '', mfaAktif: true });
        self.tampilkanToast(true, '2FA aktif. Login berikutnya butuh kode dari authenticator.');
      })
      .catch(function () { self.tampilkanToast(false, 'Gagal mengaktifkan 2FA. Coba lagi.'); });
  }
  nonaktifkanMfa(sudahYakin) {
    var self = this;
    if (sudahYakin !== true) { this.setState({ konfirm: { pesan: 'Nonaktifkan 2FA? Akun kamu akan lebih mudah diakses tanpa kode.', lanjut: function () { self.nonaktifkanMfa(true); } } }); return; }
    fetch('/api/mfa/nonaktifkan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kode: this.state.mfaKode }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) { self.tampilkanToast(false, res.d.error || 'Gagal menonaktifkan 2FA.'); return; }
        self.setState({ mfaAktif: false, mfaKode: '' });
        self.tampilkanToast(true, '2FA dinonaktifkan.');
      })
      .catch(function () { self.tampilkanToast(false, 'Gagal menonaktifkan 2FA. Coba lagi.'); });
  }
  componentDidMount() {
    /* Kalau katalog lambat atau gagal, layar pemuatan tetap berakhir setelah beberapa detik. */
    var self0 = this;
    this._siapTimer = setTimeout(function () { self0.setState({ siap: true }); }, 4000);
    this.muatPreferensi();
    /* Katalog layanan diambil dari server, bukan lagi contoh di dalam file ini. */
    var self = this;
    self.muatTiket();
    self.muatPeringkat();
    self.muatNotif();
    fetch('/api/support').then(function (r) { return r.ok ? r.json() : null; }).then(function (s) { if (s && s.nama) self.setState({ support: { nama: s.nama, inisial: s.inisial } }); }).catch(function () {});
    fetch('/api/deposits/cek-semua')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (c) {
        if (!c || !c.disetujui) return;
        fetch('/api/me').then(function (r) { return r.ok ? r.json() : null; }).then(function (m) { if (m) self.setState({ saldo: m.saldo }); }).catch(function () {});
        fetch('/api/deposits?as=user').then(function (r) { return r.ok ? r.json() : null; }).then(function (x) {
          if (x && Array.isArray(x.deposits)) self.setState({ payHist: x.deposits.map(function (y) { return { id: y.id, tgl: String(y.dibuat).slice(0, 16).replace('T', ' '), metode: y.metode, jumlah: y.nominal, status: y.label }; }) });
        }).catch(function () {});
      })
      .catch(function () {});
    var pending = null;
    try { pending = localStorage.getItem('sg_dep_pending'); } catch (e) {}
    if (pending) { self.setState({ lastDep: pending }); self.cekBayar(pending, true); }
    fetch('/api/services')
      .then(function (r) { return r.json(); })
      .then(function (d) { self.setState({ siap: true }); if (Array.isArray(d.services)) self.setState({ catalog: d.services }); if (d.settings && d.settings.kurs) self.setState({ kurs: d.settings.kurs }); })
      .catch(function () {});
    fetch('/api/me')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && typeof d.saldo === 'number') self.setState({ saldo: d.saldo, username: d.user.username, email: d.user.email || '' }); })
      .catch(function () {});
    fetch('/api/deposits?as=user')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !Array.isArray(d.deposits)) return;
        self.setState({ payHist: d.deposits.map(function (x) {
          return { id: x.id, tgl: String(x.dibuat).slice(0, 16).replace('T', ' '), metode: x.metode, jumlah: x.nominal, status: x.label };
        }) });
      })
      .catch(function () {});
    fetch('/api/orders?as=user')
      .then(function (r) { return r.json(); })
      .then(function (d) { if (Array.isArray(d.orders)) self.setState({ myOrders: d.orders }); })
      .catch(function () {});
  }

  renderVals() {
    var self = this, st = this.state;
    var EN = st.lang === 'en'; var L = st.theme === 'light';
    var T = function (id, en) { return EN ? en : id; };
    var set = function (patch) { return function () { self.setState(patch); }; };
    var I = {
      all: 'M3 5h18l-7 8v6l-4 2v-8z',
      li: '@linkedin', wa: '@whatsapp', gg: '@google', kick: '@kick', shp: '@shopee',
      other: '@lainnya',
      fire: 'M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-6 1-9.5z',
      ig: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
      yt: 'M2 7a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3zM10 8.5v7l6-3.5z',
      tt: 'M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5h.5V7.8a7 7 0 1 0 6.5 6.9V9.4A7 7 0 0 0 21 10.6V7a4 4 0 0 1-4-4z',
      tw: 'M23 4.6a9 9 0 0 1-2.6.7 4.5 4.5 0 0 0 2-2.5 9 9 0 0 1-2.9 1.1 4.5 4.5 0 0 0-7.7 4.1A12.8 12.8 0 0 1 2.5 3.3a4.5 4.5 0 0 0 1.4 6 4.5 4.5 0 0 1-2-.6v.1a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 18.3a12.8 12.8 0 0 0 6.9 2c8.3 0 12.8-6.9 12.8-12.8v-.6A9 9 0 0 0 23 4.6z',
      sp: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.6 14.4c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.9-9.3-1-.4.1-.7-.1-.8-.5-.1-.4.1-.7.5-.8 4-.9 7.4-.5 10.2 1.2.3.2.4.6.3.9z',
      tg: 'M21.5 3.5L2.5 11l6 2.2L18 6.5l-7.5 8 .5 6 3.2-4 4.8 3.5z',
      fb: 'M14 22v-8h3l.5-4H14V8c0-1 .3-2 2-2h2V2.3C17.4 2.2 16.3 2 15 2c-3 0-5 1.8-5 5v3H7v4h3v8z',
      twitch: 'M21 2H3v16h5v4l4-4h5l4-4V2zM11 11V7M16 11V7',
      rd: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-3 11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z',
      web: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2c2.8 3 2.8 17 0 20M12 2c-2.8 3-2.8 17 0 20',
      seo: 'M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1zM12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2zM9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5'
    };
    var fmt = function (n) { return Math.round(n).toLocaleString('id-ID'); };

    /* ---------- data ---------- */
    var STROKE_IC = { all: 1, twitch: 1, web: 1, seo: 1 };
    var platListPenuh = [['all', T('Semua', 'All')], ['ig', 'Instagram'], ['yt', 'YouTube'], ['tt', 'TikTok'], ['tw', 'Twitter'], ['sp', 'Spotify'], ['tg', 'Telegram'], ['fb', 'Facebook'], ['twitch', 'Twitch'], ['rd', 'Reddit'], ['web', 'Website Traffic'], ['seo', 'SEO Backlink']];
    /* Sebelum katalog dimuat, hanya tombol Semua. Supaya tidak ada platform yang berkedip. */
    var platList = st.catalog ? platListPenuh : [['all', T('Semua', 'All')]];
    var cats = [];
    cats.forEach(function (c) { if (!c.icon) c.icon = I[c.p]; if (!c.bg) c.bg = 'var(--accent)'; });
    var services = [];
    /* Setelah katalog provider dimuat, daftar layanan dan kategori diambil dari sana.
       Daftar contoh tetap disimpan supaya data lama (pesanan contoh, riwayat update) tidak rusak. */
    var sampleServices = [];

    /* Hiasan tampilan untuk satu layanan. */
    var hiasi = function (x, peta) {
      x.priceFmt = fmt(x.price); x.priceTxt = 'Rp ' + x.priceFmt + ' / 1K';
      x.minTxt = fmt(x.min); x.maxTxt = fmt(x.max); x.icon = I[x.p];
      x.hasRefill = x.refill !== 'Tidak tersedia';
      x.desc = ['Link: username atau link postingan/profil', 'Mulai: ' + x.start, 'Kecepatan: ' + x.speed, 'Garansi refill: ' + x.refill, 'Akun harus publik selama proses berjalan'];
      peta[x.id] = x;
    };

    var byId = {};
    if (Array.isArray(st.catalog)) {
      /* Katalog ribuan layanan hanya diolah sekali, lalu dipakai ulang.
         Tanpa ini, setiap ketikan di form memaksa seluruh katalog dihitung ulang. */
      if (!self._kat || self._kat.src !== st.catalog) {
        var platDari = function (teks) {
          var t = String(teks).toLowerCase();
          if (t.indexOf('instagram') > -1) return 'ig';
          if (t.indexOf('youtube') > -1) return 'yt';
          if (t.indexOf('tiktok') > -1) return 'tt';
          if (t.indexOf('twitter') > -1) return 'tw';
          if (t.indexOf('spotify') > -1) return 'sp';
          if (t.indexOf('telegram') > -1) return 'tg';
          if (t.indexOf('facebook') > -1) return 'fb';
          if (t.indexOf('twitch') > -1) return 'twitch';
          if (t.indexOf('reddit') > -1) return 'rd';
          if (t.indexOf('traffic') > -1) return 'web';
          if (t.indexOf('seo') > -1 || t.indexOf('backlink') > -1) return 'seo';
          return 'other';
        };
        var jual = function (x) { return Math.round((x.dasar * (1 + (x.markup || 0) / 100)) / 100) * 100; };
        I.other = '@lainnya';

        var daftar = st.catalog.filter(function (x) { return x.aktif !== false; }).map(function (x) {
          return {
            id: Number(x.id), p: platDari(x.kategori + ' ' + x.nama), ct: 'ww', ty: '',
            name: namaIndo(x.nama), price: jual(x), min: Number(x.min), max: Number(x.maks),
            start: x.waktuN >= 3 ? '± ' + x.waktuRata + ' menit' : 'Sesuai antrean provider', speed: x.jenis || 'Default',
            refill: x.refill ? 'Tersedia' : 'Tidak tersedia', kategori: x.kategori
          };
        });

        var idxKat = {};
        var kategori = [];
        var adaPlat = {};
        daftar.forEach(function (x) {
          adaPlat[x.p] = true;
          if (!(x.kategori in idxKat)) {
            idxKat[x.kategori] = kategori.length;
            kategori.push({ v: 'c' + kategori.length, p: x.p, t: namaIndo(x.kategori), ids: [], icon: I[x.p] || I.all, bg: 'var(--accent)' });
          }
          kategori[idxKat[x.kategori]].ids.push(x.id);
        });

        /* Tombol platform hanya ditampilkan kalau ada layanannya di katalog. */
        var tombol = platList.filter(function (pp) { return pp[0] === 'all' || adaPlat[pp[0]]; });
        /* Tombol Lainnya selalu tampil sebagai penutup baris. Isinya layanan yang belum dikenali platform-nya. */
        tombol = tombol.concat([['other', T('Lainnya', 'Other')]]);

        var peta = {};
        sampleServices.concat(daftar).forEach(function (x) { hiasi(x, peta); });

        self._kat = { src: st.catalog, services: daftar, cats: kategori, platList: tombol, byId: peta };
      }
      services = self._kat.services;
      cats = self._kat.cats;
      platList = self._kat.platList;
      byId = self._kat.byId;
    } else {
      /* Belum ada katalog yang dimuat: tidak ada layanan contoh yang ditampilkan. */
      services = []; cats = [];
    }
    var catsFor = function (p) { return p === 'all' ? cats : cats.filter(function (c) { return c.p === p; }); };
    var firstSvc = function (c) { return c && c.ids.length ? c.ids[0] : 0; };
    var catOf = function (id) { return cats.filter(function (c) { return c.p !== 'all' && c.ids.indexOf(id) > -1; })[0]; };

    /* ---------- navigation ---------- */
    var go = function (page, extra) { return function () { var p = { page: page, hdd: '', open: '', sOpen: '', ofOpen: false, mOpen: false, navOpen: false }; if (extra) for (var k in extra) p[k] = extra[k]; self.setState(p); }; };
    var pages = {
      neworder: { crumb: T('Pesanan Baru', 'New Order'), hint: T('Buat pesanan kamu dari sini', 'Place your orders from here') },
      services: { crumb: T('Layanan', 'Services'), hint: T('Lihat daftar layanan di sini', 'View our service list here'), title: T('Layanan', 'Services'), sub: T('Lihat daftar layanan di sini', 'View our service list here'), align: 'left' },
      orders: { crumb: T('Pesanan', 'Orders'), hint: T('Kelola dan pantau pesanan kamu', 'Manage and view your orders here'), title: T('Pesanan', 'Orders'), sub: T('Kelola dan pantau pesanan kamu dengan mudah.', 'Easily manage and track your orders.'), align: 'left' },
      addfunds: { crumb: T('Isi Saldo', 'Add Funds'), hint: T('Isi saldo akun kamu dengan mudah', 'Easily add funds to your account'), title: T('Isi Saldo', 'Add Funds'), sub: T('Isi saldo akun kamu dengan mudah.', 'Easily add funds to your account.'), align: 'center' },
      ticket: { crumb: T('Detail Tiket', 'Ticket Detail'), hint: T('Lihat detail tiket', 'View ticket detail') },
      tickets: { crumb: T('Tiket', 'Tickets'), hint: T('Lihat dan kelola tiket support', 'View and manage your support tickets'), title: T('Support 24/7', '24/7 Support'), sub: T('Kirim tiket ke tim support kami dan dapatkan bantuan.', 'Send a ticket to our support team and get help with your issues.'), align: 'center' },
      updates: { crumb: T('Update', 'Updates'), hint: T('Perubahan harga dan status layanan', 'Service price and status changes'), title: T('Update', 'Updates'), sub: T('Riwayat perubahan harga dan status layanan.', 'History of service price and status changes.'), align: 'left' },
      refunds: { crumb: T('Refund', 'Refunds'), hint: T('Pantau refund pesanan kamu', 'Easily manage and track your order refunds'), title: T('Refund', 'Refunds'), sub: T('Pantau refund dari pesanan yang dibatalkan.', 'Easily manage and track your order refunds.'), align: 'left' },
      affiliates: { crumb: T('Afiliasi', 'Affiliates'), hint: T('Ajak teman dan dapatkan komisi', 'Refer customers and earn'), title: T('Afiliasi', 'Affiliates'), sub: T('Dapatkan penghasilan dengan mengajak pelanggan ke SosmedGo.', 'Earn money by referring customers to SosmedGo.'), align: 'left' },
      massorder: { crumb: T('Pesanan Massal', 'Mass order'), hint: T('Buat pesanan massal di sini', 'Place a bulk order here'), title: T('Pesanan Massal', 'Mass order'), sub: T('Buat banyak pesanan sekaligus dengan memasukkan link pesanan di bawah.', 'Place multiple orders at once by entering the order links below.'), align: 'center' },
      account: { crumb: T('Akun', 'Account'), hint: T('Pengaturan akun kamu', 'Your account settings') },
      soon: { crumb: T('Segera Hadir', 'Coming Soon'), hint: T('Halaman belum tersedia di prototipe', 'Not available in this prototype yet'), title: T('Segera Hadir', 'Coming Soon'), sub: T('Halaman ini akan dibuat berikutnya.', 'This page will be built next.'), align: 'left' }
    };
    var menuDef = [
      ['neworder', T('Pesanan Baru', 'New Order'), 'M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2M9 21h.01M18 21h.01', '', 'var(--accent)'],
      ['services', T('Layanan', 'Services'), 'M7 3h7l5 5v13H7zM14 3v5h5M10 14l2 2 3-3', '', '#DB2777'],
      ['orders', T('Pesanan', 'Orders'), 'M5 4h14v16H5zM9 9l2 2 4-4M9 15h6', '', '#7C3AED'],
      ['addfunds', T('Isi Saldo', 'Add Funds'), 'M21 12V7H3v12h9M3 11h18M18 21v-6M15 18l3-3 3 3', '', '#2563EB'],
      ['tickets', T('Tiket', 'Tickets'), 'M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H4zM17 14h3v6h-3z', String(st.tickets.filter(function (t) { return t.unread; }).length || ''), '#111318'],
      ['updates', T('Update', 'Updates'), 'M3 12h4l3-8 4 16 3-8h4', '', '#111318'],
      ['refunds', T('Refund', 'Refunds'), 'M21 12V7H3v12h8M3 11h18M15 18h6M18 15l-3 3 3 3', '', '#DC2626'],
      ['massorder', T('Pesanan Massal', 'Mass Order'), 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', '', '#111318'],
      ['affiliates', T('Afiliasi', 'Affiliates'), 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M16 3.1a4 4 0 0 1 0 7.8M22 21a7 7 0 0 0-4-6.3', '', '#111318'],
      ['soon', 'API', 'M3 4h18v16H3zM3 8h18M10 12l-2 2 2 2M14 12l2 2-2 2', '', '#111318']
    ];
    var menu1 = menuDef.map(function (m) {
      var on = (m[0] === st.page || (m[0] === 'tickets' && st.page === 'ticket')) && m[0] !== 'soon';
      return { t: m[1], icon: m[2], fa: FA_MENU[m[0]] || 'fa-solid fa-circle', badge: m[3] || false, ic: on ? '#FFFFFF' : 'currentColor', on: on, cur: on ? 'page' : 'false',
        bg: on ? 'var(--accent)' : 'transparent', fg: on ? '#FFFFFF' : 'var(--t3)', sh: on ? '0 8px 22px rgba(var(--accent-rgb),.3)' : 'none', fw: on ? '600' : '500',
        badgeBg: on ? 'rgba(255,255,255,.25)' : 'var(--accent)',
        go: go(m[0]) };
    });

    /* ---------- new order ---------- */
    var visCats = catsFor(st.plat);
    var cat = visCats.filter(function (c) { return c.v === st.cat; })[0] || visCats[0] || null;
    var inCat = cat ? cat.ids.map(function (id) { return byId[id]; }) : [];
    var svc = inCat.filter(function (s) { return s.id === st.svcId; })[0] || inCat[0] || null;
    var qtyN = parseInt(st.qty, 10), hasQty = !isNaN(qtyN) && qtyN > 0;
    var qtyOk = svc && hasQty && qtyN >= svc.min && qtyN <= svc.max;
    var ql = st.q.trim().toLowerCase();
    /* Dibatasi 50 supaya daftar tetap ringan meski katalog ribuan. */
    var found = (st.page !== 'neworder' || st.tab !== 'search') ? [] : (ql ? services.filter(function (s) { return s.name.toLowerCase().indexOf(ql) > -1 || String(s.id) === ql; }) : services).slice(0, ql ? 50 : 5);
    var choose = function (patch) { patch.open = ''; patch.sent = false; self.setState(patch); };
    var buyGo = function (s) { var c = catOf(s.id); return go('neworder', { plat: s.p, cat: c ? c.v : '', svcId: s.id, tab: 'new', sent: false }); };

    /* ---------- services page ---------- */
    var sql = st.sq.trim().toLowerCase();
    var sCats = st.page !== 'services' ? [] : cats.filter(function (c) { return st.scat === 'all' || c.v === st.scat; });
    var sGroups = sCats.map(function (c) {
      var items = c.ids.map(function (id) { return byId[id]; }).filter(function (s) {
        if (sql && s.name.toLowerCase().indexOf(sql) < 0 && String(s.id) !== sql) return false;
        var fa = st.fa, kw = fa.kw.trim().toLowerCase();
        if (kw && s.name.toLowerCase().indexOf(kw) < 0) return false;
        if (fa.pmin !== '' && s.price < Number(fa.pmin)) return false;
        if (fa.pmax !== '' && s.price > Number(fa.pmax)) return false;
        if (fa.ct.length && fa.ct.indexOf(s.ct) < 0) return false;
        if (fa.pl.length && fa.pl.indexOf(s.p) < 0) return false;
        if (fa.ty.length && fa.ty.indexOf(s.ty) < 0) return false;
        return true;
      });
      return { t: c.t, icon: c.icon, bg: c.bg, count: items.length, items: items.map(function (s) {
        var fav = !!st.favs[s.id], open = st.descId === s.id, fast = /Instan|menit/.test(s.start);
        return { id: s.id, name: s.name, priceFmt: s.priceFmt, minTxt: s.minTxt, maxTxt: s.maxTxt, start: s.start, refill: s.refill, desc: s.desc,
          tBg: fast ? 'rgba(34,197,94,.12)' : 'rgba(var(--accent-rgb),.18)', tFg: fast ? 'var(--gr)' : 'var(--rt)',
          rBg: s.hasRefill ? 'rgba(34,197,94,.12)' : 'var(--s4)', rFg: s.hasRefill ? 'var(--gr)' : 'var(--t4)',
          isFav: fav, favC: fav ? 'var(--accent)' : 'var(--t2)', favFill: fav ? 'var(--accent)' : 'none',
          fav: function () { var f = Object.assign({}, st.favs); f[s.id] = !f[s.id]; self.setState({ favs: f }); },
          descOpen: open, toggleDesc: set({ descId: open ? 0 : s.id }), buy: buyGo(s) };
      }) };
    }).filter(function (g) { return g.count > 0; }).slice(0, 12);

    /* ---------- orders ---------- */
    var orderData = [];
    /* Pesanan asli dari server menggantikan contoh di atas, kalau sudah ada. */
    if (Array.isArray(st.myOrders)) {
      var petaStatus = { 'Pending': 'pending', 'In progress': 'processing', 'Processing': 'processing', 'Completed': 'completed', 'Partial': 'partial', 'Canceled': 'canceled', 'Refunded': 'canceled' };
      orderData = st.myOrders.map(function (o) {
        return {
          id: o.providerOrder, svcId: Number(o.layananId), link: o.link, qty: o.jumlah,
          startC: o.awal === undefined || o.awal === null ? '—' : String(o.awal),
          remains: o.sisa === undefined || o.sisa === null ? o.jumlah : Number(o.sisa),
          status: petaStatus[o.status] || 'pending',
          date: String(o.dibuat).slice(0, 16).replace('T', ' ') + (o.selesaiAt ? ' · selesai dalam ' + Math.max(0, Math.round((new Date(o.selesaiAt) - new Date(o.dibuat)) / 60000)) + ' menit' : ''),
          nama: o.layananNama, biaya: o.biaya, raw: o.status
        };
      });
    }
    var SM = { partial: ['Sebagian ◐', 'rgba(245,158,11,.12)', 'var(--am)', 'rgba(245,158,11,.35)'], pending: ['Menunggu ⏱', 'rgba(245,158,11,.12)', 'var(--am)', 'rgba(245,158,11,.35)'], processing: ['Diproses ↻', 'rgba(59,130,246,.12)', 'var(--bl)', 'rgba(59,130,246,.35)'], completed: ['Selesai ✓', 'rgba(34,197,94,.12)', 'var(--gr)', 'rgba(34,197,94,.35)'], canceled: ['Dibatalkan ✕', '#7A1022', '#FFFFFF', '#9E1430'] };
    var oql = st.oq.trim().toLowerCase();
    var orders = orderData.map(function (o) { var x = Object.assign({}, o); if (st.ostatus[o.id]) x.status = st.ostatus[o.id]; return x; }).filter(function (o) {
      if (st.ostat !== 'all' && o.status !== st.ostat) return false;
      if (oql && String(o.id).indexOf(oql) < 0 && o.link.toLowerCase().indexOf(oql) < 0) return false;
      return true;
    }).map(function (o) {
      var s = byId[o.svcId] || { name: o.nama || ('Layanan ' + o.svcId), icon: I.all, price: 0, hasRefill: false };
      var m = SM[o.status] || SM.pending;
      return { id: o.id, svcId: o.svcId, name: o.nama || s.name, icon: s.icon, date: o.date, link: o.link, charge: 'Rp ' + fmt(o.biaya === undefined ? s.price * o.qty / 1000 : o.biaya), qtyTxt: fmt(o.qty), startC: o.startC, remains: fmt(o.remains),
        sTxt: m[0], sBg: m[1], sFg: m[2], sBc: m[3],
        canCancel: o.status === 'pending', canRefill: o.status === 'completed' && s.hasRefill, refillTxt: st.ostatus['r' + o.id] ? 'Refill diajukan' : 'Refill',
        cancel: function () {
          fetch('/api/orders/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: o.id }) })
            .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
            .then(function (res) {
              if (!res.ok) { self.tampilkanToast(false, res.d.error || 'Pesanan gagal dibatalkan.'); return; }
              self.tampilkanToast(true, 'Pesanan dibatalkan di provider.');
              return fetch('/api/orders?as=user').then(function (r) { return r.json(); }).then(function (d) { if (Array.isArray(d.orders)) self.setState({ myOrders: d.orders }); });
            })
            .catch(function () { self.tampilkanToast(false, 'Pembatalan gagal. Coba lagi.'); });
        },
        refill: function () { var x = Object.assign({}, st.ostatus); x['r' + o.id] = true; self.setState({ ostatus: x }); } };
    });
    var ofDef = [['all', 'Semua'], ['pending', 'Menunggu'], ['processing', 'Diproses'], ['completed', 'Selesai'], ['canceled', 'Dibatalkan']];

    /* ---------- refunds ---------- */
    var rql = st.rq.trim();
    var REF_S = { menunggu: ['Menunggu ⏱', 'rgba(245,158,11,.12)', 'var(--am)'], disetujui: ['Disetujui ✓', 'rgba(34,197,94,.12)', 'var(--gr)'], ditolak: ['Ditolak ✕', '#7A1022', '#FFFFFF'], belum: ['Belum diajukan', 'var(--s3)', 'var(--t3)'] };
    var refunds = orderData.filter(function (o) { return o.status === 'canceled' || o.status === 'partial'; }).filter(function (o) { return !rql || String(o.id).indexOf(rql) > -1; }).map(function (o) {
      var rf = (st.refundList || []).filter(function (x) { return x.pesanan === String(o.id); })[0];
      var pk = REF_S[rf ? rf.status : 'belum'];
      var est = o.biaya > 0 && o.qty > 0 ? Math.round(o.biaya * Math.min(o.remains, o.qty) / o.qty) : 0;
      return { id: o.id, date: o.date, amt: 'Rp ' + fmt(rf ? rf.jumlah : est), statusTxt: pk[0], statusBg: pk[1], statusFg: pk[2], ajukan: !rf && (o.raw === 'Canceled' || o.raw === 'Partial') && o.biaya > 0, ajukanFn: function () { self.ajukanRefund(o.id); } };
    });

    /* ---------- add funds ---------- */
    var amtList = [10000, 25000, 50000, 100000, 'custom'];
    var amtVal = st.amtKey === 'custom' ? st.amtCustom : String(st.amtKey);
    var amtN = parseInt(amtVal, 10);
    var mets = [
      { v: 'qris', t: 'QRIS Otomatis', badge: 'Pilihan Utama', info: 'Scan QRIS dari e-wallet atau m-banking apa pun. Saldo masuk otomatis.' }
    ];
    var met = mets.filter(function (m) { return m.v === st.met; })[0] || mets[0];

    /* ---------- tickets ---------- */
    var tcatDef = [['order', 'Pesanan'], ['service', 'Layanan'], ['payment', 'Pembayaran'], ['other', 'Lainnya']];
    var tsubDef = { order: [['refill', 'Refill'], ['cancel', 'Batalkan'], ['speed', 'Percepat'], ['other', 'Lainnya']], service: [['info', 'Info Layanan'], ['req', 'Request Layanan'], ['other', 'Lainnya']], payment: [['notin', 'Deposit Belum Masuk'], ['bonus', 'Bonus'], ['other', 'Lainnya']], other: [['other', 'Lainnya']] };
    var TS = { answered: [T('Dijawab ✓', 'Answered ✓'), 'rgba(34,197,94,.12)', 'var(--gr)'], open: [T('Menunggu ⏱', 'Pending ⏱'), 'rgba(245,158,11,.12)', 'var(--am)'], closed: [T('Ditutup', 'Closed'), 'var(--s4)', 'var(--t3)'] };
    var tTitle = function (t) { var c = tcatDef.filter(function (x) { return x[0] === t.cat; })[0]; var sb = (tsubDef[t.cat] || []).filter(function (x) { return x[0] === t.sub; })[0]; return (c ? c[1] : '') + (sb && t.cat !== 'other' ? ' - ' + sb[1] : ''); };
    var nowTxt = function () { var d = new Date(), z = function (n) { return (n < 10 ? '0' : '') + n; }; return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()) + ' ' + z(d.getHours()) + ':' + z(d.getMinutes()); };
    var vt = st.tickets.filter(function (t) { return t.id === st.viewT; })[0];
    var segStyle = function (on) { return { bg: on ? 'var(--accent)' : 'transparent', fg: on ? '#FFFFFF' : 'var(--t2)' }; };

    var tr = {
      home: T('Beranda', 'Home'), settings: T('Pengaturan', 'Settings'), logout: T('Keluar', 'Logout'),
      welcome: T('Selamat datang di SosmedGo', 'Welcome to SosmedGo'), welcomeSub: T('Panel SMM Indonesia — proses otomatis 24 jam.', 'Indonesian SMM panel — automated 24/7.'),
      place: T('Buat pesanan', 'Place your order'), category: T('Kategori', 'Category'), service: T('Layanan', 'Service'), qty: T('Jumlah', 'Quantity'),
      subtotal: T('Subtotal', 'Sub Total'), submit: T('Kirim Pesanan', 'Place Order'), notif: T('Notifikasi', 'Notifications'), lang: T('Bahasa', 'Language'),
      updates: T('Update', 'Updates'), close: T('Tutup', 'Close'), viewAll: T('Lihat Semua', 'View All'), noUpd: T('Tidak ada update.', 'No updates.'),
      themeLbl: st.theme === 'dark' ? T('Gelap', 'Dark') : T('Terang', 'Light'), themeAria: T('Ganti tema', 'Toggle theme'), speed: T('Kecepatan', 'Service Speed'), minmax: T('Min — Maks', 'Min - Max'), guar: T('Garansi', 'Guaranteed'), desc: T('Deskripsi', 'Description'), svcId: T('ID Layanan', 'Product ID'), start: T('Mulai', 'Start'), trusted: T('Provider Terpercaya', 'Trusted Provider Service'), notes: T('Catatan', 'Notes'), n1: T('Pastikan akun/postingan tidak di-private.', 'Make sure your profile is public before ordering.'), n2: T('Jangan pesan ulang link yang sama sebelum pesanan pertama selesai.', 'Do not place a second order on the same link before the first one is completed.'), n3: T('Pesanan yang sudah berjalan tidak bisa dibatalkan.', 'Cancellation is not available once the order has started.'), myAcc: T('Akun Saya', 'My Account'), rankTitle: T('Sistem Peringkat', 'Rank System'), aff: T('Afiliasi', 'Affiliates'), view: T('Lihat Profil', 'View'), acc: T('Akun', 'Account'), tickets: T('Tiket', 'Tickets'), lastUpd: T('Update terakhir', 'Last update'), ticket: T('Tiket', 'Ticket'), orderId: T('ID Pesanan', 'Order ID'), supportTeam: T('Tim Support', 'Support Team'), message: T('Tulis pesan', 'Message'), attach: T('Lampirkan file', 'Attach file'), send: T('Kirim', 'Send'), waitReply: T('Pesan terkirim. Tim support akan membalas secepatnya.', 'Message sent. Our support team will reply soon.'), yourRank: T('Peringkat kamu', 'Your rank')
    };
    var updData = (st.riwayat || []).map(function (x) { return [x.tanggal, x.layananId, x.tipe, x.lama, x.baru]; });
    var UPS = { up: [T('Harga naik', 'Rate increased'), 'rgba(var(--accent-rgb),.1)', 'var(--rt)'], down: [T('Harga turun', 'Rate decreased'), 'rgba(34,197,94,.1)', 'var(--gr)'], off: [T('Layanan dinonaktifkan', 'Service disabled'), 'var(--s4)', 'var(--t3)'], 'new': [T('Layanan baru ditambahkan', 'New service added'), 'rgba(59,130,246,.1)', 'var(--bl)'] };
    var mkUpd = function (u) { var sv = byId[u[1]] || { name: 'Layanan ' + u[1], icon: I.all }, m = UPS[u[2]]; return { id: u[1], name: sv.name, icon: sv.icon, bg: m[1], fg: m[2], msg: u[3] ? m[0] + ' ' + T('dari', 'from') + ' ' + u[3] + ' ' + T('ke', 'to') + ' ' + u[4] : m[0] }; };
    var groupDays = function (list) { var out = [], idx = {}; list.forEach(function (u) { if (!(u[0] in idx)) { idx[u[0]] = out.length; out.push({ date: u[0], items: [] }); } out[idx[u[0]]].items.push(mkUpd(u)); }); return out; };
    var updPage = updData.filter(function (u) { return st.updF === 'all' || u[2] === st.updF; });
    var atabDef = [
      ['security', 'Pengaturan Keamanan', 'Perbarui pengaturan keamanan akun kamu.', 'M6 10V7a6 6 0 0 1 12 0v3M5 10h14v11H5z'],
      ['twofa', '2FA', 'Lindungi akun dengan autentikasi dua langkah.', 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2M18 14h2M14 18h6'],
      ['ux', 'Pengalaman Pengguna', 'Atur bahasa dan tampilan panel.', 'M4 20L20 4M14 4h6v6M5 9l2-2'],
      ['tzapi', 'Zona Waktu & API', 'Atur zona waktu dan API key kamu.', 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2'],
      ['invoice', 'Detail Invoice', 'Data yang dicantumkan di invoice deposit.', 'M5 3h14v18H5zM9 8h6M9 12h6M9 16h4'],
      ['notif', 'Notifikasi', 'Pilih notifikasi yang ingin kamu terima.', 'M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0']
    ];
    var atabCur = atabDef.filter(function (t) { return t[0] === st.atab; })[0] || atabDef[0];
    var balSym = st.cur === 'IDR' ? 'Rp' : '$';
    var uang = function (n) { return st.cur === 'IDR' ? 'Rp ' + fmt(n) : '$ ' + (n / (st.kurs || 16000)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
    var pg = pages[st.page] || pages.neworder;
    var is = {}; ['neworder', 'services', 'orders', 'addfunds', 'tickets', 'refunds', 'affiliates', 'account', 'massorder', 'updates', 'ticket', 'soon'].forEach(function (k) { is[k] = st.page === k; });

    return {
      rankOpen: st.rankOpen, closeRank: set({ rankOpen: false }),
      ranks: (st.peringkat ? st.peringkat.tiers : []).map(function (r, i, arr) {
        var next = arr[i + 1];
        var cur = st.peringkat && i === st.peringkat.index;
        return { name: r.nama, range: next ? 'Rp ' + fmt(r.min) + ' – Rp ' + fmt(next.min - 1) : 'Rp ' + fmt(r.min) + '+', cur: !!cur, bc: cur ? 'var(--accent)' : 'var(--b3)', bg: cur ? 'var(--r1)' : 'var(--s4)',
          perks: r.benefit.map(function (t) { return { t: t, mark: '✓', ib: 'rgba(34,197,94,.14)', ic: 'var(--gr)' }; }) };
      }),
      tr: tr, themeCls: st.theme === 'dark' ? 'theme-dark' : 'theme-light', isDark: st.theme === 'dark', isLight: st.theme !== 'dark',
      toggleTheme: set({ theme: st.theme === 'dark' ? 'light' : 'dark', themeMode: st.theme === 'dark' ? 'light' : 'dark' }),
      themeOpts: [['light', 'Terang'], ['dark', 'Gelap'], ['auto', 'Otomatis']].map(function (m) {
        var on = st.themeMode === m[0];
        var pick = m[0] === 'auto'
          ? function () { var dark = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : true; self.setState({ themeMode: 'auto', theme: dark ? 'dark' : 'light' }); }
          : set({ themeMode: m[0], theme: m[0] });
        return { k: m[0], t: m[1], on: on, pick: pick };
      }),
      accentOpts: Object.keys(ACCENTS).map(function (k) { return { k: k, t: ACCENTS[k].label, c: ACCENTS[k].c, on: st.accent === k, pick: set({ accent: k }) }; }),
      accentVars: accentVarsFor(st),
      langOpen: st.hdd === 'lang', langBc: st.hdd === 'lang' ? 'var(--accent)' : 'var(--b3)', toggleLang: set({ hdd: st.hdd === 'lang' ? '' : 'lang' }),
      langOpts: [['id', 'Bahasa Indonesia'], ['en', 'English']].map(function (l) { var on = st.lang === l[0]; return { t: l[1], on: on, bg: on ? 'var(--r3)' : 'transparent', fw: on ? '700' : '500', pick: set({ lang: l[0], hdd: '' }) }; }),
      updOpen: st.updOpen, updUnread: !st.updSeen, openUpd: set({ updOpen: true, updSeen: true, hdd: '' }), closeUpd: set({ updOpen: false }),
      updDays: groupDays(updData), goUpdates: go('updates', { updOpen: false }),
      updFilters: [['all', T('Semua', 'All')], ['up', T('Harga naik', 'Rate increased')], ['down', T('Harga turun', 'Rate decreased')], ['off', T('Dinonaktifkan', 'Disabled')], ['new', T('Layanan baru', 'New')]].map(function (f) { var on = st.updF === f[0]; return { t: f[1], on: on, bg: on ? 'var(--accent)' : 'var(--s1)', fg: on ? '#FFFFFF' : 'var(--hi)', bc: on ? 'var(--accent)' : 'var(--b3)', pick: set({ updF: f[0] }) }; }),
      updPageDays: groupDays(updPage), updEmpty: updPage.length === 0,
      is: is, pg: pg, showBanner: st.page !== 'neworder' && st.page !== 'account' && st.page !== 'ticket',
      mainBg: st.page === 'neworder' ? (L ? 'radial-gradient(900px 340px at 85% 0%,rgba(var(--accent-rgb),.07),rgba(var(--accent-rgb),0) 70%),#FFFFFF' : 'linear-gradient(180deg,var(--g1) 0,var(--bg) 340px)') : 'var(--bg)',
      menu1: menu1,
      menu2: [
        { t: T('Info WhatsApp', 'WhatsApp Announcements'), fa: 'fa-brands fa-whatsapp', icon: 'M3 21l1.6-4.8A9 9 0 1 1 7.8 19.4zM9 9.5c0 3 2.5 5.5 5.5 5.5l1.5-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z', ic: 'currentColor', go: go('soon') },
        { t: T('Info Telegram', 'Telegram Announcements'), fa: 'fa-brands fa-telegram', icon: 'M21 4L3 11l6 2 2 6 3-4 5 4zM9 13l12-9', ic: 'currentColor', go: go('soon') }
      ],
      goSoon: go('soon'), goNew: go('neworder'), goFunds: go('addfunds'), goTickets: go('tickets', { tcat: 'order', tsub: 'refill' }),

      /* header */
      navOpen: st.navOpen, toggleNav: set({ navOpen: !st.navOpen }),
      balOpen: st.hdd === 'bal', profOpen: st.hdd === 'prof', sideOpen: st.hdd === 'side', sideRot: st.hdd === 'side' ? 'rotate(180deg)' : 'none', sideBc: st.hdd === 'side' ? 'var(--accent)' : 'var(--b3)', toggleSide: set({ hdd: st.hdd === 'side' ? '' : 'side' }),
      balBc: st.hdd === 'bal' ? 'var(--accent)' : 'var(--b3)', profBc: st.hdd === 'prof' ? 'var(--accent)' : 'var(--b3)',
      toggleBal: set({ hdd: st.hdd === 'bal' ? '' : 'bal' }), toggleProf: set({ hdd: st.hdd === 'prof' ? '' : 'prof' }),
      curSym: balSym, balTxt: st.cur === 'IDR' ? 'Rp ' + fmt(st.saldo || 0) : '$ ' + ((st.saldo || 0) / (st.kurs || 16000)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      curs: [['IDR', 'Rp'], ['USD', '$']].map(function (c) { var on = st.cur === c[0]; return { code: c[0], sym: c[1], on: on, bg: on ? 'var(--r3)' : 'transparent', pick: set({ cur: c[0], hdd: '' }) }; }),

      /* new order */
      stats: [
        { fa: 'fa-solid fa-wallet', c: L ? 'var(--accent)' : 'var(--accent-l)', tint: 'rgba(var(--accent-rgb),' + (L ? '.07' : '.12') + ')', line: 'rgba(var(--accent-rgb),' + (L ? '.22' : '.3') + ')', l: T('Saldo Akun', 'Account Balance'), v: uang(st.saldo || 0), a: T('Isi Saldo', 'Add funds'), icon: 'M21 12V7H3v12h9M3 11h18M18 21v-6M15 18l3-3 3 3', go: go('addfunds') },
        { fa: 'fa-solid fa-cart-shopping', c: L ? 'var(--accent)' : 'var(--accent-l)', tint: 'rgba(var(--accent-rgb),' + (L ? '.07' : '.12') + ')', line: 'rgba(var(--accent-rgb),' + (L ? '.22' : '.3') + ')', l: T('Total Pesanan', 'Total Orders'), v: String((st.myOrders || []).length), a: T('Pesanan Saya', 'My Orders'), icon: 'M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2M9 21h.01M18 21h.01', go: go('orders') },
        { fa: 'fa-solid fa-gem', c: L ? 'var(--accent)' : 'var(--accent-l)', tint: 'rgba(var(--accent-rgb),' + (L ? '.07' : '.12') + ')', line: 'rgba(var(--accent-rgb),' + (L ? '.22' : '.3') + ')', l: T('Peringkat', 'User Rank'), v: st.peringkat && st.peringkat.index !== undefined ? st.peringkat.tiers[st.peringkat.index].nama : '—', a: T('Lihat Peringkat', 'See Ranks'), icon: 'M6 3h12l4 6-10 12L2 9zM2 9h20M10 3 8 9l4 12 4-12-2-6', go: set({ rankOpen: true, hdd: '' }) },
        { fa: 'fa-solid fa-wallet', c: L ? 'var(--accent)' : 'var(--accent-l)', tint: 'rgba(var(--accent-rgb),' + (L ? '.07' : '.12') + ')', line: 'rgba(var(--accent-rgb),' + (L ? '.22' : '.3') + ')', l: T('Total Belanja', 'Spent Balance'), v: uang((st.myOrders || []).reduce(function (t, o) { return t + (o.biaya || 0); }, 0)), a: T('Isi Saldo', 'Add funds'), icon: 'M21 12V7H3v12h9M3 11h18M18 15v6M15 18l3 3 3-3', go: go('addfunds') }
      ],
      platCols: (function (n) {
        if (n % 6 === 0) return 6;
        if (n % 5 === 0) return 5;
        return (n % 5) > (n % 6) ? 5 : 6;
      })(platList.length),
      plats: platList.map(function (p) {
        var on = st.plat === p[0];
        return { n: p[1], icon: I[p[0]], fill: STROKE_IC[p[0]] ? 'none' : 'currentColor', stroke: STROKE_IC[p[0]] ? 'currentColor' : 'none', on: on, bg: on ? 'var(--accent)' : 'var(--s1)', bc: on ? 'var(--accent)' : 'var(--b3)', fg: on ? '#FFFFFF' : 'var(--t2)',
          pick: function () { var c = catsFor(p[0])[0]; choose({ plat: p[0], cat: c ? c.v : '', svcId: firstSvc(c) }); } };
      }),
      otabs: [['new', T('Pesanan Baru', 'New Order')], ['search', T('Cari', 'Search')], ['mass', T('Pesanan Massal', 'Mass order')]].map(function (t) { var on = st.tab === t[0]; return { t: t[1], on: on, bg: on ? (L ? '#FFFFFF' : 'var(--accent)') : 'transparent', fg: on ? (L ? 'var(--hi)' : '#FFFFFF') : 'var(--t3)', sh: on && L ? '0 1px 3px rgba(16,24,40,.12)' : 'none', pick: set({ tab: t[0], open: '' }) }; }),
      isNew: st.tab === 'new', isSearch: st.tab === 'search', isMass: st.tab === 'mass',
      cat: cat || { t: 'Belum ada kategori untuk platform ini', icon: I.fire, bg: 'var(--b5)' },
      catOpen: st.open === 'cat', catBc: st.open === 'cat' ? 'var(--accent)' : 'var(--b3)',
      toggleCat: function () { if (visCats.length) self.setState({ open: st.open === 'cat' ? '' : 'cat' }); },
      catOpts: (st.open === 'cat' ? visCats : []).map(function (c) { var on = cat && c.v === cat.v; return { t: c.t, icon: c.icon, bg: c.bg, on: on, rowBg: on ? 'var(--r3)' : 'transparent', pick: function () { choose({ cat: c.v, svcId: firstSvc(c) }); } }; }),
      svc: svc || { id: '—', name: 'Belum ada layanan', priceTxt: '-', desc: [] },
      svcOpen: st.open === 'svc', svcBc: st.open === 'svc' ? 'var(--accent)' : 'var(--b3)',
      toggleSvc: function () { if (inCat.length) self.setState({ open: st.open === 'svc' ? '' : 'svc' }); },
      svcOpts: inCat.map(function (s) { var on = svc && s.id === svc.id; return { id: s.id, name: s.name, priceTxt: s.priceTxt, on: on, rowBg: on ? 'var(--r3)' : 'transparent', pick: function () { choose({ svcId: s.id }); } }; }),
      hasSvc: !!svc, noSvc: !svc,
      linkPh: ({ ig: "https://instagram.com/username", tt: "https://tiktok.com/@username", yt: "https://youtube.com/@channel", tw: "https://x.com/username", sp: "https://open.spotify.com/...", tg: "https://t.me/channel", fb: "https://facebook.com/halaman", web: "https://domainkamu.com", seo: "https://domainkamu.com", twitch: "https://twitch.tv/username", rd: "https://reddit.com/u/username", other: "https://link-atau-username" })[svc ? svc.p : ""] || "https://link-atau-username",
      link: st.link, setLink: function (e) { self.setState({ link: e.target.value, sent: false }); },
      qty: st.qty, setQty: function (e) { self.setState({ qty: e.target.value, sent: false }); },
      qtyHint: svc ? (hasQty && !qtyOk ? 'Jumlah harus antara ' + svc.minTxt + ' dan ' + svc.maxTxt : 'Min: ' + svc.minTxt + ' — Maks: ' + svc.maxTxt) : '',
      qtyColor: hasQty && !qtyOk ? 'var(--rt)' : 'var(--t5)',
      subtotal: svc && hasQty ? 'Rp ' + fmt(svc.price * qtyN / 1000 * (1 - (st.peringkat && st.peringkat.index !== undefined ? (st.peringkat.tiers[st.peringkat.index].diskon || 0) : 0) / 100)) : 'Rp 0',
      submitOrder: function (e) {
        if (e && e.preventDefault) e.preventDefault();
        if (st.sending) return;
        if (!svc) { self.tampilkanToast(false, 'Pilih layanan dulu.'); return; }
        if (!st.link.trim()) { self.tampilkanToast(false, 'Link belum diisi.'); return; }
        if (!qtyOk) { self.tampilkanToast(false, 'Jumlah harus antara ' + svc.minTxt + ' dan ' + svc.maxTxt + '.'); return; }
        self.setState({ sending: true, sent: false, sentText: '' });
        fetch('/api/orders?as=user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ service: String(svc.id), link: st.link.trim(), quantity: qtyN })
        })
          .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
          .then(function (res) {
            if (!res.ok || res.d.error) { self.setState({ sending: false }); self.tampilkanToast(false, res.d.error || 'Pesanan gagal dikirim.'); }
            else { fetch('/api/me').then(function (r) { return r.ok ? r.json() : null; }).then(function (m) { if (m) self.setState({ saldo: m.saldo }); }).catch(function () {}); self.setState({ sending: false }); self.tampilkanToast(true, 'Pesanan ' + res.d.order.providerOrder + ' dibayar dengan saldo. Sedang diproses.'); }
          })
          .catch(function (err) { self.setState({ sending: false }); self.tampilkanToast(false, String(err && err.message ? err.message : err)); });
      },
      sending: st.sending,
      sentFg: st.sentOk ? 'var(--gr)' : '#FF5A75',
      sentBg: st.sentOk ? 'rgba(34,197,94,.08)' : 'rgba(225,29,58,.08)',
      sentBc: st.sentOk ? 'rgba(34,197,94,.3)' : 'rgba(225,29,58,.3)',
      sent: st.sent, sentMsg: st.sentText,
      q: st.q, setQ: function (e) { self.setState({ q: e.target.value }); },
      found: found.map(function (s) { var c = catOf(s.id); return { id: s.id, name: s.name, priceTxt: s.priceTxt, pick: set({ plat: s.p, cat: c ? c.v : '', svcId: s.id, tab: 'new', open: '', sent: false }) }; }),

      /* services */
      sq: st.sq, setSq: function (e) { self.setState({ sq: e.target.value }); },
      sCatOpen: st.sOpen === 'cat',
      toggleSCat: set({ sOpen: st.sOpen === 'cat' ? '' : 'cat' }),
      sCatLabel: st.scat === 'all' ? 'Kategori' : (cats.filter(function (c) { return c.v === st.scat; })[0] || {}).t,
      sCatOpts: (st.sOpen === 'cat' ? [{ v: 'all', t: 'Semua Kategori', icon: I.all, bg: 'var(--b5)' }].concat(cats) : []).map(function (c) { var on = st.scat === c.v; return { t: c.t, icon: c.icon, bg: c.bg, on: on, rowBg: on ? 'var(--r3)' : 'transparent', pick: set({ scat: c.v, sOpen: '' }) }; }),
      fOpen: st.fOpen, fd: st.fd, mainZ: st.fOpen ? '60' : '1',
      fCount: (function () { var a = st.fa, n = a.ct.length + a.pl.length + a.ty.length + (a.kw.trim() ? 1 : 0) + (a.pmin !== '' || a.pmax !== '' ? 1 : 0); return n || false; })(),
      openF: function () { self.setState({ fOpen: true, fd: JSON.parse(JSON.stringify(st.fa)), sOpen: '' }); },
      closeF: set({ fOpen: false }),
      applyF: function () { self.setState({ fOpen: false, fa: JSON.parse(JSON.stringify(st.fd)) }); },
      clearF: function () { var e = { kw: '', pmin: '', pmax: '', ct: [], pl: [], ty: [] }; self.setState({ fOpen: false, fd: e, fa: JSON.parse(JSON.stringify(e)) }); },
      fSetKw: function (e) { self.setState({ fd: Object.assign({}, st.fd, { kw: e.target.value }) }); },
      fSetMin: function (e) { self.setState({ fd: Object.assign({}, st.fd, { pmin: e.target.value }) }); },
      fSetMax: function (e) { self.setState({ fd: Object.assign({}, st.fd, { pmax: e.target.value }) }); },
      fGroups: [
        ['ct', 'Negara', 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18', [['id', 'Indonesia'], ['ww', 'Worldwide'], ['us', 'USA'], ['br', 'Brazil'], ['tr', 'Turkey'], ['kr', 'Korea'], ['th', 'Thailand'], ['de', 'Germany'], ['uk', 'UK']]],
        ['pl', 'Platform', 'M5 21V4h11l-1 4 4 1v8H9l-1-3H5', [['ig', 'Instagram'], ['fb', 'Facebook'], ['tt', 'TikTok'], ['yt', 'YouTube'], ['tw', 'Twitter / X'], ['sp', 'Spotify'], ['tg', 'Telegram'], ['google', 'Google'], ['seo', 'SEO'], ['web', 'Website Traffic']]],
        ['ty', 'Jenis Layanan', 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z', [['Likes', 'Likes'], ['Views', 'Views'], ['Followers', 'Followers'], ['Subscribers', 'Subscribers'], ['Comments', 'Komentar'], ['Members', 'Members'], ['Plays', 'Plays'], ['Live Views', 'Live Views']]]
      ].map(function (g) {
        return { t: g[1], icon: g[2], chips: g[3].map(function (c) {
          var on = st.fd[g[0]].indexOf(c[0]) > -1;
          return { t: c[1], on: on, bg: on ? 'var(--accent)' : 'var(--s2)', fg: on ? '#FFFFFF' : 'var(--t2)', bc: on ? 'var(--accent)' : 'var(--b5)',
            toggle: function () { var arr = st.fd[g[0]].slice(); var i = arr.indexOf(c[0]); if (i > -1) arr.splice(i, 1); else arr.push(c[0]); var d = Object.assign({}, st.fd); d[g[0]] = arr; self.setState({ fd: d }); } };
        }) };
      }),
      sGroups: batasiGrup(sGroups, st.sLimit), sEmpty: sGroups.length === 0, sSisa: Math.max(0, totalGrup(sGroups) - st.sLimit), sMuatLebih: function () { self.setState({ sLimit: st.sLimit + 40 }); },

      /* orders */
      oq: st.oq, setOq: function (e) { self.setState({ oq: e.target.value }); },
      ofOpen: st.ofOpen, toggleOF: set({ ofOpen: !st.ofOpen }),
      ofLabel: ofDef.filter(function (o) { return o[0] === st.ostat; })[0][1],
      ofOpts: ofDef.map(function (o) { var on = st.ostat === o[0]; return { t: o[1], on: on, rowBg: on ? 'var(--r3)' : 'transparent', pick: set({ ostat: o[0], ofOpen: false }) }; }),
      orders: orders, oEmpty: orders.length === 0,

      /* refunds */
      rq: st.rq, setRq: function (e) { self.setState({ rq: e.target.value }); }, refunds: refunds, rEmpty: refunds.length === 0,

      /* add funds */
      amts: amtList.map(function (a) { var on = st.amtKey === a; var s2 = segStyle(on); return { t: a === 'custom' ? 'Custom' : 'Rp ' + fmt(a), on: on, bg: s2.bg, fg: s2.fg, pick: set({ amtKey: a, paid: false }) }; }),
      amtVal: amtVal, amtKurang: amtVal !== '' && !(amtN >= 10000), amtFmt: !isNaN(amtN) && amtN > 0 ? 'Rp ' + fmt(amtN) : '',
      amtBc: st.amtKey === 'custom' ? 'var(--accent)' : 'var(--b3)',
      setAmt: function (e) { self.setState({ amtKey: 'custom', amtCustom: e.target.value, paid: false }); },
      mOpen: st.mOpen, toggleM: set({ mOpen: !st.mOpen }),
      met: met,
      mets: mets.map(function (m) { var on = m.v === met.v; return { t: m.t, badge: m.badge, on: on, rowBg: on ? 'var(--r3)' : 'transparent', pick: set({ met: m.v, mOpen: false, paid: false }) }; }),
      payFunds: function (e) {
        if (e && e.preventDefault) e.preventDefault();
        if (isNaN(amtN) || amtN < 10000 || st.bayarBusy) return;
        self.setState({ bayarBusy: true });
        fetch('/api/deposits?as=user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nominal: amtN }) })
          .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
          .then(function (res) {
            if (!res.ok) { self.setState({ bayarBusy: false }); self.tampilkanToast(false, res.d.error || 'Gagal membuat permintaan.'); return; }
            var x = res.d.deposit;
            if (res.d.bayarUrl) { try { localStorage.setItem('sg_dep_pending', x.id); } catch (e) {} window.location.href = res.d.bayarUrl; return; }
            self.setState({ bayarBusy: false, paid: true, bayarUrl: res.d.bayarUrl || '', lastDep: x.id, cekMsg: '', depErr: '', payHist: [{ id: x.id, tgl: String(x.dibuat).slice(0, 16).replace('T', ' '), metode: x.metode, jumlah: x.nominal, status: x.label }].concat(st.payHist) });
          })
          .catch(function (err) { self.setState({ bayarBusy: false }); self.tampilkanToast(false, String(err && err.message ? err.message : err)); });
      },
      dHistOpen: st.dHistOpen, openDHist: set({ dHistOpen: true }), closeDHist: set({ dHistOpen: false }),
      dh: {
        title: T('Riwayat pembayaran', 'Payment history'), empty: T('Belum ada riwayat pembayaran', 'No payment history'),
        emptySub: T('Kamu belum pernah melakukan pembayaran.', 'You have not made any payments yet.'), addFunds: T('Isi saldo', 'Add funds'), close: T('Tutup', 'Close')
      },
      dhRows: st.payHist.map(function (p) {
        var lbl = { Berhasil: T('Berhasil', 'Success'), Menunggu: T('Menunggu', 'Pending'), Gagal: T('Gagal', 'Failed') }[p.status] || p.status;
        var c = { Berhasil: '#22C55E', Menunggu: '#F59E0B', Gagal: '#FF5A75' }[p.status] || 'var(--t3)';
        var pill = { Berhasil: '#14532D', Menunggu: '#78350F', Gagal: '#7F1D1D' }[p.status] || '#27272A';
        return { id: p.id, tgl: p.tgl, metode: p.metode, jumlah: st.cur === 'IDR' ? 'Rp ' + fmt(p.jumlah) : '$ ' + (p.jumlah / (st.kurs || 16000)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), status: lbl, c: c, pill: pill };
      }),
      paid: st.paid, bayarBusy: st.bayarBusy, bayarUrl: st.bayarUrl, uname: st.username || '—', notifList: st.notifList, notifUnread: st.notifUnread, notifWaktu: function (iso) { var t = new Date(iso).getTime(); return Number.isNaN(t) ? '' : new Date(t + 7 * 3600 * 1000).toISOString().slice(0, 16).replace('T', ' ') + ' WIB'; }, toast: st.toast, closeToast: function () { self.tutupToast(); }, uemail: st.email || '—', uinit: (st.username || '?').charAt(0).toUpperCase(), rankName: st.peringkat && st.peringkat.index !== undefined ? st.peringkat.tiers[st.peringkat.index].nama : '—', bonusTxt: bonusDariPeringkat(st.peringkat) > 0 ? 'Bonus ' + bonusDariPeringkat(st.peringkat) + '% untuk setiap deposit sesuai peringkat kamu. Biaya QRIS ditanggung kamu.' : 'Biaya QRIS ditanggung kamu.', bonusJudul: bonusDariPeringkat(st.peringkat) > 0 ? 'Bonus Deposit ' + bonusDariPeringkat(st.peringkat) + '%' : 'Bonus Deposit', bonusDesk: bonusDariPeringkat(st.peringkat) > 0 ? 'Setiap deposit yang disetujui otomatis mendapat bonus ' + bonusDariPeringkat(st.peringkat) + '% sesuai peringkat kamu, dan masuk ke saldo bersama nominal deposit.' : 'Peringkat kamu saat ini belum mendapat bonus deposit. Naik peringkat untuk mendapat bonus.', lastDep: st.lastDep, cekMsg: st.cekMsg, cekBayar: function () { self.cekBayar(); }, depErr: st.depErr, saldo: st.saldo,

      /* tickets */
      tcats: tcatDef.map(function (c) { var on = st.tcat === c[0]; var s2 = segStyle(on); return { t: c[1], on: on, bg: s2.bg, fg: s2.fg, pick: set({ tcat: c[0], tsub: tsubDef[c[0]][0][0], tsent: false }) }; }),
      tsubs: tsubDef[st.tcat].map(function (c) { var on = st.tsub === c[0]; var s2 = segStyle(on); return { t: c[1], on: on, bg: s2.bg, fg: s2.fg, pick: set({ tsub: c[0], tsent: false }) }; }),
      tNeedsId: st.tcat === 'order',
      tid: st.tid, setTid: function (e) { self.setState({ tid: e.target.value }); },
      tmsg: st.tmsg, setTmsg: function (e) { self.setState({ tmsg: e.target.value }); },
      tfile: st.tfile, hapusFile: function () { self.setState({ tfile: null }); },
      pilihFile: function (e) {
        var f = e.target.files && e.target.files[0];
        e.target.value = '';
        if (!f) return;
        if (['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].indexOf(f.type) < 0) { self.tampilkanToast(false, 'Lampiran harus JPG, PNG, WEBP, atau PDF.'); return; }
        if (f.size > 300 * 1024) { self.tampilkanToast(false, 'Ukuran lampiran maksimal 300 KB.'); return; }
        var reader = new FileReader();
        reader.onload = function () { self.setState({ tfile: { nama: f.name, tipe: f.type, data: reader.result } }); };
        reader.readAsDataURL(f);
      },
      sendTicket: function (e) {
        if (e && e.preventDefault) e.preventDefault();
        if (!st.tmsg.trim()) return;
        fetch('/api/tickets?as=user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kategori: st.tcat, sub: st.tsub, orderId: st.tcat === 'order' ? st.tid.trim() : '', pesan: st.tmsg.trim(), lampiran: st.tfile || undefined }) })
          .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
          .then(function (res) {
            if (!res.ok) { self.tampilkanToast(false, res.d.error || 'Tiket gagal dikirim.'); return; }
            self.setState({ tsent: false, tmsg: '', tfile: null, tid: '', page: 'ticket', viewT: res.d.ticket.id });
            self.tampilkanToast(true, 'Tiket terkirim. Tim support akan membalas secepatnya.');
            self.muatTiket();
          })
          .catch(function () { self.tampilkanToast(false, 'Tiket gagal dikirim. Coba lagi.'); });
      },
      tHistOpen: st.tHistOpen, openTHist: set({ tHistOpen: true }), closeTHist: set({ tHistOpen: false }),
      tlist: st.tickets.map(function (t) { var m = TS[t.status]; return { id: t.id, title: tTitle(t), updated: t.updated, unread: t.unread, sTxt: m[0], sBg: m[1], sFg: m[2],
        open: function () { self.setState({ tickets: st.tickets.map(function (x) { return x.id === t.id ? Object.assign({}, x, { unread: false }) : x; }), tHistOpen: false, page: 'ticket', viewT: t.id, hdd: '' }); self.bacaTiket(t.id); } }; }),
      vt: vt ? { id: vt.id, title: tTitle(vt), orderId: vt.orderId || false, msgs: vt.msgs.map(function (m, i) { return { mine: m.from === 'user', support: m.from === 'support', first: i === 0, text: m.text, time: m.time, lampiran: m.lampiran, sNama: st.support.nama, sInisial: st.support.inisial }; }) } : { id: '', title: '', orderId: false, msgs: [] },
      vtClosed: !!vt && vt.msgs[vt.msgs.length - 1].from === 'user',
      replyTxt: st.replyTxt, setReply: function (e) { self.setState({ replyTxt: e.target.value }); },
      sendReply: function (e) {
        if (e && e.preventDefault) e.preventDefault();
        if (!vt || !st.replyTxt.trim()) return;
        var teks = st.replyTxt.trim();
        self.setState({ replyTxt: '' });
        fetch('/api/tickets?as=user', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: vt.id, aksi: 'balas', text: teks }) })
          .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
          .then(function (res) {
            if (!res.ok) { self.tampilkanToast(false, res.d.error || 'Balasan gagal dikirim.'); self.setState({ replyTxt: teks }); return; }
            self.tampilkanToast(true, 'Balasan terkirim.');
            self.muatTiket();
          })
          .catch(function () { self.tampilkanToast(false, 'Balasan gagal dikirim. Coba lagi.'); self.setState({ replyTxt: teks }); });
      },
      goTicketsBack: set({ page: 'tickets', tHistOpen: true }),
      tsent: st.tsent,

      /* mass order */
      massTxt: st.massTxt, setMass: function (e) { self.setState({ massTxt: e.target.value, massRes: null }); },
      sendMass: function (e) {
        if (e && e.preventDefault) e.preventDefault();
        var lines = st.massTxt.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
        var ok = 0, bad = [], total = 0;
        lines.forEach(function (l, i) {
          var p = l.split('|').map(function (x) { return x.trim(); });
          var sv = byId[parseInt(p[0], 10)] || { name: 'Layanan ' + p[0], icon: I.all, price: 0 }, q = parseInt(p[2], 10);
          if (p.length !== 3 || !sv || !/^https?:\/\//.test(p[1]) || isNaN(q) || q < sv.min || q > sv.max) bad.push(i + 1);
          else { ok++; total += sv.price * q / 1000; }
        });
        self.setState({ massRes: { ok: ok, bad: bad, total: total, empty: lines.length === 0 } });
      },
      massRes: !!st.massRes,
      massMsg: !st.massRes ? '' : st.massRes.empty ? 'Isi minimal satu baris pesanan.' : ('✓ ' + st.massRes.ok + ' pesanan valid — total Rp ' + fmt(st.massRes.total) + ' (perkiraan)' + (st.massRes.bad.length ? '\n✕ Baris bermasalah: ' + st.massRes.bad.join(', ') + ' (cek ID layanan, link, atau jumlah min/maks)' : '')),
      massBg: st.massRes && (st.massRes.bad.length || st.massRes.empty) ? 'rgba(var(--accent-rgb),.08)' : 'rgba(34,197,94,.08)',
      massBc: st.massRes && (st.massRes.bad.length || st.massRes.empty) ? 'var(--r5)' : 'rgba(34,197,94,.3)',
      massFg: st.massRes && (st.massRes.bad.length || st.massRes.empty) ? 'var(--rt2)' : 'var(--gr)',

      /* affiliates */
      affGagal: st.affGagal, refLink: st.aff ? (typeof window !== 'undefined' ? window.location.origin : '') + '/register?ref=' + encodeURIComponent(st.aff.username) : '',
      affStats: [['Rate komisi', st.aff ? st.aff.persen + '%' : '—'], ['Minimal penarikan', 'Rp ' + fmt(st.aff ? st.aff.minTarik : 10000)], ['Pendaftaran', String(st.aff ? st.aff.pendaftaran : 0)], ['Total pendapatan', 'Rp ' + fmt(st.aff ? st.aff.komisiTotal : 0)], ['Pendapatan tersedia', 'Rp ' + fmt(st.aff ? st.aff.komisi : 0)]].map(function (a) { return { l: a[0], v: a[1] }; }),
      minTarikTxt: 'Rp ' + fmt(st.aff ? st.aff.minTarik : 10000),
      afiliasiTxt: 'Bagikan link ini. Setiap kali orang yang kamu ajak isi saldo, kamu dapat komisi ' + (st.aff ? st.aff.persen : 5) + '% dari depositnya. Komisi bisa dipindah ke saldo untuk belanja layanan.',
      wdJumlah: st.wdJumlah, setWdJumlah: function (e) { self.setState({ wdJumlah: e.target.value }); },
      wdTujuan: st.wdTujuan, setWdTujuan: function (e) { self.setState({ wdTujuan: e.target.value }); },
      wdBusy: st.wdBusy, tarikKomisi: function () { self.tarikKomisi(); },
      wdList: (st.aff ? st.aff.penarikan : []).map(function (p) {
        var s = { menunggu: ['Menunggu ⏱', 'rgba(245,158,11,.12)', 'var(--am)'], disetujui: ['Berhasil ✓', 'rgba(34,197,94,.12)', 'var(--gr)'], ditolak: ['Ditolak ✕', '#7A1022', '#FFFFFF'] }[p.status] || ['—', 'var(--s3)', 'var(--t3)'];
        return { id: p.id, jumlah: 'Rp ' + fmt(p.jumlah), tujuan: p.tujuan, tgl: String(p.dibuat).slice(0, 16).replace('T', ' '), statusTxt: s[0], statusBg: s[1], statusFg: s[2] };
      }),
      copyTxt: st.copied ? 'Tersalin!' : 'Salin Link',
      copyRef: function () { try { navigator.clipboard.writeText(st.aff ? (typeof window !== 'undefined' ? window.location.origin : '') + '/register?ref=' + encodeURIComponent(st.aff.username) : ''); } catch (e) {} self.setState({ copied: true }); },
      goAff: go('affiliates'), goAccount: go('account'),
      setIc: st.page === 'account' ? '#FFFFFF' : ('currentColor'), setBg: st.page === 'account' ? 'var(--accent)' : 'transparent', setFg: st.page === 'account' ? '#FFFFFF' : 'var(--t3)',

      /* account */
      atabs: atabDef.map(function (t) { var on = st.atab === t[0]; return { t: t[1], icon: t[3], cur: on ? 'page' : 'false', bg: on ? 'var(--s2)' : 'transparent', fg: on ? 'var(--hi)' : 'var(--t3)', bc: on ? 'var(--b5)' : 'transparent', pick: set({ atab: t[0] }) }; }),
      atab: { t: atabCur[1], sub: atabCur[2] },
      aIs: { security: st.atab === 'security', twofa: st.atab === 'twofa', ux: st.atab === 'ux', tzapi: st.atab === 'tzapi', invoice: st.atab === 'invoice', notif: st.atab === 'notif' },
      savePw: function (e) { if (e && e.preventDefault) e.preventDefault(); self.gantiPassword(); }, pwF: st.pwForm, pwSet: function (k) { return function (e) { var f = Object.assign({}, self.state.pwForm); f[k] = e.target.value; self.setState({ pwForm: f }); }; }, pwSaved: st.pwSaved,
      saveEmail: function (e) { if (e && e.preventDefault) e.preventDefault(); self.gantiEmail(); }, emF: st.emForm, emSet: function (k) { return function (e) { var f = Object.assign({}, self.state.emForm); f[k] = e.target.value; self.setState({ emForm: f }); }; }, bannerTxt: st.atab === 'security' || st.atab === 'twofa' ? '' : st.atab === 'ux' ? 'Zona waktu tersimpan, tapi belum dipakai untuk menampilkan waktu.' : st.atab === 'notif' ? 'Preferensi tersimpan. Pengiriman notifikasi belum tersedia.' : st.atab === 'tzapi' ? 'Zona waktu tersimpan, tapi belum dipakai untuk menampilkan waktu.' : st.atab === 'invoice' ? 'Detail tersimpan. Invoice belum tersedia, jadi detail ini belum tampil di mana pun.' : 'Belum tersedia. Pengaturan ini belum tersambung ke server, jadi perubahan di sini belum tersimpan.', emSaved: st.emSaved,
      twofa: st.twofa, toggle2fa: set({ twofa: !st.twofa }), swBg: st.twofa ? 'var(--accent)' : 'var(--b5)', swLeft: st.twofa ? '21px' : '3px',
      langs: [['id', 'Bahasa Indonesia'], ['en', 'English']].map(function (c) { var on = st.lang === c[0], s2 = segStyle(on); return { t: c[1], on: on, bg: s2.bg, fg: s2.fg, pick: set({ lang: c[0] }) }; }),
      curSeg: [['IDR', 'Rupiah (IDR)'], ['USD', 'Dolar (USD)']].map(function (c) { var on = st.cur === c[0], s2 = segStyle(on); return { t: c[1], on: on, bg: s2.bg, fg: s2.fg, pick: set({ cur: c[0] }) }; }),
      tzs: [['WIB', 'WIB (UTC+7)'], ['WITA', 'WITA (UTC+8)'], ['WIT', 'WIT (UTC+9)']].map(function (c) { var on = st.tz === c[0], s2 = segStyle(on); return { t: c[1], on: on, bg: s2.bg, fg: s2.fg, pick: set({ tz: c[0] }) }; }),
      apiKey: st.apiBaru || (st.apiInfo ? st.apiInfo.awal + '••••••••••••••••••••••••' : 'Belum ada API key'), apiInfoTxt: st.apiInfo && st.apiInfo.dibuat ? 'Dibuat: ' + String(st.apiInfo.dibuat).slice(0, 16).replace('T', ' ') : '',
      regenKey: function () { self.buatApiKey(); }, mfa: { aktif: st.mfaAktif, setup: st.mfaSetup, kode: st.mfaKode, setKode: function (e) { self.setState({ mfaKode: e.target.value.replace(/D/g, '').slice(0, 6) }); }, mulai: function () { self.mulaiMfa(); }, konfirmasi: function () { self.konfirmasiMfa(); }, nonaktifkan: function () { self.nonaktifkanMfa(); } },
      tzValue: st.tz, setTz: function (e) { self.setState({ tz: e.target.value }); },
      tzOpts: [['WIB', 'WIB (UTC+7)'], ['WITA', 'WITA (UTC+8)'], ['WIT', 'WIT (UTC+9)']],
      saveInv: function (e) { if (e && e.preventDefault) e.preventDefault(); self.simpanPref({ invoice: st.invText }); self.tampilkanToast(true, 'Detail invoice tersimpan.'); }, invText: st.invText, setInvText: function (e) { self.setState({ invText: e.target.value }); }, invSaved: st.invSaved,
      notifs: [['order', 'Status pesanan', 'Kabari saat pesanan selesai atau dibatalkan'], ['deposit', 'Deposit', 'Kabari saat saldo masuk'], ['ticket', 'Balasan tiket', 'Kabari saat admin membalas tiket'], ['promo', 'Promo & layanan baru', 'Info diskon dan layanan terbaru']].map(function (n) {
        var on = !!st.notif[n[0]];
        return { t: n[1], d: n[2], on: on, bg: on ? 'var(--accent)' : 'var(--b5)', left: on ? '21px' : '3px', toggle: function () { var x = Object.assign({}, st.notif); x[n[0]] = !on; self.setState({ notif: x }); } };
      })
    };
  }

  render() {
    const v = this.renderVals();
    /* Layar pemuatan sampai data utama siap, supaya tidak ada angka kosong yang berkedip sebelum data masuk. */
    if (!this.state.siap) {
      return (
        <div role="status" aria-live="polite" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "18px", background: "#0A0A0C", color: "#F4F4F5", fontFamily: "Inter, system-ui, sans-serif" }}>
          <Head><style>{"html,body{margin:0;background:#0A0A0C}"}</style></Head>
          <style>{"@keyframes sgNaik{0%,100%{transform:translateY(0);opacity:.85}50%{transform:translateY(-6px);opacity:1}}@keyframes sgBerputar{to{transform:rotate(360deg)}}"}</style>
          <img src="/icon.png" alt="" width="56" height="56" style={{ borderRadius: "14px", animation: "sgNaik 1.6s ease-in-out infinite" }} />
          <div style={{ width: "26px", height: "26px", borderRadius: "50%", border: "3px solid #26262E", borderTopColor: "#E11D3A", animation: "sgBerputar .8s linear infinite" }} />
          <div style={{ fontSize: "13px", color: "#9A9AA5" }}>Memuat dashboard...</div>
        </div>
      );
    }
    return (
      <>
        <Head>
          <title>SosmedGo — Panel</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" />
        </Head>
        <style jsx global>{`
.theme-dark{--bg:#0B0B0E;--s1:#111115;--s2:#141418;--s0:#0D0D10;--s3:#16161A;--s4:#1E1E23;--b1:#18181D;--b2:#1E1E24;--b3:#23232A;--b4:#26262C;--b5:#2A2A30;--b6:#3A3A42;--tx:#F4F4F5;--t1:#E4E4E7;--t2:#C9CBD1;--t3:#A1A3AB;--t4:#8B8D96;--t5:#6B6E78;--t6:#4B4D56;--r1:#1A0A0E;--r2:#1F0B10;--r3:#2A0E14;--r4:#3A121B;--r5:#5A1A26;--r6:#2A1218;--rt:var(--accent-l);--rt2:#FFB3C0;--g1:#130A0D;--g2:#3A0E18;--gr:#22C55E;--am:#F59E0B;--bl:#60A5FA;--hi:#FFFFFF}
.theme-light{--bg:#FFFFFF;--s1:#FFFFFF;--s2:#FFFFFF;--s0:#FFFFFF;--s3:#F1F5F9;--s4:#E2E8F0;--b1:#F1F5F9;--b2:#E2E8F0;--b3:#E2E8F0;--b4:#CBD5E1;--b5:#CBD5E1;--b6:#94A3B8;--tx:#0F172A;--t1:#1E293B;--t2:#334155;--t3:#475569;--t4:#64748B;--t5:#94A3B8;--t6:#CBD5E1;--r1:#FFF0F2;--r2:#FFF0F2;--r3:#FFE3E8;--r4:#FBC9D3;--r5:#F5A3B3;--r6:#FBD5DC;--rt:var(--accent);--rt2:#9F1239;--g1:#FFF3F5;--g2:#FFE4EA;--gr:#15803D;--am:#B45309;--bl:#2563EB;--hi:#0F172A}
.theme-dark{--segbg:#0D0D10}.theme-light{--segbg:#F4F5F7}
.theme-light .dethead{background:linear-gradient(180deg,#FFF1F3 0%,#FFFFFF 100%) !important;border-bottom-color:#EEF0F3 !important}
.theme-light .card{border-color:#E2E8F0}
.theme-light .inp,.theme-light .dd{border-color:#E6E8EC}
.theme-light .card,.theme-light .menu,.theme-light .ddpanel{box-shadow:0 4px 16px rgba(16,24,40,.07)}
.theme-light .dash-head{background:linear-gradient(180deg,rgba(var(--accent-rgb),.06) 0%,rgba(var(--accent-rgb),0) 100%)}
body{margin:0;background:var(--bg)}
a{color:var(--t2);text-decoration:none}a:hover{color:var(--hi)}
button{font-family:inherit}
.sb{width:100%;display:flex;align-items:center;gap:12px;font-size:13px;font-weight:500;color:var(--t3);padding:11px 12px;border-radius:12px;border:none;background:transparent;cursor:pointer;text-align:left;min-height:44px}
.sb:hover{background:var(--s3);color:var(--hi)}
.card{background:var(--s1);border:1px solid var(--b2);border-radius:16px}
.ibtn{width:38px;height:38px;border-radius:10px;background:var(--s2);border:1px solid var(--b3);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t2)}
.ibtn:hover{border-color:var(--b6)}
.ptab{border:1px solid var(--b3);background:var(--s1);color:var(--t2);font-size:12px;font-weight:600;border-radius:10px;padding:12px 10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;min-height:44px}
svg:not(.logo-mark)[stroke="#FF5A75"],svg:not(.logo-mark) [stroke="#FF5A75"]{stroke:var(--accent-l)}
svg:not(.logo-mark)[stroke="#E11D3A"],svg:not(.logo-mark) [stroke="#E11D3A"]{stroke:var(--accent)}
.ux-grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:6px}
.ux-grid5{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
@media (max-width:640px){.ux-grid5{grid-template-columns:repeat(3,minmax(0,1fr))}}
.ux-card{background:var(--s1);border:2px solid var(--b3);border-radius:14px;padding:10px;cursor:pointer;display:flex;flex-direction:column;gap:10px;font-family:inherit;color:var(--t1)}
.ux-card:hover{border-color:var(--b6)}
.ux-prev{position:relative;display:block;height:72px;border-radius:8px;border:1px solid var(--b3);overflow:hidden}
.ux-bar{position:absolute;left:0;right:0;top:0;height:8px}
.ux-side{position:absolute;left:8px;top:16px;bottom:8px;width:24%;border-radius:4px}
.ux-dot{position:absolute;right:10px;bottom:10px;width:12px;height:12px;border-radius:50%}
.ux-name{font-size:12px;font-weight:600}
.plat-grid{display:grid;grid-template-columns:repeat(var(--plat-cols,6),minmax(0,1fr));gap:8px}
.plat-grid .ptab{width:100%;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:12px 8px}
.nav-toggle{display:none;align-items:center;justify-content:center;width:38px;height:38px;flex:none;border-radius:10px;background:var(--s2);border:1px solid var(--b3);color:var(--t2);cursor:pointer}
@media (max-width:1100px){.plat-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (max-width:900px){
  .nav-toggle{display:inline-flex}
  .dash-crumb{flex:1 1 auto;min-width:0}
  .dash-aside{display:none !important}
  .dash-aside.buka{display:flex !important;flex:1 1 100% !important;max-width:none !important;border-right:0 !important;border-bottom:1px solid var(--b1) !important}
  .dash-head{padding:12px 16px !important}
  .dash-main{padding:18px 16px 48px !important;flex:1 1 100% !important;width:100% !important;min-width:0 !important;max-width:100% !important;box-sizing:border-box !important;overflow-x:hidden !important}
  html,body{max-width:100vw !important;overflow-x:hidden !important;background:#0A0A0C !important}
}
@media (max-width:640px){
  /* iOS memperbesar halaman kalau font input di bawah 16px. */
  .inp,.ta,input,select,textarea{font-size:16px !important}
  .dash-main{gap:16px !important}
  .dash-theme-lbl{display:none !important}
  .aff-card{margin-top:0 !important}
  .dash-head{flex-wrap:wrap !important;gap:8px !important}
  .seg{flex:1 1 0 !important;min-width:0 !important;padding:10px 6px !important;font-size:12px !important;white-space:nowrap !important;overflow:hidden !important;text-overflow:ellipsis}
}
@media (max-width:640px){.plat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
.ptab:hover{border-color:var(--r5);color:var(--hi)}
.seg{flex:1;border:none;font-size:12px;font-weight:600;border-radius:8px;padding:11px 14px;cursor:pointer;min-height:42px}
.lbl{display:block;font-size:12px;font-weight:600;color:var(--t1);margin:18px 0 8px}
.inp{width:100%;box-sizing:border-box;height:46px;background:var(--s0);border:1px solid var(--b3);border-radius:10px;padding:0 14px;color:var(--hi);font-family:inherit;font-size:13px;outline:none}
.inp:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(var(--accent-rgb),.15)}
.inp::placeholder{color:var(--t6)}
.dd{width:100%;box-sizing:border-box;height:46px;display:flex;align-items:center;gap:10px;background:var(--s0);border:1px solid var(--b3);border-radius:10px;padding:0 14px 0 8px;color:var(--hi);font-size:13px;font-weight:500;cursor:pointer;text-align:left}
.dd:hover{border-color:var(--b6)}
.ddic{width:28px;height:28px;flex:none;border-radius:8px;display:flex;align-items:center;justify-content:center}
.idpill{flex:none;font-size:11px;font-weight:700;color:var(--rt);background:var(--r3);border:1px solid var(--r5);border-radius:999px;padding:3px 10px}
.ddpanel{position:absolute;left:0;right:0;top:52px;z-index:30;background:var(--s2);border:1px solid var(--b5);border-radius:12px;padding:6px;max-height:300px;overflow:auto;box-shadow:0 24px 50px rgba(0,0,0,.6)}
.ddopt{width:100%;display:flex;align-items:center;gap:10px;border:none;border-radius:8px;padding:8px 10px;min-height:42px;color:var(--t1);font-size:13px;text-align:left;cursor:pointer;background:transparent}
.ddopt:hover{background:var(--s4)}
.submit{height:48px;border-radius:10px;border:1px solid var(--accent);background:var(--accent);color:#FFFFFF;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 10px 26px rgba(var(--accent-rgb),.3)}
.submit:hover{background:var(--accent-h)}
.ghost{height:40px;border-radius:10px;border:1px solid var(--b5);background:var(--s1);color:var(--t1);font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;padding:0 16px}
.ghost:hover{border-color:var(--r5)}
.pill{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:600;border-radius:999px;padding:6px 12px;white-space:nowrap}
.ocircle{width:26px;height:26px;flex:none;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center}
.chip{display:inline-flex;align-items:center;gap:8px;height:40px;border:1px solid var(--b3);background:var(--s1);border-radius:999px;padding:0 14px 0 6px;color:var(--hi);font-size:13px;font-weight:600;cursor:pointer}
.chip:hover{border-color:var(--b6)}
.menu{position:absolute;right:0;top:46px;z-index:40;background:var(--s2);border:1px solid var(--b5);border-radius:12px;padding:6px;box-shadow:0 24px 50px rgba(0,0,0,.6)}
.mi{width:100%;display:flex;align-items:center;gap:10px;border:none;border-radius:8px;padding:9px 10px;min-height:40px;background:transparent;color:var(--t1);font-size:13px;font-weight:500;cursor:pointer;text-align:left}
.mi:hover{background:var(--s4)}
.atab{width:100%;display:flex;align-items:center;gap:10px;border:1px solid transparent;border-radius:10px;padding:10px 12px;min-height:44px;background:transparent;color:var(--t3);font-size:12px;font-weight:600;cursor:pointer;text-align:left}
.atab:hover{color:var(--hi);background:var(--s2)}
.sw{width:44px;height:26px;border-radius:999px;border:none;cursor:pointer;position:relative;flex:none}
.sw span{position:absolute;top:3px;width:20px;height:20px;border-radius:50%;background:#FFFFFF;transition:left .15s}
`}</style>
      <div className={v.themeCls} style={{ ...v.accentVars, fontFamily: "'Inter',system-ui,sans-serif", color: "var(--tx)", background: "var(--bg)", minHeight: "100vh", display: "flex", flexWrap: "wrap" }}>
        <aside className={"dash-aside" + (v.navOpen ? " buka" : "")} style={{ flex: "1 1 230px", maxWidth: "250px", minWidth: "0", borderRight: "1px solid var(--b1)", padding: "22px 16px", display: "flex", flexDirection: "column", gap: "2px", boxSizing: "border-box", position: "sticky", top: "0", alignSelf: "flex-start", height: "100vh", overflowX: "hidden", overflowY: "auto" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "22px", padding: "6px" }}>
            <img src="/icon.png" alt="" aria-hidden="true" className="logo-mark" width="24" height="24" style={{ borderRadius: "8px", display: "block" }} />
            <span style={{ fontSize: "17px", fontWeight: "800", color: "var(--hi)", letterSpacing: "-.03em" }}>
              SosmedGo
            </span>
          </Link>
          <div style={{ position: "relative", marginBottom: "14px" }}>
            <button type="button" onClick={v.toggleSide} aria-haspopup="menu" aria-expanded={v.sideOpen} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", background: "var(--s2)", border: `1px solid ${v.sideBc}`, borderRadius: "12px", padding: "10px", cursor: "pointer", color: "var(--hi)", textAlign: "left", fontFamily: "inherit" }}>
              <span style={{ width: "32px", height: "32px", borderRadius: "9px", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "800" }}>
                A
              </span>
              <span style={{ flex: "1", lineHeight: "1.35" }}>
                <span style={{ display: "block", fontSize: "10px", color: "var(--t5)" }}>
                  {v.tr.myAcc}
                </span>
                <span style={{ fontSize: "13px", fontWeight: "600" }}>
                  {v.uname}
                </span>
              </span>
              <FaIcon d="M6 9l6 6 6-6" size={14} style={{ color: "#A1A3AB", transform: v.sideRot }} />
            </button>
            {v.sideOpen ? (
              <>
                <div role="menu" className="menu" style={{ left: "0", right: "0", top: "62px", padding: "0", zIndex: "60" }}>
                  <div style={{ padding: "14px 14px 12px", borderBottom: "1px solid var(--b3)" }}>
                    <div style={{ fontSize: "13px", fontWeight: "700" }}>
                      {v.uname}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--t4)", marginTop: "2px" }}>
                      {v.uemail}
                    </div>
                    <button type="button" className="ghost" onClick={v.goAccount} style={{ width: "100%", justifyContent: "center", marginTop: "12px", height: "36px" }}>
                      {v.tr.view}
                    </button>
                  </div>
                  <div style={{ padding: "6px" }}>
                    <button type="button" role="menuitem" className="mi" onClick={v.goAff}>
                      <FaIcon d="M12 2l3 6.3 7 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 7-1z" size={15} style={{ color: "var(--t1)" }} />
                      {v.tr.aff}
                    </button>
                    <button type="button" role="menuitem" className="mi" onClick={v.goAccount}>
                      <FaIcon d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" size={15} style={{ color: "#F97316" }} />
                      {v.tr.acc}
                    </button>
                    <a role="menuitem" className="mi" href="/api/auth/logout">
                      <FaIcon d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" size={15} style={{ color: "var(--t1)" }} />
                      {v.tr.logout}
                    </a>
                  </div>
                </div>
              </>
            ) : null}
          </div>
          <nav aria-label="Menu panel" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {(v.menu1 || []).map((m, $index) => (
              <React.Fragment key={$index}>
                <button type="button" className="sb" onClick={m.go} aria-current={m.cur} style={{ background: m.bg, color: m.fg, boxShadow: m.sh, fontWeight: m.fw }}>
                  <i className={m.fa} aria-hidden="true" style={{ color: m.ic, flex: "none", width: "17px", textAlign: "center", fontSize: "16px" }} />
                  <span style={{ flex: "1" }}>
                    {m.t}
                  </span>
                  {m.badge ? (
                    <>
                      <span style={{ fontSize: "10px", fontWeight: "700", background: m.badgeBg, color: "#FFFFFF", borderRadius: "6px", padding: "2px 7px" }}>
                        {m.badge}
                      </span>
                    </>
                  ) : null}
                  {m.on ? (
                    <>
                      <FaIcon d="M9 6l6 6-6 6" size={14} />
                    </>
                  ) : null}
                </button>
              </React.Fragment>
            ))}
          </nav>
          <div style={{ height: "1px", background: "var(--b2)", margin: "14px 10px" }} />
          {(v.menu2 || []).map((m, $index) => (
            <React.Fragment key={$index}>
              <button type="button" className="sb" onClick={m.go}>
                <i className={m.fa} aria-hidden="true" style={{ color: m.ic, flex: "none", width: "17px", textAlign: "center", fontSize: "16px" }} />
                {m.t}
              </button>
            </React.Fragment>
          ))}
          <div style={{ height: "1px", background: "var(--b2)", margin: "14px 10px" }} />
          <button type="button" className="sb" onClick={v.goAccount} style={{ background: v.setBg, color: v.setFg }}>
            <FaIcon d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" size={17} style={{ color: v.setIc, flex: "none" }} />
            {v.tr.settings}
          </button>
          <a className="sb" href="/api/auth/logout">
            <FaIcon d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" size={17} />
            {v.tr.logout}
          </a>
        </aside>
        <div style={{ flex: "999 1 640px", minWidth: "0", display: "flex", flexDirection: "column" }}>
          <header className="dash-head" style={{ position: "relative", zIndex: "50", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "14px", padding: "18px 40px", borderBottom: "1px solid var(--b1)" }}>
            <button type="button" className="nav-toggle" onClick={v.toggleNav} aria-label="Menu" aria-expanded={v.navOpen}>
              <FaIcon d="M4 7h16M4 12h16M4 17h16" size={16} />
            </button>
            <div className="dash-crumb">
              <div style={{ fontSize: "13px", color: "var(--t2)" }}>
                {v.tr.home}{" "}
                <span style={{ color: "var(--t6)" }}>
                  ›
                </span>
                <span style={{ color: "var(--rt)", fontWeight: "600" }}>
                  {v.pg.crumb}
                </span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--t5)", marginTop: "4px" }}>
                {v.pg.hint}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button type="button" className="ibtn" onClick={v.toggleTheme} aria-label={v.tr.themeAria} style={{ width: "auto", padding: "0 12px", gap: "6px", fontSize: "11px" }}>
                {v.isDark ? (
                  <>
                    <FaIcon d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z" size={15} style={{ color: "var(--t1)" }} />
                  </>
                ) : null}
                {v.isLight ? (
                  <>
                    <i className="fa-solid fa-sun" aria-hidden="true" style={{ fontSize: 15, width: 15, display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center' }} />
                  </>
                ) : null}
                {" "}<span className="dash-theme-lbl">{v.tr.themeLbl}</span>{" "}
              </button>
              <button type="button" className="ibtn" onClick={v.openUpd} aria-label={v.tr.notif} aria-haspopup="dialog" style={{ position: "relative" }}>
                <FaIcon d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0" size={15} />
                {v.updUnread ? (
                  <>
                    <span style={{ position: "absolute", top: "8px", right: "9px", width: "7px", height: "7px", borderRadius: "50%", background: "var(--accent)" }} />
                  </>
                ) : null}
              </button>
              <div style={{ position: "relative" }}>
                <button type="button" className="ibtn" onClick={v.toggleLang} aria-label={v.tr.lang} aria-haspopup="menu" aria-expanded={v.langOpen} style={{ borderColor: v.langBc }}>
                  <i className="fa-solid fa-globe" aria-hidden="true" style={{ fontSize: 15, width: 15, display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center' }} />
                </button>
                {v.langOpen ? (
                  <>
                    <div role="menu" className="menu" style={{ width: "170px" }}>
                      {(v.langOpts || []).map((l, $index) => (
                        <React.Fragment key={$index}>
                          <button type="button" role="menuitemradio" aria-checked={l.on} className="mi" onClick={l.pick} style={{ background: l.bg, fontWeight: l.fw }}>
                            {l.t}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
              <div style={{ position: "relative" }}>
                <button type="button" className="chip" onClick={v.toggleBal} aria-haspopup="menu" aria-expanded={v.balOpen} style={{ borderColor: v.balBc }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--r3)", color: "var(--rt)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "800" }}>
                    {v.curSym}
                  </span>
                  ≈ {v.balTxt}{" "}
                  <FaIcon d="M6 9l6 6 6-6" size={13} />
                </button>
                {v.balOpen ? (
                  <>
                    <div role="menu" className="menu" style={{ width: "190px" }}>
                      <button type="button" role="menuitem" className="mi" onClick={v.goFunds} style={{ fontWeight: "700" }}>
                        ＋ Isi Saldo
                      </button>
                      {(v.curs || []).map((c, $index) => (
                        <React.Fragment key={$index}>
                          <button type="button" role="menuitemradio" aria-checked={c.on} className="mi" onClick={c.pick} style={{ background: c.bg }}>
                            <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "var(--r3)", color: "var(--rt)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "800" }}>
                              {c.sym}
                            </span>
                            {c.code}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
              <div style={{ position: "relative" }}>
                <button type="button" className="chip" onClick={v.toggleProf} aria-haspopup="menu" aria-expanded={v.profOpen} aria-label="Menu akun" style={{ padding: "0 10px 0 4px", borderColor: v.profBc }}>
                  <span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "12px" }}>
                    A
                  </span>
                  <FaIcon d="M4 7h16M4 12h16M4 17h16" size={15} />
                </button>
                {v.profOpen ? (
                  <>
                    <div role="menu" className="menu" style={{ width: "200px", padding: "0" }}>
                      <div style={{ padding: "14px 14px 12px", borderBottom: "1px solid var(--b3)" }}>
                        <div style={{ fontSize: "13px", fontWeight: "700" }}>
                          {v.uname}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--t4)", marginTop: "2px" }}>
                          {v.uemail}
                        </div>
                        <button type="button" className="ghost" onClick={v.goAccount} style={{ width: "100%", justifyContent: "center", marginTop: "12px", height: "36px" }}>
                          {v.tr.view}
                        </button>
                      </div>
                      <div style={{ padding: "6px" }}>
                        <button type="button" role="menuitem" className="mi" onClick={v.goAff}>
                          <FaIcon d="M12 2l3 6.3 7 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 7-1z" size={15} />
                          {v.tr.aff}
                        </button>
                        <button type="button" role="menuitem" className="mi" onClick={v.goAccount}>
                          <FaIcon d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" size={15} style={{ color: "#F97316" }} />
                          {v.tr.acc}
                        </button>
                        <a role="menuitem" className="mi" href="/api/auth/logout">
                          <FaIcon d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" size={15} />
                          {v.tr.logout}
                        </a>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            {v.updOpen ? (
              <>
                <div style={{ position: "fixed", inset: "0", zIndex: "200", background: "rgba(5,5,7,.6)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 16px", boxSizing: "border-box" }}>
                  <div role="dialog" aria-modal="true" aria-labelledby="upd-title" style={{ width: "100%", maxWidth: "460px", maxHeight: "calc(100vh - 40px)", display: "flex", flexDirection: "column", background: "var(--s1)", border: "1px solid var(--b4)", borderRadius: "16px", boxShadow: "0 40px 90px rgba(0,0,0,.5)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 18px", borderBottom: "1px solid var(--b2)" }}>
                      <span className="ddic" style={{ background: "var(--r1)", border: "1px solid var(--r4)" }}>
                        <FaIcon d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0" size={13} style={{ color: "var(--accent-l)" }} />
                      </span>
                      <h2 id="upd-title" style={{ margin: "0", fontSize: "14px", fontWeight: "700" }}>
                        {v.tr.updates}
                      </h2>
                      <button type="button" className="ibtn" onClick={v.closeUpd} aria-label={v.tr.close} style={{ marginLeft: "auto", width: "32px", height: "32px" }}>
                        ✕
                      </button>
                    </div>
                    <div style={{ padding: "14px 14px 0", overflow: "auto" }}>
                      <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>Notifikasi</div>
                      {v.notifList.length === 0 ? (
                        <div style={{ fontSize: "12px", color: "var(--t5)", paddingBottom: "10px" }}>Belum ada notifikasi.</div>
                      ) : null}
                      {v.notifList.map((n, idx) => (
                        <div key={n.id || idx} style={{ border: "1px solid var(--b2)", background: n.dibaca ? "var(--s0)" : "var(--r1)", borderRadius: "10px", padding: "10px 12px", marginBottom: "8px" }}>
                          <div style={{ fontSize: "12px", fontWeight: "700" }}>{n.judul}</div>
                          <div style={{ fontSize: "12px", color: "var(--t3)", marginTop: "2px", lineHeight: "1.5" }}>{n.isi}</div>
                          <div style={{ fontSize: "10px", color: "var(--t5)", marginTop: "4px" }}>{v.notifWaktu(n.waktu)}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ flex: "1", overflow: "auto", padding: "14px 14px 4px" }}>
                      {(v.updDays || []).map((d, $index) => (
                        <React.Fragment key={$index}>
                          <div style={{ marginBottom: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "700", margin: "4px 2px 10px" }}>
                              <span className="ddic" style={{ width: "22px", height: "22px", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.3)", color: "var(--accent-l)", fontSize: "10px" }}>
                                ▦
                              </span>
                              {d.date}
                            </div>
                            {(d.items || []).map((u, $index) => (
                              <React.Fragment key={$index}>
                                <div style={{ border: "1px solid var(--b3)", borderRadius: "12px", marginBottom: "8px", overflow: "hidden", background: "var(--s2)" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 12px" }}>
                                    <span className="ddic" style={{ width: "24px", height: "24px", color: "var(--accent-l)", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.3)" }}>
                                      <FaIcon d={u.icon} size={12} style={{ color: "var(--accent-l)" }} />
                                    </span>
                                    <span style={{ fontSize: "12px", fontWeight: "600", lineHeight: "1.45" }}>
                                      {u.id} — {u.name}
                                    </span>
                                  </div>
                                  <div style={{ padding: "8px 12px", fontSize: "11px", fontWeight: "600", background: u.bg, color: u.fg, borderTop: "1px solid var(--b2)" }}>
                                    {u.msg}
                                  </div>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                    <div style={{ padding: "12px 14px 14px", borderTop: "1px solid var(--b2)" }}>
                      <button type="button" className="submit" onClick={v.goUpdates} style={{ width: "100%" }}>
                        {v.tr.viewAll} 🔔
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {v.rankOpen ? (
              <>
                <div style={{ position: "fixed", inset: "0", zIndex: "200", background: "rgba(5,5,7,.6)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 16px", boxSizing: "border-box" }}>
                  <div role="dialog" aria-modal="true" aria-labelledby="rank-title" style={{ width: "100%", maxWidth: "460px", maxHeight: "calc(100vh - 40px)", display: "flex", flexDirection: "column", background: "var(--s1)", border: "1px solid var(--b4)", borderRadius: "16px", boxShadow: "0 40px 90px rgba(0,0,0,.5)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 18px", borderBottom: "1px solid var(--b2)" }}>
                      <span className="ddic" style={{ background: "var(--r1)", border: "1px solid var(--r4)" }}>
                        <FaIcon d="M6 3h12l3 6-9 12L3 9zM3 9h18" size={13} style={{ color: "var(--accent-l)" }} />
                      </span>
                      <h2 id="rank-title" style={{ margin: "0", fontSize: "14px", fontWeight: "700" }}>
                        {v.tr.rankTitle}
                      </h2>
                      <button type="button" className="ibtn" onClick={v.closeRank} aria-label={v.tr.close} style={{ marginLeft: "auto", width: "32px", height: "32px" }}>
                        ✕
                      </button>
                    </div>
                    <div style={{ flex: "1", overflow: "auto", padding: "14px" }}>
                      {(v.ranks || []).map((r, $index) => (
                        <React.Fragment key={$index}>
                          <div style={{ border: `1px solid ${r.bc}`, background: r.bg, borderRadius: "14px", padding: "6px", marginBottom: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 10px 8px", fontSize: "13px", fontWeight: "700" }}>
                              {" "}{r.name}{" "}
                              <span style={{ fontWeight: "500", color: "var(--t4)" }}>
                                ({r.range})
                              </span>
                              {r.cur ? (
                                <>
                                  <span style={{ marginLeft: "auto", fontSize: "10px", fontWeight: "800", color: "#FFFFFF", background: "var(--accent)", borderRadius: "999px", padding: "3px 9px" }}>
                                    {v.tr.yourRank}
                                  </span>
                                </>
                              ) : null}
                            </div>
                            {(r.perks || []).map((k, $index) => (
                              <React.Fragment key={$index}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--s2)", border: "1px solid var(--b2)", borderRadius: "10px", padding: "9px 10px", marginTop: "6px", fontSize: "12px", fontWeight: "500" }}>
                                  <span style={{ width: "24px", height: "24px", flex: "none", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", background: k.ib, color: k.ic }}>
                                    {k.mark}
                                  </span>
                                  {k.t}{" "}
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                    <div style={{ padding: "12px 14px 14px", borderTop: "1px solid var(--b2)" }}>
                      <button type="button" className="ghost" onClick={v.closeRank} style={{ width: "100%", height: "46px", justifyContent: "center", color: "var(--gr)" }}>
                        {v.tr.close}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {v.dHistOpen ? (
              <>
                <div onClick={v.closeDHist} aria-hidden="true" style={{ position: "fixed", inset: "0", zIndex: "200", background: "rgba(5,5,7,.55)" }} />
                <aside role="dialog" aria-modal="true" aria-labelledby="dh-title" style={{ position: "fixed", top: "0", right: "0", bottom: "0", zIndex: "201", width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", background: "var(--s1)", borderLeft: "1px solid var(--b3)", boxShadow: "-20px 0 60px rgba(0,0,0,.45)", boxSizing: "border-box" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "18px 20px", borderBottom: "1px solid var(--b2)" }}>
                    <span className="ddic" style={{ background: "var(--r1)", border: "1px solid var(--r4)" }}>
                      <FaIcon d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2" size={13} style={{ color: "var(--accent-l)" }} />
                    </span>
                    <h2 id="dh-title" style={{ margin: "0", fontSize: "14px", fontWeight: "600", color: "var(--t3)" }}>
                      {v.dh.title}
                    </h2>
                    <button type="button" className="ibtn" onClick={v.closeDHist} aria-label={v.dh.close} style={{ marginLeft: "auto", width: "32px", height: "32px" }}>
                      ✕
                    </button>
                  </div>
                  {v.dhRows.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "12px", padding: "60px 24px", margin: "auto 0" }}>
                      <span style={{ width: "56px", height: "56px", borderRadius: "14px", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="fa-solid fa-bag-shopping" aria-hidden="true" style={{ color: "#FFFFFF", fontSize: 24, width: 24, display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center' }} />
                      </span>
                      <div style={{ fontSize: "16px", fontWeight: "700" }}>{v.dh.empty}</div>
                      <div style={{ fontSize: "12px", color: "var(--t4)" }}>{v.dh.emptySub}</div>
                      <button type="button" className="submit" onClick={v.closeDHist} style={{ padding: "0 18px", marginTop: "6px" }}>{v.dh.addFunds}</button>
                    </div>
                  ) : (
                    <div style={{ flex: "1", overflow: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      {v.dhRows.map((p, $index) => (
                        <div key={$index} style={{ background: "var(--s0)", border: "1px solid var(--b2)", borderRadius: "14px", padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                            <span style={{ fontSize: "13px", fontWeight: "700" }}>{p.metode}</span>
                            <button type="button" onClick={function () { window.open("/api/invoice?id=" + encodeURIComponent(p.id), "_blank"); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,.35)", borderRadius: "999px", padding: "5px 12px", fontSize: "11px", fontWeight: "600", color: "#F4F4F5", cursor: "pointer", whiteSpace: "nowrap" }}>
                              Unduh invoice
                            </button>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginTop: "12px" }}>
                            <div style={{ fontSize: "12px", color: "var(--t3)", minWidth: "0" }}>
                              <strong style={{ color: "var(--hi)" }}>ID: {p.id}</strong>&nbsp;&nbsp;{p.tgl}
                            </div>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: p.pill, color: "#F4F4F5", borderRadius: "999px", padding: "6px 12px", fontSize: "12px", fontWeight: "700", whiteSpace: "nowrap" }}>
                              {p.jumlah}
                            </span>
                          </div>
                          <div style={{ marginTop: "8px", fontSize: "11px", color: p.c, fontWeight: "600" }}>{p.status}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </aside>
              </>
            ) : null}
            {v.tHistOpen ? (
              <>
                <div style={{ position: "fixed", inset: "0", zIndex: "200", background: "rgba(5,5,7,.6)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px", boxSizing: "border-box" }}>
                  <div role="dialog" aria-modal="true" aria-labelledby="th-title" style={{ width: "100%", maxWidth: "460px", maxHeight: "calc(100vh - 80px)", display: "flex", flexDirection: "column", background: "var(--s1)", border: "1px solid var(--b4)", borderRadius: "16px", boxShadow: "0 40px 90px rgba(0,0,0,.5)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 18px", borderBottom: "1px solid var(--b2)" }}>
                      <span className="ddic" style={{ background: "var(--r1)", border: "1px solid var(--r4)" }}>
                        <FaIcon d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2" size={13} style={{ color: "var(--accent-l)" }} />
                      </span>
                      <h2 id="th-title" style={{ margin: "0", fontSize: "14px", fontWeight: "700" }}>
                        {v.tr.tickets}
                      </h2>
                      <button type="button" className="ibtn" onClick={v.closeTHist} aria-label={v.tr.close} style={{ marginLeft: "auto", width: "32px", height: "32px" }}>
                        ✕
                      </button>
                    </div>
                    <div style={{ flex: "1", overflow: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {(v.tlist || []).map((t, $index) => (
                        <React.Fragment key={$index}>
                          <button type="button" onClick={t.open} style={{ textAlign: "left", background: "var(--s2)", border: "1px solid var(--b3)", borderRadius: "12px", padding: "14px", cursor: "pointer", color: "var(--hi)", fontFamily: "inherit", display: "flex", flexDirection: "column", gap: "10px" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "600" }}>
                              {t.unread ? (
                                <>
                                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--accent)" }} />
                                </>
                              ) : null}
                              {t.title}
                            </span>
                            <span style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 12px", fontSize: "11px", color: "var(--t4)" }}>
                              ID: {t.id}
                              <span>
                                {v.tr.lastUpd}: {t.updated}
                              </span>
                              <span className="pill" style={{ marginLeft: "auto", background: t.sBg, color: t.sFg }}>
                                {t.sTxt}
                              </span>
                            </span>
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                    <div style={{ padding: "12px 14px 14px", borderTop: "1px solid var(--b2)" }}>
                      <button type="button" className="submit" onClick={v.closeTHist} style={{ width: "100%", background: "var(--hi)", color: "var(--bg)", borderColor: "var(--hi)", boxShadow: "none" }}>
                        {v.tr.close}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </header>
          {v.showBanner ? (
            <>
              <div style={{ position: "relative", overflow: "hidden", padding: "70px 40px 70px", borderBottom: "1px solid var(--b1)", background: "linear-gradient(120deg,var(--bg) 30%,var(--r1) 100%)", textAlign: v.pg.align }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: "0", backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px)", backgroundSize: "46px 46px", WebkitMaskImage: "linear-gradient(90deg,transparent 40%,#000)", maskImage: "linear-gradient(90deg,transparent 40%,#000)" }} />
                <h1 style={{ position: "relative", margin: "0", fontSize: "30px", fontWeight: "700", letterSpacing: "-.03em" }}>
                  {v.pg.title}
                </h1>
                <p style={{ position: "relative", margin: "10px 0 0", fontSize: "13px", color: "var(--t3)" }}>
                  {v.pg.sub}
                </p>
              </div>
            </>
          ) : null}
          <main className="dash-main" style={{ position: "relative", zIndex: v.mainZ, padding: "34px 40px 60px", display: "flex", flexDirection: "column", gap: "22px", background: v.mainBg }}>
          <Toast toast={v.toast} onClose={v.closeToast} />
          {this.state.konfirm ? <KotakKonfirmasi pesan={this.state.konfirm.pesan} onJawab={(ya) => { var k = this.state.konfirm; this.setState({ konfirm: null }); if (ya) k.lanjut(); }} /> : null}
            {v.is.neworder ? (
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
                              <button type="submit" className="submit" style={{ flex: "1 1 220px" }}>
                                {v.tr.submit}{" "}
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
                              <span style={{ width: "42px", height: "42px", margin: "0 auto 12px", borderRadius: "12px", color: "var(--accent-l)", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FaIcon d={v.svc.icon} size={18} style={{ color: "var(--accent-l)" }} />
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
            ) : null}
            {v.is.services ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "-58px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ position: "relative" }}>
                        <button type="button" className="chip" onClick={v.toggleSCat} aria-haspopup="listbox" aria-expanded={v.sCatOpen}>
                          <span className="ocircle">
                            <FaIcon d="M3 5h18l-7 8v6l-4 2v-8z" size={12} style={{ color: "#FFFFFF" }} />
                          </span>
                          {v.sCatLabel}
                          <FaIcon d="M6 9l6 6 6-6" size={12} />
                        </button>
                        {v.sCatOpen ? (
                          <>
                            <div role="listbox" className="ddpanel" style={{ width: "260px", right: "auto" }}>
                              {(v.sCatOpts || []).map((c, $index) => (
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
                      <button type="button" className="chip" onClick={v.openF} aria-haspopup="dialog">
                        <span className="ocircle">
                          <FaIcon d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" size={12} style={{ color: "#FFFFFF" }} />
                        </span>
                        Filter Lanjutan
                        {v.fCount ? (
                          <>
                            <span style={{ fontSize: "10px", fontWeight: "800", background: "var(--accent)", borderRadius: "999px", padding: "2px 7px" }}>
                              {v.fCount}
                            </span>
                          </>
                        ) : null}
                        <FaIcon d="M6 9l6 6 6-6" size={12} />
                      </button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "44px", border: "1px solid var(--b3)", background: "var(--s1)", borderRadius: "999px", padding: "0 4px 0 16px", minWidth: "240px" }}>
                      <label htmlFor="s-cari" style={{ position: "absolute", left: "-9999px" }}>
                        Cari layanan
                      </label>
                      <input id="s-cari" type="search" placeholder="Cari layanan" value={v.sq} onChange={v.setSq} style={{ flex: "1", minWidth: "0", background: "transparent", border: "none", outline: "none", color: "var(--hi)", fontFamily: "inherit", fontSize: "12px" }} />
                      <span className="ocircle" style={{ width: "34px", height: "34px" }}>
                        <i className="fa-solid fa-magnifying-glass" aria-hidden="true" style={{ color: "#FFFFFF", fontSize: 15, width: 15, display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center' }} />
                      </span>
                    </div>
                  </div>
                  {(v.sGroups || []).map((g, $index) => (
                    <React.Fragment key={$index}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "10px" }}>
                        <div className="card" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderRadius: "12px" }}>
                          <span className="ddic" style={{ background: g.bg }}>
                            <FaIcon d={g.icon} size={13} style={{ color: "#FFFFFF" }} />
                          </span>
                          <span style={{ fontSize: "14px", fontWeight: "700" }}>
                            {g.t}
                          </span>
                          <span style={{ fontSize: "11px", color: "var(--t5)", marginLeft: "auto" }}>
                            {g.count} layanan
                          </span>
                        </div>
                        {(g.items || []).map((s, $index) => (
                          <React.Fragment key={$index}>
                            <div className="card" style={{ borderRadius: "14px", overflow: "hidden" }}>
                              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", padding: "12px 12px 12px 14px", borderBottom: "1px solid var(--b2)" }}>
                                <span className="idpill" style={{ background: "var(--accent)", color: "#FFFFFF", borderColor: "var(--accent)" }}>
                                  ID: {s.id}
                                </span>
                                <span style={{ flex: "1", minWidth: "200px", fontSize: "13px", fontWeight: "600" }}>
                                  {s.name}
                                </span>
                                <span style={{ display: "flex", border: "1px solid var(--b3)", borderRadius: "8px", overflow: "hidden", fontSize: "12px", fontWeight: "700" }}>
                                  <span style={{ padding: "9px 12px" }}>
                                    ≈ Rp {s.priceFmt}
                                  </span>
                                  <span style={{ padding: "9px 12px", borderLeft: "1px solid var(--b3)", color: "var(--t3)" }}>
                                    1000
                                  </span>
                                </span>
                                <button type="button" className="ibtn" onClick={s.fav} aria-pressed={s.isFav} aria-label="Favorit" style={{ color: s.favC }}>
                                  <FaIcon d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" size={16} />
                                </button>
                              </div>
                              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", padding: "10px 12px 10px 14px" }}>
                                <span style={{ display: "inline-flex", border: "1px solid var(--b3)", borderRadius: "999px", fontSize: "11px", fontWeight: "600" }}>
                                  <span style={{ padding: "7px 12px" }}>
                                    ⌄ Min: {s.minTxt}
                                  </span>
                                  <span style={{ padding: "7px 12px", borderLeft: "1px solid var(--b3)" }}>
                                    ⌃ Maks: {s.maxTxt}
                                  </span>
                                </span>
                                <span className="pill" style={{ background: s.tBg, color: s.tFg }}>
                                  ⏱ {s.start}
                                </span>
                                <span className="pill" style={{ background: s.rBg, color: s.rFg }}>
                                  ↻ Refill: {s.refill}
                                </span>
                                <span style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                                  <button type="button" className="ghost" onClick={s.toggleDesc} aria-expanded={s.descOpen}>
                                    Deskripsi ▤
                                  </button>
                                  <button type="button" className="submit" onClick={s.buy} style={{ height: "40px", padding: "0 18px" }}>
                                    Beli Sekarang
                                  </button>
                                </span>
                              </div>
                              {s.descOpen ? (
                                <>
                                  <ul style={{ margin: "0", padding: "12px 18px 16px 30px", borderTop: "1px solid var(--b2)", fontSize: "12px", color: "var(--t3)", lineHeight: "1.9" }}>
                                    {(s.desc || []).map((d, $index) => (
                                      <React.Fragment key={$index}>
                                        <li>
                                          {d}
                                        </li>
                                      </React.Fragment>
                                    ))}
                                  </ul>
                                </>
                              ) : null}
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </React.Fragment>
                  ))}
                  {v.sSisa > 0 ? (
                    <div style={{ display: "flex", justifyContent: "center", paddingTop: "8px" }}>
                      <button type="button" className="ghost" onClick={v.sMuatLebih} style={{ padding: "0 18px" }}>Tampilkan {Math.min(40, v.sSisa)} layanan lagi ({v.sSisa} tersisa)</button>
                    </div>
                  ) : null}
                  {v.sEmpty ? (
                    <>
                      <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--t5)", fontSize: "13px" }}>
                        Layanan tidak ditemukan.
                      </div>
                    </>
                  ) : null}
                  {v.fOpen ? (
                    <>
                      <div style={{ position: "fixed", inset: "0", zIndex: "100", background: "rgba(5,5,7,.72)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px", overflow: "auto", boxSizing: "border-box" }}>
                        <div role="dialog" aria-modal="true" aria-labelledby="f-title" style={{ width: "100%", maxWidth: "460px", background: "var(--s1)", border: "1px solid var(--b4)", borderRadius: "16px", boxShadow: "0 40px 90px rgba(0,0,0,.7)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 18px", borderBottom: "1px solid var(--b2)" }}>
                            <span className="ddic" style={{ background: "var(--r1)", border: "1px solid var(--r4)" }}>
                              <FaIcon d="M3 5h18l-7 8v6l-4 2v-8z" size={13} style={{ color: "var(--accent-l)" }} />
                            </span>
                            <h2 id="f-title" style={{ margin: "0", fontSize: "14px", fontWeight: "700" }}>
                              Filter
                            </h2>
                            <button type="button" className="ibtn" onClick={v.closeF} aria-label="Tutup filter" style={{ marginLeft: "auto", width: "32px", height: "32px" }}>
                              ✕
                            </button>
                          </div>
                          <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--b2)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "700", marginBottom: "12px" }}>
                              <span className="ddic" style={{ background: "var(--r1)", border: "1px solid var(--r4)", color: "var(--rt)" }}>
                                ⌕
                              </span>
                              <label htmlFor="f-kw">
                                Kata kunci
                              </label>
                            </div>
                            <input id="f-kw" className="inp" type="search" placeholder="Cari" value={v.fd.kw} onChange={v.fSetKw} />
                          </div>
                          <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--b2)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "700", marginBottom: "12px" }}>
                              <span className="ddic" style={{ background: "var(--r1)", border: "1px solid var(--r4)", color: "var(--rt)", fontSize: "9px", fontWeight: "800" }}>
                                Rp
                              </span>
                              Rentang harga / 1K
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <input className="inp" type="number" inputMode="numeric" placeholder="Min" aria-label="Harga minimal" value={v.fd.pmin} onChange={v.fSetMin} />
                              <input className="inp" type="number" inputMode="numeric" placeholder="Maks" aria-label="Harga maksimal" value={v.fd.pmax} onChange={v.fSetMax} />
                            </div>
                          </div>
                          {(v.fGroups || []).map((g, $index) => (
                            <React.Fragment key={$index}>
                              <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--b2)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "700", marginBottom: "12px" }}>
                                  <span className="ddic" style={{ background: "var(--r1)", border: "1px solid var(--r4)" }}>
                                    <FaIcon d={g.icon} size={13} style={{ color: "var(--accent-l)" }} />
                                  </span>
                                  {g.t}
                                </div>
                                <div role="group" aria-label={g.t} style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                  {(g.chips || []).map((c, $index) => (
                                    <React.Fragment key={$index}>
                                      <button type="button" onClick={c.toggle} aria-pressed={c.on} style={{ border: `1px solid ${c.bc}`, background: c.bg, color: c.fg, borderRadius: "999px", padding: "9px 14px", fontSize: "11px", fontWeight: "700", cursor: "pointer", minHeight: "36px" }}>
                                        {c.t}
                                      </button>
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                            </React.Fragment>
                          ))}
                          <div style={{ display: "flex", gap: "10px", padding: "16px 18px" }}>
                            <button type="button" className="submit" onClick={v.applyF} style={{ flex: "1" }}>
                              Terapkan ✓
                            </button>
                            <button type="button" className="ghost" onClick={v.clearF} style={{ flex: "1", height: "48px", justifyContent: "center" }}>
                              Hapus Filter ↻
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
            {v.is.orders ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "-58px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
                    <div style={{ position: "relative" }}>
                      <button type="button" className="chip" onClick={v.toggleOF} aria-haspopup="listbox" aria-expanded={v.ofOpen}>
                        <span className="ocircle">
                          <FaIcon d="M3 5h18l-7 8v6l-4 2v-8z" size={12} style={{ color: "#FFFFFF" }} />
                        </span>
                        {v.ofLabel}
                        <FaIcon d="M6 9l6 6 6-6" size={12} />
                      </button>
                      {v.ofOpen ? (
                        <>
                          <div role="listbox" className="ddpanel" style={{ width: "200px", right: "auto" }}>
                            {(v.ofOpts || []).map((c, $index) => (
                              <React.Fragment key={$index}>
                                <button type="button" role="option" aria-selected={c.on} className="ddopt" onClick={c.pick} style={{ background: c.rowBg }}>
                                  {c.t}
                                </button>
                              </React.Fragment>
                            ))}
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "44px", border: "1px solid var(--b3)", background: "var(--s1)", borderRadius: "999px", padding: "0 4px 0 16px", minWidth: "240px" }}>
                      <label htmlFor="o-cari" style={{ position: "absolute", left: "-9999px" }}>
                        Cari pesanan
                      </label>
                      <input id="o-cari" type="search" placeholder="Cari ID atau link" value={v.oq} onChange={v.setOq} style={{ flex: "1", minWidth: "0", background: "transparent", border: "none", outline: "none", color: "var(--hi)", fontFamily: "inherit", fontSize: "12px" }} />
                      <span className="ocircle" style={{ width: "34px", height: "34px" }}>
                        <i className="fa-solid fa-magnifying-glass" aria-hidden="true" style={{ color: "#FFFFFF", fontSize: 15, width: 15, display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center' }} />
                      </span>
                    </div>
                  </div>
                  {(v.orders || []).map((o, $index) => (
                    <React.Fragment key={$index}>
                      <div className="card" style={{ borderRadius: "14px", overflow: "hidden" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", padding: "12px 12px 12px 14px", borderBottom: "1px solid var(--b2)" }}>
                          <span className="ddic" style={{ width: "32px", height: "32px", color: "var(--accent-l)", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.3)" }}>
                            <FaIcon d={o.icon} size={15} style={{ color: "var(--accent-l)" }} />
                          </span>
                          <input type="checkbox" aria-label="Pilih pesanan" style={{ width: "18px", height: "18px", margin: "0", accentColor: "var(--accent)" }} />
                          <span className="idpill" style={{ background: "var(--accent)", color: "#FFFFFF", borderColor: "var(--accent)" }}>
                            ID: {o.id}
                          </span>
                          <span style={{ flex: "1", minWidth: "220px", fontSize: "13px", fontWeight: "600" }}>
                            {o.svcId} — {o.name}{" "}
                            <span style={{ color: "var(--t4)", fontWeight: "500", marginLeft: "10px" }}>
                              <FaIcon d="M3 5h18v16H3zM3 10h18M8 3v4M16 3v4" size={12} style={{ display: "inline-block", marginRight: "4px", verticalAlign: "-2px" }} />{o.date}
                            </span>
                          </span>
                          <span className="pill" style={{ background: /Selesai|Completed/i.test(o.sTxt) ? "#14532D" : /Batal|Cancel|Ditolak/i.test(o.sTxt) ? "#7F1D1D" : o.sBg, color: /Selesai|Completed/i.test(o.sTxt) ? "#F0FDF4" : /Batal|Cancel|Ditolak/i.test(o.sTxt) ? "#FEF2F2" : o.sFg, border: "none", fontWeight: "600", padding: "8px 16px", borderRadius: "999px", fontSize: "13px" }}>
                            {o.sTxt}
                          </span>
                          <button type="button" className="ibtn" aria-label="Laporkan masalah" onClick={v.goTickets}>
                            <FaIcon d="M12 3l10 18H2zM12 10v4M12 17h.01" size={15} />
                          </button>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", padding: "10px 12px 10px 14px" }}>
                          <span className="pill" style={{ border: "1px solid var(--b3)", paddingLeft: "4px" }}>
                            <span className="ocircle">
                              <FaIcon d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" size={11} />
                            </span>
                            <span style={{ maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {o.link}
                            </span>
                          </span>
                          <span className="pill" style={{ border: "1px solid var(--b3)", paddingLeft: "4px" }}>
                            <span className="ocircle" style={{ fontSize: "9px", fontWeight: "800" }}>
                              Rp
                            </span>
                            Biaya: {o.charge}
                          </span>
                          <span className="pill" style={{ border: "1px solid var(--b3)", paddingLeft: "4px" }}>
                            <span className="ocircle">
                              #
                            </span>
                            Jumlah: {o.qtyTxt}
                          </span>
                          <span className="pill" style={{ border: "1px solid var(--b3)", paddingLeft: "4px" }}>
                            <span className="ocircle">
                              ↕
                            </span>
                            Start count: {o.startC}
                          </span>
                          <span className="pill" style={{ border: "1px solid var(--b3)", paddingLeft: "4px" }}>
                            <span className="ocircle">
                              ⌛
                            </span>
                            Sisa: {o.remains}
                          </span>
                          <span style={{ marginLeft: "auto" }}>
                            {o.canCancel ? (
                              <>
                                <button type="button" className="ghost" onClick={o.cancel}>
                                  Batalkan ✕
                                </button>
                              </>
                            ) : null}
                            {o.canRefill ? (
                              <>
                                <button type="button" className="ghost" onClick={o.refill}>
                                  ↻ {o.refillTxt}
                                </button>
                              </>
                            ) : null}
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                  {v.oEmpty ? (
                    <>
                      <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--t5)", fontSize: "13px" }}>
                        Tidak ada pesanan.
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
            {v.is.addfunds ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginTop: "-80px" }}>
                  <form className="card" style={{ width: "100%", maxWidth: "540px", padding: "20px", boxSizing: "border-box", position: "relative", zIndex: "2" }} onSubmit={v.payFunds}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                      <span style={{ width: "34px", height: "34px", borderRadius: "9px", color: "var(--accent-l)", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800" }}>
                        Rp
                      </span>
                      <span style={{ fontSize: "15px", fontWeight: "700" }}>
                        Isi saldo
                      </span>
                      <button type="button" className="ibtn" onClick={v.openDHist} aria-label="Riwayat deposit" aria-haspopup="dialog" style={{ marginLeft: "auto", width: "34px", height: "34px" }}>
                        <FaIcon d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2" size={14} />
                      </button>
                    </div>
                    <div role="group" aria-label="Nominal" style={{ display: "flex", gap: "4px", background: "var(--segbg)", border: "1px solid var(--b2)", borderRadius: "10px", padding: "4px", flexWrap: "wrap" }}>
                      {(v.amts || []).map((a, $index) => (
                        <React.Fragment key={$index}>
                          <button type="button" className="seg" onClick={a.pick} aria-pressed={a.on} style={{ background: a.bg, color: a.fg }}>
                            {a.t}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                    <label className="lbl" htmlFor="nominal">
                      Nominal (Rp)
                    </label>
                    <input id="nominal" className="inp" type="number" inputMode="numeric" placeholder="Minimal Rp 10.000" value={v.amtVal} onChange={v.setAmt} style={{ borderColor: v.amtBc }} />
                    {v.amtKurang ? <span className="lbl" style={{ color: "#FF5A75", marginTop: "6px", display: "block" }}>Nominal minimal Rp 10.000.</span> : null}
                    <span className="lbl" id="lbl-met">
                      Metode
                    </span>
                    <div style={{ position: "relative" }}>
                      <button type="button" className="dd" aria-labelledby="lbl-met" aria-haspopup="listbox" aria-expanded={v.mOpen} onClick={v.toggleM} style={{ paddingLeft: "12px" }}>
                        {v.met.badge ? (
                          <>
                            <span className="idpill">
                              {v.met.badge}
                            </span>
                          </>
                        ) : null}
                        <span style={{ flex: "1" }}>
                          {v.met.t}
                        </span>
                        <FaIcon d="M6 9l6 6 6-6" size={14} style={{ color: "#C9CBD1" }} />
                      </button>
                      {v.mOpen ? (
                        <>
                          <div role="listbox" className="ddpanel">
                            {(v.mets || []).map((m, $index) => (
                              <React.Fragment key={$index}>
                                <button type="button" role="option" aria-selected={m.on} className="ddopt" onClick={m.pick} style={{ background: m.rowBg }}>
                                  {m.t}
                                  {m.badge ? (
                                    <>
                                      <span className="idpill" style={{ marginLeft: "auto" }}>
                                        {m.badge}
                                      </span>
                                    </>
                                  ) : null}
                                </button>
                              </React.Fragment>
                            ))}
                          </div>
                        </>
                      ) : null}
                    </div>
                    <span className="lbl">
                      Instruksi
                    </span>
                    <div style={{ fontSize: "12px", color: "var(--t2)", lineHeight: "1.9", textAlign: "center" }}>
                      {v.met.info}
                      <br />
                      <span style={{ color: "var(--t4)" }}>
                        {v.bonusTxt}
                      </span>
                    </div>
                    <button type="submit" className="submit" disabled={v.amtKurang || v.bayarBusy} style={{ width: "100%", marginTop: "18px", opacity: v.amtKurang || v.bayarBusy ? 0.5 : 1, cursor: v.amtKurang || v.bayarBusy ? "not-allowed" : "pointer" }}>
                      <i className="fa-solid fa-credit-card" aria-hidden="true" style={{ fontSize: 15, width: 15, display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center' }} />
                      {v.bayarBusy ? 'Memproses...' : 'Bayar ' + v.amtFmt}
                    </button>
                    {v.paid ? (
                      <>
                        <div role="status" style={{ marginTop: "14px", fontSize: "12px", fontWeight: "600", color: "var(--gr)", background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.3)", borderRadius: "10px", padding: "12px 14px" }}>
                          <span style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
                        <span>✓ Permintaan deposit dibuat.</span>
                        {v.lastDep ? (
                          <span style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            <button type="button" onClick={v.cekBayar} style={{ display: "inline-flex", alignItems: "center", height: "32px", padding: "0 14px", borderRadius: "999px", border: "1px solid var(--r4)", background: "var(--r1)", color: "var(--rt)", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>Cek pembayaran</button>
                          </span>
                        ) : null}
                        {v.cekMsg ? (<span style={{ fontSize: "12px", fontWeight: "500" }}>{v.cekMsg}</span>) : null}
                      </span>
                        </div>
                      </>
                    ) : null}
                  </form>
                  <div className="card" style={{ width: "100%", maxWidth: "540px", padding: "20px", boxSizing: "border-box" }}>
                    <i className="fa-solid fa-circle-info" aria-hidden="true" style={{ color: "var(--accent-l)", fontSize: 20, width: 20, display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center' }} />
                    <div style={{ fontSize: "16px", fontWeight: "700", margin: "10px 0 6px" }}>
                      {v.bonusJudul}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--rt2)", lineHeight: "1.7" }}>
                      {v.bonusDesk}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {v.is.tickets ? (
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
            ) : null}
            {v.is.refunds ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "-58px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
                    <span className="chip">
                      <span className="ocircle">
                        <FaIcon d="M3 5h18l-7 8v6l-4 2v-8z" size={12} style={{ color: "#FFFFFF" }} />
                      </span>
                      Semua
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "44px", border: "1px solid var(--b3)", background: "var(--s1)", borderRadius: "999px", padding: "0 4px 0 16px", minWidth: "240px" }}>
                      <label htmlFor="r-cari" style={{ position: "absolute", left: "-9999px" }}>
                        Cari refund
                      </label>
                      <input id="r-cari" type="search" placeholder="Cari ID pesanan" value={v.rq} onChange={v.setRq} style={{ flex: "1", minWidth: "0", background: "transparent", border: "none", outline: "none", color: "var(--hi)", fontFamily: "inherit", fontSize: "12px" }} />
                      <span className="ocircle" style={{ width: "34px", height: "34px" }}>
                        <i className="fa-solid fa-magnifying-glass" aria-hidden="true" style={{ color: "#FFFFFF", fontSize: 15, width: 15, display: 'inline-block', flex: 'none', lineHeight: 1, textAlign: 'center' }} />
                      </span>
                    </div>
                  </div>
                  {(v.refunds || []).map((r, $index) => (
                    <React.Fragment key={$index}>
                      <div className="card" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px", padding: "14px 14px 14px 16px", borderRadius: "12px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--rt)" }}>
                          {r.id}
                        </span>
                        <span style={{ fontSize: "13px", fontWeight: "600" }}>
                          ▢ {r.date}
                        </span>
                        <span style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
                          <span className="pill" style={{ background: "var(--r1)", color: "var(--rt)", border: "1px solid var(--r4)" }}>
                            + {r.amt}
                          </span>
                          {r.ajukan ? (
                            <button type="button" className="pill" onClick={r.ajukanFn} style={{ background: "var(--rt)", color: "#FFFFFF", border: "none", cursor: "pointer" }}>
                              Ajukan refund
                            </button>
                          ) : null}
                          <span className="pill" style={{ background: r.statusBg, color: r.statusFg }}>
                            {r.statusTxt}
                          </span>
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
                  {v.rEmpty ? (
                    <>
                      <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--t5)", fontSize: "13px" }}>
                        Belum ada refund.
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
            {v.is.ticket ? (
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
                        <button type="button" className="ibtn" aria-label={v.tr.attach} style={{ width: "34px", height: "34px", borderRadius: "50%" }}>
                          📎
                        </button>
                        <button type="submit" aria-label={v.tr.send} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "none", background: "var(--accent)", color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <FaIcon d="M21 3L3 10l7 3 3 7z" size={15} />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {v.is.updates ? (
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
            ) : null}
            {v.is.massorder ? (
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
                    <button type="submit" className="submit" style={{ width: "100%", marginTop: "16px" }}>
                      Kirim
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
            ) : null}
            {v.is.affiliates ? (
              <>
                <div className="card aff-card" style={{ marginTop: "-58px", position: "relative", zIndex: "2", borderRadius: "18px", overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
                    {(v.affStats || []).map((a, $index) => (
                      <React.Fragment key={$index}>
                        <div style={{ padding: "26px 30px", borderBottom: "1px solid var(--b2)", borderRight: "1px solid var(--b2)" }}>
                          <div style={{ fontSize: "12px", color: "var(--t2)" }}>
                            {a.l}
                          </div>
                          <div style={{ fontSize: "22px", fontWeight: "700", marginTop: "10px", letterSpacing: "-.02em" }}>
                            {a.v}
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: "12px", background: "var(--s0)", border: "1px solid var(--b3)", borderRadius: "12px", padding: "4px 16px 4px 4px" }}>
                      <button type="button" className="ghost" onClick={v.copyRef} style={{ height: "38px" }}>
                        ⧉ {v.copyTxt}
                      </button>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--rt)", wordBreak: "break-all" }}>
                        {v.refLink || (v.affGagal ? "Gagal memuat link. Muat ulang halaman." : "Memuat link...")}
                      </span>
                    </div>
                    <p style={{ margin: "16px 0 0", fontSize: "12px", color: "var(--t4)", lineHeight: "1.7" }}>
                      {v.afiliasiTxt}
                    </p>
                  </div>
                  <div style={{ padding: "20px", borderTop: "1px solid var(--b2)" }}>
                    <div style={{ fontSize: "14px", fontWeight: "700" }}>Pindahkan komisi ke saldo</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px" }}>
                      <input type="number" inputMode="numeric" placeholder={"Jumlah (min " + v.minTarikTxt + ")"} value={v.wdJumlah} onChange={v.setWdJumlah} style={{ flex: "1 1 180px", minWidth: 0, height: "40px", padding: "0 12px", borderRadius: "10px", border: "1px solid var(--b3)", background: "var(--s0)", color: "var(--hi)", fontFamily: "inherit", fontSize: "16px" }} />
                      <button type="button" className="ghost" onClick={v.tarikKomisi} disabled={v.wdBusy} style={{ height: "40px" }}>Pindahkan ke saldo</button>
                    </div>
                    <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {(v.wdList || []).map((p, idx) => (
                        <React.Fragment key={idx}>
                          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", fontSize: "13px" }}>
                            <span style={{ fontWeight: "600" }}>{p.jumlah}</span>
                            <span style={{ color: "var(--t3)" }}>{p.tujuan}</span>
                            <span style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }}>
                              <span style={{ color: "var(--t4)", fontSize: "12px" }}>{p.tgl}</span>
                              <span className="pill" style={{ background: p.statusBg, color: p.statusFg }}>{p.statusTxt}</span>
                            </span>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ height: "1px", background: "var(--b2)", marginTop: "10px" }} />
              </>
            ) : null}
            {v.is.account ? (
              <>
                <div style={{ display: "flex", flexWrap: "wrap", margin: "-34px -40px -60px", minHeight: "calc(100vh - 80px)" }}>
                  <aside style={{ flex: "1 1 220px", maxWidth: "260px", minWidth: "0", borderRight: "1px solid var(--b1)", padding: "22px 20px", boxSizing: "border-box" }}>
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
                    <div style={{ padding: "36px 50px", borderBottom: "1px solid var(--b1)" }}>
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
                          <form style={{ padding: "30px 50px", borderBottom: "1px solid var(--b1)" }} onSubmit={v.savePw}>
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
                          <form style={{ padding: "30px 50px" }} onSubmit={v.saveEmail}>
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
                        <div style={{ padding: "30px 50px", maxWidth: "760px", display: "flex", flexDirection: "column", gap: "18px" }}>
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
                        <div style={{ padding: "30px 50px", maxWidth: "640px" }}>
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
                        <div style={{ padding: "30px 50px", maxWidth: "760px", display: "flex", flexDirection: "column", gap: "30px" }}>
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
                        <form style={{ padding: "30px 50px", maxWidth: "760px", display: "flex", flexDirection: "column", gap: "12px" }} onSubmit={v.saveInv}>
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
                        <div style={{ padding: "30px 50px", maxWidth: "640px", display: "flex", flexDirection: "column", gap: "10px" }}>
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
            ) : null}
            {v.is.soon ? (
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
            ) : null}
          </main>
        </div>
      </div>
      </>
    );
  }
}

export default DashboardPage;
