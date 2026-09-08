import { useState, type ReactNode } from 'react'
import { AuthContext, type AuthUser } from './AuthContext.ts'

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