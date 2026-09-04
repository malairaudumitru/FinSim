import { createFileRoute } from '@tanstack/react-router'
import AppLayout from '../shared/AppLayout'

export const Route = createFileRoute('/_app')({
    component: AppLayout,
})