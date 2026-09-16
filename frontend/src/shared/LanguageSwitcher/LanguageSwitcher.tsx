import { useTranslation } from 'react-i18next'
import Dropdown from '../Dropdown/Dropdown'
import './LanguageSwitcher.css'

const LANGUAGES = [
    { value: 'ro', label: 'RO' },
    { value: 'ru', label: 'RU' },
    { value: 'en', label: 'EN' },
]

function LanguageSwitcher() {
    const { i18n } = useTranslation()

    return (
        <div className="language-switcher">
            <Dropdown
                value={i18n.language}
                onChange={(value) => i18n.changeLanguage(value)}
                options={LANGUAGES}
                placeholder="Limbă"
            />
        </div>
    )
}

export default LanguageSwitcher
