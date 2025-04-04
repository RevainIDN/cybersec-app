import axios from "axios";
import { IpVirusTotalResponse, DomainVirusTotalResponse, FileVirusTotalResponse } from "../../types/AnalysisTypes/analysisResultsTypes";
import store from "../../store";

// GET Запрос для IP-адресов
export const fetchVirusTotalIp = async (value: string): Promise<IpVirusTotalResponse> => {
	const token = store.getState().auth.token;
	try {
		const response = await axios.get(`http://localhost:5000/api/virustotal/ip/${value}`, {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		});
		return response.data;
	} catch (error) {
		console.error('Ошибка при запросе к VirusTotal для IP через сервер: ' + error);
		throw error;
	}
};

// GET Запрос для доменов
export const fetchVirusTotalDomain = async (value: string): Promise<DomainVirusTotalResponse> => {
	const token = store.getState().auth.token;
	try {
		const response = await axios.get(`http://localhost:5000/api/virustotal/domain/${value}`, {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		});
		return response.data;
	} catch (error) {
		console.error('Ошибка при запросе к VirusTotal для домена через сервер: ' + error);
		throw error;
	}
};

// POST запрос отправки URL для анализа
export async function fetchVirusTotalUrlScan(url: string) {
	const token = store.getState().auth.token;
	try {
		const response = await axios.post(
			'http://localhost:5000/api/virustotal/url',
			{ url },
			{
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			}
		);
		return response.data; // Теперь весь отчёт приходит сразу
	} catch (error) {
		console.error('Ошибка при запросе к VirusTotal для URL через сервер: ' + error);
		throw error;
	}
}

// GET Запрос для URL


// POST запрос отправки файла для анализа через сервер
export const fetchVirusTotalFileScan = async (file: File) => {
	const token = store.getState().auth.token;
	const formData = new FormData();
	formData.append("file", file, file.name);

	try {
		const response = await fetch(`http://localhost:5000/api/virustotal/files`, {
			method: "POST",
			body: formData,
			headers: token ? { Authorization: `Bearer ${token}` } : {},
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
	const token = store.getState().auth.token;

	try {
		const response = await axios.get(`http://localhost:5000/api/virustotal/files/${analysisId}`, {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
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