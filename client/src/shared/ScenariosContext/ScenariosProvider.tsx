import { useEffect, useState, type ReactNode } from 'react'
import { ScenariosContext, type ScenarioDef } from './ScenariosContext.ts'
import { useErrorModal } from '../ErrorModalContext/ErrorModalContext'
import { reportIfServerError, reportingCall } from '../reportServerError'
import * as scenariosApi from '../../api/scenariosApi'
import { toScenarioCreateDto, toScenarioDef } from '../scenarios/scenarioMapper'

export function ScenariosProvider({ children }: { children: ReactNode }) {
    const { showError } = useErrorModal()
    const [scenarios, setScenarios] = useState<ScenarioDef[]>([])
    const [loading, setLoading] = useState(true)

    const refresh = async () => {
        try {
            const list = await scenariosApi.getScenarioList()
            setScenarios(list.map(toScenarioDef))
        } catch (err) {
            reportIfServerError(err, showError)
            setScenarios([])
        }
    }

    useEffect(() => {
        scenariosApi
            .getScenarioList()
            .then((list) => setScenarios(list.map(toScenarioDef)))
            .catch((err) => {
                reportIfServerError(err, showError)
                setScenarios([])
            })
            .finally(() => setLoading(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getBySlug = (slug: string) => scenarios.find((s) => s.slug === slug)

    const addScenario = async (scenario: ScenarioDef) => {
        await reportingCall(scenariosApi.createScenario(toScenarioCreateDto(scenario)), showError)
        const list = await scenariosApi.getScenarioList()
        setScenarios(list.map(toScenarioDef))
    }

    const updateScenario = async (id: number, patch: Partial<ScenarioDef>) => {
        const current = scenarios.find((s) => s.id === id)
        if (!current) return
        await reportingCall(scenariosApi.updateScenario(id, toScenarioCreateDto({ ...current, ...patch })), showError)
        const list = await scenariosApi.getScenarioList()
        setScenarios(list.map(toScenarioDef))
    }

    const deleteScenario = async (id: number) => {
        await reportingCall(scenariosApi.deleteScenario(id), showError)
        setScenarios((prev) => prev.filter((s) => s.id !== id))
    }

    return (
        <ScenariosContext.Provider
            value={{ scenarios, loading, getBySlug, addScenario, updateScenario, deleteScenario, refresh }}
        >
            {children}
        </ScenariosContext.Provider>
    )
}
