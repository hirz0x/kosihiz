/* Login admin: username dan kata sandi dari .env.local. Cookie sesi berisi token turunan dari keduanya.
   Ganti username atau kata sandi = semua sesi lama otomatis tidak berlaku. */

import crypto from 'crypto';

const COOKIE = 'sg_admin';
const DURASI_DETIK = 8 * 60 * 60;

function tokenFor(username, password) {
  return crypto.createHmac('sha256', password).update('admin-session:' + username).digest('hex');
}

function sama(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function adminTerkonfigurasi() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);
}

/* Kedua pembandingan selalu dijalankan, supaya waktu balasan tidak membocorkan username yang benar. */
export function cekLoginAdmin(username, password) {
  const userOk = sama(username, process.env.ADMIN_USERNAME || '');
  const pwOk = sama(password, process.env.ADMIN_PASSWORD || '');
  return userOk && pwOk;
}

export function isAdmin(req) {
  if (!adminTerkonfigurasi()) return false;
  const raw = req.headers.cookie || '';
  const m = raw.split(';').map((c) => c.trim()).find((c) => c.startsWith(COOKIE + '='));
  if (!m) return false;
  return sama(decodeURIComponent(m.slice(COOKIE.length + 1)), tokenFor(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD));
}

export function pasangCookie(res) {
  const aman = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const token = tokenFor(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
  res.setHeader('Set-Cookie', COOKIE + '=' + token + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=' + DURASI_DETIK + aman);
}

export function hapusCookie(res) {
  res.setHeader('Set-Cookie', COOKIE + '=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
}

/* Untuk rute API: kembalikan false dan kirim 401 kalau bukan admin. */
export function wajibAdmin(req, res) {
  if (isAdmin(req)) return true;
  res.status(401).json({ error: 'Perlu login admin.' });
  return false;
}
