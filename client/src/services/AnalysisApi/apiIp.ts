import axios from "axios";
import { IpVirusTotalResponse, DomainVirusTotalResponse } from "../../types/AnalysisTypes/analysisResultsTypes";

const apiKeyVirusTotal = import.meta.env.VITE_VIRUSTOTAL_API_KEY;
const options = { method: "GET", headers: { "x-apikey": apiKeyVirusTotal } }

// Запрос для IP-адресов
export const fetchVirusTotalIp = async (value: string): Promise<IpVirusTotalResponse> => {
	try {
		const response = await axios(`https://www.virustotal.com/api/v3/ip_addresses/${value}`, options);
		return response.data;
	} catch (error) {
		console.error('Ошибка при запросе к VirusTotal для IP: ' + error);
		throw error;
	}
}

// Запрос для доменов
export const fetchVirusTotalDomain = async (value: string): Promise<DomainVirusTotalResponse> => {
	try {
		const response = await axios(`https://www.virustotal.com/api/v3/domains/${value}`, options);
		return response.data;
	} catch (error) {
		console.error('Ошибка при запросе к VirusTotal для домена: ' + error);
		throw error;
	}
}