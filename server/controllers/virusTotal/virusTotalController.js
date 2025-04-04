const { fetchVirusTotalFileReport } = require('../../services/virusTotal/virusTotalService');
const UserActivity = require('../../models/UserActivity');

const getVirusTotalFileReport = async (req, res) => {
    const { fileId } = req.params;
    const userId = req.user?.userId;

    console.log('Получен fileId:', fileId);

    try {
        const fileReport = await fetchVirusTotalFileReport(fileId);
        if (!fileReport) {
            return res.status(404).json({ message: 'Файл не найден или анализ не завершён.' });
        }

        const analysisStats = fileReport.data.attributes.last_analysis_stats;
        const result = analysisStats.malicious > 0 ? 'Подозрительный' : 'Чисто';

        if (userId) {
            const activity = new UserActivity({
                userId,
                type: 'file_analysis',
                input: fileId,
                result,
            });
            await activity.save();
        }

        // Возвращаем полный fileReport, как ожидает клиент
        return res.status(200).json(fileReport);
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        return res.status(500).json({ message: 'Ошибка сервера при запросе к VirusTotal.' });
    }
};

module.exports = { getVirusTotalFileReport };