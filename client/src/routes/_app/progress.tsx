import { createFileRoute } from '@tanstack/react-router'
import ProgressPage from '../../components/ProgressPage/ProgressPage'
import RequireAuth from '../../shared/RequireAuth/RequireAuth'

export const Route = createFileRoute('/_app/progress')({
    component: () => (
        <RequireAuth>
            <ProgressPage />
        </RequireAuth>
    ),
})
