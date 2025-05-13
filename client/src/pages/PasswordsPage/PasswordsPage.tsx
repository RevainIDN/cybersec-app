import './PasswordsPage.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PasswordCheck from '../../components/PasswordsComponents/PasswordCheck/PasswordCheck';
import PasswordGenerator from '../../components/PasswordsComponents/PasswordGenerator/PasswordGenerator';
import PasswordListGenerator from '../../components/PasswordsComponents/PasswordListGenerator/PasswordListGenerator';
import QADropDownList from '../../components/GeneralComponents/QUDropDownList/QADropDownList';

export default function PasswordsPage() {
	const { t } = useTranslation();

	// UI Хук для отслеживания видимости элементов
	const { ref, inView } = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	const { pathname } = useLocation();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	const qaItems = [
		{ question: 'question1', answer: 'answer1' },
		{ question: 'question2', answer: 'answer2' },
		{ question: 'question3', answer: 'answer3' },
		{ question: 'question4', answer: 'answer4' },
	];

	return (
		<div className='section'>
			<motion.div
				className="passwords-page"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<h1 className="page-title">{t('passwordPage.passwordCheck.title')}</h1>
				<h2 className="page-subtitle">{t('passwordPage.passwordCheck.subtitle')}</h2>
				<PasswordCheck />
				<h1 className="page-title">{t('passwordPage.PasswordGenerator.title')}</h1>
				<h2 className="page-subtitle">{t('passwordPage.PasswordGenerator.subtitle')}</h2>
				<div className="password-generator-cont section">
					<div className="password-generator-wrapper">
						<PasswordGenerator />
						<PasswordListGenerator />
					</div>
					<motion.ul
						className="qa-list"
						ref={ref}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
						transition={{ duration: 0.5 }}
					>
						{qaItems.map((item, index) => (
							<QADropDownList
								key={index}
								question={t(`passwordPage.PasswordGenerator.qaDropDown.${item.question}`)}
								answer={t(`passwordPage.PasswordGenerator.qaDropDown.${item.answer}`)}
							/>
						))}
					</motion.ul>
				</div>
			</motion.div>
		</div>
	);
}