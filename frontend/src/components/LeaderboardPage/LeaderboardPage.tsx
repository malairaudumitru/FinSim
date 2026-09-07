import AnimatedNumber from '../../shared/AnimatedNumber/AnimatedNumber'
import '../../shared/ContentPage.css'
import './LeaderboardPage.css'

interface LeaderboardEntry {
    rang: number
    nume: string
    prenume: string
    scor: number
    esteTu?: boolean
}

const leaderboard: LeaderboardEntry[] = [
    { rang: 1, nume: 'Robu', prenume: 'Diana', scor: 968 },
    { rang: 2, nume: 'Munteanu', prenume: 'Alexandru', scor: 942 },
    { rang: 3, nume: 'Rusu', prenume: 'Cristina', scor: 915 },
    { rang: 4, nume: 'Ceban', prenume: 'Vlad', scor: 887 },
    { rang: 5, nume: 'Grosu', prenume: 'Ana', scor: 860 },
    { rang: 6, nume: 'Cojocaru', prenume: 'Mihai', scor: 834 },
    { rang: 7, nume: 'Bordei', prenume: 'Elena', scor: 812 },
    { rang: 8, nume: 'Popescu', prenume: 'Ion', scor: 742, esteTu: true },
    { rang: 9, nume: 'Fusu', prenume: 'Radu', scor: 705 },
    { rang: 10, nume: 'Ivanov', prenume: 'Corina', scor: 668 },
]

const top3 = leaderboard.slice(0, 3)
const rest = leaderboard.slice(3)

function initialsOf(entry: LeaderboardEntry) {
    return `${entry.prenume[0]}${entry.nume[0]}`
}

function LeaderboardPage() {
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
                            <div className={`podium-item rank-${entry.rang}`} key={entry.rang}>
                                <div className="podium-person">
                                    {entry.esteTu && <span className="podium-you-badge">Tu</span>}
                                    <div className="podium-avatar">{initialsOf(entry)}</div>
                                    <h3 className="podium-name">
                                        {entry.prenume} {entry.nume}
                                    </h3>
                                    <span className="podium-score figure">
                                        <AnimatedNumber value={`${entry.scor}`} />
                                    </span>
                                </div>
                                <div className="podium-base">
                                    <span className="podium-base-rank figure">{entry.rang}</span>
                                </div>
                            </div>
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