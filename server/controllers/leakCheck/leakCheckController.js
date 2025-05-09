const { fetchLeakCheckReport } = require('../../services/leakCheck/leakCheckService');
const UserActivity = require('../../models/UserActivity');

const getLeakCheckReport = async (req, res) => {
	const { value } = req.query;
	const userId = req.user?.userId;

	console.log('Получены параметры:', { value });

	if (!value) {
		return res.status(400).json({ message: 'Не указано значение для проверки.' });
	}

	try {
		const leakReport = await fetchLeakCheckReport(value);
		const result = leakReport.success && leakReport.found > 0 ? 'leaked' : 'safe';

		if (userId) {
			const activity = new UserActivity({
				userId,
				type: 'email_leak_check',
				input: value,
				result,
			});
			await activity.save();
		}

		if (!leakReport.success) {
			if (leakReport.error === 'Not found') {
				return res.status(200).json({ message: 'Утечек не найдено.', data: leakReport });
			}
			return res.status(403).json({ message: leakReport.error });
		}
		return res.status(200).json(leakReport);
	} catch (error) {
		console.error('Ошибка при запросе к LeakCheck:', error.message);
		return res.status(500).json({ message: 'Ошибка сервера при запросе к LeakCheck.' });
	}
};

const getLeakCheckReportInternal = async (value, isAutoCheck = false) => {
	if (!value) {
		throw new Error('Не указано значение для проверки.');
	}

	try {
		const leakReport = await fetchLeakCheckReport(value, isAutoCheck);
		return leakReport;
	} catch (error) {
		console.error('Ошибка при запросе к LeakCheck (internal):', error.message);
		throw error;
	}
};

module.exports = { getLeakCheckReport, getLeakCheckReportInternal };