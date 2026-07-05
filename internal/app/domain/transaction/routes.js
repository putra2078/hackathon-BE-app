/**
 * Transaction Routes
 * Layer ini mendefinisikan endpoint API untuk module transaction
 */

const express = require("express");
const router = express.Router();
const transactionHandler = require("./handler");
const JWTMiddleware = require("../../../pkg/middleware/jwt");

// Apply JWT Middleware to all routes in this module
router.use(JWTMiddleware);

// Endpoint: [GET] /transactions
// Deskripsi: Mengambil semua daftar transaksi
router.get("/", transactionHandler.getAll);

// Endpoint: [GET] /transactions/:id
// Deskripsi: Mengambil detail satu transaksi berdasarkan ID
router.get("/:id", transactionHandler.getById);

// Endpoint: [POST] /transactions
// Deskripsi: Menambahkan transaksi baru
router.post("/", transactionHandler.create);

// Endpoint: [PUT] /transactions/:id
// Deskripsi: Mengupdate data transaksi yang sudah ada
router.put("/:id", transactionHandler.update);

// Endpoint: [DELETE] /transactions/:id
// Deskripsi: Menghapus data transaksi
router.delete("/:id", transactionHandler.remove);

module.exports = router;
