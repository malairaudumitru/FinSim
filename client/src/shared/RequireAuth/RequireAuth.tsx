import type { ReactNode } from 'react'
import { Navigate } from '@tanstack/react-router'
import { useAuth } from '../AuthContext/AuthContext'

/** Renders children only for a logged-in user; guests are sent to the login page. */
function RequireAuth({ children }: { children: ReactNode }) {
    const { isLoggedIn } = useAuth()
    if (!isLoggedIn) return <Navigate to="/login" replace />
    return <>{children}</>
}

export default RequireAuth
