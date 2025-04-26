const axios = require('axios');

const expandUrl = async (shortUrl) => {
	try {
		const response = await axios.get(shortUrl, {
			maxRedirects: 0,
			validateStatus: (status) => status >= 200 && status < 400,
		});
		if (response.status >= 300 && response.status < 400 && response.headers.location) {
			return response.headers.location;
		}
		return shortUrl;
	} catch (error) {
		if (error.response && error.response.headers.location) {
			return error.response.headers.location;
		}
		console.error('Ошибка при расширении URL:', error.message);
		throw error;
	}
};

module.exports = { expandUrl };