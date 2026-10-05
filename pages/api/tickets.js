/* Tiket support. User membuka dan membalas tiket sendiri. Admin membalas dan menutup semua tiket. */

import { listTickets, getTicket, createTicket, updateTicket, getProfile } from '../../lib/store';
import { isAdmin } from '../../lib/auth';
import { userDariRequest } from '../../lib/account';
import { tambahNotif } from '../../lib/notif';
import { totalBelanjaSemua, ambilPeringkat, indexPeringkat } from '../../lib/peringkat';

const KATEGORI = ['order', 'service', 'payment', 'other'];
const SUB_MAKS = 40;
const PESAN_MAKS = 2000;

/* Waktu ditampilkan dalam WIB. */
const waktuWib = (iso) => new Date(new Date(iso).getTime() + 7 * 3600 * 1000).toISOString().slice(0, 16).replace('T', ' ');
const sekarangWib = () => waktuWib(new Date().toISOString());

function keKlien(t) {
  return { id: t.id, username: t.username, kategori: t.kategori, sub: t.sub, orderId: t.orderId, status: t.status, userBaca: t.userBaca, diupdate: waktuWib(t.diupdate), pesan: t.pesan };
}

export default async function handler(req, res) {
  const admin = isAdmin(req) && req.query.as !== 'user';
  const user = admin ? null : await userDariRequest(req);
  if (!admin && !user) return res.status(401).json({ error: 'Perlu login.' });

  try {
    /* Daftar tiket. Admin melihat semua, user hanya miliknya. */
    if (req.method === 'GET') {
      const daftar = await listTickets(admin ? null : user.id);
      if (!admin) return res.status(200).json({ tickets: daftar.map(keKlien) });
      /* Admin: tiket diberi tingkat peringkat pengirimnya, supaya user peringkat tinggi bisa didahulukan. */
      const tiers = await ambilPeringkat();
      const total = await totalBelanjaSemua();
      return res.status(200).json({ tickets: daftar.map((x) => ({ ...keKlien(x), tingkat: indexPeringkat(total.get(x.userId) || 0, tiers) })) });
    }

    /* User membuka tiket baru. */
    if (req.method === 'POST') {
      if (!user) return res.status(403).json({ error: 'Admin tidak membuat tiket.' });
      const { kategori, sub, orderId, pesan } = req.body || {};
      const teks = String(pesan || '').trim();
      if (!KATEGORI.includes(kategori)) return res.status(400).json({ error: 'Kategori tidak dikenal.' });
      if (!teks) return res.status(400).json({ error: 'Pesan belum diisi.' });
      if (teks.length > PESAN_MAKS) return res.status(400).json({ error: 'Pesan terlalu panjang (maks 2000 karakter).' });

      /* Lampiran disimpan di dalam pesan pertama, jadi tidak perlu kolom baru di database. */
      const lamp = req.body && req.body.lampiran;
      let lampiran = null;
      if (lamp) {
        const tipeOk = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(lamp.tipe);
        const data = String(lamp.data || '');
        if (!tipeOk || !data.startsWith('data:' + lamp.tipe + ';base64,') || data.length > 450000) {
          return res.status(400).json({ error: 'Lampiran harus JPG, PNG, WEBP, atau PDF, maksimal 300 KB.' });
        }
        lampiran = { nama: String(lamp.nama || 'lampiran').slice(0, 120), tipe: lamp.tipe, data };
      }

      const profil = await getProfile(user.id);
      const tiket = await createTicket({
        userId: user.id,
        username: profil ? profil.username : '',
        kategori,
        sub: String(sub || '').slice(0, SUB_MAKS),
        orderId: String(orderId || '').trim().slice(0, SUB_MAKS) || null,
        pesan: [{ from: 'user', text: teks, time: sekarangWib(), ...(lampiran ? { lampiran } : {}) }]
      });
      return res.status(200).json({ ticket: keKlien(tiket) });
    }

    /* Balas, tutup, atau tandai sudah dibaca. */
    if (req.method === 'PATCH') {
      const { id, aksi, text } = req.body || {};
      const t = await getTicket(String(id));
      if (!t || (!admin && t.userId !== user.id)) return res.status(404).json({ error: 'Tiket tidak ditemukan.' });

      if (aksi === 'baca') {
        if (admin) return res.status(200).json({ ticket: keKlien(t) });
        return res.status(200).json({ ticket: keKlien(await updateTicket(t.id, { userBaca: true })) });
      }

      if (t.status === 'closed') return res.status(400).json({ error: 'Tiket sudah ditutup.' });

      if (aksi === 'tutup') {
        if (!admin) return res.status(403).json({ error: 'Hanya admin yang bisa menutup tiket.' });
        return res.status(200).json({ ticket: keKlien(await updateTicket(t.id, { status: 'closed' })) });
      }

      if (aksi === 'balas') {
        const teks = String(text || '').trim();
        if (!teks) return res.status(400).json({ error: 'Balasan belum diisi.' });
        if (teks.length > PESAN_MAKS) return res.status(400).json({ error: 'Balasan terlalu panjang (maks 2000 karakter).' });
        const pesan = t.pesan.concat([{ from: admin ? 'admin' : 'user', text: teks, time: sekarangWib() }]);
        const hasil = await updateTicket(t.id, admin ? { pesan, status: 'answered', userBaca: false } : { pesan, status: 'open', userBaca: true });
        if (admin) await tambahNotif(t.userId, 'ticket', 'Balasan tiket', 'Tim support membalas tiket #' + t.id + '.');
        return res.status(200).json({ ticket: keKlien(hasil) });
      }

      return res.status(400).json({ error: 'Aksi tidak dikenal.' });
    }

    return res.status(405).json({ error: 'Metode tidak didukung.' });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
