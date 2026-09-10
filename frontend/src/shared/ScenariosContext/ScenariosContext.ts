import { createContext, useContext } from 'react'
import { scenarios as seedScenarios, type ScenarioDef } from '../scenarios/scenariosData'

export type { ScenarioDef }

export interface ScenariosContextValue {
    scenarios: ScenarioDef[]
    getBySlug: (slug: string) => ScenarioDef | undefined
    addScenario: (scenario: ScenarioDef) => void
    updateScenario: (slug: string, patch: Partial<ScenarioDef>) => void
    deleteScenario: (slug: string) => void
}

export const initialScenarios: ScenarioDef[] = seedScenarios

export const ScenariosContext = createContext<ScenariosContextValue | undefined>(undefined)

export function useScenarios() {
    const ctx = useContext(ScenariosContext)
    if (!ctx) {
        throw new Error('useScenarios trebuie folosit în interiorul ScenariosProvider')
    }
    return ctx
}
