import './ReportsPage.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import GlobalReports from '../../components/ReportsComponents/GlobalReports/GlobalReports';
import PersonalReports from '../../components/ReportsComponents/PersonalReports/PersonalReports';

export default function ReportsPage() {
	const { t } = useTranslation();

	const [selectedReport, setSelectedReport] = useState<'global' | 'personal'>('global');

	return (
		<div className='section'>
			<motion.div
				className="report-page"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<div className='report-selector'>
					<button
						className={`report-btn ${selectedReport === 'global' ? 'report-btn--active' : ''}`}
						onClick={() => setSelectedReport('global')}
					>{t(`reportsPage.globalBtn`)}
					</button>
					<button
						className={`report-btn ${selectedReport === 'personal' ? 'report-btn--active' : ''}`}
						onClick={() => setSelectedReport('personal')}
					>{t(`reportsPage.personalBtn`)}
					</button>
				</div>
				{selectedReport === 'global'
					? <GlobalReports />
					: <PersonalReports />}
			</motion.div>
		</div>
	)
}