import { api } from './api'

export const ScenarioDifficulty = {
    Easy: 0,
    Medium: 1,
    Advanced: 2,
} as const
export type ScenarioDifficulty = (typeof ScenarioDifficulty)[keyof typeof ScenarioDifficulty]

export interface ScenarioInfoDto {
    id: number
    slug: string
    name: string
    description: string
    nameRo: string
    nameEn: string | null
    nameRu: string | null
    descriptionRo: string
    descriptionEn: string | null
    descriptionRu: string | null
    difficulty: ScenarioDifficulty
    initialBalance: number
    requiresAccount: boolean
    initialCreditScore: number | null
    initialStress: number | null
    stepsJson: string
    stepsJsonRaw: string | null
    isDeleted: boolean
}

export interface ScenarioCreateDto {
    slug: string
    nameRo: string
    nameEn: string | null
    nameRu: string | null
    descriptionRo: string
    descriptionEn: string | null
    descriptionRu: string | null
    difficulty: ScenarioDifficulty
    initialBalance: number
    requiresAccount: boolean
    initialCreditScore: number | null
    initialStress: number | null
    stepsJson: string
}

export function getScenarioList(): Promise<ScenarioInfoDto[]> {
    return api.get<ScenarioInfoDto[]>('/scenarios/list')
}

export function getScenarioBySlug(slug: string): Promise<ScenarioInfoDto> {
    return api.get<ScenarioInfoDto>(`/scenarios/${slug}`)
}

export function createScenario(data: ScenarioCreateDto): Promise<string> {
    return api.post<string>('/scenarios/create', data)
}

export function updateScenario(id: number, data: ScenarioCreateDto): Promise<string> {
    return api.put<string>(`/scenarios/update/${id}`, data)
}

export function deleteScenario(id: number): Promise<string> {
    return api.delete<string>(`/scenarios/${id}`)
}
