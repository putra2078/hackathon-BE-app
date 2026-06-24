/**
 * Product Routes
 * Layer ini mendefinisikan endpoint API untuk module product
 */

const express = require("express");
const router = express.Router();
const productHandler = require("./handler");
const authMiddleware = require("../middleware/auth");

// Endpoint: [GET] /products
// Deskripsi: Mengambil semua daftar product
router.get("/", productHandler.getAll);

// Endpoint: [GET] /products/stock
// Deskripsi: Mengambil daftar stok product
router.get("/stock", productHandler.getStock);

// Endpoint: [PATCH] /products/stock
// Deskripsi: Mengupdate stok product secara bulk
router.patch("/stock", authMiddleware, productHandler.patchStock);
...
// Endpoint: [GET] /products/:id
// Deskripsi: Mengambil detail satu product berdasarkan ID
router.get("/:id", productHandler.getById);

// Endpoint: [POST] /products
// Deskripsi: Menambahkan product baru
router.post("/", productHandler.create);

// Endpoint: [PUT] /products/:id
// Deskripsi: Mengupdate data product yang sudah ada
router.put("/:id", productHandler.update);

// Endpoint: [DELETE] /products/:id
// Deskripsi: Menghapus data product
router.delete("/:id", productHandler.remove);

module.exports = router;
