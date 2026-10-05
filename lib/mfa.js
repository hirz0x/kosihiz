/* 2FA (TOTP) lewat Supabase Auth. Semua pemanggilan memakai token user, jadi hanya bisa mengubah akun sendiri. */

import { supaReq } from './account';

export async function faktorUser(token) {
  const r = await supaReq('GET', 'user', undefined, token);
  if (!r.ok || !r.data) return [];
  return Array.isArray(r.data.factors) ? r.data.factors : [];
}

export function totpAktif(faktor) {
  return faktor.find((f) => f.factor_type === 'totp' && f.status === 'verified') || null;
}

/* Minta tantangan lalu verifikasi kode. Kalau berhasil, dikembalikan sesi baru (AAL2). */
export async function verifikasiKode(token, factorId, kode) {
  const ch = await supaReq('POST', 'factors/' + encodeURIComponent(factorId) + '/challenge', {}, token);
  if (!ch.ok || !ch.data || !ch.data.id) return { ok: false, error: 'Tidak bisa memulai verifikasi. Coba lagi.' };
  const v = await supaReq('POST', 'factors/' + encodeURIComponent(factorId) + '/verify', { challenge_id: ch.data.id, code: String(kode) }, token);
  if (!v.ok || !v.data || !v.data.access_token) return { ok: false, error: 'Kode salah atau sudah kedaluwarsa.' };
  return { ok: true, sesi: v.data };
}
