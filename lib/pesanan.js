/* Membuat pesanan: cek layanan, potong saldo, kirim ke provider, lalu simpan. Dipakai oleh dashboard dan API key. */

import { callProvider, rawProviderId } from './provider';
import { getServices, saveOrders, potongSaldo, addSaldo } from './store';
import { peringkatUser } from './peringkat';
import { extraFieldFor } from './layananTipe';

export class PesananError extends Error {
  constructor(status, pesan) {
    super(pesan);
    this.status = status;
  }
}

export const hargaJual = (s) => Math.round((s.dasar * (1 + (s.markup || 0) / 100)) / 100) * 100;

export async function buatPesanan(userId, { service, link, quantity, extra }) {
  const layanan = (await getServices()).find((s) => s.id === String(service));
  if (!layanan) throw new PesananError(400, 'Layanan tidak ada di katalog. Tarik ulang daftar layanan dulu.');
  if (!layanan.aktif) throw new PesananError(400, 'Layanan ini sedang dinonaktifkan.');
  if (!link || !String(link).trim()) throw new PesananError(400, 'Link belum diisi.');

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
  const sisaSaldo = await potongSaldo(userId, biaya);
  if (sisaSaldo === null || sisaSaldo === undefined) {
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
    await addSaldo(userId, biaya);
    /* Pesan error mentah dari provider (mis. "Not enough funds on balance") TIDAK diteruskan ke
       pelanggan — bisa membingungkan (dikira saldo pelanggan sendiri) atau memuat istilah khas
       provider upstream. Alasan aslinya tetap dicatat di log server buat admin, bukan ke pelanggan. */
    console.error('Gagal buat pesanan ke provider', provider, '— layanan', layanan.id, ':', err && err.message ? err.message : err);
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
  return pesanan;
}
