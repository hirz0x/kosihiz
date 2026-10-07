import React from 'react';
import { rp } from './admin-kit';

function AdminPeringkat({ v }) {
  const {
    theme, setTheme, themeMode, setThemeMode, accent, setAccent, tab, setTab, navOpen, setNavOpen, bukaTab, q, setQ, pengguna, setPengguna, saldoProv, setSaldoProv, muatPengguna, orderFilter, setOrderFilter, deposits, setDeposits, muatDeposit, services, setServices, tickets, setTickets, muatTiket, selTicket, setSelTicket, reply, setReply, refunds, setRefunds, muatRefund, ringkasAfiliasi, setRingkasAfiliasi, muatAfiliasiAdmin, ranks, setRanks, muatPeringkat, simpanPeringkat, artikelList, setArtikelList, artikelSel, setArtikelSel, kosongArtikel, artikelForm, setArtikelForm, artikelBusy, setArtikelBusy, artikelPratinjau, setArtikelPratinjau, muatArtikel, pilihArtikel, artikelBaru, pilihGambar, kirimArtikel, simpanArtikel, hapusArtikel, kurs, setKurs, saldoAsliUsd, saldoIdr, saldoTxt, provMenipis, massMarkup, setMassMarkup, selSvc, setSelSvc, svcQ, setSvcQ, svcCat, setSvcCat, svcPage, setSvcPage, kursDirty, setKursDirty, svcDirty, setSvcDirty, svcSaving, setSvcSaving, syncedAt, setSyncedAt, liveOrders, setLiveOrders, ordersBusy, setOrdersBusy, ordersMsg, setOrdersMsg, konfirm, setKonfirm, tanyaKonfirmasi, refundPesanan, updLog, setUpdLog, hapusRiwayatAdmin, muatRiwayat, updF, setUpdF, depF, setDepF, siap, setSiap, undian, setUndian, muatUndian, undiUndian, toast, setToast, tampilkanToast, supportProfil, setSupportProfil, simpanSupport, rec, setRec, settingsTab, setSettingsTab, pwOld, setPwOld, pwNew, setPwNew, pwNew2, setPwNew2, pwMsg, setPwMsg, twofa, setTwofa, notif, setNotif, range, setRange, cFrom, setCFrom, cTo, setCTo, showTable, setShowTable, statistik, setStatistik, isDark, colors, series, accentVars, A, users, orders, pendingDeposits, openTickets, pendingRefunds, badges, totalPending, ticket, trend, trendTotals, prevDays, prevTotals, prevFrom, prevTo, compareLine, setDepositStatus, toggleService, setRefundStatus, setRankMin, provBusy, setProvBusy, provMsg, setProvMsg, callProvider, cekProvider, importServices, usd, SVC_PER_PAGE, svcCats, svcIndex, svcFiltered, svcPages, svcPageSafe, svcRows, selectedIds, selCount, allSelected, toggleAll, toggleSel, tandai, dirtyCount, adaPerubahan, labelSimpan, simpanLayanan, applyMarkup, resetMarkup, setServiceMarkup, updMsg, updDays, addUpdate, segarkanPesanan, updatePwd, kirimTiket, sendReply, closeTicket, themeOpts, accentOpts, hariIni, bulanIni, pesananHariIni, pendapatanBulanIni, stats, navBtn
  } = v;
  return tab === 'Peringkat' && (
        <>
          <div className="card" style={{ padding: '18px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700' }}>Undian bulanan {undian ? undian.bulan : ''}</div>
              <div className="muted" style={{ fontSize: '12px', marginTop: '4px' }}>
                {undian && undian.pemenang ? 'Pemenang: ' + undian.pemenang.username + ' (Rp ' + undian.pemenang.hadiah.toLocaleString('id-ID') + ')' : 'Peserta: ' + (undian ? undian.jumlahPeserta : 0) + ' user Insider ke atas. Hadiah Rp ' + (undian ? undian.hadiah : 500000).toLocaleString('id-ID') + '.'}
              </div>
            </div>
            <button type="button" className="submit" onClick={undiUndian} disabled={!undian || !!undian.pemenang || undian.jumlahPeserta === 0}>Undi pemenang</button>
          </div>
          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="tbl">
              <thead><tr><th>Peringkat</th><th>Minimal total belanja</th><th>Rentang</th><th>Keuntungan</th><th>Jumlah user</th></tr></thead>
              <tbody>
                {ranks.map((r, i) => {
                  const next = ranks[i + 1];
                  const range2 = next ? rp(r.min) + ' – ' + rp(next.min - 1) : rp(r.min) + ' ke atas';
                  return (
                    <tr key={r.nama}>
                      <td style={{ fontWeight: '700' }}>{r.nama}</td>
                      <td>
                        {i === 0 ? <span className="muted">Rp 0 (tetap)</span> : (
                          <input className="inp" type="number" min="0" value={r.min} onChange={(e) => setRankMin(i, e.target.value)} style={{ maxWidth: '160px', margin: 0 }} />
                        )}
                      </td>
                      <td className="muted">{range2}</td>
                      <td style={{ whiteSpace: 'normal', minWidth: '260px' }} className="muted">{r.benefit.join(' · ')}</td>
                      <td>{r.pengguna.toLocaleString('id-ID')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button type="button" className="submit" onClick={simpanPeringkat}>Simpan peringkat</button>
            <span className="muted" style={{ fontSize: '12px' }}>Ubah angka minimal belanja untuk mengatur batas tiap peringkat. Rentang di tabel akan menyesuaikan otomatis.</span>
          </div>
        </>
  );
}

export default AdminPeringkat;
