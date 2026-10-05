/* Aturan afiliasi: komisi dari deposit referral yang disetujui, dan batas penarikan. */

import { getProfile, getProfileByUsername, addKomisi } from './store';

export const KOMISI_PERSEN = 5;
export const MIN_TARIK = 10000;

/* Dipanggil setelah deposit disetujui. Komisi tidak menggagalkan persetujuan kalau gagal. */
export async function beriKomisi(uid, nominal) {
  try {
    const profil = await getProfile(uid);
    if (!profil || !profil.ref_by) return;
    const pengajak = await getProfileByUsername(profil.ref_by);
    if (!pengajak) return;
    const komisi = Math.floor((nominal * KOMISI_PERSEN) / 100);
    if (komisi > 0) await addKomisi(pengajak.user_id, komisi);
  } catch (e) {
    console.error('Gagal memberi komisi:', e);
  }
}
