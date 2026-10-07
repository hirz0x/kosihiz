/* Unggah foto sampul artikel ke Supabase Storage, kembalikan URL publiknya.
   Dipanggil dari panel admin (Blog) sesaat setelah foto dipilih, supaya yang disimpan
   ke tabel settings cuma URL pendek, bukan base64 utuh (lihat lib/storage.js). */

import { wajibAdmin } from '../../../lib/auth';
import { pastikanBucketArtikel, unggahGambarArtikel } from '../../../lib/storage';

export const config = { api: { bodyParser: { sizeLimit: '2mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metode tidak didukung.' });
  if (!wajibAdmin(req, res)) return;
  try {
    const { slug, gambar } = req.body || {};
    await pastikanBucketArtikel();
    const url = await unggahGambarArtikel(slug, gambar);
    return res.status(200).json({ ok: true, url });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
