import { useState, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import './AuthPage.css'

type Mode = 'login' | 'register' | 'forgot'

interface FormState {
    nume: string
    prenume: string
    email: string
    telefon: string
    parola: string
    confirmaParola: string
}

const initialState: FormState = {
    nume: '',
    prenume: '',
    email: '',
    telefon: '',
    parola: '',
    confirmaParola: '',
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

function AuthPage() {
    const [mode, setMode] = useState<Mode>('login')
    const isRegister = mode === 'register'
    const isForgot = mode === 'forgot'

    const [form, setForm] = useState<FormState>(initialState)
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
    const [showPassword, setShowPassword] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const switchMode = (next: Mode) => {
        setMode(next)
        setErrors({})
        setSubmitted(false)
    }

    const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof FormState, string>> = {}

        if (!form.email.trim()) {
            newErrors.email = 'Email-ul este obligatoriu.'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Introdu o adresă de email validă.'
        }

        if (isForgot) {
            setErrors(newErrors)
            return Object.keys(newErrors).length === 0
        }

        if (isRegister) {
            if (!form.nume.trim()) newErrors.nume = 'Numele este obligatoriu.'
            if (!form.prenume.trim()) newErrors.prenume = 'Prenumele este obligatoriu.'
            if (!form.telefon.trim()) {
                newErrors.telefon = 'Numărul de telefon este obligatoriu.'
            } else if (!/^0\d{8,9}$/.test(form.telefon.replace(/\s/g, ''))) {
                newErrors.telefon = 'Introdu un număr de telefon valid.'
            }
        }

        if (!form.parola) {
            newErrors.parola = 'Parola este obligatorie.'
        } else if (form.parola.length < 6) {
            newErrors.parola = 'Parola trebuie să aibă cel puțin 6 caractere.'
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

        console.log(`[${mode}] date trimise:`, form)
        setSubmitted(true)
    }

    return (
        <div className="auth-page">
            <Link to="/" className="auth-home-link">
                ← Înapoi la pagina principală
            </Link>
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
                                        placeholder="Olaru"
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
                                        placeholder="Vladislav"
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
                                <label htmlFor="telefon">Telefon</label>
                                <input
                                    id="telefon"
                                    type="tel"
                                    value={form.telefon}
                                    onChange={handleChange('telefon')}
                                    placeholder="+37364578421"
                                />
                                {errors.telefon && <span className="field-error">{errors.telefon}</span>}
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