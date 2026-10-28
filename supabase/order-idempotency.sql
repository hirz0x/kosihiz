-- Idempotency key untuk pembuatan pesanan dashboard (lihat lib/pesanan.js: buatPesanan(),
-- klaimIdempotensiPesanan() di lib/store.js). TIDAK mengubah tabel `orders` sama sekali — ini
-- tabel baru, terpisah, berdiri sendiri. Mengikuti pola file migrasi yang sudah ada di repo ini
-- (supabase/lock-rpc-execute.sql): disiapkan di sini, TIDAK dijalankan otomatis oleh kode apa pun,
-- BELUM dijalankan ke database manapun oleh sesi ini. Jalankan manual lewat Supabase Dashboard
-- (SQL Editor → paste seluruh isi file → Run) kalau sudah siap deploy. Lihat AUDIT_REPORT.md
-- bagian "Idempotency key pembuatan pesanan" untuk prasyarat, cara verifikasi, dan rollback.

begin;

-- Satu baris per percobaan pembuatan pesanan yang disertai idempotency key (dikirim dari
-- DashboardPage.jsx, opsional — lihat lib/pesanan.js). Mass order dan API key reseller
-- (pages/api/v1/order.js) TIDAK mengirim key ini sama sekali, jadi tidak pernah menyentuh
-- tabel ini — baris di sini HANYA ada untuk percobaan dari form "Buat Pesanan" dashboard.
create table if not exists order_idempotency (
  user_id          text not null,
  idempotency_key  text not null,
  request_hash     text not null,
  status           text not null default 'processing', -- 'processing' | 'done' | 'failed'
  order_id         text references orders(id) on delete set null,
  dibuat           timestamptz not null default now(),
  diupdate         timestamptz not null default now()
);

-- Kunci utama logis: SATU baris per (user, key). Inilah yang membuat INSERT kedua dengan
-- (user_id, idempotency_key) yang sama GAGAL dengan unique_violation di database — jaminan
-- terakhir di level database, bukan cuma pengecekan di kode (sama persis alasannya dengan
-- refunds_pesanan_aktif_idx yang sudah ada).
create unique index if not exists order_idempotency_key_idx on order_idempotency (user_id, idempotency_key);

-- Untuk pembersihan berkala di masa depan (baris 'done'/'failed' yang sudah lama) — BELUM ada
-- job yang menghapusnya otomatis di sesi ini (lihat catatan "Tidak dikerjakan" di AUDIT_REPORT.md).
create index if not exists order_idempotency_dibuat_idx on order_idempotency (dibuat);

-- Tabel baru → RLS aktif + NOL policy sejak awal, konsisten dengan SELURUH tabel lain di schema
-- ini (profiles/orders/deposits/dst). anon/authenticated tidak bisa baca/tulis baris apa pun;
-- hanya service_role (dipakai lib/store.js lewat SUPABASE_SECRET_KEY) yang bisa.
alter table order_idempotency enable row level security;

-- Klaim satu idempotency key secara ATOMIC. Dipanggil SEBELUM saldo dipotong/provider dihubungi
-- (lihat lib/pesanan.js). Pola "INSERT ... exception when unique_violation ... lalu SELECT ...
-- FOR UPDATE" ini persis contoh resmi Postgres untuk race "insert-or-select" yang aman dari
-- race condition (https://www.postgresql.org/docs/current/plpgsql-control-structures.html,
-- bagian "Trapping Errors") — SELECT ... FOR UPDATE mengunci baris itu, jadi request KEDUA yang
-- datang BERSAMAAN untuk key yang sama WAJIB menunggu request pertama commit duluan sebelum ikut
-- membaca baris itu. Itulah yang menjamin dua request konkuren dengan key sama TIDAK PERNAH
-- dua-duanya mengira dirinya "yang pertama mengklaim".
--
-- Hasil (kolom `hasil`):
--   'claimed'       -> key ini milik pemanggil sekarang. Lanjutkan proses normal (potong saldo,
--                      panggil provider, simpan pesanan), lalu WAJIB panggil
--                      selesaikan_idempotensi_pesanan() (sukses) atau hapus barisnya (gagal) --
--                      lihat lib/store.js: selesaikanIdempotensiPesanan()/lepasKlaimIdempotensiPesanan().
--   'processing'    -> ada percobaan LAIN untuk key yang sama yang masih berjalan & belum basi
--                      (umur < p_stale_ms). Tolak (409) -- jangan proses dua kali.
--   'done'          -> key ini SUDAH selesai sebelumnya dengan sukses. `order_id` berisi pesanan
--                      yang sudah ada -- pemanggil WAJIB mengembalikan pesanan itu (bukan buat baru).
--   'hash_mismatch' -> key yang sama dipakai untuk permintaan dengan ISI BERBEDA (layanan/link/
--                      jumlah/extra tidak sama dengan percobaan pertama key ini). Tolak (409) --
--                      ini bukan replay yang sah, klien harus pakai key baru untuk pesanan baru.
--
-- p_stale_ms: baris 'processing' yang lebih tua dari ini dianggap TERTINGGAL (proses sebelumnya
-- crash sebelum sempat menyelesaikan/melepas klaim) -- diklaim ULANG (bukan ditolak selamanya),
-- supaya satu kegagalan server tidak mengunci key itu permanen. Nilai yang dipakai pemanggil
-- (lihat lib/pesanan.js) sengaja diset JAUH di atas waktu wajar satu kali panggil provider,
-- supaya permintaan yang MASIH benar-benar berjalan (provider lambat merespons, bukan crash)
-- tidak pernah diklaim ulang sementara masih aktif.
create or replace function klaim_idempotensi_pesanan(
  p_user_id text,
  p_key text,
  p_hash text,
  p_stale_ms bigint
)
returns table(hasil text, order_id text)
language plpgsql as $$
declare
  baris order_idempotency;
begin
  loop
    begin
      insert into order_idempotency (user_id, idempotency_key, request_hash, status, dibuat, diupdate)
      values (p_user_id, p_key, p_hash, 'processing', now(), now());
      return query select 'claimed'::text, null::text;
      return;
    exception when unique_violation then
      -- Key sudah ada (baris lain) -- lanjut ke pengecekan di bawah, bukan dianggap error.
      null;
    end;

    select * into baris from order_idempotency
     where user_id = p_user_id and idempotency_key = p_key
     for update;

    if baris is null then
      -- Baris yang bikin unique_violation di atas sempat dihapus pihak lain (jalur gagal ->
      -- lepasKlaimIdempotensiPesanan) tepat sebelum SELECT ini sempat jalan -- ulang dari awal.
      continue;
    end if;

    -- Hash dicek DULU, SEBELUM status -- kalau tidak, key yang sudah 'done' tapi dipakai ulang
    -- dengan payload BERBEDA akan lolos lewat cabang 'done' di bawah dan diam-diam mengembalikan
    -- order_id LAMA, padahal seharusnya ditolak hash_mismatch (replay yang sah HARUS payload-nya
    -- identik, bukan cuma key-nya). Ditemukan saat audit, bukan skenario yang sudah teruji --
    -- lihat AUDIT_REPORT.md.
    if baris.request_hash <> p_hash then
      return query select 'hash_mismatch'::text, null::text;
      return;
    end if;

    if baris.status = 'done' then
      return query select 'done'::text, baris.order_id;
      return;
    end if;

    if baris.status = 'processing' and baris.diupdate > now() - make_interval(secs => p_stale_ms / 1000.0) then
      return query select 'processing'::text, null::text;
      return;
    end if;

    -- Baris 'processing' basi (ditinggal proses yang crash) ATAU 'failed' sebelumnya -- klaim ulang.
    update order_idempotency
       set status = 'processing', request_hash = p_hash, order_id = null, diupdate = now()
     where user_id = p_user_id and idempotency_key = p_key;
    return query select 'claimed'::text, null::text;
    return;
  end loop;
end;
$$;

-- Defense-in-depth sama seperti seluruh fungsi RPC sensitif lain di schema ini (lihat RLS-02 di
-- AUDIT_REPORT.md) -- fungsi ini SECURITY INVOKER (bukan DEFINER), jadi UPDATE/INSERT di dalamnya
-- tetap tunduk RLS pemanggil (RLS tabel order_idempotency aktif+nol policy di atas sudah menahan
-- anon/authenticated), tapi EXECUTE privilege dikunci juga di sini supaya tidak bergantung HANYA
-- pada RLS sebagai satu-satunya lapis pertahanan.
revoke all on function klaim_idempotensi_pesanan(text, text, text, bigint) from public, anon, authenticated;
grant execute on function klaim_idempotensi_pesanan(text, text, text, bigint) to service_role;
alter function klaim_idempotensi_pesanan(text, text, text, bigint) set search_path = public;

revoke all on order_idempotency from public, anon, authenticated;
grant all on order_idempotency to service_role;

commit;
