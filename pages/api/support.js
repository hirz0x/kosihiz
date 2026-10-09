/* Profil tim support: nama dan inisial avatar yang tampil di balasan tiket. GET bebas, PATCH hanya admin. */

import { getSetting, setSetting } from '../../lib/store';
import { wajibAdmin, isAdmin } from '../../lib/auth';

const DEFAULT = { nama: 'Tim Support', inisial: 'SG' };

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const simpan = await getSetting('support', null);
      return res.status(200).json({ ...DEFAULT, ...(simpan || {}) });
    }

    if (req.method === 'PATCH') {
      if (!wajibAdmin(req, res)) return;
      const nama = String((req.body && req.body.nama) || '').trim();
      const inisial = String((req.body && req.body.inisial) || '').trim().toUpperCase();
      if (!nama || nama.length > 40) return res.status(400).json({ error: 'Nama harus 1-40 karakter.' });
      if (!inisial || inisial.length > 3) return res.status(400).json({ error: 'Inisial harus 1-3 karakter.' });
      await setSetting('support', { nama, inisial });
      return res.status(200).json({ ok: true, nama, inisial });
    }

    return res.status(405).json({ error: 'Metode tidak didukung.' });
  } catch (e) {
    /* GET dibaca bebas (termasuk pelanggan) — pesan error asli cuma buat admin. */
    return res.status(502).json({ error: isAdmin(req) ? String(e.message || e) : 'Gagal memuat profil support. Coba lagi.' });
  }
}
