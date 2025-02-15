import './LanguageSelector.css';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const languages = [
	{ code: 'en', label: 'English' },
	{ code: 'ru', label: 'Русский' },
	{ code: 'ua', label: 'Українська' },
]

export default function LanguageSelector() {
	const [selectLanguage, setSelectLanguage] = useState<boolean>(false);
	const { i18n } = useTranslation();
	const currentLanguage = i18n.language;

	const handleClickSelector = () => {
		setSelectLanguage(prev => !prev);
	}

	const changeLanguage = (lang: string) => {
		i18n.changeLanguage(lang);
		setSelectLanguage(false);
	};

	return (
		<div className='lang-selector' onClick={handleClickSelector}>
			<img className='selector-icon' src="icon_lang.svg" alt="Lang" />
			<p className='selector-language'>{languages.find(l => l.code === currentLanguage)?.label}</p>
			<img className='selector-icon' src="expand_down.svg" alt="down" />
			<AnimatePresence>
				{selectLanguage && (
					<motion.div
						className='lang-list'
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.3 }}
					>
						{languages
							.filter(lang => lang.code !== currentLanguage)
							.map(({ code, label }) => (
								<p key={code} className='lang-item' onClick={() => changeLanguage(code)}>
									{label}
								</p>
							))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}