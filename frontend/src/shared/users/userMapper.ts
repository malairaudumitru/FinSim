import type { AppUser } from '../UsersContext/UsersContext'
import { UserRole, UserStatus, type UserCreateDto, type UserInfoDto, type UserUpdateDto } from '../../api/usersApi'

function formatDate(isoDate: string): string {
    const d = new Date(isoDate)
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}

function parseBirthDate(birthDate: string | null): { zi?: number; luna?: number; an?: number } {
    if (!birthDate) return {}
    const [an, luna, zi] = birthDate.split('-').map(Number)
    if (!an || !luna || !zi) return {}
    return { zi, luna, an }
}

function toBirthDateString(zi?: number, luna?: number, an?: number): string | null {
    if (!zi || !luna || !an) return null
    return `${an}-${String(luna).padStart(2, '0')}-${String(zi).padStart(2, '0')}`
}

export function toAppUser(dto: UserInfoDto): AppUser {
    return {
        id: String(dto.id),
        nume: dto.lastName,
        prenume: dto.firstName,
        email: dto.email,
        rol: dto.role === UserRole.Admin ? 'admin' : 'user',
        status: dto.status === UserStatus.Blocked ? 'blocat' : 'activ',
        dataInregistrare: formatDate(dto.registeredAt),
        scenariiFinalizate: dto.completedScenarios,
        scorTotal: dto.totalScore,
        ...parseBirthDate(dto.birthDate),
    }
}

export function toUserCreateDto(user: Omit<AppUser, 'id' | 'dataInregistrare'>, password: string): UserCreateDto {
    return {
        lastName: user.nume,
        firstName: user.prenume,
        email: user.email,
        password,
        role: user.rol === 'admin' ? UserRole.Admin : UserRole.User,
        status: user.status === 'blocat' ? UserStatus.Blocked : UserStatus.Active,
        completedScenarios: user.scenariiFinalizate,
        totalScore: user.scorTotal,
        birthDate: toBirthDateString(user.zi, user.luna, user.an) ?? '',
    }
}

export function toUserUpdateDto(
    user: Omit<AppUser, 'id' | 'dataInregistrare'>,
    password?: string,
): UserUpdateDto {
    return {
        lastName: user.nume,
        firstName: user.prenume,
        email: user.email,
        password: password || undefined,
        role: user.rol === 'admin' ? UserRole.Admin : UserRole.User,
        status: user.status === 'blocat' ? UserStatus.Blocked : UserStatus.Active,
        completedScenarios: user.scenariiFinalizate,
        totalScore: user.scorTotal,
        birthDate: toBirthDateString(user.zi, user.luna, user.an),
    }
}
