import React from 'react';
import { PROVIDER_LOW, rp, StatCard, OrdersTable } from './admin-kit';

function AdminRingkasan({ v }) {
  const {
    theme, setTheme, themeMode, setThemeMode, accent, setAccent, tab, setTab, navOpen, setNavOpen, bukaTab, q, setQ, pengguna, setPengguna, saldoProv, setSaldoProv, muatPengguna, orderFilter, setOrderFilter, deposits, setDeposits, muatDeposit, services, setServices, tickets, setTickets, muatTiket, selTicket, setSelTicket, reply, setReply, refunds, setRefunds, muatRefund, ringkasAfiliasi, setRingkasAfiliasi, muatAfiliasiAdmin, ranks, setRanks, muatPeringkat, simpanPeringkat, artikelList, setArtikelList, artikelSel, setArtikelSel, kosongArtikel, artikelForm, setArtikelForm, artikelBusy, setArtikelBusy, artikelPratinjau, setArtikelPratinjau, muatArtikel, pilihArtikel, artikelBaru, pilihGambar, kirimArtikel, simpanArtikel, hapusArtikel, kurs, setKurs, saldoAsliUsd, saldoIdr, saldoTxt, provMenipis, massMarkup, setMassMarkup, selSvc, setSelSvc, svcQ, setSvcQ, svcCat, setSvcCat, svcPage, setSvcPage, kursDirty, setKursDirty, svcDirty, setSvcDirty, svcSaving, setSvcSaving, syncedAt, setSyncedAt, liveOrders, setLiveOrders, ordersBusy, setOrdersBusy, ordersMsg, setOrdersMsg, konfirm, setKonfirm, tanyaKonfirmasi, refundPesanan, updLog, setUpdLog, hapusRiwayatAdmin, muatRiwayat, updF, setUpdF, depF, setDepF, siap, setSiap, undian, setUndian, muatUndian, undiUndian, toast, setToast, tampilkanToast, supportProfil, setSupportProfil, simpanSupport, rec, setRec, settingsTab, setSettingsTab, pwOld, setPwOld, pwNew, setPwNew, pwNew2, setPwNew2, pwMsg, setPwMsg, twofa, setTwofa, notif, setNotif, range, setRange, cFrom, setCFrom, cTo, setCTo, showTable, setShowTable, statistik, setStatistik, isDark, colors, series, accentVars, A, users, orders, pendingDeposits, openTickets, pendingRefunds, badges, totalPending, ticket, trend, trendTotals, prevDays, prevTotals, prevFrom, prevTo, compareLine, setDepositStatus, toggleService, setRefundStatus, setRankMin, provBusy, setProvBusy, provMsg, setProvMsg, callProvider, cekProvider, importServices, usd, SVC_PER_PAGE, svcCats, svcIndex, svcFiltered, svcPages, svcPageSafe, svcRows, selectedIds, selCount, allSelected, toggleAll, toggleSel, tandai, dirtyCount, adaPerubahan, labelSimpan, simpanLayanan, applyMarkup, resetMarkup, setServiceMarkup, updMsg, updDays, addUpdate, segarkanPesanan, updatePwd, kirimTiket, sendReply, closeTicket, themeOpts, accentOpts, hariIni, bulanIni, pesananHariIni, pendapatanBulanIni, stats, navBtn
  } = v;
  return tab === 'Ringkasan' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '14px' }}>
            {stats.map((s) => <StatCard key={s.l} s={s} />)}
          </div>
          <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>Saldo provider</div>
                <div className="muted" style={{ fontSize: '12px', marginTop: '4px' }}>Saldo di smmsoc.com: <strong style={{ color: 'var(--hi)' }}>{saldoTxt}</strong></div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '12px' }}>
              <div style={{ background: 'var(--s2)', border: '1px solid var(--b3)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>smmsoc.com</span>
                  {provMenipis ? <span className="pill" style={{ background: '#7F1D1D', color: '#F4F4F5' }}>Saldo menipis</span> : null}
                </div>
                {saldoProv.saldo !== null ? (
                  <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '8px', letterSpacing: '-.02em' }}>{saldoTxt}</div>
                ) : (
                  <div className="muted" style={{ fontSize: '12px', marginTop: '8px' }}>{saldoProv.error || 'Memuat saldo...'}</div>
                )}
                <div className="muted" style={{ fontSize: '11px', marginTop: '4px' }}>Semua layanan dari provider ini</div>
              </div>
            </div>
            <div className="muted" style={{ fontSize: '11px' }}>Saldo menipis jika di bawah {rp(PROVIDER_LOW)}.</div>
          </div>

          <div className="card" style={{ overflowX: 'auto' }}>
            <div style={{ padding: '16px 18px', fontSize: '14px', fontWeight: '700', borderBottom: '1px solid var(--b2)' }}>Pesanan Terbaru</div>
            <OrdersTable rows={liveOrders.slice(0, 5)} />
          </div>
        </>
  );
}

export default AdminRingkasan;
