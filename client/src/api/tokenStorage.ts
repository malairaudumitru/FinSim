const REMEMBER_KEY = 'finsim_tokens_remember'
const SESSION_KEY = 'finsim_tokens_session'
const REMEMBER_DAYS = 7

interface StoredTokens {
    accessToken: string
    refreshToken: string
    expiresAt?: number
}

function readStored(): StoredTokens | null {
    try {
        const remembered = localStorage.getItem(REMEMBER_KEY)
        if (remembered) {
            const parsed = JSON.parse(remembered) as StoredTokens
            if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
                return parsed
            }
            localStorage.removeItem(REMEMBER_KEY)
        }
    } catch {
        // localStorage indisponibil (ex. mod privat) - ignoram
    }

    try {
        const sessionRaw = sessionStorage.getItem(SESSION_KEY)
        if (sessionRaw) {
            return JSON.parse(sessionRaw) as StoredTokens
        }
    } catch {
        // sessionStorage indisponibil - ignoram
    }

    return null
}

export function getAccessToken(): string | null {
    return readStored()?.accessToken ?? null
}

export function getRefreshToken(): string | null {
    return readStored()?.refreshToken ?? null
}

export function setTokens(accessToken: string, refreshToken: string, rememberMe: boolean): void {
    try {
        if (rememberMe) {
            const stored: StoredTokens = {
                accessToken,
                refreshToken,
                expiresAt: Date.now() + REMEMBER_DAYS * 24 * 60 * 60 * 1000,
            }
            localStorage.setItem(REMEMBER_KEY, JSON.stringify(stored))
            sessionStorage.removeItem(SESSION_KEY)
        } else {
            const stored: StoredTokens = { accessToken, refreshToken }
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(stored))
            localStorage.removeItem(REMEMBER_KEY)
        }
    } catch {
        // persistenta indisponibila - token-urile raman doar in memoria interceptorului curent
    }
}

export function isRemembered(): boolean {
    try {
        return localStorage.getItem(REMEMBER_KEY) !== null
    } catch {
        return false
    }
}

export function clearTokens(): void {
    try {
        localStorage.removeItem(REMEMBER_KEY)
        sessionStorage.removeItem(SESSION_KEY)
    } catch {
        // ignoram
    }
}
