import { BaseVirusTotalAttributes } from './analysisResultsCommonTypes';

// Интерфейс для ответа VirusTotal по URL
export interface UrlVirusTotalResponse {
	data: {
		attributes: UrlVirusTotalAttributes;
		id: string;
		type: string;
	};
}

// Интерфейс для атрибутов URL
export interface UrlVirusTotalAttributes extends BaseVirusTotalAttributes {
	categories: Record<string, string>;
	first_submission_date: number;
	html_meta: Record<string, string[]>;
	last_submission_date: number;
	last_http_response_code: number;
	last_http_response_content_length: number;
	last_http_response_content_sha256: string;
	last_http_response_headers: Record<string, string>;
	url: string;
	title: string;
}