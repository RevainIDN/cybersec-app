import './AnalysisPage.css'
import { motion } from 'framer-motion';
import AnalysisInput from '../../components/AnalysisComponents/AnalysisInput/AnalysisInput';
import IpDomainAnalysis from '../../components/AnalysisComponents/AnalysisResults/IpDomainAnalysis/IpDomainAnalysis';

export default function IpPage() {
	return (
		<motion.div
			className="analysis-page"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<AnalysisInput />
			<IpDomainAnalysis />
		</motion.div>
	)
}