import apiClient from './apiClient'

export interface AuthResponseDto {
    accessToken: string
    refreshToken: string
}

export const UserRole = {
    User: 0,
    Admin: 1,
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export interface UserInfoDto {
    id: number
    lastName: string
    firstName: string
    email: string
    role: UserRole
    status: number
    registeredAt: string
    completedScenarios: number
    totalScore: number
    birthDate: string | null
    isDeleted: boolean
}

export async function login(email: string, password: string): Promise<AuthResponseDto> {
    const res = await apiClient.post<AuthResponseDto>('/session/login', { email, password })
    return res.data
}

export async function me(): Promise<UserInfoDto> {
    const res = await apiClient.get<UserInfoDto>('/session/me')
    return res.data
}

export async function logout(refreshToken: string): Promise<void> {
    await apiClient.post('/session/logout', { refreshToken })
}
