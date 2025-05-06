import { BaseVirusTotalAttributes } from './analysisResultsCommonTypes';

// Интерфейс для ответа VirusTotal по файлу
export interface FileVirusTotalResponse {
	data: {
		attributes: FileVirusTotalAttributes;
		id: string;
		type: string;
	};
}

// Интерфейс для атрибутов файла
export interface FileVirusTotalAttributes extends BaseVirusTotalAttributes {
	authentihash: string;
	bundle_info?: BundleInfo;
	first_submission_date: number;
	meaningful_name: string;
	type_description: string;
	creation_date: number;
	last_submission_date: number;
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
	pe_info?: PEInfo;
	signature_info?: SignatureInfo;
}

// Интерфейс для информации о бандле
export interface BundleInfo {
	extensions: Record<string, number>;
	file_types: Record<string, number>;
	highest_datetime: string;
	lowest_datetime: string;
	num_children: number;
	type: string;
	uncompressed_size: number;
}

// Интерфейс для TrID-данных
export interface TridItem {
	file_type: string;
	[key: string]: string;
}

// Интерфейс для PE-информации
export interface PEInfo {
	compiler_product_versions: string[];
	entry_point: number;
	import_list: PEImports[];
	imphash: string;
	rich_pe_header_hash: string;
	overlay?: PEOverlay;
	resource_details: PEResourceDetais[];
	resource_langs: Record<string, number>;
	resource_types: Record<string, number>;
	sections: PESection[];
	timestamp: number;
}

// Интерфейс для импортов PE
export interface PEImports {
	library_name: string;
}

// Интерфейс для оверлея PE
export interface PEOverlay {
	chi2: number;
	entropy: number;
	filetype: string;
	md5: string;
	offset: number;
	size: number;
}

// Интерфейс для ресурсов PE
export interface PEResourceDetais {
	chi2: number;
	entropy: number;
	filetype: string;
	lang: string;
	sha256: string;
	type: string;
}

// Интерфейс для секций PE
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

// Интерфейс для информации о подписи
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

// Интерфейс для X509-сертификата
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