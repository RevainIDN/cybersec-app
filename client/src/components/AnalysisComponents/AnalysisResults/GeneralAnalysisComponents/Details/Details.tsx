import './Details.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import IpDetails from './IpDetails/IpDetails';
import DomainDetails from './DomainDetails/DomainDetails';
import UrlDetails from './UrlDetails/UrlDetails';
import FileDetails from './FileDetails/FileDetails';

export default function Details() {
	// Глобальные состояния из Redux
	const { selectedOption, ipAnalysisResults, domainAnalysisResults, urlAnalysisResults, fileAnalysisResults } = useSelector((state: RootState) => state.analysis);

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
	if (!data || !data.data.attributes) { return <p className='analysis-no-data'>No data</p> }

	return (
		<ul className='details'>
			{selectedOption === 'ip' && <IpDetails ipAnalysisResults={ipAnalysisResults} />}
			{selectedOption === 'domain' && <DomainDetails domainAnalysisResults={domainAnalysisResults} />}
			{selectedOption === 'url' && <UrlDetails urlAnalysisResults={urlAnalysisResults} />}
			{selectedOption === 'file' && <FileDetails fileAnalysisResults={fileAnalysisResults} />}
		</ul>
	);
}