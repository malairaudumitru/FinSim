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

export const initialUsers: AppUser[] = [
    {
        id: 'u1',
        nume: 'Admin',
        prenume: 'FinSim',
        email: ADMIN_EMAIL,
        rol: 'admin',
        status: 'activ',
        dataInregistrare: '01.01.2026',
        scenariiFinalizate: 0,
        scorTotal: 0,
    },
    {
        id: 'u2',
        nume: 'Popescu',
        prenume: 'Ion',
        email: 'ion.popescu@exemplu.com',
        rol: 'user',
        status: 'activ',
        dataInregistrare: '15.06.2026',
        scenariiFinalizate: 12,
        scorTotal: 742,
        zi: 15,
        luna: 6,
        an: 2000,
    },
    {
        id: 'u3',
        nume: 'Robu',
        prenume: 'Diana',
        email: 'diana.robu@exemplu.com',
        rol: 'user',
        status: 'activ',
        dataInregistrare: '03.05.2026',
        scenariiFinalizate: 20,
        scorTotal: 968,
    },
    {
        id: 'u4',
        nume: 'Munteanu',
        prenume: 'Alexandru',
        email: 'alex.munteanu@exemplu.com',
        rol: 'user',
        status: 'activ',
        dataInregistrare: '10.05.2026',
        scenariiFinalizate: 18,
        scorTotal: 942,
    },
    {
        id: 'u5',
        nume: 'Rusu',
        prenume: 'Cristina',
        email: 'cristina.rusu@exemplu.com',
        rol: 'user',
        status: 'blocat',
        dataInregistrare: '22.04.2026',
        scenariiFinalizate: 15,
        scorTotal: 915,
    },
]

export interface UsersContextValue {
    users: AppUser[]
    addUser: (user: Omit<AppUser, 'id'>) => AppUser
    updateUser: (id: string, patch: Partial<Omit<AppUser, 'id'>>) => void
    deleteUser: (id: string) => void
    findByEmail: (email: string) => AppUser | undefined
}

export const UsersContext = createContext<UsersContextValue | undefined>(undefined)

export function useUsers() {
    const ctx = useContext(UsersContext)
    if (!ctx) {
        throw new Error('useUsers trebuie folosit în interiorul UsersProvider')
    }
    return ctx
}
