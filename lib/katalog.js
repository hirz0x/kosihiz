/* Sinkronisasi katalog layanan dari provider ke database.
   Dipakai dari /api/services (POST, dipicu admin lewat tombol "Ambil daftar layanan") dan
   /api/cron/services (dipicu cronjob terjadwal) — logikanya cuma ditulis sekali di sini
   supaya kedua jalur itu tidak bisa diam-diam beda perilaku. */

import { callProvider } from './provider';
import { getServices, replaceServices, getSettings, setSetting } from './store';
import { simpanRiwayat } from './riwayat';
import { decodeEntitas } from './teks';

export async function sinkronKatalog({ kursOverride } = {}) {
  const settings = await getSettings();
  const kurs = Number(kursOverride) > 0 ? Number(kursOverride) : settings.kurs;
  const list = await callProvider('services');
  if (!Array.isArray(list)) throw new Error('Balasan provider bukan daftar layanan.');

  const markupLama = new Map((await getServices()).map((s) => [s.id, s.markup]));
  const services = list.map((x) => ({
    id: String(x.service),
    nama: decodeEntitas(x.name),
    kategori: x.category,
    rate: Number(x.rate),
    dasar: Math.round(Number(x.rate) * kurs),
    markup: markupLama.has(String(x.service)) ? markupLama.get(String(x.service)) : 0,
    min: Number(x.min),
    maks: Number(x.max),
    jenis: x.type || 'Default',
    refill: !!x.refill,
    batal: !!x.cancel,
    aktif: true
  }));

  /* Layanan baru dicatat hanya kalau sebelumnya sudah ada daftar, supaya sinkron pertama tidak membanjiri riwayat. */
  const layananBaru = markupLama.size ? services.filter((x) => !markupLama.has(x.id)).slice(0, 200).map((x) => ({ layananId: x.id, tipe: 'new', lama: '', baru: '' })) : [];
  await replaceServices(services);
  if (layananBaru.length) await simpanRiwayat(layananBaru);
  await setSetting('settings', { ...settings, kurs });
  const disinkron = new Date().toISOString();
  await setSetting('services_synced', disinkron);
  return { jumlah: services.length, kategori: new Set(services.map((s) => s.kategori)).size, disinkron, baru: layananBaru.length, kurs };
}
