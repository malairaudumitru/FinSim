import { useEffect, useState } from 'react'
import { applyTheme, getStoredTheme, getSystemTheme, type Theme } from '../theme/theme.ts'
import './ThemeToggle.css'

function SunIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
        </svg>
    )
}

function MoonIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
        </svg>
    )
}

function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>('light')

    useEffect(() => {
        setTheme(getStoredTheme() ?? getSystemTheme())
    }, [])

    const toggle = () => {
        const next: Theme = theme === 'dark' ? 'light' : 'dark'
        setTheme(next)
        applyTheme(next)
    }

    return (
        <button
            type="button"
            className="theme-toggle"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Comută la tema deschisă' : 'Comută la tema întunecată'}
        >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
    )
}

export default ThemeToggle