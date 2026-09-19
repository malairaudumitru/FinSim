import { createFileRoute } from '@tanstack/react-router'
import AdminDashboard from '../../components/AdminDashboard/AdminDashboard'
import RequireAuth from '../../shared/RequireAuth/RequireAuth'

export const Route = createFileRoute('/_app/admin')({
    component: () => (
        <RequireAuth>
            <AdminDashboard />
        </RequireAuth>
    ),
})
