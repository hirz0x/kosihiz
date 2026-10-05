/* Preferensi per user: bahasa, zona waktu, notifikasi, dan detail invoice. Disimpan di server, bukan di browser. */

import { getSetting, setSetting } from '../../lib/store';
import { userDariRequest } from '../../lib/account';

const DEFAULT = { lang: 'id', tz: 'WIB', themeMode: 'dark', accent: 'red', cur: 'IDR', notif: { order: true, deposit: true, ticket: true, promo: false }, invoice: '' };
const MODE_TEMA = ['dark', 'light', 'auto'];
const WARNA = ['red', 'blue', 'green', 'purple', 'orange'];
const MATA_UANG = ['IDR', 'USD'];
const BAHASA = ['id', 'en'];
const ZONA = ['WIB', 'WITA', 'WIT'];
const INVOICE_MAKS = 500;

export default async function handler(req, res) {
  try {
    const user = await userDariRequest(req);
    if (!user) return res.status(401).json({ error: 'Perlu login.' });
    const kunci = 'pref:' + user.id;

    if (req.method === 'GET') {
      const simpan = await getSetting(kunci, null);
      return res.status(200).json({ ...DEFAULT, ...(simpan || {}), notif: { ...DEFAULT.notif, ...((simpan && simpan.notif) || {}) } });
    }

    if (req.method === 'PATCH') {
      const simpan = await getSetting(kunci, null);
      const cur = { ...DEFAULT, ...(simpan || {}), notif: { ...DEFAULT.notif, ...((simpan && simpan.notif) || {}) } };
      const b = req.body || {};
      if (b.lang !== undefined) {
        if (!BAHASA.includes(b.lang)) return res.status(400).json({ error: 'Bahasa tidak dikenal.' });
        cur.lang = b.lang;
      }
      if (b.tz !== undefined) {
        if (!ZONA.includes(b.tz)) return res.status(400).json({ error: 'Zona waktu tidak dikenal.' });
        cur.tz = b.tz;
      }
      if (b.notif !== undefined && b.notif && typeof b.notif === 'object') {
        cur.notif = { order: !!b.notif.order, deposit: !!b.notif.deposit, ticket: !!b.notif.ticket, promo: !!b.notif.promo };
      }
      if (b.invoice !== undefined) cur.invoice = String(b.invoice).slice(0, INVOICE_MAKS);
      if (b.themeMode !== undefined) {
        if (!MODE_TEMA.includes(b.themeMode)) return res.status(400).json({ error: 'Mode tema tidak dikenal.' });
        cur.themeMode = b.themeMode;
      }
      if (b.accent !== undefined) {
        if (!WARNA.includes(b.accent)) return res.status(400).json({ error: 'Warna tema tidak dikenal.' });
        cur.accent = b.accent;
      }
      if (b.cur !== undefined) {
        if (!MATA_UANG.includes(b.cur)) return res.status(400).json({ error: 'Mata uang tidak dikenal.' });
        cur.cur = b.cur;
      }
      await setSetting(kunci, cur);
      return res.status(200).json(cur);
    }

    return res.status(405).json({ error: 'Metode tidak didukung.' });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
