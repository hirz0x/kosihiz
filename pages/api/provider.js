/* Jembatan ke API provider. Dipakai untuk cek saldo dan panggilan langsung lain dari admin.
   API key tetap di server, tidak pernah dikirim ke browser. */

import { callProvider, ALLOWED } from '../../lib/provider';
import { wajibAdmin } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan metode POST.' });
  if (!wajibAdmin(req, res)) return;

  const { action, ...params } = req.body || {};
  if (!action || !Object.prototype.hasOwnProperty.call(ALLOWED, action)) {
    return res.status(400).json({ error: 'Action tidak dikenal: ' + String(action) });
  }

  try {
    return res.status(200).json(await callProvider(action, params));
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
