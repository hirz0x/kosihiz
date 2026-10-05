import { supaAuth, pasangSesi, hapusAkunAuth } from '../../../lib/account';
import { getProfileByUsername, createProfile } from '../../../lib/store';
import { ambilIp, bolehCoba } from '../../../lib/loginGuard';

/* Username: 3-20 karakter, huruf kecil, angka, titik, atau garis bawah. Tidak boleh memakai nama yang dicadangkan. */
const POLA_USERNAME = /^[a-z0-9_.]{3,20}$/;
const DICADANGKAN = ["admin", "administrator", "sosmedgo", "support", "api", "root", "system", "login", "register", "dashboard"];

export function cekUsername(u) {
  const s = String(u || "").trim().toLowerCase();
  if (!POLA_USERNAME.test(s)) return { ok: false, error: "Username 3-20 karakter: huruf kecil, angka, titik, atau garis bawah." };
  if (s.startsWith(".") || s.endsWith(".") || s.includes("..")) return { ok: false, error: "Username tidak boleh diawali, diakhiri, atau berisi titik berurutan." };
  if (DICADANGKAN.includes(s)) return { ok: false, error: "Username itu tidak bisa dipakai." };
  return { ok: true, username: s };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST.' });
  /* Batas pendaftaran per IP: 5 per jam, supaya tidak ada yang membuat akun massal. */
  if (!(await bolehCoba('daftar_ip:' + ambilIp(req), 5, 60 * 60 * 1000))) {
    return res.status(429).json({ error: 'Terlalu banyak pendaftaran dari jaringan ini. Coba lagi nanti.' });
  }
  const { username, email, password, confirm } = req.body || {};
  if (!username || !email || !password) return res.status(400).json({ error: 'Username, email, dan kata sandi wajib diisi.' });
  const cek = cekUsername(username);
  if (!cek.ok) return res.status(400).json({ error: cek.error });
  if (String(password).length < 8) return res.status(400).json({ error: 'Kata sandi minimal 8 karakter.' });
  if (password !== confirm) return res.status(400).json({ error: 'Konfirmasi kata sandi tidak sama.' });

  if (await getProfileByUsername(cek.username)) return res.status(400).json({ error: 'Username itu sudah dipakai.' });

  const r = await supaAuth('signup', {
    email: String(email).trim(),
    password: String(password),
    data: { username: cek.username }
  });
  if (!r.ok) {
    const pesan = (r.data && (r.data.error_description || r.data.msg || r.data.message)) || 'Gagal mendaftar.';
    return res.status(400).json({ error: pesan });
  }
  const uid = (r.data && (r.data.user ? r.data.user.id : r.data.id)) || null;
  if (uid) {
    try {
      const ref = String(req.body.ref || '').trim().toLowerCase();
      const pengajak = ref && ref !== cek.username ? await getProfileByUsername(ref) : null;
      await createProfile(uid, cek.username, pengajak ? ref : null);
    } catch (e) {
      await hapusAkunAuth(uid);
      return res.status(400).json({ error: 'Gagal membuat profil: ' + String(e.message || e) });
    }
  }

  /* Kalau konfirmasi email aktif, belum ada sesi dan user harus klik link di email dulu. */
  if (r.data && r.data.access_token) {
    pasangSesi(res, r.data.access_token, r.data.expires_in, r.data.refresh_token, false);
    return res.status(200).json({ ok: true });
  }
  return res.status(200).json({ ok: true, perluKonfirmasi: true });
}
