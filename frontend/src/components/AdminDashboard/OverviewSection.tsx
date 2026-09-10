import { useUsers } from '../../shared/UsersContext/UsersContext'
import { useLeaderboard } from '../../shared/LeaderboardContext/LeaderboardContext'
import { useReviews } from '../../shared/ReviewsContext/ReviewsContext'
import { useNotifications } from '../../shared/NotificationsContext/NotificationsContext'
import { useScenarios } from '../../shared/ScenariosContext/ScenariosContext'
import { useResources } from '../../shared/ResourcesContext/ResourcesContext'
import { useMessages } from '../../shared/MessagesContext/MessagesContext'
import AnimatedNumber from '../../shared/AnimatedNumber/AnimatedNumber'

function OverviewSection() {
    const { users } = useUsers()
    const { entries } = useLeaderboard()
    const { reviews } = useReviews()
    const { notifications } = useNotifications()
    const { scenarios } = useScenarios()
    const { videos, pdfs } = useResources()
    const { messages, unreadCount } = useMessages()

    const mediaRating = reviews.length
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '—'

    const stats = [
        { label: 'Utilizatori', value: users.length },
        { label: 'Utilizatori blocați', value: users.filter((u) => u.status === 'blocat').length },
        { label: 'Scenarii', value: scenarios.length },
        { label: 'Intrări clasament', value: entries.length },
        { label: 'Recenzii', value: reviews.length },
        { label: 'Rating mediu', value: mediaRating },
        { label: 'Notificări', value: notifications.length },
        { label: 'Resurse (video + PDF)', value: videos.length + pdfs.length },
        { label: 'Mesaje', value: messages.length },
        { label: 'Mesaje necitite', value: unreadCount },
    ]

    return (
        <div>
            <div className="admin-panel-header">
                <div>
                    <h2>Prezentare generală</h2>
                    <p>O privire rapidă asupra datelor din platformă.</p>
                </div>
            </div>
            <div className="admin-stats-grid">
                {stats.map((s) => (
                    <div className="admin-stat-card" key={s.label}>
                        <span className="admin-stat-value">
                            <AnimatedNumber value={String(s.value)} />
                        </span>
                        <span className="admin-stat-label">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OverviewSection
