import { useTranslation } from 'react-i18next'
import '../../shared/ContentPage/ContentPage.css'

interface AboutSection {
    heading: string
    paragraphs: string[]
}

function AboutPage() {
    const { t } = useTranslation()
    const sections = t('about.sections', { returnObjects: true }) as AboutSection[]

    return (
        <>
            <section className="content-hero">
                <div className="container">
                    <h1>{t('about.h1')}</h1>
                    <p className="content-hero-subtitle">
                        {t('about.subtitle')}
                    </p>
                </div>
            </section>

            <section className="content-body">
                <div className="container">
                    {sections.map((section) => (
                        <div className="content-section" key={section.heading}>
                            <h2>{section.heading}</h2>
                            {section.paragraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default AboutPage
