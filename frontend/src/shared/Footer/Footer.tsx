import { Link } from '@tanstack/react-router'
import './Footer.css'

function Footer() {
    return (
        <footer id="contact" className="footer">
            <div className="footer-inner">
                <div className="footer-col">
                    <h4>FinSim</h4>
                    <p>Învață să-ți gestionezi banii prin simulări practice, fără riscuri reale.</p>
                </div>
                <div className="footer-col">
                    <h4>Scenarii</h4>
                    <a href="#scenarios">Primul salariu</a>
                    <a href="#scenarios">Chirie și facturi</a>
                    <a href="#scenarios">Primul credit</a>
                </div>
                <div className="footer-col">
                    <h4>Despre proiect</h4>
                    <a href="#">Despre noi</a>
                    <a href="#">Întrebări frecvente</a>
                    <a href="#">Termeni și condiții</a>
                </div>
                <div className="footer-col">
                    <h4>Contul meu</h4>
                    <Link to="/login">Autentificare</Link>
                </div>
            </div>
            <div className="footer-bottom">
                © {new Date().getFullYear()} FinSim. Toate drepturile rezervate.
            </div>
        </footer>
    )
}

export default Footer