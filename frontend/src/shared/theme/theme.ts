export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'finsim-theme'

export function getStoredTheme(): Theme | null {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
}

export function getSystemTheme(): Theme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: Theme) {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
}

export function initTheme(): Theme {
    const theme = getStoredTheme() ?? getSystemTheme()
    document.documentElement.setAttribute('data-theme', theme)
    return theme
}