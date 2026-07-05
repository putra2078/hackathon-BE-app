# Panduan Build, Run & Penggunaan API

Dokumen ini berisi panduan untuk melakukan build, menjalankan service, serta cara menggunakan API.

## Prasyarat
Pastikan Anda telah menginstal berikut di sistem Anda:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Konfigurasi Environment
Sebelum menjalankan service, pastikan Anda memiliki file `.env` di direktori root proyek. Anda dapat menyalin file contoh (jika ada) dan menyesuaikannya:

```bash
cp .env.example .env
# Edit file .env sesuai dengan konfigurasi database dan service Anda
```

## Menggunakan API
### Autentikasi
Untuk mengakses endpoint yang diproteksi, Anda harus menyertakan token JWT pada header `Authorization` dengan format:

```
Authorization: Bearer <your_jwt_token>
```

### Token Refresh (Soft Refresh)
Sistem menggunakan mekanisme *soft-refresh* pada middleware. Jika token yang Anda kirimkan akan kedaluwarsa dalam waktu kurang dari 15 menit, server akan secara otomatis menghasilkan token baru dan mengirimkannya kembali melalui header respon `Authorization`.

Pastikan klien Anda selalu memeriksa header `Authorization` pada setiap respon API dan memperbarui token yang disimpan jika header tersebut ada.

## Menjalankan Service dengan Docker Compose

Cara termudah untuk menjalankan service ini adalah dengan menggunakan `docker-compose`.

### 1. Build dan Jalankan (Background)
Perintah ini akan membangun image Docker dan menjalankan kontainer di background:

```bash
docker-compose up -d --build
```

### 2. Melihat Log
Untuk memantau log dari kontainer backend:

```bash
docker-compose logs -f backend
```

### 3. Menghentikan Service
Untuk menghentikan dan menghapus kontainer:

```bash
docker-compose down
```

### 4. Menjalankan Ulang (Rebuild)
Jika Anda melakukan perubahan pada kode atau Dockerfile, lakukan rebuild dengan perintah:

```bash
docker-compose up -d --build
```

---
*Catatan: Jika service membutuhkan migrasi database, pastikan Anda menjalankan perintah migrasi melalui Prisma di dalam kontainer jika belum diotomatisasi, atau jalankan perintah migrasi dari host jika Anda memiliki koneksi langsung ke database.*


