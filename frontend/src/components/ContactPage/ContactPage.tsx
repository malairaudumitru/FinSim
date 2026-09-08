import { useState, type ChangeEvent, type FormEvent } from 'react'
import '../../shared/ContentPage/ContentPage.css'
import './ContactPage.css'

interface ContactForm {
    nume: string
    email: string
    mesaj: string
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const initialState: ContactForm = {
    nume: '',
    email: '',
    mesaj: '',
}

function ContactPage() {
    const [form, setForm] = useState<ContactForm>(initialState)
    const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({})
    const [submitted, setSubmitted] = useState(false)

    const handleChange =
        (field: keyof ContactForm) =>
            (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setForm((prev) => ({ ...prev, [field]: e.target.value }))
            }

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof ContactForm, string>> = {}

        if (!form.nume.trim()) newErrors.nume = 'Numele este obligatoriu.'

        if (!form.email.trim()) {
            newErrors.email = 'Email-ul este obligatoriu.'
        } else if (!EMAIL_REGEX.test(form.email.trim())) {
            newErrors.email = 'Introdu o adresă de email validă.'
        }

        if (!form.mesaj.trim()) {
            newErrors.mesaj = 'Mesajul este obligatoriu.'
        } else if (form.mesaj.trim().length < 25) {
            newErrors.mesaj = 'Mesajul trebuie să aibă cel puțin 25 caractere.'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        console.log('mesaj trimis:', form)
        setSubmitted(true)
        setForm(initialState)
    }

    return (
        <>
            <section className="content-hero">
                <div className="container">
                    <h1>Contact</h1>
                    <p className="content-hero-subtitle">
                        Ai o întrebare, un feedback sau ai găsit o eroare? Scrie-ne.
                    </p>
                </div>
            </section>

            <section className="contact-body">
                <div className="container contact-grid">
                    <div className="contact-info">
                        <div className="contact-info-item">
                            <span className="contact-info-label">Email</span>
                            <a href="mailto:contact@finsim.md">contact@finsim.md</a>
                        </div>
                        <div className="contact-info-item">
                            <span className="contact-info-label">Locație</span>
                            <span>Chișinău, Moldova</span>
                        </div>
                        <div className="contact-info-item">
                            <span className="contact-info-label">Timp de răspuns</span>
                            <span>De obicei în 1-2 zile lucrătoare</span>
                        </div>
                    </div>

                    <div className="contact-form-wrap">
                        {submitted ? (
                            <div className="contact-success">
                                Mulțumim! Mesajul tău a fost trimis. Îți răspundem cât mai
                                curând posibil.
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit} noValidate>
                                <div className="form-field">
                                    <label htmlFor="nume">Nume</label>
                                    <input
                                        id="nume"
                                        type="text"
                                        value={form.nume}
                                        onChange={handleChange('nume')}
                                        placeholder="Numele tău"
                                    />
                                    {errors.nume && <span className="field-error">{errors.nume}</span>}
                                </div>

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

                                <div className="form-field">
                                    <label htmlFor="mesaj">Mesaj</label>
                                    <textarea
                                        id="mesaj"
                                        rows={5}
                                        value={form.mesaj}
                                        onChange={handleChange('mesaj')}
                                        placeholder="Scrie mesajul tău aici..."
                                    />
                                    {errors.mesaj && <span className="field-error">{errors.mesaj}</span>}
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg">
                                    Trimite mesajul
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

export default ContactPage