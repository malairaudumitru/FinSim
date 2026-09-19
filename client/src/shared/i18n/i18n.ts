import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import ro from './locales/ro'
import ru from './locales/ru'
import en from './locales/en'

const STORAGE_KEY = 'finsim-language'

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            ro: { translation: ro },
            ru: { translation: ru },
            en: { translation: en },
        },
        fallbackLng: 'ro',
        supportedLngs: ['ro', 'ru', 'en'],
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: STORAGE_KEY,
        },
        interpolation: { escapeValue: false },
    })

function applyDocumentLanguage() {
    document.documentElement.lang = i18n.resolvedLanguage ?? 'ro'
    document.title = i18n.t('common.page_title')
}

applyDocumentLanguage()
i18n.on('languageChanged', applyDocumentLanguage)

export default i18n
