import React from 'react';
import { Badge } from './admin-kit';

function AdminTiket({ v }) {
  const {
    theme, setTheme, themeMode, setThemeMode, accent, setAccent, tab, setTab, navOpen, setNavOpen, bukaTab, q, setQ, pengguna, setPengguna, saldoProv, setSaldoProv, muatPengguna, orderFilter, setOrderFilter, deposits, setDeposits, muatDeposit, services, setServices, tickets, setTickets, muatTiket, selTicket, setSelTicket, reply, setReply, refunds, setRefunds, muatRefund, ringkasAfiliasi, setRingkasAfiliasi, muatAfiliasiAdmin, ranks, setRanks, muatPeringkat, simpanPeringkat, artikelList, setArtikelList, artikelSel, setArtikelSel, kosongArtikel, artikelForm, setArtikelForm, artikelBusy, setArtikelBusy, artikelPratinjau, setArtikelPratinjau, muatArtikel, pilihArtikel, artikelBaru, pilihGambar, kirimArtikel, simpanArtikel, hapusArtikel, kurs, setKurs, saldoAsliUsd, saldoIdr, saldoTxt, provMenipis, massMarkup, setMassMarkup, selSvc, setSelSvc, svcQ, setSvcQ, svcCat, setSvcCat, svcPage, setSvcPage, kursDirty, setKursDirty, svcDirty, setSvcDirty, svcSaving, setSvcSaving, syncedAt, setSyncedAt, liveOrders, setLiveOrders, ordersBusy, setOrdersBusy, ordersMsg, setOrdersMsg, konfirm, setKonfirm, tanyaKonfirmasi, refundPesanan, updLog, setUpdLog, hapusRiwayatAdmin, muatRiwayat, updF, setUpdF, depF, setDepF, siap, setSiap, undian, setUndian, muatUndian, undiUndian, toast, setToast, tampilkanToast, supportProfil, setSupportProfil, simpanSupport, rec, setRec, settingsTab, setSettingsTab, pwOld, setPwOld, pwNew, setPwNew, pwNew2, setPwNew2, pwMsg, setPwMsg, twofa, setTwofa, notif, setNotif, range, setRange, cFrom, setCFrom, cTo, setCTo, showTable, setShowTable, statistik, setStatistik, isDark, colors, series, accentVars, A, users, orders, pendingDeposits, openTickets, pendingRefunds, badges, totalPending, ticket, trend, trendTotals, prevDays, prevTotals, prevFrom, prevTo, compareLine, setDepositStatus, toggleService, setRefundStatus, setRankMin, provBusy, setProvBusy, provMsg, setProvMsg, callProvider, cekProvider, importServices, usd, SVC_PER_PAGE, svcCats, svcIndex, svcFiltered, svcPages, svcPageSafe, svcRows, selectedIds, selCount, allSelected, toggleAll, toggleSel, tandai, dirtyCount, adaPerubahan, labelSimpan, simpanLayanan, applyMarkup, resetMarkup, setServiceMarkup, updMsg, updDays, addUpdate, segarkanPesanan, updatePwd, kirimTiket, sendReply, closeTicket, themeOpts, accentOpts, hariIni, bulanIni, pesananHariIni, pendapatanBulanIni, stats, navBtn
  } = v;
  return tab === 'Tiket' && (
        <>
          <div className="card" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Profil tim support</span>
            <input className="inp" value={supportProfil.nama} onChange={(e) => setSupportProfil((p) => ({ ...p, nama: e.target.value }))} placeholder="Nama" aria-label="Nama tim support" style={{ maxWidth: '240px', margin: 0 }} />
            <input className="inp" value={supportProfil.inisial} onChange={(e) => setSupportProfil((p) => ({ ...p, inisial: e.target.value }))} placeholder="Inisial" aria-label="Inisial avatar" style={{ maxWidth: '90px', margin: 0 }} />
            <button type="button" className="submit" onClick={simpanSupport}>Simpan profil</button>
          </div>
          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="tbl">
              <thead><tr><th>ID</th><th>User</th><th>Kategori</th><th>Pesanan</th><th>Terakhir</th><th>Status</th></tr></thead>
              <tbody>
                {[...tickets].sort((x, y) => (y.tingkat || 0) - (x.tingkat || 0)).map((t) => (
                  <tr key={t.id} className="click" onClick={() => { setSelTicket(t.id); setReply(''); }} style={{ background: selTicket === t.id ? 'var(--s3)' : undefined }}>
                    <td className="muted">#{t.id}</td>
                    <td>{t.user}</td>
                    <td>{t.kategori}</td>
                    <td className="muted">{t.orderId || '—'}</td>
                    <td className="muted">{t.update}</td>
                    <td><Badge text={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ticket ? (
            <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>Tiket #{ticket.id} · {ticket.user}</div>
                <button type="button" className="ghost" onClick={closeTicket} disabled={ticket.status === 'Ditutup'}>Tutup tiket</button>
              </div>
              {ticket.msgs.map((m, i) => {
                const admin = m.from === 'admin';
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: admin ? 'flex-end' : 'flex-start', gap: '4px' }}>
                    <div className="bubble" style={{ background: admin ? 'var(--r3)' : 'var(--s3)', border: '1px solid ' + (admin ? 'var(--r5)' : 'var(--b3)'), color: 'var(--t1)' }}>{m.text}{m.lampiran ? (m.lampiran.tipe === 'application/pdf' ? <a href={m.lampiran.data} download={m.lampiran.nama} style={{ display: 'block', marginTop: '8px', color: 'var(--accent-l)', fontWeight: 600 }}>📄 {m.lampiran.nama}</a> : <img src={m.lampiran.data} alt={m.lampiran.nama} style={{ display: 'block', marginTop: '8px', maxWidth: '100%', borderRadius: '10px' }} />) : null}</div>
                    <div style={{ fontSize: '10px', color: 'var(--t5)' }}>{admin ? supportProfil.nama : ticket.user} · {m.time}</div>
                  </div>
                );
              })}
              {ticket.status !== 'Ditutup' ? (
                <>
                  <textarea className="ta" placeholder="Tulis balasan..." value={reply} onChange={(e) => setReply(e.target.value)} />
                  <div><button type="button" className="submit" onClick={sendReply} disabled={!reply.trim()}>Kirim balasan</button></div>
                </>
              ) : <div className="muted" style={{ fontSize: '12px' }}>Tiket ini sudah ditutup.</div>}
            </div>
          ) : (
            <div className="muted" style={{ fontSize: '12px' }}>Pilih tiket di atas untuk melihat dan membalas.</div>
          )}
        </>
  );
}

export default AdminTiket;
