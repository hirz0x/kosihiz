import React from 'react';
import { SOCIAL_FA, UPS } from './admin-kit';

function AdminUpdate({ v }) {
  const {
    theme, setTheme, themeMode, setThemeMode, accent, setAccent, tab, setTab, navOpen, setNavOpen, bukaTab, q, setQ, pengguna, setPengguna, saldoProv, setSaldoProv, muatPengguna, orderFilter, setOrderFilter, deposits, setDeposits, muatDeposit, services, setServices, tickets, setTickets, muatTiket, selTicket, setSelTicket, reply, setReply, refunds, setRefunds, muatRefund, ringkasAfiliasi, setRingkasAfiliasi, muatAfiliasiAdmin, ranks, setRanks, muatPeringkat, simpanPeringkat, artikelList, setArtikelList, artikelSel, setArtikelSel, kosongArtikel, artikelForm, setArtikelForm, artikelBusy, setArtikelBusy, artikelPratinjau, setArtikelPratinjau, muatArtikel, pilihArtikel, artikelBaru, pilihGambar, kirimArtikel, simpanArtikel, hapusArtikel, kurs, setKurs, saldoAsliUsd, saldoIdr, saldoTxt, provMenipis, massMarkup, setMassMarkup, selSvc, setSelSvc, svcQ, setSvcQ, svcCat, setSvcCat, svcPage, setSvcPage, kursDirty, setKursDirty, svcDirty, setSvcDirty, svcSaving, setSvcSaving, syncedAt, setSyncedAt, liveOrders, setLiveOrders, ordersBusy, setOrdersBusy, ordersMsg, setOrdersMsg, konfirm, setKonfirm, tanyaKonfirmasi, refundPesanan, updLog, setUpdLog, hapusRiwayatAdmin, muatRiwayat, updF, setUpdF, depF, setDepF, siap, setSiap, undian, setUndian, muatUndian, undiUndian, toast, setToast, tampilkanToast, supportProfil, setSupportProfil, simpanSupport, rec, setRec, recPickOpen, setRecPickOpen, recPickQ, setRecPickQ, recPickFiltered, recPickLebihBanyak, recSelected, pilihRecSvc, tipePickOpen, setTipePickOpen, pilihTipe, settingsTab, setSettingsTab, pwOld, setPwOld, pwNew, setPwNew, pwNew2, setPwNew2, pwMsg, setPwMsg, twofa, setTwofa, notif, setNotif, range, setRange, cFrom, setCFrom, cTo, setCTo, showTable, setShowTable, statistik, setStatistik, isDark, colors, series, accentVars, A, users, orders, pendingDeposits, openTickets, pendingRefunds, badges, totalPending, ticket, trend, trendTotals, prevDays, prevTotals, prevFrom, prevTo, compareLine, setDepositStatus, toggleService, setRefundStatus, setRankMin, provBusy, setProvBusy, provMsg, setProvMsg, callProvider, cekProvider, importServices, usd, SVC_PER_PAGE, svcCats, svcIndex, svcFiltered, svcPages, svcPageSafe, svcRows, selectedIds, selCount, allSelected, toggleAll, toggleSel, tandai, dirtyCount, adaPerubahan, labelSimpan, simpanLayanan, applyMarkup, resetMarkup, setServiceMarkup, updMsg, updDays, addUpdate, selUpd, setSelUpd, selUpdCount, allUpdSelected, toggleAllUpd, toggleSelUpd, hapusRiwayatMassal, segarkanPesanan, updatePwd, kirimTiket, sendReply, closeTicket, themeOpts, accentOpts, hariIni, bulanIni, pesananHariIni, pendapatanBulanIni, stats, navBtn
  } = v;
  return tab === 'Update' && (
        <>
          <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700' }}>Catat perubahan layanan</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
                <button type="button" className="dd" aria-haspopup="listbox" aria-expanded={recPickOpen} onClick={() => setRecPickOpen((o) => !o)} disabled={services.length === 0}>
                  <span style={{ flex: '1', minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {services.length === 0 ? 'Belum ada layanan. Tarik dulu di Pengaturan.' : (recSelected ? recSelected.id + ' · ' + recSelected.nama : 'Pilih layanan')}
                  </span>
                  <i className="fa-solid fa-chevron-down" aria-hidden="true" style={{ fontSize: '11px', color: 'var(--t4)' }} />
                </button>
                {recPickOpen ? (
                  <div className="ddpanel" role="listbox" aria-label="Cari layanan">
                    <input
                      type="text"
                      className="inp"
                      placeholder="Cari ID atau nama layanan..."
                      value={recPickQ}
                      onChange={(e) => setRecPickQ(e.target.value)}
                      autoFocus
                      style={{ margin: '0 0 6px', height: '38px' }}
                    />
                    <div style={{ maxHeight: '220px', overflow: 'auto' }}>
                      {recPickFiltered.length === 0 ? (
                        <div className="muted" style={{ padding: '10px', fontSize: '12px' }}>Tidak ada layanan yang cocok.</div>
                      ) : recPickFiltered.map((s) => (
                        <button key={s.id} type="button" role="option" aria-selected={String(s.id) === String(rec.id)} className="ddopt" onClick={() => pilihRecSvc(s.id)}>
                          <span className="idpill" style={{ flex: 'none' }}>{s.id}</span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.nama}</span>
                        </button>
                      ))}
                    </div>
                    {recPickLebihBanyak ? (
                      <div className="muted" style={{ padding: '8px 10px 2px', fontSize: '11px' }}>
                        Menampilkan {recPickFiltered.length} teratas — {recPickQ.trim() === '' ? 'ketik ID atau nama untuk mencari layanan lain.' : 'persempit kata kunci untuk hasil yang lebih spesifik.'}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div style={{ position: 'relative', width: '100%', maxWidth: '220px' }}>
                <button type="button" className="dd" aria-haspopup="listbox" aria-expanded={tipePickOpen} onClick={() => setTipePickOpen((o) => !o)}>
                  <span style={{ flex: '1', minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{UPS[rec.tipe].label}</span>
                  <i className="fa-solid fa-chevron-down" aria-hidden="true" style={{ fontSize: '11px', color: 'var(--t4)' }} />
                </button>
                {tipePickOpen ? (
                  <div className="ddpanel" role="listbox" aria-label="Jenis perubahan">
                    {Object.keys(UPS).map((k) => (
                      <button key={k} type="button" role="option" aria-selected={rec.tipe === k} className="ddopt" onClick={() => pilihTipe(k)}>{UPS[k].label}</button>
                    ))}
                  </div>
                ) : null}
              </div>
              {rec.tipe === 'up' || rec.tipe === 'down' ? (
                <>
                  <input className="inp" placeholder="Harga lama (cth: Rp 580)" value={rec.lama} onChange={(e) => setRec((r) => ({ ...r, lama: e.target.value }))} style={{ maxWidth: '200px', margin: 0 }} aria-label="Harga lama" />
                  <input className="inp" placeholder="Harga baru (cth: Rp 600)" value={rec.baru} onChange={(e) => setRec((r) => ({ ...r, baru: e.target.value }))} style={{ maxWidth: '200px', margin: 0 }} aria-label="Harga baru" />
                </>
              ) : null}
              <button type="button" className="submit" onClick={addUpdate} disabled={(rec.tipe === 'up' || rec.tipe === 'down') && (!rec.lama.trim() || !rec.baru.trim())}>Catat</button>
            </div>
          </div>

          <div role="group" aria-label="Filter update" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {[['all', 'Semua'], ['up', 'Harga naik'], ['down', 'Harga turun'], ['off', 'Dinonaktifkan'], ['new', 'Layanan baru']].map((f) => (
              <button key={f[0]} type="button" className={'chip' + (updF === f[0] ? ' on' : '')} aria-pressed={updF === f[0]} onClick={() => setUpdF(f[0])} style={{ margin: 0 }}>{f[1]}</button>
            ))}
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--t3)', marginLeft: '4px', cursor: 'pointer' }}>
              <input type="checkbox" checked={allUpdSelected} onChange={toggleAllUpd} style={{ width: '16px', height: '16px', margin: 0 }} />
              Pilih semua
            </label>
            {selUpdCount > 0 ? (
              <button type="button" className="ghost no" onClick={hapusRiwayatMassal} style={{ marginLeft: 'auto' }}>
                Hapus terpilih ({selUpdCount})
              </button>
            ) : null}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {updDays.map((d) => (
              <div key={d.date} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700' }}>
                  <span className="ddic" style={{ width: '24px', height: '24px', background: 'rgba(var(--accent-rgb),.12)', border: '1px solid rgba(var(--accent-rgb),.3)', color: 'var(--accent-l)', fontSize: '10px' }}>▦</span>
                  {d.date}
                </div>
                {d.items.map((u, i) => (
                  <div key={i} className="card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px' }}>
                    <input type="checkbox" aria-label={'Pilih riwayat ' + u.id} checked={!!selUpd[u.rid]} onChange={() => toggleSelUpd(u.rid)} style={{ width: '16px', height: '16px', margin: 0, flex: 'none' }} />
                    <span className="ddic" style={{ width: '30px', height: '30px', background: 'rgba(var(--accent-rgb),.12)', border: '1px solid rgba(var(--accent-rgb),.3)', color: 'var(--accent-l)' }}>
                      <i className={(SOCIAL_FA[u.icon] || 'fa-solid fa-layer-group')} aria-hidden="true" style={{ color: 'var(--accent-l)', fontSize: '14px' }} />
                    </span>
                    <span className="idpill">{u.id}</span>
                    <span style={{ flex: '1', minWidth: '220px', fontSize: '13px', fontWeight: '600' }}>{u.name}</span>
                    <span className="pill" style={{ background: u.bg, color: u.fg }}>{u.msg}</span>
                    {u.rid ? (<button type="button" className="ghost no" onClick={function () { hapusRiwayatAdmin(u.rid); }} style={{ padding: '4px 10px', fontSize: '11px' }}>Hapus</button>) : null}
                  </div>
                ))}
              </div>
            ))}
            {updDays.length === 0 ? (
              <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--t5)', fontSize: '13px' }}>Tidak ada update.</div>
            ) : null}
          </div>

        </>
  );
}

export default AdminUpdate;
