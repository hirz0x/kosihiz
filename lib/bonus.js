/* Bonus deposit: persen sesuai peringkat user, berlaku untuk setiap deposit yang disetujui. */

import { peringkatUser } from './peringkat';

/* Saldo yang masuk ke user untuk deposit ini. */
export async function hitungKredit(userId, nominal) {
  const { bonus: persen } = await peringkatUser(userId);
  const bonus = Math.floor((nominal * persen) / 100);
  return { total: nominal + bonus, bonus, persen };
}
