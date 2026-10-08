/* Catat aktivitas admin: setuju/tolak refund & deposit, ubah markup/kurs, sinkron katalog, login
   admin, dll — buat akuntabilitas ("siapa approve apa, kapan").
   Kalau gagal dicatat (mis. admin_log belum sempat dibuat), tindakan aslinya tetap jalan seperti
   biasa — log cuma jejak, bukan bagian penentu alur utama. */

import { tambahAdminLog, listAdminLog } from './store';

export async function catatAktivitas(aksi, detail) {
  try {
    await tambahAdminLog(aksi, detail);
  } catch (e) {
    /* diabaikan dengan sengaja */
  }
}

export async function ambilAktivitas(limit) {
  return listAdminLog(limit);
}
