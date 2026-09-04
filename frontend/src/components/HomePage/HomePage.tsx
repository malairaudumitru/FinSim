import { Link } from '@tanstack/react-router'
import './HomePage.css'

const scenarios = [
    {
        name: 'Primul salariu',
        desc: 'Primești primul salariu și trebuie să-l împarți pe chirie, mâncare, transport și economii.',
        difficulty: 'Ușor',
    },
    {
        name: 'Chirie și facturi',
        desc: 'Te muți singur și afli cât de repede se adună facturile lunare peste chirie.',
        difficulty: 'Mediu',
    },
    {
        name: 'Urgență medicală',
        desc: 'O cheltuială neprevăzută îți testează fondul de urgență — sau lipsa lui.',
        difficulty: 'Mediu',
    },
    {
        name: 'Primul credit',
        desc: 'Ai nevoie de bani în plus. Alegi un credit — dar știi cât te costă cu adevărat?',
        difficulty: 'Avansat',
    },
]

const steps = [
    {
        title: 'Alegi un scenariu',
        desc: 'Selectezi o situație financiară reală, de la primul salariu până la primul credit.',
    },
    {
        title: 'Iei decizii pas cu pas',
        desc: 'La fiecare etapă alegi cum cheltuiești, economisești sau împrumuți — și vezi efectul imediat.',
    },
    {
        title: 'Primești un scor și sfaturi',
        desc: 'La final vezi ce ai făcut bine, ce ai putea îmbunătăți și cum arată un buget echilibrat.',
    },
]

const testimonials = [
    {
        name: 'Alexandru, 19 ani',
        text: 'Prima dată când am înțeles de ce nu-mi ajungeau banii până la finalul lunii.',
    },
    {
        name: 'Diana, 22 ani',
        text: 'Scenariul cu creditul m-a făcut să calculez de două ori înainte să iau unul real.',
    },
    {
        name: 'Mihai, 17 ani',
        text: 'E ca un joc, dar chiar am învățat ce înseamnă fond de urgență.',
    },
]

const stats = [
    { value: '4', label: 'scenarii disponibile' },
    { value: '100%', label: 'gratuit' },
    { value: '0 lei', label: 'risc real' },
    { value: '~10 min', label: 'per scenariu' },
]

function HomePage() {
    return (
        <>
            <section className="hero">
                <div className="container hero-inner">
                    <div className="hero-text">
                        <h1>Învață să-ți gestionezi banii înainte să conteze cu adevărat.</h1>
                        <p className="hero-subtitle">
                            Simulează decizii financiare reale — salariu, chirie, credite — și vezi
                            consecințele lor, fără să riști vreun leu.
                        </p>
                        <div className="hero-actions">
                            <Link to="/" hash="scenarios" className="btn btn-primary btn-lg">
                                Începe simularea
                            </Link>
                            <Link to="/" hash="how-it-works" className="btn btn-ghost btn-lg">
                                Vezi cum funcționează
                            </Link>
                        </div>
                    </div>

                    <div className="ledger-card" aria-hidden="true">
                        <div className="ledger-card-title">Extras lunar — simulare</div>
                        <div className="ledger-row">
                            <span>Salariu</span>
                            <span className="figure positive">+8 500 lei</span>
                        </div>
                        <div className="ledger-row">
                            <span>Chirie</span>
                            <span className="figure negative">−2 200 lei</span>
                        </div>
                        <div className="ledger-row">
                            <span>Facturi</span>
                            <span className="figure negative">−650 lei</span>
                        </div>
                        <div className="ledger-row">
                            <span>Economii</span>
                            <span className="figure positive">+1 200 lei</span>
                        </div>
                        <div className="ledger-row ledger-total">
                            <span>Rămas la final de lună</span>
                            <span className="figure">4 450 lei</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stats">
                <div className="container stats-inner">
                    {stats.map((s) => (
                        <div className="stat" key={s.label}>
                            <span className="stat-value figure">{s.value}</span>
                            <span className="stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section id="scenarios" className="scenarios">
                <div className="container">
                    <div className="section-heading">
                        <h2>Scenarii de simulare</h2>
                        <p className="section-subtitle">
                            Alege o situație și vezi cum s-ar descurca bugetul tău.
                        </p>
                    </div>
                    <div className="scenario-list">
                        {scenarios.map((s) => (
                            <div className="scenario-row" key={s.name}>
                                <div className="scenario-info">
                                    <h3>{s.name}</h3>
                                    <p>{s.desc}</p>
                                </div>
                                <span className="scenario-tag">{s.difficulty}</span>
                                <button className="btn btn-link">Joacă scenariul →</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="how-it-works">
                <div className="container">
                    <div className="section-heading">
                        <h2>Cum funcționează</h2>
                    </div>
                    <div className="timeline">
                        {steps.map((step, i) => (
                            <div className="timeline-step" key={step.title}>
                                <span className="timeline-number figure">{String(i + 1).padStart(2, '0')}</span>
                                <div>
                                    <h3>{step.title}</h3>
                                    <p>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="reviews" className="reviews">
                <div className="container">
                    <div className="section-heading">
                        <h2>Ce spun cei care au încercat</h2>
                    </div>
                    <div className="reviews-grid">
                        {testimonials.map((t) => (
                            <blockquote className="review-card" key={t.name}>
                                <p className="review-text">{t.text}</p>
                                <cite className="review-author">{t.name}</cite>
                            </blockquote>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default HomePage