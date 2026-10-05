/* Notifikasi di dalam aplikasi. Disimpan per user (30 terbaru). Mengikuti pilihan on/off di Pengaturan. */

import crypto from 'crypto';
import { getSetting, setSetting } from './store';

const MAKS = 30;

export async function tambahNotif(uid, jenis, judul, isi) {
  try {
    const pref = await getSetting('pref:' + uid, null);
    if (pref && pref.notif && pref.notif[jenis] === false) return;
    const daftar = (await getSetting('notif:' + uid, null)) || [];
    const baru = { id: crypto.randomBytes(6).toString('hex'), jenis, judul, isi, waktu: new Date().toISOString(), dibaca: false };
    await setSetting('notif:' + uid, [baru, ...daftar].slice(0, MAKS));
  } catch (e) {
    /* Notifikasi tidak boleh menggagalkan proses utamanya. */
  }
}
