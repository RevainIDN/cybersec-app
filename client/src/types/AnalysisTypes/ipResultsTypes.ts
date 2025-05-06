import { BaseVirusTotalAttributes } from './analysisResultsCommonTypes'

// Интерфейс для ответа VirusTotal по IP
export interface IpVirusTotalResponse {
	data: {
		attributes: IpVirusTotalAttributes;
		id: string;
		type: string;
	};
}

// Интерфейс для атрибутов IP
export interface IpVirusTotalAttributes extends BaseVirusTotalAttributes {
	as_owner: string;
	asn: number;
	continent: string;
	country: string;
	network: number;
	regional_internet_registry: string;
	whois: string;
}