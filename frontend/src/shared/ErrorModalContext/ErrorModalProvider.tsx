import { useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import Modal from '../Modal/Modal'
import { ErrorModalContext, type ErrorModalState } from './ErrorModalContext.ts'
import './ErrorModal.css'

export function ErrorModalProvider({ children }: { children: ReactNode }) {
    const { t } = useTranslation()
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
                    {/* TODO: cand se conecteaza API-ul real, se poate adauga ?errorId= ca search param
                        pe /contact (primul precedent de search params din router) ca sa se preia automat in mesaj */}
                    <Link to="/contact" onClick={hideError}>
                        {t('errorModal.go_to_contact')}
                    </Link>
                </Modal>
            )}
        </ErrorModalContext.Provider>
    )
}
