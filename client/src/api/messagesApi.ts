import { api } from './api'

export interface ContactMessageInfoDto {
    id: number
    name: string
    email: string
    message: string
    userId: number
    createdAt: string
    isRead: boolean
    reply: string | null
    replyDate: string | null
    isDeleted: boolean
}

export interface ContactMessageCreateDto {
    message: string
}

export interface ContactMessageReplyDto {
    reply: string
}

export function getMessageList(): Promise<ContactMessageInfoDto[]> {
    return api.get<ContactMessageInfoDto[]>('/messages/list')
}

export function getMessageById(id: number): Promise<ContactMessageInfoDto> {
    return api.get<ContactMessageInfoDto>(`/messages/${id}`)
}

export function getOwnMessage(id: number): Promise<ContactMessageInfoDto> {
    return api.get<ContactMessageInfoDto>(`/messages/mine/${id}`)
}

export function createMessage(data: ContactMessageCreateDto): Promise<string> {
    return api.post<string>('/messages/create', data)
}

export function replyToMessage(id: number, data: ContactMessageReplyDto): Promise<string> {
    return api.put<string>(`/messages/${id}/reply`, data)
}

export function deleteMessage(id: number): Promise<string> {
    return api.delete<string>(`/messages/${id}`)
}
