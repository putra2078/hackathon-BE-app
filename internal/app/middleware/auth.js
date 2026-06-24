/**
 * JWT Middleware
 * Digunakan untuk memproteksi endpoint yang membutuhkan autentikasi
 */

const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../../.env") });

const secretKey = process.env.JWT_SECRET || "your-default-secret-key";

const authMiddleware = (req, res, next) => {
  // 1. Ambil token dari header Authorization
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied, token missing",
    });
  }

  try {
    // 2. Verifikasi token
    const decoded = jwt.verify(token, secretKey);

    // 3. Simpan data user ke dalam request object
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
