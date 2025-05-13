import './ReportsPage.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlobalReports from '../../components/ReportsComponents/GlobalReports/GlobalReports';

export default function ReportsPage() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return (
		<div className='section'>
			<motion.div
				className="report-page"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<GlobalReports />
			</motion.div>
		</div>
	)
}