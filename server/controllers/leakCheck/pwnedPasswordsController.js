const { fetchPwnedPasswords } = require('../../services/leakCheck/pwnedPasswordsService');

const getPwnedPasswordsReport = async (req, res) => {
	const { password } = req.query;
	console.log('Получен пароль для проверки:', password);

	if (!password) {
		return res.status(400).json({ message: 'Не указан пароль для проверки.' });
	}

	try {
		const pwnedReport = await fetchPwnedPasswords(password);
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