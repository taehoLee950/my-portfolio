import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import koTranslations from '../assets/locales/ko.json';
import enTranslations from '../assets/locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ko: {
        translation: koTranslations,
      },
      en: {
        translation: enTranslations,
      },
    },
    fallbackLng: 'ko',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
