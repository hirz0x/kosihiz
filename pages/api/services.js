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
/* Vercel menjalankan banyak instance server paralel yang memorinya terpisah-pisah — tiap instance
   rawat "cacheMemori"-nya sendiri. Sebelumnya umur cache memori ini ikut disamakan dengan umur cache
   database (1 jam): begitu satu instance sempat baca data lama ke memorinya, instance itu akan terus
   nyuguhin data lama itu sampai 1 jam penuh, SAMA SEKALI tidak peduli datanya di database sudah
   dibersihkan/diperbarui (kosongkanKatalogPelanggan cuma kosongin memori instance yang nanganin
   request admin itu sendiri, bukan instance lain). Jadi tiap ada perubahan (layanan diaktif/nonaktifkan,
   markup diubah, atau kode tampilannya sendiri diperbarui), pengunjung bisa kena data beda-beda
   tergantung instance mana yang nanganin, sampai 1 jam. Cache memori dikasih umur jauh lebih pendek
   di sini (beda dari umur cache database) supaya tiap instance ngecek ulang ke database paling lambat
   semenit sekali — cache database tetap boleh berumur panjang (dibaca semua instance, bukan masalah). */
const CACHE_MEMORI_MS = 60 * 1000;
const CACHE_KEY = 'services_cache_pelanggan';
let cacheMemori = null; // { data, sampai }

async function ambilKatalogPelanggan() {
  const sekarang = Date.now();
  if (cacheMemori && sekarang < cacheMemori.sampai) return cacheMemori.data;
  const simpan = await getSetting(CACHE_KEY, null);
  if (simpan && simpan.data && simpan.sampai && sekarang < simpan.sampai) {
    cacheMemori = { data: simpan.data, sampai: sekarang + CACHE_MEMORI_MS };
    return simpan.data;
  }
  return null;
}

async function simpanKatalogPelanggan(data) {
  const sampai = Date.now() + CACHE_MS;
  cacheMemori = { data, sampai: Date.now() + CACHE_MEMORI_MS };
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
         cuma tidak ditampilkan — "Other ad | Don't use" (smmsoc) dan sejenisnya. Layanan "iklan gabung
         reseller" yang provider selipkan ke katalog beneran (bukan cuma judul kategori, misal kategori
         "LIKEO - Ads Provider" isinya 4 baris "Likeo.net [...] [Join Us] ...") sudah dinonaktifkan
         langsung di database, bukan cuma disaring di sini — kalau cuma disaring di respons ini,
         baris itu tetap bisa dipesan langsung lewat POST /api/orders (yang cuma cek "aktif"). */
      const kategoriTersembunyi = /don.t use|private/i;
      const tampil = services.filter((s) => !kategoriTersembunyi.test(String(s.kategori || '')));
      /* "provider" (smmsoc/likeo) cuma dipakai internal — dibuang dari respons pelanggan supaya nama
         provider upstream tidak kebocor lewat tab Network (admin tetap butuh ini buat sub-tab Layanan).
         "rate" (harga asli USD dari provider) dan "batal" juga tidak pernah dipakai halaman pelanggan,
         dan "aktif" jadi redundan karena sudah difilter di query — dibuang biar respons lebih ringkas.
         Sebagian kategori/nama layanan dari provider juga menyebut brand mereka sendiri apa adanya
         (mis. "LIKEO - Jap Provider", "Likeo.net [...] ...") — kalau ditampilkan mentah, nama provider
         upstream kebocor ke pelanggan walau field "provider" sudah dibuang. Dibersihkan khusus di
         respons pelanggan; admin tetap lihat teks asli supaya gampang dicocokkan ke katalog provider. */
      const PROVIDER_BRANDS = ['likeo\\.net', 'likeo', 'smmsoc\\.com', 'smmsoc'];
      const brandRe = new RegExp('\\b(?:' + PROVIDER_BRANDS.join('|') + ')\\b[\\s:–-]*', 'gi');
      const bersihkanBrand = (teks) => {
        if (!teks) return teks;
        const hasil = String(teks).replace(brandRe, '').replace(/\s{2,}/g, ' ').trim();
        return hasil || teks;
      };
      /* Sebagian kategori/nama dari smmsoc ditulis pakai huruf Unicode "gaya" (bold/fraktur/sans-serif
         dari blok Mathematical Alphanumeric Symbols, mis. "𝗥𝗘𝗙𝗜𝗟𝗟 𝗕𝘂𝘁𝘁𝗼𝗻 𝗪𝗼𝗿𝗸𝗶𝗻𝗴", "𝐍𝐄𝐖") — beda
         font/berat sama teks biasa di sekitarnya, jadi kelihatan rusak/tidak konsisten. Dikembalikan
         ke huruf ASCII biasa (bukan dihapus — isinya tetap sama, cuma tampilannya rapi). Cuma gaya yang
         beneran kepakai di katalog smmsoc yang ditangani di sini (dicek langsung dari data produksi) —
         gaya lain (kalau suatu saat muncul) dibiarkan apa adanya, lebih aman daripada salah tebak. */
      const FANCY_LETTER_BASES = [0x1D400, 0x1D56C, 0x1D5D4]; // Bold, Bold Fraktur, Sans-Serif Bold
      const FANCY_DIGIT_BASES = [0x1D7EC]; // Sans-Serif Bold
      const rapikanUnicode = (teks) => {
        if (!teks) return teks;
        return String(teks).replace(/[\u{1D400}-\u{1D7FF}]/gu, (ch) => {
          const cp = ch.codePointAt(0);
          for (const base of FANCY_LETTER_BASES) {
            if (cp >= base && cp < base + 26) return String.fromCharCode(65 + (cp - base));
            if (cp >= base + 26 && cp < base + 52) return String.fromCharCode(97 + (cp - base - 26));
          }
          for (const base of FANCY_DIGIT_BASES) {
            if (cp >= base && cp < base + 10) return String.fromCharCode(48 + (cp - base));
          }
          return ch;
        }).replace(/İ/g, 'I');
      };
      /* Badge "ᴺᴱᵂ" (huruf kapital kecil, dipakai provider sebagai penanda "baru") nempel hampir di
         semua kategori smmsoc — bukan pembeda antar layanan (banyak yang beda cuma soal ini doang
         ada/tidak ada badge-nya), jadi aman dibuang sepenuhnya di tampilan pelanggan. */
      const buangBadgeBaru = (teks) => (teks ? String(teks).replace(/\s*ᴺᴱᵂ\s*/g, ' ') : teks);
      const rapikanTeks = (teks) => {
        if (!teks) return teks;
        const hasil = buangBadgeBaru(rapikanUnicode(bersihkanBrand(teks))).replace(/\s{2,}/g, ' ').trim();
        return hasil || String(teks).trim();
      };
      /* Nama layanan dari smmsoc penuh tag "[ Max X ]" / "No Refill" / "Instant Start" yang bikin
         ramai tapi sebenarnya SUDAH ditampilkan lagi secara terpisah sebagai pill Min/Maks, Refill,
         dan waktu mulai di halaman pelanggan (lihat DashboardServices.jsx, pages/layanan/index.js).
         Cuma 3 pola yang murni duplikat itu yang dibuang di sini — tag kualitas/drop/durasi refill/
         kapasitas harian (mis. "HQ Accounts", "Non Drop", "365 Days", "Day 50K") SENGAJA dibiarkan,
         karena itu beneran beda antar varian layanan yang mirip (dan harganya ikut beda) — bukan
         sekadar hiasan. Tabel admin tidak disentuh (admin perlu nama asli apa adanya). */
      const rapikanNama = (teks) => {
        if (!teks) return teks;
        let h = String(teks)
          .replace(/\[\s*(max|min)\.?\s*[\d.,]*\s*[a-z]*\s*\]/gi, '')
          .replace(/\|?\s*no refill\s*(?:⚠️|⚠)?\s*\|?/gi, '|')
          .replace(/\|?\s*(instant start|superinstant)\s*\|?/gi, '|')
          .replace(/\[\s*\]/g, '')
          .replace(/\|\s*\|/g, '|')
          .replace(/^\s*\|\s*/, '').replace(/\s*\|\s*$/, '')
          .replace(/\s{2,}/g, ' ').trim();
        return h || String(teks).trim();
      };
      const hasil = tampil.map((s) => {
        const { provider, rate, batal, aktif, kategori, ...sisanya } = s;
        const namaDecoded = decodeEntitas(s.nama);
        return {
          ...sisanya,
          kategori: admin ? kategori : rapikanTeks(kategori),
          ...(admin ? { provider, rate, batal, aktif } : {}),
          nama: admin ? namaDecoded : rapikanNama(rapikanTeks(namaDecoded)),
          refill: Boolean(s.refill),
          ...(waktu[s.id] ? { waktuRata: waktu[s.id].rata, waktuN: waktu[s.id].n } : {})
        };
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
