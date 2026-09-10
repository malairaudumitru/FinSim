import { useState, type ReactNode } from 'react'
import { ScenariosContext, initialScenarios, type ScenarioDef } from './ScenariosContext.ts'

export function ScenariosProvider({ children }: { children: ReactNode }) {
    const [scenarios, setScenarios] = useState<ScenarioDef[]>(initialScenarios)

    const getBySlug = (slug: string) => scenarios.find((s) => s.slug === slug)

    const addScenario = (scenario: ScenarioDef) => {
        setScenarios((prev) => [...prev, scenario])
    }

    const updateScenario = (slug: string, patch: Partial<ScenarioDef>) => {
        setScenarios((prev) => prev.map((s) => (s.slug === slug ? { ...s, ...patch } : s)))
    }

    const deleteScenario = (slug: string) => {
        setScenarios((prev) => prev.filter((s) => s.slug !== slug))
    }

    return (
        <ScenariosContext.Provider value={{ scenarios, getBySlug, addScenario, updateScenario, deleteScenario }}>
            {children}
        </ScenariosContext.Provider>
    )
}
