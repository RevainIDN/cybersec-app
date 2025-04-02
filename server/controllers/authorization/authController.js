const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_AUTH_KEY } = require('../../config/config')

class authController {
	async registration(req, res) {
		try {
			const { email, username, password, passwordConfirm } = req.body;
			if (password !== passwordConfirm) {
				return res.status(400)
			}
			const emailExist = await User.findOne({ email });
			if (emailExist) {
				return res.status(400).json({ message: 'Email уже занят' })
			}
			const usernameExists = await User.findOne({ username });
			if (usernameExists) {
				return res.status(400).json({ message: 'Nickname уже занят' })
			}
			const hashPassword = await bcrypt.hash(password, 10);
			const user = new User({ email, username, password: hashPassword, role: 'USER' });
			await user.save();
			return res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
		} catch (error) {
			return res.status(500).json({ message: 'Ошибка при регистрации', error: error.message });
		}
	}

	async login(req, res) {
		try {
			const { username, password } = req.body;
			const user = await User.findOne({ username });
			if (!user) {
				return res.status(400).json({ message: 'Неверный пользователь или пароль' });
			}
			const isValidPassword = await bcrypt.compare(password, user.password);
			if (!isValidPassword) {
				return res.status(400).json({ message: 'Неверный пользователь или пароль' });
			}
			const token = jwt.sign(
				{ userId: user._id },
				SECRET_AUTH_KEY,
				{ expiresIn: '2h' }
			);
			return res.json({ token, userId: user._id });
		} catch (error) {
			return res.status(500).json({ message: 'Ошибка при входе', error: error.message });
		}
	}

	async getUsers(req, res) {
		try {
			const users = await User.find().select('-password');
			return res.json(users);
		} catch (error) {
			return res.status(500).json({ message: 'Ошибка при получении пользователей', error: error.message });
		}
	}
}

module.exports = new authController();