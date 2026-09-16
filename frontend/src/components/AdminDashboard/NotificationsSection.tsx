import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
    useNotifications,
    type NotificationItem,
    type NotificationType,
} from '../../shared/NotificationsContext/NotificationsContext'
import { useUsers } from '../../shared/UsersContext/UsersContext'
import Modal from '../../shared/Modal/Modal'
import Dropdown from '../../shared/Dropdown/Dropdown'

const LOCALE_MAP: Record<string, string> = { ro: 'ro-RO', ru: 'ru-RU', en: 'en-US' }

type FormState = {
    email: string
    tip: NotificationType
    mesaj: string
    data: string
}

function toDateInputValue(roDate: string): string {
    const [zi, luna, an] = roDate.split('.')
    if (!zi || !luna || !an) return ''
    return `${an}-${luna.padStart(2, '0')}-${zi.padStart(2, '0')}`
}

function toForm(n: NotificationItem): FormState {
    return { email: n.email, tip: n.tip, mesaj: n.mesaj, data: n.data }
}

function NotificationsSection() {
    const { t, i18n } = useTranslation()
    const { notifications, addNotification, updateNotification, deleteNotification } = useNotifications()
    const { users } = useUsers()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [error, setError] = useState('')

    const todayLabel = () => new Date().toLocaleDateString(LOCALE_MAP[i18n.language] ?? 'ro-RO')

    const fromDateInputValue = (isoDate: string): string => {
        const [an, luna, zi] = isoDate.split('-')
        if (!an || !luna || !zi) return todayLabel()
        return `${zi}.${luna}.${an}`
    }

    const emptyForm: FormState = { email: '', tip: 'sistem', mesaj: '', data: todayLabel() }
    const [form, setForm] = useState<FormState>(emptyForm)

    const tipLabel: Record<NotificationType, string> = {
        scenariu: t('admin.notifications.type_scenario'),
        cont: t('admin.notifications.type_account'),
        sistem: t('admin.notifications.type_system'),
    }

    const tipOptions = [
        { value: 'scenariu', label: tipLabel.scenariu },
        { value: 'cont', label: tipLabel.cont },
        { value: 'sistem', label: tipLabel.sistem },
    ]

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
            setError(t('admin.notifications.error_message_required'))
            return
        }
        if (!form.email.trim()) {
            setError(t('admin.notifications.error_recipient_required'))
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
        if (confirm(t('admin.notifications.confirm_delete'))) {
            deleteNotification(n.id)
        }
    }

    return (
        <div>
            <div className="admin-panel-header">
                <div>
                    <h2>{t('admin.notifications.title')}</h2>
                    <p>{t('admin.notifications.subtitle', { count: notifications.length })}</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openAdd}>
                    + {t('admin.notifications.add_button')}
                </button>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('admin.notifications.col_type')}</th>
                            <th>{t('admin.notifications.col_message')}</th>
                            <th>{t('admin.notifications.col_sent_to')}</th>
                            <th>{t('admin.notifications.col_date')}</th>
                            <th>{t('admin.notifications.col_read')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={6}>{t('admin.notifications.empty')}</td>
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
                                        {n.citit ? t('admin.notifications.read') : t('admin.notifications.unread')}
                                    </span>
                                </td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button type="button" className="admin-icon-btn" onClick={() => openEdit(n)}>
                                            {t('admin.notifications.edit')}
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-icon-btn danger"
                                            onClick={() => handleDelete(n)}
                                        >
                                            {t('admin.notifications.delete')}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <Modal title={editingId ? t('admin.notifications.modal_edit_title') : t('admin.notifications.modal_add_title')} onClose={close}>
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="admin-field">
                            <label htmlFor="nt-email">{t('admin.notifications.label_recipient')}</label>
                            <Dropdown
                                value={form.email}
                                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                                options={emailOptions}
                                placeholder={t('admin.notifications.placeholder_recipient')}
                                searchable
                                searchPlaceholder={t('admin.notifications.search_placeholder_recipient')}
                            />
                        </div>

                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="nt-tip">{t('admin.notifications.label_type')}</label>
                                <Dropdown
                                    value={form.tip}
                                    onChange={(v) => setForm((f) => ({ ...f, tip: v as NotificationType }))}
                                    options={tipOptions}
                                    placeholder={t('admin.notifications.label_type')}
                                />
                            </div>
                            <div className="admin-field">
                                <label htmlFor="nt-data">{t('admin.notifications.label_date')}</label>
                                <input
                                    id="nt-data"
                                    type="date"
                                    value={toDateInputValue(form.data)}
                                    onChange={(e) => setForm((f) => ({ ...f, data: fromDateInputValue(e.target.value) }))}
                                />
                            </div>
                        </div>

                        <div className="admin-field">
                            <label htmlFor="nt-mesaj">{t('admin.notifications.label_message')}</label>
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
                                {t('admin.notifications.cancel')}
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? t('admin.notifications.save') : t('admin.notifications.send')}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}

export default NotificationsSection
