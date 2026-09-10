import { useState, type ReactNode } from 'react'
import { LeaderboardContext, initialLeaderboard, type LeaderboardEntry } from './LeaderboardContext.ts'

export function LeaderboardProvider({ children }: { children: ReactNode }) {
    const [entries, setEntries] = useState<LeaderboardEntry[]>(initialLeaderboard)

    const addEntry = (entry: Omit<LeaderboardEntry, 'id'>) => {
        setEntries((prev) => [...prev, { ...entry, id: `l${Date.now()}` }])
    }

    const updateEntry = (id: string, patch: Partial<Omit<LeaderboardEntry, 'id'>>) => {
        setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))
    }

    const deleteEntry = (id: string) => {
        setEntries((prev) => prev.filter((e) => e.id !== id))
    }

    return (
        <LeaderboardContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry }}>
            {children}
        </LeaderboardContext.Provider>
    )
}
