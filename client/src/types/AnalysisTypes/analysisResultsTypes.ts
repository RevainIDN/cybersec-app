export interface IpVirusTotalResponse {
	data: {
		attributes: IpVirusTotalAttributes;
		id: string;
		type: string;
	};
}

interface IpVirusTotalAttributes {
	as_owner: string;
	asn: number;
	continent: string;
	country: string;
	last_analysis_date: number;
	last_analysis_results: Record<string, AnalysisResult>;
	network: number;
	regional_internet_registry: string;
	reputation: number;
	whois: string;
}

interface AnalysisResult {
	category: string;
	engine_name: string;
	result: string;
}

export interface DomainVirusTotalResponse {
	data: {
		attributes: DomainVirusTotalAttributes;
		id: string;
		type: string;
	};
}

interface DomainVirusTotalAttributes {
	categories: Record<string, string>;
	creation_date: number;
	jarm: string;
	last_analysis_date: number;
	last_analysis_results: Record<string, AnalysisResult>;
	last_dns_records: DNSRecord[];
	last_https_certificate: HTTPSCertificate;
	popularity_ranks: Record<string, PopularityRank>;
	registrar: string;
	reputation: number;
	whois: string;
}

export interface DNSRecord {
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

export interface UrlVirusTotalResponse {
	data: {
		attributes: UrlVirusTotalAttributes;
		id: string;
		type: string;
	};
}

interface UrlVirusTotalAttributes {
	categories: Record<string, string>;
	first_submission_date: number,
	html_meta: Record<string, string[]>
	last_analysis_date: number;
	last_submission_date: number,
	last_analysis_results: Record<string, AnalysisResult>;
	last_http_response_code: number;
	last_http_response_content_length: number;
	last_http_response_content_sha256: string;
	last_http_response_headers: Record<string, string>;
	reputation: number;
	url: string;
	title: string;
}

export interface FileVirusTotalResponse {
	data: {
		attributes: FileVirusTotalAttributes;
		id: string;
		type: string;
	};
}

export interface FileVirusTotalAttributes {
	authentihash: string;
	bundle_info: BundleInfo;
	first_submission_date: number;
	meaningful_name: string;
	type_description: string;
	creation_date: number;
	last_submission_date: number;
	last_analysis_date: number;
	last_analysis_results: Record<string, AnalysisResult>;
	size: number | undefined;
	md5: string;
	sha1: string;
	sha256: string;
	vhash: string;
	ssdeep?: string;
	tlsh: string;
	trid: TridItem[];
	magika: string;
	magic: string;
	names: string[];
	pe_info: PEInfo;
	reputation: number;
	signature_info: SignatureInfo;
}

export interface BundleInfo {
	extensions: Record<string, number>;
	file_types: Record<string, number>;
	highest_datetime: string;
	lowest_datetime: string;
	num_children: number;
	type: string;
	uncompressed_size: number;
}

interface TridItem {
	file_type: string;
	[key: string]: string;
};

export interface PEInfo {
	compiler_product_versions: string[];
	entry_point: number;
	import_list: PEImports[];
	imphash: string;
	rich_pe_header_hash: string;
	overlay: PEOverlay;
	resource_details: PEResourceDetais[];
	resource_langs: Record<string, number>;
	resource_types: Record<string, number>;
	sections: PESection[];
	timestamp: number;
};

interface PEImports {
	library_name: string;
}

export interface PEOverlay {
	chi2: number;
	entropy: number;
	filetype: string;
	md5: string;
	offset: number;
	size: number;
}

export interface PEResourceDetais {
	chi2: number;
	entropy: number;
	filetype: string;
	lang: string;
	sha256: string;
	type: string;
}

export interface PESection {
	chi2: number;
	entropy: number;
	flags: string;
	md5: string;
	name: string;
	raw_size: number;
	virtual_address: number;
	virtual_size: number;
}

export interface SignatureInfo {
	verified: string;
	copyright: string;
	comments: string;
	product: string;
	description: string;
	'original name': string;
	'internal name': string;
	'file version': string;
	'signing date': string;
	signers: string;
	'counter signers': string;
	x509?: X509Item[];
}

export interface X509Item {
	algorithm: string;
	"cert issuer": string;
	name: string;
	"serial number": string;
	thumbprint: string;
	thumbprint_md5: string;
	thumbprint_sha256: string;
	"valid from": string;
	"valid to": string;
}