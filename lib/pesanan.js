/* Membuat pesanan: cek layanan, potong saldo, kirim ke provider, lalu simpan. Dipakai oleh dashboard dan API key. */

import { callProvider, rawProviderId } from './provider';
import { getServices, saveOrders, potongSaldo, addSaldo } from './store';
import { peringkatUser } from './peringkat';

export class PesananError extends Error {
  constructor(status, pesan) {
    super(pesan);
    this.status = status;
  }
}

export const hargaJual = (s) => Math.round((s.dasar * (1 + (s.markup || 0) / 100)) / 100) * 100;

export async function buatPesanan(userId, { service, link, quantity, comments }) {
  const layanan = (await getServices()).find((s) => s.id === String(service));
  if (!layanan) throw new PesananError(400, 'Layanan tidak ada di katalog. Tarik ulang daftar layanan dulu.');
  if (!layanan.aktif) throw new PesananError(400, 'Layanan ini sedang dinonaktifkan.');
  if (!link || !String(link).trim()) throw new PesananError(400, 'Link belum diisi.');

  /* Layanan "Custom Comments" minta teks komentar sendiri — providernya menghitung banyak baris
     komentar sebagai jumlah pesanan (dicoba & dikonfirmasi langsung ke provider: quantity dari
     field terpisah diabaikan), jadi jumlah SELALU dihitung ulang dari baris komentar di sini,
     bukan dipercaya mentah-mentah dari client. */
  const perluKomentar = /custom comment/i.test(layanan.jenis || '');
  const komentarBaris = perluKomentar ? String(comments || '').split('\n').map((s) => s.trim()).filter(Boolean) : [];
  if (perluKomentar && komentarBaris.length === 0) throw new PesananError(400, 'Komentar belum diisi.');
  const jumlah = perluKomentar ? komentarBaris.length : Number(quantity);

  if (!Number.isFinite(jumlah) || jumlah <= 0) throw new PesananError(400, 'Jumlah harus angka lebih dari 0.');
  if (jumlah < layanan.min || jumlah > layanan.maks) {
    throw new PesananError(400, (perluKomentar ? 'Jumlah baris komentar' : 'Jumlah') + ' harus antara ' + layanan.min + ' dan ' + layanan.maks + '.');
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
      ...(perluKomentar ? { comments: komentarBaris.join('\n') } : {})
    });
    if (!hasil || !hasil.order) throw new Error('Provider tidak mengembalikan nomor pesanan.');
  } catch (err) {
    await addSaldo(userId, biaya);
    throw err;
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
  await saveOrders([pesanan]);
  return pesanan;
}
