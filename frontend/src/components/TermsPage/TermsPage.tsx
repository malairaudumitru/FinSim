import '../../shared/ContentPage/ContentPage.css'

function TermsPage() {
    return (
        <>
            <section className="content-hero">
                <div className="container">
                    <h1>Termeni și condiții</h1>
                    <p className="content-hero-subtitle">
                        Ce trebuie să știi înainte să folosești FinSim.
                    </p>
                </div>
            </section>

            <section className="content-body">
                <div className="container">
                    <p className="content-updated">Ultima actualizare: septembrie 2026</p>

                    <div className="content-section">
                        <h2>1. Introducere</h2>
                        <p>
                            Acest document este orientativ și a fost elaborat în scop educațional,
                            ca parte a unui proiect de practică. Nu constituie un contract cu
                            valoare juridică deplină. Prin utilizarea platformei FinSim, ești de
                            acord cu principiile descrise mai jos.
                        </p>
                    </div>

                    <div className="content-section">
                        <h2>2. Scopul platformei</h2>
                        <p>
                            FinSim este un simulator educațional. Toate scenariile, sumele de
                            bani și deciziile financiare prezentate sunt fictive și au rolul de
                            a ilustra concepte de educație financiară. Nimic din platformă nu
                            constituie consultanță financiară, bancară sau de investiții reală.
                        </p>
                    </div>

                    <div className="content-section">
                        <h2>3. Contul de utilizator</h2>
                        <p>
                            Pentru a-ți salva progresul și istoricul simulărilor, ai nevoie de un
                            cont. Ești responsabil pentru confidențialitatea datelor de
                            autentificare și pentru orice activitate derulată din contul tău.
                        </p>
                    </div>

                    <div className="content-section">
                        <h2>4. Datele tale</h2>
                        <ul>
                            <li>Folosim datele contului doar pentru funcționarea platformei (salvarea progresului, autentificare).</li>
                            <li>Nu vindem și nu partajăm datele tale cu terți în scopuri comerciale.</li>
                            <li>Poți solicita oricând ștergerea contului și a datelor asociate.</li>
                        </ul>
                    </div>

                    <div className="content-section">
                        <h2>5. Limitări</h2>
                        <p>
                            FinSim este oferit „ca atare", fără garanții privind disponibilitatea
                            neîntreruptă a serviciului. Fiind un proiect educațional aflat în
                            dezvoltare, pot apărea erori sau modificări ale funcționalităților
                            fără notificare prealabilă.
                        </p>
                    </div>

                    <div className="content-section">
                        <h2>6. Modificări ale termenilor</h2>
                        <p>
                            Acești termeni pot fi actualizați pe măsură ce platforma evoluează.
                            Data ultimei actualizări este afișată în partea de sus a acestei
                            pagini.
                        </p>
                    </div>

                    <div className="content-section">
                        <h2>7. Contact</h2>
                        <p>
                            Pentru întrebări legate de acești termeni, ne poți scrie la{' '}
                            <a href="mailto:contact@finsim.md">contact@finsim.md</a>.
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default TermsPage