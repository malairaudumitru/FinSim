import { useEffect, useState, useRef, type FormEvent, type DragEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useResources, type VideoResource, type PdfResource } from '../../shared/ResourcesContext/ResourcesContext'
import { useErrorModal } from '../../shared/ErrorModalContext/ErrorModalContext'
import { reportingCall } from '../../shared/reportServerError'
import { uploadPdf } from '../../api/resourcesApi'
import Modal from '../../shared/Modal/Modal'
import Dropdown from '../../shared/Dropdown/Dropdown'

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
        // not a valid URL, fall through to returning the trimmed input as-is
    }

    return trimmed
}

function ResourcesSection() {
    const { t } = useTranslation()
    const { videos, pdfs, addVideo, updateVideo, deleteVideo, addPdf, updatePdf, deletePdf, refresh } = useResources()

    useEffect(() => {
        refresh().catch(() => {})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const { showError } = useErrorModal()

    const temaOptions = [
        { value: 'General', label: t('admin.resources.theme_general') },
        { value: 'Buget', label: t('admin.resources.theme_budget') },
        { value: 'Economii', label: t('admin.resources.theme_savings') },
        { value: 'Decizii financiare', label: t('admin.resources.theme_financial_decisions') },
        { value: 'Credite', label: t('admin.resources.theme_credit') },
    ]

    const [videoEditId, setVideoEditId] = useState<string | null>(null)
    const [showVideoForm, setShowVideoForm] = useState(false)
    const [videoForm, setVideoForm] = useState<VideoForm>(emptyVideo)
    const [videoError, setVideoError] = useState('')

    const [pdfEditId, setPdfEditId] = useState<string | null>(null)
    const [showPdfForm, setShowPdfForm] = useState(false)
    const [pdfForm, setPdfForm] = useState<PdfForm>(emptyPdf)
    const [pdfError, setPdfError] = useState('')
    const [pdfDragActive, setPdfDragActive] = useState(false)
    const [pdfUploading, setPdfUploading] = useState(false)
    const pdfFileInputRef = useRef<HTMLInputElement>(null)

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

    const handleVideoSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!videoForm.titlu.trim() || !videoForm.youtubeId.trim()) {
            setVideoError(t('admin.resources.error_video_required'))
            return
        }
        const youtubeId = extractYoutubeId(videoForm.youtubeId)
        if (!youtubeId) {
            setVideoError(t('admin.resources.error_video_link_invalid'))
            return
        }
        const payload = {
            youtubeId,
            titlu: videoForm.titlu.trim(),
            sursa: videoForm.sursa.trim(),
            tema: videoForm.tema.trim() || 'General',
        }
        try {
            if (videoEditId) await updateVideo(videoEditId, payload)
            else await addVideo(payload)
            setShowVideoForm(false)
        } catch {
            setVideoError(t('admin.resources.error_video_required'))
        }
    }

    const handleDeleteVideo = async (v: VideoResource) => {
        if (confirm(t('admin.resources.confirm_delete_video', { title: v.titlu }))) {
            try {
                await deleteVideo(v.id)
            } catch {
                // modal already shown for server errors
            }
        }
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

    const handlePdfSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!pdfForm.titlu.trim() || !pdfForm.fisier.trim()) {
            setPdfError(t('admin.resources.error_pdf_required'))
            return
        }
        const payload = {
            titlu: pdfForm.titlu.trim(),
            descriere: pdfForm.descriere.trim(),
            fisier: pdfForm.fisier.trim(),
            tema: pdfForm.tema.trim() || 'General',
        }
        try {
            if (pdfEditId) await updatePdf(pdfEditId, payload)
            else await addPdf(payload)
            setShowPdfForm(false)
        } catch {
            setPdfError(t('admin.resources.error_pdf_required'))
        }
    }

    const handleDeletePdf = async (p: PdfResource) => {
        if (confirm(t('admin.resources.confirm_delete_pdf', { title: p.titlu }))) {
            try {
                await deletePdf(p.id)
            } catch {
                // modal already shown for server errors
            }
        }
    }

    const acceptPdfFile = async (file: File | undefined) => {
        if (!file) return
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            setPdfError(t('admin.resources.error_pdf_type'))
            return
        }
        setPdfError('')
        setPdfUploading(true)
        try {
            const { url } = await reportingCall(uploadPdf(file), showError)
            setPdfForm((f) => ({ ...f, fisier: url }))
        } catch {
            setPdfError(t('admin.resources.error_upload_failed'))
        } finally {
            setPdfUploading(false)
        }
    }

    const handlePdfDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setPdfDragActive(false)
        acceptPdfFile(e.dataTransfer.files[0])
    }

    const handlePdfDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setPdfDragActive(true)
    }

    const handlePdfDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setPdfDragActive(false)
    }

    return (
        <div>
            <div className="admin-panel-header">
                <div>
                    <h2>{t('admin.resources.videos_title')}</h2>
                    <p>{t('admin.resources.videos_subtitle', { count: videos.length })}</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openAddVideo}>
                    + {t('admin.resources.add_video_button')}
                </button>
            </div>

            <div className="admin-table-wrap" style={{ marginBottom: 40 }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('admin.resources.col_title')}</th>
                            <th>{t('admin.resources.col_source')}</th>
                            <th>{t('admin.resources.col_theme')}</th>
                            <th>{t('admin.resources.col_youtube_id')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {videos.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={5}>{t('admin.resources.empty_videos')}</td>
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
                                            {t('admin.resources.edit')}
                                        </button>
                                        <button type="button" className="admin-icon-btn danger" onClick={() => handleDeleteVideo(v)}>
                                            {t('admin.resources.delete')}
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
                    <h2>{t('admin.resources.pdfs_title')}</h2>
                    <p>{t('admin.resources.pdfs_subtitle', { count: pdfs.length })}</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openAddPdf}>
                    + {t('admin.resources.add_pdf_button')}
                </button>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('admin.resources.col_title')}</th>
                            <th>{t('admin.resources.col_description')}</th>
                            <th>{t('admin.resources.col_theme')}</th>
                            <th>{t('admin.resources.col_file')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {pdfs.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={5}>{t('admin.resources.empty_pdfs')}</td>
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
                                            {t('admin.resources.edit')}
                                        </button>
                                        <button type="button" className="admin-icon-btn danger" onClick={() => handleDeletePdf(p)}>
                                            {t('admin.resources.delete')}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showVideoForm && (
                <Modal title={videoEditId ? t('admin.resources.modal_edit_video_title') : t('admin.resources.modal_add_video_title')} onClose={() => setShowVideoForm(false)}>
                    <form className="admin-form" onSubmit={handleVideoSubmit}>
                        <div className="admin-field">
                            <label htmlFor="vd-titlu">{t('admin.resources.label_title')}</label>
                            <input
                                id="vd-titlu"
                                value={videoForm.titlu}
                                onChange={(e) => setVideoForm((f) => ({ ...f, titlu: e.target.value }))}
                            />
                        </div>
                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="vd-sursa">{t('admin.resources.label_source')}</label>
                                <input
                                    id="vd-sursa"
                                    value={videoForm.sursa}
                                    onChange={(e) => setVideoForm((f) => ({ ...f, sursa: e.target.value }))}
                                />
                            </div>
                            <div className="admin-field">
                                <label htmlFor="vd-tema">{t('admin.resources.label_theme')}</label>
                                <Dropdown
                                    value={videoForm.tema}
                                    onChange={(v) => setVideoForm((f) => ({ ...f, tema: v }))}
                                    options={temaOptions}
                                    placeholder={t('admin.resources.placeholder_theme')}
                                />
                            </div>
                        </div>
                        <div className="admin-field">
                            <label htmlFor="vd-yt">{t('admin.resources.label_youtube_link')}</label>
                            <input
                                id="vd-yt"
                                value={videoForm.youtubeId}
                                onChange={(e) => setVideoForm((f) => ({ ...f, youtubeId: e.target.value }))}
                                placeholder="https://www.youtube.com/watch?v=FtP-S4mmidQ"
                            />
                            <span className="admin-form-hint">
                                {t('admin.resources.hint_youtube_link')}
                            </span>
                        </div>
                        {videoError && <span className="admin-form-error">{videoError}</span>}
                        <div className="admin-form-actions">
                            <button type="button" className="btn btn-ghost" onClick={() => setShowVideoForm(false)}>
                                {t('admin.resources.cancel')}
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {videoEditId ? t('admin.resources.save') : t('admin.resources.add_video_button')}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {showPdfForm && (
                <Modal title={pdfEditId ? t('admin.resources.modal_edit_pdf_title') : t('admin.resources.modal_add_pdf_title')} onClose={() => setShowPdfForm(false)}>
                    <form className="admin-form" onSubmit={handlePdfSubmit}>
                        <div className="admin-field">
                            <label htmlFor="pd-titlu">{t('admin.resources.label_title')}</label>
                            <input
                                id="pd-titlu"
                                value={pdfForm.titlu}
                                onChange={(e) => setPdfForm((f) => ({ ...f, titlu: e.target.value }))}
                            />
                        </div>
                        <div className="admin-field">
                            <label htmlFor="pd-descriere">{t('admin.resources.label_description')}</label>
                            <textarea
                                id="pd-descriere"
                                value={pdfForm.descriere}
                                onChange={(e) => setPdfForm((f) => ({ ...f, descriere: e.target.value }))}
                                style={{ fontFamily: 'var(--sans)', minHeight: 80 }}
                            />
                        </div>
                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="pd-tema">{t('admin.resources.label_theme')}</label>
                                <Dropdown
                                    value={pdfForm.tema}
                                    onChange={(v) => setPdfForm((f) => ({ ...f, tema: v }))}
                                    options={temaOptions}
                                    placeholder={t('admin.resources.placeholder_theme')}
                                />
                            </div>
                            <div className="admin-field">
                                <label htmlFor="pd-fisier">{t('admin.resources.label_pdf_file')}</label>
                                <div
                                    className={`admin-dropzone ${pdfDragActive ? 'active' : ''}`}
                                    onDrop={handlePdfDrop}
                                    onDragOver={handlePdfDragOver}
                                    onDragLeave={handlePdfDragLeave}
                                    onClick={() => pdfFileInputRef.current?.click()}
                                >
                                    <input
                                        id="pd-fisier"
                                        ref={pdfFileInputRef}
                                        type="file"
                                        accept="application/pdf,.pdf"
                                        style={{ display: 'none' }}
                                        onChange={(e) => acceptPdfFile(e.target.files?.[0])}
                                    />
                                    {pdfUploading ? (
                                        <span className="admin-dropzone-hint">
                                            {t('admin.resources.uploading')}
                                        </span>
                                    ) : pdfForm.fisier ? (
                                        <span className="admin-dropzone-file">{pdfForm.fisier}</span>
                                    ) : (
                                        <span className="admin-dropzone-hint">
                                            {t('admin.resources.dropzone_hint')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {pdfError && <span className="admin-form-error">{pdfError}</span>}
                        <div className="admin-form-actions">
                            <button type="button" className="btn btn-ghost" onClick={() => setShowPdfForm(false)}>
                                {t('admin.resources.cancel')}
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={pdfUploading}>
                                {pdfEditId ? t('admin.resources.save') : t('admin.resources.add_pdf_button')}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}

export default ResourcesSection
