const jwt = require('jsonwebtoken');
const { SECRET_AUTH_KEY } = require('../../config/config');

module.exports = (req, res, next) => {
	const authHeader = req.headers.authorization;
	console.log('authMiddleware: Заголовок Authorization:', authHeader); // Диагностика

	if (!authHeader) {
		console.log('authMiddleware: Токен отсутствует');
		req.user = null;
		return next();
	}

	const token = authHeader.split(' ')[1];
	if (!token) {
		console.log('authMiddleware: Неверный формат токена');
		req.user = null;
		return next();
	}

	try {
		const decoded = jwt.verify(token, SECRET_AUTH_KEY);
		console.log('authMiddleware: Декодированный токен:', decoded);
		req.user = decoded;
		next();
	} catch (error) {
		console.error('authMiddleware: Ошибка проверки токена:', error.message);
		req.user = null;
		return res.status(401).json({ message: 'Неверный или истёкший токен' });
	}
};