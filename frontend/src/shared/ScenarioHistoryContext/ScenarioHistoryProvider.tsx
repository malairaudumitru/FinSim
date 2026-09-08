import { useState, type ReactNode } from 'react'
import { ScenarioHistoryContext, initialHistory, type HistoryEntry } from './ScenarioHistoryContext.ts'

export function ScenarioHistoryProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<HistoryEntry[]>(initialHistory)

    const addEntry = (entry: Omit<HistoryEntry, 'id'>) => {
        setHistory((prev) => [{ ...entry, id: `h${Date.now()}` }, ...prev])
    }

    return (
        <ScenarioHistoryContext.Provider value={{ history, addEntry }}>
            {children}
        </ScenarioHistoryContext.Provider>
    )
}