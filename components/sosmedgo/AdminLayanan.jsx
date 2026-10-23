import React from 'react';
import { rp, hargaJual, Badge } from './admin-kit';

function AdminLayanan({ v }) {
  const {
    theme, setTheme, themeMode, setThemeMode, accent, setAccent, tab, setTab, navOpen, setNavOpen, bukaTab, q, setQ, pengguna, setPengguna, saldoProv, setSaldoProv, muatPengguna, orderFilter, setOrderFilter, deposits, setDeposits, muatDeposit, services, setServices, tickets, setTickets, muatTiket, selTicket, setSelTicket, reply, setReply, refunds, setRefunds, muatRefund, ringkasAfiliasi, setRingkasAfiliasi, muatAfiliasiAdmin, ranks, setRanks, muatPeringkat, simpanPeringkat, artikelList, setArtikelList, artikelSel, setArtikelSel, kosongArtikel, artikelForm, setArtikelForm, artikelBusy, setArtikelBusy, artikelPratinjau, setArtikelPratinjau, muatArtikel, pilihArtikel, artikelBaru, pilihGambar, kirimArtikel, simpanArtikel, hapusArtikel, kurs, setKurs, saldoInfo, PROVIDER_LIST, PROVIDER_LABEL, massMarkup, setMassMarkup, svcProvider, setSvcProvider, svcInProvider, setAktifMassal, selSvc, setSelSvc, svcQ, setSvcQ, svcCat, setSvcCat, svcCatOpen, setSvcCatOpen, svcCatQ, setSvcCatQ, svcCatFiltered, pilihSvcCat, svcPage, setSvcPage, kursDirty, setKursDirty, svcDirty, setSvcDirty, svcSaving, setSvcSaving, syncedAt, setSyncedAt, liveOrders, setLiveOrders, ordersBusy, setOrdersBusy, ordersMsg, setOrdersMsg, konfirm, setKonfirm, tanyaKonfirmasi, refundPesanan, updLog, setUpdLog, hapusRiwayatAdmin, muatRiwayat, updF, setUpdF, depF, setDepF, siap, setSiap, undian, setUndian, muatUndian, undiUndian, toast, setToast, tampilkanToast, supportProfil, setSupportProfil, simpanSupport, rec, setRec, settingsTab, setSettingsTab, pwOld, setPwOld, pwNew, setPwNew, pwNew2, setPwNew2, pwMsg, setPwMsg, twofa, setTwofa, notif, setNotif, range, setRange, cFrom, setCFrom, cTo, setCTo, showTable, setShowTable, statistik, setStatistik, isDark, colors, series, accentVars, A, users, orders, pendingDeposits, openTickets, pendingRefunds, badges, totalPending, ticket, trend, trendTotals, prevDays, prevTotals, prevFrom, prevTo, compareLine, setDepositStatus, toggleService, setRefundStatus, setRankMin, provBusy, setProvBusy, provMsg, setProvMsg, callProvider, cekProvider, importServices, usd, SVC_PER_PAGE, svcCats, svcIndex, svcFiltered, svcPages, svcPageSafe, svcRows, selectedIds, selCount, allSelected, toggleAll, toggleSel, tandai, dirtyCount, adaPerubahan, labelSimpan, simpanLayanan, applyMarkup, resetMarkup, setServiceMarkup, updMsg, updDays, addUpdate, segarkanPesanan, updatePwd, kirimTiket, sendReply, closeTicket, themeOpts, accentOpts, hariIni, bulanIni, pesananHariIni, pendapatanBulanIni, stats, navBtn, svcMuatGagal, muatServicesAwal
  } = v;
  return tab === 'Layanan' && (
        <>
          {svcMuatGagal ? (
            <div className="card" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', border: '1px solid var(--r4)', background: 'var(--r1)' }}>
              <span style={{ fontSize: '13px', color: 'var(--rt)' }}>Gagal memuat katalog layanan dari server (bukan berarti katalognya kosong). Coba lagi?</span>
              <button type="button" className="ghost" onClick={muatServicesAwal}>Coba Lagi</button>
            </div>
          ) : null}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {PROVIDER_LIST.map((provider) => (
              <button key={provider} type="button" className={'sub' + (svcProvider === provider ? ' on' : '')} onClick={() => setSvcProvider(provider)}>
                {PROVIDER_LABEL[provider] || provider}
              </button>
            ))}
          </div>

          <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700' }}>Markup massal</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <input className="inp" type="number" min="0" max="500" placeholder="Markup % (0-500)" value={massMarkup} onChange={(e) => setMassMarkup(e.target.value)} style={{ maxWidth: '160px', margin: 0 }} aria-label="Markup persen, 0 sampai 500" />
              <button type="button" className="submit" disabled={massMarkup === ''} onClick={() => applyMarkup(null)}>Terapkan ke semua ({svcInProvider.length})</button>
              <button type="button" className="ghost" disabled={selCount === 0 || massMarkup === ''} onClick={() => applyMarkup(selectedIds)}>Terapkan ke {selCount} dipilih</button>
              <button type="button" className="ghost" onClick={resetMarkup}>Reset ke harga dasar</button>
              <button type="button" className="submit" disabled={!adaPerubahan || svcSaving} onClick={simpanLayanan}>
                {labelSimpan}
              </button>
            </div>
            <div className="muted" style={{ fontSize: '12px' }}>
              Contoh: harga dasar Rp 12.000 dengan markup {massMarkup || 0}% menjadi {rp(hargaJual({ dasar: 12000, markup: Number(massMarkup) || 0 }))} ({usd(hargaJual({ dasar: 12000, markup: Number(massMarkup) || 0 }))}).
            </div>
          </div>

          <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700' }}>Status layanan ({PROVIDER_LABEL[svcProvider] || svcProvider})</div>
            <div className="muted" style={{ fontSize: '12px' }}>Layanan nonaktif tidak muncul di halaman pesan pelanggan, meski datanya tetap tersimpan.</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <button type="button" className="ghost" disabled={svcInProvider.length === 0} onClick={() => setAktifMassal(null, false)}>Nonaktifkan semua ({svcInProvider.length})</button>
              <button type="button" className="ghost" disabled={svcInProvider.length === 0} onClick={() => setAktifMassal(null, true)}>Aktifkan semua ({svcInProvider.length})</button>
              <button type="button" className="ghost" disabled={selCount === 0} onClick={() => setAktifMassal(selectedIds, false)}>Nonaktifkan {selCount} dipilih</button>
              <button type="button" className="ghost" disabled={selCount === 0} onClick={() => setAktifMassal(selectedIds, true)}>Aktifkan {selCount} dipilih</button>
              <button type="button" className="submit" disabled={!adaPerubahan || svcSaving} onClick={simpanLayanan}>
                {labelSimpan}
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: '18px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700' }}>Kurs USD</div>
              <div className="muted" style={{ fontSize: '12px', marginTop: '4px' }}>Harga dasar dari provider dihitung memakai kurs ini.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="muted" style={{ fontSize: '12px' }}>Rp per $1</span>
              <input className="inp" type="number" min="1" value={kurs} onChange={(e) => { setKurs(Math.max(1, Number(e.target.value) || 1)); setKursDirty(true); }} style={{ maxWidth: '150px', margin: 0 }} aria-label="Kurs Rupiah per dolar" />
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <input className="inp" placeholder="Cari nama atau ID layanan" value={svcQ} onChange={(e) => { setSvcQ(e.target.value); setSvcPage(1); }} style={{ maxWidth: '320px', margin: 0 }} />
            <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
              <button type="button" className="dd" aria-haspopup="listbox" aria-expanded={svcCatOpen} onClick={() => setSvcCatOpen((o) => !o)}>
                <span style={{ flex: '1', minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {svcCat === 'all' ? ('Semua kategori (' + svcCats.length + ')') : svcCat}
                </span>
                <i className="fa-solid fa-chevron-down" aria-hidden="true" style={{ fontSize: '11px', color: 'var(--t4)' }} />
              </button>
              {svcCatOpen ? (
                <div className="ddpanel" role="listbox" aria-label="Cari kategori">
                  <input type="text" className="inp" placeholder="Cari kategori..." value={svcCatQ} onChange={(e) => setSvcCatQ(e.target.value)} autoFocus style={{ margin: '0 0 6px', height: '38px' }} />
                  <div style={{ maxHeight: '220px', overflow: 'auto' }}>
                    {svcCatQ.trim() === '' ? (
                      <button type="button" role="option" aria-selected={svcCat === 'all'} className="ddopt" onClick={() => pilihSvcCat('all')}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Semua kategori ({svcCats.length})</span>
                      </button>
                    ) : null}
                    {svcCatFiltered.length === 0 ? (
                      <div className="muted" style={{ padding: '10px', fontSize: '12px' }}>Tidak ada kategori yang cocok.</div>
                    ) : svcCatFiltered.map((c) => (
                      <button key={c} type="button" role="option" aria-selected={c === svcCat} className="ddopt" onClick={() => pilihSvcCat(c)}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <span className="muted" style={{ fontSize: '12px' }}>{svcFiltered.length} layanan</span>
            {svcCat !== 'all' ? (
              <>
                <button type="button" className="ghost" disabled={svcFiltered.length === 0} onClick={() => setAktifMassal(svcFiltered.map((s) => s.id), true)}>Aktifkan kategori ini ({svcFiltered.length})</button>
                <button type="button" className="ghost" disabled={svcFiltered.length === 0} onClick={() => setAktifMassal(svcFiltered.map((s) => s.id), false)}>Nonaktifkan kategori ini ({svcFiltered.length})</button>
              </>
            ) : null}
          </div>

          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th><input type="checkbox" aria-label="Pilih semua hasil filter" checked={allSelected} onChange={toggleAll} style={{ accentColor: 'var(--accent)' }} /></th>
                  <th>ID</th><th>Nama Layanan</th><th>Kategori</th><th>Harga dasar</th><th>Markup</th><th>Harga jual</th><th>Harga USD</th><th>Min</th><th>Maks</th><th>Status</th><th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {svcRows.map((s) => {
                  const harga = hargaJual(s);
                  return (
                    <tr key={s.id}>
                      <td><input type="checkbox" checked={!!selSvc[s.id]} onChange={() => toggleSel(s.id)} aria-label={'Pilih ' + s.nama} style={{ accentColor: 'var(--accent)' }} /></td>
                      <td className="muted">{s.id}</td>
                      <td style={{ whiteSpace: 'normal', minWidth: '280px', maxWidth: '420px' }}>{s.nama}</td>
                      <td className="muted" style={{ whiteSpace: 'normal', minWidth: '160px', maxWidth: '240px' }}>{s.kategori || '—'}</td>
                      <td>{rp(s.dasar)}</td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <input className="inp" type="number" min="0" max="500" value={s.markup} onChange={(e) => setServiceMarkup(s.id, e.target.value)} style={{ maxWidth: '84px', margin: 0, height: '34px' }} aria-label={'Markup ' + s.nama + ', 0 sampai 500 persen'} />
                          <span className="muted">%</span>
                        </span>
                      </td>
                      <td>{rp(harga)}</td>
                      <td>{usd(harga)}</td>
                      <td>{s.min}</td>
                      <td>{s.maks}</td>
                      <td><Badge text={s.aktif ? 'Aktif' : 'Nonaktif'} /></td>
                      <td><button type="button" className="ghost" onClick={() => toggleService(s.id)}>{s.aktif ? 'Nonaktifkan' : 'Aktifkan'}</button></td>
                    </tr>
                  );
                })}
                {svcRows.length === 0 && <tr><td colSpan={12} className="muted">{svcInProvider.length === 0 ? "Belum ada layanan dari " + (PROVIDER_LABEL[svcProvider] || svcProvider) + ". Buka Pengaturan → Provider lalu klik Ambil daftar layanan." : "Tidak ada layanan yang cocok."}</td></tr>}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <span className="muted" style={{ fontSize: '12px' }}>Halaman {svcPageSafe} dari {svcPages}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="ghost" disabled={svcPageSafe <= 1} onClick={() => setSvcPage(svcPageSafe - 1)}>Sebelumnya</button>
              <button type="button" className="ghost" disabled={svcPageSafe >= svcPages} onClick={() => setSvcPage(svcPageSafe + 1)}>Berikutnya</button>
            </div>
          </div>
        </>
  );
}

export default AdminLayanan;
