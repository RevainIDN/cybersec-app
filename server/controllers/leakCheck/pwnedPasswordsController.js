const { fetchPwnedPasswords } = require('../../services/leakCheck/pwnedPasswordsService');
const UserActivity = require('../../models/UserActivity');
const maskPassword = require('../../utils/maskPassword');

const getPwnedPasswordsReport = async (req, res) => {
	const { password } = req.query;
	const userId = req.user?.userId;

	console.log('Получен пароль для проверки:', password);

	if (!password) {
		return res.status(400).json({ message: 'Не указан пароль для проверки.' });
	}

	try {
		const pwnedReport = await fetchPwnedPasswords(password);
		const result = pwnedReport.found ? 'Слито' : 'Безопасно';

		if (userId) {
			const maskedPassword = maskPassword(password);
			const activity = new UserActivity({
				userId,
				type: 'password_leak_check',
				input: maskedPassword,
				result,
			});
			await activity.save();
		}

		if (pwnedReport.found) {
			return res.status(200).json({
				message: `Пароль найден в ${pwnedReport.count} утечках.`,
				data: pwnedReport,
			});
		}
		return res.status(200).json({ message: 'Пароль не найден в утечках.', data: pwnedReport });
	} catch (error) {
		return res.status(500).json({ message: 'Ошибка сервера при запросе к Pwned Passwords.' });
	}
};

module.exports = { getPwnedPasswordsReport };