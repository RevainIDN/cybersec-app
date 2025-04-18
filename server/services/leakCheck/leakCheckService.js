const axios = require('axios');
const { LC_API_KEY } = require('../../config/config');

const fetchLeakCheckReport = async (value, isAutoCheck = false) => {
	try {
		const response = await axios.get('https://leakcheck.io/api/public', {
			params: {
				key: LC_API_KEY,
				type: 'email',
				check: value,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Ошибка LeakCheck API:', {
			message: error.message,
			status: error.response?.status,
			data: error.response?.data,
		});
		throw error;
	}
};

module.exports = { fetchLeakCheckReport };