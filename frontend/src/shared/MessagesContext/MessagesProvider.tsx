import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { MessagesContext, type ContactMessage } from './MessagesContext.ts'
import { useAuth } from '../AuthContext/AuthContext'
import * as messagesApi from '../../api/messagesApi'
import { toContactMessage } from '../messages/messageMapper'

export function MessagesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const isAdmin = user?.rol === 'admin'
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const task = isAdmin ? messagesApi.getMessageList().catch(() => []) : Promise.resolve([])
        task.then((list) => setMessages(list.map(toContactMessage))).finally(() => setLoading(false))
    }, [isAdmin])

    const unreadCount = useMemo(() => messages.filter((m) => !m.citit).length, [messages])

    const addMessage = async (mesaj: string) => {
        await messagesApi.createMessage({ message: mesaj })
    }

    const markAsRead = async (id: string) => {
        const dto = await messagesApi.getMessageById(Number(id))
        setMessages((prev) => prev.map((m) => (m.id === id ? toContactMessage(dto) : m)))
    }

    const replyToMessage = async (id: string, raspuns: string) => {
        await messagesApi.replyToMessage(Number(id), { reply: raspuns })
        const dto = await messagesApi.getMessageById(Number(id))
        setMessages((prev) => prev.map((m) => (m.id === id ? toContactMessage(dto) : m)))
    }

    const deleteMessage = async (id: string) => {
        await messagesApi.deleteMessage(Number(id))
        setMessages((prev) => prev.filter((m) => m.id !== id))
    }

    return (
        <MessagesContext.Provider
            value={{ messages, unreadCount, loading, addMessage, markAsRead, replyToMessage, deleteMessage }}
        >
            {children}
        </MessagesContext.Provider>
    )
}
