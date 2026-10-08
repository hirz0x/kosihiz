/* Log aktivitas admin. Hanya bisa dibaca admin. */

import { wajibAdmin } from '../../lib/auth';
import { ambilAktivitas } from '../../lib/adminLog';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Metode tidak didukung.' });
  if (!wajibAdmin(req, res)) return;
  try {
    const rows = await ambilAktivitas(300);
    return res.status(200).json({ log: rows.map((r) => ({ id: r.id, aksi: r.aksi, detail: r.detail || '', dibuat: r.dibuat })) });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
