import axios from "axios";
import { IpVirusTotalResponse, DomainVirusTotalResponse, FileVirusTotalResponse } from "../../types/AnalysisTypes/analysisResultsTypes";
import store from "../../store";

const API_KEY_VIRUS_TOTAL = import.meta.env.VITE_VIRUSTOTAL_API_KEY;
const getOptions = { method: "GET", headers: { "x-apikey": API_KEY_VIRUS_TOTAL } };
const postUrlOptions = { headers: { "x-apikey": API_KEY_VIRUS_TOTAL, "Content-Type": "application/x-www-form-urlencoded" } };

// GET Запрос для IP-адресов
export const fetchVirusTotalIp = async (value: string): Promise<IpVirusTotalResponse> => {
	try {
		const response = await axios(`https://www.virustotal.com/api/v3/ip_addresses/${value}`, getOptions);
		return response.data;
	} catch (error) {
		console.error('Ошибка при запросе к VirusTotal для IP: ' + error);
		throw error;
	}
}

// GET Запрос для доменов
export const fetchVirusTotalDomain = async (value: string): Promise<DomainVirusTotalResponse> => {
	try {
		const response = await axios(`https://www.virustotal.com/api/v3/domains/${value}`, getOptions);
		return response.data;
	} catch (error) {
		console.error('Ошибка при запросе к VirusTotal для домена: ' + error);
		throw error;
	}
}

// POST запрос отправки URL для анализа
export async function fetchVirusTotalUrlScan(url: string) {
	try {
		const response = await axios.post(
			"https://www.virustotal.com/api/v3/urls",
			new URLSearchParams({ url }).toString(),
			postUrlOptions
		);
		return response.data;
	} catch (error) {
		console.error('Ошибка при запросе к VirusTotal для URL: ' + error);
		throw error;
	}
}

// GET Запрос для URL
export async function fetchVirusTotalUrlReport(id: string) {
	try {
		const analysisResponse = await axios.get(
			`https://www.virustotal.com/api/v3/analyses/${id}`,
			getOptions
		);
		const analysisData = analysisResponse.data;

		const urlId = analysisData.meta?.url_info?.id;
		if (!urlId) {
			console.warn("Не удалось получить URL ID для расширенного отчёта.");
			return analysisData;
		}

		const urlResponse = await axios.get(
			`https://www.virustotal.com/api/v3/urls/${urlId}`,
			getOptions
		);

		return urlResponse.data;
	} catch (error) {
		console.error("Ошибка при запросе к VirusTotal для URL:", error);
		throw error;
	}
}

// POST запрос отправки файла для анализа через сервер
export const fetchVirusTotalFileScan = async (file: File) => {
	const token = store.getState().auth.token; // Получаем токен из Redux
	const formData = new FormData();
	formData.append("file", file, file.name);

	try {
		const response = await fetch(`http://localhost:5000/api/virustotal/files`, {
			method: "POST",
			body: formData,
			headers: token ? { Authorization: `Bearer ${token}` } : {}, // Добавляем токен, если он есть
		});

		if (!response.ok) {
			throw new Error(`Ошибка загрузки файла: ${response.status}`);
		}

		const data = await response.json();
		console.log('ID полученного файла:', data.id);
		return data;
	} catch (error) {
		console.error("Ошибка при загрузке файла:", error);
		throw error;
	}
};

// GET Запрос для получения отчета о файле через сервер
export const fetchVirusTotalFileReport = async (analysisId: string, retries = 5): Promise<FileVirusTotalResponse | null> => {
	const token = store.getState().auth.token; // Получаем токен из Redux

	try {
		const response = await axios.get(`http://localhost:5000/api/virustotal/files/${analysisId}`, {
			headers: token ? { Authorization: `Bearer ${token}` } : {}, // Добавляем токен
		});
		console.log("Ответ от сервера:", response.data);

		const fileData = response.data.data;

		if (
			fileData?.attributes?.last_analysis_results &&
			Object.keys(fileData.attributes.last_analysis_results).length > 0
		) {
			console.log('Результаты анализа получены');
			return response.data;
		}

		console.log('Анализ не завершён или результаты недоступны');
		return null;
	} catch (error) {
		console.error("Ошибка при получении отчёта:", error);
		if (retries > 0) {
			console.log('Ошибка при запросе, повторная попытка через 20 секунд...');
			await new Promise(resolve => setTimeout(resolve, 20000));
			return fetchVirusTotalFileReport(analysisId, retries - 1);
		}
		throw error;
	}
};