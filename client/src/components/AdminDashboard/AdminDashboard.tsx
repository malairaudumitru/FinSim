import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../shared/AuthContext/AuthContext'
import OverviewSection from './OverviewSection'
import UsersSection from './UsersSection'
import LeaderboardSection from './LeaderboardSection'
import ScenariosSection from './ScenariosSection'
import ReviewsSection from './ReviewsSection'
import NotificationsSection from './NotificationsSection'
import ResourcesSection from './ResourcesSection'
import MessagesSection from './MessagesSection'
import { useMessages } from '../../shared/MessagesContext/MessagesContext'
import './AdminDashboard.css'

type Tab = 'overview' | 'users' | 'leaderboard' | 'scenarios' | 'reviews' | 'notifications' | 'resources' | 'messages'

function AdminDashboard() {
    const { t } = useTranslation()
    const { user } = useAuth()
    const { unreadCount } = useMessages()
    const [tab, setTab] = useState<Tab>('overview')

    const tabs: { id: Tab; label: string }[] = [
        { id: 'overview', label: t('admin.dashboard.tab_overview') },
        { id: 'users', label: t('admin.dashboard.tab_users') },
        { id: 'leaderboard', label: t('admin.dashboard.tab_leaderboard') },
        { id: 'scenarios', label: t('admin.dashboard.tab_scenarios') },
        { id: 'reviews', label: t('admin.dashboard.tab_reviews') },
        { id: 'notifications', label: t('admin.dashboard.tab_notifications') },
        { id: 'resources', label: t('admin.dashboard.tab_resources') },
        { id: 'messages', label: t('admin.dashboard.tab_messages') },
    ]

    if (!user || user.rol !== 'admin') {
        return (
            <div className="admin-page">
                <div className="container">
                    <div className="admin-guard">
                        <h1>{t('admin.dashboard.guard_title')}</h1>
                        <p>{t('admin.dashboard.guard_message')}</p>
                        <Link to="/login" className="btn btn-primary">
                            {t('admin.dashboard.guard_cta')}
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>{t('admin.dashboard.title')}</h1>
                    <p>{t('admin.dashboard.subtitle')}</p>
                </div>

                <div className="admin-tabs">
                    {tabs.map((tabItem) => (
                        <button
                            type="button"
                            key={tabItem.id}
                            className={`admin-tab ${tab === tabItem.id ? 'active' : ''}`}
                            onClick={() => setTab(tabItem.id)}
                        >
                            {tabItem.label}
                            {tabItem.id === 'messages' && unreadCount > 0 && (
                                <span className="admin-tab-badge">{unreadCount}</span>
                            )}
                        </button>
                    ))}
                </div>

                {tab === 'overview' && <OverviewSection />}
                {tab === 'users' && <UsersSection />}
                {tab === 'leaderboard' && <LeaderboardSection />}
                {tab === 'scenarios' && <ScenariosSection />}
                {tab === 'reviews' && <ReviewsSection />}
                {tab === 'notifications' && <NotificationsSection />}
                {tab === 'resources' && <ResourcesSection />}
                {tab === 'messages' && <MessagesSection />}
            </div>
        </div>
    )
}

export default AdminDashboard
