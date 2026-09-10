import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../AuthContext/AuthContext.ts'
import './AvatarMenu.css'

function AvatarMenu() {
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
                aria-label="Meniul contului"
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
                        Profilul meu
                    </Link>
                    <Link to="/progress" className="avatar-dropdown-item" onClick={() => setOpen(false)}>
                        Progresul meu
                    </Link>
                    {user.rol === 'admin' && (
                        <Link to="/admin" className="avatar-dropdown-item" onClick={() => setOpen(false)}>
                            Panou admin
                        </Link>
                    )}
                    <button type="button" className="avatar-dropdown-item avatar-dropdown-logout" onClick={handleLogout}>
                        Deconectare
                    </button>
                </div>
            )}
        </div>
    )
}

export default AvatarMenu