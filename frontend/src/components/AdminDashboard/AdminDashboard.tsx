import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuth } from '../../shared/AuthContext/AuthContext'
import OverviewSection from './OverviewSection'
import UsersSection from './UsersSection'
import LeaderboardSection from './LeaderboardSection'
import ScenariosSection from './ScenariosSection'
import ReviewsSection from './ReviewsSection'
import NotificationsSection from './NotificationsSection'
import ResourcesSection from './ResourcesSection'
import './AdminDashboard.css'

type Tab = 'overview' | 'users' | 'leaderboard' | 'scenarios' | 'reviews' | 'notifications' | 'resources'

const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Prezentare generală' },
    { id: 'users', label: 'Utilizatori' },
    { id: 'leaderboard', label: 'Clasament' },
    { id: 'scenarios', label: 'Scenarii' },
    { id: 'reviews', label: 'Recenzii' },
    { id: 'notifications', label: 'Notificări' },
    { id: 'resources', label: 'Resurse' },
]

function AdminDashboard() {
    const { user } = useAuth()
    const [tab, setTab] = useState<Tab>('overview')

    if (!user || user.rol !== 'admin') {
        return (
            <div className="admin-page">
                <div className="container">
                    <div className="admin-guard">
                        <h1>Acces restricționat</h1>
                        <p>
                            Panoul de administrare este disponibil doar conturilor cu rol de admin.
                            Autentifică-te cu un cont de administrator pentru a continua.
                        </p>
                        <Link to="/login" className="btn btn-primary">
                            Mergi la autentificare
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
                    <h1>Panou de administrare</h1>
                    <p>Gestionează utilizatorii, clasamentul, scenariile, recenziile, notificările și resursele FinSim.</p>
                </div>

                <div className="admin-tabs">
                    {tabs.map((t) => (
                        <button
                            type="button"
                            key={t.id}
                            className={`admin-tab ${tab === t.id ? 'active' : ''}`}
                            onClick={() => setTab(t.id)}
                        >
                            {t.label}
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
            </div>
        </div>
    )
}

export default AdminDashboard
