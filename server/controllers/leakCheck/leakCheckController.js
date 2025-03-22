const { fetchLeakCheckReport } = require('../../services/leakCheck/leakCheckService')

const getLeakCheckReport = async (req, res) => {
	const { value } = req.query; // Убрал type
	console.log('Получены параметры:', { value });

	if (!value) {
		return res.status(400).json({ message: 'Не указано значение для проверки.' });
	}

	try {
		const leakReport = await fetchLeakCheckReport(value);
		if (!leakReport.success) {
			if (leakReport.error === 'Not found') {
				return res.status(200).json({ message: 'Утечек не найдено.', data: leakReport });
			}
			return res.status(403).json({ message: leakReport.error }); // Для других ошибок
		}
		return res.status(200).json(leakReport); // Утечки найдены
	} catch (error) {
		return res.status(500).json({ message: 'Ошибка сервера при запросе к LeakCheck.' });
	}
};

module.exports = { getLeakCheckReport };