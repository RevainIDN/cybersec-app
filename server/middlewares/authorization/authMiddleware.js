const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config/config')

module.exports = function (req, res, next) {
	const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
	if (!token) {
		return res.status(401).json({ message: 'Нет доступа' });
	}
	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		req.user = decoded; // Добавляем данные пользователя в запрос
		next();
	} catch (error) {
		return res.status(403).json({ message: 'Недействительный токен' });
	}
};