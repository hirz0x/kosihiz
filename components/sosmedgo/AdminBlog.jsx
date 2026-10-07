import React from 'react';
import Markdown from './Markdown';

function AdminBlog({ v }) {
  const {
    theme, setTheme, themeMode, setThemeMode, accent, setAccent, tab, setTab, navOpen, setNavOpen, bukaTab, q, setQ, pengguna, setPengguna, saldoProv, setSaldoProv, muatPengguna, orderFilter, setOrderFilter, deposits, setDeposits, muatDeposit, services, setServices, tickets, setTickets, muatTiket, selTicket, setSelTicket, reply, setReply, refunds, setRefunds, muatRefund, ringkasAfiliasi, setRingkasAfiliasi, muatAfiliasiAdmin, ranks, setRanks, muatPeringkat, simpanPeringkat, artikelList, setArtikelList, artikelSel, setArtikelSel, kosongArtikel, artikelForm, setArtikelForm, artikelBusy, setArtikelBusy, artikelPratinjau, setArtikelPratinjau, muatArtikel, pilihArtikel, artikelBaru, pilihGambar, kirimArtikel, simpanArtikel, hapusArtikel, kurs, setKurs, saldoAsliUsd, saldoIdr, saldoTxt, provMenipis, massMarkup, setMassMarkup, selSvc, setSelSvc, svcQ, setSvcQ, svcCat, setSvcCat, svcPage, setSvcPage, kursDirty, setKursDirty, svcDirty, setSvcDirty, svcSaving, setSvcSaving, syncedAt, setSyncedAt, liveOrders, setLiveOrders, ordersBusy, setOrdersBusy, ordersMsg, setOrdersMsg, konfirm, setKonfirm, tanyaKonfirmasi, refundPesanan, updLog, setUpdLog, hapusRiwayatAdmin, muatRiwayat, updF, setUpdF, depF, setDepF, siap, setSiap, undian, setUndian, muatUndian, undiUndian, toast, setToast, tampilkanToast, supportProfil, setSupportProfil, simpanSupport, rec, setRec, settingsTab, setSettingsTab, pwOld, setPwOld, pwNew, setPwNew, pwNew2, setPwNew2, pwMsg, setPwMsg, twofa, setTwofa, notif, setNotif, range, setRange, cFrom, setCFrom, cTo, setCTo, showTable, setShowTable, statistik, setStatistik, isDark, colors, series, accentVars, A, users, orders, pendingDeposits, openTickets, pendingRefunds, badges, totalPending, ticket, trend, trendTotals, prevDays, prevTotals, prevFrom, prevTo, compareLine, setDepositStatus, toggleService, setRefundStatus, setRankMin, provBusy, setProvBusy, provMsg, setProvMsg, callProvider, cekProvider, importServices, usd, SVC_PER_PAGE, svcCats, svcIndex, svcFiltered, svcPages, svcPageSafe, svcRows, selectedIds, selCount, allSelected, toggleAll, toggleSel, tandai, dirtyCount, adaPerubahan, labelSimpan, simpanLayanan, applyMarkup, resetMarkup, setServiceMarkup, updMsg, updDays, addUpdate, segarkanPesanan, updatePwd, kirimTiket, sendReply, closeTicket, themeOpts, accentOpts, hariIni, bulanIni, pesananHariIni, pendapatanBulanIni, stats, navBtn
  } = v;
  return tab === 'Blog' && (
        <>
          <div className="card" style={{ padding: '18px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700' }}>Artikel blog</div>
              <div className="muted" style={{ fontSize: '12px', marginTop: '4px' }}>Artikel yang terbit tampil di halaman /blog. Draf hanya terlihat di sini.</div>
            </div>
            <button type="button" className="submit" onClick={artikelBaru}>Tulis artikel baru</button>
          </div>
          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="tbl">
              <thead><tr><th>Tanggal</th><th>Judul</th><th>Slug</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {artikelList.length === 0 && <tr><td colSpan={5} className="muted">Belum ada artikel.</td></tr>}
                {artikelList.map((a, i) => (
                  <tr key={a.slug}>
                    <td className="muted">{a.tanggal}</td>
                    <td style={{ fontWeight: '700' }}>{a.judul}</td>
                    <td className="muted">{a.slug}</td>
                    <td>{a.terbit === false ? 'Draf' : 'Terbit'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button type="button" className="sub" onClick={() => pilihArtikel(i)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {artikelSel !== -1 && (
            <div className="card" style={{ padding: '22px', display: 'grid', gridTemplateColumns: '1fr', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ fontSize: '18px', fontWeight: '800' }}>{artikelSel >= 0 ? 'Edit artikel' : 'Artikel baru'}</div>
              <label style={{ display: 'grid', gap: '6px' }}>
                <span className="muted" style={{ fontSize: '12px' }}>Judul</span>
                <input className="inp" style={{ width: '100%', maxWidth: 'none', marginBottom: 0, boxSizing: 'border-box', fontSize: '17px', fontWeight: '700', padding: '12px 14px' }} placeholder="Judul artikel" value={artikelForm.judul} onChange={(e) => setArtikelForm({ ...artikelForm, judul: e.target.value })} />
              </label>
              <label style={{ display: 'grid', gap: '6px' }}>
                <span className="muted" style={{ fontSize: '12px' }}>Slug (URL)</span>
                <input className="inp" style={{ width: '100%', maxWidth: 'none', marginBottom: 0, boxSizing: 'border-box' }} placeholder="slug-url-artikel" value={artikelForm.slug} onChange={(e) => setArtikelForm({ ...artikelForm, slug: e.target.value })} />
              </label>
              <label style={{ display: 'grid', gap: '6px' }}>
                <span className="muted" style={{ fontSize: '12px' }}>Ringkasan singkat</span>
                <textarea className="inp" style={{ width: '100%', maxWidth: 'none', marginBottom: 0, boxSizing: 'border-box' }} rows={2} placeholder="Ringkasan singkat" value={artikelForm.ringkasan} onChange={(e) => setArtikelForm({ ...artikelForm, ringkasan: e.target.value })} />
              </label>
              <label style={{ display: 'grid', gap: '6px', justifySelf: 'start' }}>
                <span className="muted" style={{ fontSize: '12px' }}>Tanggal</span>
                <input className="inp" type="date" style={{ width: '200px' }} value={artikelForm.tanggal} onChange={(e) => setArtikelForm({ ...artikelForm, tanggal: e.target.value })} />
              </label>
              <div style={{ display: 'grid', gap: '8px' }}>
                <span className="muted" style={{ fontSize: '12px' }}>Gambar sampul (opsional, JPG, PNG, atau WEBP)</span>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {artikelForm.gambar ? <img src={artikelForm.gambar} alt="" style={{ width: '200px', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #26262E' }} /> : null}
                  <label className="sub" style={{ cursor: 'pointer' }}>
                    {artikelForm.gambar ? 'Ganti gambar' : 'Pilih gambar'}
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pilihGambar} style={{ display: 'none' }} />
                  </label>
                  {artikelForm.gambar ? <button type="button" className="sub" onClick={() => setArtikelForm({ ...artikelForm, gambar: '' })}>Hapus</button> : null}
                </div>
              </div>
              <div style={{ display: 'grid', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span className="muted" style={{ fontSize: '12px' }}>Isi artikel (Markdown: ## judul, - daftar, **tebal**, baris kosong untuk paragraf baru)</span>
                  <button type="button" className="sub" onClick={() => setArtikelPratinjau(!artikelPratinjau)}>{artikelPratinjau ? 'Tulis' : 'Pratinjau'}</button>
                </div>
                {artikelPratinjau ? (
                  <div style={{ background: '#0A0A0C', border: '1px solid #26262E', borderRadius: '12px', padding: '20px', minHeight: '420px', fontSize: '15px', lineHeight: 1.7, color: '#D4D4D8' }}>
                    <Markdown teks={artikelForm.isiTeks} />
                  </div>
                ) : (
                  <textarea className="inp" style={{ width: '100%', maxWidth: 'none', marginBottom: 0, boxSizing: 'border-box', minHeight: '420px', fontFamily: 'ui-monospace, Menlo, Consolas, monospace', fontSize: '13.5px', lineHeight: 1.6 }} placeholder="Tulis isi artikel di sini." value={artikelForm.isiTeks} onChange={(e) => setArtikelForm({ ...artikelForm, isiTeks: e.target.value })} />
                )}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <input type="checkbox" checked={artikelForm.terbit} onChange={(e) => setArtikelForm({ ...artikelForm, terbit: e.target.checked })} />
                Terbitkan (kalau dimatikan, tersimpan sebagai draf)
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button type="button" className="submit" onClick={simpanArtikel} disabled={artikelBusy}>{artikelBusy ? 'Menyimpan...' : 'Simpan'}</button>
                {artikelSel >= 0 ? <button type="button" className="sub" onClick={() => hapusArtikel(artikelSel)}>Hapus artikel</button> : null}
                <button type="button" className="sub" onClick={() => { setArtikelSel(-1); setArtikelForm(kosongArtikel); }}>Batal</button>
              </div>
            </div>
          )}
        </>
  );
}

export default AdminBlog;
