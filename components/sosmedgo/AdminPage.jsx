import React, { useState, useEffect, useMemo } from 'react';
import Toast from './Toast';
import KotakKonfirmasi from './Konfirmasi';
import Head from 'next/head';
import Link from 'next/link';
import { ACCENTS, accentVarsFor } from './theme';
import Markdown from './Markdown';

import {
  ICON, TABS_MAIN, TABS_SUPPORT, TAB_CRUMB, PROVIDER_LOW, NOTIF_ITEMS, SOCIAL_FA, UPS, refundAdmin, tiketAdmin, rp, tanggalWib, hargaJual, TODAY, hariLalu, RANGE_OPTS, CHART_COLORS, CHART_SERIES, Svg, Badge, StatCard, Toggle, resolveRange, daysBetween, TrendChart, TrendTable, OrdersTable
} from './admin-kit';

import AdminRingkasan from './AdminRingkasan';
import AdminStatistik from './AdminStatistik';
import AdminPengguna from './AdminPengguna';
import AdminPesanan from './AdminPesanan';
import AdminDeposit from './AdminDeposit';
import AdminLayanan from './AdminLayanan';
import AdminTiket from './AdminTiket';
import AdminUpdate from './AdminUpdate';
import AdminRefund from './AdminRefund';
import AdminAfiliasi from './AdminAfiliasi';
import AdminBlog from './AdminBlog';
import AdminPeringkat from './AdminPeringkat';
import AdminPengaturan from './AdminPengaturan';

export default function AdminPage() {
  const [theme, setTheme] = useState('dark');
  const [themeMode, setThemeMode] = useState('dark');
  const [accent, setAccent] = useState('red');
  const [tab, setTab] = useState('Ringkasan');
  const [navOpen, setNavOpen] = useState(false);
  const bukaTab = (t) => { setTab(t); setNavOpen(false); };
  const [q, setQ] = useState('');
  const [pengguna, setPengguna] = useState([]);
  const [saldoProv, setSaldoProv] = useState({ saldo: null, currency: '', error: '' });
  const muatPengguna = () => fetch('/api/pengguna').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d && Array.isArray(d.pengguna)) setPengguna(d.pengguna); }).catch(() => {});
  const [orderFilter, setOrderFilter] = useState('Semua');
  const [deposits, setDeposits] = useState([]);
  const muatDeposit = () => fetch('/api/deposits').then((r) => r.json()).then((d) => {
    if (Array.isArray(d.deposits)) setDeposits(d.deposits.map((x) => ({ id: x.id, user: x.username || x.userId, metode: x.metode, nominal: x.nominal, waktu: String(x.dibuat).slice(0, 16).replace('T', ' '), status: x.label })));
  }).catch(() => {});
  const [services, setServices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const muatTiket = () => fetch('/api/tickets').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d && Array.isArray(d.tickets)) setTickets(d.tickets.map(tiketAdmin)); }).catch(() => {});
  const [selTicket, setSelTicket] = useState(null);
  const [reply, setReply] = useState('');
  const [refunds, setRefunds] = useState([]);
  const muatRefund = () => fetch('/api/refunds').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d && Array.isArray(d.refunds)) setRefunds(d.refunds.map(refundAdmin)); }).catch(() => {});
  const [ringkasAfiliasi, setRingkasAfiliasi] = useState({ totalAfiliasi: 0, totalKomisi: 0, komisiTersedia: 0 });
  const muatAfiliasiAdmin = () => fetch('/api/affiliates').then((r) => (r.ok ? r.json() : null)).then((d) => {
    if (d && typeof d.totalAfiliasi === 'number') setRingkasAfiliasi({ totalAfiliasi: d.totalAfiliasi, totalKomisi: d.totalKomisi, komisiTersedia: d.komisiTersedia });
  }).catch(() => {});
  const [ranks, setRanks] = useState([]);
  const muatPeringkat = () => fetch('/api/peringkat').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d && Array.isArray(d.tiers)) setRanks(d.tiers); }).catch(() => {});
  const simpanPeringkat = async () => {
    const r = await fetch('/api/peringkat', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mins: ranks.map((x) => x.min) }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { tampilkanToast(false, d.error || 'Gagal menyimpan peringkat.'); return; }
    tampilkanToast(true, 'Batas peringkat tersimpan.');
    await muatPeringkat();
  };
  /* Blog: artikel disimpan sebagai satu daftar utuh lewat /api/artikel. artikelSel: -1 tertutup, -2 artikel baru, >=0 indeks yang diubah. */
  const [artikelList, setArtikelList] = useState([]);
  const [artikelSel, setArtikelSel] = useState(-1);
  const kosongArtikel = { slug: '', judul: '', ringkasan: '', tanggal: TODAY, isiTeks: '', gambar: '', terbit: true };
  const [artikelForm, setArtikelForm] = useState(kosongArtikel);
  const [artikelBusy, setArtikelBusy] = useState(false);
  const [artikelPratinjau, setArtikelPratinjau] = useState(false);
  const muatArtikel = () => fetch('/api/artikel').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d && Array.isArray(d.artikel)) setArtikelList(d.artikel); }).catch(() => {});
  useEffect(() => { if (tab === 'Blog') muatArtikel(); }, [tab]);
  const pilihArtikel = (i) => {
    const a = artikelList[i];
    setArtikelSel(i);
    setArtikelForm({ slug: a.slug, judul: a.judul, ringkasan: a.ringkasan, tanggal: a.tanggal, isiTeks: typeof a.isi === 'string' ? a.isi : (a.isi || []).join('\n\n'), gambar: a.gambar || '', terbit: a.terbit !== false });
    setArtikelPratinjau(false);
  };
  const artikelBaru = () => { setArtikelSel(-2); setArtikelForm(kosongArtikel); setArtikelPratinjau(false); };
  /* Foto diperkecil di browser (lebar maks 1200px, JPEG) supaya tetap muat di database. */
  const pilihGambar = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { tampilkanToast(false, 'Foto harus JPG, PNG, atau WEBP.'); return; }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const skala = Math.min(1, 1200 / img.width);
      const kanvas = document.createElement('canvas');
      kanvas.width = Math.round(img.width * skala);
      kanvas.height = Math.round(img.height * skala);
      const ctx = kanvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, kanvas.width, kanvas.height);
      ctx.drawImage(img, 0, 0, kanvas.width, kanvas.height);
      const hasil = kanvas.toDataURL('image/jpeg', 0.82);
      URL.revokeObjectURL(url);
      if (hasil.length > 450000) { tampilkanToast(false, 'Foto masih terlalu besar. Pakai foto yang lebih kecil.'); return; }
      setArtikelForm((f) => ({ ...f, gambar: hasil }));
      /* Langsung diunggah ke penyimpanan supaya yang tersimpan di artikel cuma URL pendek, bukan base64 utuh. */
      setArtikelBusy(true);
      fetch('/api/artikel/upload-gambar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: artikelForm.slug || 'artikel', gambar: hasil }) })
        .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
        .then(({ ok, d }) => {
          setArtikelBusy(false);
          if (!ok) { tampilkanToast(false, (d && d.error) || 'Gagal mengunggah foto, dipakai versi sementara.'); return; }
          setArtikelForm((f) => ({ ...f, gambar: d.url }));
        })
        .catch(() => { setArtikelBusy(false); tampilkanToast(false, 'Gagal mengunggah foto, dipakai versi sementara.'); });
    };
    img.onerror = () => { URL.revokeObjectURL(url); tampilkanToast(false, 'Foto tidak bisa dibaca.'); };
    img.src = url;
  };
  const kirimArtikel = async (daftar) => {
    const r = await fetch('/api/artikel', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ artikel: daftar }) });
    const d = await r.json().catch(() => ({}));
    return { ok: r.ok, d };
  };
  const simpanArtikel = async () => {
    const baru = { slug: artikelForm.slug, judul: artikelForm.judul, ringkasan: artikelForm.ringkasan, tanggal: artikelForm.tanggal, isi: artikelForm.isiTeks, gambar: artikelForm.gambar, terbit: artikelForm.terbit };
    const daftar = artikelSel >= 0 ? artikelList.map((a, i) => (i === artikelSel ? baru : a)) : [...artikelList, baru];
    setArtikelBusy(true);
    const { ok, d } = await kirimArtikel(daftar);
    setArtikelBusy(false);
    if (!ok) { tampilkanToast(false, d.error || 'Gagal menyimpan artikel.'); return; }
    tampilkanToast(true, 'Artikel tersimpan.');
    setArtikelList(d.artikel);
    setArtikelSel(-1);
    setArtikelForm(kosongArtikel);
  };
  const hapusArtikel = async (i) => {
    if (!(await tanyaKonfirmasi('Hapus artikel "' + artikelList[i].judul + '"?'))) return;
    const { ok, d } = await kirimArtikel(artikelList.filter((_, j) => j !== i));
    if (!ok) { tampilkanToast(false, d.error || 'Gagal menghapus artikel.'); return; }
    tampilkanToast(true, 'Artikel dihapus.');
    setArtikelList(d.artikel);
    setArtikelSel(-1);
  };
  const [kurs, setKurs] = useState(16000);
  /* Saldo provider ditampilkan dalam Rupiah. Kalau provider membalas dalam USD, dikonversi pakai kurs, dengan nilai USD aslinya sebagai keterangan kecil. */
  const saldoAsliUsd = saldoProv.currency && saldoProv.currency !== 'IDR';
  const saldoIdr = saldoProv.saldo === null ? null : (saldoAsliUsd ? saldoProv.saldo * kurs : saldoProv.saldo);
  const saldoTxt = saldoIdr === null ? '—' : rp(saldoIdr) + (saldoAsliUsd ? ' (≈ ' + saldoProv.saldo.toFixed(2) + ' ' + saldoProv.currency + ')' : '');
  const provMenipis = saldoIdr !== null && saldoIdr < PROVIDER_LOW;
  const [massMarkup, setMassMarkup] = useState('');
  const [selSvc, setSelSvc] = useState({});
  const [svcQ, setSvcQ] = useState('');
  const [svcCat, setSvcCat] = useState('all');
  const [svcPage, setSvcPage] = useState(1);
  const [kursDirty, setKursDirty] = useState(false);
  const [svcDirty, setSvcDirty] = useState({});
  const [svcSaving, setSvcSaving] = useState(false);
  const [syncedAt, setSyncedAt] = useState(null);
  const [liveOrders, setLiveOrders] = useState([]);
  const [ordersBusy, setOrdersBusy] = useState(false);
  const [ordersMsg, setOrdersMsg] = useState(null);
  /* Pengganti window.confirm yang menampilkan tulisan localhost. */
  const [konfirm, setKonfirm] = useState(null);
  const tanyaKonfirmasi = (pesan) => new Promise((resolve) => setKonfirm({ pesan, resolve }));
  /* Refund langsung dari admin untuk pesanan yang gagal atau dibatalkan. Saldo user langsung bertambah. */
  const refundPesanan = async (id) => {
    if (!(await tanyaKonfirmasi('Refund pesanan ini ke saldo user? Jumlahnya dihitung otomatis dari sisa pesanan.'))) return;
    const r = await fetch('/api/orders/refund', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { tampilkanToast(false, d.error || 'Refund gagal.'); return; }
    tampilkanToast(true, 'Refund Rp ' + Number(d.jumlah).toLocaleString('id-ID') + ' masuk ke saldo user.');
    muatRefund();
  };
  const [updLog, setUpdLog] = useState([]);
  const hapusRiwayatAdmin = async (rid) => {
    if (!(await tanyaKonfirmasi('Hapus catatan riwayat ini? Layanannya tidak ikut terhapus.'))) return;
    const r = await fetch('/api/riwayat?id=' + encodeURIComponent(rid), { method: 'DELETE' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { tampilkanToast(false, d.error || 'Gagal menghapus riwayat.'); return; }
    tampilkanToast(true, 'Catatan riwayat dihapus.');
    await muatRiwayat();
  };
  const muatRiwayat = () => fetch('/api/riwayat').then((r) => (r.ok ? r.json() : null)).then((d) => {
    if (d && Array.isArray(d.riwayat)) setUpdLog(d.riwayat.map((x) => ({ rid: x.id, date: x.tanggal, id: x.layananId, type: x.tipe, from: x.lama, to: x.baru })));
  }).catch(() => {});
  const [updF, setUpdF] = useState('all');
  const [depF, setDepF] = useState('Semua');
  const [siap, setSiap] = useState(false);
  /* Kalau data layanan lambat atau gagal, layar pemuatan tetap berakhir setelah beberapa detik. */
  useEffect(() => {
    const t = setTimeout(() => setSiap(true), 4000);
    return () => clearTimeout(t);
  }, []);
  const [undian, setUndian] = useState(null);
  const muatUndian = () => fetch('/api/undian').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) setUndian(d); }).catch(() => {});
  const undiUndian = async () => {
    if (!(await tanyaKonfirmasi('Undi pemenang undian bulan ini sekarang? Hanya bisa dilakukan sekali per bulan.'))) return;
    const r = await fetch('/api/undian', { method: 'POST' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { tampilkanToast(false, d.error || 'Undian gagal.'); return; }
    tampilkanToast(true, 'Pemenang: ' + d.pemenang.username + '. Hadiah sudah masuk ke saldo.');
    await muatUndian();
  };
  const [toast, setToast] = useState(null);
  const tampilkanToast = (ok, text) => setToast({ ok, text });
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);
  const [supportProfil, setSupportProfil] = useState({ nama: 'Tim Support', inisial: 'SG' });
  const simpanSupport = async () => {
    const r = await fetch('/api/support', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(supportProfil) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { tampilkanToast(false, d.error || 'Gagal menyimpan profil support.'); return; }
    setSupportProfil({ nama: d.nama, inisial: d.inisial });
    tampilkanToast(true, 'Profil tim support tersimpan.');
  };
  const [rec, setRec] = useState({ id: '', tipe: 'up', lama: '', baru: '' });
  /* Pilih layanan pertama dari katalog asli, begitu katalog dimuat. */
  useEffect(() => {
    if (services.length && !services.some((s) => String(s.id) === rec.id)) setRec((r) => ({ ...r, id: String(services[0].id) }));
  }, [services]);
  const [settingsTab, setSettingsTab] = useState('Keamanan');
  const [pwOld, setPwOld] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwNew2, setPwNew2] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [twofa, setTwofa] = useState(false);
  const [notif, setNotif] = useState({ order: true, deposit: true, ticket: true, refund: true, withdraw: true });
  const [range, setRange] = useState('7 Hari');
  const [cFrom, setCFrom] = useState(hariLalu(6));
  const [cTo, setCTo] = useState(TODAY);
  const [showTable, setShowTable] = useState(false);
  const [statistik, setStatistik] = useState({ cur: [], prev: [], komisiTersedia: 0 });

  const isDark = theme === 'dark';
  const colors = isDark ? CHART_COLORS.dark : CHART_COLORS.light;
  const series = CHART_SERIES.map((s) => ({ ...s, color: colors[s.key] }));
  const accentVars = accentVarsFor({ accent, theme });
  const A = ACCENTS[accent] || ACCENTS.red;

  const users = pengguna.filter((u) => u.username.toLowerCase().includes(q.toLowerCase()));
  const orders = liveOrders.filter((o) => orderFilter === 'Semua' || o.status === orderFilter);
  const pendingDeposits = deposits.filter((d) => d.status === 'Menunggu').length;
  useEffect(() => { muatDeposit(); }, []);
  useEffect(() => { muatTiket(); }, []);
  useEffect(() => { muatRefund(); }, []);
  useEffect(() => { muatAfiliasiAdmin(); }, []);
  useEffect(() => { muatPeringkat(); }, []);
  useEffect(() => { muatUndian(); }, []);
  useEffect(() => { muatRiwayat(); }, []);
  useEffect(() => { fetch('/api/support').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d && d.nama) setSupportProfil({ nama: d.nama, inisial: d.inisial }); }).catch(() => {}); }, []);
  useEffect(() => { muatPengguna(); }, []);
  useEffect(() => {
    fetch('/api/provider', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'balance' }) })
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok || d.error) throw new Error(d.error || 'Gagal mengambil saldo provider.');
        setSaldoProv({ saldo: Number(d.balance), currency: d.currency || '', error: '' });
      })
      .catch((e) => setSaldoProv({ saldo: null, currency: '', error: e.message || 'Gagal mengambil saldo provider.' }));
  }, []);
  const openTickets = tickets.filter((t) => t.status !== 'Ditutup').length;
  const pendingRefunds = refunds.filter((r) => r.status === 'Menunggu').length;
  const badges = { Deposit: pendingDeposits, Tiket: openTickets, Refund: pendingRefunds };
  const totalPending = pendingDeposits + openTickets + pendingRefunds;
  const ticket = tickets.find((t) => t.id === selTicket) || null;
  const [rFrom, rTo] = resolveRange(range, cFrom, cTo);
  const trend = statistik.cur;
  const trendTotals = trend.reduce((acc, d) => ({
    deposit: acc.deposit + d.deposit, revenue: acc.revenue + d.revenue,
    komisi: acc.komisi + d.komisi, order: acc.order + d.order
  }), { deposit: 0, revenue: 0, komisi: 0, order: 0 });
  const prevDays = (() => {
    const days = daysBetween(rFrom, rTo);
    if (!days.length) return [];
    const n = days.length;
    const shift = (k) => new Date(Date.parse(days[0] + 'T00:00:00Z') + k * 86400000).toISOString().slice(0, 10);
    return daysBetween(shift(-n), shift(-1));
  })();
  const prevTotals = statistik.prev.reduce((acc, d) => ({
    deposit: acc.deposit + d.deposit, revenue: acc.revenue + d.revenue,
    komisi: acc.komisi + d.komisi, order: acc.order + d.order
  }), { deposit: 0, revenue: 0, komisi: 0, order: 0 });
  const prevFrom = prevDays.length ? prevDays[0] : '';
  const prevTo = prevDays.length ? prevDays[prevDays.length - 1] : '';
  useEffect(() => {
    if (!rFrom || !rTo) return undefined;
    let batal = false;
    const ambil = (dari, sampai) => (dari && sampai
      ? fetch('/api/statistik?from=' + dari + '&to=' + sampai).then((r) => (r.ok ? r.json() : null))
      : Promise.resolve(null));
    Promise.all([ambil(rFrom, rTo), ambil(prevFrom, prevTo)]).then(([cur, prev]) => {
      if (batal) return;
      setStatistik({
        cur: cur && Array.isArray(cur.hari) ? cur.hari : [],
        prev: prev && Array.isArray(prev.hari) ? prev.hari : [],
        komisiTersedia: cur && typeof cur.komisiTersedia === 'number' ? cur.komisiTersedia : 0
      });
    }).catch(() => {});
    return () => { batal = true; };
  }, [rFrom, rTo, prevFrom, prevTo]);
  const compareLine = (cur, prev) => {
    if (!prevDays.length || prev <= 0) return { sub: 'Tidak ada data pembanding', subColor: 'var(--t5)' };
    const p = Math.round(((cur - prev) / prev) * 100);
    return p >= 0
      ? { sub: '▲ naik ' + p + '% dibanding periode sebelumnya', subColor: '#22C55E' }
      : { sub: '▼ turun ' + Math.abs(p) + '% dibanding periode sebelumnya', subColor: '#FF5A75' };
  };

  const setDepositStatus = (id, status) => {
    const aksi = status === 'Berhasil' ? 'setujui' : 'tolak';
    fetch('/api/deposits', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, aksi }) })
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then((res) => { if (!res.ok) tampilkanToast(false, res.d.error); else tampilkanToast(true, status === 'Berhasil' ? 'Deposit disetujui. Saldo user sudah bertambah.' : 'Deposit ditolak.'); muatDeposit(); })
      .catch(() => muatDeposit());
  };
  const toggleService = (id) => { setServices((list) => list.map((s) => (s.id === id ? { ...s, aktif: !s.aktif } : s))); tandai([id]); };
  const setRefundStatus = async (id, aksi) => {
    const r = await fetch('/api/refunds', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, aksi }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { tampilkanToast(false, d.error || 'Gagal memproses refund.'); return; }
    tampilkanToast(true, aksi === 'setujui' ? 'Refund disetujui. Saldo user sudah bertambah.' : 'Refund ditolak.');
    await muatRefund();
  };
  const setRankMin = (i, val) => setRanks((list) => list.map((r, j) => (j === i ? { ...r, min: Math.max(0, Number(val) || 0) } : r)));

  /* Katalog dan pesanan diambil dari penyimpanan di server. */
  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((d) => {
        setSiap(true);
        if (Array.isArray(d.services)) setServices(d.services);
        if (d.settings && d.settings.kurs) setKurs(d.settings.kurs);
        if (d.disinkron) setSyncedAt(d.disinkron);
      })
      .catch(() => {});
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.orders)) setLiveOrders(d.orders); })
      .catch(() => {});
  }, []);

  const [provBusy, setProvBusy] = useState(false);
  const [provMsg, setProvMsg] = useState(null);

  /* Panggilan selalu lewat server kita, supaya API key tidak ikut ke browser. */
  const callProvider = async (action, params) => {
    const r = await fetch('/api/provider', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...params })
    });
    const data = await r.json();
    if (!r.ok || (data && data.error)) throw new Error((data && data.error) || 'Gagal memanggil provider.');
    return data;
  };

  const cekProvider = async () => {
    setProvBusy(true);
    setProvMsg(null);
    try {
      const d = await callProvider('balance');
      const idr = d.currency && d.currency !== 'IDR' ? Number(d.balance) * kurs : Number(d.balance);
      setProvMsg({ ok: true, text: 'Tersambung. Saldo provider: ' + rp(idr) + (d.currency && d.currency !== 'IDR' ? ' (≈ ' + Number(d.balance).toFixed(2) + ' ' + d.currency + ')' : '') });
    } catch (e) {
      setProvMsg({ ok: false, text: e.message });
    }
    setProvBusy(false);
  };

  const importServices = async () => {
    setProvBusy(true);
    setProvMsg(null);
    try {
      const r = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kurs })
      });
      const d = await r.json();
      if (!r.ok || d.error) throw new Error(d.error || 'Gagal menarik layanan.');
      const katalog = await (await fetch('/api/services')).json();
      setServices(katalog.services || []);
      setSyncedAt(katalog.disinkron || null);
      setSelSvc({});
      setSvcDirty({});
      setSvcQ('');
      setSvcCat('all');
      setSvcPage(1);
      setProvMsg({ ok: true, text: d.jumlah + ' layanan dari ' + d.kategori + ' kategori tersimpan. Markup yang sudah diatur tetap dipertahankan.' });
    } catch (e) {
      setProvMsg({ ok: false, text: e.message });
    }
    setProvBusy(false);
  };

  const usd = (rupiah) => '$' + (rupiah / kurs).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const SVC_PER_PAGE = 50;
  /* Hasil hitungan berat disimpan, supaya tidak diulang tiap kali layar berubah. */
  const svcCats = useMemo(() => Array.from(new Set(services.map((x) => x.kategori).filter(Boolean))).sort(), [services]);
  /* Nama layanan diubah ke huruf kecil sekali saja, bukan tiap render. */
  const svcIndex = useMemo(() => services.map((x) => (x.nama + ' ' + x.id).toLowerCase()), [services]);
  const svcFiltered = useMemo(() => {
    const q = svcQ.trim().toLowerCase();
    return services.filter((x, i) => {
      if (svcCat !== 'all' && x.kategori !== svcCat) return false;
      return q === '' || svcIndex[i].includes(q);
    });
  }, [services, svcIndex, svcQ, svcCat]);
  const svcPages = Math.max(1, Math.ceil(svcFiltered.length / SVC_PER_PAGE));
  const svcPageSafe = Math.min(svcPage, svcPages);
  const svcRows = svcFiltered.slice((svcPageSafe - 1) * SVC_PER_PAGE, svcPageSafe * SVC_PER_PAGE);
  const selectedIds = useMemo(() => svcFiltered.map((x) => x.id).filter((id) => selSvc[id]), [svcFiltered, selSvc]);
  const selCount = selectedIds.length;
  const allSelected = useMemo(() => svcFiltered.length > 0 && svcFiltered.every((x) => selSvc[x.id]), [svcFiltered, selSvc]);
  const toggleAll = () => setSelSvc(allSelected ? {} : Object.fromEntries(svcFiltered.map((x) => [x.id, true])));
  const toggleSel = (id) => setSelSvc((m) => ({ ...m, [id]: !m[id] }));
  const tandai = (ids) => setSvcDirty((d) => { const n = { ...d }; ids.forEach((id) => { n[id] = true; }); return n; });

  const dirtyCount = Object.keys(svcDirty).length;
  const adaPerubahan = dirtyCount > 0 || kursDirty;
  const labelSimpan = svcSaving
    ? 'Menyimpan...'
    : dirtyCount > 0
      ? 'Simpan ' + dirtyCount + ' perubahan'
      : kursDirty
        ? 'Simpan kurs'
        : 'Semua perubahan tersimpan';

  const simpanLayanan = async () => {
    const ids = Object.keys(svcDirty);
    setSvcSaving(true);
    try {
      const updates = services.filter((x) => svcDirty[x.id]).map((x) => ({ id: x.id, markup: x.markup, aktif: x.aktif }));
      const r = await fetch('/api/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates, kurs })
      });
      const d = await r.json();
      if (!r.ok || d.error) throw new Error(d.error || 'Gagal menyimpan.');
      setSvcDirty({});
      setKursDirty(false);
      tampilkanToast(true, 'Perubahan layanan tersimpan.');
      /* Kurs baru mengubah harga dasar di server, jadi katalog dimuat ulang. */
      const segar = await (await fetch('/api/services')).json();
      if (Array.isArray(segar.services) && segar.services.length) setServices(segar.services);
      setProvMsg({ ok: true, text: ids.length ? ids.length + ' layanan tersimpan.' : 'Kurs tersimpan.' });
    } catch (e) {
      setProvMsg({ ok: false, text: e.message });
    }
    setSvcSaving(false);
  };

  const applyMarkup = (ids) => {
    const m = Number(massMarkup);
    if (massMarkup === '' || !Number.isFinite(m) || m < 0) return;
    const kena = new Set(ids === null ? services.map((x) => x.id) : ids);
    setServices((list) => list.map((x) => (kena.has(x.id) ? { ...x, markup: m } : x)));
    tandai(Array.from(kena));
  };
  const resetMarkup = () => { setServices((list) => list.map((x) => ({ ...x, markup: 0 }))); tandai(services.map((x) => x.id)); };
  const setServiceMarkup = (id, val) => { setServices((list) => list.map((x) => (x.id === id ? { ...x, markup: Math.max(0, Number(val) || 0) } : x))); tandai([id]); };

  const updMsg = (u) => (u.from ? UPS[u.type].label + ' dari ' + u.from + ' ke ' + u.to : UPS[u.type].label);
  const updDays = (() => {
    const out = [];
    const idx = {};
    updLog.filter((u) => updF === 'all' || u.type === updF).forEach((u) => {
      if (!(u.date in idx)) { idx[u.date] = out.length; out.push({ date: u.date, items: [] }); }
      const svc = services.find((s) => String(s.id) === String(u.id));
      out[idx[u.date]].items.push({ rid: u.rid, id: u.id, name: svc ? svc.nama : 'Layanan ' + u.id, icon: ICON.layers, bg: UPS[u.type].bg, fg: UPS[u.type].fg, msg: updMsg(u) });
    });
    return out;
  })();
  const addUpdate = async () => {
    const needPrice = rec.tipe === 'up' || rec.tipe === 'down';
    if (needPrice && (!rec.lama.trim() || !rec.baru.trim())) return;
    const r = await fetch('/api/riwayat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ layananId: rec.id, tipe: rec.tipe, lama: needPrice ? rec.lama.trim() : '', baru: needPrice ? rec.baru.trim() : '' }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { tampilkanToast(false, d.error || 'Gagal mencatat perubahan.'); return; }
    setRec((x) => ({ ...x, lama: '', baru: '' }));
    tampilkanToast(true, 'Perubahan layanan tercatat.');
    await muatRiwayat();
  };

  const segarkanPesanan = async () => {
    setOrdersBusy(true);
    setOrdersMsg(null);
    try {
      const r = await fetch('/api/orders', { method: 'PATCH' });
      const d = await r.json();
      if (!r.ok || d.error) throw new Error(d.error || 'Gagal menyegarkan.');
      setLiveOrders(d.orders || []);
      setOrdersMsg({ ok: true, text: d.diperbarui + ' pesanan diperbarui dari provider.' });
    } catch (e) {
      setOrdersMsg({ ok: false, text: e.message });
    }
    setOrdersBusy(false);
  };

  const updatePwd = () => {
    if (!pwOld || !pwNew) return setPwMsg('Isi semua kolom password.');
    if (pwNew.length < 8) return setPwMsg('Password baru minimal 8 karakter.');
    if (pwNew !== pwNew2) return setPwMsg('Konfirmasi password tidak sama.');
    setPwOld(''); setPwNew(''); setPwNew2('');
    setPwMsg('Password berhasil diperbarui.');
  };

  const kirimTiket = async (body) => {
    const r = await fetch('/api/tickets', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { tampilkanToast(false, d.error || 'Gagal menyimpan tiket.'); return false; }
    tampilkanToast(true, body.aksi === 'tutup' ? 'Tiket ditutup.' : 'Balasan terkirim.');
    await muatTiket();
    return true;
  };
  const sendReply = async () => {
    if (!ticket || !reply.trim()) return;
    const teks = reply.trim();
    setReply('');
    if (!(await kirimTiket({ id: ticket.id, aksi: 'balas', text: teks }))) setReply(teks);
  };
  const closeTicket = () => kirimTiket({ id: selTicket, aksi: 'tutup' });

  const themeOpts = [['light', 'Terang'], ['dark', 'Gelap'], ['auto', 'Otomatis']].map((m) => ({
    k: m[0], t: m[1], on: themeMode === m[0],
    pick: m[0] === 'auto'
      ? () => { const dark = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : true; setThemeMode('auto'); setTheme(dark ? 'dark' : 'light'); }
      : () => { setThemeMode(m[0]); setTheme(m[0]); }
  }));
  const accentOpts = Object.keys(ACCENTS).map((k) => ({ k, t: ACCENTS[k].label, c: ACCENTS[k].c, on: accent === k, pick: () => setAccent(k) }));

  /* Angka ringkasan dihitung dari pesanan asli. */
  const hariIni = tanggalWib(new Date().toISOString());
  const bulanIni = hariIni.slice(0, 7);
  const pesananHariIni = liveOrders.filter((o) => o.dibuat && tanggalWib(o.dibuat) === hariIni).length;
  const pendapatanBulanIni = liveOrders
    .filter((o) => o.dibuat && o.status !== 'Canceled' && tanggalWib(o.dibuat).slice(0, 7) === bulanIni)
    .reduce((s, o) => s + (Number(o.biaya) || 0), 0);
  const stats = [
    { c: A.l, tint: 'rgba(var(--accent-rgb),.12)', line: 'rgba(var(--accent-rgb),.3)', l: 'Total Pengguna', v: String(pengguna.length), a: 'Lihat Pengguna', icon: ICON.users, onClick: () => setTab('Pengguna') },
    { c: isDark ? '#FB923C' : '#C2410C', tint: isDark ? 'rgba(249,115,22,.12)' : 'rgba(249,115,22,.07)', line: isDark ? 'rgba(249,115,22,.3)' : 'rgba(249,115,22,.22)', l: 'Pesanan Hari Ini', v: String(pesananHariIni), a: 'Lihat Pesanan', icon: ICON.cart, onClick: () => setTab('Pesanan') },
    { c: isDark ? '#4ADE80' : '#15803D', tint: isDark ? 'rgba(34,197,94,.12)' : 'rgba(34,197,94,.07)', line: isDark ? 'rgba(34,197,94,.3)' : 'rgba(34,197,94,.22)', l: 'Pendapatan Bulan Ini', v: rp(pendapatanBulanIni), a: 'Lihat Pesanan', icon: ICON.money, onClick: () => setTab('Pesanan') },
    { c: isDark ? '#60A5FA' : '#1D4ED8', tint: isDark ? 'rgba(59,130,246,.12)' : 'rgba(59,130,246,.07)', line: isDark ? 'rgba(59,130,246,.3)' : 'rgba(59,130,246,.22)', l: 'Tiket Terbuka', v: String(openTickets), a: 'Buka Tiket', icon: ICON.ticket, onClick: () => setTab('Tiket') }
  ];

  const navBtn = (t) => {
    const on = tab === t.id;
    const n = badges[t.id] || 0;
    return (
      <button key={t.id} type="button" className={'sb' + (on ? ' on' : '')} aria-current={on ? 'page' : undefined} onClick={() => bukaTab(t.id)}>
        <Svg d={t.icon} />
        <span style={{ flex: '1' }}>{t.id}</span>
        {n > 0 ? <span className="count" style={{ background: on ? 'rgba(255,255,255,.25)' : 'var(--accent)' }}>{n}</span> : null}
        {on ? <Svg d={ICON.chev} size={14} sw={2.4} /> : null}
      </button>
    );
  };

  const v = { theme, setTheme, themeMode, setThemeMode, accent, setAccent, tab, setTab, navOpen, setNavOpen, bukaTab, q, setQ, pengguna, setPengguna, saldoProv, setSaldoProv, muatPengguna, orderFilter, setOrderFilter, deposits, setDeposits, muatDeposit, services, setServices, tickets, setTickets, muatTiket, selTicket, setSelTicket, reply, setReply, refunds, setRefunds, muatRefund, ringkasAfiliasi, setRingkasAfiliasi, muatAfiliasiAdmin, ranks, setRanks, muatPeringkat, simpanPeringkat, artikelList, setArtikelList, artikelSel, setArtikelSel, kosongArtikel, artikelForm, setArtikelForm, artikelBusy, setArtikelBusy, artikelPratinjau, setArtikelPratinjau, muatArtikel, pilihArtikel, artikelBaru, pilihGambar, kirimArtikel, simpanArtikel, hapusArtikel, kurs, setKurs, saldoAsliUsd, saldoIdr, saldoTxt, provMenipis, massMarkup, setMassMarkup, selSvc, setSelSvc, svcQ, setSvcQ, svcCat, setSvcCat, svcPage, setSvcPage, kursDirty, setKursDirty, svcDirty, setSvcDirty, svcSaving, setSvcSaving, syncedAt, setSyncedAt, liveOrders, setLiveOrders, ordersBusy, setOrdersBusy, ordersMsg, setOrdersMsg, konfirm, setKonfirm, tanyaKonfirmasi, refundPesanan, updLog, setUpdLog, hapusRiwayatAdmin, muatRiwayat, updF, setUpdF, depF, setDepF, siap, setSiap, undian, setUndian, muatUndian, undiUndian, toast, setToast, tampilkanToast, supportProfil, setSupportProfil, simpanSupport, rec, setRec, settingsTab, setSettingsTab, pwOld, setPwOld, pwNew, setPwNew, pwNew2, setPwNew2, pwMsg, setPwMsg, twofa, setTwofa, notif, setNotif, range, setRange, cFrom, setCFrom, cTo, setCTo, showTable, setShowTable, statistik, setStatistik, isDark, colors, series, accentVars, A, users, orders, pendingDeposits, openTickets, pendingRefunds, badges, totalPending, ticket, trend, trendTotals, prevDays, prevTotals, prevFrom, prevTo, compareLine, setDepositStatus, toggleService, setRefundStatus, setRankMin, provBusy, setProvBusy, provMsg, setProvMsg, callProvider, cekProvider, importServices, usd, SVC_PER_PAGE, svcCats, svcIndex, svcFiltered, svcPages, svcPageSafe, svcRows, selectedIds, selCount, allSelected, toggleAll, toggleSel, tandai, dirtyCount, adaPerubahan, labelSimpan, simpanLayanan, applyMarkup, resetMarkup, setServiceMarkup, updMsg, updDays, addUpdate, segarkanPesanan, updatePwd, kirimTiket, sendReply, closeTicket, themeOpts, accentOpts, hariIni, bulanIni, pesananHariIni, pendapatanBulanIni, stats, navBtn };

  return (
    <>
      <Head>
        <title>SosmedGo — Admin</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
      </Head>
      <style jsx global>{`
.theme-dark{--bg:#0B0B0E;--s0:#0D0D10;--s1:#111115;--s2:#141418;--s3:#16161A;--s4:#1E1E23;--b1:#18181D;--b2:#1E1E24;--b3:#23232A;--b4:#26262C;--b5:#2A2A30;--b6:#3A3A42;--tx:#F4F4F5;--t1:#E4E4E7;--t2:#C9CBD1;--t3:#A1A3AB;--t4:#8B8D96;--t5:#6B6E78;--t6:#4B4D56;--rt:#FF5A75;--rt2:#FFB3C0;--gr:#22C55E;--am:#F59E0B;--bl:#60A5FA;--hi:#FFFFFF}
.theme-light{--bg:#FFFFFF;--s0:#FFFFFF;--s1:#FFFFFF;--s2:#FFFFFF;--s3:#F1F5F9;--s4:#E2E8F0;--b1:#F1F5F9;--b2:#E2E8F0;--b3:#E2E8F0;--b4:#CBD5E1;--b5:#CBD5E1;--b6:#94A3B8;--tx:#0F172A;--t1:#1E293B;--t2:#334155;--t3:#475569;--t4:#64748B;--t5:#94A3B8;--t6:#CBD5E1;--rt2:#9F1239;--gr:#15803D;--am:#B45309;--bl:#2563EB;--hi:#0F172A}
.theme-light .card{border-color:#E2E8F0;box-shadow:0 4px 16px rgba(16,24,40,.07)}
.theme-light .dash-head{background:linear-gradient(180deg,rgba(var(--accent-rgb),.06) 0%,rgba(var(--accent-rgb),0) 100%)}
body{margin:0;background:var(--bg);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
html{scroll-behavior:smooth}
a{color:var(--t2);text-decoration:none}a:hover{color:var(--hi)}
button{font-family:inherit;transition:transform .15s cubic-bezier(.4,0,.2,1),box-shadow .15s ease,border-color .15s ease,background-color .15s ease,color .15s ease,opacity .15s ease;-webkit-tap-highlight-color:transparent}
button:disabled{cursor:not-allowed}
button:active:not(:disabled){transform:scale(.97)}
.submit:not(:disabled):hover{transform:translateY(-1px);box-shadow:0 14px 34px rgba(var(--accent-rgb),.38)}
.submit:not(:disabled):active{transform:translateY(0) scale(.97);box-shadow:0 6px 16px rgba(var(--accent-rgb),.3)}
.submit:disabled{opacity:.55;box-shadow:none}
.ghost:hover{transform:translateY(-1px)}
.card,.inp,.ta{transition:border-color .15s ease,box-shadow .15s ease}
.sb{width:100%;display:flex;align-items:center;gap:12px;font-size:13px;font-weight:500;color:var(--t3);padding:11px 12px;border-radius:12px;border:none;background:transparent;cursor:pointer;text-align:left;min-height:44px;box-sizing:border-box;text-decoration:none}
.sb:hover{background:var(--s3);color:var(--hi)}
.sb.on{background:var(--accent);color:#FFFFFF;font-weight:600;box-shadow:0 8px 22px rgba(var(--accent-rgb),.3)}
.count{font-size:10px;font-weight:700;color:#FFFFFF;border-radius:6px;padding:2px 7px}
.card{background:var(--s1);border:1px solid var(--b2);border-radius:16px}
.ibtn{height:38px;border-radius:10px;background:var(--s2);border:1px solid var(--b3);display:flex;align-items:center;justify-content:center;gap:6px;padding:0 12px;cursor:pointer;color:var(--t2);font-size:11px;font-weight:600;position:relative}
.ibtn:hover{border-color:var(--b6)}
.ibtn .dot{position:absolute;top:8px;right:9px;width:7px;height:7px;border-radius:50%;background:var(--accent)}
.ddic{width:28px;height:28px;flex:none;border-radius:8px;display:flex;align-items:center;justify-content:center}
.ghost{height:36px;border-radius:9px;border:1px solid var(--b5);background:var(--s1);color:var(--t1);font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:0 12px}
.ghost:hover{border-color:var(--rt)}
.ghost.ok{color:#22C55E;border-color:rgba(34,197,94,.35)}
.ghost.no{color:#FF5A75;border-color:rgba(255,90,117,.35)}
.submit{height:44px;border-radius:10px;border:1px solid var(--accent-h);background:var(--accent);color:#FFFFFF;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 18px;box-shadow:0 10px 26px rgba(var(--accent-rgb),.3)}
.submit:hover{background:var(--accent-h)}
.submit:disabled{opacity:.5;cursor:not-allowed}
.chip{display:inline-flex;align-items:center;height:38px;border:1px solid var(--b3);background:var(--s1);border-radius:999px;padding:0 16px;color:var(--t2);font-size:12px;font-weight:600;cursor:pointer;margin:0 6px 14px 0}
.chip:hover{border-color:var(--b6)}
.chip.on{background:var(--accent);border-color:var(--accent);color:#FFFFFF}
.inp{width:100%;max-width:340px;box-sizing:border-box;height:44px;background:var(--s0);border:1px solid var(--b3);border-radius:10px;padding:0 14px;color:var(--hi);font-family:inherit;font-size:13px;outline:none;margin-bottom:14px}
.inp:focus,.ta:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(var(--accent-rgb),.15)}
.inp::placeholder,.ta::placeholder{color:var(--t6)}
.ta{width:100%;box-sizing:border-box;min-height:84px;background:var(--s0);border:1px solid var(--b3);border-radius:10px;padding:10px 14px;color:var(--hi);font-family:inherit;font-size:13px;outline:none;resize:vertical}
.pill{display:inline-block;font-size:11px;font-weight:600;border-radius:999px;padding:4px 10px;white-space:nowrap}
.tbl{width:100%;border-collapse:collapse;font-size:13px}
.tbl th{text-align:left;font-weight:600;font-size:11px;color:var(--t4);padding:14px 16px;border-bottom:1px solid var(--b2);white-space:nowrap}
.tbl td{padding:13px 16px;border-bottom:1px solid var(--b1);white-space:nowrap;color:var(--t1)}
.tbl tr:last-child td{border-bottom:0}
.tbl tr.click{cursor:pointer}
.tbl tr.click:hover td{background:var(--s3)}
.muted{color:var(--t4)}
.sub{display:inline-flex;align-items:center;gap:8px;border:1px solid transparent;border-radius:10px;padding:10px 12px;background:transparent;color:var(--t3);font-size:12px;font-weight:600;cursor:pointer}
.sub:hover{color:var(--hi);background:var(--s2)}
.sub.on{color:var(--hi);background:var(--s2);border-color:var(--b5)}
.sw{width:44px;height:26px;border-radius:999px;border:none;cursor:pointer;position:relative;flex:none;padding:0}
.sw span{position:absolute;top:3px;width:20px;height:20px;border-radius:50%;background:#FFFFFF;transition:left .15s}
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
.idpill{flex:none;font-size:11px;font-weight:700;color:var(--rt);background:var(--r3);border:1px solid var(--r5);border-radius:999px;padding:3px 10px}
.bubble{border-radius:12px;padding:10px 14px;font-size:13px;line-height:1.5;max-width:80%;white-space:pre-wrap}
.adm-layout{display:flex;flex-wrap:wrap}
.adm-aside{flex:1 1 230px;max-width:250px;min-width:0;border-right:1px solid var(--b1);padding:22px 16px;display:flex;flex-direction:column;gap:2px;box-sizing:border-box}
.adm-main{flex:999 1 640px;min-width:0;display:flex;flex-direction:column}
.nav-toggle{display:none;align-items:center;justify-content:center;width:38px;height:38px;flex:none;border-radius:10px;background:var(--s2);border:1px solid var(--b3);color:var(--t2);cursor:pointer}
@media (max-width:900px){
  .nav-toggle{display:inline-flex}
  .dash-crumb{flex:1 1 auto;min-width:0}
  .adm-aside{display:none !important}
  .adm-aside.buka{display:flex !important;max-width:none !important;flex:1 1 100% !important;border-right:0 !important;border-bottom:1px solid var(--b1) !important}
  .dash-head{padding:12px 16px !important}
  .dash-main{padding:18px 16px 48px !important}
}
@media (max-width:640px){
  /* iOS memperbesar halaman kalau font input di bawah 16px. */
  .inp,.ta,input,select,textarea{font-size:16px !important}
  .dash-main{gap:16px !important}
}
`}</style>

      <div className={isDark ? 'theme-dark' : 'theme-light'} style={{ ...accentVars, fontFamily: "'Inter',system-ui,sans-serif", color: 'var(--tx)', background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexWrap: 'wrap' }}>
        <aside className={"adm-aside" + (navOpen ? " buka" : "")}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '22px', padding: '6px' }}>
            <img src="/icon.png" alt="" aria-hidden="true" className="logo-mark" width="24" height="24" style={{ borderRadius: "8px", display: "block" }} />
            <span style={{ fontSize: '17px', fontWeight: '800', color: 'var(--hi)', letterSpacing: '-.03em' }}>SosmedGo</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--s2)', border: '1px solid var(--b3)', borderRadius: '12px', padding: '10px', marginBottom: '14px' }}>
            <span style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>A</span>
            <span style={{ flex: '1', lineHeight: '1.35' }}>
              <span style={{ display: 'block', fontSize: '10px', color: 'var(--t5)' }}>Akun admin</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--hi)' }}>Administrator</span>
            </span>
          </div>

          <nav aria-label="Menu admin" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {TABS_MAIN.map(navBtn)}
          </nav>
          <div style={{ height: '1px', background: 'var(--b2)', margin: '14px 10px' }} />
          <nav aria-label="Menu dukungan" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {TABS_SUPPORT.map(navBtn)}
          </nav>
          <div style={{ height: '1px', background: 'var(--b2)', margin: '14px 10px' }} />
          <button type="button" className={'sb' + (tab === 'Pengaturan' ? ' on' : '')} aria-current={tab === 'Pengaturan' ? 'page' : undefined} onClick={() => bukaTab('Pengaturan')}>
            <Svg d={ICON.lock} /> Pengaturan
          </button>
          <Link href="/dashboard" className="sb"><Svg d={ICON.back} /> Ke panel user</Link>
          <a href="/api/admin-logout" className="sb"><Svg d={ICON.logout} /> Keluar</a>
        </aside>

        <div className="adm-main">
          <header className="dash-head" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px', padding: '18px 40px', borderBottom: '1px solid var(--b1)' }}>
            <button type="button" className="nav-toggle" onClick={() => setNavOpen(!navOpen)} aria-label="Menu" aria-expanded={navOpen}>
              <Svg d={ICON.bars} size={16} />
            </button>
            <div className="dash-crumb">
              <div style={{ fontSize: '13px', color: 'var(--t2)' }}>
                Admin <span style={{ color: 'var(--t6)' }}>›</span>{' '}
                <span style={{ color: 'var(--rt)', fontWeight: '600' }}>{TAB_CRUMB[tab]}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--t5)', marginTop: '4px' }}>Kelola pengguna, pesanan, deposit, tiket, dan afiliasi</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button type="button" className="ibtn" onClick={() => { setThemeMode(isDark ? 'light' : 'dark'); setTheme(isDark ? 'light' : 'dark'); }} aria-label="Ganti tema" style={{ padding: '0 12px' }}>
                <Svg d={isDark ? ICON.sun : ICON.moon} size={15} sw={2} />
                {isDark ? 'Terang' : 'Gelap'}
              </button>
              <button type="button" className="ibtn" aria-label="Notifikasi admin" onClick={() => setTab(pendingDeposits ? 'Deposit' : openTickets ? 'Tiket' : 'Ringkasan')} style={{ width: '38px', padding: 0 }}>
                <Svg d={ICON.bell} size={15} sw={2} />
                {totalPending > 0 ? <span className="dot" /> : null}
              </button>
              <span style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>A</span>
            </div>
          </header>

          <main className="dash-main" style={{ padding: '34px 40px 60px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div>
              <h1 style={{ margin: '0', fontSize: '26px', fontWeight: '700', letterSpacing: '-.02em' }}>
                {tab === 'Pengaturan' ? 'Pengaturan' : TAB_CRUMB[tab]} <span style={{ color: 'var(--accent-l)' }}>admin</span>
              </h1>
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--t4)' }}>Data di halaman ini diambil dari database dan provider.</p>
            </div>

            <AdminRingkasan v={v} />

            <Toast toast={toast} onClose={() => setToast(null)} />
            {konfirm ? <KotakKonfirmasi pesan={konfirm.pesan} onJawab={(ya) => { konfirm.resolve(ya); setKonfirm(null); }} /> : null}
            <AdminStatistik v={v} />

            <AdminPengguna v={v} />

            <AdminPesanan v={v} />

            <AdminDeposit v={v} />

            <AdminLayanan v={v} />
            <AdminTiket v={v} />

            <AdminUpdate v={v} />

            <AdminRefund v={v} />

            <AdminAfiliasi v={v} />

            <AdminBlog v={v} />

            <AdminPeringkat v={v} />

            <AdminPengaturan v={v} />
          </main>
        </div>
      </div>
    </>
  );
}
