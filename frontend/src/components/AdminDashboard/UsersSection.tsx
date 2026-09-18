import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useUsers, type AppUser, type UserRole, type UserStatus } from '../../shared/UsersContext/UsersContext'
import Modal from '../../shared/Modal/Modal'
import Dropdown from '../../shared/Dropdown/Dropdown'
import {
    isValidBirthDate,
    daysInMonth,
    formatBirthDate,
    VARSTA_MINIMA,
    VARSTA_MAXIMA,
} from '../../shared/birthDate/birthDate'

type FormState = {
    nume: string
    prenume: string
    email: string
    parola: string
    rol: UserRole
    status: UserStatus
    scenariiFinalizate: string
    scorTotal: string
    zi: string
    luna: string
    an: string
}

const emptyForm: FormState = {
    nume: '',
    prenume: '',
    email: '',
    parola: '',
    rol: 'user',
    status: 'activ',
    scenariiFinalizate: '0',
    scorTotal: '0',
    zi: '',
    luna: '',
    an: '',
}

function toForm(u: AppUser): FormState {
    return {
        nume: u.nume,
        prenume: u.prenume,
        email: u.email,
        parola: '',
        rol: u.rol,
        status: u.status,
        scenariiFinalizate: String(u.scenariiFinalizate),
        scorTotal: String(u.scorTotal),
        zi: u.zi ? String(u.zi) : '',
        luna: u.luna ? String(u.luna) : '',
        an: u.an ? String(u.an) : '',
    }
}

function UsersSection() {
    const { t } = useTranslation()
    const { users, addUser, updateUser, deleteUser } = useUsers()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState<FormState>(emptyForm)
    const [error, setError] = useState('')

    const luni = t('common.months', { returnObjects: true }) as string[]

    const rolOptions = [
        { value: 'user', label: t('admin.users.role_user') },
        { value: 'admin', label: t('admin.users.role_admin') },
    ]

    const statusOptions = [
        { value: 'activ', label: t('admin.users.status_active') },
        { value: 'blocat', label: t('admin.users.status_blocked') },
    ]

    const roleLabel = (rol: UserRole) => (rol === 'admin' ? t('admin.users.role_admin') : t('admin.users.role_user'))
    const statusLabel = (status: UserStatus) =>
        status === 'activ' ? t('admin.users.status_active') : t('admin.users.status_blocked')

    const anCurent = new Date().getFullYear()
    const aniDisponibili = Array.from(
        { length: VARSTA_MAXIMA - VARSTA_MINIMA + 1 },
        (_, i) => anCurent - VARSTA_MINIMA - i
    )
    const maxZile = daysInMonth(Number(form.luna) || undefined, Number(form.an) || undefined)
    const ziledisponibile = Array.from({ length: maxZile }, (_, i) => i + 1)

    const openAdd = () => {
        setEditingId(null)
        setForm(emptyForm)
        setError('')
        setShowForm(true)
    }

    const openEdit = (u: AppUser) => {
        setEditingId(u.id)
        setForm(toForm(u))
        setError('')
        setShowForm(true)
    }

    const close = () => setShowForm(false)

    const handleDateFieldChange = (field: 'luna' | 'an') => (value: string) => {
        setForm((prev) => {
            const next = { ...prev, [field]: value }
            const maxDays = daysInMonth(Number(next.luna) || undefined, Number(next.an) || undefined)
            if (Number(next.zi) > maxDays) next.zi = ''
            return next
        })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!form.nume.trim() || !form.prenume.trim() || !form.email.trim()) {
            setError(t('admin.users.error_required'))
            return
        }
        const duplicate = users.find(
            (u) => u.email.toLowerCase() === form.email.trim().toLowerCase() && u.id !== editingId
        )
        if (duplicate) {
            setError(t('admin.users.error_duplicate_email'))
            return
        }

        const zi = Number(form.zi)
        const luna = Number(form.luna)
        const an = Number(form.an)
        const hasBirthDate = Boolean(form.zi || form.luna || form.an)
        if (hasBirthDate && (!zi || !luna || !an || !isValidBirthDate(zi, luna, an))) {
            setError(t('admin.users.error_birthdate_invalid'))
            return
        }
        if (!editingId && !hasBirthDate) {
            setError(t('admin.users.error_birthdate_invalid'))
            return
        }
        if (!editingId && form.parola.trim().length < 8) {
            setError(t('admin.users.error_password_length'))
            return
        }

        const payload = {
            nume: form.nume.trim(),
            prenume: form.prenume.trim(),
            email: form.email.trim(),
            rol: form.rol,
            status: form.status,
            scenariiFinalizate: Math.max(0, Number(form.scenariiFinalizate) || 0),
            scorTotal: Math.max(0, Number(form.scorTotal) || 0),
            zi: form.zi ? zi : undefined,
            luna: form.luna ? luna : undefined,
            an: form.an ? an : undefined,
        }

        try {
            if (editingId) {
                await updateUser(editingId, payload)
            } else {
                await addUser({ ...payload, parola: form.parola.trim() })
            }
            setShowForm(false)
        } catch {
            setError(t('admin.users.error_required'))
        }
    }

    const handleDelete = async (u: AppUser) => {
        if (confirm(t('admin.users.confirm_delete', { name: `${u.prenume} ${u.nume}` }))) {
            await deleteUser(u.id)
        }
    }

    return (
        <div>
            <div className="admin-panel-header">
                <div>
                    <h2>{t('admin.users.title')}</h2>
                    <p>{t('admin.users.subtitle', { count: users.length })}</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openAdd}>
                    + {t('admin.users.add_button')}
                </button>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('admin.users.col_name')}</th>
                            <th>{t('admin.users.col_email')}</th>
                            <th>{t('admin.users.col_role')}</th>
                            <th>{t('admin.users.col_status')}</th>
                            <th>{t('admin.users.col_registered')}</th>
                            <th>{t('admin.users.col_birthdate')}</th>
                            <th>{t('admin.users.col_score')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={8}>{t('admin.users.empty')}</td>
                            </tr>
                        )}
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.prenume} {u.nume}</td>
                                <td className="admin-cell-muted">{u.email}</td>
                                <td>
                                    <span className={`admin-badge admin-badge-wide ${u.rol === 'admin' ? 'admin-badge-gold' : 'admin-badge-gray'}`}>
                                        {roleLabel(u.rol)}
                                    </span>
                                </td>
                                <td>
                                    <span className={`admin-badge admin-badge-wide ${u.status === 'activ' ? 'admin-badge-green' : 'admin-badge-red'}`}>
                                        {statusLabel(u.status)}
                                    </span>
                                </td>
                                <td className="admin-cell-muted">{u.dataInregistrare}</td>
                                <td className="admin-cell-muted">
                                    {u.zi && u.luna && u.an ? formatBirthDate(u.zi, u.luna, u.an) : '—'}
                                </td>
                                <td>{u.scorTotal}</td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button type="button" className="admin-icon-btn" onClick={() => openEdit(u)}>
                                            {t('admin.users.edit')}
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-icon-btn danger"
                                            onClick={() => handleDelete(u)}
                                        >
                                            {t('admin.users.delete')}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <Modal title={editingId ? t('admin.users.modal_edit_title') : t('admin.users.modal_add_title')} onClose={close}>
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="u-nume">{t('admin.users.label_last_name')}</label>
                                <input
                                    id="u-nume"
                                    value={form.nume}
                                    onChange={(e) => setForm((f) => ({ ...f, nume: e.target.value }))}
                                />
                            </div>
                            <div className="admin-field">
                                <label htmlFor="u-prenume">{t('admin.users.label_first_name')}</label>
                                <input
                                    id="u-prenume"
                                    value={form.prenume}
                                    onChange={(e) => setForm((f) => ({ ...f, prenume: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="admin-field">
                            <label htmlFor="u-email">{t('admin.users.label_email')}</label>
                            <input
                                id="u-email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            />
                        </div>

                        {!editingId && (
                            <div className="admin-field">
                                <label htmlFor="u-parola">{t('admin.users.label_password')}</label>
                                <input
                                    id="u-parola"
                                    type="password"
                                    value={form.parola}
                                    onChange={(e) => setForm((f) => ({ ...f, parola: e.target.value }))}
                                />
                            </div>
                        )}

                        <div className="admin-field">
                            <label>{t('admin.users.label_birthdate')}</label>
                            <div className="admin-date-row">
                                <Dropdown
                                    value={form.zi}
                                    onChange={(v) => setForm((f) => ({ ...f, zi: v }))}
                                    options={ziledisponibile.map((d) => ({ value: String(d), label: String(d) }))}
                                    placeholder={t('admin.users.placeholder_day')}
                                />
                                <Dropdown
                                    value={form.luna}
                                    onChange={handleDateFieldChange('luna')}
                                    options={luni.map((nume, i) => ({ value: String(i + 1), label: nume }))}
                                    placeholder={t('admin.users.placeholder_month')}
                                />
                                <Dropdown
                                    value={form.an}
                                    onChange={handleDateFieldChange('an')}
                                    options={aniDisponibili.map((an) => ({ value: String(an), label: String(an) }))}
                                    placeholder={t('admin.users.placeholder_year')}
                                />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="u-rol">{t('admin.users.label_role')}</label>
                                <Dropdown
                                    value={form.rol}
                                    onChange={(v) => setForm((f) => ({ ...f, rol: v as UserRole }))}
                                    options={rolOptions}
                                    placeholder={t('admin.users.label_role')}
                                />
                            </div>
                            <div className="admin-field">
                                <label htmlFor="u-status">{t('admin.users.label_status')}</label>
                                <Dropdown
                                    value={form.status}
                                    onChange={(v) => setForm((f) => ({ ...f, status: v as UserStatus }))}
                                    options={statusOptions}
                                    placeholder={t('admin.users.label_status')}
                                />
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="u-scenarii">{t('admin.users.label_scenarios_completed')}</label>
                                <input
                                    id="u-scenarii"
                                    type="number"
                                    min={0}
                                    value={form.scenariiFinalizate}
                                    onChange={(e) => setForm((f) => ({ ...f, scenariiFinalizate: e.target.value }))}
                                />
                            </div>
                            <div className="admin-field">
                                <label htmlFor="u-scor">{t('admin.users.label_total_score')}</label>
                                <input
                                    id="u-scor"
                                    type="number"
                                    min={0}
                                    value={form.scorTotal}
                                    onChange={(e) => setForm((f) => ({ ...f, scorTotal: e.target.value }))}
                                />
                            </div>
                        </div>

                        {error && <span className="admin-form-error">{error}</span>}

                        <div className="admin-form-actions">
                            <button type="button" className="btn btn-ghost" onClick={close}>
                                {t('admin.users.cancel')}
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? t('admin.users.save') : t('admin.users.add_button')}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}

export default UsersSection
