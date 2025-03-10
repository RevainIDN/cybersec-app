require('dotenv').config();  // Загружаем переменные из .env

if (!process.env.VT_API_KEY) {
	throw new Error('API key for VirusTotal (VT_API_KEY) is missing.');
}

const VT_API_KEY = process.env.VT_API_KEY;
module.exports = { VT_API_KEY };