const axios = require('axios');
const { VT_API_KEY } = require('../config/config');

const getOptions = {
	headers: {
		'x-apikey': VT_API_KEY
	}
};

const fetchVirusTotalFileReport = async (analysisId, retries = 5) => {
	try {
		// Шаг 1: Проверяем статус анализа
		const analysisResponse = await axios.get(
			`https://www.virustotal.com/api/v3/analyses/${analysisId}`,
			getOptions
		);
		console.log('Ответ от VirusTotal (анализ):', analysisResponse.data);

		const analysisData = analysisResponse.data.data;
		const metaData = analysisResponse.data.meta;

		// Если анализ ещё не завершён
		if (analysisData?.attributes?.status === 'queued' && retries > 0) {
			console.log('Анализ ещё не завершён. Повторная попытка через 20 секунд...');
			await new Promise(resolve => setTimeout(resolve, 20000));
			return fetchVirusTotalFileReport(analysisId, retries - 1);
		}

		// Если анализ завершён
		if (analysisData?.attributes?.status === 'completed') {
			// Получаем хэш файла (SHA-256) из meta.file_info
			const fileHash = metaData?.file_info?.sha256;
			if (!fileHash) {
				console.log('Хэш файла не найден в ответе анализа');
				return null;
			}

			// Шаг 2: Запрашиваем данные о файле по хэшу
			const fileResponse = await axios.get(
				`https://www.virustotal.com/api/v3/files/${fileHash}`,
				getOptions
			);
			console.log('Ответ от VirusTotal (файл):', fileResponse.data);

			const fileData = fileResponse.data.data;

			// Проверяем, есть ли результаты анализа
			if (
				fileData?.attributes?.last_analysis_results &&
				Object.keys(fileData.attributes.last_analysis_results).length > 0
			) {
				console.log('Результаты анализа получены');
				return fileResponse.data;
			}

			console.log('Результаты анализа пустые');
			return null;
		}

		console.log('Анализ не завершён или результаты недоступны, попытки исчерпаны');
		return null;
	} catch (error) {
		console.error('Ошибка при получении отчёта:', error.response?.data || error.message);
		if (retries > 0) {
			console.log('Ошибка при запросе, повторная попытка через 20 секунд...');
			await new Promise(resolve => setTimeout(resolve, 20000));
			return fetchVirusTotalFileReport(analysisId, retries - 1);
		}
		throw error;
	}
};

module.exports = { fetchVirusTotalFileReport };