import '../LandingStyles/ServicesSection.css';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const serviceBlocks = [
	{
		titleKey: "homePage.servicesSection.blocks.checkIp.title",
		subtitleKey: "homePage.servicesSection.blocks.checkIp.description",
		imgSrc: "icons/service1-block_icon.svg"
	},
	{
		titleKey: "homePage.servicesSection.blocks.dataLeaks.title",
		subtitleKey: "homePage.servicesSection.blocks.dataLeaks.description",
		imgSrc: "icons/service2-block_icon.svg"
	},
	{
		titleKey: "homePage.servicesSection.blocks.passwords.title",
		subtitleKey: "homePage.servicesSection.blocks.passwords.description",
		imgSrc: "icons/service3-block_icon.svg"
	},
	{
		titleKey: "homePage.servicesSection.blocks.reports.title",
		subtitleKey: "homePage.servicesSection.blocks.reports.description",
		imgSrc: "icons/service4-block_icon.svg"
	}
];

const ServiceBlock = ({ titleKey, subtitleKey, imgSrc }: { titleKey: string, subtitleKey: string, imgSrc: string }) => {
	const { t } = useTranslation();
	const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

	return (
		<motion.li
			ref={ref}
			className='services-block'
			initial={{ opacity: 0, y: 50 }}
			animate={inView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			<img className='block-img' src={imgSrc} alt={t(titleKey)} />
			<div className='block-info'>
				<h1 className='block-title'>{t(titleKey)}</h1>
				<h2 className='block-subtitle'>{t(subtitleKey)}</h2>
			</div>
		</motion.li>
	);
};

export default function ServicesSection() {
	const { t } = useTranslation();
	const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

	return (
		<section className='services-cont section'>
			<motion.div
				ref={ref}
				className='services-info'
				initial={{ opacity: 0 }}
				animate={inView ? { opacity: 1 } : {}}
				transition={{ duration: 1 }}
			>
				<h1 className='services-title title'>{t("homePage.servicesSection.title")}</h1>
				<h2 className='services-subtitle subtitle'>{t("homePage.servicesSection.subtitle")}</h2>
				<ul className='services-blocks'>
					{serviceBlocks.map((block, index) => (
						<ServiceBlock
							key={index}
							titleKey={block.titleKey}
							subtitleKey={block.subtitleKey}
							imgSrc={block.imgSrc}
						/>
					))}
				</ul>
			</motion.div>
			<motion.div
				className='service-img-cont'
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
			>
				<img className='services-img' src="landing_2.svg" alt="Landing Image" loading='lazy' />
			</motion.div>
		</section>
	);
}