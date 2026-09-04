import { Link } from '@tanstack/react-router'
import './Footer.css'

function InstagramIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </svg>
    )
}

function FacebookIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M14 8.5h2.5V5H14c-2.2 0-4 1.8-4 4v2H8v3.5h2V21h3.5v-6.5H16l.5-3.5h-3V9c0-.55.45-1 1-1Z" />
        </svg>
    )
}

function Footer() {
    return (
        <footer id="contact" className="footer">
            <div className="container">
                <div className="footer-inner">
                    <div className="footer-col">
                        <h4>FinSim</h4>
                        <p>Învață să-ți gestionezi banii prin simulări practice, fără riscuri reale.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Contact</h4>
                        <a href="mailto:contact@finsim.md">contact@finsim.md</a>
                        <span className="footer-text">Chișinău, Moldova</span>
                    </div>
                    <div className="footer-col">
                        <h4>Despre proiect</h4>
                        <Link to="/">Despre noi</Link>
                        <Link to="/faq">Întrebări frecvente</Link>
                        <Link to="/faq">Termeni și condiții</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Rețele sociale</h4>
                        <a href="#" className="footer-social-link">
                            <InstagramIcon />
                            Instagram
                        </a>
                        <a href="#" className="footer-social-link">
                            <FacebookIcon />
                            Facebook
                        </a>
                    </div>
                </div>
                <div className="footer-bottom">
                    © {new Date().getFullYear()} FinSim. Toate drepturile rezervate.
                </div>
            </div>
        </footer>
    )
}

export default Footer