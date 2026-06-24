# Panduan Setup dan Menjalankan Backend Service - Hackathon BE App

Repositori ini berisi backend service API yang dibangun menggunakan **Node.js**, **Express.js**, **Prisma ORM**, dan database **PostgreSQL**.

---

## 📋 Daftar Isi
1. [Prasyarat Sistem](#1-prasyarat-sistem)
2. [Langkah Instalasi Dependensi](#2-langkah-instalasi-dependensi)
3. [Konfigurasi Environment (.env)](#3-konfigurasi-environment-env)
4. [Persiapan Database PostgreSQL](#4-persiapan-database-postgresql)
5. [Konfigurasi & Migrasi Database dengan Prisma](#5-konfigurasi--migrasi-database-dengan-prisma)
6. [Cara Menjalankan Server](#6-cara-menjalankan-server)
7. [Struktur Proyek](#7-struktur-proyek)
8. [Dokumentasi API & Endpoint](#8-dokumentasi-api--endpoint)
9. [Troubleshooting (Pemecahan Masalah)](#9-troubleshooting-pemecahan-masalah)

---

## 1. Prasyarat Sistem

Sebelum memulai, pastikan perangkat Anda telah terinstal software berikut:
* **Node.js** (Versi 20 atau lebih baru)
* **npm** (Versi 10 atau lebih baru)
* **PostgreSQL** (Versi 15 atau lebih baru)

Untuk memeriksa versi yang terinstal, jalankan perintah berikut di terminal Anda:
```bash
node -v
npm -v
psql --version
```

---

## 2. Langkah Instalasi Dependensi

Masuk ke direktori utama proyek (`hackathon-BE-app`), lalu jalankan salah satu perintah di bawah ini untuk menginstal seluruh package/library yang dibutuhkan:

**Menggunakan npm:**
```bash
npm install
```

**Atau menggunakan Makefile (jika terinstal utilitas `make`):**
```bash
make install
```

Perintah di atas akan membaca file `package.json` dan mengunduh seluruh library ke dalam folder `node_modules`.

---

## 3. Konfigurasi Environment (.env)

Aplikasi membutuhkan file konfigurasi lingkungan bernama `.env` di **root directory** (direktori utama proyek). 

1. Buat file baru bernama `.env` di root directory.
2. Isi file tersebut dengan konfigurasi berikut:

```env
# Koneksi Database PostgreSQL
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<nama_database>?schema=public"

# Port untuk menjalankan server Express (Default: 3001 jika tidak diisi)
PORT=3001
```

> **Contoh Pengisian (.env):**
> Jika Anda menggunakan user PostgreSQL bawaan `postgres` dengan password `mysecretpassword`, host `localhost`, port `5432`, dan ingin membuat database bernama `hackathon_be_db`, isinya adalah:
> ```env
> DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/hackathon_be_db?schema=public"
> PORT=3001
> ```

---

## 4. Persiapan Database PostgreSQL

Pastikan server PostgreSQL Anda sudah menyala. Anda perlu membuat database kosong di PostgreSQL sebelum menjalankan migrasi Prisma.

### Cara 1: Menggunakan PostgreSQL CLI (psql)
1. Masuk ke PostgreSQL terminal:
   ```bash
   psql -U postgres
   ```
2. Buat database baru:
   ```sql
   CREATE DATABASE hackathon_be_db;
   ```
3. Keluar dari psql:
   ```sql
   \q
   ```

### Cara 2: Menggunakan GUI (pgAdmin, DBeaver, dll)
* Buat database baru dengan nama yang sesuai dengan yang Anda tentukan di `.env` (misalnya: `hackathon_be_db`).

---

## 5. Konfigurasi & Migrasi Database dengan Prisma

Karena Prisma Client di proyek ini dikonfigurasi secara khusus agar di-*generate* di folder lokal (`generated/prisma`), langkah-langkah di bawah ini sangat krusial dan wajib dilakukan secara berurutan.

### Langkah A: Generate Prisma Client (Wajib!)
Langkah ini wajib dijalankan pertama kali (dan setelah setiap perubahan pada `prisma/schema.prisma`) agar client database terbentuk secara lokal:
```bash
npx prisma generate
```
*Catatan: Tanpa menjalankan langkah ini, server Express akan gagal berjalan karena tidak menemukan modul di `../../generated/prisma`.*

### Langkah B: Jalankan Migrasi Database
Untuk menerapkan skema database (tabel-tabel seperti `users`, `products`, `transactions`, dll.) ke dalam database PostgreSQL yang telah Anda buat:

**Untuk Lingkungan Development (Lokal):**
```bash
npx prisma migrate dev
```
*Atau menggunakan Makefile:*
```bash
make migrate-dev ARGS="init_database"
```

**Untuk Lingkungan Production/Deployment:**
```bash
npx prisma migrate deploy
```

### Langkah C: Menjalankan Seed Data (Opsional)
Untuk memasukkan data awal/dummy (seperti produk awal Laptop, Keyboard, Mouse, dll.) ke dalam database agar siap digunakan untuk uji coba API:
```bash
npm run seed
```

---

## 6. Cara Menjalankan Server

Setelah instalasi dan setup database selesai, Anda dapat menjalankan server dengan cara berikut:

### Menggunakan CLI/Node secara langsung:
```bash
node cmd/main.js
```

### Menggunakan Makefile:
```bash
make start
```
*Untuk menghentikan proses server node yang berjalan di background via make:*
```bash
make stop
```

Jika server berhasil berjalan, Anda akan melihat pesan berikut di terminal Anda:
```text
🚀 Server running on http://localhost:3001
```

---

## 7. Struktur Proyek

Berikut adalah gambaran struktur folder utama dari backend service ini:

```text
.
├── cmd
│   └── main.js                    # Entry point aplikasi (konfigurasi Express & server)
├── internal
│   ├── app
│   │   ├── domain                 # Pembagian modul bisnis logic (domain-driven)
│   │   │   ├── product            # Modul Product (Routes, Service, Handler, Repository, DTO)
│   │   │   ├── transaction        # Modul Transaction
│   │   │   └── user               # Modul User (Register, Login, dll)
│   │   ├── middleware             # Middleware aplikasi (misal: auth.js untuk verifikasi JWT)
│   │   └── router                 # Router utama yang menggabungkan seluruh rute domain
│   └── pkg
│       └── prisma.js              # Inisialisasi & konfigurasi koneksi Prisma Client
├── prisma
│   ├── schema.prisma              # Skema database utama
│   ├── seed.js                    # Script seeding data dummy
│   └── migrations                 # Folder riwayat migrasi SQL
├── generated
│   └── prisma                     # Lokasi output generator Prisma Client (auto-generated)
├── logs                           # Tempat penyimpanan file log request & error
├── package.json                   # File manifest dependency & script
└── Makefile                       # Shortcut perintah terminal
```

---

## 8. Dokumentasi API & Endpoint

Semua endpoint API utama diberi prefix `/api/v1`. Berikut daftar endpoint yang dapat diakses:

### 🟢 Modul User (Base Path: `/api/v1/users`)
* `POST /api/v1/users/register` - Registrasi user/admin baru.
* `POST /api/v1/users/login` - Login untuk mendapatkan token JWT.
* `GET /api/v1/users` - Mengambil daftar seluruh user.
* `GET /api/v1/users/:id` - Mengambil detail satu user berdasarkan ID.
* `POST /api/v1/users` - Menambahkan user baru secara manual (oleh admin).
* `PUT /api/v1/users/:id` - Mengupdate data user.
* `DELETE /api/v1/users/:id` - Menghapus data user.

### 🔵 Modul Product (Base Path: `/api/v1/products`)
* `GET /api/v1/products` - Mengambil daftar seluruh produk.
* `GET /api/v1/products/stock` - Mengambil daftar stok dari semua produk.
* `PATCH /api/v1/products/stock` - Update stok secara massal (bulk) - *Memerlukan autentikasi JWT*.
* `GET /api/v1/products/:id` - Mengambil detail satu produk berdasarkan ID.
* `POST /api/v1/products` - Menambahkan produk baru.
* `PUT /api/v1/products/:id` - Mengupdate data produk yang ada.
* `DELETE /api/v1/products/:id` - Menghapus data produk.

### 🟡 Modul Transaction (Base Path: `/api/v1/transactions`)
* `GET /api/v1/transactions` - Mengambil riwayat semua transaksi.
* `GET /api/v1/transactions/:id` - Mengambil detail lengkap suatu transaksi berdasarkan ID.
* `POST /api/v1/transactions` - Membuat transaksi pembelian baru.
* `PUT /api/v1/transactions/:id` - Mengubah status transaksi.
* `DELETE /api/v1/transactions/:id` - Menghapus data transaksi.

### ⚪ Health Check & Utility
* `GET /health` - Memeriksa status keaktifan server (Menghasilkan `{ "success": true, "message": "Server is running" }`).
* `GET /` - Root endpoint welcome message.

---

## 9. Troubleshooting (Pemecahan Masalah)

### Error: `Cannot find module '../../generated/prisma'`
* **Penyebab:** Anda belum men-*generate* Prisma Client secara lokal.
* **Solusi:** Jalankan perintah `npx prisma generate` di root directory.

### Error: `DATABASE_URL is not defined in environment variables`
* **Penyebab:** Aplikasi tidak dapat menemukan file `.env` atau variabel `DATABASE_URL` di dalamnya.
* **Solusi:** Pastikan file `.env` berada tepat di root folder proyek, bukan di dalam folder `cmd` or `internal`, dan isinya sesuai format.

### Error: `Relation ... does not exist` atau error tabel PostgreSQL
* **Penyebab:** Migrasi database belum dijalankan, sehingga tabel-tabel belum terbentuk di PostgreSQL.
* **Solusi:** Pastikan database sudah terbuat di Postgres, lalu jalankan `npx prisma migrate dev`.

### Error: Seeding gagal (`prisma/seed.js` error)
* **Penyebab:** Konflik data lama atau database belum ter-migrasi secara penuh.
* **Solusi:** Jalankan `npx prisma migrate reset` terlebih dahulu untuk membersihkan database dan memulai migrasi ulang secara bersih, lalu jalankan `npm run seed`. (Catatan: Script seeding pada proyek ini telah diperbaiki agar sepenuhnya kompatibel dengan skema produk terbaru).
