import { useEffect, useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import Typewriter from 'typewriter-effect'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import AnimatedNumber from '../../shared/AnimatedNumber/AnimatedNumber'
import { useReviews } from '../../shared/ReviewsContext/ReviewsContext'
import StarRating from '../../shared/StarRating/StarRating'
import './HomePage.css'

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


function chunk<T>(items: T[], size: number): T[][] {
    const result: T[][] = []
    for (let i = 0; i < items.length; i += size) {
        result.push(items.slice(i, i + size))
    }
    return result
}

function ReviewCarousel() {
    const { t } = useTranslation()
    const { reviews } = useReviews()
    const pages = chunk(reviews, 3)
    const [pageIndex, setPageIndex] = useState(0)

    useEffect(() => {
        if (pages.length <= 1) return
        const id = setInterval(() => {
            setPageIndex((i) => (i + 1) % pages.length)
        }, 6000)
        return () => clearInterval(id)
    }, [pageIndex, pages.length])

    const goTo = (target: number) => {
        setPageIndex(target)
    }

    const prev = () => {
        setPageIndex((i) => (i - 1 + pages.length) % pages.length)
    }

    const next = () => {
        setPageIndex((i) => (i + 1) % pages.length)
    }

    const currentPage = pages[pageIndex] ?? []

    return (
        <div className="review-carousel-wrap">
            <div className="review-carousel">
                <button type="button" className="review-nav" onClick={prev} aria-label={t('home.reviewCarousel.prevAria')}>
                    ‹
                </button>

                <div className="review-page">
                    <AnimatePresence mode="wait">
                        <motion.div
                            className="review-page-inner"
                            key={pageIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        >
                            {currentPage.map((r) => (
                                <blockquote className="review-card" key={r.id}>
                                    <StarRating rating={r.rating} size={20} />
                                    <p className="review-text">{r.mesaj}</p>
                                    <cite className="review-author">{r.autor}</cite>
                                </blockquote>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <button type="button" className="review-nav" onClick={next} aria-label={t('home.reviewCarousel.nextAria')}>
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
                            aria-label={t('home.reviewCarousel.pageAria', { page: i + 1 })}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

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

function HeroLedgerCard() {
    const { t } = useTranslation()
    const ledgerCards = t('home.ledgerCards', { returnObjects: true }) as LedgerCard[]
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % ledgerCards.length)
        }, 5000)
        return () => clearInterval(id)
    }, [ledgerCards.length])

    const card = ledgerCards[index]

    return (
        <div className="ledger-card-wrap">
            <AnimatePresence>
                <motion.div
                    className="ledger-card"
                    key={index}
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
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
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

function HomePage() {
    const { t } = useTranslation()
    const features = t('home.features', { returnObjects: true }) as { title: string; text: string; icon: string }[]
    const steps = t('home.steps', { returnObjects: true }) as { title: string; desc: string }[]
    const stats = t('home.stats', { returnObjects: true }) as { value: string; label: string }[]
    const heroStrings = t('home.hero.typewriter', { returnObjects: true }) as string[]

    return (
        <>
            <section className="hero">
                <div className="container hero-inner">
                    <div className="hero-text">
                        <h1>
                            {t('home.hero.heading')}{' '}
                            <span className="hero-typewriter">
                                <Typewriter
                                    options={{
                                        strings: heroStrings,
                                        autoStart: true,
                                        loop: true,
                                        delay: 45,
                                        deleteSpeed: 25,
                                        wrapperClassName: 'hero-typewriter-text',
                                        cursorClassName: 'hero-typewriter-cursor',
                                    }}
                                    component="span"
                                />
                            </span>
                        </h1>
                        <p className="hero-subtitle">
                            {t('home.hero.subtitle')}
                        </p>
                    </div>
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
                        <h2>{t('home.featuresHeading')}</h2>
                        <p className="section-subtitle">
                            {t('home.featuresSubtitle')}
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
                        {t('home.featuresFooterNote')}
                    </p>
                    <div className="scenario-teaser-footer">
                        <Link to="/scenarios" className="btn btn-ghost">
                            {t('home.viewAllScenarios')}
                        </Link>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="how-it-works">
                <div className="container how-it-works-inner">
                    <div className="how-it-works-text">
                        <div className="section-heading">
                            <h2>{t('home.howItWorksHeading')}</h2>
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

                    <HeroLedgerCard />
                </div>
            </section>

            <section id="reviews" className="reviews">
                <div className="container">
                    <div className="section-heading">
                        <h2>{t('home.reviewCarousel.heading')}</h2>
                    </div>
                    <ReviewCarousel />
                </div>
            </section>
        </>
    )
}

export default HomePage
