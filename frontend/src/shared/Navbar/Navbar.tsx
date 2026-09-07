import { Link } from '@tanstack/react-router'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import AvatarMenu from '../AvatarMenu/AvatarMenu'
import { useAuth } from '../AuthContext'
import { useNotifications } from '../NotificationsContext'
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

    return (
        <header className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="logo">
                    FinSim
                </Link>
                <nav className="nav-links">
                    <Link to="/" hash="how-it-works">Cum funcționează</Link>
                    <Link to="/" hash="scenarios">Scenarii</Link>
                    <Link to="/faq">FAQ</Link>
                    <Link to="/contact">Contact</Link>
                </nav>
                <div className="nav-actions">
                    <ThemeToggle />
                    {isLoggedIn && (
                        <Link to="/notifications" className="notif-bell" aria-label="Notificări">
                            <BellIcon />
                            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                        </Link>
                    )}
                    {isLoggedIn ? (
                        <AvatarMenu />
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            Autentificare
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navbar