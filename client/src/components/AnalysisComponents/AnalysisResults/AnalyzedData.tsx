import './AnalyzedData.css'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import GeneralInfo from './GeneralAnalysisComponents/GeneralInfo/GeneralInfo';
import Details from './GeneralAnalysisComponents/Details/Details';
import Detection from './GeneralAnalysisComponents/Detection/Detection';
import ResultsSwitchingButtons from './GeneralAnalysisComponents/ResultsSwitchingButtons/ResultsSwitchingButtons';

export default function AnalyzedData() {
	// Глобальные состояния из Redux
	const { isLoading, selectedOption, ipAnalysisResults, domainAnalysisResults, urlAnalysisResults, fileAnalysisResults } = useSelector((state: RootState) => state.analysis);
	// Локальное логическое состояние
	const [selectedResultsOption, setSelectedOption] = useState<string | null>('detection');

	// Логика для выбора данных в зависимости от selectedOption
	let data;
	switch (selectedOption) {
		case 'ip':
			data = ipAnalysisResults;
			break;
		case 'domain':
			data = domainAnalysisResults;
			break;
		case 'url':
			data = urlAnalysisResults;
			break;
		case 'file':
			data = fileAnalysisResults;
			break;
		default:
			data = null;
			break;
	}
	// Рендер при отсутствие данных
	if (!data || !data.data) return null;

	return (
		isLoading ? (
			null
		) : (
			<div className='analysis-result'>
				<GeneralInfo />
				<ResultsSwitchingButtons
					selectedResultsOption={selectedResultsOption}
					setSelectedOption={setSelectedOption}
				/>
				{selectedResultsOption === 'detection' && <Detection />}
				{selectedResultsOption === 'details' && <Details />}
			</div>
		)
	);
}