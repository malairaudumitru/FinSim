import { createContext, useContext, useState, type ReactNode } from 'react'

export interface AuthUser {
    email: string
    nume?: string
    prenume?: string
}

interface AuthContextValue {
    isLoggedIn: boolean
    user: AuthUser | null
    login: (user: AuthUser) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)

    const login = (nextUser: AuthUser) => setUser(nextUser)
    const logout = () => setUser(null)

    return (
        <AuthContext.Provider value={{ isLoggedIn: user !== null, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error('useAuth trebuie folosit în interiorul AuthProvider')
    }
    return ctx
}