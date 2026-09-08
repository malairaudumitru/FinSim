import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/styles/styles.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { initTheme } from './shared/theme/theme.ts'
import { AuthProvider } from './shared/AuthContext/AuthProvider.tsx'
import { NotificationsProvider } from './shared/NotificationsContext/NotificationsProvider.tsx'
import { ScenarioHistoryProvider } from './shared/ScenarioHistoryContext/ScenarioHistoryProvider.tsx'

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
                <ScenarioHistoryProvider>
                    <RouterProvider router={router} />
                </ScenarioHistoryProvider>
            </NotificationsProvider>
        </AuthProvider>
    </StrictMode>,
)