-- Memperbaiki peringatan "Function Search Path Mutable" di Security Advisor.
-- Fungsi dikunci ke schema public, jadi tidak bisa dibelokkan lewat search_path.
-- Jalankan di Supabase: SQL Editor -> New query -> Run.

alter function public.add_saldo(uid text, amount bigint) set search_path = public;
alter function public.potong_saldo(uid text, amount bigint) set search_path = public;
alter function public.add_komisi(uid text, amount bigint) set search_path = public;
alter function public.potong_komisi(uid text, amount bigint) set search_path = public;
alter function public.kembalikan_komisi(uid text, amount bigint) set search_path = public;
alter function public.pindah_komisi_ke_saldo(uid text, amount bigint) set search_path = public;
