import { IpVirusTotalResponse } from "../../../../../../types/AnalysisTypes/analysisResultsTypes";
import { useTranslation } from "react-i18next";

interface IpDetailsProps {
	ipAnalysisResults: IpVirusTotalResponse | null;
}

export default function IpDetails({ ipAnalysisResults }: IpDetailsProps) {
	const { t } = useTranslation();

	// Деструктурируем атрибуты из данных анализа IP
	const { attributes } = ipAnalysisResults?.data || {};

	// Если нет данных о IP, отображаем сообщение "Данные не обнаружены"
	if (!ipAnalysisResults || !ipAnalysisResults.data || !ipAnalysisResults.data.attributes) {
		return <p className="analysis-no-data">No data</p>;
	}

	return (
		<>
			{/* Основная информация */}
			<li className='details-item ip-details'>
				<h1>{t('analysisPage.analyzedData.details.ip.properties')}</h1>
				<span><strong>{t('analysisPage.analyzedData.details.ip.network')}</strong> {ipAnalysisResults.data.attributes.network}</span>
				<span><strong>{t('analysisPage.analyzedData.details.ip.asn')}</strong> {ipAnalysisResults.data.attributes.asn}</span>
				<span><strong>{t('analysisPage.analyzedData.details.ip.asl')}</strong> {ipAnalysisResults.data.attributes.as_owner}</span>
				<span><strong>{t('analysisPage.analyzedData.details.ip.rir')}</strong> {ipAnalysisResults.data.attributes.regional_internet_registry}</span>
				<span><strong>{t('analysisPage.analyzedData.details.ip.country')}</strong> {ipAnalysisResults.data.attributes.country}</span>
				<span><strong>{t('analysisPage.analyzedData.details.ip.continent')}</strong> {ipAnalysisResults.data.attributes.continent}</span>
			</li>

			{/* WHOIS информация */}
			{attributes?.whois && attributes.whois.trim().length > 0 && (
				<li className="details-item">
					<h1>WHOIS</h1>
					<ul className="details-cont">
						{attributes.whois.split("\n").map((line, index) => (
							<li key={index}><span>{line}</span></li>
						))}
					</ul>
				</li>
			)}
		</>
	);
}