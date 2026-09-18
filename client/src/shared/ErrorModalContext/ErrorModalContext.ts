import { createContext, useContext } from 'react'

export interface ErrorModalState {
    key: string
    errorId: string
}

export interface ErrorModalContextValue {
    error: ErrorModalState | null
    showError: (key: string, errorId: string) => void
    hideError: () => void
}

export const ErrorModalContext = createContext<ErrorModalContextValue | undefined>(undefined)

export function useErrorModal() {
    const ctx = useContext(ErrorModalContext)
    if (!ctx) {
        throw new Error('useErrorModal trebuie folosit în interiorul ErrorModalProvider')
    }
    return ctx
}
