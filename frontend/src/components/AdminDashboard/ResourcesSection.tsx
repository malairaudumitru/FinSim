import { useState, type FormEvent } from 'react'
import { useResources, type VideoResource, type PdfResource } from '../../shared/ResourcesContext/ResourcesContext'
import Modal from '../../shared/Modal/Modal'

type VideoForm = { youtubeId: string; titlu: string; sursa: string; tema: string }
type PdfForm = { titlu: string; descriere: string; fisier: string; tema: string }

const emptyVideo: VideoForm = { youtubeId: '', titlu: '', sursa: '', tema: '' }
const emptyPdf: PdfForm = { titlu: '', descriere: '', fisier: '', tema: '' }

function extractYoutubeId(input: string): string {
    const trimmed = input.trim()

    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{6,})/,
    ]
    for (const pattern of patterns) {
        const match = trimmed.match(pattern)
        if (match) return match[1]
    }

    try {
        const url = new URL(trimmed)
        const v = url.searchParams.get('v')
        if (v) return v
    } catch {

    }

    return trimmed
}

function ResourcesSection() {
    const { videos, pdfs, addVideo, updateVideo, deleteVideo, addPdf, updatePdf, deletePdf } = useResources()

    const [videoEditId, setVideoEditId] = useState<string | null>(null)
    const [showVideoForm, setShowVideoForm] = useState(false)
    const [videoForm, setVideoForm] = useState<VideoForm>(emptyVideo)
    const [videoError, setVideoError] = useState('')

    const [pdfEditId, setPdfEditId] = useState<string | null>(null)
    const [showPdfForm, setShowPdfForm] = useState(false)
    const [pdfForm, setPdfForm] = useState<PdfForm>(emptyPdf)
    const [pdfError, setPdfError] = useState('')

    const openAddVideo = () => {
        setVideoEditId(null)
        setVideoForm(emptyVideo)
        setVideoError('')
        setShowVideoForm(true)
    }

    const openEditVideo = (v: VideoResource) => {
        setVideoEditId(v.id)
        setVideoForm({ youtubeId: v.youtubeId, titlu: v.titlu, sursa: v.sursa, tema: v.tema })
        setVideoError('')
        setShowVideoForm(true)
    }

    const handleVideoSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!videoForm.titlu.trim() || !videoForm.youtubeId.trim()) {
            setVideoError('Titlul și linkul YouTube sunt obligatorii.')
            return
        }
        const youtubeId = extractYoutubeId(videoForm.youtubeId)
        if (!youtubeId) {
            setVideoError('Nu am putut extrage ID-ul din linkul dat — verifică-l.')
            return
        }
        const payload = {
            youtubeId,
            titlu: videoForm.titlu.trim(),
            sursa: videoForm.sursa.trim(),
            tema: videoForm.tema.trim() || 'General',
        }
        if (videoEditId) updateVideo(videoEditId, payload)
        else addVideo(payload)
        setShowVideoForm(false)
    }

    const handleDeleteVideo = (v: VideoResource) => {
        if (confirm(`Ștergi videoclipul „${v.titlu}"?`)) deleteVideo(v.id)
    }

    const openAddPdf = () => {
        setPdfEditId(null)
        setPdfForm(emptyPdf)
        setPdfError('')
        setShowPdfForm(true)
    }

    const openEditPdf = (p: PdfResource) => {
        setPdfEditId(p.id)
        setPdfForm({ titlu: p.titlu, descriere: p.descriere, fisier: p.fisier, tema: p.tema })
        setPdfError('')
        setShowPdfForm(true)
    }

    const handlePdfSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!pdfForm.titlu.trim() || !pdfForm.fisier.trim()) {
            setPdfError('Titlul și calea fișierului sunt obligatorii.')
            return
        }
        const payload = {
            titlu: pdfForm.titlu.trim(),
            descriere: pdfForm.descriere.trim(),
            fisier: pdfForm.fisier.trim(),
            tema: pdfForm.tema.trim() || 'General',
        }
        if (pdfEditId) updatePdf(pdfEditId, payload)
        else addPdf(payload)
        setShowPdfForm(false)
    }

    const handleDeletePdf = (p: PdfResource) => {
        if (confirm(`Ștergi ghidul „${p.titlu}"?`)) deletePdf(p.id)
    }

    return (
        <div>
            <div className="admin-panel-header">
                <div>
                    <h2>Resurse — Videoclipuri</h2>
                    <p>{videos.length} videoclipuri afișate pe pagina Resurse.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openAddVideo}>
                    + Adaugă video
                </button>
            </div>

            <div className="admin-table-wrap" style={{ marginBottom: 40 }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Titlu</th>
                            <th>Sursă</th>
                            <th>Temă</th>
                            <th>YouTube ID</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {videos.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={5}>Niciun videoclip momentan.</td>
                            </tr>
                        )}
                        {videos.map((v) => (
                            <tr key={v.id}>
                                <td>{v.titlu}</td>
                                <td className="admin-cell-muted">{v.sursa}</td>
                                <td><span className="admin-badge admin-badge-gray">{v.tema}</span></td>
                                <td className="admin-cell-muted">{v.youtubeId}</td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button type="button" className="admin-icon-btn" onClick={() => openEditVideo(v)}>
                                            Editează
                                        </button>
                                        <button type="button" className="admin-icon-btn danger" onClick={() => handleDeleteVideo(v)}>
                                            Șterge
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="admin-panel-header">
                <div>
                    <h2>Resurse — Ghiduri PDF</h2>
                    <p>{pdfs.length} ghiduri disponibile pentru descărcare.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openAddPdf}>
                    + Adaugă PDF
                </button>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Titlu</th>
                            <th>Descriere</th>
                            <th>Temă</th>
                            <th>Fișier</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {pdfs.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={5}>Niciun ghid momentan.</td>
                            </tr>
                        )}
                        {pdfs.map((p) => (
                            <tr key={p.id}>
                                <td>{p.titlu}</td>
                                <td className="admin-cell-truncate">{p.descriere}</td>
                                <td><span className="admin-badge admin-badge-gray">{p.tema}</span></td>
                                <td className="admin-cell-muted">{p.fisier}</td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button type="button" className="admin-icon-btn" onClick={() => openEditPdf(p)}>
                                            Editează
                                        </button>
                                        <button type="button" className="admin-icon-btn danger" onClick={() => handleDeletePdf(p)}>
                                            Șterge
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showVideoForm && (
                <Modal title={videoEditId ? 'Editează videoclipul' : 'Adaugă videoclip'} onClose={() => setShowVideoForm(false)}>
                    <form className="admin-form" onSubmit={handleVideoSubmit}>
                        <div className="admin-field">
                            <label htmlFor="vd-titlu">Titlu</label>
                            <input
                                id="vd-titlu"
                                value={videoForm.titlu}
                                onChange={(e) => setVideoForm((f) => ({ ...f, titlu: e.target.value }))}
                            />
                        </div>
                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="vd-sursa">Sursă</label>
                                <input
                                    id="vd-sursa"
                                    value={videoForm.sursa}
                                    onChange={(e) => setVideoForm((f) => ({ ...f, sursa: e.target.value }))}
                                />
                            </div>
                            <div className="admin-field">
                                <label htmlFor="vd-tema">Temă</label>
                                <input
                                    id="vd-tema"
                                    value={videoForm.tema}
                                    onChange={(e) => setVideoForm((f) => ({ ...f, tema: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="admin-field">
                            <label htmlFor="vd-yt">Link YouTube</label>
                            <input
                                id="vd-yt"
                                value={videoForm.youtubeId}
                                onChange={(e) => setVideoForm((f) => ({ ...f, youtubeId: e.target.value }))}
                                placeholder="https://www.youtube.com/watch?v=FtP-S4mmidQ"
                            />
                            <span className="admin-form-hint">
                                Lipește linkul complet copiat din YouTube (funcționează și youtu.be) — ID-ul se extrage automat.
                            </span>
                        </div>
                        {videoError && <span className="admin-form-error">{videoError}</span>}
                        <div className="admin-form-actions">
                            <button type="button" className="btn btn-ghost" onClick={() => setShowVideoForm(false)}>
                                Anulează
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {videoEditId ? 'Salvează' : 'Adaugă'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {showPdfForm && (
                <Modal title={pdfEditId ? 'Editează ghidul' : 'Adaugă ghid PDF'} onClose={() => setShowPdfForm(false)}>
                    <form className="admin-form" onSubmit={handlePdfSubmit}>
                        <div className="admin-field">
                            <label htmlFor="pd-titlu">Titlu</label>
                            <input
                                id="pd-titlu"
                                value={pdfForm.titlu}
                                onChange={(e) => setPdfForm((f) => ({ ...f, titlu: e.target.value }))}
                            />
                        </div>
                        <div className="admin-field">
                            <label htmlFor="pd-descriere">Descriere</label>
                            <textarea
                                id="pd-descriere"
                                value={pdfForm.descriere}
                                onChange={(e) => setPdfForm((f) => ({ ...f, descriere: e.target.value }))}
                                style={{ fontFamily: 'var(--sans)', minHeight: 80 }}
                            />
                        </div>
                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="pd-tema">Temă</label>
                                <input
                                    id="pd-tema"
                                    value={pdfForm.tema}
                                    onChange={(e) => setPdfForm((f) => ({ ...f, tema: e.target.value }))}
                                />
                            </div>
                            <div className="admin-field">
                                <label htmlFor="pd-fisier">Cale fișier</label>
                                <input
                                    id="pd-fisier"
                                    value={pdfForm.fisier}
                                    onChange={(e) => setPdfForm((f) => ({ ...f, fisier: e.target.value }))}
                                    placeholder="/nume-fisier.pdf"
                                />
                            </div>
                        </div>
                        {pdfError && <span className="admin-form-error">{pdfError}</span>}
                        <div className="admin-form-actions">
                            <button type="button" className="btn btn-ghost" onClick={() => setShowPdfForm(false)}>
                                Anulează
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {pdfEditId ? 'Salvează' : 'Adaugă'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}

export default ResourcesSection
