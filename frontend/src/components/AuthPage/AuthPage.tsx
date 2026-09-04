import { useState, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import './AuthPage.css'

type Mode = 'login' | 'register'

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

function AuthPage() {
    const [mode, setMode] = useState<Mode>('login')
    const isRegister = mode === 'register'

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

        if (isRegister) {
            if (!form.nume.trim()) newErrors.nume = 'Numele este obligatoriu.'
            if (!form.prenume.trim()) newErrors.prenume = 'Prenumele este obligatoriu.'
            if (!form.telefon.trim()) {
                newErrors.telefon = 'Numărul de telefon este obligatoriu.'
            } else if (!/^0\d{8,9}$/.test(form.telefon.replace(/\s/g, ''))) {
                newErrors.telefon = 'Introdu un număr de telefon valid.'
            }
        }

        if (!form.email.trim()) {
            newErrors.email = 'Email-ul este obligatoriu.'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Introdu o adresă de email validă.'
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

        // TODO: conectează la API-ul real când va fi gata backend-ul, de exemplu:
        // const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
        // await fetch(endpoint, { method: 'POST', body: JSON.stringify(form), ... })

        console.log(`[${mode}] date trimise:`, form)
        setSubmitted(true)
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <Link to="/" className="auth-logo">
                    FinSim
                </Link>

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

                <p className="auth-subtitle">
                    {isRegister
                        ? 'Câteva date și ești gata să aplici pentru primul tău credit.'
                        : 'Introdu datele contului pentru a continua.'}
                </p>

                {submitted ? (
                    <div className="auth-success">
                        {isRegister
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
                                <label htmlFor="telefon">Telefon</label>
                                <input
                                    id="telefon"
                                    type="tel"
                                    value={form.telefon}
                                    onChange={handleChange('telefon')}
                                    placeholder="0712345678"
                                />
                                {errors.telefon && <span className="field-error">{errors.telefon}</span>}
                            </div>
                        )}

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
                                >
                                    {showPassword ? 'Ascunde' : 'Arată'}
                                </button>
                            </div>
                            {errors.parola && <span className="field-error">{errors.parola}</span>}
                        </div>

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

                        {!isRegister && (
                            <div className="auth-extra-row">
                                <label className="remember-me">
                                    <input type="checkbox" />
                                    Ține-mă minte
                                </label>
                                <a href="#" className="forgot-password">
                                    Ai uitat parola?
                                </a>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary btn-lg auth-submit">
                            {isRegister ? 'Creează cont' : 'Autentificare'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default AuthPage