require('dotenv').config();

if (!process.env.VT_API_KEY) {
	throw new Error('API key for VirusTotal (VT_API_KEY) is missing.');
}
if (!process.env.LC_API_KEY) {
	throw new Error('API key for LeakCheck (LC_API_KEY) is missing.');
}
if (!process.env.GEMINI_API_KEY) {
	throw new Error('API key for Gemini (GEMINI_API_KEY) is missing.');
}

const VT_API_KEY = process.env.VT_API_KEY;
const LC_API_KEY = process.env.LC_API_KEY;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cybersec-app';
const SECRET_AUTH_KEY = process.env.SECRET_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

module.exports = { VT_API_KEY, LC_API_KEY, MONGO_URI, SECRET_AUTH_KEY, GEMINI_API_KEY };