import type { ScenarioDef, ScenarioStep } from './scenariosData'
import { ScenarioDifficulty, type ScenarioCreateDto, type ScenarioInfoDto } from '../../api/scenariosApi'

const DIFFICULTY_TO_LABEL: Record<ScenarioDifficulty, string> = {
    [ScenarioDifficulty.Easy]: 'Ușor',
    [ScenarioDifficulty.Medium]: 'Mediu',
    [ScenarioDifficulty.Advanced]: 'Avansat',
}

const LABEL_TO_DIFFICULTY: Record<string, ScenarioDifficulty> = {
    Ușor: ScenarioDifficulty.Easy,
    Mediu: ScenarioDifficulty.Medium,
    Avansat: ScenarioDifficulty.Advanced,
}

export function toScenarioDef(dto: ScenarioInfoDto): ScenarioDef {
    let pasi: ScenarioStep[] = []
    try {
        const parsed = JSON.parse(dto.stepsJson)
        if (Array.isArray(parsed)) pasi = parsed
    } catch {
        pasi = []
    }

    return {
        id: dto.id,
        slug: dto.slug,
        nume: dto.name,
        descriere: dto.description,
        dificultate: DIFFICULTY_TO_LABEL[dto.difficulty] ?? 'Ușor',
        soldInitial: dto.initialBalance,
        necesitaCont: dto.requiresAccount,
        scorCreditInitial: dto.initialCreditScore ?? undefined,
        pasi,
    }
}

export function toScenarioCreateDto(scenario: ScenarioDef): ScenarioCreateDto {
    return {
        slug: scenario.slug,
        name: scenario.nume,
        description: scenario.descriere,
        difficulty: LABEL_TO_DIFFICULTY[scenario.dificultate] ?? ScenarioDifficulty.Easy,
        initialBalance: scenario.soldInitial,
        requiresAccount: scenario.necesitaCont,
        initialCreditScore: scenario.scorCreditInitial ?? null,
        initialStress: null,
        stepsJson: JSON.stringify(scenario.pasi),
    }
}
