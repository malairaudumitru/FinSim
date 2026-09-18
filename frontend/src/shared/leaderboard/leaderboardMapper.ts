import type { LeaderboardEntry } from '../LeaderboardContext/LeaderboardContext'
import type { LeaderboardInfoDto } from '../../api/leaderboardApi'

export function toLeaderboardEntry(dto: LeaderboardInfoDto, currentUserId?: number): LeaderboardEntry {
    return {
        id: String(dto.id),
        nume: dto.lastName,
        prenume: dto.firstName,
        scor: dto.score,
        esteTu: currentUserId !== undefined && dto.userId === currentUserId,
    }
}
