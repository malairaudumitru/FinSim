import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/styles.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { initTheme } from './shared/theme'
import { AuthProvider } from './shared/AuthContext'
import { NotificationsProvider } from './shared/NotificationsContext'

initTheme()

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <NotificationsProvider>
                <RouterProvider router={router} />
            </NotificationsProvider>
        </AuthProvider>
    </StrictMode>,
)