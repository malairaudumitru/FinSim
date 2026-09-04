import { Link } from '@tanstack/react-router'
import './Navbar.css'

function Navbar() {
    return (
        <header className="navbar">
            <Link to="/" className="logo">
                FinSim
            </Link>
            <nav className="nav-links">
                <a href="#products">Produse financiare</a>
                <a href="#calculator">Calculator credit</a>
                <a href="#reviews">Recenzii</a>
                <a href="#contact">Contact</a>
            </nav>
            <div className="nav-actions">
                <Link to="/login" className="btn btn-primary">
                    Autentificare
                </Link>
            </div>
        </header>
    )
}

export default Navbar