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

export const MARKUP_MIN = 0;
export const MARKUP_MAKS = 500;

/* Respons untuk PELANGGAN di-cache. Katalognya sudah lebih dari 5.000 layanan aktif (~1.5MB JSON)
   — tanpa cache, data sebanyak itu ditarik ulang dari database DAN diproses ulang (decode nama,
   gabung rata-rata waktu selesai, dst) dari NOL di setiap request, oleh SETIAP pengunjung, di
   setiap buka halaman. Itu penyebab utama katalog kadang lambat 6-7 detik sampai lewat jeda "siap"
   4 detik di dashboard, bikin halaman sempat kelihatan "Belum ada layanan".

   Cache-nya DUA lapis, bukan cuma di memori satu proses — Vercel menjalankan beberapa instance
   server yang terpisah memorinya, dan instance yang baru "bangun" (cold start, atau kalau jeda
   antar kunjungan agak lama) tidak ikut kebagian cache memori instance lain, jadi kalau cuma
   diingat di memori, pengunjung tetap sering kena jalur lambat lagi. Lapis pertama (memori) cepat
   tapi cuma berlaku di instance yang sama; lapis kedua (tabel settings di database) dibagi SEMUA
   instance, jadi instance manapun yang kena tetap dapat jalan pintas.

   Respons ADMIN tidak pernah di-cache (selalu segar), dan cache langsung dikosongkan begitu admin
   menyimpan perubahan markup/status atau sinkron katalog, supaya perubahan tidak nyangkut lama —
   jadi batas waktu di bawah ini aman diperpanjang jauh (bukan risiko data basi), cuma soal berapa
   lama cache "boleh dipakai" sebelum dianggap kedaluwarsa kalau TIDAK ada perubahan sama sekali.
   Sebelumnya 3 menit: kalau jeda antar kunjungan lebih lama dari itu (wajar di jam sepi), pengunjung
   berikutnya kebagian rebuild ulang dari nol (~6-7 detik) walau datanya sama sekali tidak berubah.
   Diperpanjang ke 1 jam supaya itu jauh lebih jarang kejadian. */
const CACHE_MS = 60 * 60 * 1000;
const CACHE_KEY = 'services_cache_pelanggan';
let cacheMemori = null; // { data, sampai }

async function ambilKatalogPelanggan() {
  const sekarang = Date.now();
  if (cacheMemori && sekarang < cacheMemori.sampai) return cacheMemori.data;
  const simpan = await getSetting(CACHE_KEY, null);
  if (simpan && simpan.data && simpan.sampai && sekarang < simpan.sampai) {
    cacheMemori = { data: simpan.data, sampai: simpan.sampai };
    return simpan.data;
  }
  return null;
}

async function simpanKatalogPelanggan(data) {
  const sampai = Date.now() + CACHE_MS;
  cacheMemori = { data, sampai };
  await setSetting(CACHE_KEY, { data, sampai });
}

async function kosongkanKatalogPelanggan() {
  cacheMemori = null;
  await setSetting(CACHE_KEY, { data: null, sampai: 0 });
}

export default async function handler(req, res) {
  /* Daftar layanan. Baca bebas, karena dipakai halaman pelanggan. */
  if (req.method === 'GET') {
    try {
      const admin = isAdmin(req);
      if (!admin) {
        const cached = await ambilKatalogPelanggan();
        if (cached) {
          res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=150');
          return res.status(200).json(cached);
        }
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
      if (!admin) await simpanKatalogPelanggan(payload);
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
      await kosongkanKatalogPelanggan();
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

      /* Batas markup: 0-500% (keputusan admin, lihat AUDIT_REPORT.md temuan DANGER-03). Ditolak
         semua (bukan dipotong diam-diam) kalau ada satu saja yang di luar batas — supaya admin
         tahu persis input mana yang salah, bukan tiba-tiba angkanya beda dari yang diketik. */
      if (Array.isArray(updates)) {
        const invalid = updates.filter((u) => u.markup !== undefined && (!Number.isFinite(Number(u.markup)) || Number(u.markup) < MARKUP_MIN || Number(u.markup) > MARKUP_MAKS));
        if (invalid.length) {
          return res.status(400).json({
            error: 'Markup harus angka antara ' + MARKUP_MIN + '% dan ' + MARKUP_MAKS + '%. Layanan bermasalah: ' +
              invalid.slice(0, 5).map((u) => '#' + u.id + ' (' + u.markup + '%)').join(', ') + (invalid.length > 5 ? ', dan ' + (invalid.length - 5) + ' lainnya' : '') + '.'
          });
        }
      }

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
            markup: u.markup === undefined ? s.markup : Math.min(MARKUP_MAKS, Math.max(MARKUP_MIN, Number(u.markup) || 0)),
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
      await kosongkanKatalogPelanggan();
      return res.status(200).json({ ok: true, jumlah: services.length });
    } catch (e) {
      return res.status(500).json({ error: String(e.message || e) });
    }
  }

  return res.status(405).json({ error: 'Metode tidak didukung.' });
}
