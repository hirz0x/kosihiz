/* Peringkat berdasarkan total belanja. Batas minimal disimpan admin di settings (kunci "peringkat").
   Nama, keuntungan, bonus deposit, dan diskon tetap di sini. */

import { getSetting, getOrders } from './store';

export const UNDIAN_HADIAH = 500000;
/* Undian hanya untuk peringkat ke-3 ke atas (Insider). */
export const UNDIAN_INDEX_MIN = 2;

export const PERINGKAT_DEFAULT = [
  { nama: 'Starter', min: 0, bonus: 10, diskon: 0, benefit: ['Support 24/7 lewat tiket', 'Bonus deposit 10% setiap deposit'] },
  { nama: 'Junior', min: 1500000, bonus: 10, diskon: 0, benefit: ['Support 24/7 lewat tiket', 'Bonus deposit 10% setiap deposit'] },
  { nama: 'Insider', min: 7500000, bonus: 10, diskon: 0, benefit: ['Semua keuntungan level sebelumnya', 'Undian bulanan Rp 500.000'] },
  { nama: 'Elite', min: 37500000, bonus: 10, diskon: 3, benefit: ['Diskon 3% untuk semua layanan', 'Semua keuntungan level sebelumnya', 'Prioritas pengerjaan pesanan', 'Support tiket prioritas'] },
  { nama: 'VIP', min: 150000000, bonus: 10, diskon: 5, benefit: ['Diskon 5% untuk semua layanan', 'Semua keuntungan level sebelumnya', 'Request layanan custom', 'Support tiket super prioritas'] },
  { nama: 'Master', min: 375000000, bonus: 10, diskon: 7, benefit: ['Diskon 7% untuk semua layanan', 'Semua keuntungan level sebelumnya', 'Channel support pribadi'] }
];

/* Gabungkan batas yang disimpan admin dengan nama, bonus, diskon, dan keuntungan dari kode. */
export async function ambilPeringkat() {
  const simpan = await getSetting('peringkat', null);
  return PERINGKAT_DEFAULT.map((d, i) => {
    const min = simpan && Array.isArray(simpan) && simpan[i] && Number.isFinite(Number(simpan[i].min)) ? Number(simpan[i].min) : d.min;
    return { nama: d.nama, min, bonus: d.bonus, diskon: d.diskon, benefit: d.benefit };
  });
}

/* Urutan peringkat (0 = Starter) untuk total belanja tertentu. */
export function indexPeringkat(total, tiers) {
  let idx = 0;
  tiers.forEach((t, i) => { if (total >= t.min) idx = i; });
  return idx;
}

/* Total belanja SEMUA user (pesanan yang tidak dibatalkan) — cuma dipakai buat kebutuhan yang
   benar-benar perlu data semua orang sekaligus (mis. undian bulanan, cari peserta yang memenuhi
   syarat). Jangan dipakai buat hitung peringkat satu user saja, pakai totalBelanjaUser di bawah. */
export async function totalBelanjaSemua() {
  const per = new Map();
  for (const o of await getOrders()) {
    if (o.status === 'Canceled' || !(o.biaya > 0) || !o.userId) continue;
    per.set(o.userId, (per.get(o.userId) || 0) + o.biaya);
  }
  return per;
}

/* Total belanja SATU user — query-nya difilter per user_id di database, bukan ambil pesanan
   semua orang lalu disaring di JS. Dipakai di buatPesanan (lib/pesanan.js), jadi dipanggil tiap
   kali ada yang checkout — penting ini tetap murah walau jumlah pesanan di seluruh sistem sudah besar. */
export async function totalBelanjaUser(userId) {
  let total = 0;
  for (const o of await getOrders(userId)) {
    if (o.status === 'Canceled' || !(o.biaya > 0)) continue;
    total += o.biaya;
  }
  return total;
}

/* Peringkat satu user: urutan, nama, bonus deposit, dan diskon belanja. */
export async function peringkatUser(userId) {
  const tiers = await ambilPeringkat();
  const total = await totalBelanjaUser(userId);
  const index = indexPeringkat(total, tiers);
  return { index, nama: tiers[index].nama, bonus: tiers[index].bonus, diskon: tiers[index].diskon, total };
}
