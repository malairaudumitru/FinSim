import { useEffect, useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import AnimatedNumber from '../../shared/AnimatedNumber/AnimatedNumber'
import { useReviews } from '../../shared/ReviewsContext/ReviewsContext'
import StarRating from '../../shared/StarRating/StarRating'
import './HomePage.css'

const features = [
    {
        title: 'Compari inteligent',
        text: 'Nu doar rata lunară — vezi costul total, exact ca la o comparație reală de oferte de credit.',
        icon: 'compara',
    },
    {
        title: 'Decizii sub presiune',
        text: 'Exersezi cum reacționezi când timpul e limitat — exact cum se simte o urgență reală.',
        icon: 'timp',
    },
    {
        title: 'Buget flexibil',
        text: 'Muți bani între categorii cu un slider și vezi impactul instant asupra soldului.',
        icon: 'slider',
    },
    {
        title: 'Testezi ce știi',
        text: 'Verifici rapid cât de bine înțelegi dobânzi, credite și economii — cu răspuns imediat.',
        icon: 'quiz',
    },
]

function IconCompara() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 6h7M4 12h5M4 18h9" />
            <path d="M15 6h5M17 6v12M20 15l-3 3-3-3" />
        </svg>
    )
}

function IconTimp() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l3 2" />
            <path d="M9 2h6" />
        </svg>
    )
}

function IconSlider() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 7h16M4 17h16" />
            <circle cx="9" cy="7" r="2.2" fill="currentColor" stroke="none" />
            <circle cx="16" cy="17" r="2.2" fill="currentColor" stroke="none" />
        </svg>
    )
}

function IconQuiz() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9 10a3 3 0 1 1 4 2.8c-.8.4-1 1-1 1.7" />
            <circle cx="12" cy="17.5" r="0.9" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="9" />
        </svg>
    )
}

const featureIcons: Record<string, ReactNode> = {
    compara: <IconCompara />,
    timp: <IconTimp />,
    slider: <IconSlider />,
    quiz: <IconQuiz />,
}

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
    const { reviews } = useReviews()
    const pages = chunk(reviews, 3)
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

    const currentPage = pages[pageIndex] ?? []

    return (
        <div className="review-carousel-wrap">
            <div className="review-carousel">
                <button type="button" className="review-nav" onClick={prev} aria-label="Pagina anterioară">
                    ‹
                </button>

                <div className={`review-page slide-${direction}`} key={pageIndex}>
                    {currentPage.map((r) => (
                        <blockquote className="review-card" key={r.id}>
                            <StarRating rating={r.rating} size={20} />
                            <p className="review-text">{r.mesaj}</p>
                            <cite className="review-author">{r.autor}</cite>
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

            <section id="features" className="scenarios">
                <div className="container">
                    <div className="section-heading">
                        <h2>Nu doar teorie</h2>
                        <p className="section-subtitle">
                            Fie că tocmai ai primit primul salariu, fie că te pregătești pentru primul credit —
                            exersezi decizii reale, în situații construite să semene cu viața de zi cu zi.
                        </p>
                    </div>
                    <div className="scenario-teaser-grid">
                        {features.map((f) => (
                            <div className="scenario-teaser-card" key={f.title}>
                                <div className="scenario-teaser-icon">{featureIcons[f.icon]}</div>
                                <h3>{f.title}</h3>
                                <p>{f.text}</p>
                            </div>
                        ))}
                    </div>
                    <p className="features-footer-note">
                        Toate simulările sunt gratuite și nu necesită bani reali — greșelile costă doar în joc.
                    </p>
                    <div className="scenario-teaser-footer">
                        <Link to="/scenarios" className="btn btn-ghost">
                            Vezi toate scenariile →
                        </Link>
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
