import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { getScenarioBySlug, maxScoreFor, type ScenarioOption } from '../../shared/scenarios/scenariosData.ts'
import { useScenarioHistory } from '../../shared/ScenarioHistoryContext/ScenarioHistoryContext.ts'
import { useAuth } from '../../shared/AuthContext/AuthContext.ts'
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

function ScenarioPlayPage() {
    const { slug } = useParams({ from: '/_app/scenarios/$slug' })
    const scenario = getScenarioBySlug(slug)
    const { addEntry } = useScenarioHistory()
    const { isLoggedIn } = useAuth()

    const [stage, setStage] = useState<Stage>('intro')
    const [stepIndex, setStepIndex] = useState(0)
    const [bani, setBani] = useState(scenario?.soldInitial ?? 0)
    const [puncte, setPuncte] = useState(0)
    const [lastChoice, setLastChoice] = useState<ScenarioOption | null>(null)
    const hasSaved = useRef(false)

    const steps = useMemo(() => {
        if (!scenario) return []
        return scenario.pasi.map((step) => ({ ...step, optiuni: shuffle(step.optiuni) }))
    }, [scenario])

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
        setLastChoice(null)
        hasSaved.current = false
    }, [slug, scenario])

    useEffect(() => {
        if (stage === 'result' && scenario && !hasSaved.current) {
            hasSaved.current = true
            const maxScore = maxScoreFor(scenario)
            const scorFinal = Math.round((puncte / maxScore) * 100)
            addEntry({ scenariu: scenario.nume, data: todayLabel(), scor: scorFinal })
        }
    }, [stage, scenario, puncte, addEntry])

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
    const maxScore = maxScoreFor(scenario)
    const scorFinal = Math.round((puncte / maxScore) * 100)

    const startScenario = () => {
        setStage('playing')
    }

    const chooseOption = (option: ScenarioOption) => {
        setBani((prev) => prev + option.bani)
        setPuncte((prev) => prev + option.puncte)
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
                </section>

                <section className="scenario-body">
                    <div className="container">
                        {!lastChoice ? (
                            <div className="scenario-question">
                                <h2>{currentStep.intrebare}</h2>
                                <div className="scenario-options">
                                    {currentStep.optiuni.map((opt) => (
                                        <button
                                            type="button"
                                            key={opt.id}
                                            className="scenario-option"
                                            onClick={() => chooseOption(opt)}
                                        >
                                            <span>{opt.eticheta}</span>
                                            <span className={`figure ${opt.bani < 0 ? 'negative' : opt.bani > 0 ? 'positive' : ''}`}>
                                                {opt.bani === 0 ? '0 lei' : `${opt.bani > 0 ? '+' : ''}${opt.bani} lei`}
                                            </span>
                                        </button>
                                    ))}
                                </div>
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