import './HomePage.css'

const products = [
    {
        name: 'Credit Ipotecar',
        desc: 'Finanțează achiziția locuinței tale cu dobânzi avantajoase pe termen lung.',
        rate: 'de la 4.9%',
    },
    {
        name: 'Credit Auto',
        desc: 'Cumpără mașina dorită acum și plătește în rate flexibile.',
        rate: 'de la 6.2%',
    },
    {
        name: 'Credit Nevoi Personale',
        desc: 'Bani rapizi pentru orice proiect, fără garanții suplimentare.',
        rate: 'de la 7.5%',
    },
    {
        name: 'Credit pentru Afaceri',
        desc: 'Susține-ți afacerea cu finanțare adaptată nevoilor tale.',
        rate: 'de la 5.8%',
    },
]

const steps = [
    {
        title: 'Completezi cererea online',
        desc: 'Alegi produsul financiar și introduci datele necesare în câteva minute.',
    },
    {
        title: 'Analizăm cererea',
        desc: 'Echipa noastră evaluează cererea și îți răspunde în maxim 24 de ore.',
    },
    {
        title: 'Primești banii',
        desc: 'După aprobare, suma solicitată ajunge direct în contul tău.',
    },
]

const testimonials = [
    {
        name: 'Andreea M.',
        text: 'Am obținut creditul auto în doar două zile. Procesul online a fost extrem de simplu.',
        rating: 5,
    },
    {
        name: 'Vlad T.',
        text: 'Calculatorul de credit m-a ajutat să înțeleg exact cât voi plăti lunar. Recomand!',
        rating: 5,
    },
    {
        name: 'Cristina D.',
        text: 'Suport rapid și transparență totală în privința dobânzilor și a comisioanelor.',
        rating: 4,
    },
]

const stats = [
    { value: '15+', label: 'ani de experiență' },
    { value: '50.000+', label: 'clienți mulțumiți' },
    { value: '€200M', label: 'valoare creditată' },
    { value: '24h', label: 'timp mediu de răspuns' },
]

function HomePage() {
    return (
        <>
            <section className="hero">
                <h1>Creditul potrivit, fără bătăi de cap.</h1>
                <p className="hero-subtitle">
                    Aplică online, urmărește-ți cererea în timp real și gestionează-ți
                    creditele dintr-un singur loc.
                </p>
                <div className="hero-actions">
                    <button className="btn btn-primary btn-lg">Depune o cerere</button>
                    <button className="btn btn-ghost btn-lg">Calculează rata</button>
                </div>
            </section>

            <section className="stats">
                {stats.map((s) => (
                    <div className="stat" key={s.label}>
                        <span className="stat-value">{s.value}</span>
                        <span className="stat-label">{s.label}</span>
                    </div>
                ))}
            </section>

            <section id="products" className="products">
                <div className="section-heading">
                    <h2>Produse financiare</h2>
                    <p className="section-subtitle">
                        Alege creditul potrivit nevoilor tale.
                    </p>
                </div>
                <div className="products-grid">
                    {products.map((p) => (
                        <div className="product-card" key={p.name}>
                            <h3>{p.name}</h3>
                            <p>{p.desc}</p>
                            <span className="product-rate">{p.rate}</span>
                            <button className="btn btn-link">Vezi detalii →</button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="how-it-works">
                <div className="section-heading">
                    <h2>Cum funcționează</h2>
                </div>
                <div className="steps">
                    {steps.map((step, i) => (
                        <div className="step" key={step.title}>
                            <span className="step-number">{i + 1}</span>
                            <h3>{step.title}</h3>
                            <p>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="reviews" className="reviews">
                <div className="section-heading">
                    <h2>Ce spun clienții noștri</h2>
                </div>
                <div className="reviews-grid">
                    {testimonials.map((t) => (
                        <div className="review-card" key={t.name}>
                            <div className="review-rating">
                                {'★'.repeat(t.rating)}
                                {'☆'.repeat(5 - t.rating)}
                            </div>
                            <p className="review-text">"{t.text}"</p>
                            <span className="review-author">{t.name}</span>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default HomePage