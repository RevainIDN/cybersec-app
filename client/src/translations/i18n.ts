import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationRU from './locales/ru.json';
import translationUA from './locales/ua.json';

i18n
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		resources: {
			en: { translation: translationEN },
			ru: { translation: translationRU },
			ua: { translation: translationUA },
		},
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;