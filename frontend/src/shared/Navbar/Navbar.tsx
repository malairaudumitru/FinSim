import { Link } from '@tanstack/react-router'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import AvatarMenu from '../AvatarMenu/AvatarMenu'
import { useAuth } from '../AuthContext'
import './Navbar.css'

function Navbar() {
    const { isLoggedIn } = useAuth()

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