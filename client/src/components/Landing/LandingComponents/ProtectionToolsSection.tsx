import '../LandingStyles/ProtectionToolsSection.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { setCurrentLink } from '../../../store/generalSlice';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const aboutCards = [
	{
		titleKey: "homePage.protectionToolsSection.cards.card1.title",
		subtitleKey: "homePage.protectionToolsSection.cards.card1.description",
		buttonKey: "homePage.protectionToolsSection.cards.card1.button",
		imgSrc: "icons/about1-card_icon.svg",
		link: "/analysis"
	},
	{
		titleKey: "homePage.protectionToolsSection.cards.card2.title",
		subtitleKey: "homePage.protectionToolsSection.cards.card2.description",
		buttonKey: "homePage.protectionToolsSection.cards.card2.button",
		imgSrc: "icons/about2-card_icon.svg",
		link: "/vulnerabilities"
	},
	{
		titleKey: "homePage.protectionToolsSection.cards.card3.title",
		subtitleKey: "homePage.protectionToolsSection.cards.card3.description",
		buttonKey: "homePage.protectionToolsSection.cards.card3.button",
		imgSrc: "icons/about3-card_icon.svg",
		link: "/passwords"
	},
	{
		titleKey: "homePage.protectionToolsSection.cards.card4.title",
		subtitleKey: "homePage.protectionToolsSection.cards.card4.description",
		buttonKey: "homePage.protectionToolsSection.cards.card4.button",
		imgSrc: "icons/about4-card_icon.svg",
		link: "/reports"
	}
];

export default function ProtectionToolsSection() {
	const dispatch = useDispatch<AppDispatch>();
	const { t } = useTranslation();
	const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

	return (
		<motion.section
			ref={ref}
			className='about-cont section'
			initial={{ opacity: 0 }}
			animate={inView ? { opacity: 1 } : {}}
			transition={{ duration: 1 }}
		>
			<div className='about-intro'>
				<img className='about-img' src='landing_3.svg' alt='Landing' loading='lazy' />
				<div className='about-title-cont'>
					<h1 className='about-title title'>{t('homePage.protectionToolsSection.title')}</h1>
					<h2 className='about-subtitle subtitle'>{t('homePage.protectionToolsSection.subtitle')}</h2>
				</div>
			</div>
			<ul className='about-cards'>
				{aboutCards.map((card, index) => (
					<motion.li
						key={index}
						className='about-card'
						initial={{ opacity: 0, y: 50 }}
						animate={inView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.4, delay: index * 0.2 }}
					>
						<div className='card-info-cont'>
							<div className='card-title-cont'>
								<img className='card-img' src={card.imgSrc} alt='Icon' />
								<h1 className='card-title'>{t(card.titleKey)}</h1>
							</div>
							<h2 className='card-subtitle subtitle'>{t(card.subtitleKey)}</h2>
						</div>
						<Link to={card.link} className='card-btn-cont' onClick={() => dispatch(setCurrentLink(card.link))}>
							<button className='card-btn button'>{t(card.buttonKey)}</button>
						</Link>
					</motion.li>
				))}
			</ul>
		</motion.section>
	);
}