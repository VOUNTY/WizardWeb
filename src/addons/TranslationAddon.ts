import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(Backend)
i18n.use(LanguageDetector)
i18n.use(initReactI18next)

export const availableLanguages: any [] = [
  { value: 'de-DE', label: 'Deutsch' },
  { value: 'en-US', label: 'English (United States)' },
  { value: 'fr-FR', label: 'Français' },
  { value: 'ru-RU', label: 'Россия' },
  { value: 'it-IT', label: 'Italia' },
]

i18n.init({
  lng: 'en-US',
  fallbackLng: 'en-US',
  supportedLngs: availableLanguages.map(value => value.value),
  interpolation: {
    escapeValue: false,
  }
}).then(() => {})

export default i18n