import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import './NotFoundPage.css'

function NotFoundPage() {
    const { t } = useTranslation()

    return (
        <div className="not-found">
            <Link to="/" className="not-found-logo">
                FinSim
            </Link>
            <span className="not-found-code figure">404</span>
            <h1>{t('notFound.h1')}</h1>
            <p>{t('notFound.text')}</p>
            <Link to="/" className="btn btn-primary btn-lg">
                {t('notFound.button')}
            </Link>
        </div>
    )
}

export default NotFoundPage
