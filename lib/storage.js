/* Penyimpanan file (foto sampul artikel blog) di Supabase Storage.
   Memakai SUPABASE_URL dan SUPABASE_SECRET_KEY yang sama dengan lib/store.js.
   Dipisah dari store.js karena ini memanggil endpoint Storage API, bukan REST tabel Postgres. */

function cfg() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL atau SUPABASE_SECRET_KEY belum diisi di .env.local.');
  return { url: url.replace(/\/$/, ''), key };
}

const BUCKET = 'artikel';

/* Buat bucket publik kalau belum ada. Aman dipanggil berulang kali — kalau sudah ada, diabaikan. */
export async function pastikanBucketArtikel() {
  const { url, key } = cfg();
  const r = await fetch(url + '/storage/v1/bucket', {
    method: 'POST',
    headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true })
  });
  if (r.ok) return;
  const text = await r.text();
  if (/already exists|duplicate/i.test(text)) return;
  throw new Error('Gagal membuat bucket penyimpanan: ' + text.slice(0, 200));
}

/* Unggah data URL gambar (data:image/...;base64,...) ke bucket, kembalikan URL publiknya. */
export async function unggahGambarArtikel(slug, dataUrl) {
  const m = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(dataUrl || '');
  if (!m) throw new Error('Format gambar tidak valid.');
  const mime = m[1];
  const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
  const buf = Buffer.from(m[2], 'base64');
  const { url, key } = cfg();
  const namaBersih = String(slug || 'artikel').replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'artikel';
  const path = namaBersih + '-' + Date.now() + '.' + ext;
  const r = await fetch(url + '/storage/v1/object/' + BUCKET + '/' + path, {
    method: 'POST',
    headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': mime, 'x-upsert': 'true' },
    body: buf
  });
  if (!r.ok) { const t = await r.text(); throw new Error('Unggah gambar gagal: ' + t.slice(0, 200)); }
  return url + '/storage/v1/object/public/' + BUCKET + '/' + path;
}
