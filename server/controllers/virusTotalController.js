const { fetchVirusTotalFileReport } = require('../services/virusTotalService');

const getVirusTotalFileReport = async (req, res) => {
    const { fileId } = req.params;
    console.log('Получен fileId:', fileId);

    try {
        const fileReport = await fetchVirusTotalFileReport(fileId);
        if (fileReport) {
            return res.status(200).json(fileReport);
        }
        return res.status(404).json({ message: 'Файл не найден или анализ не завершён.' });
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        return res.status(500).json({ message: 'Ошибка сервера при запросе к VirusTotal.' });
    }
};

module.exports = { getVirusTotalFileReport };