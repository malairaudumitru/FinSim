import { api } from './api'

export const UserRole = {
    User: 0,
    Admin: 1,
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const UserStatus = {
    Active: 0,
    Blocked: 1,
} as const
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]

export interface UserInfoDto {
    id: number
    lastName: string
    firstName: string
    email: string
    role: UserRole
    status: UserStatus
    registeredAt: string
    completedScenarios: number
    totalScore: number
    birthDate: string | null
    isDeleted: boolean
}

export interface UserCreateDto {
    lastName: string
    firstName: string
    email: string
    password: string
    role: UserRole
    status: UserStatus
    completedScenarios: number
    totalScore: number
    birthDate: string
}

export interface UserUpdateDto {
    lastName: string
    firstName: string
    email: string
    password?: string
    role: UserRole
    status: UserStatus
    completedScenarios: number
    totalScore: number
    birthDate: string | null
}

export function getUserList(): Promise<UserInfoDto[]> {
    return api.get<UserInfoDto[]>('/users/list')
}

export function createUser(data: UserCreateDto): Promise<string> {
    return api.post<string>('/users/create', data)
}

export function updateUser(id: number, data: UserUpdateDto): Promise<string> {
    return api.put<string>(`/users/update/${id}`, data)
}

export function deleteUser(id: number): Promise<string> {
    return api.delete<string>(`/users/${id}`)
}
