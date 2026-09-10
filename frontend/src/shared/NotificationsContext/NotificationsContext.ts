import { createContext, useContext } from 'react'

export type NotificationType = 'scenariu' | 'cont' | 'sistem'

export interface NotificationItem {
    id: string
    tip: NotificationType
    mesaj: string
    data: string
    citit: boolean
}

export const initialNotifications: NotificationItem[] = [
    {
        id: '1',
        tip: 'scenariu',
        mesaj: 'Ai finalizat scenariul „Primul salariu" cu scorul 82/100.',
        data: '02.09.2026',
        citit: false,
    },
    {
        id: '2',
        tip: 'sistem',
        mesaj: 'Scenariu nou disponibil: „Primul credit".',
        data: '30.08.2026',
        citit: false,
    },
    {
        id: '3',
        tip: 'cont',
        mesaj: 'Parola contului a fost schimbată cu succes.',
        data: '28.08.2026',
        citit: true,
    },
    {
        id: '4',
        tip: 'scenariu',
        mesaj: 'Ai finalizat scenariul „Chirie și facturi" cu scorul 65/100.',
        data: '28.08.2026',
        citit: true,
    },
    {
        id: '5',
        tip: 'cont',
        mesaj: 'Profilul tău a fost actualizat.',
        data: '20.08.2026',
        citit: true,
    },
]

export interface NotificationsContextValue {
    notifications: NotificationItem[]
    unreadCount: number
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    addNotification: (notification: Omit<NotificationItem, 'id'>) => void
    updateNotification: (id: string, patch: Partial<Omit<NotificationItem, 'id'>>) => void
    deleteNotification: (id: string) => void
}

export const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined)

export function useNotifications() {
    const ctx = useContext(NotificationsContext)
    if (!ctx) {
        throw new Error('useNotifications trebuie folosit în interiorul NotificationsProvider')
    }
    return ctx
}