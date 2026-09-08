import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import {
    getScenarioBySlug,
    maxScoreFor,
    type AllocationStepDef,
    type MultiSelectStepDef,
    type ScenarioOption,
} from '../../shared/scenarios/scenariosData'
import { useScenarioHistory } from '../../shared/ScenarioHistoryContext/ScenarioHistoryContext'
import { useAuth } from '../../shared/AuthContext/AuthContext'
import AnimatedNumber from '../../shared/AnimatedNumber/AnimatedNumber'
import './ScenarioPlayPage.css'

type Stage = 'intro' | 'playing' | 'result'

function todayLabel() {
    const d = new Date()
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}

function shuffle<T>(items: T[]): T[] {
    const copy = [...items]
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
}

function AllocationStep({
                            def,
                            onConfirm,
                        }: {
    def: AllocationStepDef
    onConfirm: (option: ScenarioOption) => void
}) {
    const [values, setValues] = useState<Record<string, number>>(() =>
        Object.fromEntries(def.categorii.map((c) => [c.id, c.implicit]))
    )

    const total = Object.values(values).reduce((a, b) => a + b, 0)
    const remaining = def.totalDisponibil - total
    const isValid = remaining >= 0

    const handleChange = (id: string, value: number) => {
        setValues((prev) => ({ ...prev, [id]: value }))
    }

    const confirm = () => {
        const chirie = values['chirie'] ?? 0
        const economii = values['economii'] ?? 0
        const chirieShare = chirie / def.totalDisponibil

        let puncte = 0
        if (chirieShare <= 0.4) puncte += 15
        else if (chirieShare <= 0.5) puncte += 8
        else puncte += 2

        if (economii >= def.totalDisponibil * 0.1) puncte += 10
        else if (economii > 0) puncte += 5

        puncte = Math.min(puncte, def.puncteMaxime)

        let feedback: string
        if (chirieShare > 0.5) {
            feedback = 'Chiria depășește jumătate din venit — un buget foarte strâns pentru restul lunii.'
        } else if (economii === 0) {
            feedback = 'Ai echilibrat chiria, dar fără economii, orice urgență te lasă descoperit.'
        } else {
            feedback = 'Un buget echilibrat — chirie rezonabilă și un fond pentru neprevăzut.'
        }

        onConfirm({ id: 'alocare', eticheta: 'Alocare buget', bani: -total, puncte, feedback })
    }

    return (
        <div className="allocation-step">
            {def.categorii.map((cat) => (
                <div className="allocation-row" key={cat.id}>
                    <div className="allocation-row-header">
                        <span>{cat.eticheta}</span>
                        <span className="figure">{values[cat.id]} lei</span>
                    </div>
                    <input
                        type="range"
                        min={cat.min}
                        max={cat.max}
                        step={50}
                        value={values[cat.id]}
                        onChange={(e) => handleChange(cat.id, Number(e.target.value))}
                        className="allocation-slider"
                    />
                </div>
            ))}
            <div className={`allocation-remaining ${remaining < 0 ? 'negative' : ''}`}>
                <span>Rămas pentru mâncare și cheltuieli variabile</span>
                <span className="figure">{remaining} lei</span>
            </div>
            <button type="button" className="btn btn-primary btn-lg" onClick={confirm} disabled={!isValid}>
                Confirmă alocarea
            </button>
        </div>
    )
}

function MultiSelectStep({
                             def,
                             onConfirm,
                         }: {
    def: MultiSelectStepDef
    onConfirm: (option: ScenarioOption) => void
}) {
    const [selected, setSelected] = useState<Set<string>>(new Set())

    const toggle = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const selectedItems = def.itemi.filter((item) => selected.has(item.id))
    const totalBani = selectedItems.reduce((sum, item) => sum + item.bani, 0)
    const totalPuncte = selectedItems.reduce((sum, item) => sum + item.puncte, 0)
    const totalStres = selectedItems.reduce((sum, item) => sum + (item.stres ?? 0), 0)

    const confirm = () => {
        const feedback =
            selectedItems.length === 0
                ? 'Nu ai redus nimic — bugetul rămâne la fel de strâns luna asta.'
                : `Ai găsit ${totalBani} lei în plus reducând ${selectedItems.length} ${selectedItems.length === 1 ? 'cheltuială' : 'cheltuieli'}.`

        onConfirm({
            id: 'reduceri',
            eticheta: 'Reduceri de buget',
            bani: totalBani,
            puncte: totalPuncte,
            stres: totalStres,
            feedback,
        })
    }

    return (
        <div className="multiselect-step">
            {def.itemi.map((item) => (
                <label className="multiselect-item" key={item.id}>
                    <input
                        type="checkbox"
                        checked={selected.has(item.id)}
                        onChange={() => toggle(item.id)}
                    />
                    <span className="multiselect-label">{item.eticheta}</span>
                    <span className="figure positive">+{item.bani} lei</span>
                </label>
            ))}
            <button type="button" className="btn btn-primary btn-lg" onClick={confirm}>
                Confirmă reducerile
            </button>
        </div>
    )
}

function ScenarioPlayPage() {
    const { slug } = useParams({ from: '/_app/scenarios/$slug' })
    const scenario = getScenarioBySlug(slug)
    const { addEntry } = useScenarioHistory()
    const { isLoggedIn } = useAuth()

    const [stage, setStage] = useState<Stage>('intro')
    const [stepIndex, setStepIndex] = useState(0)
    const [bani, setBani] = useState(scenario?.soldInitial ?? 0)
    const [puncte, setPuncte] = useState(0)
    const [stres, setStres] = useState(0)
    const [lastChoice, setLastChoice] = useState<ScenarioOption | null>(null)
    const hasSaved = useRef(false)

    const steps = useMemo(() => {
        if (!scenario) return []
        return scenario.pasi.map((step) => ({ ...step, optiuni: shuffle(step.optiuni) }))
    }, [scenario])

    const hasStres = useMemo(
        () => steps.some((s) => s.optiuni.some((o) => (o.stres ?? 0) !== 0)),
        [steps]
    )

    const isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        setStage('intro')
        setStepIndex(0)
        setBani(scenario?.soldInitial ?? 0)
        setPuncte(0)
        setStres(0)
        setLastChoice(null)
        hasSaved.current = false
    }, [slug, scenario])

    const maxScore = scenario ? maxScoreFor(scenario) : 0
    const scorFinal = Math.max(0, Math.min(100, Math.round((puncte / (maxScore || 1)) * 100) - stres))

    useEffect(() => {
        if (stage === 'result' && scenario && !hasSaved.current) {
            hasSaved.current = true
            addEntry({ scenariu: scenario.nume, data: todayLabel(), scor: scorFinal })
        }
    }, [stage, scenario, scorFinal, addEntry])

    if (!scenario) {
        return (
            <div className="scenario-missing">
                <p>Acest scenariu nu există.</p>
                <Link to="/" hash="scenarios" className="btn btn-primary">
                    Înapoi la scenarii
                </Link>
            </div>
        )
    }

    if (scenario.necesitaCont && !isLoggedIn) {
        return (
            <div className="scenario-missing">
                <span className="scenario-difficulty">{scenario.dificultate}</span>
                <h1>{scenario.nume}</h1>
                <p>Acest scenariu este disponibil doar cu cont creat.</p>
                <div className="scenario-locked-actions">
                    <Link to="/login" className="btn btn-primary">
                        Autentificare / Înregistrare
                    </Link>
                    <Link to="/" hash="scenarios" className="btn btn-ghost">
                        Înapoi la scenarii
                    </Link>
                </div>
            </div>
        )
    }

    if (scenario.pasi.length === 0) {
        return (
            <div className="scenario-missing">
                <h1>{scenario.nume}</h1>
                <p>Acest scenariu este în lucru — revino curând.</p>
                <Link to="/" hash="scenarios" className="btn btn-primary">
                    Înapoi la scenarii
                </Link>
            </div>
        )
    }

    const currentStep = steps[stepIndex]
    const isLastStep = stepIndex === steps.length - 1

    const startScenario = () => {
        setStage('playing')
    }

    const chooseOption = (option: ScenarioOption) => {
        setBani((prev) => prev + option.bani)
        setPuncte((prev) => prev + option.puncte)
        setStres((prev) => prev + (option.stres ?? 0))
        setLastChoice(option)
    }

    const continueToNext = () => {
        setLastChoice(null)
        if (isLastStep) {
            setStage('result')
        } else {
            setStepIndex((prev) => prev + 1)
        }
    }

    if (stage === 'intro') {
        return (
            <div className="scenario-play">
                <section className="scenario-intro">
                    <div className="container">
                        <span className="scenario-difficulty">{scenario.dificultate}</span>
                        <h1>{scenario.nume}</h1>
                        <p className="scenario-intro-desc">{scenario.descriere}</p>
                        <div className="scenario-intro-balance">
                            <span>Sold de start</span>
                            <span className="figure">{scenario.soldInitial} lei</span>
                        </div>
                        <button type="button" className="btn btn-primary btn-lg" onClick={startScenario}>
                            Începe scenariul
                        </button>
                    </div>
                </section>
            </div>
        )
    }

    if (stage === 'playing') {
        return (
            <div className="scenario-play">
                <section className="scenario-header">
                    <div className="container scenario-header-inner">
                        <span className="scenario-step-count">
                            Pasul {stepIndex + 1} din {steps.length}
                        </span>
                        <div className="scenario-header-stats">
                            {hasStres && (
                                <span className="scenario-stres figure">Stres: {stres}</span>
                            )}
                            <span className="scenario-balance-wrap">
                                <span className="scenario-balance figure">Sold: {bani} lei</span>
                                {lastChoice && (
                                    <span
                                        className={`scenario-delta figure ${
                                            lastChoice.bani < 0 ? 'negative' : lastChoice.bani > 0 ? 'positive' : ''
                                        }`}
                                    >
                                        {lastChoice.bani > 0 ? '+' : ''}
                                        {lastChoice.bani} lei
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="scenario-body">
                    <div className="container">
                        {!lastChoice ? (
                            <div className="scenario-question">
                                <h2>{currentStep.intrebare}</h2>
                                {currentStep.context && (
                                    <p className="scenario-context">{currentStep.context}</p>
                                )}

                                {currentStep.tip === 'alocare' && currentStep.alocare ? (
                                    <AllocationStep def={currentStep.alocare} onConfirm={chooseOption} />
                                ) : currentStep.tip === 'selectie-multipla' && currentStep.selectieMultipla ? (
                                    <MultiSelectStep def={currentStep.selectieMultipla} onConfirm={chooseOption} />
                                ) : (
                                    <div className="scenario-options">
                                        {currentStep.optiuni.map((opt) => (
                                            <button
                                                type="button"
                                                key={opt.id}
                                                className="scenario-option"
                                                onClick={() => chooseOption(opt)}
                                            >
                                                <span>{opt.eticheta}</span>
                                                <span
                                                    className={`figure ${opt.bani < 0 ? 'negative' : opt.bani > 0 ? 'positive' : ''}`}
                                                >
                                                    {opt.bani === 0 ? '0 lei' : `${opt.bani > 0 ? '+' : ''}${opt.bani} lei`}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="scenario-feedback">
                                <p className="scenario-feedback-text">{lastChoice.feedback}</p>
                                <button type="button" className="btn btn-primary btn-lg" onClick={continueToNext}>
                                    {isLastStep ? 'Vezi rezultatul' : 'Continuă'}
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className="scenario-play">
            <section className="scenario-result">
                <div className="container">
                    <span className="scenario-difficulty">{scenario.nume}</span>
                    <h1>Scenariu finalizat</h1>
                    <div className="scenario-result-score">
                        <AnimatedNumber value={`${scorFinal}`} />
                        <span className="scenario-result-score-max">/100</span>
                    </div>
                    <p className="scenario-result-balance figure">Sold final: {bani} lei</p>
                    {hasStres && (
                        <p className="scenario-result-stres figure">
                            Nivel de stres acumulat: {stres} (scăzut direct din scor)
                        </p>
                    )}
                    <div className="scenario-result-actions">
                        <Link to="/profile" className="btn btn-primary">
                            Vezi în profil
                        </Link>
                        <Link to="/" hash="scenarios" className="btn btn-ghost">
                            Alte scenarii
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ScenarioPlayPage