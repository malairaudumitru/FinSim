import type { TFunction } from 'i18next'

// Difficulty and resource theme are stored as Romanian labels (see scenarioMapper / resourceMapper);
// translate them only at display time.
const DIFFICULTY_KEYS: Record<string, string> = {
    Ușor: 'common.difficulty_easy',
    Mediu: 'common.difficulty_medium',
    Avansat: 'common.difficulty_advanced',
}

const THEME_KEYS: Record<string, string> = {
    General: 'common.theme_general',
    Buget: 'common.theme_budget',
    Economii: 'common.theme_savings',
    'Decizii financiare': 'common.theme_financial_decisions',
    Credite: 'common.theme_credit',
}

export function difficultyLabel(t: TFunction, label: string): string {
    const key = DIFFICULTY_KEYS[label]
    return key ? t(key) : label
}

export function themeLabel(t: TFunction, label: string): string {
    const key = THEME_KEYS[label]
    return key ? t(key) : label
}
