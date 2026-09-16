import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
    maxScoreFor,
    type AllocationStepDef,
    type MultiSelectStepDef,
    type TimePressureStepDef,
    type ComparatieOferteStepDef,
    type AdevaratFalsStepDef,
    type ScenarioOption,
} from '../../shared/scenarios/scenariosData'
import { useScenarios } from '../../shared/ScenariosContext/ScenariosContext'
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
    const { t } = useTranslation()
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
            feedback = t('scenarioPlay.feedback.rentTooHigh')
        } else if (economii === 0) {
            feedback = t('scenarioPlay.feedback.noSavings')
        } else {
            feedback = t('scenarioPlay.feedback.balancedBudget')
        }

        onConfirm({ id: 'alocare', eticheta: t('scenarioPlay.labels.allocationBudget'), bani: -total, puncte, feedback })
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
                <span>{t('scenarioPlay.remainingForVariable')}</span>
                <span className="figure">{remaining} lei</span>
            </div>
            <button type="button" className="btn btn-primary btn-lg" onClick={confirm} disabled={!isValid}>
                {t('scenarioPlay.buttons.confirmAllocation')}
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
    const { t } = useTranslation()
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
                ? t('scenarioPlay.feedback.noReductions')
                : t('scenarioPlay.feedback.reductionsFound', { amount: totalBani, count: selectedItems.length })

        onConfirm({
            id: 'reduceri',
            eticheta: t('scenarioPlay.labels.budgetReductions'),
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
                {t('scenarioPlay.buttons.confirmReductions')}
            </button>
        </div>
    )
}

function TimePressureStep({
                              def,
                              onConfirm,
                          }: {
    def: TimePressureStepDef
    onConfirm: (option: ScenarioOption) => void
}) {
    const { t } = useTranslation()
    const [timpRamas, setTimpRamas] = useState(def.secunde)
    const hasResolved = useRef(false)

    useEffect(() => {
        if (timpRamas <= 0) {
            if (!hasResolved.current) {
                hasResolved.current = true
                onConfirm(def.optiuneTimeout)
            }
            return
        }
        const id = setTimeout(() => setTimpRamas((t) => t - 1), 1000)
        return () => clearTimeout(id)
    }, [timpRamas, def, onConfirm])

    const handleChoose = (opt: ScenarioOption) => {
        if (hasResolved.current) return
        hasResolved.current = true
        onConfirm(opt)
    }

    const urgent = timpRamas <= 3

    return (
        <div className="timepressure-step">
            <div className={`timepressure-clock ${urgent ? 'urgent' : ''}`}>
                <span className="figure">{timpRamas}</span>
                <span className="timepressure-clock-label">{t('scenarioPlay.secondsRemaining')}</span>
            </div>
            <div className="scenario-options">
                {def.optiuni.map((opt) => (
                    <button
                        type="button"
                        key={opt.id}
                        className="scenario-option"
                        onClick={() => handleChoose(opt)}
                    >
                        <span>{opt.eticheta}</span>
                        <span className={`figure ${opt.bani < 0 ? 'negative' : opt.bani > 0 ? 'positive' : ''}`}>
                            {opt.bani === 0 ? '0 lei' : `${opt.bani > 0 ? '+' : ''}${opt.bani} lei`}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}

function OfferComparisonStep({
                                 def,
                                 onConfirm,
                             }: {
    def: ComparatieOferteStepDef
    onConfirm: (option: ScenarioOption) => void
}) {
    const { t } = useTranslation()
    const choose = (oferta: (typeof def.oferte)[number]) => {
        onConfirm({
            id: oferta.id,
            eticheta: oferta.eticheta,
            bani: oferta.bani,
            puncte: oferta.puncte,
            stres: oferta.stres,
            scorCredit: oferta.scorCredit,
            feedback: oferta.feedback,
        })
    }

    return (
        <div className="offer-comparison">
            {def.oferte.map((oferta) => (
                <button type="button" className="offer-card" key={oferta.id} onClick={() => choose(oferta)}>
                    <h3 className="offer-title">{oferta.eticheta}</h3>
                    <div className="offer-row">
                        <span>{t('scenarioPlay.offer.annualRate')}</span>
                        <span className="figure">{oferta.dobanda}%</span>
                    </div>
                    <div className="offer-row">
                        <span>{t('scenarioPlay.offer.duration')}</span>
                        <span className="figure">{oferta.durataLuni} {t('scenarioPlay.offer.months')}</span>
                    </div>
                    <div className="offer-row">
                        <span>{t('scenarioPlay.offer.monthlyRate')}</span>
                        <span className="figure">{oferta.rataLunara} lei</span>
                    </div>
                    <div className="offer-row offer-total">
                        <span>{t('scenarioPlay.offer.totalCost')}</span>
                        <span className="figure">{oferta.costTotal} lei</span>
                    </div>
                </button>
            ))}
        </div>
    )
}

function TrueFalseStep({
                           def,
                           onConfirm,
                       }: {
    def: AdevaratFalsStepDef
    onConfirm: (option: ScenarioOption) => void
}) {
    const { t } = useTranslation()
    const [answers, setAnswers] = useState<Record<string, boolean>>({})
    const [revealed, setRevealed] = useState(false)

    const answer = (id: string, value: boolean) => {
        if (revealed) return
        setAnswers((prev) => ({ ...prev, [id]: value }))
    }

    const allAnswered = def.intrebari.every((q) => answers[q.id] !== undefined)

    const finish = () => {
        if (!revealed) {
            setRevealed(true)
            return
        }
        const puncte = def.intrebari.reduce(
            (sum, q) => sum + (answers[q.id] === q.raspunsCorect ? q.puncte : 0),
            0
        )
        const corecte = def.intrebari.filter((q) => answers[q.id] === q.raspunsCorect).length
        onConfirm({
            id: 'quiz-credit',
            eticheta: t('scenarioPlay.labels.creditQuiz'),
            bani: 0,
            puncte,
            feedback: t('scenarioPlay.feedback.quizResult', { correct: corecte, total: def.intrebari.length }),
        })
    }

    return (
        <div className="truefalse-step">
            {def.intrebari.map((q) => {
                const chosen = answers[q.id]
                const isCorrect = chosen === q.raspunsCorect
                return (
                    <div className="truefalse-item" key={q.id}>
                        <p className="truefalse-statement">{q.afirmatie}</p>
                        <div className="truefalse-buttons">
                            <button
                                type="button"
                                className={`truefalse-btn ${chosen === true ? 'selected' : ''} ${
                                    revealed && q.raspunsCorect === true ? 'correct' : ''
                                } ${revealed && chosen === true && !isCorrect ? 'incorrect' : ''}`}
                                onClick={() => answer(q.id, true)}
                                disabled={revealed}
                            >
                                {t('scenarioPlay.buttons.true')}
                            </button>
                            <button
                                type="button"
                                className={`truefalse-btn ${chosen === false ? 'selected' : ''} ${
                                    revealed && q.raspunsCorect === false ? 'correct' : ''
                                } ${revealed && chosen === false && !isCorrect ? 'incorrect' : ''}`}
                                onClick={() => answer(q.id, false)}
                                disabled={revealed}
                            >
                                {t('scenarioPlay.buttons.false')}
                            </button>
                        </div>
                        {revealed && <p className="truefalse-explicatie">{q.explicatie}</p>}
                    </div>
                )
            })}
            <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={finish}
                disabled={!allAnswered}
            >
                {revealed ? t('scenarioPlay.buttons.continue') : t('scenarioPlay.buttons.checkAnswers')}
            </button>
        </div>
    )
}

function ScenarioPlayPage() {
    const { t } = useTranslation()

    const { slug } = useParams({ from: '/_app/scenarios/$slug' })
    const { getBySlug } = useScenarios()
    const scenario = getBySlug(slug)
    const { addEntry } = useScenarioHistory()
    const { isLoggedIn } = useAuth()

    const [stage, setStage] = useState<Stage>('intro')
    const [stepIndex, setStepIndex] = useState(0)
    const [bani, setBani] = useState(scenario?.soldInitial ?? 0)
    const [puncte, setPuncte] = useState(0)
    const [stres, setStres] = useState(0)
    const [scorCredit, setScorCredit] = useState(scenario?.scorCreditInitial ?? 0)
    const [lastChoice, setLastChoice] = useState<ScenarioOption | null>(null)
    const [showInfo, setShowInfo] = useState(false)
    const hasSaved = useRef(false)

    const steps = useMemo(() => {
        if (!scenario) return []
        return scenario.pasi.map((step) => ({ ...step, optiuni: shuffle(step.optiuni) }))
    }, [scenario])

    const hasStres = useMemo(
        () => steps.some((s) => s.optiuni.some((o) => (o.stres ?? 0) !== 0)),
        [steps]
    )

    const hasScorCredit = scenario?.scorCreditInitial !== undefined

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
        setScorCredit(scenario?.scorCreditInitial ?? 0)
        setLastChoice(null)
        setShowInfo(false)
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
                <p>{t('scenarioPlay.scenarioNotFound')}</p>
                <Link to="/scenarios" className="btn btn-primary">
                    {t('scenarioPlay.buttons.backToScenarios')}
                </Link>
            </div>
        )
    }

    if (scenario.necesitaCont && !isLoggedIn) {
        return (
            <div className="scenario-missing">
                <span className="scenario-difficulty">{scenario.dificultate}</span>
                <h1>{scenario.nume}</h1>
                <p>{t('scenarioPlay.accountRequired')}</p>
                <div className="scenario-locked-actions">
                    <Link to="/login" className="btn btn-primary">
                        {t('scenarioPlay.buttons.loginRegister')}
                    </Link>
                    <Link to="/scenarios" className="btn btn-ghost">
                        {t('scenarioPlay.buttons.backToScenarios')}
                    </Link>
                </div>
            </div>
        )
    }

    if (scenario.pasi.length === 0) {
        return (
            <div className="scenario-missing">
                <h1>{scenario.nume}</h1>
                <p>{t('scenarioPlay.inProgress')}</p>
                <Link to="/scenarios" className="btn btn-primary">
                    {t('scenarioPlay.buttons.backToScenarios')}
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
        setScorCredit((prev) => prev + (option.scorCredit ?? 0))
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
                            <span>{t('scenarioPlay.startingBalance')}</span>
                            <span className="figure">{scenario.soldInitial} lei</span>
                        </div>
                        <button type="button" className="btn btn-primary btn-lg" onClick={startScenario}>
                            {t('scenarioPlay.buttons.start')}
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
                            {t('scenarioPlay.stepCount', { current: stepIndex + 1, total: steps.length })}
                        </span>
                        <div className="scenario-header-stats">
                            <button
                                type="button"
                                className="scenario-info-toggle"
                                onClick={() => setShowInfo((v) => !v)}
                                aria-expanded={showInfo}
                            >
                                <span className="scenario-info-toggle-icon">ⓘ</span>
                                {t('scenarioPlay.whatDoesItMean')}
                            </button>
                            {hasScorCredit && (
                                <span className={`scenario-scor-credit figure ${scorCredit < 60 ? 'low' : ''}`}>
                                    {t('scenarioPlay.creditScoreLabel', { score: scorCredit })}
                                </span>
                            )}
                            {hasStres && (
                                <span className="scenario-stres figure">{t('scenarioPlay.stressLabel', { value: stres })}</span>
                            )}
                            <span className="scenario-balance-wrap">
                                <span className="scenario-balance figure">{t('scenarioPlay.balanceLabel', { value: bani })}</span>
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

                {showInfo && (
                    <section className="scenario-info-panel">
                        <div className="container scenario-info-panel-inner">
                            <div>
                                <strong>{t('scenarioPlay.infoBalanceTitle')}</strong> {t('scenarioPlay.infoBalanceText')}
                            </div>
                            {hasStres && (
                                <div>
                                    <strong>{t('scenarioPlay.infoStressTitle')}</strong> {t('scenarioPlay.infoStressText')}
                                </div>
                            )}
                            {hasScorCredit && (
                                <div>
                                    <strong>{t('scenarioPlay.infoCreditTitle')}</strong> {t('scenarioPlay.infoCreditText')}
                                </div>
                            )}
                            <button
                                type="button"
                                className="scenario-info-close"
                                onClick={() => setShowInfo(false)}
                            >
                                {t('scenarioPlay.buttons.iUnderstand')}
                            </button>
                        </div>
                    </section>
                )}

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
                                ) : currentStep.tip === 'presiune-timp' && currentStep.presiuneTimp ? (
                                    <TimePressureStep def={currentStep.presiuneTimp} onConfirm={chooseOption} />
                                ) : currentStep.tip === 'comparatie-oferte' && currentStep.comparatieOferte ? (
                                    <OfferComparisonStep def={currentStep.comparatieOferte} onConfirm={chooseOption} />
                                ) : currentStep.tip === 'adevarat-fals' && currentStep.adevaratFals ? (
                                    <TrueFalseStep def={currentStep.adevaratFals} onConfirm={chooseOption} />
                                ) : (
                                    <div className="scenario-options">
                                        {(() => {
                                            const areBaniRelevant = currentStep.optiuni.some((o) => o.bani !== 0)
                                            return currentStep.optiuni.map((opt) => {
                                                const locked = opt.scorMinim !== undefined && scorCredit < opt.scorMinim
                                                return (
                                                    <button
                                                        type="button"
                                                        key={opt.id}
                                                        className={`scenario-option ${locked ? 'locked' : ''}`}
                                                        onClick={() => !locked && chooseOption(opt)}
                                                        disabled={locked}
                                                    >
                                                        <span>
                                                            {opt.eticheta}
                                                            {locked && (
                                                                <span className="scenario-option-lock">
                                                                    {t('scenarioPlay.minCreditRequired', {
                                                                        min: opt.scorMinim,
                                                                        current: scorCredit,
                                                                    })}
                                                                </span>
                                                            )}
                                                        </span>
                                                        {areBaniRelevant && (
                                                            <span
                                                                className={`figure ${opt.bani < 0 ? 'negative' : opt.bani > 0 ? 'positive' : ''}`}
                                                            >
                                                                {opt.bani === 0 ? '0 lei' : `${opt.bani > 0 ? '+' : ''}${opt.bani} lei`}
                                                            </span>
                                                        )}
                                                    </button>
                                                )
                                            })
                                        })()}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="scenario-feedback">
                                <p className="scenario-feedback-text">{lastChoice.feedback}</p>
                                <button type="button" className="btn btn-primary btn-lg" onClick={continueToNext}>
                                    {isLastStep ? t('scenarioPlay.buttons.seeResult') : t('scenarioPlay.buttons.continue')}
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
                    <h1>{t('scenarioPlay.resultTitle')}</h1>
                    <div className="scenario-result-score">
                        <AnimatedNumber value={`${scorFinal}`} />
                        <span className="scenario-result-score-max">/100</span>
                    </div>
                    <p className="scenario-result-balance figure">{t('scenarioPlay.finalBalance', { value: bani })}</p>
                    {hasStres && (
                        <p className="scenario-result-stres figure">
                            {t('scenarioPlay.stressAccumulated', { value: stres })}
                        </p>
                    )}
                    {hasScorCredit && (
                        <p className="scenario-result-scor-credit figure">{t('scenarioPlay.finalCreditScore', { value: scorCredit })}</p>
                    )}
                    <div className="scenario-result-actions">
                        <Link to="/profile" className="btn btn-primary">
                            {t('scenarioPlay.buttons.viewProfile')}
                        </Link>
                        <Link to="/scenarios" className="btn btn-ghost">
                            {t('scenarioPlay.buttons.otherScenarios')}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ScenarioPlayPage
