import '../../shared/ContentPage.css'

function AboutPage() {
    return (
        <>
            <section className="content-hero">
                <div className="container">
                    <h1>Despre FinSim</h1>
                    <p className="content-hero-subtitle">
                        Un proiect făcut ca să umple un gol real: educația financiară practică
                        pentru tineri.
                    </p>
                </div>
            </section>

            <section className="content-body">
                <div className="container">
                    <div className="content-section">
                        <h2>De ce există FinSim</h2>
                        <p>
                            Majoritatea tinerilor iau primele decizii financiare importante —
                            primul salariu, prima chirie, primul credit — fără să fi exersat
                            vreodată aceste situații. Școala oferă rareori o pregătire practică,
                            iar băncile oferă calculatoare, nu educație.
                        </p>
                        <p>
                            FinSim încearcă să rezolve exact atât: un loc unde poți greși în mod
                            controlat, fără să-ți pui în pericol banii reali, și unde vezi imediat
                            consecințele deciziilor tale financiare.
                        </p>
                    </div>

                    <div className="content-section">
                        <h2>Cum funcționează ideea</h2>
                        <p>
                            În loc de articole sau cursuri teoretice, FinSim pune utilizatorul
                            direct în situație: alege un scenariu de viață, ia decizii pas cu pas
                            despre cum cheltuiește, economisește sau împrumută, și primește la
                            final un scor și sfaturi concrete, adaptate la alegerile făcute.
                        </p>
                    </div>

                    <div className="content-section">
                        <h2>Despre proiect</h2>
                        <p>
                            FinSim este dezvoltat ca proiect de practică, cu scopul de a explora
                            atât partea tehnică a unei aplicații complete (frontend, backend,
                            autentificare), cât și partea de impact real — educația financiară
                            fiind un subiect insuficient acoperit digital în Moldova.
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AboutPage