import { createFileRoute } from '@tanstack/react-router'
import AdminDashboard from '../../components/AdminDashboard/AdminDashboard'

export const Route = createFileRoute('/_app/admin')({
    component: AdminDashboard,
})
