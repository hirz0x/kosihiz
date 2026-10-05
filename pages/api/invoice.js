/* Invoice deposit milik user, dalam bentuk halaman HTML yang bisa dicetak atau disimpan sebagai PDF. */

import { getDeposit, getSetting } from '../../lib/store';
import { userDariRequest } from '../../lib/account';

const STATUS = { menunggu: 'Menunggu pembayaran', disetujui: 'Lunas', ditolak: 'Dibatalkan' };

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const waktuWib = (iso) => {
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? '-' : new Date(t + 7 * 3600 * 1000).toISOString().slice(0, 16).replace('T', ' ') + ' WIB';
};

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Metode tidak didukung.' });
  const user = await userDariRequest(req);
  if (!user) return res.status(401).send('Perlu login.');
  try {
    const d = await getDeposit(String(req.query.id || ''));
    if (!d || d.userId !== user.id) return res.status(404).send('Invoice tidak ditemukan.');
    const pref = await getSetting('pref:' + user.id, null);
    const detail = pref && pref.invoice ? pref.invoice : '';

    const html = `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Invoice ${esc(d.id)}</title>
<style>
body{font-family:Arial,Helvetica,sans-serif;color:#111;background:#f4f4f5;margin:0;padding:24px}
.kertas{max-width:680px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,.08)}
h1{font-size:22px;margin:0 0 4px}.muted{color:#666;font-size:13px}
table{width:100%;border-collapse:collapse;margin-top:20px}td{padding:10px 0;border-bottom:1px solid #eee;font-size:14px}
td.r{text-align:right;font-weight:700}.total td{font-size:16px;border-bottom:none}
.cetak{margin-top:24px;padding:10px 16px;border:none;border-radius:8px;background:#E11D3A;color:#fff;font-weight:700;cursor:pointer}
@media print{.cetak{display:none}body{background:#fff;padding:0}.kertas{box-shadow:none}}
</style></head><body>
<div class="kertas">
  <h1>Invoice SosmedGo</h1>
  <div class="muted">Nomor: ${esc(d.id)} · ${esc(waktuWib(d.dibuat))}</div>
  <table>
    <tr><td>Nama akun</td><td class="r">${esc(user.username || '-')}</td></tr>
    <tr><td>Email</td><td class="r">${esc(user.email || '-')}</td></tr>
    <tr><td>Metode pembayaran</td><td class="r">${esc(d.metode || '-')}</td></tr>
    <tr><td>Status</td><td class="r">${esc(STATUS[d.status] || d.status)}</td></tr>
    <tr><td>Saldo yang ditambahkan</td><td class="r">Rp ${Number(d.nominal || 0).toLocaleString('id-ID')}</td></tr>
    <tr class="total"><td>Total dibayar</td><td class="r">Rp ${Number(d.nominal || 0).toLocaleString('id-ID')}</td></tr>
  </table>
  ${detail ? `<div style="margin-top:24px;font-size:13px;line-height:1.7;white-space:pre-line">${esc(detail)}</div>` : ''}
  <button class="cetak" onclick="window.print()">Cetak / simpan PDF</button>
</div>
</body></html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(html);
  } catch (e) {
    return res.status(502).send('Invoice belum bisa dibuat. Coba lagi.');
  }
}
