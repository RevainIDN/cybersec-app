import { IpVirusTotalResponse } from "../../../../../../types/AnalysisTypes/analysisResultsTypes";

interface IpDetailsProps {
	ipAnalysisResults: IpVirusTotalResponse | null;
}

export default function IpDetails({ ipAnalysisResults }: IpDetailsProps) {
	// Деструктурируем атрибуты из данных анализа IP
	const { attributes } = ipAnalysisResults?.data || {};

	// Если нет данных о IP, отображаем сообщение "Данные не обнаружены"
	if (!ipAnalysisResults || !ipAnalysisResults.data || !ipAnalysisResults.data.attributes) {
		return <p className="analysis-no-data">Данные не обнаружены</p>;
	}

	return (
		<>
			<li className='details-item ip-details'>
				<span><strong>Сеть:</strong> {ipAnalysisResults.data.attributes.network}</span>
				<span><strong>Номер автономной системы(ASN):</strong> {ipAnalysisResults.data.attributes.asn}</span>
				<span><strong>Владелец сети:</strong> {ipAnalysisResults.data.attributes.as_owner}</span>
				<span><strong>Региональный Интернет-регистратор:</strong> {ipAnalysisResults.data.attributes.regional_internet_registry}</span>
				<span><strong>Страна:</strong> {ipAnalysisResults.data.attributes.country}</span>
				<span><strong>Континент:</strong> {ipAnalysisResults.data.attributes.continent}</span>
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