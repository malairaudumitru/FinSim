import { createContext, useContext, useState, type ReactNode } from 'react'

export type NotificationType = 'scenariu' | 'cont' | 'sistem'

export interface NotificationItem {
    id: string
    tip: NotificationType
    mesaj: string
    data: string
    citit: boolean
}

const initialNotifications: NotificationItem[] = [
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

interface NotificationsContextValue {
    notifications: NotificationItem[]
    unreadCount: number
    markAsRead: (id: string) => void
    markAllAsRead: () => void
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined)

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

export function useNotifications() {
    const ctx = useContext(NotificationsContext)
    if (!ctx) {
        throw new Error('useNotifications trebuie folosit în interiorul NotificationsProvider')
    }
    return ctx
}