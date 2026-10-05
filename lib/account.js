/* Akun user lewat Supabase Auth. Semua panggilan dilakukan di server.
   Token disimpan di cookie httpOnly, jadi browser tidak bisa membacanya lewat JavaScript. */

const COOKIE = 'sg_user';

function cfg() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL atau SUPABASE_ANON_KEY belum diisi di .env.local.');
  return { url: url.replace(/\/$/, ''), key };
}

export async function supaAuth(path, body, token) {
  const { url, key } = cfg();
  const headers = { apikey: key, 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  const r = await fetch(url + '/auth/v1/' + path, {
    method: body === undefined ? 'GET' : 'POST',
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* bukan JSON */ }
  return { ok: r.ok, status: r.status, data };
}

function tokenDariCookie(req) {
  const raw = req.headers.cookie || '';
  const m = raw.split(';').map((c) => c.trim()).find((c) => c.startsWith(COOKIE + '='));
  return m ? decodeURIComponent(m.slice(COOKIE.length + 1)) : '';
}

/* Mengembalikan user yang sedang login, atau null. */
export async function userDariRequest(req) {
  const token = tokenDariCookie(req);
  if (!token) return null;
  const r = await supaAuth('user', undefined, token);
  if (!r.ok || !r.data || !r.data.id) return null;
  return { id: r.data.id, email: r.data.email, username: (r.data.user_metadata && r.data.user_metadata.username) || '' };
}

const COOKIE_REFRESH = 'sg_refresh';
const UMUR_INGAT = 60 * 60 * 24 * 30;
const aman = () => (process.env.NODE_ENV === 'production' ? '; Secure' : '');

/* Cookie sesi. Kalau "ingat saya" dicentang, cookie bertahan 30 hari. Kalau tidak, berakhir saat browser ditutup. */
function cookie(nama, nilai, ingat, umur) {
  const maxAge = ingat ? '; Max-Age=' + (umur || UMUR_INGAT) : '';
  return nama + '=' + encodeURIComponent(nilai) + '; Path=/; HttpOnly; SameSite=Lax' + maxAge + aman();
}

/* Daftar cookie untuk satu sesi. Dipakai juga oleh rute yang perlu menambah cookie lain sekaligus. */
export function cookieSesiLengkap(accessToken, expiresIn, refreshToken, ingat) {
  const daftar = [cookie(COOKIE, accessToken, ingat, Number(expiresIn) > 0 ? Number(expiresIn) : 3600), cookie('sg_ingat', ingat ? '1' : '0', ingat)];
  if (refreshToken) daftar.push(cookie(COOKIE_REFRESH, refreshToken, ingat));
  return daftar;
}

export function pasangSesi(res, accessToken, expiresIn, refreshToken, ingat) {
  res.setHeader('Set-Cookie', cookieSesiLengkap(accessToken, expiresIn, refreshToken, Boolean(ingat)));
}

export function hapusSesi(res) {
  res.setHeader('Set-Cookie', [COOKIE, COOKIE_REFRESH, 'sg_ingat'].map((n) => n + '=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0' + aman()));
}

export function ingatDariRequest(req) {
  const raw = req.headers.cookie || '';
  return raw.split(';').map((c) => c.trim()).includes('sg_ingat=1');
}

/* Hapus akun auth (dipakai kalau pembuatan profil gagal). Memakai secret key, hanya di server. */
export async function hapusAkunAuth(uid) {
  const url = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const secret = process.env.SUPABASE_SECRET_KEY || '';
  if (!url || !secret) return;
  await fetch(url + '/auth/v1/admin/users/' + encodeURIComponent(uid), {
    method: 'DELETE',
    headers: { apikey: secret, Authorization: 'Bearer ' + secret }
  });
}

/* Token akses user dari cookie, untuk dipakai ke Supabase saat user mengubah akunnya sendiri. */
export function tokenUser(req) {
  return tokenDariCookie(req);
}

/* Ubah data akun user (password atau email). Memakai token user, jadi hanya bisa mengubah akunnya sendiri. */
export async function supaUbahAkun(body, token) {
  const { url, key } = cfg();
  const r = await fetch(url + '/auth/v1/user', {
    method: 'PUT',
    headers: { apikey: key, 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(body)
  });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* bukan JSON */ }
  return { ok: r.ok, status: r.status, data };
}

/* Permintaan umum ke Supabase Auth (GET, POST, DELETE) dengan token user opsional. */
export async function supaReq(method, path, body, token) {
  const { url, key } = cfg();
  const headers = { apikey: key, 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  const r = await fetch(url + '/auth/v1/' + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* bukan JSON */ }
  return { ok: r.ok, status: r.status, data };
}
