import './Details.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import IpDetails from './IpDetails/IpDetails';
import DomainDetails from './DomainDetails/DomainDetails';

export default function Details() {
	// Глобальные состояния
	const { selectedOption, ipAnalysisResults, domainAnalysisResults } = useSelector((state: RootState) => state.analysis);

	// Логика определения данных взависимости от выбранного типа анализа
	const data = selectedOption === 'ip' ? ipAnalysisResults : domainAnalysisResults;
	console.log(data);

	// Рендер при отсутствие данных
	if (!data || !data.data.attributes) { return <p className='analysis-no-data'>Нет данных</p> }

	return (
		<ul className='details'>
			{selectedOption === 'ip' ? (
				<IpDetails ipAnalysisResults={ipAnalysisResults} />
			) : (
				<DomainDetails domainAnalysisResults={domainAnalysisResults} />
			)}
		</ul>
	);
}