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

    const addNotification = (notification: Omit<NotificationItem, 'id'>) => {
        setNotifications((prev) => [{ ...notification, id: `n${Date.now()}` }, ...prev])
    }

    const updateNotification = (id: string, patch: Partial<Omit<NotificationItem, 'id'>>) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)))
    }

    const deleteNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }

    const unreadCount = notifications.filter((n) => !n.citit).length

    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead,
                addNotification,
                updateNotification,
                deleteNotification,
            }}
        >
            {children}
        </NotificationsContext.Provider>
    )
}
