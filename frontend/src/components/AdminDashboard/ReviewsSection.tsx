import { useState, type FormEvent } from 'react'
import { useReviews, type Review } from '../../shared/ReviewsContext/ReviewsContext'
import StarRating from '../../shared/StarRating/StarRating'
import Modal from '../../shared/Modal/Modal'

type FormState = {
    autor: string
    email: string
    rating: number
    mesaj: string
}

const emptyForm: FormState = { autor: '', email: '', rating: 5, mesaj: '' }

function toForm(r: Review): FormState {
    return { autor: r.autor, email: r.email, rating: r.rating, mesaj: r.mesaj }
}

function formatDate(iso: string) {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString('ro-RO')
}

function ReviewsSection() {
    const { reviews, addReview, updateReview, deleteReview } = useReviews()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState<FormState>(emptyForm)
    const [error, setError] = useState('')

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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!form.autor.trim() || !form.mesaj.trim()) {
            setError('Autorul și mesajul sunt obligatorii.')
            return
        }
        if (editingId) {
            updateReview(editingId, {
                autor: form.autor.trim(),
                email: form.email.trim(),
                rating: form.rating,
                mesaj: form.mesaj.trim(),
            })
        } else {
            addReview({
                autor: form.autor.trim(),
                email: form.email.trim() || 'admin@finsim.md',
                data: new Date().toISOString(),
                rating: form.rating,
                mesaj: form.mesaj.trim(),
            })
        }
        setShowForm(false)
    }

    const handleDelete = (r: Review) => {
        if (confirm(`Ștergi recenzia de la ${r.autor}?`)) {
            deleteReview(r.id)
        }
    }

    return (
        <div>
            <div className="admin-panel-header">
                <div>
                    <h2>Recenzii</h2>
                    <p>Recenziile afișate pe pagina principală — {reviews.length} în total.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openAdd}>
                    + Adaugă recenzie
                </button>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Autor</th>
                            <th>Rating</th>
                            <th>Mesaj</th>
                            <th>Data</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={5}>Nicio recenzie momentan.</td>
                            </tr>
                        )}
                        {reviews.map((r) => (
                            <tr key={r.id}>
                                <td>{r.autor}</td>
                                <td><StarRating rating={r.rating} size={13} /></td>
                                <td className="admin-cell-truncate">{r.mesaj}</td>
                                <td className="admin-cell-muted">{formatDate(r.data)}</td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button type="button" className="admin-icon-btn" onClick={() => openEdit(r)}>
                                            Editează
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-icon-btn danger"
                                            onClick={() => handleDelete(r)}
                                        >
                                            Șterge
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <Modal title={editingId ? 'Editează recenzia' : 'Adaugă recenzie'} onClose={close}>
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="rv-autor">Autor</label>
                                <input
                                    id="rv-autor"
                                    value={form.autor}
                                    onChange={(e) => setForm((f) => ({ ...f, autor: e.target.value }))}
                                    placeholder="Alexandru, 19 ani"
                                />
                            </div>
                            <div className="admin-field">
                                <label htmlFor="rv-email">Email</label>
                                <input
                                    id="rv-email"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="admin-field">
                            <label>Rating</label>
                            <StarRating rating={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
                        </div>

                        <div className="admin-field">
                            <label htmlFor="rv-mesaj">Mesaj</label>
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
                                Anulează
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Salvează' : 'Adaugă'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}

export default ReviewsSection
