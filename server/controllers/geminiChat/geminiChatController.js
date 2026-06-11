const { sendGeminiPrompt } = require('../../services/geminiChat/geminiChatService');

const handleGeminiChat = async (req, res) => {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ message: 'Запрос отсутствует или неверного формата.' });
    }

    try {
        const aiText = await sendGeminiPrompt(prompt);
        return res.status(200).json({ text: aiText });
    } catch (error) {
        console.error('Gemini chat error:', error.response?.data || error.message || error);
        return res.status(500).json({ message: 'Не удалось получить ответ от Gemini.' });
    }
};

module.exports = { handleGeminiChat };