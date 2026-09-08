import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../shared/AuthContext/AuthContext'
import { useScenarioHistory } from '../../shared/ScenarioHistoryContext/ScenarioHistoryContext'
import { useReviews } from '../../shared/ReviewsContext/ReviewsContext'
import { scenarios } from '../../shared/scenarios/scenariosData'
import {
    isValidBirthDate,
    calculateAge,
    formatBirthDate,
    daysInMonth,
    LUNI,
    VARSTA_MINIMA,
    VARSTA_MAXIMA,
} from '../../shared/birthDate/birthDate'
import AnimatedNumber from '../../shared/AnimatedNumber/AnimatedNumber'
import StarRating from '../../shared/StarRating/StarRating'
import Dropdown from '../../shared/Dropdown/Dropdown'
import './ProfilePage.css'

interface UserInfo {
    nume: string
    prenume: string
    email: string
    dataInregistrare: string
    zi: number
    luna: number
    an: number
}

const initialUser: UserInfo = {
    nume: 'Popescu',
    prenume: 'Ion',
    email: 'ion.popescu@exemplu.com',
    dataInregistrare: '15 august 2026',
    zi: 15,
    luna: 6,
    an: 2000,
}

const stats = [
    { value: '742', label: 'scor general' },
    { value: '5', label: 'scenarii finalizate' },
    { value: '87%', label: 'progres mediu' },
    { value: '3', label: 'zile consecutive' },
]

function scoreClass(scor: number) {
    if (scor >= 70) return 'positive'
    if (scor < 50) return 'negative'
    return ''
}

function slugForScenario(nume: string) {
    return scenarios.find((s) => s.nume === nume)?.slug
}

type NameField = 'nume' | 'prenume' | 'zi' | 'luna' | 'an'

interface PasswordForm {
    parolaCurenta: string
    parolaNoua: string
    confirmaParolaNoua: string
}

const initialPasswordForm: PasswordForm = {
    parolaCurenta: '',
    parolaNoua: '',
    confirmaParolaNoua: '',
}

interface ReviewForm {
    rating: number
    mesaj: string
}

const initialReviewForm: ReviewForm = {
    rating: 0,
    mesaj: '',
}

function EyeIcon({ open }: { open: boolean }) {
    if (open) {
        return (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        )
    }
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 3l18 18" />
            <path d="M10.6 5.2C11.05 5.07 11.52 5 12 5c6.5 0 10 7 10 7a17.9 17.9 0 0 1-3.06 4.06M6.6 6.6C4.02 8.28 2 12 2 12s3.5 7 10 7c1.36 0 2.6-.3 3.7-.8" />
            <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </svg>
    )
}

function ProfilePage() {
    const { user: authUser, logout } = useAuth()
    const { history } = useScenarioHistory()
    const { reviews, addReview } = useReviews()
    const navigate = useNavigate()

    const [user, setUser] = useState<UserInfo>(() => ({
        ...initialUser,
        ...(authUser?.email ? { email: authUser.email } : {}),
        ...(authUser?.nume ? { nume: authUser.nume } : {}),
        ...(authUser?.prenume ? { prenume: authUser.prenume } : {}),
        ...(authUser?.zi ? { zi: authUser.zi } : {}),
        ...(authUser?.luna ? { luna: authUser.luna } : {}),
        ...(authUser?.an ? { an: authUser.an } : {}),
    }))

    const REVIEW_COOLDOWN_DAYS = 30
    const [now] = useState(() => Date.now())
    const lastUserReview = reviews
        .filter((r) => r.email === user.email)
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0]

    const daysUntilNextReview = (() => {
        if (!lastUserReview) return 0
        const diffMs = now - new Date(lastUserReview.data).getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        return Math.max(0, REVIEW_COOLDOWN_DAYS - diffDays)
    })()

    const anCurent = new Date().getFullYear()
    const aniDisponibili = Array.from(
        { length: VARSTA_MAXIMA - VARSTA_MINIMA + 1 },
        (_, i) => anCurent - VARSTA_MINIMA - i
    )

    const [isEditingInfo, setIsEditingInfo] = useState(false)
    const [nameForm, setNameForm] = useState<Record<NameField, string>>({
        nume: user.nume,
        prenume: user.prenume,
        zi: String(user.zi),
        luna: String(user.luna),
        an: String(user.an),
    })
    const maxZile = daysInMonth(Number(nameForm.luna) || undefined, Number(nameForm.an) || undefined)
    const ziledisponibile = Array.from({ length: maxZile }, (_, i) => i + 1)
    const [nameErrors, setNameErrors] = useState<Partial<Record<NameField, string>>>({})
    const [infoSaved, setInfoSaved] = useState(false)

    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [passwordForm, setPasswordForm] = useState<PasswordForm>(initialPasswordForm)
    const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof PasswordForm, string>>>({})
    const [showPassword, setShowPassword] = useState(false)
    const [passwordSaved, setPasswordSaved] = useState(false)

    const [reviewForm, setReviewForm] = useState<ReviewForm>(initialReviewForm)
    const [reviewError, setReviewError] = useState('')
    const [reviewSubmitted, setReviewSubmitted] = useState(false)

    const initials = isEditingInfo
        ? `${nameForm.prenume[0] ?? ''}${nameForm.nume[0] ?? ''}`
        : `${user.prenume[0]}${user.nume[0]}`

    const handleNameChange = (field: 'nume' | 'prenume') => (e: ChangeEvent<HTMLInputElement>) => {
        setNameForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

    const handleZiChange = (value: string) => {
        setNameForm((prev) => ({ ...prev, zi: value }))
    }

    const handleEditDateFieldChange = (field: 'luna' | 'an') => (value: string) => {
        setNameForm((prev) => {
            const next = { ...prev, [field]: value }
            const maxDays = daysInMonth(Number(next.luna) || undefined, Number(next.an) || undefined)
            if (Number(next.zi) > maxDays) {
                next.zi = ''
            }
            return next
        })
    }

    const startEditingInfo = () => {
        setNameForm({
            nume: user.nume,
            prenume: user.prenume,
            zi: String(user.zi),
            luna: String(user.luna),
            an: String(user.an),
        })
        setNameErrors({})
        setInfoSaved(false)
        setIsEditingInfo(true)
    }

    const cancelEditingInfo = () => {
        setIsEditingInfo(false)
        setNameErrors({})
    }

    const validateName = (): boolean => {
        const newErrors: Partial<Record<NameField, string>> = {}

        if (!nameForm.nume.trim()) newErrors.nume = 'Numele este obligatoriu.'
        if (!nameForm.prenume.trim()) newErrors.prenume = 'Prenumele este obligatoriu.'

        const zi = Number(nameForm.zi)
        const luna = Number(nameForm.luna)
        const an = Number(nameForm.an)

        if (!nameForm.zi || !nameForm.luna || !nameForm.an) {
            newErrors.zi = 'Data nașterii este obligatorie.'
        } else if (zi < 1 || zi > 31) {
            newErrors.zi = 'Ziua trebuie să fie între 1 și 31.'
        } else if (luna < 1 || luna > 12) {
            newErrors.luna = 'Luna trebuie să fie între 1 și 12.'
        } else if (an < anCurent - VARSTA_MAXIMA || an > anCurent - VARSTA_MINIMA) {
            newErrors.an = 'Introdu un an de naștere valid.'
        } else if (!isValidBirthDate(zi, luna, an)) {
            newErrors.zi = 'Data introdusă nu este validă.'
        }

        setNameErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSaveInfo = (e: FormEvent) => {
        e.preventDefault()

        if (!validateName()) return

        setUser((prev) => ({
            ...prev,
            nume: nameForm.nume,
            prenume: nameForm.prenume,
            zi: Number(nameForm.zi),
            luna: Number(nameForm.luna),
            an: Number(nameForm.an),
        }))
        setIsEditingInfo(false)
        setInfoSaved(true)
    }

    const handlePasswordChange = (field: keyof PasswordForm) => (e: ChangeEvent<HTMLInputElement>) => {
        setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

    const startChangingPassword = () => {
        setPasswordForm(initialPasswordForm)
        setPasswordErrors({})
        setPasswordSaved(false)
        setIsChangingPassword(true)
    }

    const cancelChangingPassword = () => {
        setIsChangingPassword(false)
        setPasswordErrors({})
    }

    const validatePassword = (): boolean => {
        const newErrors: Partial<Record<keyof PasswordForm, string>> = {}

        if (!passwordForm.parolaCurenta) {
            newErrors.parolaCurenta = 'Introdu parola curentă.'
        }

        if (!passwordForm.parolaNoua) {
            newErrors.parolaNoua = 'Parola nouă este obligatorie.'
        } else if (passwordForm.parolaNoua.length < 8) {
            newErrors.parolaNoua = 'Parola trebuie să aibă cel puțin 8 caractere.'
        }

        if (passwordForm.confirmaParolaNoua !== passwordForm.parolaNoua) {
            newErrors.confirmaParolaNoua = 'Parolele nu coincid.'
        }

        setPasswordErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSavePassword = (e: FormEvent) => {
        e.preventDefault()

        if (!validatePassword()) return

        setIsChangingPassword(false)
        setPasswordSaved(true)
    }

    const handleReviewSubmit = (e: FormEvent) => {
        e.preventDefault()

        if (reviewForm.rating === 0) {
            setReviewError('Alege un rating de la 1 la 5 stele.')
            return
        }
        if (reviewForm.mesaj.trim().length < 25) {
            setReviewError('Mesajul trebuie să aibă cel puțin 25 de caractere.')
            return
        }

        setReviewError('')
        addReview({
            autor: `${user.prenume}, ${calculateAge(user.zi, user.luna, user.an)} ani`,
            email: user.email,
            data: new Date().toISOString(),
            rating: reviewForm.rating,
            mesaj: reviewForm.mesaj.trim(),
        })
        setReviewForm(initialReviewForm)
        setReviewSubmitted(true)
    }

    return (
        <div className="profile-page">
            <section className="profile-hero">
                <div className="container profile-header">
                    <div className="profile-avatar">{initials}</div>

                    {isEditingInfo ? (
                        <form className="profile-edit-form" onSubmit={handleSaveInfo}>
                            <div className="profile-edit-row">
                                <div className="form-field">
                                    <label htmlFor="prenume">Prenume</label>
                                    <input
                                        id="prenume"
                                        type="text"
                                        value={nameForm.prenume}
                                        onChange={handleNameChange('prenume')}
                                    />
                                    {nameErrors.prenume && <span className="field-error">{nameErrors.prenume}</span>}
                                </div>
                                <div className="form-field">
                                    <label htmlFor="nume">Nume</label>
                                    <input
                                        id="nume"
                                        type="text"
                                        value={nameForm.nume}
                                        onChange={handleNameChange('nume')}
                                    />
                                    {nameErrors.nume && <span className="field-error">{nameErrors.nume}</span>}
                                </div>
                            </div>

                            <div className="form-field">
                                <label>Data nașterii</label>
                                <div className="profile-edit-row">
                                    <Dropdown
                                        value={nameForm.zi}
                                        onChange={handleZiChange}
                                        options={ziledisponibile.map((d) => ({ value: String(d), label: String(d) }))}
                                        placeholder="Ziua"
                                    />
                                    <Dropdown
                                        value={nameForm.luna}
                                        onChange={handleEditDateFieldChange('luna')}
                                        options={LUNI.map((nume, i) => ({ value: String(i + 1), label: nume }))}
                                        placeholder="Luna"
                                    />
                                    <Dropdown
                                        value={nameForm.an}
                                        onChange={handleEditDateFieldChange('an')}
                                        options={aniDisponibili.map((an) => ({ value: String(an), label: String(an) }))}
                                        placeholder="Anul"
                                    />
                                </div>
                                {(nameErrors.zi || nameErrors.luna || nameErrors.an) && (
                                    <span className="field-error">
                                        {nameErrors.zi || nameErrors.luna || nameErrors.an}
                                    </span>
                                )}
                            </div>

                            <p className="profile-email-static">{user.email}</p>
                            <div className="profile-edit-actions">
                                <button type="button" className="btn btn-ghost" onClick={cancelEditingInfo}>
                                    Anulează
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Salvează
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="profile-info">
                                <h1>
                                    {user.prenume} {user.nume}
                                </h1>
                                <p>{user.email}</p>
                                <span className="profile-birthdate">
                                    {formatBirthDate(user.zi, user.luna, user.an)} (
                                    {calculateAge(user.zi, user.luna, user.an)} ani)
                                </span>
                                <span className="profile-since">Membru din {user.dataInregistrare}</span>
                                {infoSaved && <span className="profile-saved">Profil actualizat.</span>}
                            </div>
                            <div className="profile-actions">
                                <button type="button" className="btn btn-ghost" onClick={startEditingInfo}>
                                    Editează profilul
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-danger"
                                    onClick={() => {
                                        logout()
                                        navigate({ to: '/' })
                                    }}
                                >
                                    Deconectare
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>

            <section className="profile-stats">
                <div className="container profile-stats-inner">
                    {stats.map((s) => (
                        <div className="stat" key={s.label}>
                            <span className="stat-value">
                                <AnimatedNumber value={s.value} />
                            </span>
                            <span className="stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>
                <div className="container profile-leaderboard-link">
                    <Link to="/leaderboard">Vezi clasamentul utilizatorilor →</Link>
                </div>
            </section>

            <section className="profile-secondary">
                <div className="container profile-secondary-grid">
                    <div className="profile-secondary-col">
                        <div className="section-heading">
                            <h2>Securitate cont</h2>
                            <p className="section-subtitle">Schimbă parola contului tău.</p>
                        </div>

                        {isChangingPassword ? (
                            <form className="password-form" onSubmit={handleSavePassword} noValidate>
                                <div className="form-field">
                                    <label htmlFor="parolaCurenta">Parola curentă</label>
                                    <div className="password-input">
                                        <input
                                            id="parolaCurenta"
                                            type={showPassword ? 'text' : 'password'}
                                            value={passwordForm.parolaCurenta}
                                            onChange={handlePasswordChange('parolaCurenta')}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? 'Ascunde parola' : 'Arată parola'}
                                        >
                                            <EyeIcon open={showPassword} />
                                        </button>
                                    </div>
                                    {passwordErrors.parolaCurenta && (
                                        <span className="field-error">{passwordErrors.parolaCurenta}</span>
                                    )}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="parolaNoua">Parolă nouă</label>
                                    <input
                                        id="parolaNoua"
                                        type={showPassword ? 'text' : 'password'}
                                        value={passwordForm.parolaNoua}
                                        onChange={handlePasswordChange('parolaNoua')}
                                    />
                                    {passwordErrors.parolaNoua && (
                                        <span className="field-error">{passwordErrors.parolaNoua}</span>
                                    )}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="confirmaParolaNoua">Confirmă parola nouă</label>
                                    <input
                                        id="confirmaParolaNoua"
                                        type={showPassword ? 'text' : 'password'}
                                        value={passwordForm.confirmaParolaNoua}
                                        onChange={handlePasswordChange('confirmaParolaNoua')}
                                    />
                                    {passwordErrors.confirmaParolaNoua && (
                                        <span className="field-error">{passwordErrors.confirmaParolaNoua}</span>
                                    )}
                                </div>

                                <div className="profile-edit-actions">
                                    <button type="button" className="btn btn-ghost" onClick={cancelChangingPassword}>
                                        Anulează
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Salvează parola
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="password-summary">
                                <div>
                                    <span className="password-dots">••••••••</span>
                                    {passwordSaved && <span className="profile-saved">Parola a fost schimbată.</span>}
                                </div>
                                <button type="button" className="btn btn-ghost" onClick={startChangingPassword}>
                                    Schimbă parola
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="profile-secondary-col">
                        <div className="section-heading">
                            <h2>Lasă o recenzie</h2>
                            <p className="section-subtitle">Spune-ne ce părere ai despre FinSim.</p>
                        </div>

                        {reviewSubmitted ? (
                            <div className="profile-saved">
                                Mulțumim pentru recenzie! Poți lăsa următoarea peste {REVIEW_COOLDOWN_DAYS} de zile.
                            </div>
                        ) : daysUntilNextReview > 0 ? (
                            <div className="review-cooldown">
                                Ai lăsat deja o recenzie. Poți lăsa următoarea peste {daysUntilNextReview}{' '}
                                {daysUntilNextReview === 1 ? 'zi' : 'zile'}.
                            </div>
                        ) : (
                            <form className="review-form" onSubmit={handleReviewSubmit} noValidate>
                                <div className="form-field">
                                    <label>Rating</label>
                                    <StarRating
                                        rating={reviewForm.rating}
                                        onChange={(rating) => setReviewForm((prev) => ({ ...prev, rating }))}
                                        size={44}
                                    />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="review-mesaj">Mesajul tău</label>
                                    <textarea
                                        id="review-mesaj"
                                        rows={4}
                                        value={reviewForm.mesaj}
                                        onChange={(e) =>
                                            setReviewForm((prev) => ({ ...prev, mesaj: e.target.value }))
                                        }
                                        placeholder="Ce ți-a plăcut, ce ai îmbunătăți... (minim 25 caractere)"
                                    />
                                </div>
                                {reviewError && <span className="field-error">{reviewError}</span>}
                                <button type="submit" className="btn btn-primary">
                                    Trimite recenzia
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <section className="profile-history">
                <div className="container">
                    <div className="section-heading">
                        <h2>Istoricul simulărilor</h2>
                        <p className="section-subtitle">
                            Scenariile pe care le-ai jucat până acum și scorul obținut.
                        </p>
                    </div>

                    <div className="history-list">
                        {history.map((entry) => {
                            const slug = slugForScenario(entry.scenariu)
                            return (
                                <div className="history-row" key={entry.id}>
                                    <div className="history-info">
                                        <h3>{entry.scenariu}</h3>
                                        <span className="history-date">{entry.data}</span>
                                    </div>
                                    <span className={`figure history-score ${scoreClass(entry.scor)}`}>
                                        {entry.scor}/100
                                    </span>
                                    {slug ? (
                                        <Link
                                            to="/scenarios/$slug"
                                            params={{ slug }}
                                            className="btn btn-link"
                                        >
                                            Rejoacă →
                                        </Link>
                                    ) : (
                                        <span className="history-unavailable">indisponibil</span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ProfilePage