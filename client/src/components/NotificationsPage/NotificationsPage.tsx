import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../../shared/Modal/Modal'
import { getOwnMessage, type ContactMessageInfoDto } from '../../api/messagesApi'
import { useNotifications, type NotificationItem } from '../../shared/NotificationsContext/NotificationsContext.ts'
import './NotificationsPage.css'

// Text stored by the backend before system notifications became translatable.
const LEGACY_REPLY_TEXT = 'Ai primit un răspuns la mesajul tău trimis către FinSim.'

function NotificationsPage() {
    const { t, i18n } = useTranslation()
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

    const [selected, setSelected] = useState<NotificationItem | null>(null)
    const [contactMessage, setContactMessage] = useState<ContactMessageInfoDto | null>(null)
    const [contactLoading, setContactLoading] = useState(false)

    const formatDateTime = (iso: string) =>
        new Date(iso).toLocaleString(i18n.language, { dateStyle: 'medium', timeStyle: 'short' })

    const openNotification = (n: NotificationItem) => {
        setSelected(n)
        setContactMessage(null)
        if (!n.citit) markAsRead(n.id).catch(() => {})
        if (n.contactMessageId !== undefined) {
            setContactLoading(true)
            getOwnMessage(n.contactMessageId)
                .then(setContactMessage)
                .catch(() => {})
                .finally(() => setContactLoading(false))
        }
    }

    const closeNotification = () => {
        setSelected(null)
        setContactMessage(null)
    }

    const displayMessage = (n: NotificationItem) =>
        n.contactMessageId !== undefined || n.mesaj === LEGACY_REPLY_TEXT ? t('notifications.reply_received') : n.mesaj

    const typeLabel: Record<string, string> = {
        scenariu: t('notifications.typeLabel.scenariu'),
        cont: t('notifications.typeLabel.cont'),
        sistem: t('notifications.typeLabel.sistem'),
    }

    return (
        <div className="notifications-page">
            <section className="notifications-hero">
                <div className="container notifications-hero-inner">
                    <div>
                        <h1>{t('notifications.h1')}</h1>
                        <p className="notifications-hero-subtitle">
                            {unreadCount > 0
                                ? t('notifications.subtitle_unread', { count: unreadCount })
                                : t('notifications.subtitle_caught_up')}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button type="button" className="btn btn-ghost" onClick={() => markAllAsRead().catch(() => {})}>
                            {t('notifications.mark_all_read')}
                        </button>
                    )}
                </div>
            </section>

            <section className="notifications-body">
                <div className="container">
                    {notifications.length === 0 ? (
                        <p className="notifications-empty">{t('notifications.empty')}</p>
                    ) : (
                        <div className="notifications-list">
                            {notifications.map((n) => (
                                <button
                                    type="button"
                                    key={n.id}
                                    className={`notification-row ${n.citit ? '' : 'unread'}`}
                                    onClick={() => openNotification(n)}
                                >
                                    <span className="notification-dot" aria-hidden="true" />
                                    <div className="notification-content">
                                        <span className="notification-type">{typeLabel[n.tip]}</span>
                                        <p className="notification-text">{displayMessage(n)}</p>
                                    </div>
                                    <span className="notification-date figure">{n.data}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {selected && (
                <Modal title={typeLabel[selected.tip]} onClose={closeNotification}>
                    <p className="notification-modal-date figure">{selected.data}</p>
                    <p className="notification-modal-text">{displayMessage(selected)}</p>
                    {selected.contactMessageId !== undefined && (
                        <div className="notification-thread">
                            {contactLoading && <p className="notification-thread-status">{t('notifications.loading')}</p>}
                            {!contactLoading && !contactMessage && (
                                <p className="notification-thread-status">{t('notifications.thread_unavailable')}</p>
                            )}
                            {contactMessage && (
                                <>
                                    <div className="notification-thread-block">
                                        <span className="notification-thread-label">
                                            {t('notifications.your_message')} · {formatDateTime(contactMessage.createdAt)}
                                        </span>
                                        <p>{contactMessage.message}</p>
                                    </div>
                                    {contactMessage.reply && (
                                        <div className="notification-thread-block notification-thread-reply">
                                            <span className="notification-thread-label">
                                                {t('notifications.admin_reply')}
                                                {contactMessage.replyDate && ` · ${formatDateTime(contactMessage.replyDate)}`}
                                            </span>
                                            <p>{contactMessage.reply}</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </Modal>
            )}
        </div>
    )
}

export default NotificationsPage
