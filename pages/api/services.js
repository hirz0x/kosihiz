/* Katalog layanan: tarik dari provider, simpan di Supabase, dan atur markup. */

import { getServices, saveServices, getSetting, setSetting, getSettings } from '../../lib/store';
import { LIKEO_ID_OFFSET } from '../../lib/provider';
import { waktuPerLayanan } from '../../lib/orders';
import { catatPerubahan, simpanRiwayat } from '../../lib/riwayat';
import { decodeEntitas } from '../../lib/teks';
import { wajibAdmin, isAdmin } from '../../lib/auth';
import { sinkronKatalog } from '../../lib/katalog';
import { catatAktivitas } from '../../lib/adminLog';

export const config = { api: { bodyParser: { sizeLimit: '8mb' } } };

/* Respons untuk PELANGGAN di-cache singkat di memori. Katalognya sudah lebih dari 5.000 layanan
   aktif (~1.5MB JSON) — tanpa cache, data sebanyak itu ditarik ulang dari database DAN diproses
   ulang (decode nama, gabung rata-rata waktu selesai, dst) dari NOL di setiap request, oleh SETIAP
   pengunjung, di setiap buka halaman. Itu penyebab utama katalog kadang lambat ~6-7 detik sampai
   lewat jeda "siap" 4 detik di dashboard, bikin halaman sempat kelihatan "Belum ada layanan".
   Respons ADMIN tidak di-cache (selalu segar), dan cache langsung dikosongkan begitu admin
   menyimpan perubahan markup/status atau sinkron katalog, supaya perubahan tidak nyangkut lama. */
const CACHE_MS = 3 * 60 * 1000;
let cachePelanggan = null; // { data, sampai }

export default async function handler(req, res) {
  /* Daftar layanan. Baca bebas, karena dipakai halaman pelanggan. */
  if (req.method === 'GET') {
    try {
      const admin = isAdmin(req);
      if (!admin && cachePelanggan && Date.now() < cachePelanggan.sampai) {
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=150');
        return res.status(200).json(cachePelanggan.data);
      }
      /* Pelanggan: filter "aktif" didorong ke query Supabase-nya langsung (bukan ambil semua
         puluhan ribu baris dulu baru disaring di JS) — ribuan layanan provider lain yang sengaja
         belum diaktifkan jadi tidak perlu ditarik dari DB sama sekali, jauh lebih cepat & ringan. */
      const [services, waktu, settings, disinkron] = await Promise.all([
        getServices(admin ? undefined : { aktifOnly: true }), waktuPerLayanan(), getSettings(), getSetting('services_synced', null)
      ]);
      /* Kategori iklan/promosi dari provider disembunyikan dari katalog. Datanya tetap ada di database,
         cuma tidak ditampilkan — "Other ad | Don't use" (smmsoc) dan "LIKEO - Private ..." (Ads/Jap/Mf/
         Heysmm, dkk — kategori reseller internal likeo, bukan layanan beneran buat dijual). */
      const kategoriTersembunyi = /don.t use|private/i;
      const tampil = services.filter((s) => !kategoriTersembunyi.test(String(s.kategori || '')));
      /* "provider" (smmsoc/likeo) cuma dipakai internal — dibuang dari respons pelanggan supaya nama
         provider upstream tidak kebocor lewat tab Network (admin tetap butuh ini buat sub-tab Layanan).
         "rate" (harga asli USD dari provider) dan "batal" juga tidak pernah dipakai halaman pelanggan,
         dan "aktif" jadi redundan karena sudah difilter di query — dibuang biar respons lebih ringkas. */
      const hasil = tampil.map((s) => {
        const { provider, rate, batal, aktif, ...sisanya } = s;
        return { ...sisanya, ...(admin ? { provider, rate, batal, aktif } : {}), nama: decodeEntitas(s.nama), refill: Boolean(s.refill), ...(waktu[s.id] ? { waktuRata: waktu[s.id].rata, waktuN: waktu[s.id].n } : {}) };
      });
      const payload = { services: hasil, settings, disinkron };
      if (!admin) cachePelanggan = { data: payload, sampai: Date.now() + CACHE_MS };
      return res.status(200).json(payload);
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
      cachePelanggan = null;
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
      const kursBerubah = Number(kurs) > 0 && Number(kurs) !== settings.kurs;

      /* Kurs baru mempengaruhi layanan dari KEDUA provider (siapa pun yang punya "rate"), jadi
         perlu tarik seluruh katalog. Tapi kalau cuma markup/status aktif yang berubah — kasus yang
         jauh lebih sering, termasuk saat admin terapkan markup ke ribuan layanan likeo sekaligus —
         cukup tarik layanan dari provider yang disentuh saja, bukan ~8.000 baris kedua provider
         sekaligus cuma buat ubah markup beberapa (atau bahkan satu) provider. */
      let services;
      if (kursBerubah) {
        services = await getServices();
      } else if (Array.isArray(updates) && updates.length) {
        const providers = new Set(updates.map((u) => (Number(u.id) >= LIKEO_ID_OFFSET ? 'likeo' : 'smmsoc')));
        const hasilProvider = await Promise.all(Array.from(providers).map((p) => getServices(p)));
        services = hasilProvider.flat();
      } else {
        services = [];
      }
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
          /* Perubahan dari aksi borongan (massal) sengaja tidak dicatat ke riwayat/Update — kalau
             ribuan layanan diaktifkan/nonaktifkan sekaligus, tab Update bisa kebanjiran ribuan baris. */
          const catat = u.massal ? null : catatPerubahan(s, hasil);
          if (catat) catatan.push(catat);
          berubah.push(hasil);
          return hasil;
        });
      }

      /* Kurs baru mengubah harga dasar semua layanan yang punya rate dari provider. */
      if (kursBerubah) {
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
      if (kursBerubah) {
        await catatAktivitas('ubah_kurs', 'Kurs diubah ke Rp ' + Number(kurs).toLocaleString('id-ID'));
      }
      cachePelanggan = null;
      return res.status(200).json({ ok: true, jumlah: services.length });
    } catch (e) {
      return res.status(500).json({ error: String(e.message || e) });
    }
  }

  return res.status(405).json({ error: 'Metode tidak didukung.' });
}
