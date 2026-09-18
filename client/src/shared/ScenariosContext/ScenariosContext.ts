import { createContext, useContext } from 'react'
import type { ScenarioDef } from '../scenarios/scenariosData'

export type { ScenarioDef }

export interface ScenariosContextValue {
    scenarios: ScenarioDef[]
    loading: boolean
    getBySlug: (slug: string) => ScenarioDef | undefined
    addScenario: (scenario: ScenarioDef) => Promise<void>
    updateScenario: (id: number, patch: Partial<ScenarioDef>) => Promise<void>
    deleteScenario: (id: number) => Promise<void>
    refresh: () => Promise<void>
}

export const ScenariosContext = createContext<ScenariosContextValue | undefined>(undefined)

export function useScenarios() {
    const ctx = useContext(ScenariosContext)
    if (!ctx) {
        throw new Error('useScenarios trebuie folosit în interiorul ScenariosProvider')
    }
    return ctx
}
