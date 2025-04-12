const maskPassword = (password) => {
	if (!password || password.length < 3) return '***';
	const firstChar = password[0];
	const lastChar = password[password.length - 1];
	const masked = `${firstChar}${'*'.repeat(Math.min(password.length - 2, 10))}${lastChar}`;
	return masked;
};

module.exports = maskPassword;