import { Link } from '@tanstack/react-router'
import './Footer.css'

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
                        <h4>Scenarii</h4>
                        <Link to="/" hash="scenarios">Primul salariu</Link>
                        <Link to="/" hash="scenarios">Chirie și facturi</Link>
                        <Link to="/" hash="scenarios">Primul credit</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Despre proiect</h4>
                        <Link to="/">Despre noi</Link>
                        <Link to="/faq">Întrebări frecvente</Link>
                        <Link to="/faq">Termeni și condiții</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Contul meu</h4>
                        <Link to="/login">Autentificare</Link>
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