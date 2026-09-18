import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/styles/styles.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { initTheme } from './shared/theme/theme'
import './shared/i18n/i18n'
import { AuthProvider } from './shared/AuthContext/AuthProvider'
import { NotificationsProvider } from './shared/NotificationsContext/NotificationsProvider'
import { ScenarioHistoryProvider } from './shared/ScenarioHistoryContext/ScenarioHistoryProvider'
import { ReviewsProvider } from './shared/ReviewsContext/ReviewsProvider'
import { UsersProvider } from './shared/UsersContext/UsersProvider'
import { LeaderboardProvider } from './shared/LeaderboardContext/LeaderboardProvider'
import { ScenariosProvider } from './shared/ScenariosContext/ScenariosProvider'
import { ResourcesProvider } from './shared/ResourcesContext/ResourcesProvider'
import { MessagesProvider } from './shared/MessagesContext/MessagesProvider'

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
            <UsersProvider>
                <NotificationsProvider>
                    <ReviewsProvider>
                        <LeaderboardProvider>
                            <ScenariosProvider>
                                <ScenarioHistoryProvider>
                                    <ResourcesProvider>
                                        <MessagesProvider>
                                            <RouterProvider router={router} />
                                        </MessagesProvider>
                                    </ResourcesProvider>
                                </ScenarioHistoryProvider>
                            </ScenariosProvider>
                        </LeaderboardProvider>
                    </ReviewsProvider>
                </NotificationsProvider>
            </UsersProvider>
        </AuthProvider>
    </StrictMode>,
)