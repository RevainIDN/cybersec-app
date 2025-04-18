const axios = require('axios');
const { fetchVirusTotalFileReport } = require('../../services/virusTotal/virusTotalService');
const UserActivity = require('../../models/UserActivity');
const { VT_API_KEY } = require('../../config/config');

const getVirusTotalFileReport = async (fileId, userId, isAutoCheck = false) => {
    console.log('Получен fileId:', fileId);

    try {
        const fileReport = await fetchVirusTotalFileReport(fileId);
        if (!fileReport) {
            throw new Error('Файл не найден или анализ не завершён.');
        }

        const analysisStats = fileReport.data.attributes.last_analysis_stats;
        const result = analysisStats.malicious > 0 ? 'suspicious' : 'clean';

        if (userId && !isAutoCheck) {
            const activity = new UserActivity({
                userId,
                type: 'file_analysis',
                input: fileId,
                result,
            });
            await activity.save();
        }

        return fileReport;
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        throw error;
    }
};

const getVirusTotalIpReport = async (ip, userId, isAutoCheck = false) => {
    console.log('Получен IP:', ip);

    try {
        const response = await axios.get(`https://www.virustotal.com/api/v3/ip_addresses/${ip}`, {
            headers: { 'x-apikey': VT_API_KEY },
        });
        const ipReport = response.data;
        const analysisStats = ipReport.data.attributes.last_analysis_stats;
        const result = analysisStats.malicious > 0 ? 'suspicious' : 'clean';

        if (userId && !isAutoCheck) {
            const activity = new UserActivity({
                userId,
                type: 'ip_analysis',
                input: ip,
                result,
            });
            await activity.save();
        }

        return ipReport;
    } catch (error) {
        console.error('Ошибка при запросе IP:', error);
        throw error;
    }
};

const getVirusTotalDomainReport = async (domain, userId, isAutoCheck = false) => {
    console.log('Получен домен:', domain);

    try {
        const response = await axios.get(`https://www.virustotal.com/api/v3/domains/${domain}`, {
            headers: { 'x-apikey': VT_API_KEY },
        });
        const domainReport = response.data;
        const analysisStats = domainReport.data.attributes.last_analysis_stats;
        const result = analysisStats.malicious > 0 ? 'suspicious' : 'clean';

        if (userId && !isAutoCheck) {
            const activity = new UserActivity({
                userId,
                type: 'domain_analysis',
                input: domain,
                result,
            });
            await activity.save();
        }

        return domainReport;
    } catch (error) {
        console.error('Ошибка при запросе домена:', error);
        throw error;
    }
};

const getVirusTotalUrlReport = async (url, userId, isAutoCheck = false) => {
    console.log('Получен URL:', url);

    if (!url) {
        throw new Error('Не указан URL для анализа.');
    }

    try {
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

        let analysisResponse = await axios.get(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
            headers: { 'x-apikey': VT_API_KEY },
        });

        let urlReport = analysisResponse.data;
        if (urlReport.data.attributes.status !== 'completed') {
            await new Promise(resolve => setTimeout(resolve, 5000));
            const retryResponse = await axios.get(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
                headers: { 'x-apikey': VT_API_KEY },
            });
            urlReport = retryResponse.data;
        }

        const urlId = urlReport.meta?.url_info?.id;
        if (!urlId) {
            throw new Error('Не удалось получить ID URL для отчёта.');
        }

        const finalResponse = await axios.get(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
            headers: { 'x-apikey': VT_API_KEY },
        });
        const finalReport = finalResponse.data;
        const analysisStats = finalReport.data.attributes.last_analysis_stats;
        const result = analysisStats.malicious > 0 ? 'suspicious' : 'clean';

        if (userId && !isAutoCheck) {
            const activity = new UserActivity({
                userId,
                type: 'url_analysis',
                input: url,
                result,
            });
            await activity.save();
        }

        return finalReport;
    } catch (error) {
        console.error('Ошибка при запросе URL:', error);
        throw error;
    }
};

// HTTP-обработчики для маршрутов
const getVirusTotalFileReportHandler = async (req, res) => {
    try {
        const fileReport = await getVirusTotalFileReport(req.params.fileId, req.user?.userId);
        return res.status(200).json(fileReport);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getVirusTotalIpReportHandler = async (req, res) => {
    try {
        const ipReport = await getVirusTotalIpReport(req.params.ip, req.user?.userId);
        return res.status(200).json(ipReport);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getVirusTotalDomainReportHandler = async (req, res) => {
    try {
        const domainReport = await getVirusTotalDomainReport(req.params.domain, req.user?.userId);
        return res.status(200).json(domainReport);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getVirusTotalUrlReportHandler = async (req, res) => {
    try {
        const urlReport = await getVirusTotalUrlReport(req.body.url, req.user?.userId);
        return res.status(200).json(urlReport);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getVirusTotalFileReport: getVirusTotalFileReportHandler,
    getVirusTotalIpReport: getVirusTotalIpReportHandler,
    getVirusTotalDomainReport: getVirusTotalDomainReportHandler,
    getVirusTotalUrlReport: getVirusTotalUrlReportHandler,
    getVirusTotalFileReportInternal: getVirusTotalFileReport,
    getVirusTotalIpReportInternal: getVirusTotalIpReport,
    getVirusTotalDomainReportInternal: getVirusTotalDomainReport,
    getVirusTotalUrlReportInternal: getVirusTotalUrlReport,
};