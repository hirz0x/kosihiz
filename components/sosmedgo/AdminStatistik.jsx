import React from 'react';
import { ICON, rp, RANGE_OPTS, StatCard, TrendChart, TrendTable } from './admin-kit';

function AdminStatistik({ v }) {
  const {
    theme, setTheme, themeMode, setThemeMode, accent, setAccent, tab, setTab, navOpen, setNavOpen, bukaTab, q, setQ, pengguna, setPengguna, saldoProv, setSaldoProv, muatPengguna, orderFilter, setOrderFilter, deposits, setDeposits, muatDeposit, services, setServices, tickets, setTickets, muatTiket, selTicket, setSelTicket, reply, setReply, refunds, setRefunds, muatRefund, ringkasAfiliasi, setRingkasAfiliasi, muatAfiliasiAdmin, ranks, setRanks, muatPeringkat, simpanPeringkat, artikelList, setArtikelList, artikelSel, setArtikelSel, kosongArtikel, artikelForm, setArtikelForm, artikelBusy, setArtikelBusy, artikelPratinjau, setArtikelPratinjau, muatArtikel, pilihArtikel, artikelBaru, pilihGambar, kirimArtikel, simpanArtikel, hapusArtikel, kurs, setKurs, saldoAsliUsd, saldoIdr, saldoTxt, provMenipis, massMarkup, setMassMarkup, selSvc, setSelSvc, svcQ, setSvcQ, svcCat, setSvcCat, svcPage, setSvcPage, kursDirty, setKursDirty, svcDirty, setSvcDirty, svcSaving, setSvcSaving, syncedAt, setSyncedAt, liveOrders, setLiveOrders, ordersBusy, setOrdersBusy, ordersMsg, setOrdersMsg, konfirm, setKonfirm, tanyaKonfirmasi, refundPesanan, updLog, setUpdLog, hapusRiwayatAdmin, muatRiwayat, updF, setUpdF, depF, setDepF, siap, setSiap, undian, setUndian, muatUndian, undiUndian, toast, setToast, tampilkanToast, supportProfil, setSupportProfil, simpanSupport, rec, setRec, settingsTab, setSettingsTab, pwOld, setPwOld, pwNew, setPwNew, pwNew2, setPwNew2, pwMsg, setPwMsg, twofa, setTwofa, notif, setNotif, range, setRange, cFrom, setCFrom, cTo, setCTo, showTable, setShowTable, statistik, setStatistik, isDark, colors, series, accentVars, A, users, orders, pendingDeposits, openTickets, pendingRefunds, badges, totalPending, ticket, trend, trendTotals, prevDays, prevTotals, prevFrom, prevTo, compareLine, setDepositStatus, toggleService, setRefundStatus, setRankMin, provBusy, setProvBusy, provMsg, setProvMsg, callProvider, cekProvider, importServices, usd, SVC_PER_PAGE, svcCats, svcIndex, svcFiltered, svcPages, svcPageSafe, svcRows, selectedIds, selCount, allSelected, toggleAll, toggleSel, tandai, dirtyCount, adaPerubahan, labelSimpan, simpanLayanan, applyMarkup, resetMarkup, setServiceMarkup, updMsg, updDays, addUpdate, segarkanPesanan, updatePwd, kirimTiket, sendReply, closeTicket, themeOpts, accentOpts, hariIni, bulanIni, pesananHariIni, pendapatanBulanIni, stats, navBtn
  } = v;
  return tab === 'Statistik' && (
        <>
          <div className="muted" style={{ fontSize: '12px' }}>
            Saldo komisi belum diklaim (semua pengguna) saat ini: <strong style={{ color: 'var(--hi)' }}>{rp(statistik.komisiTersedia)}</strong>
          </div>
          <div>
            {RANGE_OPTS.map((r) => (
              <button key={r} type="button" className={'chip' + (range === r ? ' on' : '')} aria-pressed={range === r} onClick={() => setRange(r)}>{r}</button>
            ))}
          </div>
          {range === 'Custom' ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginTop: '-6px' }}>
              <input className="inp" type="date" style={{ maxWidth: '180px', margin: 0 }} value={cFrom} onChange={(e) => setCFrom(e.target.value)} aria-label="Dari tanggal" />
              <span className="muted" style={{ fontSize: '12px' }}>sampai</span>
              <input className="inp" type="date" style={{ maxWidth: '180px', margin: 0 }} value={cTo} onChange={(e) => setCTo(e.target.value)} aria-label="Sampai tanggal" />
            </div>
          ) : null}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '14px' }}>
            <StatCard s={{ c: colors.deposit, tint: 'rgba(59,130,246,.12)', line: 'rgba(59,130,246,.3)', l: 'Total Deposit', v: rp(trendTotals.deposit), icon: ICON.wallet, ...compareLine(trendTotals.deposit, prevTotals.deposit) }} />
            <StatCard s={{ c: colors.revenue, tint: 'rgba(245,165,36,.12)', line: 'rgba(245,165,36,.3)', l: 'Total Revenue', v: rp(trendTotals.revenue), icon: ICON.money, ...compareLine(trendTotals.revenue, prevTotals.revenue) }} />
            <StatCard s={{ c: colors.order, tint: 'rgba(52,211,119,.12)', line: 'rgba(52,211,119,.3)', l: 'Total Pesanan', v: trendTotals.order + ' pesanan', icon: ICON.cart, ...compareLine(trendTotals.order, prevTotals.order) }} />
            <StatCard s={{ c: colors.komisi, tint: 'rgba(167,139,250,.12)', line: 'rgba(167,139,250,.3)', l: 'Total Komisi', v: rp(trendTotals.komisi), icon: ICON.affiliate, ...compareLine(trendTotals.komisi, prevTotals.komisi) }} />
          </div>

          <div className="card" style={{ padding: '16px 16px 10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px 16px', marginBottom: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600' }}>Tren deposit, revenue, pesanan &amp; komisi</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '12px', color: 'var(--t3)' }}>
                {series.map((s) => (
                  <span key={s.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }} />
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
            {trend.length === 0 ? (
              <div className="muted" style={{ fontSize: '12px', padding: '20px 0' }}>Pilih tanggal mulai dan selesai dulu.</div>
            ) : showTable ? (
              <TrendTable rows={trend} />
            ) : (
              <TrendChart data={trend} series={series} />
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="ghost" onClick={() => setShowTable((s) => !s)}>{showTable ? 'Tampilkan grafik' : 'Tampilkan tabel'}</button>
          </div>
        </>
  );
}

export default AdminStatistik;
