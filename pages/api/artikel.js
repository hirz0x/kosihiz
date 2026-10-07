/* Artikel blog. GET bebas (dipakai halaman /blog), PATCH hanya admin (menyimpan seluruh daftar artikel). */

import { setSetting } from '../../lib/store';
import { wajibAdmin } from '../../lib/auth';
import { bersihkanArtikel } from '../../lib/artikel';
import { ambilSemuaArtikel } from '../../lib/artikelStore';

/* Setiap simpan mengirim seluruh daftar artikel sekaligus. Fotonya sendiri sudah berupa URL pendek
   (diunggah ke Supabase Storage lewat /api/artikel/upload-gambar), jadi payloadnya tetap kecil —
   batas dinaikkan sedikit saja untuk jaga-jaga kalau isi artikel panjang. */
export const config = { api: { bodyParser: { sizeLimit: '2mb' } } };

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const daftar = await ambilSemuaArtikel();
      return res.status(200).json({ artikel: daftar });
    }

    if (req.method === 'PATCH') {
      if (!wajibAdmin(req, res)) return;
      let bersih;
      try {
        bersih = bersihkanArtikel(req.body && req.body.artikel);
      } catch (e) {
        return res.status(400).json({ error: e.message });
      }
      await setSetting('artikel', bersih);
      return res.status(200).json({ ok: true, artikel: bersih });
    }

    return res.status(405).json({ error: 'Metode tidak didukung.' });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
