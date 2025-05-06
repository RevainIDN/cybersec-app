import { TFunction } from "i18next";
import { UrlVirusTotalResponse } from "../../../../../../types/AnalysisTypes/urlResultsTypes";
import { convertTimestamp } from "../../../../../../utils/convertTimestamp";
import { formatBytes } from "../../../../../../utils/formatBytes";
import { useTranslation } from "react-i18next";

// Константы для классов
const CLASS_NAMES = {
	CONTAINER: "details-cont",
	ITEM: "details-item",
	DESC: "details-desc",
	INFO: "details-info",
	TITLE: "details-desc-title",
	PROPERTY: "details-property",
	DESC_URL: "details-desc-url",
	NO_DATA: "analysis-no-data",
} as const;

// Типизация
interface UrlDetailsProps {
	urlAnalysisResults: UrlVirusTotalResponse | null;
}

// Утилита для рендеринга ключ-значение
const renderDetail = (label: string, value?: string | number) => (
	value && (
		<li className={CLASS_NAMES.INFO}>
			<strong>{label}</strong>
			<span>{value}</span>
		</li>
	)
);

// Подкомпоненты
const CategoriesSection = ({ categories, t }: { categories: Record<string, string>, t: TFunction }) => (
	categories && Object.keys(categories).length > 0 && (
		<li className={CLASS_NAMES.ITEM}>
			<h1>{t('analysisPage.analyzedData.details.url.categories')}</h1>
			<ul className={CLASS_NAMES.CONTAINER}>
				{Object.entries(categories).map(([key, value]) => (
					<li className={CLASS_NAMES.PROPERTY} key={key}>
						<span>{key}</span> <span>{value}</span>
					</li>
				))}
			</ul>
		</li>
	)
);

const HistorySection = ({ attributes, t }: { attributes: UrlVirusTotalResponse['data']['attributes'], t: TFunction }) => (
	attributes?.first_submission_date && (
		<li className={CLASS_NAMES.ITEM}>
			<h1>{t('analysisPage.analyzedData.details.url.history')}</h1>
			<ul className={CLASS_NAMES.CONTAINER}>
				{renderDetail(t('analysisPage.analyzedData.details.url.firstSubmition'), convertTimestamp(attributes.first_submission_date))}
				{renderDetail(t('analysisPage.analyzedData.details.url.lastSubmission'), convertTimestamp(attributes.last_submission_date))}
				{renderDetail(t('analysisPage.analyzedData.details.url.lastAnalysis'), convertTimestamp(attributes.last_analysis_date))}
			</ul>
		</li>
	)
);

const HttpResponseSection = ({ attributes, t }: { attributes: UrlVirusTotalResponse['data']['attributes'], t: TFunction }) => (
	attributes?.last_http_response_headers && Object.keys(attributes.last_http_response_headers).length > 0 && (
		<li className={CLASS_NAMES.ITEM}>
			<h1>{t('analysisPage.analyzedData.details.url.http')}</h1>
			<ul className={CLASS_NAMES.CONTAINER}>
				{renderDetail(t('analysisPage.analyzedData.details.url.url'), attributes.url)}
				{renderDetail(t('analysisPage.analyzedData.details.url.status'), attributes.last_http_response_code)}
				{renderDetail(t('analysisPage.analyzedData.details.url.body'), attributes.last_http_response_content_length && formatBytes(attributes.last_http_response_content_length))}
				{renderDetail(t('analysisPage.analyzedData.details.url.sha256'), attributes.last_http_response_content_sha256)}
				<li className={CLASS_NAMES.TITLE}>{t('analysisPage.analyzedData.details.url.headers')}</li>
				{Object.entries(attributes.last_http_response_headers).map(([key, value]) => (
					<li className={`${CLASS_NAMES.DESC} ${CLASS_NAMES.DESC_URL}`} key={key}>
						<span>{key}</span> <span>{String(value)}</span>
					</li>
				))}
			</ul>
		</li>
	)
);

const HtmlInfoSection = ({ attributes, t }: { attributes: UrlVirusTotalResponse['data']['attributes'], t: TFunction }) => (
	attributes?.html_meta && Object.keys(attributes.html_meta).length > 0 && (
		<li className={CLASS_NAMES.ITEM}>
			<h1>{t('analysisPage.analyzedData.details.url.html')}</h1>
			<ul className={CLASS_NAMES.CONTAINER}>
				{renderDetail(t('analysisPage.analyzedData.details.url.title'), attributes.title)}
				<li className={CLASS_NAMES.TITLE}>{t('analysisPage.analyzedData.details.url.meta')}</li>
				{Object.entries(attributes.html_meta).map(([key, value]) => (
					<li className={`${CLASS_NAMES.DESC} ${CLASS_NAMES.DESC_URL}`} key={key}>
						<span>{key}</span>
						<span>{Array.isArray(value) ? value.join(", ") : String(value)}</span>
					</li>
				))}
			</ul>
		</li>
	)
);

// Основной компонент
export default function UrlDetails({ urlAnalysisResults }: UrlDetailsProps) {
	const { t } = useTranslation();
	const attributes = urlAnalysisResults?.data?.attributes;

	if (!urlAnalysisResults || !urlAnalysisResults.data || !attributes) {
		return <p className={CLASS_NAMES.NO_DATA}>No data</p>;
	}

	return (
		<>
			<CategoriesSection categories={attributes.categories} t={t} />
			<HistorySection attributes={attributes} t={t} />
			<HttpResponseSection attributes={attributes} t={t} />
			<HtmlInfoSection attributes={attributes} t={t} />
		</>
	);
}