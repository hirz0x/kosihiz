/* API key untuk membuat pesanan dari luar aplikasi. Yang disimpan hanya hash-nya, kunci aslinya ditampilkan sekali. */

import crypto from 'crypto';
import { getSetting, setSetting } from './store';

const hashKey = (k) => crypto.createHash('sha256').update(k).digest('hex');

export async function buatApiKey(uid) {
  const key = 'sgk_' + crypto.randomBytes(24).toString('hex');
  const hash = hashKey(key);
  await setSetting('apikey:' + uid, { hash, awal: key.slice(0, 8), dibuat: new Date().toISOString() });
  await setSetting('apikey_owner:' + hash, { uid });
  return { key, awal: key.slice(0, 8) };
}

export async function infoApiKey(uid) {
  const s = await getSetting('apikey:' + uid, null);
  return s && s.hash ? { awal: s.awal, dibuat: s.dibuat } : null;
}

/* User dari header Authorization: Bearer <api key>. Null kalau key tidak valid atau sudah diganti. */
export async function userDariApiKey(req) {
  const m = String(req.headers.authorization || '').match(/^Bearer\s+(\S+)$/i);
  if (!m) return null;
  const hash = hashKey(m[1]);
  const owner = await getSetting('apikey_owner:' + hash, null);
  if (!owner || !owner.uid) return null;
  const aktif = await getSetting('apikey:' + owner.uid, null);
  if (!aktif || aktif.hash !== hash) return null;
  return { id: owner.uid };
}
