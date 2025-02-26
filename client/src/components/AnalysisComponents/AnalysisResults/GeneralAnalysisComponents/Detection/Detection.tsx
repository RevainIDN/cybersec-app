import './Detection.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';

export default function Detection() {
	// Глобальные состояния
	const { selectedOption, ipAnalysisResults, domainAnalysisResults } = useSelector((state: RootState) => state.analysis);

	// Логика определения данных взависимости от выбранного типа анализа
	const data = selectedOption === 'ip' ? ipAnalysisResults : domainAnalysisResults;

	// Если нет данных или данных для анализа нет
	if (!data || !data.data.attributes) {
		return <p className='analysis-no-data'>Нет данных</p>;
	}

	// Объект приоритета рендеринга для разных типов результатов анализа
	const priority = {
		malware: 1,
		suspicious: 2,
		clean: 3,
		unrated: 4,
	} as const;

	// Функция для получения приоритета на основе результата анализа
	const getPriority = (result: string) => priority[result as keyof typeof priority] ?? 4;

	// Деструктурируем результаты последних анализов из данных
	const { last_analysis_results } = data.data.attributes;

	// Сортировка результатов анализа по приоритету (от наивысшего к наименьшему)
	const sortedResults = Object.entries(last_analysis_results).sort(([, a], [, b]) => {
		return getPriority(a.result) - getPriority(b.result);
	});

	// Объект с иконками, соответствующими каждому типу результата
	const resultIcons: Record<string, string> = {
		malware: 'exclamation-warning.svg',
		suspicious: 'attention.svg',
		clean: 'green-checkmark.svg',
		unrated: 'question-mark.svg',
	};

	return (
		<div className='analysis-detections'>
			<ul className='detection'>
				{sortedResults.map(([engine, result]) => (
					<li key={engine} className={`category-detection`}>
						<strong>{result.engine_name}</strong>
						<img className="result-icon" src={resultIcons[result.result] || 'question-mark.svg'} alt={result.result} />
						<span className={`${result.result === 'unrated' ? 'result-unrated' : ''}`}>{result.result}</span>
					</li>
				))}
			</ul>
		</div>
	);
}