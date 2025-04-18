const axios = require('axios');
const crypto = require('crypto');

const fetchPwnedPasswords = async (password, isAutoCheck = false) => {
	try {
		const sha1Password = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
		const prefix = sha1Password.slice(0, 5);
		const suffix = sha1Password.slice(5);

		const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
		const hashes = response.data.split('\n');

		for (const hash of hashes) {
			const [hashSuffix, count] = hash.split(':');
			if (hashSuffix === suffix) {
				return { found: true, count: parseInt(count, 10) };
			}
		}

		return { found: false, count: 0 };
	} catch (error) {
		console.error('Ошибка Pwned Passwords API:', error.message);
		throw error;
	}
};

module.exports = { fetchPwnedPasswords };