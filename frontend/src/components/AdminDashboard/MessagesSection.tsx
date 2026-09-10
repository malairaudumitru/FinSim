import { useState, type FormEvent } from 'react'
import { useMessages, type ContactMessage } from '../../shared/MessagesContext/MessagesContext'
import Modal from '../../shared/Modal/Modal'

function formatDate(iso: string) {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function statusOf(m: ContactMessage): { label: string; className: string } {
    if (m.raspuns) return { label: 'Răspuns trimis', className: 'admin-badge-green' }
    if (m.citit) return { label: 'Citit', className: 'admin-badge-gray' }
    return { label: 'Necitit', className: 'admin-badge-gold' }
}

function MessagesSection() {
    const { messages, markAsRead, replyToMessage, deleteMessage } = useMessages()
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [replyText, setReplyText] = useState('')
    const [error, setError] = useState('')
    const [sent, setSent] = useState(false)

    const selected = messages.find((m) => m.id === selectedId) ?? null

    const openMessage = (m: ContactMessage) => {
        setSelectedId(m.id)
        setReplyText(m.raspuns ?? '')
        setError('')
        setSent(false)
        if (!m.citit) markAsRead(m.id)
    }

    const close = () => setSelectedId(null)

    const handleReplySubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!replyText.trim()) {
            setError('Scrie un răspuns înainte să-l trimiți.')
            return
        }
        if (selected) {
            replyToMessage(selected.id, replyText.trim())
            setError('')
            setSent(true)
        }
    }

    const handleDelete = (m: ContactMessage) => {
        if (confirm(`Ștergi mesajul de la ${m.nume}?`)) {
            if (selectedId === m.id) setSelectedId(null)
            deleteMessage(m.id)
        }
    }

    return (
        <div>
            <div className="admin-panel-header">
                <div>
                    <h2>Mesaje</h2>
                    <p>Mesajele trimise prin formularul de Contact — {messages.length} în total.</p>
                </div>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nume</th>
                            <th>Email</th>
                            <th>Mesaj</th>
                            <th>Data</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={6}>Niciun mesaj momentan.</td>
                            </tr>
                        )}
                        {messages.map((m) => {
                            const status = statusOf(m)
                            return (
                                <tr key={m.id}>
                                    <td>{m.nume}</td>
                                    <td className="admin-cell-muted">{m.email}</td>
                                    <td className="admin-cell-truncate">{m.mesaj}</td>
                                    <td className="admin-cell-muted">{formatDate(m.data)}</td>
                                    <td>
                                        <span className={`admin-badge ${status.className}`}>{status.label}</span>
                                    </td>
                                    <td>
                                        <div className="admin-row-actions">
                                            <button type="button" className="admin-icon-btn" onClick={() => openMessage(m)}>
                                                Deschide
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-icon-btn danger"
                                                onClick={() => handleDelete(m)}
                                            >
                                                Șterge
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {selected && (
                <Modal title={`Mesaj de la ${selected.nume}`} onClose={close}>
                    <div className="admin-message-thread">
                        <div className="admin-message-meta">
                            <span>{selected.email}</span>
                            <span>{formatDate(selected.data)}</span>
                        </div>
                        <div className="admin-message-body">{selected.mesaj}</div>

                        {selected.raspuns && (
                            <div className="admin-message-reply-existing">
                                <div className="admin-message-meta">
                                    <span>Răspunsul tău</span>
                                    {selected.raspunsData && <span>{formatDate(selected.raspunsData)}</span>}
                                </div>
                                <div className="admin-message-body">{selected.raspuns}</div>
                            </div>
                        )}

                        <form className="admin-form" onSubmit={handleReplySubmit}>
                            <div className="admin-field">
                                <label htmlFor="msg-reply">{selected.raspuns ? 'Editează răspunsul' : 'Scrie un răspuns'}</label>
                                <textarea
                                    id="msg-reply"
                                    value={replyText}
                                    onChange={(e) => {
                                        setReplyText(e.target.value)
                                        setSent(false)
                                    }}
                                    style={{ fontFamily: 'var(--sans)', minHeight: 110 }}
                                    placeholder={`Scrie răspunsul pentru ${selected.nume}...`}
                                />
                            </div>

                            {error && <span className="admin-form-error">{error}</span>}
                            {sent && !error && <span className="admin-form-hint">Răspunsul a fost salvat.</span>}

                            <div className="admin-form-actions">
                                <button type="button" className="btn btn-ghost" onClick={close}>
                                    Închide
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Trimite răspunsul
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default MessagesSection
