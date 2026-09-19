import { createFileRoute } from '@tanstack/react-router'
import NotificationsPage from '../../components/NotificationsPage/NotificationsPage'
import RequireAuth from '../../shared/RequireAuth/RequireAuth'

export const Route = createFileRoute('/_app/notifications')({
    component: () => (
        <RequireAuth>
            <NotificationsPage />
        </RequireAuth>
    ),
})
