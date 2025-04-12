const jwt = require('jsonwebtoken');
const { SECRET_AUTH_KEY } = require('../../config/config');

module.exports = function (req, res, next) {
	const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

	if (!token) {
		return res.status(401).json({ message: 'Токен отсутствует' });
	}

	try {
		const decoded = jwt.verify(token, SECRET_AUTH_KEY);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({ message: 'Неверный или истёкший токен' });
	}
};