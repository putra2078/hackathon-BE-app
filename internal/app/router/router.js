const express = require("express");
const router = express.Router();

const productRoutes = require("../domain/product/routes");
const transactionRoutes = require("../domain/transaction/routes");
const userRoutes = require("../domain/user/routes");

// Daftarkan route domain ke path yang sesuai
router.use("/products", productRoutes);
router.use("/transactions", transactionRoutes);
router.use("/users", userRoutes);

module.exports = router;
