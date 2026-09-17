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

export interface UserRegisterDto {
    lastName: string
    firstName: string
    email: string
    password: string
    birthDate: string | null
}

export async function registerStart(data: UserRegisterDto): Promise<string> {
    const res = await apiClient.post<string>('/register/start', data)
    return res.data
}

export async function registerConfirm(email: string, code: string): Promise<string> {
    const res = await apiClient.post<string>('/register/confirm', { email, code })
    return res.data
}

export async function forgotPassword(email: string): Promise<string> {
    const res = await apiClient.post<string>('/session/forgot-password', { email })
    return res.data
}

export async function verifyResetCode(email: string, code: string): Promise<string> {
    const res = await apiClient.post<string>('/session/verify-reset-code', { email, code })
    return res.data
}

export async function resetPassword(email: string, code: string, newPassword: string): Promise<string> {
    const res = await apiClient.post<string>('/session/reset-password', { email, code, newPassword })
    return res.data
}
