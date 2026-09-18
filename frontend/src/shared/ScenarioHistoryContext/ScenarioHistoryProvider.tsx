import { useEffect, useState, type ReactNode } from 'react'
import { ScenarioHistoryContext, type HistoryEntry } from './ScenarioHistoryContext.ts'
import { useAuth } from '../AuthContext/AuthContext'
import { useScenarios } from '../ScenariosContext/ScenariosContext'
import * as scenarioHistoryApi from '../../api/scenarioHistoryApi'
import { toHistoryEntry } from '../scenarios/scenarioHistoryMapper'

export function ScenarioHistoryProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const { scenarios } = useScenarios()
    const [history, setHistory] = useState<HistoryEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const userId = user?.id
        const task =
            userId === undefined
                ? Promise.resolve([])
                : scenarioHistoryApi.getScenarioHistoryByUserId(userId).catch(() => [])

        task
            .then((list) => setHistory(list.map((dto) => toHistoryEntry(dto, scenarios))))
            .finally(() => setLoading(false))
    }, [user?.id, scenarios])

    const addEntry = async ({ scenarioId, score }: { scenarioId: number; score: number }) => {
        await scenarioHistoryApi.createScenarioHistory({ scenarioId, score })
        if (user?.id === undefined) return
        const list = await scenarioHistoryApi.getScenarioHistoryByUserId(user.id)
        setHistory(list.map((dto) => toHistoryEntry(dto, scenarios)))
    }

    const updateEntry = async (id: string, patch: { scenarioId: number; score: number }) => {
        if (user?.id === undefined) return
        await scenarioHistoryApi.updateScenarioHistory(Number(id), { userId: user.id, ...patch })
        const list = await scenarioHistoryApi.getScenarioHistoryByUserId(user.id)
        setHistory(list.map((dto) => toHistoryEntry(dto, scenarios)))
    }

    const deleteEntry = async (id: string) => {
        await scenarioHistoryApi.deleteScenarioHistory(Number(id))
        setHistory((prev) => prev.filter((h) => h.id !== id))
    }

    return (
        <ScenarioHistoryContext.Provider value={{ history, loading, addEntry, updateEntry, deleteEntry }}>
            {children}
        </ScenarioHistoryContext.Provider>
    )
}
