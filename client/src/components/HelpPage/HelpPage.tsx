import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './HelpPage.css'

interface FaqItem {
    q: string
    a: string
}

interface FaqCategory {
    title: string
    qa: FaqItem[]
}

function FaqRow({ item, index }: { item: FaqItem; index: number }) {
    const [open, setOpen] = useState(false)

    return (
        <div className={`faq-item ${open ? 'open' : ''}`}>
            <button
                type="button"
                className="faq-question"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
            >
                <span className="faq-index figure">{String(index + 1).padStart(2, '0')}</span>
                <span className="faq-question-text">{item.q}</span>
                <span className="faq-toggle figure">{open ? '−' : '+'}</span>
            </button>
            {open && <p className="faq-answer">{item.a}</p>}
        </div>
    )
}

function HelpPage() {
    const { t } = useTranslation()
    const faqData = t('faq.categories', { returnObjects: true }) as FaqCategory[]

    return (
        <>
            <section className="faq-hero">
                <div className="container">
                    <h1>{t('faq.h1')}</h1>
                    <p className="faq-hero-subtitle">
                        {t('faq.subtitle')}
                    </p>
                </div>
            </section>

            <section className="faq-body">
                <div className="container">
                    {faqData.map((category) => (
                        <div className="faq-category" key={category.title}>
                            <h2>{category.title}</h2>
                            <div className="faq-list">
                                {category.qa.map((item, i) => (
                                    <FaqRow item={item} index={i} key={item.q} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default HelpPage
