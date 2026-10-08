import React from 'react';
import { LABEL_AKSI_LOG, WARNA_AKSI_LOG } from './admin-kit';

function AdminLogAktivitas({ v }) {
  const {
    theme, setTheme, themeMode, setThemeMode, accent, setAccent, tab, setTab, navOpen, setNavOpen, bukaTab, q, setQ, pengguna, setPengguna, saldoProv, setSaldoProv, muatPengguna, orderFilter, setOrderFilter, deposits, setDeposits, muatDeposit, services, setServices, tickets, setTickets, muatTiket, selTicket, setSelTicket, reply, setReply, refunds, setRefunds, muatRefund, ringkasAfiliasi, setRingkasAfiliasi, muatAfiliasiAdmin, ranks, setRanks, muatPeringkat, simpanPeringkat, artikelList, setArtikelList, artikelSel, setArtikelSel, kosongArtikel, artikelForm, setArtikelForm, artikelBusy, setArtikelBusy, artikelPratinjau, setArtikelPratinjau, muatArtikel, pilihArtikel, artikelBaru, pilihGambar, kirimArtikel, simpanArtikel, hapusArtikel, kurs, setKurs, saldoAsliUsd, saldoIdr, saldoTxt, provMenipis, massMarkup, setMassMarkup, selSvc, setSelSvc, svcQ, setSvcQ, svcCat, setSvcCat, svcPage, setSvcPage, kursDirty, setKursDirty, svcDirty, setSvcDirty, svcSaving, setSvcSaving, syncedAt, setSyncedAt, liveOrders, setLiveOrders, ordersBusy, setOrdersBusy, ordersMsg, setOrdersMsg, konfirm, setKonfirm, tanyaKonfirmasi, refundPesanan, updLog, setUpdLog, hapusRiwayatAdmin, muatRiwayat, updF, setUpdF, depF, setDepF, siap, setSiap, undian, setUndian, muatUndian, undiUndian, toast, setToast, tampilkanToast, supportProfil, setSupportProfil, simpanSupport, rec, setRec, recPickOpen, setRecPickOpen, recPickQ, setRecPickQ, recPickFiltered, recPickLebihBanyak, recSelected, pilihRecSvc, tipePickOpen, setTipePickOpen, pilihTipe, settingsTab, setSettingsTab, pwOld, setPwOld, pwNew, setPwNew, pwNew2, setPwNew2, pwMsg, setPwMsg, twofa, setTwofa, notif, setNotif, range, setRange, cFrom, setCFrom, cTo, setCTo, showTable, setShowTable, statistik, setStatistik, isDark, colors, series, accentVars, A, users, orders, pendingDeposits, openTickets, pendingRefunds, badges, totalPending, ticket, trend, trendTotals, prevDays, prevTotals, prevFrom, prevTo, compareLine, setDepositStatus, toggleService, setRefundStatus, setRankMin, provBusy, setProvBusy, provMsg, setProvMsg, callProvider, cekProvider, importServices, usd, SVC_PER_PAGE, svcCats, svcIndex, svcFiltered, svcPages, svcPageSafe, svcRows, selectedIds, selCount, allSelected, toggleAll, toggleSel, tandai, dirtyCount, adaPerubahan, labelSimpan, simpanLayanan, applyMarkup, resetMarkup, setServiceMarkup, updMsg, updDays, addUpdate, logAktivitas, muatLogAktivitas, selUpd, setSelUpd, selUpdCount, allUpdSelected, toggleAllUpd, toggleSelUpd, hapusRiwayatMassal, segarkanPesanan, updatePwd, kirimTiket, sendReply, closeTicket, themeOpts, accentOpts, hariIni, bulanIni, pesananHariIni, pendapatanBulanIni, stats, navBtn
  } = v;

  const waktuWib = (iso) => {
    const t = new Date(iso).getTime();
    if (Number.isNaN(t)) return '-';
    return new Date(t + 7 * 3600 * 1000).toISOString().slice(0, 16).replace('T', ' ') + ' WIB';
  };

  return tab === 'Log Aktivitas' && (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
        <div className="muted" style={{ fontSize: '12px' }}>Jejak tindakan penting admin — setuju/tolak refund &amp; deposit, ubah markup/kurs, sinkron katalog, dan lainnya. Menampilkan 300 terbaru.</div>
        <button type="button" className="ghost" onClick={muatLogAktivitas}>Segarkan</button>
      </div>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="tbl">
          <thead><tr><th>Waktu</th><th>Aksi</th><th>Detail</th></tr></thead>
          <tbody>
            {logAktivitas.map((l) => {
              const warna = WARNA_AKSI_LOG[l.aksi] || { bg: 'var(--s4)', fg: 'var(--t2)' };
              return (
                <tr key={l.id}>
                  <td className="muted" style={{ whiteSpace: 'nowrap' }}>{waktuWib(l.dibuat)}</td>
                  <td>
                    <span className="pill" style={{ background: warna.bg, color: warna.fg }}>{LABEL_AKSI_LOG[l.aksi] || l.aksi}</span>
                  </td>
                  <td style={{ whiteSpace: 'normal', minWidth: '220px' }}>{l.detail}</td>
                </tr>
              );
            })}
            {logAktivitas.length === 0 && <tr><td colSpan={3} className="muted">Belum ada aktivitas tercatat.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminLogAktivitas;
