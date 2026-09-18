import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUsers } from '../../shared/UsersContext/UsersContext'
import { useLeaderboard } from '../../shared/LeaderboardContext/LeaderboardContext'
import { useReviews } from '../../shared/ReviewsContext/ReviewsContext'
import { useScenarios } from '../../shared/ScenariosContext/ScenariosContext'
import { useResources } from '../../shared/ResourcesContext/ResourcesContext'
import { useMessages } from '../../shared/MessagesContext/MessagesContext'
import { getNotificationList } from '../../api/notificationsApi'
import AnimatedNumber from '../../shared/AnimatedNumber/AnimatedNumber'

function OverviewSection() {
    const { t } = useTranslation()
    const { users } = useUsers()
    const { entries } = useLeaderboard()
    const { reviews } = useReviews()
    const { scenarios } = useScenarios()
    const { videos, pdfs } = useResources()
    const { messages, unreadCount } = useMessages()

    const [notificationCount, setNotificationCount] = useState(0)
    useEffect(() => {
        getNotificationList()
            .then((list) => setNotificationCount(list.length))
            .catch(() => setNotificationCount(0))
    }, [])

    const mediaRating = reviews.length
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '—'

    const statLabels = t('admin.overview.stat_labels', { returnObjects: true }) as string[]

    const stats = [
        { label: statLabels[0], value: users.length },
        { label: statLabels[1], value: users.filter((u) => u.status === 'blocat').length },
        { label: statLabels[2], value: scenarios.length },
        { label: statLabels[3], value: entries.length },
        { label: statLabels[4], value: reviews.length },
        { label: statLabels[5], value: mediaRating },
        { label: statLabels[6], value: notificationCount },
        { label: statLabels[7], value: videos.length + pdfs.length },
        { label: statLabels[8], value: messages.length },
        { label: statLabels[9], value: unreadCount },
    ]

    return (
        <div>
            <div className="admin-panel-header">
                <div>
                    <h2>{t('admin.overview.title')}</h2>
                    <p>{t('admin.overview.subtitle')}</p>
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
