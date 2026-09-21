import { createContext, useContext } from 'react'

export type NotificationType = 'scenariu' | 'cont' | 'sistem'

export interface NotificationItem {
    id: string
    tip: NotificationType
    mesaj: string
    mesajRo: string
    mesajEn: string
    mesajRu: string
    data: string
    citit: boolean
    email: string
    contactMessageId?: number
}

export interface NotificationsContextValue {
    notifications: NotificationItem[]
    unreadCount: number
    loading: boolean
    markAsRead: (id: string) => Promise<void>
    markAllAsRead: () => Promise<void>
    refresh: () => Promise<void>
}

export const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined)

export function useNotifications() {
    const ctx = useContext(NotificationsContext)
    if (!ctx) {
        throw new Error('useNotifications trebuie folosit în interiorul NotificationsProvider')
    }
    return ctx
}
