import './IpDomainAnalysis.css';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { timeAgo } from '../../../../utils/timeAgo';
import ProgressCircle from '../GeneralAnalysisComponents/ProgressCircle/ProgressCircle';
import Details from '../GeneralAnalysisComponents/Details/Details';
import Detection from '../GeneralAnalysisComponents/Detection/Detection';
import Loading from '../../../GeneralComponents/Loading/Loading';

export default function IpDomainAnalysis() {
	// Глобальные состояния
	const { isLoading, selectedOption, ipAnalysisResults, domainAnalysisResults } = useSelector((state: RootState) => state.analysis);

	// Локальное логическое состояние
	const [selectedResultsOption, setSelectedOption] = useState<string | null>('detection');

	// Логика определения данных взависимости от выбранного типа анализа
	const data = selectedOption === 'ip' ? ipAnalysisResults : domainAnalysisResults;

	// Рендер при отсутствие данных
	if (!data || !data.data) return <p className='analysis-no-data'>Нет данных</p>;

	// Рендер при загрузке данных
	if (isLoading) { return (<Loading />) }

	// Деструктуризация объектов данных
	const { last_analysis_results, last_analysis_date, reputation } = data.data.attributes;

	// Определение количества вредоносных ip/доменов анализирующими сервисами
	const infectedCount = last_analysis_results
		? Object.values(last_analysis_results).filter((result) => result.result === 'malware').length
		: 0;

	// Общее количество анализирующих сервисов
	const totalChecks = last_analysis_results ? Object.keys(last_analysis_results).length : 1;

	// Обработчик переключения типа выводимых данных
	const handleClickOption = (e: React.MouseEvent<HTMLElement>) => {
		const value = e.currentTarget.getAttribute('data-value');
		setSelectedOption(value);
	}

	return (
		<div className='analysis-result'>
			<div className='analysis-details'>
				<div className='analysis-scale'>
					<div className='analysis-progress'>
						<ProgressCircle
							totalChecks={totalChecks}
							infectedCount={infectedCount}
						/>
						<h2>Репутация: {reputation}</h2>
					</div>
					<div className='analysis-info'>
						<h2 className={`analysis-notification ${infectedCount > 0 ? 'analysis-notification-alert' : ''}`}>
							{infectedCount}/{totalChecks} поставщиков безопасности пометили этот {ipAnalysisResults ? 'IP адрес' : 'домен'} как вредоносный
						</h2>
						<div className='analysis-dynamic-info'>
							<h2 className='analysis-dynamic-item'>{data.data.id}</h2>
							<h2 className='analysis-dynamic-item'>{last_analysis_date && `Дата последнего анализа: ${timeAgo(last_analysis_date)}`}</h2>
							{selectedOption === 'domain' &&
								<>
									<h2 className='analysis-dynamic-item'>
										{domainAnalysisResults?.data.attributes.registrar && `Регистрация: ${domainAnalysisResults?.data.attributes.registrar}`}
									</h2>
									<h2 className='analysis-dynamic-item'>
										{domainAnalysisResults?.data.attributes.creation_date && `Дата создания: ${timeAgo(domainAnalysisResults.data.attributes.creation_date)}`}
									</h2>
								</>}
						</div>
					</div>
				</div>
			</div>
			<div className='analysis-btns'>
				<button
					className={`analysis-btn ${selectedResultsOption === 'detection' ? 'analysis-btn--active' : ''}`}
					data-value='detection'
					onClick={handleClickOption}
				>
					Обнаружение
				</button>
				<button
					className={`analysis-btn ${selectedResultsOption === 'details' ? 'analysis-btn--active' : ''}`}
					data-value='details'
					onClick={handleClickOption}
				>
					Детали
				</button>
			</div>
			{selectedResultsOption === 'detection' && <Detection />}
			{selectedResultsOption === 'details' && <Details />}
		</div>
	);
}