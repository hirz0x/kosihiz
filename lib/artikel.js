/*
 * Data awal artikel blog. Dipakai saat belum ada artikel tersimpan di database.
 * Artikel yang ditulis dari panel admin (Blog) disimpan di settings key 'artikel'.
 *
 * Format satu artikel:
 * {
 *   slug: 'cara-tingkatkan-followers',   // huruf kecil, angka, dan tanda hubung; dipakai di URL /blog/[slug]
 *   judul: 'Cara meningkatkan followers',
 *   ringkasan: 'Tips singkat untuk menambah followers secara organik.',
 *   tanggal: '2026-10-05',               // format YYYY-MM-DD
 *   isi: '## Judul bagian\n\nParagraf.\n\n- poin satu\n- poin dua',  // Markdown sederhana
 *   gambar: '',                          // foto sampul (data URL), boleh kosong
 *   terbit: true,                        // false = draf, tidak tampil di /blog
 * }
 */
export const ARTIKEL_AWAL = [];

export function cariArtikel(daftar, slug) {
  return (daftar || []).find((a) => a.slug === slug) || null;
}

/* Membersihkan dan memvalidasi daftar artikel sebelum disimpan. Melempar Error kalau ada yang tidak valid. */
export function bersihkanArtikel(daftar) {
  if (!Array.isArray(daftar)) throw new Error('Daftar artikel tidak valid.');
  const slugTerpakai = new Set();
  return daftar.map((a, i) => {
    const slug = String((a && a.slug) || '').trim().toLowerCase();
    const judul = String((a && a.judul) || '').trim();
    const ringkasan = String((a && a.ringkasan) || '').trim();
    const tanggal = String((a && a.tanggal) || '').trim();
    const isi = Array.isArray(a && a.isi) ? a.isi.join('\n\n').trim() : String((a && a.isi) || '').trim();
    const gambar = String((a && a.gambar) || '');
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug.length > 80) throw new Error('Slug artikel ' + (i + 1) + ' hanya boleh huruf kecil, angka, dan tanda hubung.');
    if (slugTerpakai.has(slug)) throw new Error('Slug "' + slug + '" dipakai lebih dari satu artikel.');
    slugTerpakai.add(slug);
    if (!judul || judul.length > 150) throw new Error('Judul artikel "' + slug + '" harus 1-150 karakter.');
    if (ringkasan.length > 300) throw new Error('Ringkasan artikel "' + slug + '" maksimal 300 karakter.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) throw new Error('Tanggal artikel "' + slug + '" harus format YYYY-MM-DD.');
    if (!isi) throw new Error('Isi artikel "' + slug + '" tidak boleh kosong.');
    if (isi.length > 60000) throw new Error('Isi artikel "' + slug + '" terlalu panjang.');
    if (gambar && (!/^data:image\/(jpeg|png|webp);base64,/.test(gambar) || gambar.length > 450000)) throw new Error('Foto artikel "' + slug + '" harus JPG, PNG, atau WEBP dan tidak lebih dari sekitar 300 KB.');
    return { slug, judul, ringkasan, tanggal, isi, gambar, terbit: a.terbit !== false };
  });
}
