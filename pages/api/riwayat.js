/* Riwayat perubahan layanan. Baca bebas, karena dipakai halaman Update pelanggan. Admin bisa mencatat manual. */

import { listRiwayat, tambahRiwayat, hapusRiwayat } from '../../lib/store';
import { wajibAdmin } from '../../lib/auth';

const TIPE = ['up', 'down', 'off', 'new'];
const TAMPIL_MAKS = 300;

/* Tanggal dalam WIB, sama seperti tanggal di halaman lain. */
const tanggalWib = (iso) => new Date(new Date(iso).getTime() + 7 * 3600 * 1000).toISOString().slice(0, 10);

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await listRiwayat(TAMPIL_MAKS);
      return res.status(200).json({
        riwayat: rows.map((r) => ({ id: r.id, layananId: Number(r.layanan_id), tipe: r.tipe, lama: r.lama || '', baru: r.baru || '', tanggal: tanggalWib(r.dibuat) }))
      });
    }

    if (req.method === 'POST') {
      if (!wajibAdmin(req, res)) return;
      const { layananId, tipe, lama, baru } = req.body || {};
      if (!layananId) return res.status(400).json({ error: 'Pilih layanan dulu.' });
      if (!TIPE.includes(tipe)) return res.status(400).json({ error: 'Jenis perubahan tidak dikenal.' });
      if ((tipe === 'up' || tipe === 'down') && (!String(lama || '').trim() || !String(baru || '').trim())) {
        return res.status(400).json({ error: 'Isi harga lama dan harga baru.' });
      }
      await tambahRiwayat([{ layananId: String(layananId), tipe, lama: String(lama || '').trim(), baru: String(baru || '').trim() }]);
      return res.status(200).json({ ok: true });
    }

    /* Admin menghapus satu catatan riwayat. Layanannya sendiri tidak ikut terhapus. */
    if (req.method === 'DELETE') {
      if (!wajibAdmin(req, res)) return;
      const id = String((req.body && req.body.id) || req.query.id || '');
      if (!/^[0-9]+$/.test(id)) return res.status(400).json({ error: "ID riwayat tidak valid." });
      await hapusRiwayat(id);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Metode tidak didukung.' });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
