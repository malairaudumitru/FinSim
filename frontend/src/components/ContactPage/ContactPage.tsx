import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useMessages } from '../../shared/MessagesContext/MessagesContext'
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
    const { t } = useTranslation()
    const { addMessage } = useMessages()
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

        if (!form.nume.trim()) newErrors.nume = t('contact.error_nume_required')

        if (!form.email.trim()) {
            newErrors.email = t('contact.error_email_required')
        } else if (!EMAIL_REGEX.test(form.email.trim())) {
            newErrors.email = t('contact.error_email_invalid')
        }

        if (!form.mesaj.trim()) {
            newErrors.mesaj = t('contact.error_mesaj_required')
        } else if (form.mesaj.trim().length < 25) {
            newErrors.mesaj = t('contact.error_mesaj_length')
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        addMessage({
            nume: form.nume.trim(),
            email: form.email.trim(),
            mesaj: form.mesaj.trim(),
        })
        setSubmitted(true)
        setForm(initialState)
    }

    return (
        <>
            <section className="content-hero">
                <div className="container">
                    <h1>{t('contact.h1')}</h1>
                    <p className="content-hero-subtitle">
                        {t('contact.subtitle')}
                    </p>
                </div>
            </section>

            <section className="contact-body">
                <div className="container contact-grid">
                    <div className="contact-info">
                        <div className="contact-info-item">
                            <span className="contact-info-label">{t('contact.label_email')}</span>
                            <a href="mailto:contact@finsim.md">contact@finsim.md</a>
                        </div>
                        <div className="contact-info-item">
                            <span className="contact-info-label">{t('contact.label_location')}</span>
                            <span>Chișinău, Moldova</span>
                        </div>
                        <div className="contact-info-item">
                            <span className="contact-info-label">{t('contact.label_response_time')}</span>
                            <span>{t('contact.response_time_value')}</span>
                        </div>
                    </div>

                    <div className="contact-form-wrap">
                        {submitted ? (
                            <div className="contact-success">
                                {t('contact.success')}
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit} noValidate>
                                <div className="form-field">
                                    <label htmlFor="nume">{t('contact.label_nume')}</label>
                                    <input
                                        id="nume"
                                        type="text"
                                        value={form.nume}
                                        onChange={handleChange('nume')}
                                        placeholder={t('contact.placeholder_nume')}
                                    />
                                    {errors.nume && <span className="field-error">{errors.nume}</span>}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="email">{t('contact.label_email')}</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange('email')}
                                        placeholder={t('contact.placeholder_email')}
                                    />
                                    {errors.email && <span className="field-error">{errors.email}</span>}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="mesaj">{t('contact.label_mesaj')}</label>
                                    <textarea
                                        id="mesaj"
                                        rows={5}
                                        value={form.mesaj}
                                        onChange={handleChange('mesaj')}
                                        placeholder={t('contact.placeholder_mesaj')}
                                    />
                                    {errors.mesaj && <span className="field-error">{errors.mesaj}</span>}
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg">
                                    {t('contact.submit')}
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
