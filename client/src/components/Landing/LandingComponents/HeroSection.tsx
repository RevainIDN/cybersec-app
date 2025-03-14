import '../LandingStyles/HeroSection.css';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

export default function HeroSection() {
	const { t } = useTranslation();
	const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

	return (
		<div className='section'>
			<motion.div
				ref={ref}
				className='hero-cont'
				initial={{ opacity: 0 }}
				animate={inView ? { opacity: 1 } : {}}
				transition={{ duration: 1 }}
			>
				<img className='hero-img' src='landing_1.svg' alt='Landing Image' />
				<h1 className='hero-title title'>{t('homePage.heroSection.title')}</h1>
				<h2 className='hero-subtitle subtitle'>{t('homePage.heroSection.subtitle')}</h2>
				<button className='hero-btn button'>{t('homePage.heroSection.button')}</button>
			</motion.div>
		</div>
	);
}
