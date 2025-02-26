import { DomainVirusTotalResponse } from "../../../../../../types/AnalysisTypes/analysisResultsTypes";
import { convertTimestamp } from "../../../../../../utils/convertTimestamp";

interface DomainDetailsProps {
	domainAnalysisResults: DomainVirusTotalResponse | null;
}

export default function DomainDetails({ domainAnalysisResults }: DomainDetailsProps) {
	// Деструктурируем атрибуты из данных анализа IP
	const { attributes } = domainAnalysisResults?.data || {};

	// Функция для рендеринга таблиц данных (DNS, сертификат, популярность)
	const renderTable = (headers: string[], rows: any[], columns: string[]) => (
		<table className="details-table">
			<thead>
				<tr>
					{headers.map((header, idx) => (
						<th key={idx}>{header}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.map((row, idx) => (
					<tr key={idx}>
						{columns.map((col) => (
							<td key={col}>{row[col]}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);

	// Проверка на наличие данных на странице
	const hasData = attributes && (
		(attributes.categories && Object.keys(attributes.categories).length > 0) ||
		(attributes.popularity_ranks && Object.keys(attributes.popularity_ranks).length > 0) ||
		(attributes.last_dns_records && Object.keys(attributes.last_dns_records).length > 0) ||
		(attributes.last_https_certificate && Object.keys(attributes.last_https_certificate).length > 0) ||
		(attributes.whois && attributes.whois.trim().length > 0)
	);

	return (
		<>
			{hasData ? (
				<>
					{/* Категории домена */}
					{attributes?.categories && Object.keys(attributes.categories).length > 0 && (
						<li className="details-item">
							<h1>Категории</h1>
							<ul className="details-cont">
								{Object.entries(attributes.categories).map(([key, value]) => (
									<li className="details-desc" key={key}>
										<span>{key}:</span> <span>{value}</span>
									</li>
								))}
							</ul>
						</li>
					)}

					{/* Популярность домена */}
					{attributes?.popularity_ranks && Object.keys(attributes.popularity_ranks).length > 0 && (
						<li className="details-item popularity">
							<h1>Популярность</h1>
							{renderTable(
								["Рейтинг", "Позиция", "Время загрузки"],
								Object.entries(attributes.popularity_ranks).map(([key, rankData]) => ({
									rank: rankData.rank,
									position: key,
									timestamp: convertTimestamp(rankData.timestamp),
								})),
								["position", "rank", "timestamp"]
							)}
						</li>
					)}

					{/* Последние записи DNS */}
					{attributes?.last_dns_records && Object.keys(attributes.last_dns_records).length > 0 && (
						<li className="details-item">
							<h1>Последние записи DNS</h1>
							{renderTable(
								["Тип записи", "TTL", "Значение"],
								attributes.last_dns_records,
								["type", "ttl", "value"]
							)}
						</li>
					)}

					{/* Последний HTTPS Сертификат */}
					{attributes?.last_https_certificate && Object.keys(attributes.last_https_certificate).length > 0 && (
						<li className="details-item">
							<h1>Последний HTTPS Сертификат</h1>
							<table className="details-table cert-table">
								<thead>
									<tr>
										<th>Тип записи</th>
										<th>Значение</th>
									</tr>
								</thead>
								<tbody>
									{[
										{ label: "JARM Fingerprint", value: attributes.jarm },
										{ label: "Version", value: attributes.last_https_certificate.version },
										{ label: "Serial Number", value: attributes.last_https_certificate.serial_number },
										{ label: "Thumbprint", value: attributes.last_https_certificate.thumbprint },
										{ label: "Signature Algorithm", value: attributes.last_https_certificate.cert_signature.signature_algorithm },
										{ label: "Issuer", value: `${attributes.last_https_certificate.issuer.C} ${attributes.last_https_certificate.issuer.O} ${attributes.last_https_certificate.issuer.CN}` },
										{ label: "Subject", value: attributes.last_https_certificate.subject.CN },
										{ label: "Subject Public Key Info", value: attributes.last_https_certificate.public_key.algorithm },
										{ label: "Public Key", value: attributes.last_https_certificate.public_key.ec ? 'EC' : 'Unknown' },
									].map((row, idx) => (
										<tr key={idx}>
											<td>{row.label}</td>
											<td>{row.value}</td>
										</tr>
									))}
								</tbody>
							</table>
						</li>
					)}

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
			) : (
				<h1 className="nodata">Данные не обнаружены</h1>
			)}
		</>
	);
}