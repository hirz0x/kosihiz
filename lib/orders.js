/* Pesanan: status ditarik dari provider, dan waktu selesai dicatat saat terdeteksi.
   Durasi dihitung dari waktu kita sendiri, karena provider tidak menyediakan waktu pengerjaan. */

import { callProvider } from './provider';
import { getOrders, saveOrders } from './store';

export const FINAL = ['Completed', 'Canceled', 'Refunded', 'Partial'];
const JEDA_MS = 60 * 1000;

export function menit(dari, sampai) {
  return Math.max(0, Math.round((new Date(sampai) - new Date(dari)) / 60000));
}

/* Tarik status pesanan yang belum final dan sudah lama tidak dicek. Provider menerima maksimal 100 ID per panggilan. */
export async function refreshOrders({ force = false } = {}) {
  const orders = await getOrders();
  const sekarang = Date.now();
  const kandidat = orders.filter((o) => o.providerOrder &&
    !FINAL.includes(o.status) &&
    (force || !o.cekAt || sekarang - new Date(o.cekAt).getTime() >= JEDA_MS)
  ).slice(0, 100);
  if (!kandidat.length) return { diperbarui: 0, orders };

  const hasil = await callProvider('status', { orders: kandidat.map((o) => o.providerOrder).join(',') });
  const iso = new Date(sekarang).toISOString();
  let diperbarui = 0;
  const berubah = [];
  const baru = orders.map((o) => {
    if (!kandidat.includes(o)) return o;
    const info = hasil[String(o.providerOrder)];
    const hasilBaru = (!info || info.error)
      ? { ...o, cekAt: iso }
      : (() => {
          diperbarui++;
          const status = info.status || o.status;
          return {
            ...o,
            status,
            sisa: info.remains,
            awal: info.start_count,
            cekAt: iso,
            selesaiAt: status === 'Completed' && !o.selesaiAt ? iso : o.selesaiAt
          };
        })();
    berubah.push(hasilBaru);
    return hasilBaru;
  });
  await saveOrders(berubah);
  return { diperbarui, orders: baru };
}

/* Rata-rata menit selesai per layanan, dari pesanan yang sudah tercatat selesai. */
export async function waktuPerLayanan() {
  const agg = {};
  (await getOrders()).forEach((o) => {
    if (!o.selesaiAt || !o.layananId) return;
    const m = menit(o.dibuat, o.selesaiAt);
    if (!agg[o.layananId]) agg[o.layananId] = { total: 0, n: 0 };
    agg[o.layananId].total += m;
    agg[o.layananId].n += 1;
  });
  const out = {};
  Object.keys(agg).forEach((id) => {
    out[id] = { rata: Math.round(agg[id].total / agg[id].n), n: agg[id].n };
  });
  return out;
}
