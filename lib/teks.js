/* Mengembalikan karakter dari entitas HTML yang kadang dikirim provider, misalnya "&amp;" menjadi "&". */

const ENTITAS = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#039;': "'", '&apos;': "'" };

export function decodeEntitas(teks) {
  let s = String(teks == null ? '' : teks);
  for (let i = 0; i < 3; i++) {
    const sebelum = s;
    s = s.replace(/&(amp|lt|gt|quot|apos|#39|#039);/g, (m) => ENTITAS[m] || m);
    if (s === sebelum) break;
  }
  return s;
}
