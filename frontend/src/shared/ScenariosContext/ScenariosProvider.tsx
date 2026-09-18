import { useEffect, useState, type ReactNode } from 'react'
import { ScenariosContext, type ScenarioDef } from './ScenariosContext.ts'
import * as scenariosApi from '../../api/scenariosApi'
import { toScenarioCreateDto, toScenarioDef } from '../scenarios/scenarioMapper'

export function ScenariosProvider({ children }: { children: ReactNode }) {
    const [scenarios, setScenarios] = useState<ScenarioDef[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        scenariosApi
            .getScenarioList()
            .then((list) => setScenarios(list.map(toScenarioDef)))
            .catch(() => setScenarios([]))
            .finally(() => setLoading(false))
    }, [])

    const getBySlug = (slug: string) => scenarios.find((s) => s.slug === slug)

    const addScenario = async (scenario: ScenarioDef) => {
        await scenariosApi.createScenario(toScenarioCreateDto(scenario))
        const list = await scenariosApi.getScenarioList()
        setScenarios(list.map(toScenarioDef))
    }

    const updateScenario = async (id: number, patch: Partial<ScenarioDef>) => {
        const current = scenarios.find((s) => s.id === id)
        if (!current) return
        await scenariosApi.updateScenario(id, toScenarioCreateDto({ ...current, ...patch }))
        const list = await scenariosApi.getScenarioList()
        setScenarios(list.map(toScenarioDef))
    }

    const deleteScenario = async (id: number) => {
        await scenariosApi.deleteScenario(id)
        setScenarios((prev) => prev.filter((s) => s.id !== id))
    }

    return (
        <ScenariosContext.Provider
            value={{ scenarios, loading, getBySlug, addScenario, updateScenario, deleteScenario }}
        >
            {children}
        </ScenariosContext.Provider>
    )
}
