/* Cek status deposit ke Paymenku, lalu kreditkan saldo kalau sudah dibayar.
   Dipakai tombol cek di dashboard, cek otomatis, dan webhook. Aman dipanggil berulang: saldo hanya bertambah sekali. */

import { ubahStatusDeposit, addSaldoAman } from './store';
import { cekTransaksi, ambilStatus, STATUS_BERHASIL, jumlahBayar } from './paymenku';
import { beriKomisi } from './affiliate';
import { hitungKredit } from './bonus';
import { tambahNotif } from './notif';

/* _cekTransaksi: parameter ke-2 opsional, cuma dipakai tes otomatis (tests/webhook-security.test.js)
   supaya bisa mensimulasikan balasan Paymenku TANPA pernah memanggil API Paymenku sungguhan — tidak
   ada pemanggil produksi (webhook, tombol cek, cek-semua) yang mengisi parameter ini, jadi perilaku
   default tidak berubah sama sekali. */
export async function cekDanKreditDeposit(deposit, _cekTransaksi = cekTransaksi) {
  if (deposit.status !== 'menunggu' || !deposit.trxId) return { status: deposit.status, paymenku: null };

  const trx = await _cekTransaksi(deposit.trxId);
  if (!trx) {
    console.error('Deposit ' + deposit.id + ': trx_id ' + deposit.trxId + ' tidak ditemukan di Paymenku — tidak dikredit.');
    return { status: 'menunggu', paymenku: null, dicurigai: true };
  }
  const paymenku = ambilStatus(trx);
  if (!STATUS_BERHASIL.includes(paymenku)) return { status: 'menunggu', paymenku };

  /* Pertahanan tambahan sebelum kredit beneran jalan: transaksi yang dibalas Paymenku harus
     benar-benar transaksi UNTUK DEPOSIT INI — reference_id dan nominal (setelah biaya QRIS, lihat
     jumlahBayar()) harus cocok persis dengan yang kita simpan sendiri saat deposit dibuat. Kalau
     salah satu tidak cocok, JANGAN kredit — mencegah kredit kalau trx_id nyasar ke transaksi lain
     (reference_id ketukar, bug di provider) walau statusnya sendiri "paid". */
  const nominalDiharapkan = jumlahBayar(deposit.nominal);
  const nominalCocok = Number(trx.amount) === nominalDiharapkan;
  const refCocok = String(trx.reference_id || '') === String(deposit.id);
  if (!nominalCocok || !refCocok) {
    console.error(
      'Deposit ' + deposit.id + ': status Paymenku "paid" tapi reference_id/nominal tidak cocok — TIDAK dikredit. ' +
      'Diharapkan ref=' + deposit.id + ' nominal=' + nominalDiharapkan + ' | dari Paymenku ref=' + trx.reference_id + ' nominal=' + trx.amount
    );
    return { status: 'menunggu', paymenku, dicurigai: true };
  }

  /* Hitung bonus sebelum status berubah, supaya deposit ini tidak ikut dihitung sebagai "sudah disetujui". */
  const kredit = await hitungKredit(deposit.userId, deposit.nominal);
  const berhasil = await ubahStatusDeposit(deposit.id, 'menunggu', 'disetujui');
  if (berhasil) {
    await addSaldoAman(deposit.userId, kredit.total, 'deposit ' + deposit.id);
    await beriKomisi(deposit.userId, deposit.nominal);
    await tambahNotif(deposit.userId, 'deposit', 'Deposit berhasil', 'Saldo bertambah Rp ' + kredit.total.toLocaleString('id-ID') + '.');
  }
  return { status: 'disetujui', paymenku };
}
