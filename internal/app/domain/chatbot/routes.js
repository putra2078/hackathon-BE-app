/**
 * Chatbot Routes
 * Defines Express API endpoints for the chatbot domain.
 * All routes are protected by authentication middleware.
 */

const express = require("express");
const router = express.Router();
const handler = require("./handler");
const authMiddleware = require("../../middleware/auth");

// ─── Conversation Routes ───────────────────────────────────────────────────────
router.post("/conversations", authMiddleware, handler.createConversation);
router.get("/conversations", authMiddleware, handler.getConversations);
router.get("/conversations/:id", authMiddleware, handler.getConversation);
router.patch("/conversations/:id", authMiddleware, handler.renameConversation);
router.delete("/conversations/:id", authMiddleware, handler.deleteConversation);

// ─── Message Routes ────────────────────────────────────────────────────────────
router.get("/conversations/:conversationId/messages", authMiddleware, handler.getMessages);
router.post("/conversations/:conversationId/messages", authMiddleware, handler.sendMessage);
router.post("/conversations/:conversationId/messages/sync", authMiddleware, handler.sendMessageNonStreaming);
router.delete("/messages/:id", authMiddleware, handler.deleteMessage);
router.post("/conversations/:conversationId/messages/:messageId/regenerate", authMiddleware, handler.regenerateMessage);

module.exports = router;
