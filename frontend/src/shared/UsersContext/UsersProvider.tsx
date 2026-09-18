import { useEffect, useState, type ReactNode } from 'react'
import { UsersContext, type AppUser, type NewUserInput } from './UsersContext.ts'
import { useAuth } from '../AuthContext/AuthContext'
import * as usersApi from '../../api/usersApi'
import { toAppUser, toUserCreateDto, toUserUpdateDto } from '../users/userMapper'

export function UsersProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const isAdmin = user?.rol === 'admin'
    const [users, setUsers] = useState<AppUser[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const task = isAdmin ? usersApi.getUserList().catch(() => []) : Promise.resolve([])
        task.then((list) => setUsers(list.map(toAppUser))).finally(() => setLoading(false))
    }, [isAdmin])

    const addUser = async ({ parola, ...rest }: NewUserInput) => {
        await usersApi.createUser(toUserCreateDto(rest, parola))
        const list = await usersApi.getUserList()
        setUsers(list.map(toAppUser))
    }

    const updateUser = async (id: string, patch: Omit<AppUser, 'id' | 'dataInregistrare'>) => {
        await usersApi.updateUser(Number(id), toUserUpdateDto(patch))
        const list = await usersApi.getUserList()
        setUsers(list.map(toAppUser))
    }

    const deleteUser = async (id: string) => {
        await usersApi.deleteUser(Number(id))
        setUsers((prev) => prev.filter((u) => u.id !== id))
    }

    return (
        <UsersContext.Provider value={{ users, loading, addUser, updateUser, deleteUser }}>
            {children}
        </UsersContext.Provider>
    )
}
