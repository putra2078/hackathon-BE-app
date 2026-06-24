# API Mapping Documentation

Berikut adalah pemetaan endpoint API untuk modul `User`, `Product`, dan `Transaction`.

## 1. User Module
**Base Path:** `/users`

| Endpoint | Method | Deskripsi | Payload / Parameter Contoh |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | Ambil semua user | - |
| `/login` | `POST` | Login user | `{"email": "user@example.com", "password": "password123"}` |
| `/register` | `POST` | Registrasi user baru | `{"name": "User Baru", "email": "user@example.com", "password": "password123"}` |
| `/:id` | `GET` | Ambil detail user | Path Parameter: `id` |
| `/` | `POST` | Buat user baru | `{"name": "Admin", "email": "admin@example.com", "password": "securepassword"}` |
| `/:id` | `PUT` | Update user | `{"name": "Admin Update", "email": "admin@example.com", "password": "newpassword"}` |
| `/:id` | `DELETE`| Hapus user | Path Parameter: `id` |

---

## 2. Product Module
**Base Path:** `/products`

| Endpoint | Method | Deskripsi | Payload / Parameter Contoh |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | Ambil semua product | - |
| `/stock` | `GET` | Ambil daftar stok product | - |
| `/stock` | `PATCH` | Update stok product (bulk) | `[{"id": "product1", "stock": 12}, {"id": "product2", "stock": 6}]` |
| `/:id` | `GET` | Ambil detail product | Path Parameter: `id` |
| `/` | `POST` | Tambah product | `{"code": "P001", "name": "Buku", "category": "Alat Tulis", "buyPrice": 5000, "sellPrice": 7000, "stock": 100}` |
| `/:id` | `PUT` | Update product | `{"name": "Buku Tulis", "sellPrice": 7500}` |
| `/:id` | `DELETE`| Hapus product | Path Parameter: `id` |

---

## 3. Transaction Module
**Base Path:** `/transactions`

| Endpoint | Method | Deskripsi | Payload / Parameter Contoh |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | Ambil semua transaksi | - |
| `/:id` | `GET` | Ambil detail transaksi | Path Parameter: `id` |
| `/` | `POST` | Buat transaksi | `{ "userId": 1, "customerName": "Budi", "totalPrice": 14000, "detail": { "totalModal": 10000, "totalProfit": 4000, "nominalPembayaran": 20000, "kembalian": 6000, "metodeBayar": "CASH", "products": [{"productId": 1, "quantity": 2}] } }` |
| `/:id` | `PUT` | Update transaksi | `{"status": "COMPLETED"}` |
| `/:id` | `DELETE`| Hapus transaksi | Path Parameter: `id` |
