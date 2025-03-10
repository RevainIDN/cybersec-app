import './GeneralInfo.css';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../../../store';
import { timeAgo } from '../../../../../utils/timeAgo';
import { formatBytes } from '../../../../../utils/formatBytes';
import ProgressCircle from '../ProgressCircle/ProgressCircle';
import { TFunction } from 'i18next';

// Константы для классов
const CLASS_NAMES = {
	DETAILS: 'analysis-details',
	SCALE: 'analysis-scale',
	PROGRESS: 'analysis-progress',
	INFO: 'analysis-info',
	NOTIFICATION: 'analysis-notification',
	ALERT: 'analysis-notification-alert',
	DYNAMIC_ITEM: 'analysis-dynamic-item',
	NO_DATA: 'analysis-no-data',
} as const;

// Типы для selectedOption
type AnalysisOption = 'ip' | 'domain' | 'url' | 'file';

// Получение данных в зависимости от выбранной опции
const getAnalysisData = (selectedOption: string | null, state: RootState) => {
	if (!selectedOption) return null;
	switch (selectedOption as AnalysisOption) {
		case 'ip': return state.analysis.ipAnalysisResults;
		case 'domain': return state.analysis.domainAnalysisResults;
		case 'url': return state.analysis.urlAnalysisResults;
		case 'file': return state.analysis.fileAnalysisResults;
		default: return null;
	}
};

// Подкомпоненты для специфичных данных
const IpDetails = ({ id }: { id: string }) => (
	<h2 className={CLASS_NAMES.DYNAMIC_ITEM}>{id}</h2>
);

const DomainDetails = ({ id, attributes, t }: { id: string, attributes: any, t: TFunction }) => (
	<>
		<h2 className={CLASS_NAMES.DYNAMIC_ITEM}>{id}</h2>
		{attributes.registrar && (
			<h2 className={CLASS_NAMES.DYNAMIC_ITEM}>
				{t('analysisPage.analyzedData.generalInfo.registration')} {attributes.registrar}
			</h2>
		)}
		{attributes.creation_date && (
			<h2 className={CLASS_NAMES.DYNAMIC_ITEM}>
				{t('analysisPage.analyzedData.generalInfo.creationDate')} {timeAgo(attributes.creation_date, t)}
			</h2>
		)}
	</>
);

const UrlDetails = ({ attributes, t }: { attributes: any, t: TFunction }) => (
	<>
		<h2 className={CLASS_NAMES.DYNAMIC_ITEM}>{attributes.url}</h2>
		{attributes.last_http_response_code && (
			<h2 className={CLASS_NAMES.DYNAMIC_ITEM}>
				{t('analysisPage.analyzedData.generalInfo.status')} {attributes.last_http_response_code}
			</h2>
		)}
	</>
);

const FileDetails = ({ id, attributes }: { id: string, attributes: any }) => (
	<>
		<h2 className={CLASS_NAMES.DYNAMIC_ITEM}>{id}</h2>
		{attributes.meaningful_name && (
			<h2 className={CLASS_NAMES.DYNAMIC_ITEM}>{attributes.meaningful_name}</h2>
		)}
		{attributes.size && (
			<h2 className={CLASS_NAMES.DYNAMIC_ITEM}>{formatBytes(attributes.size)}</h2>
		)}
	</>
);

// Основной компонент
export default function GeneralInfo() {
	const { t } = useTranslation();

	// Получение выбранного типа анализа из Redux
	const { selectedOption } = useSelector((state: RootState) => state.analysis);
	// Загрузка данных анализа
	const data = getAnalysisData(selectedOption, useSelector((state: RootState) => state));

	// Проверка на отсутствие данных
	if (!data || !data.data) {
		return <p className={CLASS_NAMES.NO_DATA}>{t('analysisPage.analyzedData.generalInfo.noData')}</p>;
	}

	// Деструктуризация атрибутов данных
	const { last_analysis_results, last_analysis_date, reputation } = data.data.attributes;

	// Подсчет заражённых элементов и общего числа проверок
	const infectedCount = last_analysis_results
		? Object.values(last_analysis_results).filter((result) => result.result === 'malware').length
		: 0;
	const totalChecks = last_analysis_results ? Object.keys(last_analysis_results).length : 1;

	// Словарь меток для типов анализа
	const typeLabels: Record<AnalysisOption, string> = {
		ip: t('analysisPage.analyzedData.generalInfo.malwareAlertIp'),
		domain: t('analysisPage.analyzedData.generalInfo.malwareAlertDomain'),
		url: t('analysisPage.analyzedData.generalInfo.malwareAlertUrl'),
		file: t('analysisPage.analyzedData.generalInfo.malwareAlertFile'),
	};
	const typeLabel = selectedOption ? typeLabels[selectedOption as AnalysisOption] || '' : t('analysisPage.analyzedData.generalInfo.malwareAlertObject');

	// Функция рендеринга специфичных деталей в зависимости от типа анализа
	const renderSpecificDetails = () => {
		if (!selectedOption) return null;
		switch (selectedOption as AnalysisOption) {
			case 'ip': return <IpDetails id={data.data.id} />;
			case 'domain': return <DomainDetails id={data.data.id} attributes={data.data.attributes} t={t} />;
			case 'url': return <UrlDetails attributes={data.data.attributes} t={t} />;
			case 'file': return <FileDetails id={data.data.id} attributes={data.data.attributes} />;
			default: return null;
		}
	};

	return (
		<div className={CLASS_NAMES.DETAILS}>
			<div className={CLASS_NAMES.SCALE}>
				<div className={CLASS_NAMES.PROGRESS}>
					<ProgressCircle totalChecks={totalChecks} infectedCount={infectedCount} />
					<h2>{t('analysisPage.analyzedData.generalInfo.reputation')} {reputation}</h2>
				</div>
				<div className={CLASS_NAMES.INFO}>
					<h2
						className={`${CLASS_NAMES.NOTIFICATION} ${infectedCount > 0 ? CLASS_NAMES.ALERT : ''}`}
					>
						{infectedCount}/{totalChecks} {t('analysisPage.analyzedData.generalInfo.malwareAlert1')} {typeLabel} {t('analysisPage.analyzedData.generalInfo.malwareAlert2')}
					</h2>
					<div className="analysis-dynamic-info">
						{last_analysis_date && (
							<h2 className={CLASS_NAMES.DYNAMIC_ITEM}>
								{t('analysisPage.analyzedData.generalInfo.lastAnalysisDate')} {timeAgo(last_analysis_date, t)}
							</h2>
						)}
						{renderSpecificDetails()}
					</div>
				</div>
			</div>
		</div>
	);
}