import './VulnerabilitiesPage.css'
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LeakChecker from '../../components/VulnerabilitiesComponents/LeakChecker/LeakChecker';
import ShortLinkDecoder from '../../components/VulnerabilitiesComponents/ShortLinkDecoder/ShortLinkDecoder';

export default function VulnerabilitiesPage() {
	const { t } = useTranslation();

	return (
		<div className='section'>
			<motion.div
				className="vulnerabilities-page"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<h1 className="page-title">{t('vulnerabilitiesPage.title')}</h1>
				<h2 className="page-subtitle">{t('vulnerabilitiesPage.subtitle')}</h2>
				<div className='vulnerabilities'>
					<LeakChecker />
					<ShortLinkDecoder />
				</div>
			</motion.div>
		</div>
	)
}