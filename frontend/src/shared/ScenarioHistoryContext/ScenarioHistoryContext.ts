import { createContext, useContext } from 'react'

export interface HistoryEntry {
    id: string
    scenariu: string
    data: string
    scor: number
}

export const initialHistory: HistoryEntry[] = [
    { id: 'h1', scenariu: 'Primul salariu', data: '01.08.2026', scor: 45 },
    { id: 'h2', scenariu: 'Chirie și facturi', data: '05.08.2026', scor: 52 },
    { id: 'h3', scenariu: 'Urgență medicală', data: '09.08.2026', scor: 61 },
    { id: 'h4', scenariu: 'Primul credit', data: '13.08.2026', scor: 38 },
    { id: 'h5', scenariu: 'Primul salariu', data: '16.08.2026', scor: 58 },
    { id: 'h6', scenariu: 'Urgență medicală', data: '20.08.2026', scor: 74 },
    { id: 'h7', scenariu: 'Primul credit', data: '24.08.2026', scor: 55 },
    { id: 'h8', scenariu: 'Chirie și facturi', data: '28.08.2026', scor: 65 },
    { id: 'h9', scenariu: 'Primul salariu', data: '31.08.2026', scor: 70 },
    { id: 'h10', scenariu: 'Primul salariu', data: '02.09.2026', scor: 82 },
    { id: 'h11', scenariu: 'Chirie și facturi', data: '05.09.2026', scor: 88 },
    { id: 'h12', scenariu: 'Urgență medicală', data: '08.09.2026', scor: 91 },
]

export interface ScenarioHistoryContextValue {
    history: HistoryEntry[]
    addEntry: (entry: Omit<HistoryEntry, 'id'>) => void
}

export const ScenarioHistoryContext = createContext<ScenarioHistoryContextValue | undefined>(undefined)

export function useScenarioHistory() {
    const ctx = useContext(ScenarioHistoryContext)
    if (!ctx) {
        throw new Error('useScenarioHistory trebuie folosit în interiorul ScenarioHistoryProvider')
    }
    return ctx
}