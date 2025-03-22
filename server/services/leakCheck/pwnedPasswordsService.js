const axios = require('axios');
const crypto = require('crypto');

const fetchPwnedPasswords = async (password) => {
	const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
	const prefix = hash.slice(0, 5);
	const suffix = hash.slice(5);

	try {
		const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`, {
			headers: { 'User-Agent': 'Cyber Secure' },
		});
		const hashList = response.data.split('\n');

		for (const line of hashList) {
			const [hashSuffix, count] = line.split(':');
			if (hashSuffix === suffix) {
				return { found: true, count: parseInt(count, 10) };
			}
		}
		return { found: false, count: 0 };
	} catch (error) {
		console.error('Ошибка при запросе к Pwned Passwords:', error.response?.data || error.message);
		throw error;
	}
};

module.exports = { fetchPwnedPasswords };