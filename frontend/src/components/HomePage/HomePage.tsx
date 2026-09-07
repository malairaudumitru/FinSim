import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import AnimatedNumber from '../../shared/AnimatedNumber/AnimatedNumber'
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
    {
        name: 'Cristina, 20 ani',
        text: 'Mi-a fost util mai ales scenariul cu chiria — nu credeam că facturile se adună atât de repede.',
    },
    {
        name: 'Vlad, 24 ani',
        text: 'Mi-a schimbat felul în care mă gândesc la economii înainte să-mi iau propriul apartament.',
    },
    {
        name: 'Ana, 18 ani',
        text: 'L-am recomandat colegilor de liceu — e mult mai practic decât orele de educație financiară.',
    },
]

const stats = [
    { value: '4', label: 'scenarii disponibile' },
    { value: '100%', label: 'gratuit' },
    { value: '0 lei', label: 'risc real' },
    { value: '~10 min', label: 'per scenariu' },
]

interface LedgerRow {
    label: string
    value: string
    sign?: 'positive' | 'negative'
}

interface LedgerCard {
    title: string
    rows: LedgerRow[]
    total: { label: string; value: string }
}

const ledgerCards: LedgerCard[] = [
    {
        title: 'Extras lunar — simulare',
        rows: [
            { label: 'Salariu', value: '+8 500 lei', sign: 'positive' },
            { label: 'Chirie', value: '−2 200 lei', sign: 'negative' },
            { label: 'Facturi', value: '−650 lei', sign: 'negative' },
            { label: 'Economii', value: '+1 200 lei', sign: 'positive' },
        ],
        total: { label: 'Rămas la final de lună', value: '4 450 lei' },
    },
    {
        title: 'Scenariu — Primul credit',
        rows: [
            { label: 'Sumă împrumutată', value: '15 000 lei' },
            { label: 'Dobândă anuală', value: '11.5%' },
            { label: 'Rată lunară', value: '−720 lei', sign: 'negative' },
            { label: 'Cost total credit', value: '17 280 lei' },
        ],
        total: { label: 'Rămas din salariu după rată', value: '3 730 lei' },
    },
    {
        title: 'Scenariu — Urgență medicală',
        rows: [
            { label: 'Fond de urgență', value: '3 000 lei', sign: 'positive' },
            { label: 'Cheltuială neprevăzută', value: '−1 850 lei', sign: 'negative' },
            { label: 'Rămas în fond', value: '1 150 lei' },
            { label: 'Timp de refacere fond', value: '≈2 luni' },
        ],
        total: { label: 'Fondul acoperă cheltuiala', value: 'Da' },
    },
]

function HeroLedgerCard() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % ledgerCards.length)
        }, 5000)
        return () => clearInterval(id)
    }, [])

    const card = ledgerCards[index]

    return (
        <div className="ledger-card" key={index} aria-hidden="true">
            <div className="ledger-card-title">{card.title}</div>
            {card.rows.map((row) => (
                <div className="ledger-row" key={row.label}>
                    <span>{row.label}</span>
                    <span className={`figure ${row.sign ?? ''}`}>{row.value}</span>
                </div>
            ))}
            <div className="ledger-row ledger-total">
                <span>{card.total.label}</span>
                <span className="figure">{card.total.value}</span>
            </div>
        </div>
    )
}

function chunk<T>(items: T[], size: number): T[][] {
    const result: T[][] = []
    for (let i = 0; i < items.length; i += size) {
        result.push(items.slice(i, i + size))
    }
    return result
}

function ReviewCarousel() {
    const pages = chunk(testimonials, 3)
    const [pageIndex, setPageIndex] = useState(0)
    const [direction, setDirection] = useState<'left' | 'right'>('right')

    useEffect(() => {
        if (pages.length <= 1) return
        const id = setInterval(() => {
            setDirection('right')
            setPageIndex((i) => (i + 1) % pages.length)
        }, 6000)
        return () => clearInterval(id)
    }, [pageIndex, pages.length])

    const goTo = (target: number) => {
        setDirection(target > pageIndex ? 'right' : 'left')
        setPageIndex(target)
    }

    const prev = () => {
        setDirection('left')
        setPageIndex((i) => (i - 1 + pages.length) % pages.length)
    }

    const next = () => {
        setDirection('right')
        setPageIndex((i) => (i + 1) % pages.length)
    }

    const currentPage = pages[pageIndex]

    return (
        <div className="review-carousel-wrap">
            <div className="review-carousel">
                <button type="button" className="review-nav" onClick={prev} aria-label="Pagina anterioară">
                    ‹
                </button>

                <div className={`review-page slide-${direction}`} key={pageIndex}>
                    {currentPage.map((t) => (
                        <blockquote className="review-card" key={t.name}>
                            <p className="review-text">{t.text}</p>
                            <cite className="review-author">{t.name}</cite>
                        </blockquote>
                    ))}
                </div>

                <button type="button" className="review-nav" onClick={next} aria-label="Pagina următoare">
                    ›
                </button>
            </div>

            {pages.length > 1 && (
                <div className="review-dots">
                    {pages.map((_, i) => (
                        <button
                            type="button"
                            key={i}
                            className={`review-dot ${i === pageIndex ? 'active' : ''}`}
                            onClick={() => goTo(i)}
                            aria-label={`Pagina ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

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

                    <HeroLedgerCard />
                </div>
            </section>

            <section className="stats">
                <div className="container stats-inner">
                    {stats.map((s) => (
                        <div className="stat" key={s.label}>
                            <span className="stat-value">
                                <AnimatedNumber value={s.value} />
                            </span>
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
                    <ReviewCarousel />
                </div>
            </section>
        </>
    )
}

export default HomePage