const Password = require('../../models/Password');

class PasswordManagerController {
	// Создание нового пароля
	async createPassword(req, res) {
		try {
			const userId = req.user?.userId;
			if (!userId) {
				return res.status(401).json({ message: 'Пользователь не авторизован' });
			}

			const { site, login, encryptedPassword, strength } = req.body;
			if (!site || !login || !encryptedPassword || !strength) {
				return res.status(400).json({ message: 'Все поля обязательны' });
			}
			if (!['weak', 'medium', 'strong'].includes(strength)) {
				return res.status(400).json({ message: 'Неверное значение надёжности пароля' });
			}

			// Проверка лимита паролей (100 на пользователя)
			const passwordCount = await Password.countDocuments({ userId });
			if (passwordCount >= 100) {
				return res.status(400).json({ message: 'Достигнут лимит паролей (100)' });
			}

			const password = new Password({
				userId,
				site,
				login,
				encryptedPassword,
				strength,
			});
			await password.save();

			return res.status(201).json({ message: 'Пароль сохранён', password });
		} catch (error) {
			console.error('Ошибка при создании пароля:', error.message);
			return res.status(500).json({ message: 'Ошибка сервера', error: error.message });
		}
	}

	// Получение всех паролей пользователя
	async getPasswords(req, res) {
		try {
			const userId = req.user?.userId;
			if (!userId) {
				return res.status(401).json({ message: 'Пользователь не авторизован' });
			}

			const passwords = await Password.find({ userId }).select('-userId');
			const passwordCount = passwords.length;
			const limit = 100;

			return res.json({
				passwords,
				remaining: limit - passwordCount,
			});
		} catch (error) {
			console.error('Ошибка при получении паролей:', error.message);
			return res.status(500).json({ message: 'Ошибка сервера', error: error.message });
		}
	}

	// Удаление пароля
	async deletePassword(req, res) {
		try {
			const userId = req.user?.userId;
			if (!userId) {
				return res.status(401).json({ message: 'Пользователь не авторизован' });
			}

			const { id } = req.params;
			const password = await Password.findOneAndDelete({ _id: id, userId });
			if (!password) {
				return res.status(404).json({ message: 'Пароль не найден' });
			}

			// Логирование активности
			const activity = new UserActivity({
				userId,
				type: 'password_delete',
				input: `site: ${password.site}, login: ${password.login}`,
				result: 'deleted',
			});
			await activity.save();

			return res.status(200).json({ message: 'Пароль удалён' });
		} catch (error) {
			console.error('Ошибка при удалении пароля:', error.message);
			return res.status(500).json({ message: 'Ошибка сервера', error: error.message });
		}
	}
}

module.exports = new PasswordManagerController();