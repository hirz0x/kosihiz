/* Riwayat perubahan layanan. Baca bebas, karena dipakai halaman Update pelanggan. Admin bisa mencatat manual. */

import { listRiwayat, tambahRiwayat, hapusRiwayat } from '../../lib/store';
import { wajibAdmin } from '../../lib/auth';
import { catatAktivitas } from '../../lib/adminLog';

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

    /* Admin menghapus satu atau beberapa catatan riwayat sekaligus. Layanannya sendiri tidak ikut terhapus. */
    if (req.method === 'DELETE') {
      if (!wajibAdmin(req, res)) return;
      const mentah = (req.body && (req.body.ids || req.body.id)) || req.query.ids || req.query.id || '';
      const daftar = (Array.isArray(mentah) ? mentah : String(mentah).split(',')).map((x) => String(x).trim()).filter(Boolean);
      /* Dibatasi 15 digit (aman di bawah Number.MAX_SAFE_INTEGER) supaya string digit yang sengaja
         dibikin sangat panjang tidak lolos validasi lalu jadi Infinity saat di-Number()-kan di
         lib/store.js, yang bisa bikin filter in.(...) ke Supabase rusak. */
      if (!daftar.length || !daftar.every((x) => /^[0-9]{1,15}$/.test(x))) return res.status(400).json({ error: 'ID riwayat tidak valid.' });
      if (daftar.length > 300) return res.status(400).json({ error: 'Maksimal 300 catatan sekali hapus.' });
      await hapusRiwayat(daftar);
      await catatAktivitas('hapus_riwayat', daftar.length + ' catatan riwayat layanan dihapus');
      return res.status(200).json({ ok: true, dihapus: daftar.length });
    }

    return res.status(405).json({ error: 'Metode tidak didukung.' });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
