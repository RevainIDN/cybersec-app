import axios from "axios";
import store from "../../store";
import { IpVirusTotalResponse } from "../../types/AnalysisTypes/ipResultsTypes";
import { DomainVirusTotalResponse } from "../../types/AnalysisTypes/domainResultsTypes";
import { FileVirusTotalResponse } from "../../types/AnalysisTypes/fileResultsTypes";

const serverUrl = import.meta.env.VITE_SERVER_URL;

// Запрос для анализа IP через сервер
export const fetchVirusTotalIp = async (value: string): Promise<IpVirusTotalResponse> => {
	const token = store.getState().auth.token;
	try {
		const response = await axios.get(`${serverUrl}/api/virustotal/ip/${value}`, {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		});
		return response.data;
	} catch (error) {
		console.error('Ошибка при запросе к VirusTotal для IP через сервер: ' + error);
		throw error;
	}
};

// Запрос для анализа домена через сервер
export const fetchVirusTotalDomain = async (value: string): Promise<DomainVirusTotalResponse> => {
	const token = store.getState().auth.token;
	try {
		const response = await axios.get(`${serverUrl}/api/virustotal/domain/${value}`, {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		});
		return response.data;
	} catch (error) {
		console.error('Ошибка при запросе к VirusTotal для домена через сервер: ' + error);
		throw error;
	}
};

// Запрос для анализа URL через сервер
export async function fetchVirusTotalUrlScan(url: string) {
	const token = store.getState().auth.token;
	try {
		const response = await axios.post(
			`${serverUrl}/api/virustotal/url`,
			{ url },
			{
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Ошибка при запросе к VirusTotal для URL через сервер: ' + error);
		throw error;
	}
}

// Запрос для загрузки файла на анализ через сервер
export const fetchVirusTotalFileScan = async (file: File) => {
	const token = store.getState().auth.token;
	const formData = new FormData();
	formData.append("file", file, file.name);

	try {
		const response = await fetch(`${serverUrl}/api/virustotal/files`, {
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

// Запрос для получения отчёта об анализе файла через сервер
export const fetchVirusTotalFileReport = async (analysisId: string, retries = 5): Promise<FileVirusTotalResponse | null> => {
	const token = store.getState().auth.token;

	try {
		const response = await axios.get(`${serverUrl}/api/virustotal/files/${analysisId}`, {
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