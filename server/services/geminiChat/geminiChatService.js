const { GoogleGenAI } = require("@google/genai");
const { GEMINI_API_KEY } = require('../../config/config');

const ai = new GoogleGenAI({
	apiKey: GEMINI_API_KEY,
});

const sendGeminiPrompt = async (prompt) => {
	if (!GEMINI_API_KEY) {
		throw new Error('GEMINI_API_KEY is not configured.');
	}

	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: prompt,
	});

	const text = response.text;

	if (!text) {
		throw new Error("Empty response from Gemini");
	}

	return text;
};

module.exports = { sendGeminiPrompt };