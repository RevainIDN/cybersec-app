import './AnalysisPage.css'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import AnalysisInput from '../../components/AnalysisComponents/AnalysisInput/AnalysisInput';
import AnalyzedData from '../../components/AnalysisComponents/AnalysisResults/AnalyzedData';
import Loading from '../../components/GeneralComponents/Loading/Loading';

export default function AnalysisPage() {
	const { isLoading } = useSelector((state: RootState) => state.analysis);

	const { pathname } = useLocation();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return (
		<section className='section'>
			<motion.div
				className="analysis-page"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<AnalysisInput />
				{isLoading && <Loading />}
				<AnalyzedData />
			</motion.div>
		</section>
	)
}