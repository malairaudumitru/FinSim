import { useEffect, useState, type ReactNode } from 'react'
import { LeaderboardContext, type LeaderboardEntry } from './LeaderboardContext.ts'
import { useAuth } from '../AuthContext/AuthContext'
import { useErrorModal } from '../ErrorModalContext/ErrorModalContext'
import { reportIfServerError, reportingCall } from '../reportServerError'
import * as leaderboardApi from '../../api/leaderboardApi'
import { toLeaderboardEntry } from '../leaderboard/leaderboardMapper'

export function LeaderboardProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const { showError } = useErrorModal()
    const [entries, setEntries] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)

    const refresh = async () => {
        try {
            const list = await leaderboardApi.getLeaderboardList()
            setEntries(list.map((dto) => toLeaderboardEntry(dto, user?.id)))
        } catch (err) {
            reportIfServerError(err, showError)
            setEntries([])
        }
    }

    useEffect(() => {
        leaderboardApi
            .getLeaderboardList()
            .then((list) => setEntries(list.map((dto) => toLeaderboardEntry(dto, user?.id))))
            .catch((err) => {
                reportIfServerError(err, showError)
                setEntries([])
            })
            .finally(() => setLoading(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id])

    const deleteEntry = async (id: string) => {
        await reportingCall(leaderboardApi.deleteLeaderboardEntry(Number(id)), showError)
        setEntries((prev) => prev.filter((e) => e.id !== id))
    }

    return (
        <LeaderboardContext.Provider value={{ entries, loading, deleteEntry, refresh }}>
            {children}
        </LeaderboardContext.Provider>
    )
}
