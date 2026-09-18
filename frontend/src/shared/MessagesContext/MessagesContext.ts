import { createContext, useContext } from 'react'

export interface ContactMessage {
    id: string
    nume: string
    email: string
    mesaj: string
    data: string
    citit: boolean
    raspuns?: string
    raspunsData?: string
}

export interface MessagesContextValue {
    messages: ContactMessage[]
    unreadCount: number
    loading: boolean
    addMessage: (mesaj: string) => Promise<void>
    markAsRead: (id: string) => Promise<void>
    replyToMessage: (id: string, raspuns: string) => Promise<void>
    deleteMessage: (id: string) => Promise<void>
}

export const MessagesContext = createContext<MessagesContextValue | undefined>(undefined)

export function useMessages() {
    const ctx = useContext(MessagesContext)
    if (!ctx) {
        throw new Error('useMessages trebuie folosit în interiorul MessagesProvider')
    }
    return ctx
}
