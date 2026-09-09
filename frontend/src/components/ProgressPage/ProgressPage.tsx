import { useMemo } from 'react'
import { useScenarioHistory } from '../../shared/ScenarioHistoryContext/ScenarioHistoryContext'
import { scenarios } from '../../shared/scenarios/scenariosData'
import AnimatedNumber from '../../shared/AnimatedNumber/AnimatedNumber'
import '../../shared/ContentPage/ContentPage.css'
import './ProgressPage.css'

interface Badge {
    id: string
    titlu: string
    descriere: string
    unlocked: boolean
}

function parseDate(data: string): number {
    const [zi, luna, an] = data.split('.').map(Number)
    return new Date(an, luna - 1, zi).getTime()
}

function scoreClass(scor: number) {
    if (scor >= 70) return 'positive'
    if (scor < 50) return 'negative'
    return ''
}

function ScoreLineChart({ entries }: { entries: { id: string; data: string; scor: number }[] }) {
    const width = Math.max(600, entries.length * 110)
    const height = 260
    const paddingTop = 34
    const paddingBottom = 40
    const usableHeight = height - paddingTop - paddingBottom

    const scoruri = entries.map((e) => e.scor)
    const yMin = Math.max(0, Math.min(...scoruri) - 10)
    const yMax = Math.min(100, Math.max(...scoruri) + 10)
    const yRange = yMax - yMin || 1

    const points = entries.map((entry, i) => {
        const x = entries.length === 1 ? width / 2 : 40 + (i / (entries.length - 1)) * (width - 80)
        const y = paddingTop + usableHeight - ((entry.scor - yMin) / yRange) * usableHeight
        return { x, y, entry }
    })

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
    const baselineY = height - paddingBottom
    const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${baselineY} L ${points[0].x.toFixed(1)} ${baselineY} Z`

    return (
        <div className="progress-linechart-wrap">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                width="100%"
                height={height}
                preserveAspectRatio="none"
                className="progress-linechart"
            >
                <line x1={0} y1={baselineY} x2={width} y2={baselineY} className="progress-linechart-baseline" />
                <path d={areaPath} className="progress-linechart-area" />
                <path d={linePath} fill="none" className="progress-linechart-line" />
                {points.map((p) => (
                    <g key={p.entry.id}>
                        <circle cx={p.x} cy={p.y} r={5} className={`progress-linechart-dot ${scoreClass(p.entry.scor)}`} />
                        <text x={p.x} y={p.y - 16} textAnchor="middle" className="progress-linechart-value figure">
                            {p.entry.scor}
                        </text>
                        <text x={p.x} y={baselineY + 22} textAnchor="middle" className="progress-linechart-date figure">
                            {p.entry.data.slice(0, 5)}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    )
}

function ProgressPage() {
    const { history } = useScenarioHistory()

    const stats = useMemo(() => {
        if (history.length === 0) {
            return { total: 0, mediu: 0, maxim: 0, ziActive: 0 }
        }
        const total = history.length
        const mediu = Math.round(history.reduce((sum, h) => sum + h.scor, 0) / total)
        const maxim = Math.max(...history.map((h) => h.scor))
        const ziActive = new Set(history.map((h) => h.data)).size
        return { total, mediu, maxim, ziActive }
    }, [history])

    const chartEntries = useMemo(
        () => [...history].sort((a, b) => parseDate(a.data) - parseDate(b.data)),
        [history]
    )

    const perScenario = useMemo(() => {
        return scenarios.map((s) => {
            const entries = history.filter((h) => h.scenariu === s.nume)
            const best = entries.length > 0 ? Math.max(...entries.map((e) => e.scor)) : null
            return { nume: s.nume, dificultate: s.dificultate, jucat: entries.length, best }
        })
    }, [history])

    const scenariiDistincte = new Set(history.map((h) => h.scenariu)).size

    const badges: Badge[] = [
        {
            id: 'prima',
            titlu: 'Prima simulare',
            descriere: 'Finalizează primul tău scenariu.',
            unlocked: stats.total >= 1,
        },
        {
            id: 'cinci',
            titlu: 'Cinci simulări',
            descriere: 'Joacă 5 scenarii, indiferent de rezultat.',
            unlocked: stats.total >= 5,
        },
        {
            id: 'toate',
            titlu: 'Toate scenariile',
            descriere: 'Încearcă toate cele 4 scenarii disponibile.',
            unlocked: scenariiDistincte >= 4,
        },
        {
            id: 'perfect',
            titlu: 'Scor perfect',
            descriere: 'Obține 100/100 la orice scenariu.',
            unlocked: history.some((h) => h.scor === 100),
        },
        {
            id: 'active',
            titlu: 'Zile active',
            descriere: 'Joacă în cel puțin 3 zile diferite.',
            unlocked: stats.ziActive >= 3,
        },
    ]

    return (
        <div className="progress-page">
            <section className="content-hero">
                <div className="container">
                    <h1>Progresul tău</h1>
                    <p className="content-hero-subtitle">
                        Tot ce ai realizat până acum, într-un singur loc.
                    </p>
                </div>
            </section>

            <section className="progress-stats">
                <div className="container progress-stats-inner">
                    <div className="stat">
                        <span className="stat-value">
                            <AnimatedNumber value={`${stats.total}`} />
                        </span>
                        <span className="stat-label">simulări finalizate</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">
                            <AnimatedNumber value={`${stats.mediu}`} />
                        </span>
                        <span className="stat-label">scor mediu</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">
                            <AnimatedNumber value={`${stats.maxim}`} />
                        </span>
                        <span className="stat-label">cel mai bun scor</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">
                            <AnimatedNumber value={`${stats.ziActive}`} />
                        </span>
                        <span className="stat-label">zile active</span>
                    </div>
                </div>
            </section>

            <section className="progress-chart-section">
                <div className="container">
                    <div className="section-heading">
                        <h2>Evoluția scorurilor</h2>
                        <p className="section-subtitle">Fiecare simulare jucată, în ordine cronologică.</p>
                    </div>

                    {chartEntries.length === 0 ? (
                        <p className="progress-empty">
                            Nu ai finalizat încă nicio simulare — rezultatele tale vor apărea aici.
                        </p>
                    ) : (
                        <ScoreLineChart entries={chartEntries} />
                    )}
                </div>
            </section>

            <section className="progress-breakdown-section">
                <div className="container">
                    <div className="section-heading">
                        <h2>Pe scenarii</h2>
                        <p className="section-subtitle">Cel mai bun scor obținut la fiecare scenariu.</p>
                    </div>
                    <div className="progress-breakdown-list">
                        {perScenario.map((s) => (
                            <div className="progress-breakdown-row" key={s.nume}>
                                <div className="progress-breakdown-info">
                                    <h3>{s.nume}</h3>
                                    <span className="progress-breakdown-meta">
                                        {s.dificultate} · {s.jucat} {s.jucat === 1 ? 'joc' : 'jocuri'}
                                    </span>
                                </div>
                                <div className="progress-breakdown-bar-wrap">
                                    <div className="progress-breakdown-bar-track">
                                        <div
                                            className="progress-breakdown-bar-fill"
                                            style={{ width: `${s.best ?? 0}%` }}
                                        />
                                    </div>
                                    <span className="figure progress-breakdown-best">
                                        {s.best !== null ? `${s.best}/100` : '—'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="progress-badges-section">
                <div className="container">
                    <div className="section-heading">
                        <h2>Realizări</h2>
                        <p className="section-subtitle">Insigne deblocate pe măsură ce joci.</p>
                    </div>
                    <div className="progress-badges-grid">
                        {badges.map((b) => (
                            <div className={`progress-badge ${b.unlocked ? 'unlocked' : ''}`} key={b.id}>
                                <div className="progress-badge-icon">{b.unlocked ? '★' : '☆'}</div>
                                <h3>{b.titlu}</h3>
                                <p>{b.descriere}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ProgressPage