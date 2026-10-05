import { NextResponse } from 'next/server';

/* Perpanjang sesi user otomatis sebelum access token habis, memakai refresh token dari cookie. */
export const config = { matcher: ['/((?!_next/|favicon).*)'] };

const SISA_MS = 5 * 60 * 1000;
const UMUR_INGAT = 60 * 60 * 24 * 30;

function akanHabis(token) {
  try {
    const b = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const p = JSON.parse(atob(b));
    return !p.exp || p.exp * 1000 - Date.now() < SISA_MS;
  } catch (e) {
    return true;
  }
}

export async function middleware(req) {
  const refresh = req.cookies.get('sg_refresh')?.value;
  const token = req.cookies.get('sg_user')?.value;
  if (!refresh || (token && !akanHabis(token))) return NextResponse.next();

  const url = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const key = process.env.SUPABASE_ANON_KEY || '';
  if (!url || !key) return NextResponse.next();

  const res = NextResponse.next();
  const ingat = req.cookies.get('sg_ingat')?.value === '1';
  const opsi = { path: '/', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' };
  try {
    const r = await fetch(url + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { apikey: key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh })
    });
    if (!r.ok) {
      res.cookies.delete('sg_user');
      res.cookies.delete('sg_refresh');
      res.cookies.delete('sg_ingat');
      return res;
    }
    const d = await r.json();
    res.cookies.set('sg_user', d.access_token, { ...opsi, maxAge: ingat ? d.expires_in || 3600 : undefined });
    res.cookies.set('sg_refresh', d.refresh_token, { ...opsi, maxAge: ingat ? UMUR_INGAT : undefined });
    res.cookies.set('sg_ingat', ingat ? '1' : '0', { ...opsi, maxAge: ingat ? UMUR_INGAT : undefined });
  } catch (e) {
    /* Gagal memperpanjang: permintaan tetap jalan dengan sesi yang ada. */
  }
  return res;
}
