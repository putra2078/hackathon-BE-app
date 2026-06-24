const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const fs = require("fs");
const winston = require("winston");

const app = express();
const PORT = process.env.PORT || 3001;

// Create logs directory
const logDir = path.join(__dirname, "../logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Success Request Logger
const requestLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "request_log.log"),
    }),
  ],
});

// Error Request Logger
const errorLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "error_log.log"),
    }),
  ],
});

// Middleware
app.use(cors()); // Allow all domains
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Audit Middleware
app.use((req, res, next) => {
  const methodsToAudit = ["POST", "PUT", "DELETE"];

  if (!methodsToAudit.includes(req.method)) {
    return next();
  }

  const start = Date.now();

  res.on("finish", () => {
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      ip: req.ip,
      durationMs: Date.now() - start,
      body: req.body,
    };

    if (res.statusCode >= 200 && res.statusCode < 300) {
      requestLogger.info(JSON.stringify(logData));
    } else {
      errorLogger.error(JSON.stringify(logData));
    }
  });

  next();
});

// Health Check
app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// Import Router
const apiRouter = require("../internal/app/router/router");

// Register API Routes
app.use("/api/v1", apiRouter);

// Root Route
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hackathon Backend API",
  });
});

// Sample POST Route
app.post("/test", (req, res) => {
  return res.status(201).json({
    success: true,
  });
});

// Sample Failed Route
app.delete("/test", (req, res) => {
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
