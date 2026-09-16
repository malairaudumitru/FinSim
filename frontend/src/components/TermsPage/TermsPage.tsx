import { useTranslation } from 'react-i18next'
import '../../shared/ContentPage/ContentPage.css'

interface TermsSection {
    heading: string
    body?: string
    items?: string[]
}

function TermsPage() {
    const { t } = useTranslation()
    const sections = t('terms.sections', { returnObjects: true }) as TermsSection[]
    const months = t('common.months', { returnObjects: true }) as string[]
    const lastSectionIndex = sections.length - 1

    return (
        <>
            <section className="content-hero">
                <div className="container">
                    <h1>{t('terms.h1')}</h1>
                    <p className="content-hero-subtitle">
                        {t('terms.subtitle')}
                    </p>
                </div>
            </section>

            <section className="content-body">
                <div className="container">
                    <p className="content-updated">{t('terms.updated', { month: months[8] })}</p>

                    {sections.map((section, i) => (
                        <div className="content-section" key={section.heading}>
                            <h2>{section.heading}</h2>
                            {section.body && <p>{section.body}</p>}
                            {section.items && (
                                <ul>
                                    {section.items.map((item, j) => (
                                        <li key={j}>{item}</li>
                                    ))}
                                </ul>
                            )}
                            {i === lastSectionIndex && (
                                <p>
                                    {t('terms.contact_intro')}{' '}
                                    <a href="mailto:contact@finsim.md">contact@finsim.md</a>.
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default TermsPage
