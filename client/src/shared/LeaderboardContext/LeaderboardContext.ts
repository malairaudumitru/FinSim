import { createContext, useContext } from 'react'

export interface LeaderboardEntry {
    id: string
    nume: string
    prenume: string
    scor: number
    esteTu?: boolean
}

export interface LeaderboardContextValue {
    entries: LeaderboardEntry[]
    loading: boolean
    deleteEntry: (id: string) => Promise<void>
    refresh: () => Promise<void>
}

export const LeaderboardContext = createContext<LeaderboardContextValue | undefined>(undefined)

export function useLeaderboard() {
    const ctx = useContext(LeaderboardContext)
    if (!ctx) {
        throw new Error('useLeaderboard trebuie folosit în interiorul LeaderboardProvider')
    }
    return ctx
}
