import { useNotifications } from '../../shared/NotificationsContext'
import './NotificationsPage.css'

const typeLabel: Record<string, string> = {
    scenariu: 'Scenariu',
    cont: 'Cont',
    sistem: 'Platformă',
}

function NotificationsPage() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

    return (
        <div className="notifications-page">
            <section className="notifications-hero">
                <div className="container notifications-hero-inner">
                    <div>
                        <h1>Notificări</h1>
                        <p className="notifications-hero-subtitle">
                            {unreadCount > 0
                                ? `Ai ${unreadCount} notificări necitite.`
                                : 'Ești la zi — nicio notificare necitită.'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button type="button" className="btn btn-ghost" onClick={markAllAsRead}>
                            Marchează tot ca citit
                        </button>
                    )}
                </div>
            </section>

            <section className="notifications-body">
                <div className="container">
                    {notifications.length === 0 ? (
                        <p className="notifications-empty">Nu ai nicio notificare momentan.</p>
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