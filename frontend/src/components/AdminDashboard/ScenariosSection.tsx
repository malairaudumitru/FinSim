import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useScenarios } from '../../shared/ScenariosContext/ScenariosContext'
import type { ScenarioDef, ScenarioStep } from '../../shared/scenarios/scenariosData'
import Modal from '../../shared/Modal/Modal'
import Dropdown from '../../shared/Dropdown/Dropdown'
import Checkbox from '../../shared/Checkbox/Checkbox'

const LOCALE_MAP: Record<string, string> = { ro: 'ro-RO', ru: 'ru-RU', en: 'en-US' }

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
    const { t, i18n } = useTranslation()
    const { scenarios, addScenario, updateScenario, deleteScenario } = useScenarios()
    const [editingSlug, setEditingSlug] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState<FormState>(emptyForm)
    const [error, setError] = useState('')

    const dificultateOptions = [
        { value: 'Ușor', label: t('admin.scenarios.difficulty_easy') },
        { value: 'Mediu', label: t('admin.scenarios.difficulty_medium') },
        { value: 'Avansat', label: t('admin.scenarios.difficulty_advanced') },
    ]

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
            setError(t('admin.scenarios.error_required'))
            return
        }

        let pasi: ScenarioStep[]
        try {
            const parsed = JSON.parse(form.pasiJson || '[]')
            if (!Array.isArray(parsed)) throw new Error('not array')
            pasi = parsed
        } catch {
            setError(t('admin.scenarios.error_invalid_json'))
            return
        }

        const slug = editingSlug ?? (form.slug.trim() ? slugify(form.slug) : slugify(form.nume))
        if (!editingSlug && scenarios.some((s) => s.slug === slug)) {
            setError(t('admin.scenarios.error_duplicate_slug'))
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
        if (confirm(t('admin.scenarios.confirm_delete', { name: s.nume }))) {
            deleteScenario(s.slug)
        }
    }

    return (
        <div>
            <div className="admin-panel-header">
                <div>
                    <h2>{t('admin.scenarios.title')}</h2>
                    <p>{t('admin.scenarios.subtitle', { count: scenarios.length })}</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openAdd}>
                    + {t('admin.scenarios.add_button')}
                </button>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('admin.scenarios.col_name')}</th>
                            <th>{t('admin.scenarios.col_difficulty')}</th>
                            <th>{t('admin.scenarios.col_initial_balance')}</th>
                            <th>{t('admin.scenarios.col_requires_account')}</th>
                            <th>{t('admin.scenarios.col_steps')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {scenarios.length === 0 && (
                            <tr className="admin-empty-row">
                                <td colSpan={6}>{t('admin.scenarios.empty')}</td>
                            </tr>
                        )}
                        {scenarios.map((s) => (
                            <tr key={s.slug}>
                                <td>{s.nume}</td>
                                <td><span className="admin-badge admin-badge-gray admin-badge-wide">{s.dificultate}</span></td>
                                <td>{s.soldInitial.toLocaleString(LOCALE_MAP[i18n.language] ?? 'ro-RO')} lei</td>
                                <td className="admin-cell-muted">{s.necesitaCont ? t('admin.scenarios.yes') : t('admin.scenarios.no')}</td>
                                <td className="admin-cell-muted">{s.pasi.length}</td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button type="button" className="admin-icon-btn" onClick={() => openEdit(s)}>
                                            {t('admin.scenarios.edit')}
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-icon-btn danger"
                                            onClick={() => handleDelete(s)}
                                        >
                                            {t('admin.scenarios.delete')}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <Modal title={editingSlug ? t('admin.scenarios.modal_edit_title') : t('admin.scenarios.modal_add_title')} onClose={close}>
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="sc-nume">{t('admin.scenarios.label_name')}</label>
                                <input
                                    id="sc-nume"
                                    value={form.nume}
                                    onChange={(e) => setForm((f) => ({ ...f, nume: e.target.value }))}
                                />
                            </div>
                            <div className="admin-field">
                                <label htmlFor="sc-dificultate">{t('admin.scenarios.label_difficulty')}</label>
                                <Dropdown
                                    value={form.dificultate}
                                    onChange={(v) => setForm((f) => ({ ...f, dificultate: v }))}
                                    options={dificultateOptions}
                                    placeholder={t('admin.scenarios.label_difficulty')}
                                />
                            </div>
                        </div>

                        {!editingSlug && (
                            <div className="admin-field">
                                <label htmlFor="sc-slug">{t('admin.scenarios.label_slug')}</label>
                                <input
                                    id="sc-slug"
                                    value={form.slug}
                                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                                    placeholder={t('admin.scenarios.placeholder_slug')}
                                />
                            </div>
                        )}

                        <div className="admin-field">
                            <label htmlFor="sc-descriere">{t('admin.scenarios.label_description')}</label>
                            <textarea
                                id="sc-descriere"
                                value={form.descriere}
                                onChange={(e) => setForm((f) => ({ ...f, descriere: e.target.value }))}
                                style={{ fontFamily: 'var(--sans)', minHeight: 80 }}
                            />
                        </div>

                        <div className="admin-form-row">
                            <div className="admin-field">
                                <label htmlFor="sc-sold">{t('admin.scenarios.label_initial_balance')}</label>
                                <input
                                    id="sc-sold"
                                    type="number"
                                    value={form.soldInitial}
                                    onChange={(e) => setForm((f) => ({ ...f, soldInitial: e.target.value }))}
                                />
                            </div>
                            <div className="admin-field">
                                <label htmlFor="sc-scorcredit">{t('admin.scenarios.label_initial_credit_score')}</label>
                                <input
                                    id="sc-scorcredit"
                                    type="number"
                                    value={form.scorCreditInitial}
                                    onChange={(e) => setForm((f) => ({ ...f, scorCreditInitial: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="admin-field admin-checkbox-field">
                            <Checkbox
                                id="sc-cont"
                                checked={form.necesitaCont}
                                onChange={(v) => setForm((f) => ({ ...f, necesitaCont: v }))}
                                label={t('admin.scenarios.label_requires_account')}
                            />
                        </div>

                        <div className="admin-field">
                            <label htmlFor="sc-pasi">{t('admin.scenarios.label_steps_json')}</label>
                            <textarea
                                id="sc-pasi"
                                value={form.pasiJson}
                                onChange={(e) => setForm((f) => ({ ...f, pasiJson: e.target.value }))}
                            />
                            <span className="admin-form-hint">
                                {t('admin.scenarios.hint_steps_json')}
                            </span>
                        </div>

                        {error && <span className="admin-form-error">{error}</span>}

                        <div className="admin-form-actions">
                            <button type="button" className="btn btn-ghost" onClick={close}>
                                {t('admin.scenarios.cancel')}
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {editingSlug ? t('admin.scenarios.save') : t('admin.scenarios.add_button')}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}

export default ScenariosSection
