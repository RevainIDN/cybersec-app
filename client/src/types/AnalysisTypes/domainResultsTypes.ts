import { BaseVirusTotalAttributes } from './analysisResultsCommonTypes';

// Интерфейс для ответа VirusTotal по домену
export interface DomainVirusTotalResponse {
	data: {
		attributes: DomainVirusTotalAttributes;
		id: string;
		type: string;
	};
}

// Интерфейс для атрибутов домена
export interface DomainVirusTotalAttributes extends BaseVirusTotalAttributes {
	categories: Record<string, string>;
	creation_date: number;
	jarm: string;
	last_dns_records: DNSRecord[];
	last_https_certificate: HTTPSCertificate;
	popularity_ranks: Record<string, PopularityRank>;
	registrar: string;
	whois: string;
}

// Интерфейс для DNS-записи
export interface DNSRecord {
	type: string;
	ttl: string;
	value: string;
}

// Интерфейс для HTTPS-сертификата
export interface HTTPSCertificate {
	cert_signature: {
		signature_algorithm: string;
		signature: string;
	};
	extensions: {
		key_usage: string[];
		extended_key_usage: string[];
		CA: boolean;
		subject_key_identifier: string;
		authority_key_identifier: {
			keyid: string;
		};
	};
	issuer: {
		C: string;
		O: string;
		CN: string;
	};
	public_key: {
		algorithm: string;
		ec?: { curve: string; pub: string }; // ec сделан опциональным
	};
	serial_number: string;
	size: number;
	subject: {
		CN: string;
	};
	thumbprint: string;
	thumbprint_sha256: string;
	validity: {
		not_after: string;
		not_before: string;
	};
	version: string;
}

// Интерфейс для рейтинга популярности
export interface PopularityRank {
	rank: number;
	timestamp: number;
}