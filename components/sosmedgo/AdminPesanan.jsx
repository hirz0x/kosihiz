import React from 'react';
import { OrdersTable } from './admin-kit';

function AdminPesanan({ v }) {
  const {
    theme, setTheme, themeMode, setThemeMode, accent, setAccent, tab, setTab, navOpen, setNavOpen, bukaTab, q, setQ, pengguna, setPengguna, saldoProv, setSaldoProv, muatPengguna, orderFilter, setOrderFilter, orderQ, setOrderQ, deposits, setDeposits, muatDeposit, services, setServices, tickets, setTickets, muatTiket, selTicket, setSelTicket, reply, setReply, refunds, setRefunds, muatRefund, ringkasAfiliasi, setRingkasAfiliasi, muatAfiliasiAdmin, ranks, setRanks, muatPeringkat, simpanPeringkat, artikelList, setArtikelList, artikelSel, setArtikelSel, kosongArtikel, artikelForm, setArtikelForm, artikelBusy, setArtikelBusy, artikelPratinjau, setArtikelPratinjau, muatArtikel, pilihArtikel, artikelBaru, pilihGambar, kirimArtikel, simpanArtikel, hapusArtikel, kurs, setKurs, saldoAsliUsd, saldoIdr, saldoTxt, provMenipis, massMarkup, setMassMarkup, selSvc, setSelSvc, svcQ, setSvcQ, svcCat, setSvcCat, svcPage, setSvcPage, kursDirty, setKursDirty, svcDirty, setSvcDirty, svcSaving, setSvcSaving, syncedAt, setSyncedAt, liveOrders, setLiveOrders, ordersBusy, setOrdersBusy, ordersMsg, setOrdersMsg, konfirm, setKonfirm, tanyaKonfirmasi, refundPesanan, updLog, setUpdLog, hapusRiwayatAdmin, muatRiwayat, updF, setUpdF, depF, setDepF, siap, setSiap, undian, setUndian, muatUndian, undiUndian, toast, setToast, tampilkanToast, supportProfil, setSupportProfil, simpanSupport, rec, setRec, settingsTab, setSettingsTab, pwOld, setPwOld, pwNew, setPwNew, pwNew2, setPwNew2, pwMsg, setPwMsg, twofa, setTwofa, notif, setNotif, range, setRange, cFrom, setCFrom, cTo, setCTo, showTable, setShowTable, statistik, setStatistik, isDark, colors, series, accentVars, A, users, orders, ordersPage, setOrdersPage, ordersPages, ordersPageSafe, ordersRows, pendingDeposits, openTickets, pendingRefunds, badges, totalPending, ticket, trend, trendTotals, prevDays, prevTotals, prevFrom, prevTo, compareLine, setDepositStatus, toggleService, setRefundStatus, setRankMin, provBusy, setProvBusy, provMsg, setProvMsg, callProvider, cekProvider, importServices, usd, SVC_PER_PAGE, svcCats, svcIndex, svcFiltered, svcPages, svcPageSafe, svcRows, selectedIds, selCount, allSelected, toggleAll, toggleSel, tandai, dirtyCount, adaPerubahan, labelSimpan, simpanLayanan, applyMarkup, resetMarkup, setServiceMarkup, updMsg, updDays, addUpdate, segarkanPesanan, updatePwd, kirimTiket, sendReply, closeTicket, themeOpts, accentOpts, hariIni, bulanIni, pesananHariIni, pendapatanBulanIni, stats, navBtn, ordersMuatGagal, muatOrdersAwal
  } = v;
  return tab === 'Pesanan' && (
        <>
          {ordersMuatGagal ? (
            <div className="card" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', border: '1px solid var(--r4)', background: 'var(--r1)' }}>
              <span style={{ fontSize: '13px', color: 'var(--rt)' }}>Gagal memuat daftar pesanan dari server (bukan berarti belum ada pesanan). Coba lagi?</span>
              <button type="button" className="ghost" onClick={muatOrdersAwal}>Coba Lagi</button>
            </div>
          ) : null}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <div>
              {['Semua', 'Pending', 'In progress', 'Completed', 'Partial', 'Canceled'].map((f) => (
                <button key={f} type="button" className={'chip' + (orderFilter === f ? ' on' : '')} onClick={() => setOrderFilter(f)}>{f}</button>
              ))}
            </div>
            <input className="inp" placeholder="Cari ID pesanan, ID provider, user, atau link" value={orderQ} onChange={(e) => setOrderQ(e.target.value)} style={{ maxWidth: '320px', margin: 0 }} aria-label="Cari pesanan" />
            <button type="button" className="ghost" onClick={segarkanPesanan} disabled={ordersBusy} style={{ marginLeft: 'auto', marginBottom: '14px' }}>
              {ordersBusy ? 'Menyegarkan...' : 'Segarkan status'}
            </button>
          </div>
          {ordersMsg ? (
            <div style={{ fontSize: '12px', marginTop: '-8px', color: ordersMsg.ok ? '#22C55E' : '#FF5A75' }}>{ordersMsg.text}</div>
          ) : null}
          <div className="card" style={{ overflowX: 'auto' }}>
            <OrdersTable rows={ordersRows} onRefund={refundPesanan} refundedIds={new Set((refunds || []).filter((r) => r.status !== 'Ditolak').map((r) => r.pesanan))} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <span className="muted" style={{ fontSize: '12px' }}>Halaman {ordersPageSafe} dari {ordersPages} ({orders.length} pesanan)</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="ghost" disabled={ordersPageSafe <= 1} onClick={() => setOrdersPage(ordersPageSafe - 1)}>Sebelumnya</button>
              <button type="button" className="ghost" disabled={ordersPageSafe >= ordersPages} onClick={() => setOrdersPage(ordersPageSafe + 1)}>Berikutnya</button>
            </div>
          </div>
        </>
  );
}

export default AdminPesanan;
