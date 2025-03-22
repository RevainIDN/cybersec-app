const axios = require('axios');

const expandUrl = async (shortUrl) => {
	try {
		const response = await axios.get(shortUrl, {
			maxRedirects: 0, // Не следовать перенаправлениям автоматически
			validateStatus: (status) => status >= 200 && status < 400, // Принимать 3xx статусы
		});
		// Если есть перенаправление, берём Location из заголовков
		if (response.status >= 300 && response.status < 400 && response.headers.location) {
			return response.headers.location;
		}
		return shortUrl; // Если нет перенаправления, возвращаем исходный URL
	} catch (error) {
		if (error.response && error.response.headers.location) {
			return error.response.headers.location; // Ловим Location при ошибке перенаправления
		}
		console.error('Ошибка при расширении URL:', error.message);
		throw error;
	}
};

module.exports = { expandUrl };