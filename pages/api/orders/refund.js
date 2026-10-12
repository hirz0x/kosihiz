/* Refund langsung dari admin untuk pesanan yang dibatalkan atau selesai sebagian. User tidak perlu mengajukan dulu.
 * Jumlahnya dihitung dengan cara yang sama seperti refund dari user. Saldo langsung bertambah. */

import { getOrder, listRefunds, createRefund, ubahStatusRefund, getProfile, addSaldoAman } from '../../../lib/store';
import { wajibAdmin } from '../../../lib/auth';
import { tambahNotif } from '../../../lib/notif';
import { catatAktivitas } from '../../../lib/adminLog';

const STATUS_REFUND = ['Canceled', 'Partial'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metode tidak didukung.' });
  if (!wajibAdmin(req, res)) return;

  const id = String((req.body && req.body.id) || '');
  if (!id) return res.status(400).json({ error: 'ID pesanan tidak valid.' });

  try {
    const pesanan = await getOrder(id);
    if (!pesanan) return res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
    if (!STATUS_REFUND.includes(pesanan.status)) {
      return res.status(400).json({ error: 'Refund hanya untuk pesanan yang dibatalkan atau selesai sebagian.' });
    }
    if (!(pesanan.biaya > 0) || !(pesanan.jumlah > 0)) return res.status(400).json({ error: 'Biaya pesanan tidak tercatat.' });

    const sisa = pesanan.sisa === null || pesanan.sisa === undefined
      ? (pesanan.status === 'Canceled' ? pesanan.jumlah : 0)
      : Number(pesanan.sisa);
    const jumlah = Math.round((pesanan.biaya * Math.min(sisa, pesanan.jumlah)) / pesanan.jumlah);
    if (!(jumlah > 0)) return res.status(400).json({ error: 'Tidak ada sisa jumlah yang bisa direfund.' });

    /* Pesanan yang sudah pernah direfund tidak boleh direfund dua kali. */
    const sudahAda = (await listRefunds(pesanan.userId)).find((r) => r.pesanan === id && r.status !== 'ditolak');
    if (sudahAda) return res.status(400).json({ error: 'Pesanan ini sudah pernah direfund atau sedang diajukan.' });

    const profil = await getProfile(pesanan.userId);
    let refund;
    try {
      refund = await createRefund({
        userId: pesanan.userId,
        username: profil ? profil.username : '',
        pesanan: id,
        jumlah,
        alasan: 'Refund dari admin'
      });
    } catch (e) {
      if (e.duplikat) return res.status(400).json({ error: e.message });
      throw e;
    }
    const berhasil = await ubahStatusRefund(refund.id, 'menunggu', 'disetujui');
    if (!berhasil) return res.status(502).json({ error: 'Refund dibuat tapi gagal disetujui. Cek tab Refund.' });

    await addSaldoAman(pesanan.userId, jumlah, 'refund ' + id);
    await tambahNotif(pesanan.userId, 'order', 'Refund disetujui', 'Refund pesanan ' + id + ' sudah masuk ke saldo.');
    await catatAktivitas('refund_langsung', 'Pesanan ' + id + ' (' + (profil ? profil.username : pesanan.userId) + ') · Rp ' + jumlah.toLocaleString('id-ID'));
    return res.status(200).json({ ok: true, jumlah });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
