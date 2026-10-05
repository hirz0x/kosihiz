/* Membuat pesanan: cek layanan, potong saldo, kirim ke provider, lalu simpan. Dipakai oleh dashboard dan API key. */

import { callProvider } from './provider';
import { getServices, saveOrders, potongSaldo, addSaldo } from './store';
import { peringkatUser } from './peringkat';

export class PesananError extends Error {
  constructor(status, pesan) {
    super(pesan);
    this.status = status;
  }
}

export const hargaJual = (s) => Math.round((s.dasar * (1 + (s.markup || 0) / 100)) / 100) * 100;

export async function buatPesanan(userId, { service, link, quantity }) {
  const jumlah = Number(quantity);
  const layanan = (await getServices()).find((s) => s.id === String(service));
  if (!layanan) throw new PesananError(400, 'Layanan tidak ada di katalog. Tarik ulang daftar layanan dulu.');
  if (!layanan.aktif) throw new PesananError(400, 'Layanan ini sedang dinonaktifkan.');
  if (!link || !String(link).trim()) throw new PesananError(400, 'Link belum diisi.');
  if (!Number.isFinite(jumlah) || jumlah <= 0) throw new PesananError(400, 'Jumlah harus angka lebih dari 0.');
  if (jumlah < layanan.min || jumlah > layanan.maks) {
    throw new PesananError(400, 'Jumlah harus antara ' + layanan.min + ' dan ' + layanan.maks + '.');
  }

  /* Diskon sesuai peringkat user (Elite 3%, VIP 5%, Master 7%). */
  const { diskon } = await peringkatUser(userId);
  const biaya = Math.round(((hargaJual(layanan) * jumlah) / 1000) * (1 - (diskon || 0) / 100));
  const sisaSaldo = await potongSaldo(userId, biaya);
  if (sisaSaldo === null || sisaSaldo === undefined) {
    throw new PesananError(400, 'Saldo tidak cukup (butuh Rp ' + biaya.toLocaleString('id-ID') + '). Isi saldo dulu.');
  }

  let hasil;
  try {
    hasil = await callProvider('add', { service: layanan.id, link: String(link).trim(), quantity: jumlah });
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
    userId
  };
  await saveOrders([pesanan]);
  return pesanan;
}
