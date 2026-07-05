const express = require("express");
const router = express.Router();

const productRoutes = require("../domain/product/routes");
const transactionRoutes = require("../domain/transaction/routes");
const userRoutes = require("../domain/user/routes");
const categoryRoutes = require("../domain/category/routes");
const fileRoutes = require("../domain/file/routes");
const reportRoutes = require("../domain/report/routes");
const chatbotRoutes = require("../domain/chatbot/routes");

// Daftarkan route domain ke path yang sesuai
router.use("/products", productRoutes);
router.use("/transactions", transactionRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/files", fileRoutes);
router.use("/reports", reportRoutes);
router.use("/chatbot", chatbotRoutes);

module.exports = router;
