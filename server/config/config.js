require('dotenv').config();

if (!process.env.VT_API_KEY) {
	throw new Error('API key for VirusTotal (VT_API_KEY) is missing.');
}
if (!process.env.LC_API_KEY) {
	throw new Error('API key for LeakCheck (LC_API_KEY) is missing.');
}

const VT_API_KEY = process.env.VT_API_KEY;
const LC_API_KEY = process.env.LC_API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
const SECRET_AUTH_KEY = process.env.SECRET_KEY;

module.exports = { VT_API_KEY, LC_API_KEY, DB_PASSWORD, SECRET_AUTH_KEY };