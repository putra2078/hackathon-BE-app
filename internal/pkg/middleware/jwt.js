/**
 * JWT Middleware
 * Digunakan untuk memproteksi endpoint yang membutuhkan autentikasi
 */

const { verifyToken, generateToken } = require("../jwt_utils");

const JWTMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied, token missing",
    });
  }

  try {
    const decoded = verifyToken(token);

    // Soft-refresh logic: If token expires in less than 15 minutes, issue a new one
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 15 * 60) {
      const { iat, exp, ...userPayload } = decoded;
      const newToken = generateToken(userPayload);
      res.setHeader('Authorization', `Bearer ${newToken}`);
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = JWTMiddleware;
