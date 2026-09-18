import { useState, type ReactNode } from 'react'
import { AuthContext, type AuthUser } from './AuthContext.ts'
import { clearTokens, getRefreshToken } from '../../api/tokenStorage'
import { logout as logoutApi } from '../../api/authApi'

const REMEMBER_KEY = 'finsim_auth_remember'
const SESSION_KEY = 'finsim_auth_session'
const REMEMBER_DAYS = 7

interface StoredAuth {
    user: AuthUser
    expiresAt: number
}

function loadInitialUser(): AuthUser | null {
    try {
        const remembered = localStorage.getItem(REMEMBER_KEY)
        if (remembered) {
            const parsed = JSON.parse(remembered) as StoredAuth
            if (parsed.expiresAt > Date.now()) {
                return parsed.user
            }
            localStorage.removeItem(REMEMBER_KEY)
        }
    } catch {
        // localStorage indisponibil (ex. mod privat) - ignoram
    }

    try {
        const sessionRaw = sessionStorage.getItem(SESSION_KEY)
        if (sessionRaw) {
            return JSON.parse(sessionRaw) as AuthUser
        }
    } catch {
        // sessionStorage indisponibil - ignoram
    }

    return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => loadInitialUser())

    const login = (nextUser: AuthUser, rememberMe = false) => {
        setUser(nextUser)
        try {
            if (rememberMe) {
                const stored: StoredAuth = {
                    user: nextUser,
                    expiresAt: Date.now() + REMEMBER_DAYS * 24 * 60 * 60 * 1000,
                }
                localStorage.setItem(REMEMBER_KEY, JSON.stringify(stored))
                sessionStorage.removeItem(SESSION_KEY)
            } else {
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
                localStorage.removeItem(REMEMBER_KEY)
            }
        } catch {
            // persistenta indisponibila - ramane doar in memorie (React state)
        }
    }

    const logout = () => {
        setUser(null)
        try {
            localStorage.removeItem(REMEMBER_KEY)
            sessionStorage.removeItem(SESSION_KEY)
        } catch {
            // ignoram
        }

        const refreshToken = getRefreshToken()
        clearTokens()
        if (refreshToken) {
            logoutApi(refreshToken).catch(() => {
                // best-effort - token-urile locale sunt oricum sterse deja
            })
        }
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn: user !== null, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
