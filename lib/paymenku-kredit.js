/* Cek status deposit ke Paymenku, lalu kreditkan saldo kalau sudah dibayar.
   Dipakai tombol cek di dashboard, cek otomatis, dan webhook. Aman dipanggil berulang: saldo hanya bertambah sekali. */

import { ubahStatusDeposit, addSaldoAman, listDeposits } from './store';
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

/* Jalur pemulihan untuk deposit yang kehabisan notifikasi webhook yang valid — misalnya kalau
   Paymenku me-retry callback dengan X-PaymenKu-Timestamp yang sudah lebih dari 5 menit (ditolak
   401 oleh timestampFresh() di pages/api/paymenku/webhook.js, SENGAJA, supaya notifikasi lama
   yang bocor tidak bisa diputar ulang; lihat komentar di sana), atau kalau notifikasinya memang
   tidak pernah sampai sama sekali (gangguan jaringan, dll). Deposit seperti ini tetap "menunggu"
   selamanya di database kalau user sendiri tidak pernah membuka dashboard / klik "cek status" lagi
   (lihat pages/api/deposits/cek.js, cek-semua.js — keduanya cuma mengecek deposit milik user yang
   sedang login).

   Fungsi ini mengecek ULANG langsung ke API Paymenku (bukan percaya webhook/retry apa pun) lewat
   cekDanKreditDeposit() yang SAMA dipakai webhook asli — jadi kredit tetap lewat CAS yang sama
   (ubahStatusDeposit menunggu->disetujui) dan tetap aman dipanggil berulang/bersamaan. uid=null
   mengecek SEMUA user (dipakai admin & cron); uid diisi untuk membatasi ke satu user saja.

   Tiga batas tambahan supaya SATU pemanggilan tidak bisa membebani API Paymenku atau database
   tanpa batas (penting khusus untuk uid=null yang bisa menyasar ribuan baris kalau tidak dibatasi):
   - `batas`: jumlah MAKSIMUM deposit yang dicek dalam satu pemanggilan (default 10, dipakai jalur
     user single-check; admin/cron pakai 50 — lihat pemanggilnya).
   - `maksUsiaMs`: deposit `menunggu` yang lebih tua dari ini (default 24 jam) DILEWATI, tidak ikut
     dicek/dihitung ke `batas`. Invoice QRIS Paymenku sendiri kedaluwarsa jauh lebih cepat dari 24
     jam, jadi deposit `menunggu` yang sudah seumur itu nyaris pasti sudah mati di sisi Paymenku —
     terus-menerus mengeceknya cuma membebani API tanpa hasil. (Tidak menghapus/mengubah apa pun,
     cuma tidak diikutkan ke pengecekan otomatis — tetap bisa dicek manual lewat tombol per-deposit.)
   - `jedaMs`: jeda (delay) antar panggilan ke `cekDanKreditDeposit()` → API Paymenku dalam satu
     pemanggilan (default 0 = tanpa jeda, dipakai jalur user yang `batas`-nya sudah kecil; admin/
     cron pakai 300ms — lihat pemanggilnya) — mencegah satu pemanggilan ini sendiri menembak API
     Paymenku beruntun tanpa jeda sampai puluhan kali dalam hitungan detik. */
function tunggu(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function cekSemuaDepositPending({ uid = null, batas = 10, maksUsiaMs = 24 * 60 * 60 * 1000, jedaMs = 0 } = {}) {
  const sekarang = Date.now();
  const menunggu = (await listDeposits(uid))
    .filter((d) => d.status === 'menunggu' && d.trxId && sekarang - new Date(d.dibuat).getTime() < maksUsiaMs)
    .slice(0, batas);
  let disetujui = 0;
  for (let i = 0; i < menunggu.length; i++) {
    if (i > 0 && jedaMs > 0) await tunggu(jedaMs);
    try {
      const hasil = await cekDanKreditDeposit(menunggu[i]);
      if (hasil.status === 'disetujui') disetujui += 1;
    } catch (e) {
      /* Satu deposit gagal dicek (mis. timeout API Paymenku) tidak menghentikan yang lain. */
    }
  }
  return { dicek: menunggu.length, disetujui };
}
