import { api } from './api'

export interface ScenarioHistoryInfoDto {
    id: number
    userId: number
    scenarioId: number
    score: number
    createdAt: string
    isDeleted: boolean
}

export interface ScenarioHistoryCreateDto {
    scenarioId: number
    score: number
}

export interface ScenarioHistoryUpdateDto {
    userId: number
    scenarioId: number
    score: number
}

export function createScenarioHistory(data: ScenarioHistoryCreateDto): Promise<string> {
    return api.post<string>('/scenario-history/create', data)
}

export function getScenarioHistoryByUserId(userId: number): Promise<ScenarioHistoryInfoDto[]> {
    return api.get<ScenarioHistoryInfoDto[]>(`/scenario-history/by-user/${userId}`)
}

export function getScenarioHistoryList(): Promise<ScenarioHistoryInfoDto[]> {
    return api.get<ScenarioHistoryInfoDto[]>('/scenario-history/list')
}

export function updateScenarioHistory(id: number, data: ScenarioHistoryUpdateDto): Promise<string> {
    return api.put<string>(`/scenario-history/update/${id}`, data)
}

export function deleteScenarioHistory(id: number): Promise<string> {
    return api.delete<string>(`/scenario-history/${id}`)
}
