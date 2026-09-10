import { useState, type ReactNode } from 'react'
import { MessagesContext, initialMessages, type ContactMessage } from './MessagesContext.ts'

export function MessagesProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<ContactMessage[]>(initialMessages)

    const addMessage = (message: Omit<ContactMessage, 'id' | 'citit' | 'data'>) => {
        setMessages((prev) => [
            { ...message, id: `m${Date.now()}`, citit: false, data: new Date().toISOString() },
            ...prev,
        ])
    }

    const markAsRead = (id: string) => {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, citit: true } : m)))
    }

    const replyToMessage = (id: string, raspuns: string) => {
        setMessages((prev) =>
            prev.map((m) =>
                m.id === id
                    ? { ...m, raspuns, raspunsData: new Date().toISOString(), citit: true }
                    : m
            )
        )
    }

    const deleteMessage = (id: string) => {
        setMessages((prev) => prev.filter((m) => m.id !== id))
    }

    const unreadCount = messages.filter((m) => !m.citit).length

    return (
        <MessagesContext.Provider
            value={{ messages, unreadCount, addMessage, markAsRead, replyToMessage, deleteMessage }}
        >
            {children}
        </MessagesContext.Provider>
    )
}
