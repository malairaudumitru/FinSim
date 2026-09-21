import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useUsers } from '../../shared/UsersContext/UsersContext'
import { useErrorModal } from '../../shared/ErrorModalContext/ErrorModalContext'
import { reportIfServerError, reportingCall } from '../../shared/reportServerError'
import * as notificationsApi from '../../api/notificationsApi'
import { toNotificationItem, toType } from '../../shared/notifications/notificationMapper'
import type { NotificationItem, NotificationType } from '../../shared/NotificationsContext/NotificationsContext'
import Modal from '../../shared/Modal/Modal'
import Dropdown from '../../shared/Dropdown/Dropdown'
import Checkbox from '../../shared/Checkbox/Checkbox'
import LanguageFields, { type LanguageValues } from './LanguageFields'

type FormState = {
    email: string
    tip: NotificationType
    mesaj: LanguageValues
    toAll: boolean
}

const emptyForm: FormState = { email: '', tip: 'sistem', mesaj: { ro: '', en: '', ru: '' }, toAll: false }

function toForm(n: NotificationItem): FormState {
    return { email: n.email, tip: n.tip, mesaj: { ro: n.mesajRo, en: n.mesajEn, ru: n.mesajRu }, toAll: false }
}

function NotificationsSection() {
    const { t } = useTranslation()
    const { users } = useUsers()
    const { showError } = useErrorModal()
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [error, setError] = useState('')

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

    const refresh = () => {
        return notificationsApi
            .getNotificationList()
            .then((list) =>
                setNotifications(
                    list.map((dto) => {
                        const owner = users.find((u) => u.id === String(dto.userId))
                        return toNotificationItem(dto, owner?.email ?? '')
                    }),
                ),
            )
            .catch((err) => {
                reportIfServerError(err, showError)
                setNotifications([])
            })
    }

    useEffect(() => {
        refresh().finally(() => setLoading(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users])

    const openAdd = () => {
        setEditingId(null)
        setForm(emptyForm)
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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!form.mesaj.ro.trim()) {
            setError(t('admin.notifications.error_message_required'))
            return
        }
        if (!form.toAll && !form.email.trim()) {
            setError(t('admin.notifications.error_recipient_required'))
            return
        }

        // A broadcast reaches every active account and cannot be undone in one step, so ask first.
        if (form.toAll && !editingId) {
            const activeUsers = users.filter((u) => u.status === 'activ').length
            if (!confirm(t('admin.notifications.confirm_send_all', { count: activeUsers }))) return
        }

        const dto = {
            type: toType(form.tip),
            messageRo: form.mesaj.ro.trim(),
            messageEn: form.mesaj.en.trim() || null,
            messageRu: form.mesaj.ru.trim() || null,
            email: form.toAll ? null : form.email.trim(),
            sendToAll: form.toAll,
        }

        try {
            if (editingId) await reportingCall(notificationsApi.updateNotification(Number(editingId), dto), showError)
            else await reportingCall(notificationsApi.createNotification(dto), showError)
            await refresh()
            setShowForm(false)
        } catch {
            setError(t('admin.notifications.error_submit_failed'))
        }
    }

    const handleDelete = async (n: NotificationItem) => {
        if (confirm(t('admin.notifications.confirm_delete'))) {
            try {
                await reportingCall(notificationsApi.deleteNotification(Number(n.id)), showError)
                setNotifications((prev) => prev.filter((x) => x.id !== n.id))
            } catch {
                // modal already shown for server errors by reportingCall
            }
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
                        {!loading && notifications.length === 0 && (
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
                        {!editingId && (
                            <div className="admin-field admin-checkbox-field">
                                <Checkbox
                                    id="nt-all"
                                    checked={form.toAll}
                                    onChange={(v) => setForm((f) => ({ ...f, toAll: v }))}
                                    label={t('admin.notifications.label_send_to_all')}
                                />
                                {form.toAll && (
                                    <span className="admin-form-hint">{t('admin.notifications.hint_send_to_all')}</span>
                                )}
                            </div>
                        )}

                        {!form.toAll && (
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
                        )}

                        <div className="admin-field">
                            <label htmlFor="nt-tip">{t('admin.notifications.label_type')}</label>
                            <Dropdown
                                value={form.tip}
                                onChange={(v) => setForm((f) => ({ ...f, tip: v as NotificationType }))}
                                options={tipOptions}
                                placeholder={t('admin.notifications.label_type')}
                            />
                        </div>

                        <span className="admin-form-hint">{t('admin.translations_hint')}</span>
                        <LanguageFields
                            idPrefix="nt-mesaj"
                            label={t('admin.notifications.label_message')}
                            values={form.mesaj}
                            multiline
                            onChange={(lang, value) => setForm((f) => ({ ...f, mesaj: { ...f.mesaj, [lang]: value } }))}
                        />

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
