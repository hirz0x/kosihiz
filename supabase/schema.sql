-- Jalankan sekali di Supabase: SQL Editor > New query > paste > Run.

create table if not exists services (
  id        text primary key,
  nama      text not null,
  kategori  text,
  rate      numeric,
  dasar     integer not null default 0,
  markup    integer not null default 0,
  min       integer,
  maks      integer,
  jenis     text,
  refill    boolean not null default false,
  batal     boolean not null default false,
  aktif     boolean not null default true
);

create table if not exists orders (
  id             text primary key,
  provider_order bigint,
  layanan_id     text,
  layanan_nama   text,
  link           text,
  jumlah         integer,
  biaya          integer,
  status         text,
  sisa           integer,
  awal           integer,
  dibuat         timestamptz,
  cek_at         timestamptz,
  selesai_at     timestamptz
);
create index if not exists orders_layanan_idx on orders (layanan_id);
create index if not exists orders_dibuat_idx on orders (dibuat desc);

create table if not exists settings (
  key   text primary key,
  value jsonb not null
);

-- Tabel terkunci dari akses publik. Hanya secret key di server yang bisa membacanya.
alter table services enable row level security;
alter table orders   enable row level security;
alter table settings enable row level security;

-- Pesanan milik akun user (ID dari Supabase Auth). Jalankan sekali setelah schema di atas.
alter table orders add column if not exists user_id text;
create index if not exists orders_user_idx on orders (user_id);

-- Profil akun: username (unik) dan saldo. Jalankan sekali.
create table if not exists profiles (
  user_id  text primary key,
  username text unique not null,
  saldo    bigint not null default 0,
  dibuat   timestamptz not null default now()
);

create table if not exists deposits (
  id           text primary key,
  user_id      text not null,
  nominal      bigint not null,
  metode       text,
  status       text not null default 'menunggu',
  dibuat       timestamptz not null default now(),
  diputuskan   timestamptz
);
create index if not exists deposits_user_idx on deposits (user_id);

alter table profiles enable row level security;
alter table deposits enable row level security;

-- Tambah saldo. Mengembalikan saldo baru.
create or replace function add_saldo(uid text, amount bigint) returns bigint
language plpgsql as $$
declare hasil bigint;
begin
  update profiles set saldo = saldo + amount where user_id = uid returning saldo into hasil;
  return hasil;
end;
$$;

-- Potong saldo hanya kalau cukup. Mengembalikan null kalau saldo tidak cukup.
create or replace function potong_saldo(uid text, amount bigint) returns bigint
language plpgsql as $$
declare hasil bigint;
begin
  update profiles set saldo = saldo - amount where user_id = uid and saldo >= amount returning saldo into hasil;
  return hasil;
end;
$$;

-- Tiket support. Pesan disimpan sebagai daftar di kolom pesan.
create table if not exists tickets (
  id bigint generated always as identity primary key,
  user_id text not null,
  username text,
  kategori text not null,
  sub text,
  order_id text,
  status text not null default 'open',
  pesan jsonb not null default '[]'::jsonb,
  user_baca boolean not null default true,
  dibuat timestamptz not null default now(),
  diupdate timestamptz not null default now()
);
create index if not exists tickets_user_idx on tickets (user_id);
alter table tickets enable row level security;

-- Refund pesanan. Saldo bertambah saat admin menyetujui.
create table if not exists refunds (
  id bigint generated always as identity primary key,
  user_id text not null,
  username text,
  pesanan text not null,
  jumlah bigint not null,
  alasan text,
  status text not null default 'menunggu',
  dibuat timestamptz not null default now(),
  diputuskan timestamptz
);
create index if not exists refunds_user_idx on refunds (user_id);
alter table refunds enable row level security;

-- Afiliasi: referral, komisi, dan penarikan komisi.
alter table profiles add column if not exists ref_by text;
alter table profiles add column if not exists komisi bigint not null default 0;
alter table profiles add column if not exists komisi_total bigint not null default 0;

create table if not exists withdrawals (
  id bigint generated always as identity primary key,
  user_id text not null,
  username text,
  jumlah bigint not null,
  tujuan text,
  status text not null default 'menunggu',
  dibuat timestamptz not null default now(),
  diputuskan timestamptz
);
create index if not exists withdrawals_user_idx on withdrawals (user_id);
alter table withdrawals enable row level security;

-- Tambah komisi. Ikut menambah total komisi yang pernah didapat.
create or replace function add_komisi(uid text, amount bigint) returns bigint
language plpgsql as $$
declare hasil bigint;
begin
  update profiles set komisi = komisi + amount, komisi_total = komisi_total + amount where user_id = uid returning komisi into hasil;
  return hasil;
end;
$$;

-- Potong komisi untuk penarikan. Null kalau komisi tidak cukup.
create or replace function potong_komisi(uid text, amount bigint) returns bigint
language plpgsql as $$
declare hasil bigint;
begin
  update profiles set komisi = komisi - amount where user_id = uid and komisi >= amount returning komisi into hasil;
  return hasil;
end;
$$;

-- Kembalikan komisi kalau penarikan ditolak.
create or replace function kembalikan_komisi(uid text, amount bigint) returns bigint
language plpgsql as $$
declare hasil bigint;
begin
  update profiles set komisi = komisi + amount where user_id = uid returning komisi into hasil;
  return hasil;
end;
$$;

-- Riwayat perubahan layanan untuk halaman Update.
create table if not exists riwayat_layanan (
  id bigint generated always as identity primary key,
  layanan_id text not null,
  tipe text not null,
  lama text,
  baru text,
  dibuat timestamptz not null default now()
);
create index if not exists riwayat_layanan_dibuat_idx on riwayat_layanan (dibuat desc);
alter table riwayat_layanan enable row level security;

-- Deposit lewat Paymenku: ID transaksi dan link pembayaran.
alter table deposits add column if not exists trx_id text;
alter table deposits add column if not exists bayar_url text;
create index if not exists deposits_trx_idx on deposits (trx_id);

-- Pindahkan komisi ke saldo untuk belanja layanan. Null kalau komisi tidak cukup.
create or replace function pindah_komisi_ke_saldo(uid text, amount bigint) returns bigint
language plpgsql as $$
declare hasil bigint;
begin
  update profiles set komisi = komisi - amount, saldo = saldo + amount where user_id = uid and komisi >= amount returning saldo into hasil;
  return hasil;
end;
$$;
