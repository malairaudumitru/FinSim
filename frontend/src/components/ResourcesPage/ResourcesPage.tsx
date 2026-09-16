import { useTranslation } from 'react-i18next'
import { useResources } from '../../shared/ResourcesContext/ResourcesContext'
import '../../shared/ContentPage/ContentPage.css'
import './ResourcesPage.css'

function ResourcesPage() {
    const { t } = useTranslation()
    const { videos, pdfs } = useResources()

    return (
        <div className="resources-page">
            <section className="content-hero">
                <div className="container">
                    <h1>{t('resources.title')}</h1>
                    <p className="content-hero-subtitle">
                        {t('resources.subtitle')}
                    </p>
                </div>
            </section>

            <section className="resources-videos-section">
                <div className="container">
                    <div className="section-heading">
                        <h2>{t('resources.videosHeading')}</h2>
                        <p className="section-subtitle">{t('resources.videosSubtitle')}</p>
                    </div>
                    <div className="resources-video-grid">
                        {videos.map((v) => (
                            <div className="resource-video-card" key={v.id}>
                                <div className="resource-video-frame">
                                    <iframe
                                        src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                                        title={v.titlu}
                                        loading="lazy"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                <span className="resource-tag">{v.tema}</span>
                                <h3>{v.titlu}</h3>
                                <p className="resource-source">{v.sursa}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="resources-pdfs-section">
                <div className="container">
                    <div className="section-heading">
                        <h2>{t('resources.pdfsHeading')}</h2>
                        <p className="section-subtitle">{t('resources.pdfsSubtitle')}</p>
                    </div>
                    <div className="resources-pdf-list">
                        {pdfs.map((p) => (
                            <div className="resource-pdf-row" key={p.id}>
                                <div className="resource-pdf-info">
                                    <span className="resource-tag">{p.tema}</span>
                                    <h3>{p.titlu}</h3>
                                    <p>{p.descriere}</p>
                                </div>
                                <a href={p.fisier} download className="btn btn-ghost">
                                    {t('resources.downloadPdf')}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ResourcesPage
