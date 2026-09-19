import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { NotificationsContext, type NotificationItem } from './NotificationsContext.ts'
import { useAuth } from '../AuthContext/AuthContext'
import { useErrorModal } from '../ErrorModalContext/ErrorModalContext'
import { reportIfServerError, reportingCall } from '../reportServerError'
import * as notificationsApi from '../../api/notificationsApi'
import { toNotificationItem } from '../notifications/notificationMapper'

const NOTIFICATIONS_POLL_MS = 15000

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const { showError } = useErrorModal()
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [loading, setLoading] = useState(true)

    const refresh = async () => {
        const userId = user?.id
        if (userId === undefined) return
        const email = user?.email ?? ''
        try {
            const list = await notificationsApi.getNotificationByUserId(userId)
            setNotifications(list.map((dto) => toNotificationItem(dto, email)))
        } catch (err) {
            reportIfServerError(err, showError)
            setNotifications([])
        }
    }

    useEffect(() => {
        const userId = user?.id
        const email = user?.email ?? ''
        const task =
            userId === undefined
                ? Promise.resolve([])
                : notificationsApi.getNotificationByUserId(userId).catch((err) => {
                      reportIfServerError(err, showError)
                      return []
                  })

        task
            .then((list) => setNotifications(list.map((dto) => toNotificationItem(dto, email))))
            .finally(() => setLoading(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, user?.email])

    useEffect(() => {
        const userId = user?.id
        if (userId === undefined) return
        const email = user?.email ?? ''

        // Silent poll: a transient failure keeps the current list instead of wiping it.
        const poll = () => {
            if (document.visibilityState !== 'visible') return
            notificationsApi
                .getNotificationByUserId(userId)
                .then((list) => setNotifications(list.map((dto) => toNotificationItem(dto, email))))
                .catch(() => {})
        }

        const interval = window.setInterval(poll, NOTIFICATIONS_POLL_MS)
        document.addEventListener('visibilitychange', poll)
        window.addEventListener('focus', poll)
        return () => {
            window.clearInterval(interval)
            document.removeEventListener('visibilitychange', poll)
            window.removeEventListener('focus', poll)
        }
    }, [user?.id, user?.email])

    const unreadCount = useMemo(() => notifications.filter((n) => !n.citit).length, [notifications])

    const markAsRead = async (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, citit: true } : n)))
        await reportingCall(notificationsApi.updateReadStatus(Number(id)), showError)
    }

    const markAllAsRead = async () => {
        if (user?.id === undefined) return
        setNotifications((prev) => prev.map((n) => ({ ...n, citit: true })))
        await reportingCall(notificationsApi.markAllAsRead(user.id), showError)
    }

    return (
        <NotificationsContext.Provider value={{ notifications, unreadCount, loading, markAsRead, markAllAsRead, refresh }}>
            {children}
        </NotificationsContext.Provider>
    )
}
