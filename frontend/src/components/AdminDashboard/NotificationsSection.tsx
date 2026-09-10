import { useState, type FormEvent } from 'react'
import {
    useNotifications,
    type NotificationItem,
    type NotificationType,
} from '../../shared/NotificationsContext/NotificationsContext'
import Modal from '../../shared/Modal/Modal'

type FormState = {
    tip: NotificationType
    mesaj: string
    data: string
    citit: boolean
}

function todayLabel() {
    return new Date().toLocaleDateString('ro-RO')
}

const emptyForm: FormState = { tip: 'sistem', mesaj: '', data: todayLabel(), citit: false }

function toForm(n: NotificationItem): FormState {
    return { tip: n.tip, mesaj: n.mesaj, data: n.data, citit: n.citit }
}

const tipLabel: Record<NotificationType, string> = {
    scenariu: 'Scenariu',
    cont: 'Cont',
    sistem: 'Sistem',
}

function NotificationsSection() {
    const { notifications, addNotification, updateNotification, deleteNotification } = useNotifications()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState<FormState>(emptyForm)
    const [error, setError] = useState('')

    const openAdd = () => {
        setEditingId(null)
        setForm({ ...emptyForm, data: todayLabel() })
        setError('')
        setShowForm(true)
    }

    const openEdit = (n: NotificationItem) => {
        setEditingId(n.id)
        setForm(toForm(n))
        setError('')
        setShowForm(true)
    }

    const close = () => setShowForm(false)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!form.mesaj.trim()) {
            setError('Mesajul este obligatoriu.')
            return
        }
        const payload = {
            tip: form.tip,
            mesaj: form.mesaj.trim(),
            data: form.data.trim() || todayLabel(),
            citit: form.citit,
        }
        if (editingId) {
            updateNotification(editingId, payload)
        } else {
            addNotification(payload)
        }
        setShowForm(false)
    }

    const handleDelete = (n: NotificationItem) => {
        if (confirm('Ștergi această notificare?')) {
            deleteNotification(n.id)
        }
    }

    return (
        <div>
            <div className="admin-panel-header">
                <div>
                    <h2>Notificări</h2>
                    <p>Notificările afișate în clopoțelul din navbar — {notifications.length} în total.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openAdd}>
                    + Adaugă notificare
                </button>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Tip</th>
                            <th>Mesaj</th>
                            <th>Data</th>
                            <th>Citit</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={5}>Nicio notificare momentan.</td>
                            </tr>
                        )}
                        {notifications.map((n) => (
                            <tr key={n.id}>
                                <td><span className="admin-badge admin-badge-gray">{tipLabel[n.tip]}</span></td>
                                <td className="admin-cell-truncate">{n.mesaj}</td>
                                <td className="admin-cell-muted">{n.data}</td>
                                <td>
                                    <span className={`admin-badge ${n.citit ? 'admin-badge-green' : 'admin-badge-gold'}`}>
                                        {n.citit ? 'Citit' : 'Necitit'}
                                    </span>
                                </td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button type="button" className="admin-icon-btn" onClick={() => openEdit(n)}>
                                            Editează
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-icon-btn danger"
                                            onClick={() => handleDelete(n)}
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
                <Modal title={editingId ? 'Editează notificarea' : 'Adaugă notificare'} onClose={close}>
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="nt-tip">Tip</label>
                                <select
                                    id="nt-tip"
                                    value={form.tip}
                                    onChange={(e) => setForm((f) => ({ ...f, tip: e.target.value as NotificationType }))}
                                >
                                    <option value="scenariu">Scenariu</option>
                                    <option value="cont">Cont</option>
                                    <option value="sistem">Sistem</option>
                                </select>
                            </div>
                            <div className="admin-field">
                                <label htmlFor="nt-data">Data</label>
                                <input
                                    id="nt-data"
                                    value={form.data}
                                    onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
                                    placeholder="10.09.2026"
                                />
                            </div>
                        </div>

                        <div className="admin-field">
                            <label htmlFor="nt-mesaj">Mesaj</label>
                            <textarea
                                id="nt-mesaj"
                                value={form.mesaj}
                                onChange={(e) => setForm((f) => ({ ...f, mesaj: e.target.value }))}
                                style={{ fontFamily: 'var(--sans)', minHeight: 80 }}
                            />
                        </div>

                        <div className="admin-field admin-checkbox-field">
                            <input
                                id="nt-citit"
                                type="checkbox"
                                checked={form.citit}
                                onChange={(e) => setForm((f) => ({ ...f, citit: e.target.checked }))}
                            />
                            <label htmlFor="nt-citit">Marchează ca citită</label>
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

export default NotificationsSection
