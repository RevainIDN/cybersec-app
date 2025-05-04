import '../LandingStyles/ThreatCaseSection.css';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function ThreatCaseSection() {
	const { t } = useTranslation();
	const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

	return (
		<motion.section
			ref={ref}
			className='threat-cont section'
			initial={{ opacity: 0 }}
			animate={inView ? { opacity: 1 } : {}}
			transition={{ duration: 1 }}
		>
			<div className='threat-info'>
				<h1 className='threat-title title'>{t('homePage.threatCaseSection.title')}</h1>
				<h2 className='threat-subtitle subtitle'>{t('homePage.threatCaseSection.subtitle')}</h2>
				<p className='threat-case'><strong>{t('homePage.threatCaseSection.strongCase')}</strong>{t('homePage.threatCaseSection.case')}</p>
				<p className='threat-solution'><strong>{t('homePage.threatCaseSection.strongSolution')}</strong>{t('homePage.threatCaseSection.solution')}</p>
				<p className='threat-result'><strong>{t('homePage.threatCaseSection.strongResult')}</strong>{t('homePage.threatCaseSection.result')}</p>
			</div>
			<div className='threat-image-cont'>
				<img className='threat-image' src="landing_4.svg" alt="Landing Image" loading='lazy' />
			</div>
		</motion.section>
	);
}