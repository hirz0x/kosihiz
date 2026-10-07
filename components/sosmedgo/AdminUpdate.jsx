import React from 'react';
import { SOCIAL_FA, UPS } from './admin-kit';

function AdminUpdate({ v }) {
  const {
    theme, setTheme, themeMode, setThemeMode, accent, setAccent, tab, setTab, navOpen, setNavOpen, bukaTab, q, setQ, pengguna, setPengguna, saldoProv, setSaldoProv, muatPengguna, orderFilter, setOrderFilter, deposits, setDeposits, muatDeposit, services, setServices, tickets, setTickets, muatTiket, selTicket, setSelTicket, reply, setReply, refunds, setRefunds, muatRefund, ringkasAfiliasi, setRingkasAfiliasi, muatAfiliasiAdmin, ranks, setRanks, muatPeringkat, simpanPeringkat, artikelList, setArtikelList, artikelSel, setArtikelSel, kosongArtikel, artikelForm, setArtikelForm, artikelBusy, setArtikelBusy, artikelPratinjau, setArtikelPratinjau, muatArtikel, pilihArtikel, artikelBaru, pilihGambar, kirimArtikel, simpanArtikel, hapusArtikel, kurs, setKurs, saldoAsliUsd, saldoIdr, saldoTxt, provMenipis, massMarkup, setMassMarkup, selSvc, setSelSvc, svcQ, setSvcQ, svcCat, setSvcCat, svcPage, setSvcPage, kursDirty, setKursDirty, svcDirty, setSvcDirty, svcSaving, setSvcSaving, syncedAt, setSyncedAt, liveOrders, setLiveOrders, ordersBusy, setOrdersBusy, ordersMsg, setOrdersMsg, konfirm, setKonfirm, tanyaKonfirmasi, refundPesanan, updLog, setUpdLog, hapusRiwayatAdmin, muatRiwayat, updF, setUpdF, depF, setDepF, siap, setSiap, undian, setUndian, muatUndian, undiUndian, toast, setToast, tampilkanToast, supportProfil, setSupportProfil, simpanSupport, rec, setRec, settingsTab, setSettingsTab, pwOld, setPwOld, pwNew, setPwNew, pwNew2, setPwNew2, pwMsg, setPwMsg, twofa, setTwofa, notif, setNotif, range, setRange, cFrom, setCFrom, cTo, setCTo, showTable, setShowTable, statistik, setStatistik, isDark, colors, series, accentVars, A, users, orders, pendingDeposits, openTickets, pendingRefunds, badges, totalPending, ticket, trend, trendTotals, prevDays, prevTotals, prevFrom, prevTo, compareLine, setDepositStatus, toggleService, setRefundStatus, setRankMin, provBusy, setProvBusy, provMsg, setProvMsg, callProvider, cekProvider, importServices, usd, SVC_PER_PAGE, svcCats, svcIndex, svcFiltered, svcPages, svcPageSafe, svcRows, selectedIds, selCount, allSelected, toggleAll, toggleSel, tandai, dirtyCount, adaPerubahan, labelSimpan, simpanLayanan, applyMarkup, resetMarkup, setServiceMarkup, updMsg, updDays, addUpdate, segarkanPesanan, updatePwd, kirimTiket, sendReply, closeTicket, themeOpts, accentOpts, hariIni, bulanIni, pesananHariIni, pendapatanBulanIni, stats, navBtn
  } = v;
  return tab === 'Update' && (
        <>
          <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700' }}>Catat perubahan layanan</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <select className="inp" value={rec.id} onChange={(e) => setRec((r) => ({ ...r, id: e.target.value }))} style={{ maxWidth: '380px', margin: 0 }} aria-label="Layanan">
                {services.length === 0 ? <option value="">Belum ada layanan. Tarik dulu di Pengaturan.</option> : null}
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.id} · {s.nama}</option>
                ))}
              </select>
              <select className="inp" value={rec.tipe} onChange={(e) => setRec((r) => ({ ...r, tipe: e.target.value }))} style={{ maxWidth: '220px', margin: 0 }} aria-label="Jenis perubahan">
                {Object.keys(UPS).map((k) => (
                  <option key={k} value={k}>{UPS[k].label}</option>
                ))}
              </select>
              {rec.tipe === 'up' || rec.tipe === 'down' ? (
                <>
                  <input className="inp" placeholder="Harga lama (cth: Rp 580)" value={rec.lama} onChange={(e) => setRec((r) => ({ ...r, lama: e.target.value }))} style={{ maxWidth: '200px', margin: 0 }} aria-label="Harga lama" />
                  <input className="inp" placeholder="Harga baru (cth: Rp 600)" value={rec.baru} onChange={(e) => setRec((r) => ({ ...r, baru: e.target.value }))} style={{ maxWidth: '200px', margin: 0 }} aria-label="Harga baru" />
                </>
              ) : null}
              <button type="button" className="submit" onClick={addUpdate} disabled={(rec.tipe === 'up' || rec.tipe === 'down') && (!rec.lama.trim() || !rec.baru.trim())}>Catat</button>
            </div>
          </div>

          <div role="group" aria-label="Filter update" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[['all', 'Semua'], ['up', 'Harga naik'], ['down', 'Harga turun'], ['off', 'Dinonaktifkan'], ['new', 'Layanan baru']].map((f) => (
              <button key={f[0]} type="button" className={'chip' + (updF === f[0] ? ' on' : '')} aria-pressed={updF === f[0]} onClick={() => setUpdF(f[0])} style={{ margin: 0 }}>{f[1]}</button>
            ))}
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
