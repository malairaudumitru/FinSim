import { useState, type ReactNode } from 'react'
import { NotificationsContext, initialNotifications, type NotificationItem } from './NotificationsContext.ts'

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)

    const markAsRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, citit: true } : n)))
    }

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, citit: true })))
    }

    const unreadCount = notifications.filter((n) => !n.citit).length

    return (
        <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
            {children}
        </NotificationsContext.Provider>
    )
}