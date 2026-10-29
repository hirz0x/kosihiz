/* Membuat pesanan: cek layanan, potong saldo, kirim ke provider, lalu simpan. Dipakai oleh dashboard dan API key. */

import crypto from 'crypto';
import { getService, getOrder, saveOrders, potongSaldo, addSaldoAman, klaimIdempotensiPesanan, selesaikanIdempotensiPesanan, lepasKlaimIdempotensiPesanan } from './store';
import { callProvider, rawProviderId } from './provider';
import { peringkatUser } from './peringkat';
import { extraFieldFor, deteksiPlatform, lengkapiLink } from './layananTipe';

/* Baris 'processing' yang lebih tua dari ini di tabel order_idempotency dianggap ditinggal
   (server crash/timeout sebelum sempat menyelesaikan/melepas klaimnya) dan boleh diklaim ulang.
   Dipilih jauh di atas waktu wajar satu kali panggil provider (lib/provider.js: callProvider()
   tidak punya timeout eksplisit, jadi bisa saja berjalan sampai mendekati batas waktu eksekusi
   function serverless) -- supaya permintaan yang MASIH benar-benar berjalan (bukan crash) tidak
   pernah diklaim ulang selagi masih aktif, yang akan berarti provider dipanggil & saldo dipotong
   DUA KALI untuk permintaan yang sama. Lihat AUDIT_REPORT.md untuk alasan lengkap pemilihan nilai ini. */
const IDEMPOTENSI_STALE_MS = 60_000;

/* Hash deterministik dari isi permintaan (BUKAN dari idempotencyKey itu sendiri) -- dipakai untuk
   mendeteksi "key yang sama dipakai untuk pesanan yang berbeda" (klien lupa generate key baru
   padahal mengubah layanan/link/jumlah). Urutan field TETAP (bukan Object.keys dinamis) supaya
   hash-nya stabil terlepas dari urutan properti objek yang dikirim ke fungsi ini. */
function hashPermintaan({ service, link, jumlah, extra }) {
  const kanonik = JSON.stringify([String(service), String(link), Number(jumlah), extra == null ? null : String(extra)]);
  return crypto.createHash('sha256').update(kanonik).digest('hex');
}

export class PesananError extends Error {
  constructor(status, pesan) {
    super(pesan);
    this.status = status;
  }
}

/* Dibulatkan ke kelipatan Rp 100 terdekat — tapi kalau layanannya punya harga dasar asli (bukan
   nol), hasilnya TIDAK BOLEH ikut kebulet sampai Rp 0: itu artinya pelanggan bisa pesan jumlah
   berapa pun (termasuk jumlah maksimum) dengan biaya Rp 0, padahal provider tetap ditagih beneran.
   Ditemukan nyata di produksi: 87 layanan (smmsoc & likeo) yang harga dasarnya kecil (puluhan
   rupiah per 1000) jadi gratis total gara-gara pembulatan ini. */
export const hargaJual = (s) => {
  const h = Math.round((s.dasar * (1 + (s.markup || 0) / 100)) / 100) * 100;
  return s.dasar > 0 && h <= 0 ? 100 : h;
};

export async function buatPesanan(userId, { service, link, quantity, extra, idempotencyKey }) {
  const layanan = await getService(String(service));
  if (!layanan) throw new PesananError(400, 'Layanan tidak ada di katalog. Tarik ulang daftar layanan dulu.');
  if (!layanan.aktif) throw new PesananError(400, 'Layanan ini sedang dinonaktifkan.');
  if (!link || !String(link).trim()) throw new PesananError(400, 'Link belum diisi.');
  /* Username polos tanpa https:// (bukan URL) dulu langsung ditolak di sini — banyak pelanggan
     komplain form-nya "tidak bisa dipakai" padahal mereka cuma lupa/tidak sadar harus nambahin
     https://.../ sendiri di depan usernamenya. Dilengkapi otomatis dulu (lihat lengkapiLink di
     lib/layananTipe.js, dipakai bareng DashboardPage.jsx supaya UI dan sini konsisten) — provider
     tetap SELALU terima URL utuh seperti sebelumnya, pelanggan yang memang kirim sesuatu yang bukan
     username wajar (ada spasi, platform yang base URL-nya ambigu, dst) tetap kena pesan error ini. */
  link = lengkapiLink(link, deteksiPlatform(layanan.kategori + ' ' + layanan.nama));
  if (!/^https?:\/\//i.test(String(link).trim())) throw new PesananError(400, 'Link harus URL lengkap (diawali http:// atau https://), bukan cuma username.');

  const extraCfg = extraFieldFor(layanan.jenis);
  const extraBaris = extraCfg && extraCfg.multiline ? String(extra || '').split('\n').map((s) => s.trim()).filter(Boolean) : [];
  const extraTunggal = extraCfg && !extraCfg.multiline ? String(extra || '').trim() : '';
  if (extraCfg) {
    const kosong = extraCfg.multiline ? extraBaris.length === 0 : !extraTunggal;
    if (kosong) throw new PesananError(400, 'Kolom "' + extraCfg.label + '" belum diisi.');
    if (extraCfg.numeric && !/^\d+$/.test(extraTunggal)) {
      throw new PesananError(400, 'Kolom "' + extraCfg.label + '" harus berupa angka.');
    }
  }
  const jumlah = extraCfg && extraCfg.deriveQty ? extraBaris.length : Number(quantity);

  if (!Number.isFinite(jumlah) || jumlah <= 0) throw new PesananError(400, 'Jumlah harus angka lebih dari 0.');
  if (jumlah < layanan.min || jumlah > layanan.maks) {
    throw new PesananError(400, (extraCfg && extraCfg.deriveQty ? 'Jumlah baris' : 'Jumlah') + ' harus antara ' + layanan.min + ' dan ' + layanan.maks + '.');
  }

  /* Diskon sesuai peringkat user (Elite 3%, VIP 5%, Master 7%). */
  const { diskon } = await peringkatUser(userId);
  const biaya = Math.round(((hargaJual(layanan) * jumlah) / 1000) * (1 - (diskon || 0) / 100));

  /* Idempotency key (opsional) — HANYA dikirim form "Buat Pesanan" dashboard (lihat
     DashboardPage.jsx: submitOrder). Mass order (sendMass) dan API key reseller
     (pages/api/v1/order.js) TIDAK mengirim field ini sama sekali, jadi baris di bawah dilewati
     total untuk keduanya — nol perubahan perilaku untuk jalur-jalur itu.
     Lihat supabase/order-idempotency.sql untuk definisi RPC-nya dan AUDIT_REPORT.md untuk desain
     lengkapnya (kenapa klaim dulu baru potong saldo, kenapa dilepas/diselesaikan di titik ini,
     dll). Validasi sebelum titik ini (layanan, link, extra, jumlah) SENGAJA tetap jalan dulu
     tanpa menyentuh tabel idempotency sama sekali — permintaan yang salah input tidak perlu
     "menghabiskan" satu baris klaim, karena belum ada efek samping apa pun yang perlu dicegah
     dobel untuk kasus itu. */
  let klaim = null;
  if (idempotencyKey !== undefined && idempotencyKey !== null && idempotencyKey !== '') {
    if (typeof idempotencyKey !== 'string' || idempotencyKey.length < 8 || idempotencyKey.length > 200) {
      throw new PesananError(400, 'Idempotency key tidak valid.');
    }
    const hash = hashPermintaan({ service: String(service), link: String(link).trim(), jumlah, extra: extraCfg ? (extraCfg.multiline ? extraBaris.join('\n') : extraTunggal) : null });
    klaim = await klaimIdempotensiPesanan(userId, idempotencyKey, hash, IDEMPOTENSI_STALE_MS);
    if (klaim.hasil === 'hash_mismatch') {
      throw new PesananError(409, 'Idempotency key ini sudah dipakai untuk permintaan dengan data berbeda. Pesanan baru butuh key baru.');
    }
    if (klaim.hasil === 'processing') {
      throw new PesananError(409, 'Permintaan ini sedang diproses. Tunggu sebentar sebelum mencoba lagi — jangan kirim ulang dengan data yang sama.');
    }
    if (klaim.hasil === 'done') {
      /* Replay yang sah (klien kirim ulang permintaan yang IDENTIK, mis. karena koneksi putus
         sebelum respons pertama sampai) — kembalikan pesanan yang SUDAH ada, JANGAN buat baru.
         Saldo tidak disentuh lagi, provider tidak dipanggil lagi. */
      const pesananLama = await getOrder(klaim.order_id, userId);
      if (pesananLama) return pesananLama;
      throw new PesananError(502, 'Data pesanan sebelumnya untuk permintaan ini tidak ditemukan. Hubungi admin, jangan ulangi dengan key yang sama.');
    }
    /* klaim.hasil === 'claimed' -> lanjut proses normal di bawah. WAJIB melepas (gagal) atau
       menyelesaikan (sukses) klaim ini sebelum fungsi berakhir, lewat SEMUA jalur di bawah. */
  }

  /* ID unik buat percobaan pesanan ini — dipakai sebagai ref_id addSaldoAman kalau pengembalian
     saldo perlu terjadi di bawah (bukan id layanan, yang bisa sama untuk banyak percobaan pesanan
     berbeda dan membuat ref_id-nya tidak unik). */
  const percobaanId = 'pesanan:' + userId + ':' + Date.now() + ':' + Math.random().toString(36).slice(2, 8);
  const sisaSaldo = await potongSaldo(userId, biaya);
  if (sisaSaldo === null || sisaSaldo === undefined) {
    if (klaim) await lepasKlaimIdempotensiPesanan(userId, idempotencyKey);
    throw new PesananError(400, 'Saldo tidak cukup (butuh Rp ' + biaya.toLocaleString('id-ID') + '). Isi saldo dulu.');
  }

  const provider = layanan.provider || 'smmsoc';
  let hasil;
  try {
    hasil = await callProvider(provider, 'add', {
      service: rawProviderId(layanan),
      link: String(link).trim(),
      quantity: jumlah,
      ...(extraCfg ? { [extraCfg.param]: extraCfg.multiline ? extraBaris.join('\n') : extraTunggal } : {})
    });
    if (!hasil || !hasil.order) throw new Error('Provider tidak mengembalikan nomor pesanan.');
  } catch (err) {
    /* Pesan error mentah dari provider (mis. "Not enough funds on balance") TIDAK diteruskan ke
       pelanggan — bisa membingungkan (dikira saldo pelanggan sendiri) atau memuat istilah khas
       provider upstream. Alasan aslinya tetap dicatat di log server buat admin, bukan ke pelanggan. */
    console.error('Gagal buat pesanan ke provider', provider, '— layanan', layanan.id, ':', err && err.message ? err.message : err);
    try {
      await addSaldoAman(userId, biaya, percobaanId);
    } catch (errSaldo) {
      /* Klaim idempotency SENGAJA tidak dilepas di cabang ini -- saldo belum (atau mungkin
         sudah, tidak pasti) berhasil dikembalikan, jadi status permintaan ini masih ambigu.
         Biarkan basi dengan sendirinya (IDEMPOTENSI_STALE_MS) daripada dilepas terlalu cepat dan
         membuat retry dengan key yang sama mencoba memotong saldo sekali lagi di atas kegagalan
         yang belum jelas ini. */
      throw new PesananError(502, 'Pesanan gagal diproses provider. Saldo BELUM berhasil dikembalikan otomatis — hubungi admin untuk pengembalian manual.');
    }
    if (klaim) await lepasKlaimIdempotensiPesanan(userId, idempotencyKey);
    throw new PesananError(502, 'Pesanan gagal diproses provider. Saldo sudah dikembalikan — coba lagi sebentar lagi, atau hubungi admin kalau masih gagal.');
  }

  const pesanan = {
    id: 'SG-' + Date.now(),
    providerOrder: hasil.order,
    layananId: layanan.id,
    layananNama: layanan.nama,
    link: String(link).trim(),
    jumlah,
    biaya,
    status: 'Pending',
    dibuat: new Date().toISOString(),
    userId,
    provider
  };

  /* Titik ini KRITIS: saldo pelanggan sudah dipotong dan provider sudah terima & proses pesanan
     sungguhan (uang & pesanan di provider sudah jalan, tidak bisa dibatalkan begitu saja). Kalau
     penyimpanan ke database kita gagal (gangguan jaringan/Supabase sesaat), JANGAN kembalikan saldo
     (pesanannya nyata, bukan gagal) dan JANGAN lempar error ke pelanggan (mereka akan dikira gagal
     padahal provider sudah proses) — coba lagi beberapa kali, dan kalau tetap gagal, catat semua
     detailnya di log server supaya admin bisa masukkan manual. Pelanggan tetap dianggap sukses. */
  let tersimpan = false;
  for (let percobaan = 1; percobaan <= 3 && !tersimpan; percobaan++) {
    try {
      await saveOrders([pesanan]);
      tersimpan = true;
    } catch (err) {
      if (percobaan === 3) {
        console.error(
          'KRITIS: pesanan berhasil di provider & saldo sudah terpotong, TAPI GAGAL disimpan ke database setelah 3x percobaan — butuh dimasukkan manual.',
          JSON.stringify(pesanan), '| error:', err && err.message ? err.message : err
        );
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500 * percobaan));
      }
    }
  }
  /* Pesanan ini sudah final & sukses dari sudut pandang pelanggan di titik ini (lihat komentar
     KRITIS di atas — berlaku juga kalau saveOrders gagal 3x, pesanan tetap dianggap sukses).
     Tandai klaim idempotency SELESAI supaya replay permintaan yang sama (retry klien setelah
     koneksi putus) mengembalikan pesanan ini, bukan ditolak atau membuat pesanan baru. */
  if (klaim) await selesaikanIdempotensiPesanan(userId, idempotencyKey, pesanan.id);
  return pesanan;
}
