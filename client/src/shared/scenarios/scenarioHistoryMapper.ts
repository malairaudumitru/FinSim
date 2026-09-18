import type { ScenarioDef } from './scenariosData'
import type { HistoryEntry } from '../ScenarioHistoryContext/ScenarioHistoryContext'
import type { ScenarioHistoryInfoDto } from '../../api/scenarioHistoryApi'

function formatDate(isoDate: string): string {
    const d = new Date(isoDate)
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}

export function toHistoryEntry(dto: ScenarioHistoryInfoDto, scenarios: ScenarioDef[]): HistoryEntry {
    const scenario = scenarios.find((s) => s.id === dto.scenarioId)
    return {
        id: String(dto.id),
        scenariu: scenario?.nume ?? '—',
        data: formatDate(dto.createdAt),
        scor: dto.score,
    }
}
