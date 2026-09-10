import { Link } from '@tanstack/react-router'
import { useScenarios } from '../../shared/ScenariosContext/ScenariosContext'
import { useAuth } from '../../shared/AuthContext/AuthContext'
import '../../shared/ContentPage/ContentPage.css'
import './ScenariosListPage.css'

function ScenariosListPage() {
    const { isLoggedIn } = useAuth()
    const { scenarios } = useScenarios()

    return (
        <div className="scenarios-list-page">
            <section className="content-hero">
                <div className="container">
                    <h1>Scenarii de simulare</h1>
                    <p className="content-hero-subtitle">
                        Alege o situație financiară reală și vezi cum s-ar descurca bugetul tău.
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
                                        <span className="scenario-lock" title="Necesită cont">
                                            🔒
                                        </span>
                                    )}
                                </span>
                                <Link to="/scenarios/$slug" params={{ slug: s.slug }} className="btn btn-link">
                                    Joacă scenariul →
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
