const axios = require('axios');
const { fetchVirusTotalFileReport } = require('../../services/virusTotal/virusTotalService');
const UserActivity = require('../../models/UserActivity');
const { VT_API_KEY } = require('../../config/config');

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

        return res.status(200).json(fileReport);
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        return res.status(500).json({ message: 'Ошибка сервера при запросе к VirusTotal.' });
    }
};

const getVirusTotalIpReport = async (req, res) => {
    const { ip } = req.params;
    const userId = req.user?.userId;

    console.log('Получен IP:', ip);

    try {
        const response = await axios.get(`https://www.virustotal.com/api/v3/ip_addresses/${ip}`, {
            headers: { 'x-apikey': VT_API_KEY },
        });
        const ipReport = response.data;
        const analysisStats = ipReport.data.attributes.last_analysis_stats;
        const result = analysisStats.malicious > 0 ? 'Подозрительный' : 'Чисто';

        if (userId) {
            const activity = new UserActivity({
                userId,
                type: 'ip_analysis',
                input: ip,
                result,
            });
            await activity.save();
        }

        return res.status(200).json(ipReport);
    } catch (error) {
        console.error('Ошибка при запросе IP:', error);
        return res.status(500).json({ message: 'Ошибка сервера при запросе IP к VirusTotal.' });
    }
};

const getVirusTotalDomainReport = async (req, res) => {
    const { domain } = req.params;
    const userId = req.user?.userId;

    console.log('Получен домен:', domain);

    try {
        const response = await axios.get(`https://www.virustotal.com/api/v3/domains/${domain}`, {
            headers: { 'x-apikey': VT_API_KEY },
        });
        const domainReport = response.data;
        const analysisStats = domainReport.data.attributes.last_analysis_stats;
        const result = analysisStats.malicious > 0 ? 'Подозрительный' : 'Чисто';

        if (userId) {
            const activity = new UserActivity({
                userId,
                type: 'domain_analysis',
                input: domain,
                result,
            });
            await activity.save();
        }

        return res.status(200).json(domainReport);
    } catch (error) {
        console.error('Ошибка при запросе домена:', error);
        return res.status(500).json({ message: 'Ошибка сервера при запросе домена к VirusTotal.' });
    }
};

const getVirusTotalUrlReport = async (req, res) => {
    const { url } = req.body; // Используем тело запроса для URL
    const userId = req.user?.userId;

    console.log('Получен URL:', url);

    if (!url) {
        return res.status(400).json({ message: 'Не указан URL для анализа.' });
    }

    try {
        // Шаг 1: Отправляем URL на анализ
        const scanResponse = await axios.post(
            'https://www.virustotal.com/api/v3/urls',
            new URLSearchParams({ url }).toString(),
            {
                headers: {
                    'x-apikey': VT_API_KEY,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        const analysisId = scanResponse.data.data.id;

        // Шаг 2: Получаем отчёт
        const analysisResponse = await axios.get(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
            headers: { 'x-apikey': VT_API_KEY },
        });

        // Ждём завершения анализа (примитивный polling)
        let urlReport = analysisResponse.data;
        if (urlReport.data.attributes.status !== 'completed') {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Ждём 5 секунд
            const retryResponse = await axios.get(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
                headers: { 'x-apikey': VT_API_KEY },
            });
            urlReport = retryResponse.data;
        }

        const urlId = urlReport.meta?.url_info?.id;
        if (!urlId) {
            return res.status(500).json({ message: 'Не удалось получить ID URL для отчёта.' });
        }

        const finalResponse = await axios.get(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
            headers: { 'x-apikey': VT_API_KEY },
        });
        const finalReport = finalResponse.data;
        const analysisStats = finalReport.data.attributes.last_analysis_stats;
        const result = analysisStats.malicious > 0 ? 'Подозрительный' : 'Чисто';

        if (userId) {
            const activity = new UserActivity({
                userId,
                type: 'url_analysis',
                input: url,
                result,
            });
            await activity.save();
        }

        return res.status(200).json(finalReport);
    } catch (error) {
        console.error('Ошибка при запросе URL:', error);
        return res.status(500).json({ message: 'Ошибка сервера при запросе URL к VirusTotal.' });
    }
};

module.exports = { getVirusTotalFileReport, getVirusTotalIpReport, getVirusTotalDomainReport, getVirusTotalUrlReport };