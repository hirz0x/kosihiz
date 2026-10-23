-- RLS-02 (AUDIT_REPORT.md): kunci privilege EXECUTE semua fungsi RPC yang menyentuh saldo/komisi/
-- data sensitif ke service_role saja. Postgres memberi EXECUTE ke PUBLIC secara default untuk
-- fungsi baru kecuali di-revoke eksplisit — 5 dari 11 fungsi di supabase/schema.sql sudah di-revoke
-- (add_saldo_aman, tambah_pesan_tiket, rl_tick, rl_gagal, waktu_per_layanan), tapi 6 fungsi uang/
-- komisi lain belum (add_saldo, potong_saldo, add_komisi, potong_komisi, kembalikan_komisi,
-- pindah_komisi_ke_saldo). Diverifikasi empiris sebelumnya: anon BISA memanggil ke-6 fungsi ini
-- (HTTP 200, bukan ditolak) walau hasilnya selalu null karena RLS tabel profiles tanpa policy
-- menahan UPDATE-nya dari dalam (fungsi-fungsi ini SECURITY INVOKER, bukan DEFINER, jadi RLS
-- pemanggil ikut berlaku). Tidak tereksploitasi hari ini, tapi lapis pertahanan ini seharusnya
-- tetap ditutup — jangan diandalkan terus pada RLS tabel sebagai satu-satunya penghalang.
--
-- Diverifikasi juga (grep seluruh repo): SATU-SATUNYA pemanggil RPC di kode aplikasi adalah
-- fungsi sb() di lib/store.js, yang SELALU memakai SUPABASE_SECRET_KEY (service_role) dari server
-- — tidak ada satu pun pemanggilan RPC dari client anon/authenticated. Jadi REVOKE di bawah ini
-- aman, tidak memutus alur normal (order, deposit, refund, dll) selama semuanya tetap lewat
-- lib/store.js seperti sekarang.
--
-- File migrasi baru — TIDAK mengedit supabase/schema.sql atau fix-security.sql yang sudah ada.
-- Aman dijalankan berkali-kali (semua statement idempoten).
--
-- Cara jalankan: Supabase Dashboard -> SQL Editor -> New query -> paste seluruh file ini -> Run.
-- (Belum dijalankan ke database manapun oleh proses ini — lihat AUDIT_REPORT.md untuk urutan
-- deploy yang disarankan: isi PAYMENKU_WEBHOOK_SECRET dulu, baru migrasi ini, baru redeploy app.)

-- 1) Enam fungsi saldo/komisi yang belum punya REVOKE eksplisit.
revoke all on function public.add_saldo(text, bigint) from public, anon, authenticated;
grant execute on function public.add_saldo(text, bigint) to service_role;

revoke all on function public.potong_saldo(text, bigint) from public, anon, authenticated;
grant execute on function public.potong_saldo(text, bigint) to service_role;

revoke all on function public.add_komisi(text, bigint) from public, anon, authenticated;
grant execute on function public.add_komisi(text, bigint) to service_role;

revoke all on function public.potong_komisi(text, bigint) from public, anon, authenticated;
grant execute on function public.potong_komisi(text, bigint) to service_role;

revoke all on function public.kembalikan_komisi(text, bigint) from public, anon, authenticated;
grant execute on function public.kembalikan_komisi(text, bigint) to service_role;

revoke all on function public.pindah_komisi_ke_saldo(text, bigint) from public, anon, authenticated;
grant execute on function public.pindah_komisi_ke_saldo(text, bigint) to service_role;

-- 2) Re-apply juga untuk 5 fungsi yang schema.sql KLAIM sudah di-revoke, supaya file migrasi ini
--    mandiri (self-contained) dan tidak diam-diam bergantung urutan eksekusi dengan schema.sql.
--    Tidak mengubah apa pun kalau sudah benar — revoke/grant di Postgres idempoten.
revoke all on function public.add_saldo_aman(text, bigint, text) from public, anon, authenticated;
grant execute on function public.add_saldo_aman(text, bigint, text) to service_role;

revoke all on function public.tambah_pesan_tiket(bigint, jsonb, text, boolean) from public, anon, authenticated;
grant execute on function public.tambah_pesan_tiket(bigint, jsonb, text, boolean) to service_role;

revoke all on function public.rl_tick(text, int, bigint) from public, anon, authenticated;
grant execute on function public.rl_tick(text, int, bigint) to service_role;

revoke all on function public.rl_gagal(text, int) from public, anon, authenticated;
grant execute on function public.rl_gagal(text, int) to service_role;

revoke all on function public.waktu_per_layanan() from public, anon, authenticated;
grant execute on function public.waktu_per_layanan() to service_role;

-- 3) Default privileges: fungsi BARU yang dibuat setelah ini di schema public tidak otomatis
--    terbuka ke PUBLIC/anon/authenticated lagi — harus di-GRANT eksplisit kalau memang perlu
--    dipanggil langsung oleh client. Ini menutup celah "lupa revoke" untuk fungsi masa depan.
--    Catatan: ini hanya berlaku untuk fungsi yang dibuat OLEH ROLE YANG MENJALANKAN STATEMENT INI
--    (biasanya `postgres` di Supabase SQL Editor) — sesuai cara seluruh fungsi di schema.sql dibuat.
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;

-- 4) search_path untuk fungsi yang belum dikunci oleh supabase/fix-security.sql (yang hanya
--    menangani 6 fungsi saldo/komisi lama). Lima fungsi yang dibuat setelahnya di schema.sql belum
--    pernah dikunci search_path-nya — walau tidak satu pun SECURITY DEFINER saat ini (jadi risiko
--    search_path hijacking-nya rendah), tetap dikunci di sini sebagai defense-in-depth yang sama
--    dengan alasan fix-security.sql: kalau nanti ada yang mengubah salah satunya jadi SECURITY
--    DEFINER tanpa sadar menambahkan search_path, perlindungan ini sudah ada lebih dulu.
alter function public.add_saldo_aman(text, bigint, text) set search_path = public;
alter function public.tambah_pesan_tiket(bigint, jsonb, text, boolean) set search_path = public;
alter function public.rl_tick(text, int, bigint) set search_path = public;
alter function public.rl_gagal(text, int) set search_path = public;
alter function public.waktu_per_layanan() set search_path = public;
