/* Katalog layanan: tarik dari provider, simpan di Supabase, dan atur markup. */

import { getServices, saveServices, getSetting, setSetting, getSettings } from '../../lib/store';
import { waktuPerLayanan } from '../../lib/orders';
import { catatPerubahan, simpanRiwayat } from '../../lib/riwayat';
import { decodeEntitas } from '../../lib/teks';
import { wajibAdmin } from '../../lib/auth';
import { sinkronKatalog } from '../../lib/katalog';
import { catatAktivitas } from '../../lib/adminLog';

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
      const provider = (req.body && req.body.provider) || 'smmsoc';
      const hasil = await sinkronKatalog({ provider, kursOverride: req.body && req.body.kurs });
      await catatAktivitas('sinkron_katalog', provider + ': ' + hasil.jumlah + ' layanan (' + hasil.baru + ' baru), kurs ' + hasil.kurs);
      return res.status(200).json(hasil);
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
      if (Array.isArray(updates) && updates.length) {
        await catatAktivitas('ubah_layanan', updates.length + ' layanan diubah (markup/status aktif)');
      }
      if (Number(kurs) > 0 && Number(kurs) !== settings.kurs) {
        await catatAktivitas('ubah_kurs', 'Kurs diubah ke Rp ' + Number(kurs).toLocaleString('id-ID'));
      }
      return res.status(200).json({ ok: true, jumlah: services.length });
    } catch (e) {
      return res.status(500).json({ error: String(e.message || e) });
    }
  }

  return res.status(405).json({ error: 'Metode tidak didukung.' });
}
