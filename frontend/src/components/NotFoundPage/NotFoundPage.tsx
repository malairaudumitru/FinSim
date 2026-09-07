import { Link } from '@tanstack/react-router'
import './NotFoundPage.css'

function NotFoundPage() {
    return (
        <div className="not-found">
            <Link to="/" className="not-found-logo">
                FinSim
            </Link>
            <span className="not-found-code figure">404</span>
            <h1>Pagina nu a fost găsită</h1>
            <p>Se pare că această înregistrare nu există în registrul nostru.</p>
            <Link to="/" className="btn btn-primary btn-lg">
                Înapoi la pagina principală
            </Link>
        </div>
    )
}

export default NotFoundPage