import { useEffect, useState, type ReactNode } from 'react'
import { UsersContext, type AppUser, type NewUserInput } from './UsersContext.ts'
import { useAuth } from '../AuthContext/AuthContext'
import { useErrorModal } from '../ErrorModalContext/ErrorModalContext'
import { reportIfServerError, reportingCall } from '../reportServerError'
import * as usersApi from '../../api/usersApi'
import { toAppUser, toUserCreateDto, toUserUpdateDto } from '../users/userMapper'

export function UsersProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const { showError } = useErrorModal()
    const isAdmin = user?.rol === 'admin'
    const [users, setUsers] = useState<AppUser[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const task = isAdmin
            ? usersApi.getUserList().catch((err) => {
                  reportIfServerError(err, showError)
                  return []
              })
            : Promise.resolve([])
        task.then((list) => setUsers(list.map(toAppUser))).finally(() => setLoading(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin])

    const addUser = async ({ parola, ...rest }: NewUserInput) => {
        await reportingCall(usersApi.createUser(toUserCreateDto(rest, parola)), showError)
        const list = await usersApi.getUserList()
        setUsers(list.map(toAppUser))
    }

    const updateUser = async (id: string, patch: Omit<AppUser, 'id' | 'dataInregistrare'>) => {
        await reportingCall(usersApi.updateUser(Number(id), toUserUpdateDto(patch)), showError)
        const list = await usersApi.getUserList()
        setUsers(list.map(toAppUser))
    }

    const deleteUser = async (id: string) => {
        await reportingCall(usersApi.deleteUser(Number(id)), showError)
        setUsers((prev) => prev.filter((u) => u.id !== id))
    }

    return (
        <UsersContext.Provider value={{ users, loading, addUser, updateUser, deleteUser }}>
            {children}
        </UsersContext.Provider>
    )
}
