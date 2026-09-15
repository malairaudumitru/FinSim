import { useLeaderboard, type LeaderboardEntry } from '../../shared/LeaderboardContext/LeaderboardContext'

function LeaderboardSection() {
    const { entries, deleteEntry } = useLeaderboard()

    const ranked = [...entries].sort((a, b) => b.scor - a.scor)

    const handleDelete = (entry: LeaderboardEntry) => {
        if (confirm(`Ascunzi ${entry.prenume} ${entry.nume} din clasament?`)) {
            deleteEntry(entry.id)
        }
    }

    return (
        <div>
            <div className="admin-panel-header">
                <div>
                    <h2>Clasament</h2>
                    <p>Calculat automat din scorurile scenariilor jucate — {entries.length} intrări.</p>
                </div>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Rang</th>
                            <th>Nume</th>
                            <th>Scor</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranked.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={4}>Nicio intrare în clasament.</td>
                            </tr>
                        )}
                        {ranked.map((entry, index) => (
                            <tr key={entry.id}>
                                <td>{index + 1}</td>
                                <td>
                                    {entry.prenume} {entry.nume}
                                    {entry.esteTu && <span className="admin-badge admin-badge-gold" style={{ marginLeft: 8 }}>Tu</span>}
                                </td>
                                <td>{entry.scor}</td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button
                                            type="button"
                                            className="admin-icon-btn danger"
                                            onClick={() => handleDelete(entry)}
                                        >
                                            Ascunde
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default LeaderboardSection
