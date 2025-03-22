const axios = require('axios');
const { LC_API_KEY } = require('../../config/config');

const fetchLeakCheckReport = async (value) => {
	try {
		const response = await axios.get('https://leakcheck.io/api/public', {
			params: {
				key: LC_API_KEY,
				check: value,
			},
		});
		console.log('Ответ от LeakCheck:', response.data);
		return response.data;
	} catch (error) {
		console.error('Ошибка при запросе к LeakCheck:', error.response?.data || error.message);
		throw error;
	}
};

module.exports = { fetchLeakCheckReport };