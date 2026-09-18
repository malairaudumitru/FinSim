import { api } from './api'

export interface LeaderboardInfoDto {
    id: number
    lastName: string
    firstName: string
    score: number
    userId: number
    isDeleted: boolean
}

export function getLeaderboardList(): Promise<LeaderboardInfoDto[]> {
    return api.get<LeaderboardInfoDto[]>('/leaderboard/list')
}

export function deleteLeaderboardEntry(id: number): Promise<string> {
    return api.delete<string>(`/leaderboard/${id}`)
}
