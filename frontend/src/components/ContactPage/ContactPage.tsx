import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { useMessages } from '../../shared/MessagesContext/MessagesContext'
import { useAuth } from '../../shared/AuthContext/AuthContext'
import '../../shared/ContentPage/ContentPage.css'
import './ContactPage.css'

function ContactPage() {
    const { t } = useTranslation()
    const { addMessage } = useMessages()
    const { isLoggedIn } = useAuth()
    const [mesaj, setMesaj] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMesaj(e.target.value)
    }

    const validate = (): boolean => {
        const trimmed = mesaj.trim()
        if (!trimmed) {
            setError(t('contact.error_mesaj_required'))
            return false
        }
        if (trimmed.length < 25) {
            setError(t('contact.error_mesaj_length'))
            return false
        }
        setError('')
        return true
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setSubmitting(true)
        try {
            await addMessage(mesaj.trim())
            setSubmitted(true)
            setMesaj('')
        } catch {
            setError(t('contact.error_submit_failed'))
        } finally {
            setSubmitting(false)
        }
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
                            <a href="mailto:adminfinsim@gmail.com">adminfinsim@gmail.com</a>
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
                        {!isLoggedIn ? (
                            <div className="contact-success">
                                {t('contact.login_required')}
                                <div style={{ marginTop: 16 }}>
                                    <Link to="/login" className="btn btn-primary">
                                        {t('contact.login_button')}
                                    </Link>
                                </div>
                            </div>
                        ) : submitted ? (
                            <div className="contact-success">
                                {t('contact.success')}
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit} noValidate>
                                <div className="form-field">
                                    <label htmlFor="mesaj">{t('contact.label_mesaj')}</label>
                                    <textarea
                                        id="mesaj"
                                        rows={5}
                                        value={mesaj}
                                        onChange={handleChange}
                                        placeholder={t('contact.placeholder_mesaj')}
                                    />
                                    {error && <span className="field-error">{error}</span>}
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
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
