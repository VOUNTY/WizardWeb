import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(Backend)
i18n.use(LanguageDetector)
i18n.use(initReactI18next)

i18n.init({
  fallbackLng: 'en_US',
  interpolation: {
    escapeValue: false,
  }
}).then(() => {})

export const availableLanguages: any [] = [
  { value: 'de_DE', label: 'Deutsch' },
  { value: 'en_US', label: 'English (United States)' },
  { value: 'fr_FR', label: 'Français' },
]

export default i18n