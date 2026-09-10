import { createContext, useContext } from 'react'

export interface LeaderboardEntry {
    id: string
    nume: string
    prenume: string
    scor: number
    esteTu?: boolean
}

export const initialLeaderboard: LeaderboardEntry[] = [
    { id: 'l1', nume: 'Robu', prenume: 'Diana', scor: 968 },
    { id: 'l2', nume: 'Munteanu', prenume: 'Alexandru', scor: 942 },
    { id: 'l3', nume: 'Rusu', prenume: 'Cristina', scor: 915 },
    { id: 'l4', nume: 'Ceban', prenume: 'Vlad', scor: 887 },
    { id: 'l5', nume: 'Grosu', prenume: 'Ana', scor: 860 },
    { id: 'l6', nume: 'Cojocaru', prenume: 'Mihai', scor: 834 },
    { id: 'l7', nume: 'Bordei', prenume: 'Elena', scor: 812 },
    { id: 'l8', nume: 'Popescu', prenume: 'Ion', scor: 742, esteTu: true },
    { id: 'l9', nume: 'Fusu', prenume: 'Radu', scor: 705 },
    { id: 'l10', nume: 'Ivanov', prenume: 'Corina', scor: 668 },
]

export interface LeaderboardContextValue {
    entries: LeaderboardEntry[]
    addEntry: (entry: Omit<LeaderboardEntry, 'id'>) => void
    updateEntry: (id: string, patch: Partial<Omit<LeaderboardEntry, 'id'>>) => void
    deleteEntry: (id: string) => void
}

export const LeaderboardContext = createContext<LeaderboardContextValue | undefined>(undefined)

export function useLeaderboard() {
    const ctx = useContext(LeaderboardContext)
    if (!ctx) {
        throw new Error('useLeaderboard trebuie folosit în interiorul LeaderboardProvider')
    }
    return ctx
}
