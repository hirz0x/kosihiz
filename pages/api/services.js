/* Katalog layanan: tarik dari provider, simpan di Supabase, dan atur markup. */

import { callProvider } from '../../lib/provider';
import { getServices, replaceServices, saveServices, getSetting, setSetting, getSettings } from '../../lib/store';
import { waktuPerLayanan } from '../../lib/orders';
import { catatPerubahan, simpanRiwayat } from '../../lib/riwayat';
import { decodeEntitas } from '../../lib/teks';
import { wajibAdmin } from '../../lib/auth';

export const config = { api: { bodyParser: { sizeLimit: '8mb' } } };

export default async function handler(req, res) {
  /* Daftar layanan. Baca bebas, karena dipakai halaman pelanggan. */
  if (req.method === 'GET') {
    try {
      const [services, waktu, settings, disinkron] = await Promise.all([
        getServices(), waktuPerLayanan(), getSettings(), getSetting('services_synced', null)
      ]);
      /* Kategori iklan dari provider ("Other ad | Don't use") disembunyikan dari katalog. Datanya tetap ada. */
      const tampil = services.filter((s) => !/don.t use/i.test(String(s.kategori || '')));
      const hasil = tampil.map((s) => ({ ...s, nama: decodeEntitas(s.nama), refill: Boolean(s.refill), ...(waktu[s.id] ? { waktuRata: waktu[s.id].rata, waktuN: waktu[s.id].n } : {}) }));
      return res.status(200).json({ services: hasil, settings, disinkron });
    } catch (e) {
      return res.status(502).json({ error: String(e.message || e) });
    }
  }

  /* Tarik ulang dari provider. Markup yang sudah diatur dipertahankan. */
  if (req.method === 'POST') {
    if (!wajibAdmin(req, res)) return;
    try {
      const settings = await getSettings();
      const kurs = Number(req.body && req.body.kurs) > 0 ? Number(req.body.kurs) : settings.kurs;
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
      return res.status(200).json({ jumlah: services.length, kategori: new Set(services.map((s) => s.kategori)).size, disinkron });
    } catch (e) {
      return res.status(502).json({ error: String(e.message || e) });
    }
  }

  /* Simpan perubahan markup, status aktif, dan kurs. */
  if (req.method === 'PATCH') {
    if (!wajibAdmin(req, res)) return;
    try {
      const { updates, kurs } = req.body || {};
      const settings = await getSettings();
      let services = await getServices();
      const berubah = [];
      const catatan = [];

      if (Array.isArray(updates) && updates.length) {
        const byId = new Map(updates.map((u) => [String(u.id), u]));
        services = services.map((s) => {
          const u = byId.get(s.id);
          if (!u) return s;
          const hasil = {
            ...s,
            markup: u.markup === undefined ? s.markup : Math.max(0, Number(u.markup) || 0),
            aktif: u.aktif === undefined ? s.aktif : !!u.aktif
          };
          const catat = catatPerubahan(s, hasil);
          if (catat) catatan.push(catat);
          berubah.push(hasil);
          return hasil;
        });
      }

      /* Kurs baru mengubah harga dasar semua layanan yang punya rate dari provider. */
      if (Number(kurs) > 0 && Number(kurs) !== settings.kurs) {
        services = services.map((s) => {
          if (!s.rate) return s;
          const hasil = { ...s, dasar: Math.round(s.rate * Number(kurs)) };
          berubah.push(hasil);
          return hasil;
        });
        await setSetting('settings', { ...settings, kurs: Number(kurs) });
      }

      if (berubah.length) await saveServices(berubah);
      if (catatan.length) await simpanRiwayat(catatan);
      return res.status(200).json({ ok: true, jumlah: services.length });
    } catch (e) {
      return res.status(500).json({ error: String(e.message || e) });
    }
  }

  return res.status(405).json({ error: 'Metode tidak didukung.' });
}
