const User = require('../../models/User');
const UserActivity = require('../../models/UserActivity');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { SECRET_AUTH_KEY } = require('../../config/config');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/avatars/');
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, `${req.user.userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
	},
});

const upload = multer({ storage });

class authController {
	async registration(req, res) {
		try {
			const { email, username, password, passwordConfirm } = req.body;
			if (password !== passwordConfirm) {
				return res.status(400).json({ message: 'Пароли не совпадают' });
			}
			const emailExist = await User.findOne({ email });
			if (emailExist) {
				return res.status(400).json({ message: 'Email уже занят' });
			}
			const usernameExists = await User.findOne({ username });
			if (usernameExists) {
				return res.status(400).json({ message: 'Nickname уже занят' });
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
			console.log('Тело запроса:', req.body);
			const { username, password } = req.body;
			const user = await User.findOne({ username });
			if (!user) {
				return res.status(400).json({ message: 'Неверный пользователь или пароль' });
			}
			const isValidPassword = await bcrypt.compare(password, user.password);
			if (!isValidPassword) {
				return res.status(400).json({ message: 'Неверный пользователь или пароль' });
			}
			const token = jwt.sign({ userId: user._id }, SECRET_AUTH_KEY, { expiresIn: '2h' });
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

	async getUser(req, res) {
		try {
			const userId = req.user.userId;
			const user = await User.findById(userId).select('username');
			if (!user) {
				return res.status(404).json({ message: 'Пользователь не найден' });
			}
			return res.json(user);
		} catch (error) {
			return res.status(500).json({ message: 'Ошибка при получении данных пользователя', error: error.message });
		}
	}

	async getUserActivity(req, res) {
		try {
			const userId = req.user.userId;
			const activities = await UserActivity.find({ userId }).sort({ createdAt: -1 });
			return res.json(activities);
		} catch (error) {
			return res.status(500).json({ message: 'Ошибка при получении активности', error: error.message });
		}
	}

	async deleteAllUserActivities(req, res) {
		const userId = req.user.userId;
		try {
			await UserActivity.deleteMany({ userId });
			return res.status(200).json({ message: 'Все активности успешно удалены' });
		} catch (error) {
			console.error('Ошибка при удалении активностей:', error);
			return res.status(500).json({ message: 'Ошибка сервера при удалении активностей' });
		}
	}
}

module.exports = new authController();