import { useTranslation } from 'react-i18next'
import { useNotifications } from '../../shared/NotificationsContext/NotificationsContext.ts'
import './NotificationsPage.css'

function NotificationsPage() {
    const { t } = useTranslation()
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

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
                        <button type="button" className="btn btn-ghost" onClick={markAllAsRead}>
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
                                    onClick={() => markAsRead(n.id)}
                                >
                                    <span className="notification-dot" aria-hidden="true" />
                                    <div className="notification-content">
                                        <span className="notification-type">{typeLabel[n.tip]}</span>
                                        <p className="notification-text">{n.mesaj}</p>
                                    </div>
                                    <span className="notification-date figure">{n.data}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default NotificationsPage
