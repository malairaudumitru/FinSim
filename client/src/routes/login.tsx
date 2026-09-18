import { createFileRoute } from '@tanstack/react-router'
import AuthPage from '../components/AuthPage/AuthPage'

export const Route = createFileRoute('/login')({
    component: AuthPage,
})