import { useEffect, useState, type ReactNode } from 'react'
import { LeaderboardContext, type LeaderboardEntry } from './LeaderboardContext.ts'
import { useAuth } from '../AuthContext/AuthContext'
import * as leaderboardApi from '../../api/leaderboardApi'
import { toLeaderboardEntry } from '../leaderboard/leaderboardMapper'

export function LeaderboardProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const [entries, setEntries] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        leaderboardApi
            .getLeaderboardList()
            .then((list) => setEntries(list.map((dto) => toLeaderboardEntry(dto, user?.id))))
            .catch(() => setEntries([]))
            .finally(() => setLoading(false))
    }, [user?.id])

    const deleteEntry = async (id: string) => {
        await leaderboardApi.deleteLeaderboardEntry(Number(id))
        setEntries((prev) => prev.filter((e) => e.id !== id))
    }

    return (
        <LeaderboardContext.Provider value={{ entries, loading, deleteEntry }}>
            {children}
        </LeaderboardContext.Provider>
    )
}
