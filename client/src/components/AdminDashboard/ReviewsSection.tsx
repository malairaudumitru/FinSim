import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useReviews, type Review } from '../../shared/ReviewsContext/ReviewsContext'
import StarRating from '../../shared/StarRating/StarRating'
import Modal from '../../shared/Modal/Modal'

const LOCALE_MAP: Record<string, string> = { ro: 'ro-RO', ru: 'ru-RU', en: 'en-US' }

type FormState = {
    nume: string
    varsta: string
    email: string
    rating: number
    mesaj: string
}

const emptyForm: FormState = { nume: '', varsta: '', email: '', rating: 5, mesaj: '' }

function parseAutor(autor: string): { nume: string; varsta: string } {
    const match = autor.match(/^(.*?),\s*(\d+)\s*ani\s*$/i)
    if (match) return { nume: match[1].trim(), varsta: match[2] }
    return { nume: autor, varsta: '' }
}

function toForm(r: Review): FormState {
    const { nume, varsta } = parseAutor(r.autor)
    return { nume, varsta, email: r.email, rating: r.rating, mesaj: r.mesaj }
}

function ReviewsSection() {
    const { t, i18n } = useTranslation()
    const { reviews, addReview, updateReview, deleteReview, refresh } = useReviews()

    useEffect(() => {
        refresh().catch(() => {})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState<FormState>(emptyForm)
    const [error, setError] = useState('')

    const formatDate = (iso: string) => {
        const d = new Date(iso)
        if (Number.isNaN(d.getTime())) return iso
        return d.toLocaleDateString(LOCALE_MAP[i18n.language] ?? 'ro-RO')
    }

    const openAdd = () => {
        setEditingId(null)
        setForm(emptyForm)
        setError('')
        setShowForm(true)
    }

    const openEdit = (r: Review) => {
        setEditingId(r.id)
        setForm(toForm(r))
        setError('')
        setShowForm(true)
    }

    const close = () => setShowForm(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!form.nume.trim() || !form.mesaj.trim()) {
            setError(t('admin.reviews.error_required'))
            return
        }
        const input = {
            nume: form.nume.trim(),
            varsta: Number(form.varsta) || 0,
            email: form.email.trim() || 'admin@finsim.md',
            rating: form.rating,
            mesaj: form.mesaj.trim(),
        }
        try {
            if (editingId) await updateReview(editingId, input)
            else await addReview(input)
            setShowForm(false)
        } catch {
            setError(t('admin.reviews.error_required'))
        }
    }

    const handleDelete = async (r: Review) => {
        if (confirm(t('admin.reviews.confirm_delete', { name: r.autor }))) {
            try {
                await deleteReview(r.id)
            } catch {
                // modal already shown for server errors
            }
        }
    }

    return (
        <div>
            <div className="admin-panel-header">
                <div>
                    <h2>{t('admin.reviews.title')}</h2>
                    <p>{t('admin.reviews.subtitle', { count: reviews.length })}</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openAdd}>
                    + {t('admin.reviews.add_button')}
                </button>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('admin.reviews.col_author')}</th>
                            <th>{t('admin.reviews.col_email')}</th>
                            <th>{t('admin.reviews.col_rating')}</th>
                            <th>{t('admin.reviews.col_message')}</th>
                            <th>{t('admin.reviews.col_date')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={6}>{t('admin.reviews.empty')}</td>
                            </tr>
                        )}
                        {reviews.map((r) => (
                            <tr key={r.id}>
                                <td>{r.autor}</td>
                                <td className="admin-cell-muted">{r.email}</td>
                                <td><StarRating rating={r.rating} size={13} /></td>
                                <td className="admin-cell-truncate">{r.mesaj}</td>
                                <td className="admin-cell-muted">{formatDate(r.data)}</td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button type="button" className="admin-icon-btn" onClick={() => openEdit(r)}>
                                            {t('admin.reviews.edit')}
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-icon-btn danger"
                                            onClick={() => handleDelete(r)}
                                        >
                                            {t('admin.reviews.delete')}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <Modal title={editingId ? t('admin.reviews.modal_edit_title') : t('admin.reviews.modal_add_title')} onClose={close}>
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="rv-nume">{t('admin.reviews.label_name')}</label>
                                <input
                                    id="rv-nume"
                                    value={form.nume}
                                    onChange={(e) => setForm((f) => ({ ...f, nume: e.target.value }))}
                                    placeholder={t('admin.reviews.placeholder_name')}
                                />
                            </div>
                            <div className="admin-field">
                                <label htmlFor="rv-varsta">{t('admin.reviews.label_age')}</label>
                                <input
                                    id="rv-varsta"
                                    type="number"
                                    min={0}
                                    value={form.varsta}
                                    onChange={(e) => setForm((f) => ({ ...f, varsta: e.target.value }))}
                                    placeholder={t('admin.reviews.placeholder_age')}
                                />
                            </div>
                        </div>

                        <div className="admin-field">
                            <label htmlFor="rv-email">{t('admin.reviews.label_email')}</label>
                            <input
                                id="rv-email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            />
                        </div>

                        <div className="admin-field">
                            <label>{t('admin.reviews.label_rating')}</label>
                            <StarRating rating={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
                        </div>

                        <div className="admin-field">
                            <label htmlFor="rv-mesaj">{t('admin.reviews.label_message')}</label>
                            <textarea
                                id="rv-mesaj"
                                value={form.mesaj}
                                onChange={(e) => setForm((f) => ({ ...f, mesaj: e.target.value }))}
                                style={{ fontFamily: 'var(--sans)', minHeight: 90 }}
                            />
                        </div>

                        {error && <span className="admin-form-error">{error}</span>}

                        <div className="admin-form-actions">
                            <button type="button" className="btn btn-ghost" onClick={close}>
                                {t('admin.reviews.cancel')}
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? t('admin.reviews.save') : t('admin.reviews.add_button')}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}

export default ReviewsSection
