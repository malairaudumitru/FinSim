import { useState, type ReactNode } from 'react'
import { UsersContext, initialUsers, type AppUser } from './UsersContext.ts'

export function UsersProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<AppUser[]>(initialUsers)

    const addUser = (user: Omit<AppUser, 'id'>) => {
        const newUser: AppUser = { ...user, id: `u${Date.now()}` }
        setUsers((prev) => [...prev, newUser])
        return newUser
    }

    const updateUser = (id: string, patch: Partial<Omit<AppUser, 'id'>>) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)))
    }

    const deleteUser = (id: string) => {
        setUsers((prev) => prev.filter((u) => u.id !== id))
    }

    const findByEmail = (email: string) => users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    return (
        <UsersContext.Provider value={{ users, addUser, updateUser, deleteUser, findByEmail }}>
            {children}
        </UsersContext.Provider>
    )
}
