import { useTranslation } from 'react-i18next'
import { useLeaderboard, type LeaderboardEntry } from '../../shared/LeaderboardContext/LeaderboardContext'

function LeaderboardSection() {
    const { t } = useTranslation()
    const { entries, deleteEntry } = useLeaderboard()

    const ranked = [...entries].sort((a, b) => b.scor - a.scor)

    const handleDelete = async (entry: LeaderboardEntry) => {
        if (confirm(t('admin.leaderboard.confirm_hide', { name: `${entry.prenume} ${entry.nume}` }))) {
            await deleteEntry(entry.id)
        }
    }

    return (
        <div>
            <div className="admin-panel-header">
                <div>
                    <h2>{t('admin.leaderboard.title')}</h2>
                    <p>{t('admin.leaderboard.subtitle', { count: entries.length })}</p>
                </div>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('admin.leaderboard.col_rank')}</th>
                            <th>{t('admin.leaderboard.col_name')}</th>
                            <th>{t('admin.leaderboard.col_score')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranked.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={4}>{t('admin.leaderboard.empty')}</td>
                            </tr>
                        )}
                        {ranked.map((entry, index) => (
                            <tr key={entry.id}>
                                <td>{index + 1}</td>
                                <td>
                                    {entry.prenume} {entry.nume}
                                    {entry.esteTu && <span className="admin-badge admin-badge-gold admin-badge-you" style={{ marginLeft: 8 }}>{t('admin.leaderboard.you_badge')}</span>}
                                </td>
                                <td>{entry.scor}</td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button
                                            type="button"
                                            className="admin-icon-btn danger"
                                            onClick={() => handleDelete(entry)}
                                        >
                                            {t('admin.leaderboard.hide')}
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
