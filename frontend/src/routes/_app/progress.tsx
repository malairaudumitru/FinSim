import { createFileRoute } from '@tanstack/react-router'
import ProgressPage from '../../components/ProgressPage/ProgressPage'

export const Route = createFileRoute('/_app/progress')({
    component: ProgressPage,
})