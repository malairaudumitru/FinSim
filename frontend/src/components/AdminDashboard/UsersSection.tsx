import { useState, type FormEvent } from 'react'
import { useUsers, type AppUser, type UserRole, type UserStatus } from '../../shared/UsersContext/UsersContext'
import Modal from '../../shared/Modal/Modal'

type FormState = {
    nume: string
    prenume: string
    email: string
    rol: UserRole
    status: UserStatus
    scenariiFinalizate: string
    scorTotal: string
}

const emptyForm: FormState = {
    nume: '',
    prenume: '',
    email: '',
    rol: 'user',
    status: 'activ',
    scenariiFinalizate: '0',
    scorTotal: '0',
}

function toForm(u: AppUser): FormState {
    return {
        nume: u.nume,
        prenume: u.prenume,
        email: u.email,
        rol: u.rol,
        status: u.status,
        scenariiFinalizate: String(u.scenariiFinalizate),
        scorTotal: String(u.scorTotal),
    }
}

function UsersSection() {
    const { users, addUser, updateUser, deleteUser } = useUsers()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState<FormState>(emptyForm)
    const [error, setError] = useState('')

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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!form.nume.trim() || !form.prenume.trim() || !form.email.trim()) {
            setError('Numele, prenumele și email-ul sunt obligatorii.')
            return
        }
        const duplicate = users.find(
            (u) => u.email.toLowerCase() === form.email.trim().toLowerCase() && u.id !== editingId
        )
        if (duplicate) {
            setError('Există deja un utilizator cu acest email.')
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
        }

        if (editingId) {
            updateUser(editingId, payload)
        } else {
            addUser({ ...payload, dataInregistrare: new Date().toLocaleDateString('ro-RO') })
        }
        setShowForm(false)
    }

    const handleDelete = (u: AppUser) => {
        if (confirm(`Ștergi utilizatorul ${u.prenume} ${u.nume}?`)) {
            deleteUser(u.id)
        }
    }

    return (
        <div>
            <div className="admin-panel-header">
                <div>
                    <h2>Utilizatori</h2>
                    <p>Toate conturile înregistrate în FinSim — {users.length} în total.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openAdd}>
                    + Adaugă utilizator
                </button>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nume</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Status</th>
                            <th>Înregistrat</th>
                            <th>Scor</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={7}>Niciun utilizator momentan.</td>
                            </tr>
                        )}
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.prenume} {u.nume}</td>
                                <td className="admin-cell-muted">{u.email}</td>
                                <td>
                                    <span className={`admin-badge ${u.rol === 'admin' ? 'admin-badge-gold' : 'admin-badge-gray'}`}>
                                        {u.rol === 'admin' ? 'Admin' : 'Utilizator'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`admin-badge ${u.status === 'activ' ? 'admin-badge-green' : 'admin-badge-red'}`}>
                                        {u.status === 'activ' ? 'Activ' : 'Blocat'}
                                    </span>
                                </td>
                                <td className="admin-cell-muted">{u.dataInregistrare}</td>
                                <td>{u.scorTotal}</td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button type="button" className="admin-icon-btn" onClick={() => openEdit(u)}>
                                            Editează
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-icon-btn danger"
                                            onClick={() => handleDelete(u)}
                                        >
                                            Șterge
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <Modal title={editingId ? 'Editează utilizator' : 'Adaugă utilizator'} onClose={close}>
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="u-nume">Nume</label>
                                <input
                                    id="u-nume"
                                    value={form.nume}
                                    onChange={(e) => setForm((f) => ({ ...f, nume: e.target.value }))}
                                />
                            </div>
                            <div className="admin-field">
                                <label htmlFor="u-prenume">Prenume</label>
                                <input
                                    id="u-prenume"
                                    value={form.prenume}
                                    onChange={(e) => setForm((f) => ({ ...f, prenume: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="admin-field">
                            <label htmlFor="u-email">Email</label>
                            <input
                                id="u-email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            />
                        </div>

                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="u-rol">Rol</label>
                                <select
                                    id="u-rol"
                                    value={form.rol}
                                    onChange={(e) => setForm((f) => ({ ...f, rol: e.target.value as UserRole }))}
                                >
                                    <option value="user">Utilizator</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="admin-field">
                                <label htmlFor="u-status">Status</label>
                                <select
                                    id="u-status"
                                    value={form.status}
                                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as UserStatus }))}
                                >
                                    <option value="activ">Activ</option>
                                    <option value="blocat">Blocat</option>
                                </select>
                            </div>
                        </div>

                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="u-scenarii">Scenarii finalizate</label>
                                <input
                                    id="u-scenarii"
                                    type="number"
                                    min={0}
                                    value={form.scenariiFinalizate}
                                    onChange={(e) => setForm((f) => ({ ...f, scenariiFinalizate: e.target.value }))}
                                />
                            </div>
                            <div className="admin-field">
                                <label htmlFor="u-scor">Scor total</label>
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
                                Anulează
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Salvează' : 'Adaugă'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}

export default UsersSection
