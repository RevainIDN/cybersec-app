import './PasswordsPage.css';
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

	return (
		<motion.div
			className="passwords-page"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<h1 className="passwords-title">{t('passwordPage.passwordCheck.title')}</h1>
			<h2 className="passwords-subtitle">{t('passwordPage.passwordCheck.subtitle')}</h2>
			<PasswordCheck />
			<h1 className="passwords-title">{t('passwordPage.PasswordGenerator.title')}</h1>
			<h2 className="passwords-subtitle">{t('passwordPage.PasswordGenerator.subtitle')}</h2>
			<div className="password-generator-cont">
				<div className="password-generator-wrapper section">
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
					<QADropDownList
						question={t('passwordPage.PasswordGenerator.qaDropDown.question1')}
						answer={t('passwordPage.PasswordGenerator.qaDropDown.answer1')}
					/>
					<QADropDownList
						question={t('passwordPage.PasswordGenerator.qaDropDown.question2')}
						answer={t('passwordPage.PasswordGenerator.qaDropDown.answer2')}
					/>
					<QADropDownList
						question={t('passwordPage.PasswordGenerator.qaDropDown.question3')}
						answer={t('passwordPage.PasswordGenerator.qaDropDown.answer3')}
					/>
					<QADropDownList
						question={t('passwordPage.PasswordGenerator.qaDropDown.question4')}
						answer={t('passwordPage.PasswordGenerator.qaDropDown.answer4')}
					/>
				</motion.ul>
			</div>
		</motion.div>
	);
}