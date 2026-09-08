import { createContext, useContext } from 'react'

export interface AuthUser {
    email: string
    nume?: string
    prenume?: string
    zi?: number
    luna?: number
    an?: number
}

export interface AuthContextValue {
    isLoggedIn: boolean
    user: AuthUser | null
    login: (user: AuthUser) => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error('useAuth trebuie folosit în interiorul AuthProvider')
    }
    return ctx
}