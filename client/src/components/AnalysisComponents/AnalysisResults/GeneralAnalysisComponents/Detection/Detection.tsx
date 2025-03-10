import './Detection.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';

// Подкомпонент для отображения результата анализа от одного движка
const DetectionItem = ({ engine, result, category, isFile }: { engine: string; result: string; category?: string; isFile: boolean }) => {
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

	// Логика определения результата и стилей
	const unratedCategories = ['unrated', 'type-unsupported', 'timeout', 'failure'];
	const displayResult = isFile ? category : result;
	const iconSrc = isFile
		? resultFileIcons[category || ''] || 'question-mark.svg'
		: resultIcons[result] || 'question-mark.svg';
	const spanClass = unratedCategories.includes(displayResult || '') ? 'result-unrated' : '';

	return (
		<li className="category-detection">
			<strong>{engine}</strong>
			<img className="result-icon" src={iconSrc} alt={displayResult} />
			<span className={spanClass}>{displayResult}</span>
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