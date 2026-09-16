import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useMessages, type ContactMessage } from '../../shared/MessagesContext/MessagesContext'
import Modal from '../../shared/Modal/Modal'

const LOCALE_MAP: Record<string, string> = { ro: 'ro-RO', ru: 'ru-RU', en: 'en-US' }

function MessagesSection() {
    const { t, i18n } = useTranslation()
    const { messages, markAsRead, replyToMessage, deleteMessage } = useMessages()
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [replyText, setReplyText] = useState('')
    const [error, setError] = useState('')
    const [sent, setSent] = useState(false)

    const formatDate = (iso: string) => {
        const d = new Date(iso)
        if (Number.isNaN(d.getTime())) return iso
        return d.toLocaleString(LOCALE_MAP[i18n.language] ?? 'ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    const statusOf = (m: ContactMessage): { label: string; className: string } => {
        if (m.raspuns) return { label: t('admin.messages.status_replied'), className: 'admin-badge-green' }
        if (m.citit) return { label: t('admin.messages.status_read'), className: 'admin-badge-gray' }
        return { label: t('admin.messages.status_unread'), className: 'admin-badge-gold' }
    }

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
            setError(t('admin.messages.error_reply_required'))
            return
        }
        if (selected) {
            replyToMessage(selected.id, replyText.trim())
            setError('')
            setSent(true)
        }
    }

    const handleDelete = (m: ContactMessage) => {
        if (confirm(t('admin.messages.confirm_delete', { name: m.nume }))) {
            if (selectedId === m.id) setSelectedId(null)
            deleteMessage(m.id)
        }
    }

    return (
        <div>
            <div className="admin-panel-header">
                <div>
                    <h2>{t('admin.messages.title')}</h2>
                    <p>{t('admin.messages.subtitle', { count: messages.length })}</p>
                </div>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('admin.messages.col_name')}</th>
                            <th>{t('admin.messages.col_email')}</th>
                            <th>{t('admin.messages.col_message')}</th>
                            <th>{t('admin.messages.col_date')}</th>
                            <th>{t('admin.messages.col_status')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={6}>{t('admin.messages.empty')}</td>
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
                                                {t('admin.messages.open')}
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-icon-btn danger"
                                                onClick={() => handleDelete(m)}
                                            >
                                                {t('admin.messages.delete')}
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
                <Modal title={t('admin.messages.modal_title', { name: selected.nume })} onClose={close}>
                    <div className="admin-message-thread">
                        <div className="admin-message-meta">
                            <span>{selected.email}</span>
                            <span>{formatDate(selected.data)}</span>
                        </div>
                        <div className="admin-message-body">{selected.mesaj}</div>

                        {selected.raspuns && (
                            <div className="admin-message-reply-existing">
                                <div className="admin-message-meta">
                                    <span>{t('admin.messages.your_reply')}</span>
                                    {selected.raspunsData && <span>{formatDate(selected.raspunsData)}</span>}
                                </div>
                                <div className="admin-message-body">{selected.raspuns}</div>
                            </div>
                        )}

                        <form className="admin-form" onSubmit={handleReplySubmit}>
                            <div className="admin-field">
                                <label htmlFor="msg-reply">{selected.raspuns ? t('admin.messages.label_edit_reply') : t('admin.messages.label_write_reply')}</label>
                                <textarea
                                    id="msg-reply"
                                    value={replyText}
                                    onChange={(e) => {
                                        setReplyText(e.target.value)
                                        setSent(false)
                                    }}
                                    style={{ fontFamily: 'var(--sans)', minHeight: 110 }}
                                    placeholder={t('admin.messages.placeholder_reply', { name: selected.nume })}
                                />
                            </div>

                            {error && <span className="admin-form-error">{error}</span>}
                            {sent && !error && <span className="admin-form-hint">{t('admin.messages.reply_saved')}</span>}

                            <div className="admin-form-actions">
                                <button type="button" className="btn btn-ghost" onClick={close}>
                                    {t('admin.messages.close')}
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {t('admin.messages.send_reply')}
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
