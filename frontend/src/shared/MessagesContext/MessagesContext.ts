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

export const initialMessages: ContactMessage[] = [
    {
        id: 'm1',
        nume: 'Elena Munteanu',
        email: 'elena.munteanu@exemplu.com',
        mesaj:
            'Bună! Am observat că scenariul „Primul credit" nu îmi salvează scorul de credit între pași. E un bug sau lucrez eu ceva greșit?',
        data: '2026-09-05T10:12:00.000Z',
        citit: true,
        raspuns: 'Bună, Elena! Am verificat — a fost un bug, l-am corectat. Mulțumim de semnalare!',
        raspunsData: '2026-09-05T14:30:00.000Z',
    },
    {
        id: 'm2',
        nume: 'Radu Fusu',
        email: 'radu.fusu@exemplu.com',
        mesaj:
            'Salut, ați putea adăuga un scenariu despre economisirea pentru studii? Cred că ar fi util pentru mulți liceeni.',
        data: '2026-09-08T09:45:00.000Z',
        citit: false,
    },
]

export interface MessagesContextValue {
    messages: ContactMessage[]
    unreadCount: number
    addMessage: (message: Omit<ContactMessage, 'id' | 'citit' | 'data'>) => void
    markAsRead: (id: string) => void
    replyToMessage: (id: string, raspuns: string) => void
    deleteMessage: (id: string) => void
}

export const MessagesContext = createContext<MessagesContextValue | undefined>(undefined)

export function useMessages() {
    const ctx = useContext(MessagesContext)
    if (!ctx) {
        throw new Error('useMessages trebuie folosit în interiorul MessagesProvider')
    }
    return ctx
}
