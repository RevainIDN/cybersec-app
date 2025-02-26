export interface IpVirusTotalResponse {
	data: {
		attributes: IpVirusTotalAttributes;
		id: string;
		links: { self: string };
		type: string;
	};
}

interface IpVirusTotalAttributes {
	as_owner: string;
	asn: number;
	continent: string;
	country: string;
	last_analysis_date: number;
	last_analysis_results: Record<string, IpAnalysisResult>;
	network: number;
	regional_internet_registry: string;
	reputation: number;
	whois: string;
}

interface IpAnalysisResult {
	method: string;
	engine_name: string;
	category: string;
	result: string;
}

export interface DomainVirusTotalResponse {
	data: {
		attributes: DomainVirusTotalAttributes;
		id: string;
		links: { self: string };
		type: string;
	};
}

interface DomainVirusTotalAttributes {
	categories: Record<string, string>;
	creation_date: number;
	jarm: string;
	last_analysis_date: number;
	last_analysis_results: Record<string, AnalysisResult>;
	last_analysis_stats: AnalysisStats;
	last_dns_records: DNSRecord[];
	last_dns_records_date: number;
	last_https_certificate: HTTPSCertificate;
	last_https_certificate_date: number;
	last_modification_date: number;
	last_update_date: number;
	popularity_ranks: Record<string, PopularityRank>;
	registrar: string;
	reputation: number;
	tld: string;
	total_votes: { harmless: number; malicious: number };
	whois: string;
	whois_date: number;
}

interface AnalysisResult {
	category: string;
	result: string;
	method: string;
	engine_name: string;
}

interface AnalysisStats {
	malicious: number;
	suspicious: number;
	undetected: number;
	harmless: number;
	timeout: number;
}

interface DNSRecord {
	type: string;
	ttl: string;
	value: string;
}

interface HTTPSCertificate {
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
		ec: { curve: string; pub: string };
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

interface PopularityRank {
	rank: number;
	timestamp: number;
}