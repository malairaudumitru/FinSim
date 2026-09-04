import { useState } from 'react'
import './HelpPage.css'

interface FaqItem {
    question: string
    answer: string
}

interface FaqCategory {
    title: string
    items: FaqItem[]
}

const faqData: FaqCategory[] = [
    {
        title: 'Despre FinSim',
        items: [
            {
                question: 'Ce este FinSim?',
                answer: 'FinSim este un simulator interactiv de educație financiară. Parcurgi scenarii de viață reale — primul salariu, chirie, credite — și înveți cum arată un buget echilibrat, fără să riști bani reali.',
            },
            {
                question: 'Este gratuit?',
                answer: 'Da, toate scenariile sunt gratuite. Nu îți cerem date de card și nu există un plan cu plată.',
            },
            {
                question: 'Cui i se adresează platforma?',
                answer: 'În principal tinerilor aflați la început de drum financiar — elevi de liceu, studenți sau oricine ia pentru prima dată decizii legate de salariu, chirie sau credite.',
            },
        ],
    },
    {
        title: 'Cont și date',
        items: [
            {
                question: 'Am nevoie de cont ca să încep un scenariu?',
                answer: 'Poți încerca un scenariu demo fără cont. Ca să-ți salvezi progresul și istoricul simulărilor, ai nevoie de un cont gratuit.',
            },
            {
                question: 'Ce se întâmplă cu datele mele?',
                answer: 'Folosim datele contului tău doar pentru a-ți salva progresul și rezultatele scenariilor. Nu vindem și nu partajăm datele cu terți.',
            },
            {
                question: 'Cum îmi resetez parola?',
                answer: 'Din pagina de autentificare, apeși pe „Ai uitat parola?” și introduci adresa de email. Vei primi un link de resetare.',
            },
        ],
    },
    {
        title: 'Scenarii și simulare',
        items: [
            {
                question: 'Ce sunt scenariile?',
                answer: 'Fiecare scenariu simulează o situație financiară reală, împărțită în decizii pas cu pas. La final vezi un scor și sfaturi personalizate în funcție de alegerile tale.',
            },
            {
                question: 'Sumele din simulare sunt bani reali?',
                answer: 'Nu. Toate sumele sunt fictive, folosite doar pentru a ilustra efectul deciziilor tale asupra unui buget.',
            },
            {
                question: 'Pot relua un scenariu de mai multe ori?',
                answer: 'Da, poți relua orice scenariu oricând, ca să încerci strategii diferite și să-ți compari scorurile.',
            },
            {
                question: 'Cum se calculează scorul final?',
                answer: 'Scorul ține cont de echilibrul dintre cheltuieli și economii, de existența unui fond de urgență și de deciziile luate în momentele critice ale scenariului.',
            },
        ],
    },
    {
        title: 'Tehnic',
        items: [
            {
                question: 'Pe ce dispozitive funcționează FinSim?',
                answer: 'FinSim funcționează în orice browser modern, atât pe calculator, cât și pe telefon sau tabletă.',
            },
            {
                question: 'Am găsit o eroare, cum raportez?',
                answer: 'Scrie-ne la adresa de contact din subsolul paginii, descriind ce s-a întâmplat și în ce scenariu ai întâlnit problema.',
            },
        ],
    },
]

function FaqRow({ item, index }: { item: FaqItem; index: number }) {
    const [open, setOpen] = useState(false)

    return (
        <div className={`faq-item ${open ? 'open' : ''}`}>
            <button
                type="button"
                className="faq-question"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
            >
                <span className="faq-index figure">{String(index + 1).padStart(2, '0')}</span>
                <span className="faq-question-text">{item.question}</span>
                <span className="faq-toggle figure">{open ? '−' : '+'}</span>
            </button>
            {open && <p className="faq-answer">{item.answer}</p>}
        </div>
    )
}

function HelpPage() {
    return (
        <>
            <section className="faq-hero">
                <div className="container">
                    <h1>Întrebări frecvente</h1>
                    <p className="faq-hero-subtitle">
                        Tot ce trebuie să știi despre FinSim, scenarii și cont.
                    </p>
                </div>
            </section>

            <section className="faq-body">
                <div className="container">
                    {faqData.map((category) => (
                        <div className="faq-category" key={category.title}>
                            <h2>{category.title}</h2>
                            <div className="faq-list">
                                {category.items.map((item, i) => (
                                    <FaqRow item={item} index={i} key={item.question} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default HelpPage