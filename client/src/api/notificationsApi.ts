import { api } from './api'

export const NotificationType = {
    Scenario: 0,
    Account: 1,
    System: 2,
} as const
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

export interface NotificationInfoDto {
    id: number
    type: NotificationType
    message: string
    createdAt: string
    isRead: boolean
    userId: number
    contactMessageId: number | null
    isDeleted: boolean
}

export interface NotificationCreateDto {
    type: NotificationType
    message: string
    email: string
}

export function getNotificationList(): Promise<NotificationInfoDto[]> {
    return api.get<NotificationInfoDto[]>('/notifications/list')
}

export function getNotificationByUserId(userId: number): Promise<NotificationInfoDto[]> {
    return api.get<NotificationInfoDto[]>(`/notifications/by-user/${userId}`)
}

export function createNotification(data: NotificationCreateDto): Promise<string> {
    return api.post<string>('/notifications/create', data)
}

export function updateNotification(id: number, data: NotificationCreateDto): Promise<string> {
    return api.put<string>(`/notifications/update/${id}`, data)
}

export function updateReadStatus(id: number): Promise<string> {
    return api.put<string>(`/notifications/${id}/read-status`, {})
}

export function markAllAsRead(userId: number): Promise<string> {
    return api.put<string>(`/notifications/${userId}/mark-all-read`, {})
}

export function deleteNotification(id: number): Promise<string> {
    return api.delete<string>(`/notifications/${id}`)
}
