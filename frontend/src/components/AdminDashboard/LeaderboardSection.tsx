import { useState, type FormEvent } from 'react'
import { useLeaderboard, type LeaderboardEntry } from '../../shared/LeaderboardContext/LeaderboardContext'
import Modal from '../../shared/Modal/Modal'

type FormState = {
    nume: string
    prenume: string
    scor: string
    esteTu: boolean
}

const emptyForm: FormState = { nume: '', prenume: '', scor: '0', esteTu: false }

function toForm(e: LeaderboardEntry): FormState {
    return { nume: e.nume, prenume: e.prenume, scor: String(e.scor), esteTu: Boolean(e.esteTu) }
}

function LeaderboardSection() {
    const { entries, addEntry, updateEntry, deleteEntry } = useLeaderboard()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState<FormState>(emptyForm)
    const [error, setError] = useState('')

    const ranked = [...entries].sort((a, b) => b.scor - a.scor)

    const openAdd = () => {
        setEditingId(null)
        setForm(emptyForm)
        setError('')
        setShowForm(true)
    }

    const openEdit = (entry: LeaderboardEntry) => {
        setEditingId(entry.id)
        setForm(toForm(entry))
        setError('')
        setShowForm(true)
    }

    const close = () => setShowForm(false)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!form.nume.trim() || !form.prenume.trim()) {
            setError('Numele și prenumele sunt obligatorii.')
            return
        }
        const payload = {
            nume: form.nume.trim(),
            prenume: form.prenume.trim(),
            scor: Math.max(0, Number(form.scor) || 0),
            esteTu: form.esteTu,
        }
        if (editingId) {
            updateEntry(editingId, payload)
        } else {
            addEntry(payload)
        }
        setShowForm(false)
    }

    const handleDelete = (entry: LeaderboardEntry) => {
        if (confirm(`Ștergi ${entry.prenume} ${entry.nume} din clasament?`)) {
            deleteEntry(entry.id)
        }
    }

    return (
        <div>
            <div className="admin-panel-header">
                <div>
                    <h2>Clasament</h2>
                    <p>Rangul se recalculează automat după scor — {entries.length} intrări.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openAdd}>
                    + Adaugă intrare
                </button>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Rang</th>
                            <th>Nume</th>
                            <th>Scor</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranked.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={4}>Nicio intrare în clasament.</td>
                            </tr>
                        )}
                        {ranked.map((entry, index) => (
                            <tr key={entry.id}>
                                <td>{index + 1}</td>
                                <td>
                                    {entry.prenume} {entry.nume}
                                    {entry.esteTu && <span className="admin-badge admin-badge-gold" style={{ marginLeft: 8 }}>Tu</span>}
                                </td>
                                <td>{entry.scor}</td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button type="button" className="admin-icon-btn" onClick={() => openEdit(entry)}>
                                            Editează
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-icon-btn danger"
                                            onClick={() => handleDelete(entry)}
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
                <Modal title={editingId ? 'Editează intrarea' : 'Adaugă intrare'} onClose={close}>
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="lb-nume">Nume</label>
                                <input
                                    id="lb-nume"
                                    value={form.nume}
                                    onChange={(e) => setForm((f) => ({ ...f, nume: e.target.value }))}
                                />
                            </div>
                            <div className="admin-field">
                                <label htmlFor="lb-prenume">Prenume</label>
                                <input
                                    id="lb-prenume"
                                    value={form.prenume}
                                    onChange={(e) => setForm((f) => ({ ...f, prenume: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="admin-field">
                            <label htmlFor="lb-scor">Scor</label>
                            <input
                                id="lb-scor"
                                type="number"
                                min={0}
                                value={form.scor}
                                onChange={(e) => setForm((f) => ({ ...f, scor: e.target.value }))}
                            />
                        </div>

                        <div className="admin-field admin-checkbox-field">
                            <input
                                id="lb-esteTu"
                                type="checkbox"
                                checked={form.esteTu}
                                onChange={(e) => setForm((f) => ({ ...f, esteTu: e.target.checked }))}
                            />
                            <label htmlFor="lb-esteTu">Marchează ca „Tu" (utilizatorul curent)</label>
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

export default LeaderboardSection
