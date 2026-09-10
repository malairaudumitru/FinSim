import { useState, type ReactNode } from 'react'
import { ScenarioHistoryContext, initialHistory, type HistoryEntry } from './ScenarioHistoryContext.ts'

export function ScenarioHistoryProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<HistoryEntry[]>(initialHistory)

    const addEntry = (entry: Omit<HistoryEntry, 'id'>) => {
        setHistory((prev) => [{ ...entry, id: `h${Date.now()}` }, ...prev])
    }

    const updateEntry = (id: string, patch: Partial<Omit<HistoryEntry, 'id'>>) => {
        setHistory((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)))
    }

    const deleteEntry = (id: string) => {
        setHistory((prev) => prev.filter((h) => h.id !== id))
    }

    return (
        <ScenarioHistoryContext.Provider value={{ history, addEntry, updateEntry, deleteEntry }}>
            {children}
        </ScenarioHistoryContext.Provider>
    )
}
