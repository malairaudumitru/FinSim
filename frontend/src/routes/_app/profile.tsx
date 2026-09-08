import { createFileRoute } from '@tanstack/react-router'
import ProfilePage from '../../components/ProfilePage/ProfilePage'

export const Route = createFileRoute('/_app/profile')({
    component: ProfilePage,
})