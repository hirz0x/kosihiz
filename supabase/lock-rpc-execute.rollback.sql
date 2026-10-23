-- Rollback untuk supabase/lock-rpc-execute.sql — mengembalikan EXECUTE ke public/anon/authenticated
-- untuk SELURUH 11 fungsi yang direvoke migrasi itu, dan mengembalikan default privileges schema
-- public ke perilaku bawaan Postgres (fungsi baru otomatis terbuka ke PUBLIC lagi).
--
-- HANYA jalankan ini kalau migrasi lock-rpc-execute.sql ternyata mematahkan sesuatu yang sah di
-- produksi (misalnya ternyata ada pemanggil anon/authenticated yang terlewat saat audit — lihat
-- AUDIT_REPORT.md bagian "RLS-02: migrasi REVOKE RPC", grep pemanggil RPC sudah memastikan TIDAK
-- ADA pemanggil seperti itu saat migrasi ini dibuat, tapi kode bisa berubah setelahnya).
--
-- TIDAK membatalkan `alter function ... set search_path = public` dari migrasi aslinya — itu
-- pengerasan yang independen dari isu privilege EXECUTE ini (mengunci search_path tidak membuka
-- atau menutup siapa yang boleh memanggil fungsinya) dan tidak berbahaya untuk tetap terkunci.
--
-- Cara jalankan: Supabase Dashboard -> SQL Editor -> New query -> paste seluruh file ini -> Run.

begin;

-- 1) Enam fungsi saldo/komisi.
grant execute on function public.add_saldo(text, bigint) to public, anon, authenticated;
grant execute on function public.potong_saldo(text, bigint) to public, anon, authenticated;
grant execute on function public.add_komisi(text, bigint) to public, anon, authenticated;
grant execute on function public.potong_komisi(text, bigint) to public, anon, authenticated;
grant execute on function public.kembalikan_komisi(text, bigint) to public, anon, authenticated;
grant execute on function public.pindah_komisi_ke_saldo(text, bigint) to public, anon, authenticated;

-- 2) Lima fungsi yang sudah direvoke sejak lama di schema.sql (dikembalikan juga karena migrasi
--    aslinya menerapkan ulang revoke-nya; rollback ini membalik SEMUA yang migrasi itu ubah).
grant execute on function public.add_saldo_aman(text, bigint, text) to public, anon, authenticated;
grant execute on function public.tambah_pesan_tiket(bigint, jsonb, text, boolean) to public, anon, authenticated;
grant execute on function public.rl_tick(text, int, bigint) to public, anon, authenticated;
grant execute on function public.rl_gagal(text, int) to public, anon, authenticated;
grant execute on function public.waktu_per_layanan() to public, anon, authenticated;

-- 3) Kembalikan default privileges schema public ke perilaku bawaan Postgres (fungsi BARU yang
--    dibuat setelah ini otomatis terbuka ke PUBLIC lagi, seperti sebelum migrasi lock-rpc-execute.sql).
alter default privileges in schema public grant execute on functions to public, anon, authenticated;

commit;
