import { createContext, useContext } from 'react'

export interface HistoryEntry {
    id: string
    scenarioId: number
    slug?: string
    scenariu: string
    data: string
    scor: number
}

export interface ScenarioHistoryContextValue {
    history: HistoryEntry[]
    loading: boolean
    addEntry: (input: { scenarioId: number; score: number }) => Promise<void>
    updateEntry: (id: string, patch: { scenarioId: number; score: number }) => Promise<void>
    deleteEntry: (id: string) => Promise<void>
}

export const ScenarioHistoryContext = createContext<ScenarioHistoryContextValue | undefined>(undefined)

export function useScenarioHistory() {
    const ctx = useContext(ScenarioHistoryContext)
    if (!ctx) {
        throw new Error('useScenarioHistory trebuie folosit în interiorul ScenarioHistoryProvider')
    }
    return ctx
}
