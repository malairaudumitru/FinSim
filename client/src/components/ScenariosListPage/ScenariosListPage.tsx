import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useScenarios } from '../../shared/ScenariosContext/ScenariosContext'
import { useAuth } from '../../shared/AuthContext/AuthContext'
import '../../shared/ContentPage/ContentPage.css'
import './ScenariosListPage.css'

function ScenariosListPage() {
    const { t } = useTranslation()
    const { isLoggedIn } = useAuth()
    const { scenarios } = useScenarios()

    return (
        <div className="scenarios-list-page">
            <section className="content-hero">
                <div className="container">
                    <h1>{t('scenariosList.title')}</h1>
                    <p className="content-hero-subtitle">
                        {t('scenariosList.subtitle')}
                    </p>
                </div>
            </section>

            <section className="scenarios-list-section">
                <div className="container">
                    <div className="scenario-list">
                        {scenarios.map((s) => (
                            <div className="scenario-row" key={s.slug}>
                                <div className="scenario-info">
                                    <h3>{s.nume}</h3>
                                    <p>{s.descriere}</p>
                                </div>
                                <span className="scenario-tag">
                                    {s.dificultate}
                                    {s.necesitaCont && !isLoggedIn && (
                                        <span className="scenario-lock" title={t('scenariosList.requiresAccount')}>
                                            🔒
                                        </span>
                                    )}
                                </span>
                                <Link to="/scenarios/$slug" params={{ slug: s.slug }} className="btn btn-link">
                                    {t('scenariosList.playScenario')}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ScenariosListPage
