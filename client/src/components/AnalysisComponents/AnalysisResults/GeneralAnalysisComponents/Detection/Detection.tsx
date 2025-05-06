import './Detection.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import { useTranslation } from 'react-i18next';

// Подкомпонент для отображения результата анализа от одного движка
const DetectionItem = ({ engine, result, category, isFile }: { engine: string; result: string; category?: string; isFile: boolean }) => {
	const { t } = useTranslation();

	// Объекты с иконками для разных типов результатов
	const resultIcons: Record<string, string> = {
		malware: 'exclamation-warning.svg',
		suspicious: 'attention.svg',
		clean: 'green-checkmark.svg',
		unrated: 'question-mark.svg',
	};

	const resultFileIcons: Record<string, string> = {
		undetected: 'green-checkmark.svg',
		'type-unsupported': 'unsupported.svg',
	};

	// Объект с переводами результатов
	const resultTranslations: Record<string, string> = {
		malware: t('analysisPage.analyzedData.detection.malware'),
		suspicious: t('analysisPage.analyzedData.detection.suspicious'),
		clean: t('analysisPage.analyzedData.detection.clean'),
		unrated: t('analysisPage.analyzedData.detection.unrated'),
		undetected: t('analysisPage.analyzedData.detection.undetected'),
		'type-unsupported': t('analysisPage.analyzedData.detection.typeUnsupported'),
		timeout: t('analysisPage.analyzedData.detection.timeout'),
		failure: t('analysisPage.analyzedData.detection.failure'),
	};

	// Логика определения результата и стилей
	const displayResult = isFile ? category : result;
	const translatedResult = resultTranslations[displayResult || ''] || displayResult;

	const unratedCategories = ['unrated', 'type-unsupported', 'timeout', 'failure'];
	const spanClass = unratedCategories.includes(displayResult || '') ? 'result-unrated' : '';

	const iconSrc = isFile
		? resultFileIcons[category || ''] || 'question-mark.svg'
		: resultIcons[result] || 'question-mark.svg';

	return (
		<li className="category-detection">
			<strong>{engine}</strong>
			<img className="result-icon" src={iconSrc} alt={displayResult} />
			<span className={spanClass}>{translatedResult}</span>
		</li>
	);
};

// Основной компонент для отображения результатов анализа
export default function Detection() {
	// Получение данных из Redux
	const { selectedOption, ipAnalysisResults, domainAnalysisResults, urlAnalysisResults, fileAnalysisResults } = useSelector((state: RootState) => state.analysis);

	// Выбор данных в зависимости от типа анализа (IP, домен, URL, файл)
	let data;
	switch (selectedOption) {
		case 'ip': data = ipAnalysisResults; break;
		case 'domain': data = domainAnalysisResults; break;
		case 'url': data = urlAnalysisResults; break;
		case 'file': data = fileAnalysisResults; break;
		default: data = null; break;
	}

	// Проверка наличия данных
	if (!data || !data.data.attributes) {
		return <p className="analysis-no-data">No data</p>;
	}

	// Настройка приоритетов для сортировки результатов
	const priority = {
		malware: 1,
		suspicious: 2,
		clean: 3,
		unrated: 4,
	} as const;

	// Сортировка результатов по приоритету (от более критичных к менее критичным)
	const getPriority = (result: string) => priority[result as keyof typeof priority] ?? 4;
	const { last_analysis_results } = data.data.attributes;
	const sortedResults = Object.entries(last_analysis_results || {}).sort(([, a], [, b]) =>
		getPriority(a.result) - getPriority(b.result)
	);

	// Рендеринг списка результатов
	return (
		<div className="analysis-detections">
			<ul className="detection">
				{sortedResults.map(([engine, result]) => (
					<DetectionItem
						key={engine}
						engine={result.engine_name}
						result={result.result}
						category={result.category}
						isFile={selectedOption === 'file'}
					/>
				))}
			</ul>
		</div>
	);
}