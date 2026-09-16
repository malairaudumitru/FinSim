import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../AuthContext/AuthContext.ts'
import './AvatarMenu.css'

function AvatarMenu() {
    const { t } = useTranslation()
    const { user, logout } = useAuth()
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!user) return null

    const initials = user.prenume && user.nume
        ? `${user.prenume[0]}${user.nume[0]}`
        : user.email[0].toUpperCase()

    const displayName = user.prenume && user.nume ? `${user.prenume} ${user.nume}` : user.email

    const handleLogout = () => {
        setOpen(false)
        logout()
        navigate({ to: '/' })
    }

    return (
        <div className="avatar-menu" ref={menuRef}>
            <button
                type="button"
                className="avatar-trigger"
                onClick={() => setOpen((v) => !v)}
                aria-label={t('avatarMenu.aria_menu')}
                aria-expanded={open}
            >
                {initials}
            </button>

            {open && (
                <div className="avatar-dropdown">
                    <div className="avatar-dropdown-header">
                        <span className="avatar-dropdown-name">{displayName}</span>
                    </div>
                    <Link to="/profile" className="avatar-dropdown-item" onClick={() => setOpen(false)}>
                        {t('avatarMenu.my_profile')}
                    </Link>
                    <Link to="/progress" className="avatar-dropdown-item" onClick={() => setOpen(false)}>
                        {t('avatarMenu.my_progress')}
                    </Link>
                    {user.rol === 'admin' && (
                        <Link to="/admin" className="avatar-dropdown-item" onClick={() => setOpen(false)}>
                            {t('avatarMenu.admin_panel')}
                        </Link>
                    )}
                    <button type="button" className="avatar-dropdown-item avatar-dropdown-logout" onClick={handleLogout}>
                        {t('avatarMenu.logout')}
                    </button>
                </div>
            )}
        </div>
    )
}

export default AvatarMenu