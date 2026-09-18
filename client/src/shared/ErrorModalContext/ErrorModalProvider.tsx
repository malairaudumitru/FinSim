import { useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import Modal from '../Modal/Modal'
import { useAuth } from '../AuthContext/AuthContext'
import { ErrorModalContext, type ErrorModalState } from './ErrorModalContext.ts'
import './ErrorModal.css'

const SUPPORT_EMAIL = 'adminfinsim@gmail.com'

export function ErrorModalProvider({ children }: { children: ReactNode }) {
    const { t } = useTranslation()
    const { isLoggedIn } = useAuth()
    const [error, setError] = useState<ErrorModalState | null>(null)

    const showError = (key: string, errorId: string) => setError({ key, errorId })
    const hideError = () => setError(null)

    return (
        <ErrorModalContext.Provider value={{ error, showError, hideError }}>
            {children}
            {error && (
                <Modal title={t('errorModal.title')} onClose={hideError}>
                    <p>{t('errorModal.message')}</p>
                    <p className="error-modal-id">
                        {t('errorModal.error_code_label')} <code>{error.errorId}</code>
                        <button type="button" onClick={() => navigator.clipboard.writeText(error.errorId)}>
                            {t('errorModal.copy')}
                        </button>
                    </p>
                    {isLoggedIn ? (
                        <Link to="/contact" onClick={hideError}>
                            {t('errorModal.go_to_contact')}
                        </Link>
                    ) : (
                        <a href={`mailto:${SUPPORT_EMAIL}`}>
                            {t('errorModal.email_us', { email: SUPPORT_EMAIL })}
                        </a>
                    )}
                </Modal>
            )}
        </ErrorModalContext.Provider>
    )
}
