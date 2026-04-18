const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');

// POST /api/chat — send message to AI chatbot
router.post('/', ChatController.chat);

// GET /api/chat/health — check if chatbot is configured
router.get('/health', ChatController.healthCheck);

module.exports = router;
