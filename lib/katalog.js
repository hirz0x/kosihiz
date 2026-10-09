/* Sinkronisasi katalog layanan dari provider ke database.
   Dipakai dari /api/services (POST, dipicu admin lewat tombol "Ambil daftar layanan") dan
   /api/cron/services (dipicu cronjob terjadwal) — logikanya cuma ditulis sekali di sini
   supaya kedua jalur itu tidak bisa diam-diam beda perilaku. */

import { callProvider, LIKEO_ID_OFFSET } from './provider';
import { getServices, replaceServices, getSettings, setSetting } from './store';
import { simpanRiwayat } from './riwayat';
import { decodeEntitas } from './teks';

export async function sinkronKatalog({ provider = 'smmsoc', kursOverride } = {}) {
  const settings = await getSettings();
  const kurs = Number(kursOverride) > 0 ? Number(kursOverride) : settings.kurs;
  const list = await callProvider(provider, 'services');
  if (!Array.isArray(list)) throw new Error('Balasan provider bukan daftar layanan.');

  /* Layanan likeo digeser ID-nya supaya tidak pernah bentrok dengan ID layanan smmsoc
     (lihat lib/provider.js: rawProviderId membalikkan ini saat memanggil provider lagi). */
  const keId = (x) => provider === 'likeo' ? String(Number(x.service) + LIKEO_ID_OFFSET) : String(x.service);
  /* Layanan BARU dari provider ini default nonaktif kalau bukan smmsoc, supaya admin bisa
     cek dulu satu-satu sebelum tampil ke pelanggan. Layanan yang sudah pernah ditarik
     sebelumnya mempertahankan status aktif/nonaktif & markup yang sudah diatur admin. */
  const aktifBaru = provider === 'smmsoc';
  const lama = new Map((await getServices(provider)).map((s) => [s.id, s]));
  const services = list.map((x) => {
    const id = keId(x);
    const s = lama.get(id);
    return {
      id,
      provider,
      nama: decodeEntitas(x.name),
      kategori: x.category,
      rate: Number(x.rate),
      dasar: Math.round(Number(x.rate) * kurs),
      markup: s ? s.markup : 0,
      min: Number(x.min),
      maks: Number(x.max),
      jenis: x.type || 'Default',
      refill: !!x.refill,
      batal: !!x.cancel,
      aktif: s ? s.aktif : aktifBaru
    };
  });

  /* Layanan baru dicatat hanya kalau sebelumnya sudah ada daftar provider ini, supaya sinkron pertama tidak membanjiri riwayat. */
  const layananBaru = lama.size ? services.filter((x) => !lama.has(x.id)).slice(0, 200).map((x) => ({ layananId: x.id, tipe: 'new', lama: '', baru: '' })) : [];
  await replaceServices(services, provider);
  if (layananBaru.length) await simpanRiwayat(layananBaru);
  await setSetting('settings', { ...settings, kurs });
  const disinkron = new Date().toISOString();
  await setSetting('services_synced:' + provider, disinkron);
  return { jumlah: services.length, kategori: new Set(services.map((s) => s.kategori)).size, disinkron, baru: layananBaru.length, kurs, provider };
}
