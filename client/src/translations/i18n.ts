import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Импортируем файлы с переводами
import translationEN from './locales/en.json';
import translationRU from './locales/ru.json';
import translationUA from './locales/ua.json';

i18n
	.use(initReactI18next) // Подключаем React
	.use(LanguageDetector)  // Определяем язык пользователя
	.init({
		resources: {
			en: { translation: translationEN },
			ru: { translation: translationRU },
			ua: { translation: translationUA },
		},
		fallbackLng: 'en', // Язык по умолчанию
		interpolation: {
			escapeValue: false, // Для работы с React-компонентами
		},
	});

export default i18n;