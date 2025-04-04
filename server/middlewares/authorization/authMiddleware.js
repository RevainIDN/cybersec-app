const jwt = require('jsonwebtoken');
const { SECRET_AUTH_KEY } = require('../../config/config');

module.exports = function (req, res, next) {
	const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

	if (!token) {
		req.user = null;
		return next();
	}

	try {
		const decoded = jwt.verify(token, SECRET_AUTH_KEY);
		req.user = decoded;
		next();
	} catch (error) {
		req.user = null;
		next();
	}
};