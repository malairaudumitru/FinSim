import { createContext, useContext } from 'react'

export type UserRole = 'user' | 'admin'
export type UserStatus = 'activ' | 'blocat'

export interface AppUser {
    id: string
    nume: string
    prenume: string
    email: string
    rol: UserRole
    status: UserStatus
    dataInregistrare: string
    scenariiFinalizate: number
    scorTotal: number
    zi?: number
    luna?: number
    an?: number
}

export const ADMIN_EMAIL = 'admin@finsim.md'

export interface NewUserInput extends Omit<AppUser, 'id' | 'dataInregistrare'> {
    parola: string
}

export interface UsersContextValue {
    users: AppUser[]
    loading: boolean
    addUser: (user: NewUserInput) => Promise<void>
    updateUser: (id: string, patch: Omit<AppUser, 'id' | 'dataInregistrare'>) => Promise<void>
    deleteUser: (id: string) => Promise<void>
}

export const UsersContext = createContext<UsersContextValue | undefined>(undefined)

export function useUsers() {
    const ctx = useContext(UsersContext)
    if (!ctx) {
        throw new Error('useUsers trebuie folosit în interiorul UsersProvider')
    }
    return ctx
}
