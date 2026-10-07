import React from 'react';
import { rp, Badge } from './admin-kit';

function AdminDeposit({ v }) {
  const {
    theme, setTheme, themeMode, setThemeMode, accent, setAccent, tab, setTab, navOpen, setNavOpen, bukaTab, q, setQ, pengguna, setPengguna, saldoProv, setSaldoProv, muatPengguna, orderFilter, setOrderFilter, deposits, setDeposits, muatDeposit, services, setServices, tickets, setTickets, muatTiket, selTicket, setSelTicket, reply, setReply, refunds, setRefunds, muatRefund, ringkasAfiliasi, setRingkasAfiliasi, muatAfiliasiAdmin, ranks, setRanks, muatPeringkat, simpanPeringkat, artikelList, setArtikelList, artikelSel, setArtikelSel, kosongArtikel, artikelForm, setArtikelForm, artikelBusy, setArtikelBusy, artikelPratinjau, setArtikelPratinjau, muatArtikel, pilihArtikel, artikelBaru, pilihGambar, kirimArtikel, simpanArtikel, hapusArtikel, kurs, setKurs, saldoAsliUsd, saldoIdr, saldoTxt, provMenipis, massMarkup, setMassMarkup, selSvc, setSelSvc, svcQ, setSvcQ, svcCat, setSvcCat, svcPage, setSvcPage, kursDirty, setKursDirty, svcDirty, setSvcDirty, svcSaving, setSvcSaving, syncedAt, setSyncedAt, liveOrders, setLiveOrders, ordersBusy, setOrdersBusy, ordersMsg, setOrdersMsg, konfirm, setKonfirm, tanyaKonfirmasi, refundPesanan, updLog, setUpdLog, hapusRiwayatAdmin, muatRiwayat, updF, setUpdF, depF, setDepF, siap, setSiap, undian, setUndian, muatUndian, undiUndian, toast, setToast, tampilkanToast, supportProfil, setSupportProfil, simpanSupport, rec, setRec, settingsTab, setSettingsTab, pwOld, setPwOld, pwNew, setPwNew, pwNew2, setPwNew2, pwMsg, setPwMsg, twofa, setTwofa, notif, setNotif, range, setRange, cFrom, setCFrom, cTo, setCTo, showTable, setShowTable, statistik, setStatistik, isDark, colors, series, accentVars, A, users, orders, pendingDeposits, openTickets, pendingRefunds, badges, totalPending, ticket, trend, trendTotals, prevDays, prevTotals, prevFrom, prevTo, compareLine, setDepositStatus, toggleService, setRefundStatus, setRankMin, provBusy, setProvBusy, provMsg, setProvMsg, callProvider, cekProvider, importServices, usd, SVC_PER_PAGE, svcCats, svcIndex, svcFiltered, svcPages, svcPageSafe, svcRows, selectedIds, selCount, allSelected, toggleAll, toggleSel, tandai, dirtyCount, adaPerubahan, labelSimpan, simpanLayanan, applyMarkup, resetMarkup, setServiceMarkup, updMsg, updDays, addUpdate, segarkanPesanan, updatePwd, kirimTiket, sendReply, closeTicket, themeOpts, accentOpts, hariIni, bulanIni, pesananHariIni, pendapatanBulanIni, stats, navBtn
  } = v;
  return tab === 'Deposit' && (
        <>
        <div role="group" aria-label="Filter status deposit" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['Semua', 'Menunggu', 'Berhasil', 'Ditolak'].map((f) => (
            <button key={f} type="button" className={'chip' + (depF === f ? ' on' : '')} aria-pressed={depF === f} onClick={() => setDepF(f)} style={{ margin: 0 }}>{f}</button>
          ))}
        </div>
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead><tr><th>ID</th><th>User</th><th>Metode</th><th>Nominal</th><th>Waktu</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {deposits.filter((d) => depF === 'Semua' || d.status === depF).map((d) => (
                <tr key={d.id}>
                  <td className="muted">{d.id}</td>
                  <td>{d.user}</td>
                  <td>{d.metode}</td>
                  <td>{rp(d.nominal)}</td>
                  <td className="muted">{d.waktu}</td>
                  <td><Badge text={d.status} /></td>
                  <td>
                    {d.status === 'Menunggu' ? (
                      <>
                        {d.metode === 'Paymenku' ? (
                          <span className="muted" style={{ fontSize: '12px' }}>Menunggu pembayaran</span>
                        ) : (
                          <button type="button" className="ghost ok" onClick={() => setDepositStatus(d.id, 'Berhasil')}>Setujui</button>
                        )}{' '}
                        <button type="button" className="ghost no" onClick={() => setDepositStatus(d.id, 'Ditolak')}>Tolak</button>
                      </>
                    ) : <span className="muted">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
  );
}

export default AdminDeposit;
