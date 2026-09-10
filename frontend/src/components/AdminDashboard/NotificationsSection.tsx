import { useState, type FormEvent } from 'react'
import {
    useNotifications,
    type NotificationItem,
    type NotificationType,
} from '../../shared/NotificationsContext/NotificationsContext'
import { useUsers } from '../../shared/UsersContext/UsersContext'
import Modal from '../../shared/Modal/Modal'
import Dropdown from '../../shared/Dropdown/Dropdown'

type FormState = {
    email: string
    tip: NotificationType
    mesaj: string
    data: string
}

function todayLabel() {
    return new Date().toLocaleDateString('ro-RO')
}

const emptyForm: FormState = { email: '', tip: 'sistem', mesaj: '', data: todayLabel() }

function toForm(n: NotificationItem): FormState {
    return { email: n.email, tip: n.tip, mesaj: n.mesaj, data: n.data }
}

const tipLabel: Record<NotificationType, string> = {
    scenariu: 'Scenariu',
    cont: 'Cont',
    sistem: 'Sistem',
}

const tipOptions = [
    { value: 'scenariu', label: 'Scenariu' },
    { value: 'cont', label: 'Cont' },
    { value: 'sistem', label: 'Sistem' },
]

function NotificationsSection() {
    const { notifications, addNotification, updateNotification, deleteNotification } = useNotifications()
    const { users } = useUsers()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState<FormState>(emptyForm)
    const [error, setError] = useState('')

    const emailOptions = users.map((u) => ({
        value: u.email,
        label: `${u.prenume} ${u.nume} (${u.email})`,
    }))

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
        if (!form.email.trim()) {
            setError('Alege contul căruia îi trimiți notificarea.')
            return
        }

        if (editingId) {
            updateNotification(editingId, {
                tip: form.tip,
                mesaj: form.mesaj.trim(),
                data: form.data.trim() || todayLabel(),
                email: form.email.trim(),
            })
        } else {
            addNotification({
                tip: form.tip,
                mesaj: form.mesaj.trim(),
                data: form.data.trim() || todayLabel(),
                email: form.email.trim(),
                citit: false,
            })
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
                    <p>Notificările trimise către conturile utilizatorilor — {notifications.length} în total.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openAdd}>
                    + Trimite notificare
                </button>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Tip</th>
                            <th>Mesaj</th>
                            <th>Trimisă către</th>
                            <th>Data</th>
                            <th>Citit</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={6}>Nicio notificare momentan.</td>
                            </tr>
                        )}
                        {notifications.map((n) => (
                            <tr key={n.id}>
                                <td><span className="admin-badge admin-badge-gray">{tipLabel[n.tip]}</span></td>
                                <td className="admin-cell-truncate">{n.mesaj}</td>
                                <td className="admin-cell-muted">{n.email}</td>
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
                <Modal title={editingId ? 'Editează notificarea' : 'Trimite notificare'} onClose={close}>
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="admin-field">
                            <label htmlFor="nt-email">Trimite către (cont utilizator)</label>
                            <Dropdown
                                value={form.email}
                                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                                options={emailOptions}
                                placeholder="Alege utilizatorul"
                            />
                        </div>

                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="nt-tip">Tip</label>
                                <Dropdown
                                    value={form.tip}
                                    onChange={(v) => setForm((f) => ({ ...f, tip: v as NotificationType }))}
                                    options={tipOptions}
                                    placeholder="Tip"
                                />
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

                        {error && <span className="admin-form-error">{error}</span>}

                        <div className="admin-form-actions">
                            <button type="button" className="btn btn-ghost" onClick={close}>
                                Anulează
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Salvează' : 'Trimite'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}

export default NotificationsSection
