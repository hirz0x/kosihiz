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

-- Log aktivitas admin: jejak tindakan penting (setuju/tolak refund & deposit, ubah markup/kurs,
-- sinkron katalog, login admin, dll) untuk akuntabilitas. Jalankan sekali.
create table if not exists admin_log (
  id bigint generated always as identity primary key,
  aksi text not null,
  detail text,
  dibuat timestamptz not null default now()
);
create index if not exists admin_log_dibuat_idx on admin_log (dibuat desc);
alter table admin_log enable row level security;

-- Provider kedua (likeo.net). ID layanannya disimpan dengan offset supaya tidak bentrok
-- dengan ID smmsoc — kolom ini cuma menandai baris itu milik provider yang mana.
alter table services add column if not exists provider text not null default 'smmsoc';
alter table orders   add column if not exists provider text not null default 'smmsoc';
create index if not exists services_provider_idx on services (provider);
create index if not exists orders_provider_idx on orders (provider);

-- Cegah satu pesanan direfund dobel kalau tombol "Ajukan/Refund" diklik dua kali hampir
-- bersamaan (atau dua request paralel) — pengecekan di kode saja (baca dulu baru tulis) punya
-- celah race condition. Index unique parsial ini jadi penjaga terakhir di level database:
-- cuma boleh ada SATU baris refund aktif (bukan "ditolak") per pesanan.
create unique index if not exists refunds_pesanan_aktif_idx on refunds (pesanan) where status <> 'ditolak';

-- Rata-rata menit penyelesaian per layanan, dihitung di database lewat agregasi SQL, bukan tarik
-- SELURUH tabel orders ke Node lalu diagregasi di JS (lib/orders.js waktuPerLayanan). Dipanggil
-- tiap kali katalog layanan dimuat — termasuk halaman depan & katalog PUBLIK (bukan cuma dashboard
-- yang login) — jadi harus tetap murah walau tabel orders sudah sangat besar.
create index if not exists orders_layanan_selesai_idx on orders (layanan_id) where selesai_at is not null;
create or replace function waktu_per_layanan()
returns table(layanan_id text, rata bigint, n bigint)
language sql stable as $$
  select layanan_id,
         round(avg(extract(epoch from (selesai_at - dibuat)) / 60)::numeric)::bigint as rata,
         count(*)::bigint as n
  from orders
  where selesai_at is not null and layanan_id is not null
  group by layanan_id;
$$;
-- Defense-in-depth: fungsi ini aman dipanggil publik sekarang (RLS tabel orders tanpa policy
-- apa pun menolak semua baris untuk role anon/authenticated, jadi hasilnya selalu kosong), tapi
-- dibatasi eksplisit di sini juga supaya tetap aman kalau suatu saat RLS orders berubah.
revoke execute on function waktu_per_layanan() from public, anon, authenticated;
grant execute on function waktu_per_layanan() to service_role;

-- Ledger idempoten untuk penambahan saldo (refund/deposit/undian/pengembalian pesanan gagal).
-- addSaldoAman (lib/store.js) sebelumnya cuma retry RPC add_saldo kalau gagal — tapi kalau yang
-- gagal cuma KONEKSINYA setelah transaksi sebenarnya sukses commit di database (realistis untuk
-- fungsi serverless yang nyambung ke Supabase lintas region), retry itu bisa menambah saldo DUA
-- KALI untuk satu transaksi yang sama. ref_id di sini + transaksi tunggal per pemanggilan RPC
-- memastikan satu transaksi logis cuma pernah menambah saldo SATU KALI, berapa kali pun RPC-nya
-- dipanggil ulang dengan ref_id yang sama.
create table if not exists saldo_log (
  ref_id text primary key,
  uid text not null,
  amount bigint not null,
  dibuat timestamptz not null default now()
);
alter table saldo_log enable row level security;

create or replace function add_saldo_aman(p_uid text, p_amount bigint, p_ref_id text) returns bigint
language plpgsql as $$
declare hasil bigint; klaim text;
begin
  insert into saldo_log (ref_id, uid, amount) values (p_ref_id, p_uid, p_amount)
    on conflict (ref_id) do nothing
    returning ref_id into klaim;
  if klaim is null then
    /* ref_id ini sudah pernah diklaim & dieksekusi sebelumnya (pemanggilan ini adalah retry) —
       jangan nambah saldo lagi, cukup kembalikan saldo saat ini apa adanya. */
    select saldo into hasil from profiles where user_id = p_uid;
    return hasil;
  end if;
  update profiles set saldo = saldo + p_amount where user_id = p_uid returning saldo into hasil;
  return hasil;
end;
$$;
revoke execute on function add_saldo_aman(text, bigint, text) from public, anon, authenticated;
grant execute on function add_saldo_aman(text, bigint, text) to service_role;

-- Balas tiket sebelumnya baca kolom "pesan" (array jsonb) di Node, tambah satu pesan di JS, lalu
-- tulis ulang SELURUH array — read-modify-write tanpa penjaga. Dua balasan yang hampir bersamaan
-- (mis. admin klik kirim dua kali cepat lewat script yang melewati tombol, atau admin & pelanggan
-- membalas bersamaan) bisa saling menimpa, salah satu balasan hilang diam-diam dari riwayat tiket.
-- Fungsi ini menambah pesan secara ATOMIC lewat operator jsonb "||" langsung di satu UPDATE,
-- tidak pernah baca-dulu-baru-tulis, jadi tidak ada celah race di tengahnya.
-- Perbaikan: p_id sebelumnya salah dideklarasikan "text", padahal kolom tickets.id itu bigint —
-- "where id = p_id" gagal dengan error "No operator matches the given name and argument types"
-- (ketahuan pas verifikasi langsung ke produksi). Overload lama (parameter text) dihapus dulu
-- supaya tidak nyangkut jadi fungsi duplikat yang bikin PostgREST bingung pilih yang mana.
drop function if exists tambah_pesan_tiket(text, jsonb, text, boolean);
create or replace function tambah_pesan_tiket(p_id bigint, p_pesan_baru jsonb, p_status text, p_user_baca boolean)
returns setof tickets
language plpgsql as $$
begin
  return query
  update tickets
  set pesan = pesan || p_pesan_baru,
      status = coalesce(p_status, status),
      user_baca = coalesce(p_user_baca, user_baca),
      diupdate = now()
  where id = p_id
  returning *;
end;
$$;
revoke execute on function tambah_pesan_tiket(bigint, jsonb, text, boolean) from public, anon, authenticated;
grant execute on function tambah_pesan_tiket(bigint, jsonb, text, boolean) to service_role;

-- Pembatas percobaan (rate limit) sebelumnya dihitung di kode JS lewat baca-lalu-tulis biasa
-- (getSetting lalu setSetting) — kalau beberapa request datang BERSAMAAN, semuanya sempat baca
-- angka yang sama sebelum ada yang menulis balik, jadi limiternya bisa ditembus total. Dibuktikan
-- nyata: 15 percobaan pendaftaran konkuren dari 1 IP, yang seharusnya dibatasi 5/jam, 15-15nya
-- lolos. Dipindah jadi fungsi database atomic (SELECT ... FOR UPDATE mengunci barisnya dulu),
-- supaya percobaan yang datang bersamaan diproses berurutan, bukan semuanya baca nilai basi.
create or replace function rl_tick(p_key text, p_maks int, p_jendela_ms bigint)
returns boolean
language plpgsql as $$
declare
  v_key text := 'coba:' || p_key;
  v_now bigint := (extract(epoch from now()) * 1000)::bigint;
  v_n int;
  v_mulai bigint;
begin
  insert into settings (key, value) values (v_key, jsonb_build_object('n', 0, 'mulai', 0))
  on conflict (key) do nothing;

  select (value->>'n')::int, (value->>'mulai')::bigint into v_n, v_mulai
  from settings where key = v_key for update;

  if v_mulai = 0 or v_now - v_mulai > p_jendela_ms then
    v_n := 0;
    v_mulai := v_now;
  end if;
  v_n := v_n + 1;

  update settings set value = jsonb_build_object('n', v_n, 'mulai', v_mulai) where key = v_key;
  return v_n <= p_maks;
end;
$$;
revoke execute on function rl_tick(text, int, bigint) from public, anon, authenticated;
grant execute on function rl_tick(text, int, bigint) to service_role;

-- Sama seperti rl_tick, versi untuk penguncian setelah N kali gagal berturut-turut (login, ganti
-- password/email, verifikasi MFA) dengan durasi kunci yang berlipat ganda tiap kelipatan gagal.
create or replace function rl_gagal(p_key text, p_kelipatan int)
returns void
language plpgsql as $$
declare
  v_key text := 'batas:' || p_key;
  v_now bigint := (extract(epoch from now()) * 1000)::bigint;
  v_gagal int;
  v_sampai bigint;
begin
  insert into settings (key, value) values (v_key, jsonb_build_object('gagal', 0, 'sampai', 0))
  on conflict (key) do nothing;

  select (value->>'gagal')::int, (value->>'sampai')::bigint into v_gagal, v_sampai
  from settings where key = v_key for update;

  v_gagal := v_gagal + 1;
  if v_gagal % p_kelipatan = 0 then
    v_sampai := v_now + least(15 * 60000 * power(2, least(v_gagal / p_kelipatan - 1, 6)), 24 * 60 * 60000)::bigint;
  end if;

  update settings set value = jsonb_build_object('gagal', v_gagal, 'sampai', v_sampai) where key = v_key;
end;
$$;
revoke execute on function rl_gagal(text, int) from public, anon, authenticated;
grant execute on function rl_gagal(text, int) to service_role;
