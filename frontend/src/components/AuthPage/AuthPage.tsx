import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import ThemeToggle from '../../shared/ThemeToggle/ThemeToggle'
import Dropdown from '../../shared/Dropdown/Dropdown'
import { useAuth } from '../../shared/AuthContext/AuthContext'
import { useUsers, ADMIN_EMAIL } from '../../shared/UsersContext/UsersContext'
import { isValidBirthDate, daysInMonth, LUNI, VARSTA_MINIMA, VARSTA_MAXIMA } from '../../shared/birthDate/birthDate'
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

function AuthPage() {
    const { login } = useAuth()
    const { addUser, findByEmail } = useUsers()
    const navigate = useNavigate()
    const [mode, setMode] = useState<Mode>('login')
    const isRegister = mode === 'register'
    const isForgot = mode === 'forgot'

    const [form, setForm] = useState<FormState>(initialState)
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
    const [showPassword, setShowPassword] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formError, setFormError] = useState('')

    const anCurent = new Date().getFullYear()
    const aniDisponibili = Array.from(
        { length: VARSTA_MAXIMA - VARSTA_MINIMA + 1 },
        (_, i) => anCurent - VARSTA_MINIMA - i
    )
    const maxZile = daysInMonth(Number(form.luna) || undefined, Number(form.an) || undefined)
    const ziledisponibile = Array.from({ length: maxZile }, (_, i) => i + 1)

    useEffect(() => {
        if (submitted && mode === 'login') {
            const id = setTimeout(() => {
                navigate({ to: '/' })
            }, 1200)
            return () => clearTimeout(id)
        }
    }, [submitted, mode, navigate])

    const switchMode = (next: Mode) => {
        setMode(next)
        setErrors({})
        setSubmitted(false)
        setFormError('')
    }

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
            newErrors.email = 'Email-ul este obligatoriu.'
        } else if (!EMAIL_REGEX.test(form.email.trim())) {
            newErrors.email = 'Introdu o adresă de email validă.'
        }

        if (isForgot) {
            setErrors(newErrors)
            return Object.keys(newErrors).length === 0
        }

        if (isRegister) {
            if (!form.nume.trim()) newErrors.nume = 'Numele este obligatoriu.'
            if (!form.prenume.trim()) newErrors.prenume = 'Prenumele este obligatoriu.'

            const zi = Number(form.zi)
            const luna = Number(form.luna)
            const an = Number(form.an)

            if (!form.zi || !form.luna || !form.an) {
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
        }

        if (!form.parola) {
            newErrors.parola = 'Parola este obligatorie.'
        } else if (form.parola.length < 8) {
            newErrors.parola = 'Parola trebuie să aibă cel puțin 8 caractere.'
        }

        if (isRegister && form.parola !== form.confirmaParola) {
            newErrors.confirmaParola = 'Parolele nu coincid.'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        if (!validate()) return
        setFormError('')

        if (isRegister) {
            const exists = findByEmail(form.email)
            if (exists) {
                setFormError('Există deja un cont înregistrat cu acest email.')
                return
            }
            const created = addUser({
                nume: form.nume,
                prenume: form.prenume,
                email: form.email,
                rol: form.email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user',
                status: 'activ',
                dataInregistrare: new Date().toLocaleDateString('ro-RO'),
                scenariiFinalizate: 0,
                scorTotal: 0,
                zi: Number(form.zi),
                luna: Number(form.luna),
                an: Number(form.an),
            })
            login({
                email: created.email,
                nume: created.nume,
                prenume: created.prenume,
                zi: Number(form.zi),
                luna: Number(form.luna),
                an: Number(form.an),
                rol: created.rol,
            })
        } else if (!isForgot) {
            const existing = findByEmail(form.email)
            if (existing && existing.status === 'blocat') {
                setFormError('Acest cont a fost blocat de un administrator.')
                return
            }
            login({
                email: form.email,
                nume: existing?.nume,
                prenume: existing?.prenume,
                rol: existing?.rol ?? (form.email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user'),
            })
        }

        setSubmitted(true)
    }

    return (
        <div className="auth-page">
            <Link to="/" className="auth-home-link">
                ← Înapoi la pagina principală
            </Link>
            <div className="auth-theme-toggle">
                <ThemeToggle />
            </div>
            <div className="auth-card">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        FinSim
                    </Link>
                    {isForgot && (
                        <button type="button" className="auth-back" onClick={() => switchMode('login')}>
                            ← Înapoi la autentificare
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
                            Autentificare
                        </button>
                        <button
                            type="button"
                            className={`auth-tab ${isRegister ? 'active' : ''}`}
                            onClick={() => switchMode('register')}
                        >
                            Înregistrare
                        </button>
                    </div>
                )}

                <p className="auth-subtitle">
                    {isForgot
                        ? 'Introdu adresa de email și îți trimitem un link de resetare a parolei.'
                        : isRegister
                            ? 'Câteva date și ești gata să începi prima simulare.'
                            : 'Introdu datele contului pentru a continua.'}
                </p>

                {submitted ? (
                    <div className="auth-success">
                        {isForgot
                            ? 'Dacă adresa există în sistem, vei primi un email cu instrucțiuni de resetare.'
                            : isRegister
                                ? 'Contul a fost creat cu succes! Te poți autentifica acum.'
                                : 'Autentificare reușită! Te redirecționăm...'}
                    </div>
                ) : (
                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                        {isRegister && (
                            <div className="form-row">
                                <div className="form-field">
                                    <label htmlFor="nume">Nume</label>
                                    <input
                                        id="nume"
                                        type="text"
                                        value={form.nume}
                                        onChange={handleChange('nume')}
                                        placeholder="Popescu"
                                    />
                                    {errors.nume && <span className="field-error">{errors.nume}</span>}
                                </div>
                                <div className="form-field">
                                    <label htmlFor="prenume">Prenume</label>
                                    <input
                                        id="prenume"
                                        type="text"
                                        value={form.prenume}
                                        onChange={handleChange('prenume')}
                                        placeholder="Ion"
                                    />
                                    {errors.prenume && <span className="field-error">{errors.prenume}</span>}
                                </div>
                            </div>
                        )}

                        <div className="form-field">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange('email')}
                                placeholder="nume@exemplu.com"
                            />
                            {errors.email && <span className="field-error">{errors.email}</span>}
                        </div>

                        {isRegister && (
                            <div className="form-field">
                                <label>Data nașterii</label>
                                <div className="form-row">
                                    <Dropdown
                                        value={form.zi}
                                        onChange={handleZiChange}
                                        options={ziledisponibile.map((d) => ({ value: String(d), label: String(d) }))}
                                        placeholder="Ziua"
                                    />
                                    <Dropdown
                                        value={form.luna}
                                        onChange={handleDateFieldChange('luna')}
                                        options={LUNI.map((nume, i) => ({ value: String(i + 1), label: nume }))}
                                        placeholder="Luna"
                                    />
                                    <Dropdown
                                        value={form.an}
                                        onChange={handleDateFieldChange('an')}
                                        options={aniDisponibili.map((an) => ({ value: String(an), label: String(an) }))}
                                        placeholder="Anul"
                                    />
                                </div>
                                {(errors.zi || errors.luna || errors.an) && (
                                    <span className="field-error">{errors.zi || errors.luna || errors.an}</span>
                                )}
                            </div>
                        )}

                        {!isForgot && (
                            <div className="form-field">
                                <label htmlFor="parola">Parolă</label>
                                <div className="password-input">
                                    <input
                                        id="parola"
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.parola}
                                        onChange={handleChange('parola')}
                                        placeholder="••••••••"
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
                                {errors.parola && <span className="field-error">{errors.parola}</span>}
                            </div>
                        )}

                        {isRegister && (
                            <div className="form-field">
                                <label htmlFor="confirmaParola">Confirmă parola</label>
                                <input
                                    id="confirmaParola"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.confirmaParola}
                                    onChange={handleChange('confirmaParola')}
                                    placeholder="••••••••"
                                />
                                {errors.confirmaParola && (
                                    <span className="field-error">{errors.confirmaParola}</span>
                                )}
                            </div>
                        )}

                        {!isRegister && !isForgot && (
                            <div className="auth-extra-row">
                                <label className="remember-me">
                                    <input type="checkbox" />
                                    <span>Ține-mă minte</span>
                                </label>
                                <button
                                    type="button"
                                    className="forgot-password"
                                    onClick={() => switchMode('forgot')}
                                >
                                    Ai uitat parola?
                                </button>
                            </div>
                        )}

                        {formError && <span className="field-error auth-form-error">{formError}</span>}

                        <button type="submit" className="btn btn-primary btn-lg auth-submit">
                            {isForgot ? 'Trimite link de resetare' : isRegister ? 'Creează cont' : 'Autentificare'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default AuthPage