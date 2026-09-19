import { createFileRoute } from '@tanstack/react-router'
import ProfilePage from '../../components/ProfilePage/ProfilePage'
import RequireAuth from '../../shared/RequireAuth/RequireAuth'

export const Route = createFileRoute('/_app/profile')({
    component: () => (
        <RequireAuth>
            <ProfilePage />
        </RequireAuth>
    ),
})
