/**
 * User Routes
 * Layer ini mendefinisikan endpoint API untuk module user
 */

const express = require("express");
const router = express.Router();
const userHandler = require("./handler");

// Endpoint: [GET] /users
router.get("/", userHandler.getAll);

// Endpoint: [POST] /users/login
router.post("/login", userHandler.login);

// Endpoint: [POST] /users/register
router.post("/register", userHandler.register);

// Endpoint: [GET] /users/:id
router.get("/:id", userHandler.getById);

// Endpoint: [POST] /users
router.post("/", userHandler.create);

// Endpoint: [PUT] /users/:id
router.put("/:id", userHandler.update);

// Endpoint: [DELETE] /users/:id
router.delete("/:id", userHandler.remove);


module.exports = router;
