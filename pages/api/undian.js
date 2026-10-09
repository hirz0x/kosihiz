/* Undian bulanan untuk peringkat Insider ke atas. Admin menarik satu pemenang acak per bulan. */

import crypto from 'crypto';
import { getSetting, klaimSetting, semuaProfil, addSaldo } from '../../lib/store';
import { wajibAdmin } from '../../lib/auth';
import { totalBelanjaSemua, ambilPeringkat, indexPeringkat, UNDIAN_HADIAH, UNDIAN_INDEX_MIN } from '../../lib/peringkat';
import { tambahNotif } from '../../lib/notif';

/* Bulan berjalan dalam WIB, format YYYY-MM. */
const bulanIni = () => new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 7);

export default async function handler(req, res) {
  if (!wajibAdmin(req, res)) return;
  try {
    const bulan = bulanIni();
    const kunci = 'undian:' + bulan;

    if (req.method === 'GET') {
      const pemenang = await getSetting(kunci, null);
      const peserta = await pesertaUndian();
      return res.status(200).json({ bulan, hadiah: UNDIAN_HADIAH, jumlahPeserta: peserta.length, pemenang });
    }

    if (req.method === 'POST') {
      if (await getSetting(kunci, null)) return res.status(400).json({ error: 'Undian bulan ini sudah diundi.' });
      const peserta = await pesertaUndian();
      if (peserta.length === 0) return res.status(400).json({ error: 'Belum ada peserta yang memenuhi syarat (peringkat Insider ke atas).' });

      const menang = peserta[crypto.randomInt(peserta.length)];
      const pemenang = { userId: menang.userId, username: menang.username, hadiah: UNDIAN_HADIAH, dibuat: new Date().toISOString() };
      /* Klaim dulu secara atomic SEBELUM kasih hadiah — kalau dua klik hampir bersamaan, cuma satu
         yang berhasil klaim; yang satunya lagi berhenti di sini, tidak ikut nambah saldo dobel. */
      const berhasilKlaim = await klaimSetting(kunci, pemenang);
      if (!berhasilKlaim) return res.status(400).json({ error: 'Undian bulan ini sudah diundi.' });
      await addSaldo(menang.userId, UNDIAN_HADIAH);
      await tambahNotif(menang.userId, 'deposit', 'Selamat, kamu menang undian!', 'Undian bulanan Rp ' + UNDIAN_HADIAH.toLocaleString('id-ID') + ' sudah masuk ke saldo kamu.');
      return res.status(200).json({ ok: true, pemenang });
    }

    return res.status(405).json({ error: 'Metode tidak didukung.' });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}

/* Peserta: user yang peringkatnya Insider ke atas. */
async function pesertaUndian() {
  const tiers = await ambilPeringkat();
  const total = await totalBelanjaSemua();
  return (await semuaProfil())
    .filter((p) => indexPeringkat(total.get(p.user_id) || 0, tiers) >= UNDIAN_INDEX_MIN)
    .map((p) => ({ userId: p.user_id, username: p.username }));
}
