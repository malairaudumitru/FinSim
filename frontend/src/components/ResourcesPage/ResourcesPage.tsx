import '../../shared/ContentPage/ContentPage.css'
import './ResourcesPage.css'

interface VideoResource {
    id: string
    youtubeId: string
    titlu: string
    sursa: string
    tema: string
}

interface PdfResource {
    id: string
    titlu: string
    descriere: string
    fisier: string
    tema: string
}

const videos: VideoResource[] = [
    {
        id: 'v1',
        youtubeId: 'FtP-S4mmidQ',
        titlu: 'Care e treaba cu bugetul personal?',
        sursa: 'Școala de Bani — BCR',
        tema: 'Buget',
    },
    {
        id: 'v2',
        youtubeId: 'Ald3YHjFqSg',
        titlu: 'Care e treaba cu economisirea?',
        sursa: 'Școala de Bani — BCR',
        tema: 'Economii',
    },
    {
        id: 'v3',
        youtubeId: 'RaqH-NP2CIE',
        titlu: 'Educația financiară nu e doar despre bani, ci despre decizii',
        sursa: 'LifeLab — BCR',
        tema: 'Decizii financiare',
    },
]

const pdfs: PdfResource[] = [
    {
        id: 'p1',
        titlu: 'Primul tău buget, pas cu pas',
        descriere: 'Regula 50/30/20, greșeli comune și un obicei simplu care ajută de la prima lună.',
        fisier: '/primul-buget.pdf',
        tema: 'Buget',
    },
    {
        id: 'p2',
        titlu: 'Fondul de urgență — ghid practic',
        descriere: 'Cât ar trebui să ai, cum îl construiești, și când (nu) îl folosești.',
        fisier: '/fond-de-urgenta.pdf',
        tema: 'Economii',
    },
    {
        id: 'p3',
        titlu: 'Cum citești corect un credit',
        descriere: 'DAE vs. dobândă nominală, și un checklist înainte să semnezi orice contract.',
        fisier: '/citeste-un-credit.pdf',
        tema: 'Credite',
    },
]

function ResourcesPage() {
    return (
        <div className="resources-page">
            <section className="content-hero">
                <div className="container">
                    <h1>Resurse</h1>
                    <p className="content-hero-subtitle">
                        Videoclipuri și ghiduri, pentru cei care vor să aprofundeze dincolo de scenarii.
                    </p>
                </div>
            </section>

            <section className="resources-videos-section">
                <div className="container">
                    <div className="section-heading">
                        <h2>Videoclipuri</h2>
                        <p className="section-subtitle">Selectate din surse de educație financiară din România.</p>
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
                        <h2>Ghiduri PDF</h2>
                        <p className="section-subtitle">Materiale originale FinSim, scrise pe temele scenariilor.</p>
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
                                    Descarcă PDF
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
