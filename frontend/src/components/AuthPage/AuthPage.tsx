import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import ThemeToggle from '../../shared/ThemeToggle/ThemeToggle'
import LanguageSwitcher from '../../shared/LanguageSwitcher/LanguageSwitcher'
import Dropdown from '../../shared/Dropdown/Dropdown'
import { useAuth } from '../../shared/AuthContext/AuthContext'
import { useErrorModal } from '../../shared/ErrorModalContext/ErrorModalContext'
import { useRateLimit } from '../../shared/useRateLimit/useRateLimit'
import { useResendCountdown } from '../../shared/useResendCountdown/useResendCountdown'
import { isValidBirthDate, daysInMonth, VARSTA_MINIMA, VARSTA_MAXIMA } from '../../shared/birthDate/birthDate'
import * as authApi from '../../api/authApi'
import { setTokens } from '../../api/tokenStorage'
import { normalizeApiError } from '../../api/apiClient'
import './AuthPage.css'

type Mode = 'login' | 'register' | 'forgot'

interface FormState {
    nume: string
    prenume: string
    email: string
    zi: string
    luna: string
    an: string
    parola: string
    confirmaParola: string
}

const initialState: FormState = {
    nume: '',
    prenume: '',
    email: '',
    zi: '',
    luna: '',
    an: '',
    parola: '',
    confirmaParola: '',
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

function parseBirthDate(birthDate: string | null): { zi?: number; luna?: number; an?: number } {
    if (!birthDate) return {}
    const [an, luna, zi] = birthDate.split('-').map(Number)
    return { zi, luna, an }
}

function toIsoBirthDate(zi: string, luna: string, an: string): string | null {
    if (!zi || !luna || !an) return null
    return `${an}-${luna.padStart(2, '0')}-${zi.padStart(2, '0')}`
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

type Step = 'form' | 'code' | 'newPassword'

const CODE_REGEX = /^\d{6}$/

function AuthPage() {
    const { t } = useTranslation()
    const { login } = useAuth()
    const { showError } = useErrorModal()
    const navigate = useNavigate()
    const [mode, setMode] = useState<Mode>('login')
    const isRegister = mode === 'register'
    const isForgot = mode === 'forgot'

    const [form, setForm] = useState<FormState>(initialState)
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formError, setFormError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const loginRateLimit = useRateLimit()

    const [step, setStep] = useState<Step>('form')
    const [code, setCode] = useState('')
    const [codeError, setCodeError] = useState('')
    const [resendError, setResendError] = useState('')
    const { secondsLeft: resendSecondsLeft, canResend, restart: restartResend } = useResendCountdown()

    const anCurent = new Date().getFullYear()
    const aniDisponibili = Array.from(
        { length: VARSTA_MAXIMA - VARSTA_MINIMA + 1 },
        (_, i) => anCurent - VARSTA_MINIMA - i
    )
    const maxZile = daysInMonth(Number(form.luna) || undefined, Number(form.an) || undefined)
    const ziledisponibile = Array.from({ length: maxZile }, (_, i) => i + 1)
    const luni = t('common.months', { returnObjects: true }) as string[]

    useEffect(() => {
        if (submitted && (mode === 'login' || mode === 'register')) {
            const id = setTimeout(() => {
                navigate({ to: '/' })
            }, 1200)
            return () => clearTimeout(id)
        }
    }, [submitted, mode, navigate])

    useEffect(() => {
        if (step === 'code') {
            restartResend()
        }
    }, [step, restartResend])

    const handleResendCode = async () => {
        if (!canResend) return
        setResendError('')
        try {
            if (mode === 'register') {
                await authApi.registerStart({
                    lastName: form.nume,
                    firstName: form.prenume,
                    email: form.email,
                    password: form.parola,
                    birthDate: toIsoBirthDate(form.zi, form.luna, form.an),
                })
            } else if (mode === 'forgot') {
                await authApi.forgotPassword(form.email)
            }
            restartResend()
        } catch (err) {
            const normalized = normalizeApiError(err)
            if (normalized.kind === 'server' && normalized.errorKey && normalized.errorId) {
                showError(normalized.errorKey, normalized.errorId)
            } else if (normalized.status === 429) {
                setResendError(t('auth.error_too_many_requests'))
            } else if (normalized.kind === 'network') {
                setResendError(t('auth.error_network'))
            } else {
                setResendError(normalized.message ?? t('auth.error_resend_generic'))
            }
        }
    }

    const switchMode = useCallback((next: Mode) => {
        setMode(next)
        setErrors({})
        setSubmitted(false)
        setFormError('')
        setStep('form')
        setCode('')
        setCodeError('')
        setResendError('')
    }, [])

    useEffect(() => {
        if (submitted && mode === 'forgot') {
            const id = setTimeout(() => {
                switchMode('login')
            }, 5000)
            return () => clearTimeout(id)
        }
    }, [submitted, mode, switchMode])

    const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

    const handleZiChange = (value: string) => {
        setForm((prev) => ({ ...prev, zi: value }))
    }

    const handleDateFieldChange = (field: 'luna' | 'an') => (value: string) => {
        setForm((prev) => {
            const next = { ...prev, [field]: value }
            const maxDays = daysInMonth(Number(next.luna) || undefined, Number(next.an) || undefined)
            if (Number(next.zi) > maxDays) {
                next.zi = ''
            }
            return next
        })
    }

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof FormState, string>> = {}

        if (!form.email.trim()) {
            newErrors.email = t('auth.error_email_required')
        } else if (!EMAIL_REGEX.test(form.email.trim())) {
            newErrors.email = t('auth.error_email_invalid')
        }

        if (isForgot) {
            setErrors(newErrors)
            return Object.keys(newErrors).length === 0
        }

        if (isRegister) {
            if (!form.nume.trim()) newErrors.nume = t('auth.error_nume_required')
            if (!form.prenume.trim()) newErrors.prenume = t('auth.error_prenume_required')

            const zi = Number(form.zi)
            const luna = Number(form.luna)
            const an = Number(form.an)

            if (!form.zi || !form.luna || !form.an) {
                newErrors.zi = t('auth.error_birthdate_required')
            } else if (zi < 1 || zi > 31) {
                newErrors.zi = t('auth.error_day_range')
            } else if (luna < 1 || luna > 12) {
                newErrors.luna = t('auth.error_month_range')
            } else if (an < anCurent - VARSTA_MAXIMA || an > anCurent - VARSTA_MINIMA) {
                newErrors.an = t('auth.error_year_invalid')
            } else if (!isValidBirthDate(zi, luna, an)) {
                newErrors.zi = t('auth.error_date_invalid')
            }
        }

        if (!form.parola) {
            newErrors.parola = t('auth.error_password_required')
        } else if (form.parola.length < 8) {
            newErrors.parola = t('auth.error_password_length')
        }

        if (isRegister && form.parola !== form.confirmaParola) {
            newErrors.confirmaParola = t('auth.error_passwords_mismatch')
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateCode = (): boolean => {
        if (!CODE_REGEX.test(code)) {
            setCodeError(t('auth.error_code_invalid'))
            return false
        }
        setCodeError('')
        return true
    }

    const validateNewPassword = (): boolean => {
        const newErrors: Partial<Record<keyof FormState, string>> = {}

        if (!form.parola) {
            newErrors.parola = t('auth.error_password_required')
        } else if (form.parola.length < 8) {
            newErrors.parola = t('auth.error_password_length')
        }

        if (form.parola !== form.confirmaParola) {
            newErrors.confirmaParola = t('auth.error_passwords_mismatch')
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (mode === 'login') {
            if (loginRateLimit.isLimited) return
            if (!loginRateLimit.registerAttempt()) return

            if (!validate()) return
            setFormError('')
            setIsSubmitting(true)

            try {
                const authRes = await authApi.login(form.email, form.parola)
                setTokens(authRes.accessToken, authRes.refreshToken, rememberMe)

                const me = await authApi.me()
                const { zi, luna, an } = parseBirthDate(me.birthDate)
                login({
                    id: me.id,
                    email: me.email,
                    nume: me.lastName,
                    prenume: me.firstName,
                    zi,
                    luna,
                    an,
                    rol: me.role === authApi.UserRole.Admin ? 'admin' : 'user',
                }, rememberMe)
                setSubmitted(true)
            } catch (err) {
                const normalized = normalizeApiError(err)
                if (normalized.kind === 'server' && normalized.errorKey && normalized.errorId) {
                    showError(normalized.errorKey, normalized.errorId)
                } else if (normalized.status === 429) {
                    setFormError(t('auth.error_too_many_requests'))
                } else if (normalized.kind === 'network') {
                    setFormError(t('auth.error_network'))
                } else {
                    setFormError(normalized.message ?? t('auth.error_login_generic'))
                }
            } finally {
                setIsSubmitting(false)
            }
            return
        }

        if (mode === 'register') {
            if (step === 'form') {
                if (!validate()) return
                setFormError('')
                setIsSubmitting(true)
                try {
                    await authApi.registerStart({
                        lastName: form.nume,
                        firstName: form.prenume,
                        email: form.email,
                        password: form.parola,
                        birthDate: toIsoBirthDate(form.zi, form.luna, form.an),
                    })
                    setStep('code')
                } catch (err) {
                    const normalized = normalizeApiError(err)
                    if (normalized.kind === 'server' && normalized.errorKey && normalized.errorId) {
                        showError(normalized.errorKey, normalized.errorId)
                    } else if (normalized.status === 429) {
                        setFormError(t('auth.error_too_many_requests'))
                    } else if (normalized.kind === 'network') {
                        setFormError(t('auth.error_network'))
                    } else {
                        setFormError(normalized.message ?? t('auth.error_register_generic'))
                    }
                } finally {
                    setIsSubmitting(false)
                }
                return
            }
            if (step === 'code') {
                if (!validateCode()) return
                setFormError('')
                setIsSubmitting(true)
                try {
                    await authApi.registerConfirm(form.email, code)

                    const authRes = await authApi.login(form.email, form.parola)
                    setTokens(authRes.accessToken, authRes.refreshToken, false)

                    const me = await authApi.me()
                    const { zi, luna, an } = parseBirthDate(me.birthDate)
                    login({
                        id: me.id,
                        email: me.email,
                        nume: me.lastName,
                        prenume: me.firstName,
                        zi,
                        luna,
                        an,
                        rol: me.role === authApi.UserRole.Admin ? 'admin' : 'user',
                    }, false)
                    setSubmitted(true)
                } catch (err) {
                    const normalized = normalizeApiError(err)
                    if (normalized.kind === 'server' && normalized.errorKey && normalized.errorId) {
                        showError(normalized.errorKey, normalized.errorId)
                    } else if (normalized.status === 429) {
                        setFormError(t('auth.error_too_many_requests'))
                    } else if (normalized.kind === 'network') {
                        setFormError(t('auth.error_network'))
                    } else {
                        setCodeError(normalized.message ?? t('auth.error_code_generic'))
                    }
                } finally {
                    setIsSubmitting(false)
                }
                return
            }
        }

        if (mode === 'forgot') {
            if (step === 'form') {
                if (!validate()) return
                setFormError('')
                setIsSubmitting(true)
                try {
                    await authApi.forgotPassword(form.email)
                    setStep('code')
                } catch (err) {
                    const normalized = normalizeApiError(err)
                    if (normalized.kind === 'server' && normalized.errorKey && normalized.errorId) {
                        showError(normalized.errorKey, normalized.errorId)
                    } else if (normalized.status === 429) {
                        setFormError(t('auth.error_too_many_requests'))
                    } else if (normalized.kind === 'network') {
                        setFormError(t('auth.error_network'))
                    } else {
                        setFormError(normalized.message ?? t('auth.error_forgot_generic'))
                    }
                } finally {
                    setIsSubmitting(false)
                }
                return
            }
            if (step === 'code') {
                if (!validateCode()) return
                setFormError('')
                setIsSubmitting(true)
                try {
                    await authApi.verifyResetCode(form.email, code)
                    setStep('newPassword')
                } catch (err) {
                    const normalized = normalizeApiError(err)
                    if (normalized.kind === 'server' && normalized.errorKey && normalized.errorId) {
                        showError(normalized.errorKey, normalized.errorId)
                    } else if (normalized.status === 429) {
                        setFormError(t('auth.error_too_many_requests'))
                    } else if (normalized.kind === 'network') {
                        setFormError(t('auth.error_network'))
                    } else {
                        setCodeError(normalized.message ?? t('auth.error_code_invalid_or_expired'))
                    }
                } finally {
                    setIsSubmitting(false)
                }
                return
            }
            if (step === 'newPassword') {
                if (!validateNewPassword()) return
                setFormError('')
                setIsSubmitting(true)
                try {
                    await authApi.resetPassword(form.email, code, form.parola)
                    setSubmitted(true)
                } catch (err) {
                    const normalized = normalizeApiError(err)
                    if (normalized.kind === 'server' && normalized.errorKey && normalized.errorId) {
                        showError(normalized.errorKey, normalized.errorId)
                    } else if (normalized.status === 429) {
                        setFormError(t('auth.error_too_many_requests'))
                    } else if (normalized.kind === 'network') {
                        setFormError(t('auth.error_network'))
                    } else if (normalized.kind === 'validation') {
                        setStep('code')
                        setCodeError(normalized.message ?? t('auth.error_code_invalid_or_expired'))
                    } else {
                        setFormError(normalized.message ?? t('auth.error_reset_generic'))
                    }
                } finally {
                    setIsSubmitting(false)
                }
                return
            }
        }
    }

    return (
        <div className="auth-page">
            <Link to="/" className="auth-home-link">
                {t('common.back_home')}
            </Link>
            <div className="auth-theme-toggle">
                <LanguageSwitcher />
                <ThemeToggle />
            </div>
            <div className="auth-card">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        FinSim
                    </Link>
                    {isForgot && (
                        <button type="button" className="auth-back" onClick={() => switchMode('login')}>
                            {t('auth.back_to_login')}
                        </button>
                    )}
                </div>

                {!isForgot && (
                    <div className="auth-tabs">
                        <button
                            type="button"
                            className={`auth-tab ${!isRegister ? 'active' : ''}`}
                            onClick={() => switchMode('login')}
                        >
                            {t('auth.tab_login')}
                        </button>
                        <button
                            type="button"
                            className={`auth-tab ${isRegister ? 'active' : ''}`}
                            onClick={() => switchMode('register')}
                        >
                            {t('auth.tab_register')}
                        </button>
                    </div>
                )}

                <p className="auth-subtitle">
                    {step === 'code'
                        ? t('auth.subtitle_code')
                        : step === 'newPassword'
                            ? t('auth.subtitle_new_password')
                            : isForgot
                                ? t('auth.subtitle_forgot')
                                : isRegister
                                    ? t('auth.subtitle_register')
                                    : t('auth.subtitle_login')}
                </p>

                {submitted ? (
                    <div className="auth-success">
                        {isForgot
                            ? t('auth.success_forgot')
                            : isRegister
                                ? t('auth.success_register')
                                : t('auth.success_login')}
                    </div>
                ) : (
                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                        {isRegister && step === 'form' && (
                            <div className="form-row">
                                <div className="form-field">
                                    <label htmlFor="nume">{t('auth.label_nume')}</label>
                                    <input
                                        id="nume"
                                        type="text"
                                        value={form.nume}
                                        onChange={handleChange('nume')}
                                        placeholder={t('auth.placeholder_nume')}
                                    />
                                    {errors.nume && <span className="field-error">{errors.nume}</span>}
                                </div>
                                <div className="form-field">
                                    <label htmlFor="prenume">{t('auth.label_prenume')}</label>
                                    <input
                                        id="prenume"
                                        type="text"
                                        value={form.prenume}
                                        onChange={handleChange('prenume')}
                                        placeholder={t('auth.placeholder_prenume')}
                                    />
                                    {errors.prenume && <span className="field-error">{errors.prenume}</span>}
                                </div>
                            </div>
                        )}

                        {step === 'form' && (
                            <div className="form-field">
                                <label htmlFor="email">{t('auth.label_email')}</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange('email')}
                                    placeholder={t('auth.placeholder_email')}
                                />
                                {errors.email && <span className="field-error">{errors.email}</span>}
                            </div>
                        )}

                        {isRegister && step === 'form' && (
                            <div className="form-field">
                                <label>{t('auth.label_birthdate')}</label>
                                <div className="form-row">
                                    <Dropdown
                                        value={form.zi}
                                        onChange={handleZiChange}
                                        options={ziledisponibile.map((d) => ({ value: String(d), label: String(d) }))}
                                        placeholder={t('auth.placeholder_day')}
                                    />
                                    <Dropdown
                                        value={form.luna}
                                        onChange={handleDateFieldChange('luna')}
                                        options={luni.map((nume, i) => ({ value: String(i + 1), label: nume }))}
                                        placeholder={t('auth.placeholder_month')}
                                    />
                                    <Dropdown
                                        value={form.an}
                                        onChange={handleDateFieldChange('an')}
                                        options={aniDisponibili.map((an) => ({ value: String(an), label: String(an) }))}
                                        placeholder={t('auth.placeholder_year')}
                                    />
                                </div>
                                {(errors.zi || errors.luna || errors.an) && (
                                    <span className="field-error">{errors.zi || errors.luna || errors.an}</span>
                                )}
                            </div>
                        )}

                        {((!isForgot && step === 'form') || (isForgot && step === 'newPassword')) && (
                            <div className="form-field">
                                <label htmlFor="parola">{isForgot ? t('auth.label_new_password') : t('auth.label_password')}</label>
                                <div className="password-input">
                                    <input
                                        id="parola"
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.parola}
                                        onChange={handleChange('parola')}
                                        placeholder={t('auth.placeholder_password')}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? t('auth.hide_password') : t('auth.show_password')}
                                    >
                                        <EyeIcon open={showPassword} />
                                    </button>
                                </div>
                                {errors.parola && <span className="field-error">{errors.parola}</span>}
                            </div>
                        )}

                        {((isRegister && step === 'form') || (isForgot && step === 'newPassword')) && (
                            <div className="form-field">
                                <label htmlFor="confirmaParola">
                                    {isForgot ? t('auth.label_confirm_new_password') : t('auth.label_confirm_password')}
                                </label>
                                <input
                                    id="confirmaParola"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.confirmaParola}
                                    onChange={handleChange('confirmaParola')}
                                    placeholder={t('auth.placeholder_password')}
                                />
                                {errors.confirmaParola && (
                                    <span className="field-error">{errors.confirmaParola}</span>
                                )}
                            </div>
                        )}

                        {step === 'code' && (
                            <div className="form-field">
                                <label htmlFor="code">{t('auth.label_code')}</label>
                                <input
                                    id="code"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    placeholder={t('auth.placeholder_code')}
                                />
                                {codeError && <span className="field-error">{codeError}</span>}
                                <span className="auth-form-hint">
                                    {t('auth.hint_code_sent')}
                                </span>
                                <div className="auth-resend-row">
                                    {canResend ? (
                                        <button type="button" className="btn-link" onClick={handleResendCode}>
                                            {t('auth.resend_code')}
                                        </button>
                                    ) : (
                                        <span className="auth-resend-countdown">
                                            {t('auth.resend_in', { seconds: resendSecondsLeft })}
                                        </span>
                                    )}
                                    {resendError && <span className="field-error">{resendError}</span>}
                                </div>
                            </div>
                        )}

                        {!isRegister && !isForgot && step === 'form' && (
                            <div className="auth-extra-row">
                                <label className="remember-me">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span>{t('auth.remember_me')}</span>
                                </label>
                                <button
                                    type="button"
                                    className="forgot-password"
                                    onClick={() => switchMode('forgot')}
                                >
                                    {t('auth.forgot_password')}
                                </button>
                            </div>
                        )}

                        {formError && <span className="field-error auth-form-error">{formError}</span>}

                        {!isRegister && !isForgot && loginRateLimit.isLimited && (
                            <span className="field-error auth-form-error rate-limit-error">
                                {t('auth.rate_limit', { seconds: loginRateLimit.secondsLeft })}
                            </span>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg auth-submit"
                            disabled={isSubmitting || (mode === 'login' && loginRateLimit.isLimited)}
                        >
                            {step === 'code'
                                ? t('auth.submit_confirm_code')
                                : step === 'newPassword'
                                    ? t('auth.submit_reset_password')
                                    : isForgot || isRegister
                                        ? t('auth.submit_send_code')
                                        : t('auth.submit_login')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default AuthPage