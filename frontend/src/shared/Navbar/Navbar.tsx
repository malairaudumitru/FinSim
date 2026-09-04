import { Link } from '@tanstack/react-router'
import './Navbar.css'

function Navbar() {
    return (
        <header className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="logo">
                    FinSim
                </Link>
                <nav className="nav-links">
                    <a href="#how-it-works">Cum funcționează</a>
                    <a href="#scenarios">Scenarii</a>
                    <a href="#reviews">Recenzii</a>
                    <a href="#contact">Contact</a>
                </nav>
                <div className="nav-actions">
                    <Link to="/login" className="btn btn-primary">
                        Autentificare
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Navbar