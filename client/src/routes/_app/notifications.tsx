import { createFileRoute } from '@tanstack/react-router'
import NotificationsPage from '../../components/NotificationsPage/NotificationsPage'

export const Route = createFileRoute('/_app/notifications')({
  component: NotificationsPage,
})