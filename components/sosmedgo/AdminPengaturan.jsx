import React from 'react';
import { ICON, NOTIF_ITEMS, rp, Svg, Toggle } from './admin-kit';

function AdminPengaturan({ v }) {
  const {
    theme, setTheme, themeMode, setThemeMode, accent, setAccent, tab, setTab, navOpen, setNavOpen, bukaTab, q, setQ, pengguna, setPengguna, saldoProv, setSaldoProv, muatPengguna, orderFilter, setOrderFilter, deposits, setDeposits, muatDeposit, services, setServices, tickets, setTickets, muatTiket, selTicket, setSelTicket, reply, setReply, refunds, setRefunds, muatRefund, ringkasAfiliasi, setRingkasAfiliasi, muatAfiliasiAdmin, ranks, setRanks, muatPeringkat, simpanPeringkat, artikelList, setArtikelList, artikelSel, setArtikelSel, kosongArtikel, artikelForm, setArtikelForm, artikelBusy, setArtikelBusy, artikelPratinjau, setArtikelPratinjau, muatArtikel, pilihArtikel, artikelBaru, pilihGambar, kirimArtikel, simpanArtikel, hapusArtikel, kurs, setKurs, saldoAsliUsd, saldoIdr, saldoTxt, provMenipis, massMarkup, setMassMarkup, selSvc, setSelSvc, svcQ, setSvcQ, svcCat, setSvcCat, svcPage, setSvcPage, kursDirty, setKursDirty, svcDirty, setSvcDirty, svcSaving, setSvcSaving, syncedAt, setSyncedAt, liveOrders, setLiveOrders, ordersBusy, setOrdersBusy, ordersMsg, setOrdersMsg, konfirm, setKonfirm, tanyaKonfirmasi, refundPesanan, updLog, setUpdLog, hapusRiwayatAdmin, muatRiwayat, updF, setUpdF, depF, setDepF, siap, setSiap, undian, setUndian, muatUndian, undiUndian, toast, setToast, tampilkanToast, supportProfil, setSupportProfil, simpanSupport, rec, setRec, settingsTab, setSettingsTab, pwOld, setPwOld, pwNew, setPwNew, pwNew2, setPwNew2, pwMsg, setPwMsg, twofa, setTwofa, notif, setNotif, range, setRange, cFrom, setCFrom, cTo, setCTo, showTable, setShowTable, statistik, setStatistik, isDark, colors, series, accentVars, A, users, orders, pendingDeposits, openTickets, pendingRefunds, badges, totalPending, ticket, trend, trendTotals, prevDays, prevTotals, prevFrom, prevTo, compareLine, setDepositStatus, toggleService, setRefundStatus, setRankMin, provBusy, setProvBusy, provMsg, setProvMsg, callProvider, cekProvider, importServices, usd, SVC_PER_PAGE, svcCats, svcIndex, svcFiltered, svcPages, svcPageSafe, svcRows, selectedIds, selCount, allSelected, toggleAll, toggleSel, tandai, dirtyCount, adaPerubahan, labelSimpan, simpanLayanan, applyMarkup, resetMarkup, setServiceMarkup, updMsg, updDays, addUpdate, segarkanPesanan, updatePwd, kirimTiket, sendReply, closeTicket, themeOpts, accentOpts, hariIni, bulanIni, pesananHariIni, pendapatanBulanIni, stats, navBtn
  } = v;
  return tab === 'Pengaturan' && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {[['Keamanan', ICON.lock], ['2FA', ICON.shield], ['Notifikasi', ICON.bell], ['Tampilan', ICON.mode], ['Provider', ICON.layers]].map(([name, icon]) => (
              <button key={name} type="button" className={'sub' + (settingsTab === name ? ' on' : '')} onClick={() => setSettingsTab(name)}>
                <Svg d={icon} size={14} sw={2} /> {name}
              </button>
            ))}
          </div>

          {settingsTab === 'Keamanan' && (
            <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '520px' }}>
              <div style={{ fontSize: '14px', fontWeight: '700' }}>Ganti password</div>
              <input className="inp" style={{ maxWidth: 'none' }} type="password" placeholder="Password lama" value={pwOld} onChange={(e) => setPwOld(e.target.value)} />
              <input className="inp" style={{ maxWidth: 'none' }} type="password" placeholder="Password baru (min. 8 karakter)" value={pwNew} onChange={(e) => setPwNew(e.target.value)} />
              <input className="inp" style={{ maxWidth: 'none' }} type="password" placeholder="Ulangi password baru" value={pwNew2} onChange={(e) => setPwNew2(e.target.value)} />
              {pwMsg ? <div style={{ fontSize: '12px', color: pwMsg.startsWith('Password berhasil') ? '#22C55E' : '#FF5A75' }}>{pwMsg}</div> : null}
              <div><button type="button" className="submit" onClick={updatePwd}>Perbarui password</button></div>
            </div>
          )}

          {settingsTab === '2FA' && (
            <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', maxWidth: '520px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>Autentikasi dua langkah (2FA)</div>
                <div className="muted" style={{ fontSize: '12px', marginTop: '4px' }}>{twofa ? 'Aktif. Login admin butuh kode tambahan.' : 'Nonaktif. Disarankan untuk akun admin.'}</div>
              </div>
              <Toggle on={twofa} onChange={setTwofa} label="Aktifkan 2FA" />
            </div>
          )}

          {settingsTab === 'Notifikasi' && (
            <div className="card" style={{ maxWidth: '520px' }}>
              {NOTIF_ITEMS.map(([key, title, desc], i) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px 18px', borderBottom: i < NOTIF_ITEMS.length - 1 ? '1px solid var(--b2)' : 'none' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>{title}</div>
                    <div className="muted" style={{ fontSize: '12px', marginTop: '3px' }}>{desc}</div>
                  </div>
                  <Toggle on={notif[key]} onChange={(val) => setNotif((n) => ({ ...n, [key]: val }))} label={title} />
                </div>
              ))}
            </div>
          )}

          {settingsTab === 'Tampilan' && (
            <div className="card" style={{ padding: '22px', maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>Mode tema</div>
                <div className="ux-grid3" style={{ marginTop: '12px' }}>
                  {themeOpts.map((o) => (
                    <button key={o.k} type="button" className="ux-card" aria-pressed={o.on} onClick={o.pick} style={{ borderColor: o.on ? 'var(--accent)' : 'var(--b3)' }}>
                      <span className="ux-prev" style={{ background: o.k === 'light' ? '#FFFFFF' : o.k === 'dark' ? '#0B0B0E' : 'linear-gradient(90deg,#FFFFFF 50%,#0B0B0E 50%)' }}>
                        <span className="ux-side" style={{ background: o.k === 'dark' ? '#16161A' : '#E6E8EC' }} />
                        <span className="ux-dot" style={{ background: 'var(--accent)' }} />
                      </span>
                      <span className="ux-name">{o.t}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>Warna tema</div>
                <div className="ux-grid5" style={{ marginTop: '12px' }}>
                  {accentOpts.map((o) => (
                    <button key={o.k} type="button" className="ux-card" aria-pressed={o.on} onClick={o.pick} style={{ borderColor: o.on ? o.c : 'var(--b3)' }}>
                      <span className="ux-prev" style={{ background: 'var(--s2)' }}>
                        <span className="ux-bar" style={{ background: o.c }} />
                        <span className="ux-side" style={{ background: '#E6E8EC', top: '8px' }} />
                        <span className="ux-dot" style={{ background: o.c }} />
                      </span>
                      <span className="ux-name">{o.t}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {settingsTab === 'Provider' && (
            <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '640px' }}>
              <div style={{ fontSize: '14px', fontWeight: '700' }}>Provider layanan</div>
              <div className="muted" style={{ fontSize: '12px' }}>
                Tersambung ke <strong style={{ color: 'var(--hi)' }}>smmsoc.com</strong>. API key disimpan di file <strong style={{ color: 'var(--hi)' }}>.env.local</strong> di server, dan tidak pernah dikirim ke browser.
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <button type="button" className="submit" onClick={cekProvider} disabled={provBusy}>Cek koneksi &amp; saldo</button>
                <button type="button" className="ghost" onClick={importServices} disabled={provBusy}>Ambil daftar layanan</button>
              </div>
              {provBusy ? <div className="muted" style={{ fontSize: '12px' }}>Menghubungi provider...</div> : null}
              {provMsg ? (
                <div style={{ fontSize: '12px', color: provMsg.ok ? '#22C55E' : '#FF5A75', lineHeight: '1.6' }}>{provMsg.text}</div>
              ) : null}
              <div className="muted" style={{ fontSize: '11px', lineHeight: '1.6' }}>
                Harga dasar dihitung dari rate provider dikali kurs di tab Layanan ({rp(kurs)} per $1). Markup diatur sendiri setelah layanan masuk.
              </div>
            </div>
          )}
        </>
  );
}

export default AdminPengaturan;
