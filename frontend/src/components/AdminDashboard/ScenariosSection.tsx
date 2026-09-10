import { useState, type FormEvent } from 'react'
import { useScenarios } from '../../shared/ScenariosContext/ScenariosContext'
import type { ScenarioDef, ScenarioStep } from '../../shared/scenarios/scenariosData'
import Modal from '../../shared/Modal/Modal'

type FormState = {
    slug: string
    nume: string
    descriere: string
    dificultate: string
    soldInitial: string
    necesitaCont: boolean
    scorCreditInitial: string
    pasiJson: string
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

const emptyForm: FormState = {
    slug: '',
    nume: '',
    descriere: '',
    dificultate: 'Ușor',
    soldInitial: '5000',
    necesitaCont: false,
    scorCreditInitial: '',
    pasiJson: '[]',
}

function toForm(s: ScenarioDef): FormState {
    return {
        slug: s.slug,
        nume: s.nume,
        descriere: s.descriere,
        dificultate: s.dificultate,
        soldInitial: String(s.soldInitial),
        necesitaCont: s.necesitaCont,
        scorCreditInitial: s.scorCreditInitial !== undefined ? String(s.scorCreditInitial) : '',
        pasiJson: JSON.stringify(s.pasi, null, 2),
    }
}

function ScenariosSection() {
    const { scenarios, addScenario, updateScenario, deleteScenario } = useScenarios()
    const [editingSlug, setEditingSlug] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState<FormState>(emptyForm)
    const [error, setError] = useState('')

    const openAdd = () => {
        setEditingSlug(null)
        setForm(emptyForm)
        setError('')
        setShowForm(true)
    }

    const openEdit = (s: ScenarioDef) => {
        setEditingSlug(s.slug)
        setForm(toForm(s))
        setError('')
        setShowForm(true)
    }

    const close = () => setShowForm(false)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!form.nume.trim() || !form.descriere.trim()) {
            setError('Numele și descrierea sunt obligatorii.')
            return
        }

        let pasi: ScenarioStep[]
        try {
            const parsed = JSON.parse(form.pasiJson || '[]')
            if (!Array.isArray(parsed)) throw new Error('not array')
            pasi = parsed
        } catch {
            setError('Pașii scenariului trebuie să fie un JSON valid (o listă).')
            return
        }

        const slug = editingSlug ?? (form.slug.trim() ? slugify(form.slug) : slugify(form.nume))
        if (!editingSlug && scenarios.some((s) => s.slug === slug)) {
            setError('Există deja un scenariu cu acest identificator (slug).')
            return
        }

        const payload: ScenarioDef = {
            slug,
            nume: form.nume.trim(),
            descriere: form.descriere.trim(),
            dificultate: form.dificultate.trim() || 'Ușor',
            soldInitial: Number(form.soldInitial) || 0,
            necesitaCont: form.necesitaCont,
            scorCreditInitial: form.scorCreditInitial.trim() ? Number(form.scorCreditInitial) : undefined,
            pasi,
        }

        if (editingSlug) {
            updateScenario(editingSlug, payload)
        } else {
            addScenario(payload)
        }
        setShowForm(false)
    }

    const handleDelete = (s: ScenarioDef) => {
        if (confirm(`Ștergi scenariul „${s.nume}"? Această acțiune nu poate fi anulată.`)) {
            deleteScenario(s.slug)
        }
    }

    return (
        <div>
            <div className="admin-panel-header">
                <div>
                    <h2>Scenarii</h2>
                    <p>Scenariile de simulare disponibile în aplicație — {scenarios.length} în total.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openAdd}>
                    + Adaugă scenariu
                </button>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nume</th>
                            <th>Dificultate</th>
                            <th>Sold inițial</th>
                            <th>Necesită cont</th>
                            <th>Pași</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {scenarios.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={6}>Niciun scenariu momentan.</td>
                            </tr>
                        )}
                        {scenarios.map((s) => (
                            <tr key={s.slug}>
                                <td>{s.nume}</td>
                                <td><span className="admin-badge admin-badge-gray">{s.dificultate}</span></td>
                                <td>{s.soldInitial.toLocaleString('ro-RO')} lei</td>
                                <td className="admin-cell-muted">{s.necesitaCont ? 'Da' : 'Nu'}</td>
                                <td className="admin-cell-muted">{s.pasi.length}</td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button type="button" className="admin-icon-btn" onClick={() => openEdit(s)}>
                                            Editează
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-icon-btn danger"
                                            onClick={() => handleDelete(s)}
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
                <Modal title={editingSlug ? 'Editează scenariul' : 'Adaugă scenariu'} onClose={close}>
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="sc-nume">Nume</label>
                                <input
                                    id="sc-nume"
                                    value={form.nume}
                                    onChange={(e) => setForm((f) => ({ ...f, nume: e.target.value }))}
                                />
                            </div>
                            <div className="admin-field">
                                <label htmlFor="sc-dificultate">Dificultate</label>
                                <select
                                    id="sc-dificultate"
                                    value={form.dificultate}
                                    onChange={(e) => setForm((f) => ({ ...f, dificultate: e.target.value }))}
                                >
                                    <option value="Ușor">Ușor</option>
                                    <option value="Mediu">Mediu</option>
                                    <option value="Avansat">Avansat</option>
                                </select>
                            </div>
                        </div>

                        {!editingSlug && (
                            <div className="admin-field">
                                <label htmlFor="sc-slug">Identificator (slug, opțional)</label>
                                <input
                                    id="sc-slug"
                                    value={form.slug}
                                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                                    placeholder="se generează automat din nume dacă îl lași gol"
                                />
                            </div>
                        )}

                        <div className="admin-field">
                            <label htmlFor="sc-descriere">Descriere</label>
                            <textarea
                                id="sc-descriere"
                                value={form.descriere}
                                onChange={(e) => setForm((f) => ({ ...f, descriere: e.target.value }))}
                                style={{ fontFamily: 'var(--sans)', minHeight: 80 }}
                            />
                        </div>

                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="sc-sold">Sold inițial (lei)</label>
                                <input
                                    id="sc-sold"
                                    type="number"
                                    value={form.soldInitial}
                                    onChange={(e) => setForm((f) => ({ ...f, soldInitial: e.target.value }))}
                                />
                            </div>
                            <div className="admin-field">
                                <label htmlFor="sc-scorcredit">Scor credit inițial (opțional)</label>
                                <input
                                    id="sc-scorcredit"
                                    type="number"
                                    value={form.scorCreditInitial}
                                    onChange={(e) => setForm((f) => ({ ...f, scorCreditInitial: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="admin-field admin-checkbox-field">
                            <input
                                id="sc-cont"
                                type="checkbox"
                                checked={form.necesitaCont}
                                onChange={(e) => setForm((f) => ({ ...f, necesitaCont: e.target.checked }))}
                            />
                            <label htmlFor="sc-cont">Necesită cont autentificat</label>
                        </div>

                        <div className="admin-field">
                            <label htmlFor="sc-pasi">Pașii scenariului (JSON avansat)</label>
                            <textarea
                                id="sc-pasi"
                                value={form.pasiJson}
                                onChange={(e) => setForm((f) => ({ ...f, pasiJson: e.target.value }))}
                            />
                            <span className="admin-form-hint">
                                Structura completă a pașilor (întrebări, opțiuni, punctaje). Editează cu atenție — trebuie să rămână un JSON valid.
                            </span>
                        </div>

                        {error && <span className="admin-form-error">{error}</span>}

                        <div className="admin-form-actions">
                            <button type="button" className="btn btn-ghost" onClick={close}>
                                Anulează
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {editingSlug ? 'Salvează' : 'Adaugă'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}

export default ScenariosSection
