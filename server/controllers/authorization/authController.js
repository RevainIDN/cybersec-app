const mongoose = require('mongoose');
const User = require('../../models/User');
const UserActivity = require('../../models/UserActivity');
const AutoCheck = require('../../models/AutoCheck');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { SECRET_AUTH_KEY } = require('../../config/config');

const { getLeakCheckReportInternal } = require('../../controllers/leakCheck/leakCheckController');
const { getPwnedPasswordsReportInternal } = require('../../controllers/leakCheck/pwnedPasswordsController');
const {
	getVirusTotalIpReportInternal,
	getVirusTotalUrlReportInternal,
	getVirusTotalDomainReportInternal,
} = require('../../controllers/virusTotal/virusTotalController');

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
			const userId = req.user?.userId;
			console.log('getUser: userId из req.user:', userId);
			if (!userId) {
				return res.status(401).json({ message: 'Пользователь не авторизован' });
			}
			if (!mongoose.isValidObjectId(userId)) {
				console.error('getUser: Неверный формат userId:', userId);
				return res.status(400).json({ message: 'Неверный формат идентификатора пользователя' });
			}
			const user = await User.findById(userId);
			if (!user) {
				console.error('getUser: Пользователь не найден:', userId);
				return res.status(404).json({ message: 'Пользователь не найден' });
			}
			return res.json({ username: user.username });
		} catch (error) {
			console.error('getUser: Ошибка сервера:', error.message);
			return res.status(500).json({ message: 'Ошибка сервера' });
		}
	}

	async getUserActivity(req, res) {
		try {
			const userId = req.user?.userId;
			if (!userId) {
				return res.status(401).json({ message: 'Пользователь не авторизован' });
			}
			const activities = await UserActivity.find({ userId });
			return res.json(activities);
		} catch (error) {
			console.error('Ошибка при получении активностей:', error.message);
			return res.status(500).json({ message: 'Ошибка сервера' });
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

	async createAutoCheck(req, res) {
		try {
			if (!req.user) {
				return res.status(401).json({ message: 'Пользователь не авторизован' });
			}
			const { type, subType, input, checkOnLogin } = req.body;
			const userId = req.user.userId;

			if (!type || !subType || !input) {
				return res.status(400).json({ message: 'Все поля обязательны' });
			}
			if (!['analysis', 'leak'].includes(type)) {
				return res.status(400).json({ message: 'Неверный тип проверки' });
			}
			if (!['ip', 'url', 'domain', 'file', 'email', 'password'].includes(subType)) {
				return res.status(400).json({ message: 'Неверный подтип проверки' });
			}

			const autoCheck = new AutoCheck({ userId, type, subType, input, checkOnLogin });
			await autoCheck.save();
			return res.status(201).json({ message: 'Автопроверка создана', autoCheck });
		} catch (error) {
			console.error('Ошибка при создании автопроверки:', error);
			return res.status(500).json({ message: 'Ошибка сервера', error: error.message });
		}
	}

	async getAutoChecks(req, res) {
		try {
			if (!req.user) {
				return res.status(401).json({ message: 'Пользователь не авторизован' });
			}
			const userId = req.user.userId;
			const autoChecks = await AutoCheck.find({ userId });
			return res.json(autoChecks);
		} catch (error) {
			console.error('Ошибка при получении автопроверок:', error);
			return res.status(500).json({ message: 'Ошибка сервера', error: error.message });
		}
	}

	async runAutoChecks(req, res) {
		try {
			if (!req.user) {
				return res.status(401).json({ message: 'Пользователь не авторизован' });
			}
			const userId = req.user.userId;
			const autoChecks = await AutoCheck.find({ userId, checkOnLogin: true });
			const results = await Promise.all(
				autoChecks.map(async (check) => {
					let result;
					try {
						if (check.type === 'leak' && check.subType === 'email') {
							const leakReport = await getLeakCheckReportInternal(check.input, true);
							result = leakReport.success && leakReport.found > 0 ? 'leaked' : 'safe';
						} else if (check.type === 'leak' && check.subType === 'password') {
							const pwnedReport = await getPwnedPasswordsReportInternal(check.input, true);
							result = pwnedReport.found ? 'leaked' : 'safe';
						} else if (check.type === 'analysis' && check.subType === 'ip') {
							const ipReport = await getVirusTotalIpReportInternal(check.input, userId, true);
							result = ipReport.data.attributes.last_analysis_stats.malicious > 0 ? 'suspicious' : 'clean';
						} else if (check.type === 'analysis' && check.subType === 'url') {
							const urlReport = await getVirusTotalUrlReportInternal(check.input, userId, true);
							result = urlReport.data.attributes.last_analysis_stats.malicious > 0 ? 'suspicious' : 'clean';
						} else if (check.type === 'analysis' && check.subType === 'domain') {
							const domainReport = await getVirusTotalDomainReportInternal(check.input, userId, true);
							result = domainReport.data.attributes.last_analysis_stats.malicious > 0 ? 'suspicious' : 'clean';
						} else {
							result = 'notImplemented';
						}
					} catch (error) {
						console.error(`Ошибка проверки ${check.subType}:`, error);
						result = 'error';
					}
					check.lastResult = result;
					check.lastChecked = new Date();
					await check.save();
					return check;
				})
			);
			return res.json(results);
		} catch (error) {
			console.error('Ошибка при выполнении автопроверок:', error);
			return res.status(500).json({ message: 'Ошибка сервера', error: error.message });
		}
	}

	async runSingleAutoCheck(req, res) {
		try {
			if (!req.user) {
				return res.status(401).json({ message: 'Пользователь не авторизован' });
			}
			const { id } = req.params;
			const userId = req.user.userId;
			const check = await AutoCheck.findOne({ _id: id, userId });
			if (!check) {
				return res.status(404).json({ message: 'Автопроверка не найдена' });
			}
			let result;
			try {
				if (check.type === 'leak' && check.subType === 'email') {
					const leakReport = await getLeakCheckReportInternal(check.input, true);
					result = leakReport.success && leakReport.found > 0 ? 'leaked' : 'safe';
				} else if (check.type === 'leak' && check.subType === 'password') {
					const pwnedReport = await getPwnedPasswordsReportInternal(check.input, true);
					result = pwnedReport.found ? 'leaked' : 'safe';
				} else if (check.type === 'analysis' && check.subType === 'ip') {
					const ipReport = await getVirusTotalIpReportInternal(check.input, userId, true);
					result = ipReport.data.attributes.last_analysis_stats.malicious > 0 ? 'suspicious' : 'clean';
				} else if (check.type === 'analysis' && check.subType === 'url') {
					const urlReport = await getVirusTotalUrlReportInternal(check.input, userId, true);
					result = urlReport.data.attributes.last_analysis_stats.malicious > 0 ? 'suspicious' : 'clean';
				} else if (check.type === 'analysis' && check.subType === 'domain') {
					const domainReport = await getVirusTotalDomainReportInternal(check.input, userId, true);
					result = domainReport.data.attributes.last_analysis_stats.malicious > 0 ? 'suspicious' : 'clean';
				} else {
					result = 'notImplemented';
				}
			} catch (error) {
				console.error(`Ошибка проверки ${check.subType}:`, error);
				result = 'error';
			}
			check.lastResult = result;
			check.lastChecked = new Date();
			await check.save();
			return res.json(check);
		} catch (error) {
			console.error('Ошибка при выполнении проверки:', error);
			return res.status(500).json({ message: 'Ошибка сервера', error: error.message });
		}
	}

	async deleteAutoCheck(req, res) {
		try {
			if (!req.user) {
				return res.status(401).json({ message: 'Пользователь не авторизован' });
			}
			const { id } = req.params;
			const userId = req.user.userId;
			const check = await AutoCheck.findOneAndDelete({ _id: id, userId });
			if (!check) {
				return res.status(404).json({ message: 'Автопроверка не найдена' });
			}
			return res.status(200).json({ message: 'Автопроверка удалена' });
		} catch (error) {
			console.error('Ошибка при удалении автопроверки:', error);
			return res.status(500).json({ message: 'Ошибка сервера', error: error.message });
		}
	}
}

module.exports = new authController();