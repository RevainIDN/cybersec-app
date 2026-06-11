const express = require('express');
const { handleGeminiChat } = require('../../controllers/geminiChat/geminiChatController');

const router = express.Router();

router.post('/chat', handleGeminiChat);

module.exports = router;
