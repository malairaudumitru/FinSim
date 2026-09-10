import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedNumber from '../../shared/AnimatedNumber/AnimatedNumber'
import { useLeaderboard } from '../../shared/LeaderboardContext/LeaderboardContext'
import '../../shared/ContentPage/ContentPage.css'
import './LeaderboardPage.css'

interface RankedEntry {
    rang: number
    nume: string
    prenume: string
    scor: number
    esteTu?: boolean
}

function initialsOf(entry: RankedEntry) {
    return `${entry.prenume[0]}${entry.nume[0]}`
}

const PODIUM_STEP_DURATION = 1.1
const podiumDelay: Record<number, number> = {
    3: 0,
    2: PODIUM_STEP_DURATION,
    1: PODIUM_STEP_DURATION * 2,
}

const podiumBaseHeight: Record<number, number> = { 1: 108, 2: 76, 3: 48 }

function PodiumCard({ entry, delay }: { entry: RankedEntry; delay: number }) {
    const [revealed, setRevealed] = useState(false)

    useEffect(() => {
        const id = setTimeout(() => setRevealed(true), delay * 1000)
        return () => clearTimeout(id)
    }, [delay])

    return (
        <div className={`podium-item rank-${entry.rang}`}>
            <motion.div
                className="podium-person"
                initial={{ opacity: 0 }}
                animate={{ opacity: revealed ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            >
                {entry.esteTu && <span className="podium-you-badge">Tu</span>}
                <div className="podium-avatar">{initialsOf(entry)}</div>
                <h3 className="podium-name">
                    {entry.prenume} {entry.nume}
                </h3>
                <span className="podium-score figure">
                    {revealed ? <AnimatedNumber value={`${entry.scor}`} /> : 0}
                </span>
            </motion.div>
            <motion.div
                className="podium-base"
                initial={{ height: 0 }}
                animate={{ height: podiumBaseHeight[entry.rang] }}
                transition={{ duration: PODIUM_STEP_DURATION, delay, ease: [0.16, 1, 0.3, 1] }}
            >
                <span className="podium-base-rank figure">{entry.rang}</span>
            </motion.div>
        </div>
    )
}

function LeaderboardPage() {
    const { entries } = useLeaderboard()
    const ranked: RankedEntry[] = [...entries]
        .sort((a, b) => b.scor - a.scor)
        .slice(0, 10)
        .map((entry, index) => ({ ...entry, rang: index + 1 }))
    const top3 = ranked.slice(0, 3)
    const rest = ranked.slice(3)

    return (
        <div className="leaderboard-page">
            <section className="content-hero">
                <div className="container">
                    <h1>Clasament</h1>
                    <p className="content-hero-subtitle">
                        Top 10 utilizatori după scorul general, obținut din finalizarea
                        scenariilor — cu cât iei decizii mai bune, cu atât scorul crește.
                    </p>
                </div>
            </section>

            <section className="leaderboard-podium-section">
                <div className="container">
                    <div className="leaderboard-podium">
                        {top3.map((entry) => (
                            <PodiumCard entry={entry} delay={podiumDelay[entry.rang]} key={entry.rang} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="leaderboard-rest-section">
                <div className="container">
                    <div className="leaderboard-list">
                        {rest.map((entry) => (
                            <div
                                className={`leaderboard-row ${entry.esteTu ? 'is-you' : ''}`}
                                key={entry.rang}
                            >
                                <span className="leaderboard-rank figure">
                                    {String(entry.rang).padStart(2, '0')}
                                </span>
                                <div className="leaderboard-user">
                                    <div className="leaderboard-avatar">{initialsOf(entry)}</div>
                                    <span className="leaderboard-name">
                                        {entry.prenume} {entry.nume}
                                        {entry.esteTu && <span className="leaderboard-you-badge">Tu</span>}
                                    </span>
                                </div>
                                <span className="leaderboard-score figure">
                                    <AnimatedNumber value={`${entry.scor}`} />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LeaderboardPage