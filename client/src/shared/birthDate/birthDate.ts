export const LUNI = [
    'Ianuarie',
    'Februarie',
    'Martie',
    'Aprilie',
    'Mai',
    'Iunie',
    'Iulie',
    'August',
    'Septembrie',
    'Octombrie',
    'Noiembrie',
    'Decembrie',
]

export function daysInMonth(luna?: number, an?: number): number {
    if (!luna) return 31
    const year = an ?? 2000
    return new Date(year, luna, 0).getDate()
}

export const VARSTA_MINIMA = 5
export const VARSTA_MAXIMA = 100

export function isValidBirthDate(zi: number, luna: number, an: number): boolean {
    if (!zi || !luna || !an) return false
    const date = new Date(an, luna - 1, zi)
    return date.getFullYear() === an && date.getMonth() === luna - 1 && date.getDate() === zi
}

export function calculateAge(zi: number, luna: number, an: number): number {
    const today = new Date()
    let age = today.getFullYear() - an
    const hasHadBirthdayThisYear =
        today.getMonth() + 1 > luna || (today.getMonth() + 1 === luna && today.getDate() >= zi)
    if (!hasHadBirthdayThisYear) age--
    return age
}

export function formatBirthDate(zi: number, luna: number, an: number): string {
    const z = String(zi).padStart(2, '0')
    const l = String(luna).padStart(2, '0')
    return `${z}.${l}.${an}`
}