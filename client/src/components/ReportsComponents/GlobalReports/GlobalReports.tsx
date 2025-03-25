import './GlobalReports.css'
import ReportItem from './ReportItem/ReportItem';
import reportsData from './reportsData.json';
import { ReportItemData } from '../../../types/ReportsTypes/globalReportsTypes';

const typedReportsData = reportsData as ReportItemData[];

export default function GlobalReports() {
	return (
		<div className='global-reports'>
			{typedReportsData.map((item, index) => (
				<ReportItem key={index} item={item} index={index} />
			))}
		</div>
	);
}