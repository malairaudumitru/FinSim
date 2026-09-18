import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { MessagesContext, type ContactMessage } from './MessagesContext.ts'
import { useAuth } from '../AuthContext/AuthContext'
import { useErrorModal } from '../ErrorModalContext/ErrorModalContext'
import { reportIfServerError, reportingCall } from '../reportServerError'
import * as messagesApi from '../../api/messagesApi'
import { toContactMessage } from '../messages/messageMapper'

export function MessagesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const { showError } = useErrorModal()
    const isAdmin = user?.rol === 'admin'
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)

    const refresh = async () => {
        if (!isAdmin) return
        try {
            const list = await messagesApi.getMessageList()
            setMessages(list.map(toContactMessage))
        } catch (err) {
            reportIfServerError(err, showError)
            setMessages([])
        }
    }

    useEffect(() => {
        const task = isAdmin
            ? messagesApi.getMessageList().catch((err) => {
                  reportIfServerError(err, showError)
                  return []
              })
            : Promise.resolve([])
        task.then((list) => setMessages(list.map(toContactMessage))).finally(() => setLoading(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin])

    const unreadCount = useMemo(() => messages.filter((m) => !m.citit).length, [messages])

    const addMessage = async (mesaj: string) => {
        await reportingCall(messagesApi.createMessage({ message: mesaj }), showError)
    }

    const markAsRead = async (id: string) => {
        const dto = await reportingCall(messagesApi.getMessageById(Number(id)), showError)
        setMessages((prev) => prev.map((m) => (m.id === id ? toContactMessage(dto) : m)))
    }

    const replyToMessage = async (id: string, raspuns: string) => {
        await reportingCall(messagesApi.replyToMessage(Number(id), { reply: raspuns }), showError)
        const dto = await messagesApi.getMessageById(Number(id))
        setMessages((prev) => prev.map((m) => (m.id === id ? toContactMessage(dto) : m)))
    }

    const deleteMessage = async (id: string) => {
        await reportingCall(messagesApi.deleteMessage(Number(id)), showError)
        setMessages((prev) => prev.filter((m) => m.id !== id))
    }

    return (
        <MessagesContext.Provider
            value={{ messages, unreadCount, loading, addMessage, markAsRead, replyToMessage, deleteMessage, refresh }}
        >
            {children}
        </MessagesContext.Provider>
    )
}
