import { useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import Modal from '../Modal/Modal'
import { ErrorModalContext, type ErrorModalState } from './ErrorModalContext.ts'
import './ErrorModal.css'

export function ErrorModalProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<ErrorModalState | null>(null)

    const showError = (key: string, errorId: string) => setError({ key, errorId })
    const hideError = () => setError(null)

    return (
        <ErrorModalContext.Provider value={{ error, showError, hideError }}>
            {children}
            {error && (
                <Modal title="Ne pare rău, a apărut o eroare" onClose={hideError}>
                    <p>
                        A apărut o eroare neașteptată. Dacă problema persistă, te rugăm să ne
                        contactezi și să menționezi codul de mai jos.
                    </p>
                    <p className="error-modal-id">
                        Cod eroare: <code>{error.errorId}</code>
                        <button type="button" onClick={() => navigator.clipboard.writeText(error.errorId)}>
                            Copiază
                        </button>
                    </p>
                    {/* TODO: cand se conecteaza API-ul real, se poate adauga ?errorId= ca search param
                        pe /contact (primul precedent de search params din router) ca sa se preia automat in mesaj */}
                    <Link to="/contact" onClick={hideError}>
                        Mergi la pagina de contact
                    </Link>
                </Modal>
            )}
        </ErrorModalContext.Provider>
    )
}
