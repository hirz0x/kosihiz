-- Aktifkan Row Level Security untuk semua tabel aplikasi.
-- Aplikasi mengakses tabel lewat SUPABASE_SECRET_KEY di sisi server (lib/store.js), dan kunci itu melewati RLS.
-- Akses dengan kunci anon atau kunci publik ke tabel jadi ditolak, sementara fitur aplikasi tetap jalan.
-- Jalankan di Supabase: SQL Editor -> New query -> Run.

alter table public.services enable row level security;
alter table public.orders enable row level security;
alter table public.settings enable row level security;
alter table public.profiles enable row level security;
alter table public.deposits enable row level security;
alter table public.tickets enable row level security;
alter table public.refunds enable row level security;
alter table public.withdrawals enable row level security;
alter table public.riwayat_layanan enable row level security;
