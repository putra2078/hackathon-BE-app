/**
 * Category Routes
 * Layer ini mendefinisikan endpoint API untuk module category
 */

const express = require("express");
const router = express.Router();
const categoryHandler = require("./handler");
const JWTMiddleware = require("../../../pkg/middleware/jwt");

// Apply JWT Middleware to all routes in this module
router.use(JWTMiddleware);

// Endpoint: [GET] /categories
router.get("/", categoryHandler.getAll);

// Endpoint: [GET] /categories/:id
router.get("/:id", categoryHandler.getById);

// Endpoint: [POST] /categories
router.post("/", categoryHandler.create);

// Endpoint: [PUT] /categories/:id
router.put("/:id", categoryHandler.update);

// Endpoint: [DELETE] /categories/:id
router.delete("/:id", categoryHandler.remove);

module.exports = router;
