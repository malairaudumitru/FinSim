import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../shared/AuthContext/AuthContext'
import { useScenarioHistory } from '../../shared/ScenarioHistoryContext/ScenarioHistoryContext'
import { useReviews } from '../../shared/ReviewsContext/ReviewsContext'
import { useErrorModal } from '../../shared/ErrorModalContext/ErrorModalContext'
import { scenarios } from '../../shared/scenarios/scenariosData'
import * as authApi from '../../api/authApi'
import { normalizeApiError } from '../../api/apiClient'
import {
    isValidBirthDate,
    calculateAge,
    formatBirthDate,
    daysInMonth,
    VARSTA_MINIMA,
    VARSTA_MAXIMA,
} from '../../shared/birthDate/birthDate'
import AnimatedNumber from '../../shared/AnimatedNumber/AnimatedNumber'
import StarRating from '../../shared/StarRating/StarRating'
import Dropdown from '../../shared/Dropdown/Dropdown'
import { useRateLimit } from '../../shared/useRateLimit/useRateLimit'
import { useResendCountdown } from '../../shared/useResendCountdown/useResendCountdown'
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

function parseDateRo(dataRo: string): Date {
    const [zi, luna, an] = dataRo.split('.').map(Number)
    return new Date(an, luna - 1, zi)
}

function computeStreakDays(history: { data: string }[]): number {
    if (history.length === 0) return 0
    const uniqueDays = Array.from(
        new Set(history.map((h) => parseDateRo(h.data).toDateString())),
    )
        .map((d) => new Date(d))
        .sort((a, b) => b.getTime() - a.getTime())

    const oneDay = 24 * 60 * 60 * 1000
    const today = new Date(new Date().toDateString())
    const mostRecent = uniqueDays[0]
    if (Math.round((today.getTime() - mostRecent.getTime()) / oneDay) > 1) return 0

    let streak = 1
    for (let i = 1; i < uniqueDays.length; i++) {
        const diff = Math.round((uniqueDays[i - 1].getTime() - uniqueDays[i].getTime()) / oneDay)
        if (diff === 1) streak++
        else break
    }
    return streak
}

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
    const { t } = useTranslation()
    const { user: authUser, logout } = useAuth()
    const { history } = useScenarioHistory()
    const { reviews, addReview } = useReviews()
    const { showError } = useErrorModal()
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

    const stats = useMemo(() => {
        const scorGeneral = history.reduce((sum, h) => sum + h.scor, 0)
        const progresMediu = history.length
            ? Math.round(history.reduce((sum, h) => sum + h.scor, 0) / history.length)
            : 0
        return [
            { value: String(scorGeneral), labelKey: 'profile.stat_general_score' },
            { value: String(history.length), labelKey: 'profile.stat_completed_scenarios' },
            { value: `${progresMediu}%`, labelKey: 'profile.stat_average_progress' },
            { value: String(computeStreakDays(history)), labelKey: 'profile.stat_streak_days' },
        ]
    }, [history])

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
    const luni = t('common.months', { returnObjects: true }) as string[]
    const [nameErrors, setNameErrors] = useState<Partial<Record<NameField, string>>>({})
    const [infoSaved, setInfoSaved] = useState(false)

    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [passwordForm, setPasswordForm] = useState<PasswordForm>(initialPasswordForm)
    const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof PasswordForm, string>>>({})
    const [showPassword, setShowPassword] = useState(false)
    const [passwordSaved, setPasswordSaved] = useState(false)
    const passwordRateLimit = useRateLimit()
    const [passwordStep, setPasswordStep] = useState<'form' | 'code'>('form')
    const [confirmCode, setConfirmCode] = useState('')
    const [confirmCodeError, setConfirmCodeError] = useState('')
    const { secondsLeft: resendSecondsLeft, canResend, restart: restartResend } = useResendCountdown()

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

        if (!nameForm.nume.trim()) newErrors.nume = t('profile.error_nume_required')
        if (!nameForm.prenume.trim()) newErrors.prenume = t('profile.error_prenume_required')

        const zi = Number(nameForm.zi)
        const luna = Number(nameForm.luna)
        const an = Number(nameForm.an)

        if (!nameForm.zi || !nameForm.luna || !nameForm.an) {
            newErrors.zi = t('profile.error_birthdate_required')
        } else if (zi < 1 || zi > 31) {
            newErrors.zi = t('profile.error_day_range')
        } else if (luna < 1 || luna > 12) {
            newErrors.luna = t('profile.error_month_range')
        } else if (an < anCurent - VARSTA_MAXIMA || an > anCurent - VARSTA_MINIMA) {
            newErrors.an = t('profile.error_year_invalid')
        } else if (!isValidBirthDate(zi, luna, an)) {
            newErrors.zi = t('profile.error_date_invalid')
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

    useEffect(() => {
        if (passwordStep === 'code') {
            restartResend()
        }
    }, [passwordStep, restartResend])

    const handleResendCode = async () => {
        if (!canResend) return
        try {
            await authApi.changePasswordStart(passwordForm.parolaCurenta, passwordForm.parolaNoua)
            restartResend()
        } catch (err) {
            const normalized = normalizeApiError(err)
            if (normalized.kind === 'server' && normalized.errorKey && normalized.errorId) {
                showError(normalized.errorKey, normalized.errorId)
            } else if (normalized.status === 429) {
                setConfirmCodeError(t('auth.error_too_many_requests'))
            } else if (normalized.kind === 'network') {
                setConfirmCodeError(t('auth.error_network'))
            } else {
                setConfirmCodeError(normalized.message ?? t('auth.error_resend_generic'))
            }
        }
    }

    const startChangingPassword = () => {
        setPasswordForm(initialPasswordForm)
        setPasswordErrors({})
        setPasswordSaved(false)
        setPasswordStep('form')
        setConfirmCode('')
        setConfirmCodeError('')
        setIsChangingPassword(true)
    }

    const cancelChangingPassword = () => {
        setIsChangingPassword(false)
        setPasswordErrors({})
        setPasswordStep('form')
        setConfirmCode('')
        setConfirmCodeError('')
    }

    const validateConfirmCode = (): boolean => {
        if (!/^\d{6}$/.test(confirmCode)) {
            setConfirmCodeError(t('profile.error_confirm_code_invalid'))
            return false
        }
        setConfirmCodeError('')
        return true
    }

    const validatePassword = (): boolean => {
        const newErrors: Partial<Record<keyof PasswordForm, string>> = {}

        if (!passwordForm.parolaCurenta) {
            newErrors.parolaCurenta = t('profile.error_current_password_required')
        }

        if (!passwordForm.parolaNoua) {
            newErrors.parolaNoua = t('profile.error_new_password_required')
        } else if (passwordForm.parolaNoua.length < 8) {
            newErrors.parolaNoua = t('profile.error_new_password_length')
        }

        if (passwordForm.confirmaParolaNoua !== passwordForm.parolaNoua) {
            newErrors.confirmaParolaNoua = t('profile.error_passwords_mismatch')
        }

        setPasswordErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSavePassword = async (e: FormEvent) => {
        e.preventDefault()

        if (passwordStep === 'form') {
            if (passwordRateLimit.isLimited) return
            if (!passwordRateLimit.registerAttempt()) return

            if (!validatePassword()) return

            try {
                await authApi.changePasswordStart(passwordForm.parolaCurenta, passwordForm.parolaNoua)
                setPasswordStep('code')
            } catch (err) {
                const normalized = normalizeApiError(err)
                if (normalized.kind === 'server' && normalized.errorKey && normalized.errorId) {
                    showError(normalized.errorKey, normalized.errorId)
                } else if (normalized.status === 400) {
                    setPasswordErrors({ parolaCurenta: t('profile.error_current_password_wrong') })
                } else if (normalized.status === 401) {
                    setPasswordErrors({ parolaCurenta: t('profile.error_session_expired') })
                } else if (normalized.status === 429) {
                    setPasswordErrors({ parolaCurenta: t('auth.error_too_many_requests') })
                } else if (normalized.kind === 'network') {
                    setPasswordErrors({ parolaCurenta: t('auth.error_network') })
                } else {
                    setPasswordErrors({ parolaCurenta: normalized.message ?? t('profile.error_current_password_wrong') })
                }
            }
            return
        }

        if (passwordStep === 'code') {
            if (!validateConfirmCode()) return

            try {
                await authApi.changePasswordConfirm(confirmCode)
                setIsChangingPassword(false)
                setPasswordSaved(true)
                setPasswordStep('form')
            } catch (err) {
                const normalized = normalizeApiError(err)
                if (normalized.kind === 'server' && normalized.errorKey && normalized.errorId) {
                    showError(normalized.errorKey, normalized.errorId)
                } else if (normalized.status === 429) {
                    setConfirmCodeError(t('auth.error_too_many_requests'))
                } else if (normalized.kind === 'network') {
                    setConfirmCodeError(t('auth.error_network'))
                } else {
                    setConfirmCodeError(normalized.message ?? t('profile.error_confirm_code_invalid'))
                }
            }
        }
    }

    const handleReviewSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (reviewForm.rating === 0) {
            setReviewError(t('profile.error_review_rating'))
            return
        }
        if (reviewForm.mesaj.trim().length < 25) {
            setReviewError(t('profile.error_review_length'))
            return
        }

        setReviewError('')
        try {
            await addReview({
                nume: user.prenume,
                varsta: calculateAge(user.zi, user.luna, user.an),
                email: user.email,
                rating: reviewForm.rating,
                mesaj: reviewForm.mesaj.trim(),
            })
        } catch {
            setReviewError(t('profile.error_review_submit'))
            return
        }
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
                                    <label htmlFor="prenume">{t('profile.label_prenume')}</label>
                                    <input
                                        id="prenume"
                                        type="text"
                                        value={nameForm.prenume}
                                        onChange={handleNameChange('prenume')}
                                    />
                                    {nameErrors.prenume && <span className="field-error">{nameErrors.prenume}</span>}
                                </div>
                                <div className="form-field">
                                    <label htmlFor="nume">{t('profile.label_nume')}</label>
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
                                <label>{t('profile.label_birthdate')}</label>
                                <div className="profile-edit-row">
                                    <Dropdown
                                        value={nameForm.zi}
                                        onChange={handleZiChange}
                                        options={ziledisponibile.map((d) => ({ value: String(d), label: String(d) }))}
                                        placeholder={t('profile.placeholder_day')}
                                    />
                                    <Dropdown
                                        value={nameForm.luna}
                                        onChange={handleEditDateFieldChange('luna')}
                                        options={luni.map((nume, i) => ({ value: String(i + 1), label: nume }))}
                                        placeholder={t('profile.placeholder_month')}
                                    />
                                    <Dropdown
                                        value={nameForm.an}
                                        onChange={handleEditDateFieldChange('an')}
                                        options={aniDisponibili.map((an) => ({ value: String(an), label: String(an) }))}
                                        placeholder={t('profile.placeholder_year')}
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
                                    {t('profile.btn_cancel')}
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {t('profile.btn_save')}
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
                                    {formatBirthDate(user.zi, user.luna, user.an)}{' '}
                                    {t('profile.birthdate_age', { age: calculateAge(user.zi, user.luna, user.an) })}
                                </span>
                                <span className="profile-since">{t('profile.member_since', { date: user.dataInregistrare })}</span>
                                {infoSaved && <span className="profile-saved">{t('profile.profile_updated')}</span>}
                            </div>
                            <div className="profile-actions">
                                <button type="button" className="btn btn-ghost" onClick={startEditingInfo}>
                                    {t('profile.btn_edit_profile')}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-danger"
                                    onClick={() => {
                                        logout()
                                        navigate({ to: '/' })
                                    }}
                                >
                                    {t('profile.btn_logout')}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>

            <section className="profile-stats">
                <div className="container profile-stats-inner">
                    {stats.map((s) => (
                        <div className="stat" key={s.labelKey}>
                            <span className="stat-value">
                                <AnimatedNumber value={s.value} />
                            </span>
                            <span className="stat-label">{t(s.labelKey)}</span>
                        </div>
                    ))}
                </div>
                <div className="container profile-leaderboard-link">
                    <Link to="/leaderboard">{t('profile.leaderboard_link')}</Link>
                </div>
            </section>

            <section className="profile-secondary">
                <div className="container profile-secondary-grid">
                    <div className="profile-secondary-col">
                        <div className="section-heading">
                            <h2>{t('profile.security_title')}</h2>
                            <p className="section-subtitle">{t('profile.security_subtitle')}</p>
                        </div>

                        {isChangingPassword ? (
                            <form className="password-form" onSubmit={handleSavePassword} noValidate>
                                {passwordStep === 'form' && (
                                    <>
                                        <div className="form-field">
                                            <label htmlFor="parolaCurenta">{t('profile.label_current_password')}</label>
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
                                                    aria-label={showPassword ? t('profile.hide_password') : t('profile.show_password')}
                                                >
                                                    <EyeIcon open={showPassword} />
                                                </button>
                                            </div>
                                            {passwordErrors.parolaCurenta && (
                                                <span className="field-error">{passwordErrors.parolaCurenta}</span>
                                            )}
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor="parolaNoua">{t('profile.label_new_password')}</label>
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
                                            <label htmlFor="confirmaParolaNoua">{t('profile.label_confirm_new_password')}</label>
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

                                        {passwordRateLimit.isLimited && (
                                            <span className="field-error rate-limit-error">
                                                {t('profile.rate_limit', { seconds: passwordRateLimit.secondsLeft })}
                                            </span>
                                        )}
                                    </>
                                )}

                                {passwordStep === 'code' && (
                                    <div className="form-field">
                                        <label htmlFor="confirmCode">{t('profile.label_confirm_code')}</label>
                                        <input
                                            id="confirmCode"
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={confirmCode}
                                            onChange={(e) => setConfirmCode(e.target.value.replace(/\D/g, ''))}
                                            placeholder={t('profile.placeholder_code')}
                                        />
                                        {confirmCodeError && <span className="field-error">{confirmCodeError}</span>}
                                        <span className="auth-form-hint">
                                            {t('profile.hint_code_sent')}
                                        </span>
                                        <div className="auth-resend-row">
                                            {canResend ? (
                                                <button type="button" className="btn-link" onClick={handleResendCode}>
                                                    {t('profile.resend_code')}
                                                </button>
                                            ) : (
                                                <span className="auth-resend-countdown">
                                                    {t('profile.resend_in', { seconds: resendSecondsLeft })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="profile-edit-actions">
                                    <button type="button" className="btn btn-ghost" onClick={cancelChangingPassword}>
                                        {t('profile.btn_cancel')}
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={passwordRateLimit.isLimited}>
                                        {passwordStep === 'code' ? t('profile.btn_confirm_code') : t('profile.btn_save_password')}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="password-summary">
                                <div>
                                    <span className="password-dots">••••••••</span>
                                    {passwordSaved && <span className="profile-saved">{t('profile.password_changed')}</span>}
                                </div>
                                <button type="button" className="btn btn-ghost" onClick={startChangingPassword}>
                                    {t('profile.btn_change_password')}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="profile-secondary-col">
                        <div className="section-heading">
                            <h2>{t('profile.review_title')}</h2>
                            <p className="section-subtitle">{t('profile.review_subtitle')}</p>
                        </div>

                        {reviewSubmitted ? (
                            <div className="profile-saved">
                                {t('profile.review_thanks', { days: REVIEW_COOLDOWN_DAYS })}
                            </div>
                        ) : daysUntilNextReview > 0 ? (
                            <div className="review-cooldown">
                                {t('profile.review_cooldown', {
                                    days: daysUntilNextReview,
                                    unit: daysUntilNextReview === 1 ? t('profile.unit_day_singular') : t('profile.unit_day_plural'),
                                })}
                            </div>
                        ) : (
                            <form className="review-form" onSubmit={handleReviewSubmit} noValidate>
                                <div className="form-field">
                                    <label>{t('profile.label_rating')}</label>
                                    <StarRating
                                        rating={reviewForm.rating}
                                        onChange={(rating) => setReviewForm((prev) => ({ ...prev, rating }))}
                                        size={44}
                                    />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="review-mesaj">{t('profile.label_review_message')}</label>
                                    <textarea
                                        id="review-mesaj"
                                        rows={4}
                                        value={reviewForm.mesaj}
                                        onChange={(e) =>
                                            setReviewForm((prev) => ({ ...prev, mesaj: e.target.value }))
                                        }
                                        placeholder={t('profile.placeholder_review')}
                                    />
                                </div>
                                {reviewError && <span className="field-error">{reviewError}</span>}
                                <button type="submit" className="btn btn-primary">
                                    {t('profile.btn_submit_review')}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <section className="profile-history">
                <div className="container">
                    <div className="section-heading">
                        <h2>{t('profile.history_title')}</h2>
                        <p className="section-subtitle">
                            {t('profile.history_subtitle')}
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
                                            {t('profile.btn_replay')}
                                        </Link>
                                    ) : (
                                        <span className="history-unavailable">{t('profile.unavailable')}</span>
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