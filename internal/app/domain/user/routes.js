/**
 * User Routes
 * Layer ini mendefinisikan endpoint API untuk module user
 */

const express = require("express");
const router = express.Router();
const userHandler = require("./handler");
const JWTMiddleware = require("../../../pkg/middleware/jwt");

// Public routes
router.post("/login", userHandler.login);
router.post("/register", userHandler.register);
router.post("/refresh", userHandler.refresh);

// Apply JWT Middleware to protected routes
router.use(JWTMiddleware);

// Protected routes
router.get("/", userHandler.getAll);
router.get("/:id", userHandler.getById);
router.post("/", userHandler.create);
router.put("/:id", userHandler.update);
router.delete("/:id", userHandler.remove);

module.exports = router;
