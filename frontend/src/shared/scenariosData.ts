export interface ScenarioOption {
    id: string
    eticheta: string
    bani: number
    puncte: number
    feedback: string
}

export interface ScenarioStep {
    id: string
    intrebare: string
    context?: string
    optiuni: ScenarioOption[]
}

export interface ScenarioDef {
    slug: string
    nume: string
    descriere: string
    dificultate: string
    soldInitial: number
    necesitaCont: boolean
    pasi: ScenarioStep[]
}

export const scenarios: ScenarioDef[] = [
    {
        slug: 'primul-salariu',
        nume: 'Primul salariu',
        descriere:
            'Primești primul salariu și trebuie să-l împarți pe chirie, mâncare, transport și economii.',
        dificultate: 'Ușor',
        soldInitial: 8500,
        necesitaCont: false,
        pasi: [
            {
                id: 'chirie',
                intrebare: 'Ai primit salariul de 8 500 lei. Unde locuiești luna asta?',
                optiuni: [
                    {
                        id: 'apartament',
                        eticheta: 'Închiriezi un apartament decent, 2 500 lei/lună',
                        bani: -2500,
                        puncte: 15,
                        feedback:
                            'O alegere echilibrată — ai propriul spațiu, dar chiria îți ia aproape 30% din salariu.',
                    },
                    {
                        id: 'camera',
                        eticheta: 'Alegi o cameră mai ieftină, mai departe de muncă, 1 500 lei/lună',
                        bani: -1500,
                        puncte: 20,
                        feedback:
                            'Economisești 1 000 lei lunar, dar navetele mai lungi te costă timp și energie.',
                    },
                    {
                        id: 'parinti',
                        eticheta: 'Stai la părinți încă un timp, fără chirie',
                        bani: 0,
                        puncte: 25,
                        feedback:
                            'Financiar, cea mai eficientă alegere — dar amâni independența.',
                    },
                ],
            },
            {
                id: 'mancare',
                intrebare: 'Cum te descurci cu mâncarea în fiecare lună?',
                optiuni: [
                    {
                        id: 'gatit',
                        eticheta: 'Gătești acasă, buget ~900 lei',
                        bani: -900,
                        puncte: 25,
                        feedback: 'Cea mai eficientă variantă — mănânci bine și cheltui puțin.',
                    },
                    {
                        id: 'comenzi',
                        eticheta: 'Comanzi des mâncare, ~1 800 lei',
                        bani: -1800,
                        puncte: 10,
                        feedback: 'Confortabil, dar costă dublu față de gătit acasă.',
                    },
                    {
                        id: 'combinat',
                        eticheta: 'Combini gătitul cu câteva comenzi, ~1 300 lei',
                        bani: -1300,
                        puncte: 18,
                        feedback: 'Un echilibru rezonabil între confort și cost.',
                    },
                ],
            },
            {
                id: 'economii',
                intrebare: 'Ai bani rămași după cheltuielile fixe. Ce faci cu ei?',
                optiuni: [
                    {
                        id: 'fond-urgenta',
                        eticheta: 'Pui deoparte 20% din salariu într-un fond de urgență',
                        bani: -1700,
                        puncte: 25,
                        feedback: 'Exact ce recomandă orice sfat de educație financiară.',
                    },
                    {
                        id: 'nimic',
                        eticheta: 'Nu economisești nimic luna asta',
                        bani: 0,
                        puncte: 5,
                        feedback: 'Fără fond de urgență, orice cheltuială neprevăzută te lasă descoperit.',
                    },
                    {
                        id: 'putin',
                        eticheta: 'Economisești puțin, 500 lei',
                        bani: -500,
                        puncte: 15,
                        feedback: 'Un început — nu ideal, dar mai bine decât nimic.',
                    },
                ],
            },
            {
                id: 'urgenta',
                intrebare: 'Mașina de spălat s-a stricat. Reparația costă 800 lei. Ce faci?',
                optiuni: [
                    {
                        id: 'fond',
                        eticheta: 'Plătești din fondul de urgență, dacă ai unul',
                        bani: -800,
                        puncte: 25,
                        feedback: 'Exact la asta servește un fond de urgență — o cheltuială neprevăzută, absorbită fără stres.',
                    },
                    {
                        id: 'credit-rapid',
                        eticheta: 'Iei un credit rapid, cu dobândă mare',
                        bani: -1000,
                        puncte: 5,
                        feedback: 'Rezolvi urgența azi, dar plătești 200 lei în plus doar pe dobândă.',
                    },
                    {
                        id: 'amani',
                        eticheta: 'Amâni reparația și speli rufele la o rudă',
                        bani: 0,
                        puncte: 15,
                        feedback: 'Nu te costă nimic acum, dar disconfortul se adună.',
                    },
                ],
            },
        ],
    },
    {
        slug: 'chirie-si-facturi',
        nume: 'Chirie și facturi',
        descriere: 'Te muți singur și afli cât de repede se adună facturile lunare peste chirie.',
        dificultate: 'Mediu',
        soldInitial: 0,
        necesitaCont: true,
        pasi: [],
    },
    {
        slug: 'urgenta-medicala',
        nume: 'Urgență medicală',
        descriere: 'O cheltuială neprevăzută îți testează fondul de urgență — sau lipsa lui.',
        dificultate: 'Mediu',
        soldInitial: 0,
        necesitaCont: true,
        pasi: [],
    },
    {
        slug: 'primul-credit',
        nume: 'Primul credit',
        descriere: 'Ai nevoie de bani în plus. Alegi un credit — dar știi cât te costă cu adevărat?',
        dificultate: 'Avansat',
        soldInitial: 0,
        necesitaCont: true,
        pasi: [],
    },
]

export function getScenarioBySlug(slug: string): ScenarioDef | undefined {
    return scenarios.find((s) => s.slug === slug)
}

export function maxScoreFor(scenario: ScenarioDef): number {
    return scenario.pasi.reduce((sum, step) => {
        const max = Math.max(...step.optiuni.map((o) => o.puncte))
        return sum + max
    }, 0)
}