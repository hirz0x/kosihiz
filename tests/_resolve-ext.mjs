/* Loader hook KHUSUS untuk tes mock (tests/order-flow-mock.test.mjs) — TIDAK dipakai aplikasi
   atau build apa pun. lib/*.js di proyek ini memakai import relatif TANPA ekstensi (gaya bundler
   Next.js/webpack, mis. `from './store'`), yang sah untuk Next.js tapi Node ESM native menolaknya
   (wajib '.js' eksplisit). Hook ini HANYA menambahkan '.js' kalau resolusi pertama gagal karena
   file tidak ditemukan — tidak mengubah apa pun di source code asli, cuma membantu loader Node
   menemukan file yang sama yang sudah webpack temukan setiap hari lewat `next dev`/`next build`. */
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (specifier.startsWith('.') && !/\.[a-z]+$/i.test(specifier)) {
      return await nextResolve(specifier + '.js', context);
    }
    throw err;
  }
}
