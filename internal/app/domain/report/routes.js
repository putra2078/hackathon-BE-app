const express = require("express");
const router = express.Router();
const handler = require("./handler");
const authMiddleware = require("../../middleware/auth");

router.get("/sales", authMiddleware, handler.getSalesReport);
router.get("/analytics", authMiddleware, handler.getAnalytics);
router.get("/expenses", authMiddleware, handler.getExpensesReport);
router.get("/profit", authMiddleware, handler.getProfitReport);
router.get("/export", authMiddleware, handler.exportReport);

module.exports = router;
