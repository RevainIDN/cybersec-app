import { DomainVirusTotalResponse, DNSRecord } from "../../../../../../types/AnalysisTypes/domainResultsTypes";
import { convertTimestamp } from "../../../../../../utils/convertTimestamp";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import TooltipButton from "../../../../../GeneralComponents/TooltipButton/TooltipButton";

// Константы для классов
const CLASS_NAMES = {
	CONTAINER: "details-cont",
	TOOLTIP: "details-tooltip",
	ITEM: "details-item",
	DESC: "details-desc",
	TABLE: "details-table",
	CERT_TABLE: "details-table cert-table",
	NO_DATA: "analysis-no-data",
	NODATA: "nodata",
} as const;

// Типизация
interface DomainDetailsProps {
	domainAnalysisResults: DomainVirusTotalResponse | null;
}

interface DetailsTableProps<T> {
	title: string;
	description: string;
	headers: string[];
	data: T[];
	columns: (keyof T)[];
}

// Утилита для рендеринга ключ-значение
const renderDetail = (label: string, value?: string | number) => (
	value && (
		<li key={label} className={CLASS_NAMES.DESC}>
			<span>{label}:</span> <span>{value}</span>
		</li>
	)
);

// Компонент для таблиц
const DetailsTable = <T,>({
	title,
	description,
	headers,
	data,
	columns,
}: DetailsTableProps<T>) => (
	<li className={CLASS_NAMES.ITEM}>
		<h1 className={CLASS_NAMES.TOOLTIP}>{title}<TooltipButton tooltipText={description} /></h1>
		<table className={CLASS_NAMES.TABLE}>
			<thead>
				<tr>{headers.map((header, i) => <th key={i}>{header}</th>)}</tr>
			</thead>
			<tbody>
				{data.map((row, idx) => (
					<tr key={idx}>
						{columns.map((col) => (
							<td key={String(col)}>{String(row[col])}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	</li>
);

// Подкомпоненты
const CategoriesSection = ({ categories, t }: { categories: Record<string, string>, t: TFunction }) => (
	categories && Object.keys(categories).length > 0 && (
		<li className={CLASS_NAMES.ITEM}>
			<h1 className={CLASS_NAMES.TOOLTIP}>
				{t('analysisPage.analyzedData.details.domain.categories')}
				<TooltipButton tooltipText={t('analysisPage.analyzedData.details.domain.description.categories')} />
			</h1>
			<ul className={CLASS_NAMES.CONTAINER}>
				{Object.entries(categories).map(([key, value]) => renderDetail(key, value))}
			</ul>
		</li>
	)
);

const PopularitySection = ({ popularity_ranks, t }: { popularity_ranks: Record<string, { rank: number; timestamp: number }>, t: TFunction }) => (
	popularity_ranks && Object.keys(popularity_ranks).length > 0 && (
		<DetailsTable
			title={t('analysisPage.analyzedData.details.domain.popularity')}
			description={t('analysisPage.analyzedData.details.domain.description.popularity')}
			headers={[
				t('analysisPage.analyzedData.details.domain.tableHeaderPopularity1'),
				t('analysisPage.analyzedData.details.domain.tableHeaderPopularity2'),
				t('analysisPage.analyzedData.details.domain.tableHeaderPopularity3')
			]}
			data={Object.entries(popularity_ranks).map(([key, rankData]) => ({
				rank: rankData.rank,
				position: key,
				timestamp: convertTimestamp(rankData.timestamp),
			}))}
			columns={["position", "rank", "timestamp"]}
		/>
	)
);

const DnsRecordsSection = ({ last_dns_records, t }: { last_dns_records: DNSRecord[], t: TFunction }) => (
	last_dns_records && last_dns_records.length > 0 && (
		<DetailsTable
			title={t('analysisPage.analyzedData.details.domain.dns')}
			description={t('analysisPage.analyzedData.details.domain.description.dns')}
			headers={[
				t('analysisPage.analyzedData.details.domain.tableHeaderDns1'),
				t('analysisPage.analyzedData.details.domain.tableHeaderDns2'),
				t('analysisPage.analyzedData.details.domain.tableHeaderDns3')
			]}
			data={last_dns_records}
			columns={["type", "ttl", "value"]}
		/>
	)
);

const HttpsCertificateSection = ({ attributes, t }: { attributes: DomainVirusTotalResponse['data']['attributes'], t: TFunction }) => (
	attributes?.last_https_certificate && Object.keys(attributes.last_https_certificate).length > 0 && (
		<li className={CLASS_NAMES.ITEM}>
			<h1 className={CLASS_NAMES.TOOLTIP}>
				{t('analysisPage.analyzedData.details.domain.httpsCert')}
				<TooltipButton tooltipText={t('analysisPage.analyzedData.details.domain.description.httpsCert')} />
			</h1>
			<table className={CLASS_NAMES.CERT_TABLE}>
				<thead>
					<tr>
						<th>{t('analysisPage.analyzedData.details.domain.tableHeaderHttps1')}</th>
						<th>{t('analysisPage.analyzedData.details.domain.tableHeaderHttps2')}</th>
					</tr>
				</thead>
				<tbody>
					{[
						{ label: "JARM Fingerprint", value: attributes.jarm },
						{ label: "Version", value: attributes.last_https_certificate.version },
						{ label: "Serial Number", value: attributes.last_https_certificate.serial_number },
						{ label: "Thumbprint", value: attributes.last_https_certificate.thumbprint },
						{ label: "Signature Algorithm", value: attributes.last_https_certificate.cert_signature?.signature_algorithm },
						{ label: "Issuer", value: attributes.last_https_certificate.issuer ? `${attributes.last_https_certificate.issuer.C || ''} ${attributes.last_https_certificate.issuer.O || ''} ${attributes.last_https_certificate.issuer.CN || ''}`.trim() : '' },
						{ label: "Subject", value: attributes.last_https_certificate.subject?.CN },
						{ label: "Subject Public Key Info", value: attributes.last_https_certificate.public_key?.algorithm },
						{ label: "Public Key", value: attributes.last_https_certificate.public_key?.ec ? 'EC' : 'Unknown' },
					].map((row, idx) => (
						row.value && (
							<tr key={idx}>
								<td>{row.label}</td>
								<td>{row.value}</td>
							</tr>
						)
					))}
				</tbody>
			</table>
		</li>
	)
);

const WhoisSection = ({ whois, t }: { whois: string, t: TFunction }) => (
	whois && whois.trim().length > 0 && (
		<li className={CLASS_NAMES.ITEM}>
			<h1 className={CLASS_NAMES.TOOLTIP}>
				WHOIS
				<TooltipButton tooltipText={t('analysisPage.analyzedData.details.domain.description.whois')} />
			</h1>
			<ul className={CLASS_NAMES.CONTAINER}>
				{whois.split("\n").map((line, index) => (
					<li key={index} className={CLASS_NAMES.DESC}><span>{line}</span></li>
				))}
			</ul>
		</li>
	)
);

// Основной компонент
export default function DomainDetails({ domainAnalysisResults }: DomainDetailsProps) {
	const { t } = useTranslation();

	const attributes = domainAnalysisResults?.data?.attributes;

	if (!domainAnalysisResults || !domainAnalysisResults.data || !attributes) {
		return <p className={CLASS_NAMES.NO_DATA}>No data</p>;
	}

	const hasData = (
		(attributes.categories && Object.keys(attributes.categories).length > 0) ||
		(attributes.popularity_ranks && Object.keys(attributes.popularity_ranks).length > 0) ||
		(attributes.last_dns_records && attributes.last_dns_records.length > 0) ||
		(attributes.last_https_certificate && Object.keys(attributes.last_https_certificate).length > 0) ||
		(attributes.whois && attributes.whois.trim().length > 0)
	);

	return (
		<>
			{hasData ? (
				<>
					<CategoriesSection categories={attributes.categories} t={t} />
					<PopularitySection popularity_ranks={attributes.popularity_ranks} t={t} />
					<DnsRecordsSection last_dns_records={attributes.last_dns_records} t={t} />
					<HttpsCertificateSection attributes={attributes} t={t} />
					<WhoisSection whois={attributes.whois} t={t} />
				</>
			) : (
				<h1 className={CLASS_NAMES.NODATA}>No data</h1>
			)}
		</>
	);
}