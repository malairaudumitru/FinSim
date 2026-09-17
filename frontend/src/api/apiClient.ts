import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { clearTokens, getAccessToken, getRefreshToken, isRemembered, setTokens } from './tokenStorage'

const baseURL = import.meta.env.VITE_API_BASE_URL

const apiClient = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
    const token = getAccessToken()
    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`)
    }
    return config
})

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
    _retried?: boolean
}

let refreshPromise: Promise<string | null> | null = null

async function performRefresh(): Promise<string | null> {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return null

    try {
        const res = await axios.post<{ accessToken: string; refreshToken: string }>(
            `${baseURL}/session/refresh`,
            { refreshToken },
        )
        setTokens(res.data.accessToken, res.data.refreshToken, isRemembered())
        return res.data.accessToken
    } catch {
        clearTokens()
        return null
    }
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetriableRequestConfig | undefined
        const isRefreshCall = originalRequest?.url?.includes('/session/refresh')

        if (error.response?.status === 401 && originalRequest && !originalRequest._retried && !isRefreshCall) {
            originalRequest._retried = true

            if (!refreshPromise) {
                refreshPromise = performRefresh().finally(() => {
                    refreshPromise = null
                })
            }

            const newAccessToken = await refreshPromise
            if (newAccessToken) {
                originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`)
                return apiClient(originalRequest)
            }
        }

        return Promise.reject(error)
    },
)

export default apiClient

export type ApiErrorKind = 'validation' | 'server' | 'network'

export interface NormalizedApiError {
    status: number
    kind: ApiErrorKind
    message?: string
    errorKey?: string
    errorId?: string
}

export function normalizeApiError(err: unknown): NormalizedApiError {
    if (!axios.isAxiosError(err) || !err.response) {
        return { status: 0, kind: 'network' }
    }

    const { status, data } = err.response

    if (status === 500 && data && typeof data === 'object' && 'errorKey' in data && 'errorId' in data) {
        const body = data as { errorKey: string; errorId: string }
        return { status, kind: 'server', errorKey: body.errorKey, errorId: body.errorId }
    }

    if (typeof data === 'string') {
        return { status, kind: 'validation', message: data }
    }

    if (data && typeof data === 'object' && 'errors' in data) {
        const problem = data as { errors?: Record<string, string[]> }
        const firstError = problem.errors ? Object.values(problem.errors)[0]?.[0] : undefined
        return { status, kind: 'validation', message: firstError }
    }

    return { status, kind: 'validation' }
}
