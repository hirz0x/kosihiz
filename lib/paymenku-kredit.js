/* Cek status deposit ke Paymenku, lalu kreditkan saldo kalau sudah dibayar.
   Dipakai tombol cek di dashboard, cek otomatis, dan webhook. Aman dipanggil berulang: saldo hanya bertambah sekali. */

import { ubahStatusDeposit, addSaldo } from './store';
import { cekTransaksi, ambilStatus, STATUS_BERHASIL } from './paymenku';
import { beriKomisi } from './affiliate';
import { hitungKredit } from './bonus';
import { tambahNotif } from './notif';

export async function cekDanKreditDeposit(deposit) {
  if (deposit.status !== 'menunggu' || !deposit.trxId) return { status: deposit.status, paymenku: null };

  const paymenku = ambilStatus(await cekTransaksi(deposit.trxId));
  if (!STATUS_BERHASIL.includes(paymenku)) return { status: 'menunggu', paymenku };

  /* Hitung bonus sebelum status berubah, supaya deposit ini tidak ikut dihitung sebagai "sudah disetujui". */
  const kredit = await hitungKredit(deposit.userId, deposit.nominal);
  const berhasil = await ubahStatusDeposit(deposit.id, 'menunggu', 'disetujui');
  if (berhasil) {
    await addSaldo(deposit.userId, kredit.total);
    await beriKomisi(deposit.userId, deposit.nominal);
    await tambahNotif(deposit.userId, 'deposit', 'Deposit berhasil', 'Saldo bertambah Rp ' + kredit.total.toLocaleString('id-ID') + '.');
  }
  return { status: 'disetujui', paymenku };
}
