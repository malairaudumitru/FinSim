import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { NotificationsContext, type NotificationItem } from './NotificationsContext.ts'
import { useAuth } from '../AuthContext/AuthContext'
import * as notificationsApi from '../../api/notificationsApi'
import { toNotificationItem } from '../notifications/notificationMapper'

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const userId = user?.id
        const email = user?.email ?? ''
        const task =
            userId === undefined
                ? Promise.resolve([])
                : notificationsApi.getNotificationByUserId(userId).catch(() => [])

        task
            .then((list) => setNotifications(list.map((dto) => toNotificationItem(dto, email))))
            .finally(() => setLoading(false))
    }, [user?.id, user?.email])

    const unreadCount = useMemo(() => notifications.filter((n) => !n.citit).length, [notifications])

    const markAsRead = async (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, citit: true } : n)))
        await notificationsApi.updateReadStatus(Number(id))
    }

    const markAllAsRead = async () => {
        if (user?.id === undefined) return
        setNotifications((prev) => prev.map((n) => ({ ...n, citit: true })))
        await notificationsApi.markAllAsRead(user.id)
    }

    return (
        <NotificationsContext.Provider value={{ notifications, unreadCount, loading, markAsRead, markAllAsRead }}>
            {children}
        </NotificationsContext.Provider>
    )
}
