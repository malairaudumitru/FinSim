import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'
import AvatarMenu from '../AvatarMenu/AvatarMenu'
import { useAuth } from '../AuthContext/AuthContext'
import { useNotifications } from '../NotificationsContext/NotificationsContext'
import './Navbar.css'

function BellIcon() {
    return (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" />
            <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>
    )
}

function Navbar() {
    const { isLoggedIn } = useAuth()
    const { unreadCount } = useNotifications()
    const { t } = useTranslation()

    return (
        <header className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="logo">
                    <img src="/logo.png" alt="" className="logo-mark" />
                    FinSim
                </Link>
                <nav className="nav-links">
                    <Link to="/scenarios">{t('navbar.scenarios')}</Link>
                    <Link to="/resources">{t('navbar.resources')}</Link>
                    <Link to="/leaderboard">{t('navbar.leaderboard')}</Link>
                    <Link to="/faq">{t('navbar.faq')}</Link>
                    <Link to="/" hash="reviews">{t('navbar.reviews')}</Link>
                    <Link to="/contact">{t('navbar.contact')}</Link>
                </nav>
                <div className="nav-actions">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    {isLoggedIn && (
                        <Link to="/notifications" className="notif-bell" aria-label={t('navbar.notifications_aria')}>
                            <BellIcon />
                            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                        </Link>
                    )}
                    {isLoggedIn ? (
                        <AvatarMenu />
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            {t('navbar.login')}
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navbar
