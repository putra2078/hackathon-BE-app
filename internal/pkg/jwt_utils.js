const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const secretKey = process.env.JWT_SECRET || "your-default-secret-key";
const accessTokenExpiry = "1h"; // Short-lived
const refreshTokenExpiry = "7d"; // Long-lived

/**
 * Generate a JWT access token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: accessTokenExpiry });
};

/**
 * Generate a JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: refreshTokenExpiry });
};

/**
 * Validate a JWT token
 */
const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
};
