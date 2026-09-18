import { api } from './api'

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

export function login(email: string, password: string): Promise<AuthResponseDto> {
    return api.post<AuthResponseDto>('/session/login', { email, password })
}

export function me(): Promise<UserInfoDto> {
    return api.get<UserInfoDto>('/session/me')
}

export function logout(refreshToken: string): Promise<void> {
    return api.post<void>('/session/logout', { refreshToken })
}

export interface UserRegisterDto {
    lastName: string
    firstName: string
    email: string
    password: string
    birthDate: string | null
}

export function registerStart(data: UserRegisterDto): Promise<string> {
    return api.post<string>('/register/start', data)
}

export function registerConfirm(email: string, code: string): Promise<string> {
    return api.post<string>('/register/confirm', { email, code })
}

export function forgotPassword(email: string): Promise<string> {
    return api.post<string>('/session/forgot-password', { email })
}

export function verifyResetCode(email: string, code: string): Promise<string> {
    return api.post<string>('/session/verify-reset-code', { email, code })
}

export function resetPassword(email: string, code: string, newPassword: string): Promise<string> {
    return api.post<string>('/session/reset-password', { email, code, newPassword })
}

export function changePasswordStart(currentPassword: string, newPassword: string): Promise<string> {
    return api.post<string>('/session/change-password/start', { currentPassword, newPassword })
}

export function changePasswordConfirm(code: string): Promise<string> {
    return api.post<string>('/session/change-password/confirm', { code })
}
