export interface ScenarioOption {
    id: string
    eticheta: string
    bani: number
    puncte: number
    stres?: number
    scorCredit?: number
    scorMinim?: number
    feedback: string
}

export interface AllocationCategory {
    id: string
    eticheta: string
    min: number
    max: number
    implicit: number
}

export interface AllocationStepDef {
    totalDisponibil: number
    categorii: AllocationCategory[]
    puncteMaxime: number
}

export interface MultiSelectItem {
    id: string
    eticheta: string
    bani: number
    puncte: number
    stres?: number
}

export interface MultiSelectStepDef {
    itemi: MultiSelectItem[]
    puncteMaxime: number
}

export interface TimePressureStepDef {
    secunde: number
    optiuni: ScenarioOption[]
    optiuneTimeout: ScenarioOption
}

export interface OfertaCredit {
    id: string
    eticheta: string
    dobanda: number
    durataLuni: number
    rataLunara: number
    costTotal: number
    bani: number
    puncte: number
    scorCredit?: number
    stres?: number
    feedback: string
}

export interface ComparatieOferteStepDef {
    suma: number
    oferte: OfertaCredit[]
}

export interface AdevaratFalsIntrebare {
    id: string
    afirmatie: string
    raspunsCorect: boolean
    explicatie: string
    puncte: number
}

export interface AdevaratFalsStepDef {
    intrebari: AdevaratFalsIntrebare[]
}

export interface ScenarioStep {
    id: string
    intrebare: string
    context?: string
    tip?: 'alegere' | 'alocare' | 'selectie-multipla' | 'presiune-timp' | 'comparatie-oferte' | 'adevarat-fals'
    optiuni: ScenarioOption[]
    alocare?: AllocationStepDef
    selectieMultipla?: MultiSelectStepDef
    presiuneTimp?: TimePressureStepDef
    comparatieOferte?: ComparatieOferteStepDef
    adevaratFals?: AdevaratFalsStepDef
}

export interface ScenarioDef {
    slug: string
    nume: string
    descriere: string
    dificultate: string
    soldInitial: number
    necesitaCont: boolean
    scorCreditInitial?: number
    pasi: ScenarioStep[]
}

export const scenarios: ScenarioDef[] = [
    {
        slug: 'primul-salariu',
        nume: 'Primul salariu',
        descriere:
            'Primești primul salariu și trebuie să-l împarți pe chirie, mâncare, transport și economii.',
        dificultate: 'Ușor',
        soldInitial: 8500,
        necesitaCont: false,
        pasi: [
            {
                id: 'chirie',
                intrebare: 'Ai primit salariul de 8 500 lei. Unde locuiești luna asta?',
                optiuni: [
                    {
                        id: 'apartament',
                        eticheta: 'Închiriezi un apartament decent, 2 500 lei/lună',
                        bani: -2500,
                        puncte: 15,
                        feedback:
                            'O alegere echilibrată — ai propriul spațiu, dar chiria îți ia aproape 30% din salariu.',
                    },
                    {
                        id: 'camera',
                        eticheta: 'Alegi o cameră mai ieftină, mai departe de muncă, 1 500 lei/lună',
                        bani: -1500,
                        puncte: 20,
                        feedback:
                            'Economisești 1 000 lei lunar, dar navetele mai lungi te costă timp și energie.',
                    },
                    {
                        id: 'parinti',
                        eticheta: 'Stai la părinți încă un timp, fără chirie',
                        bani: 0,
                        puncte: 25,
                        feedback:
                            'Financiar, cea mai eficientă alegere — dar amâni independența.',
                    },
                ],
            },
            {
                id: 'mancare',
                intrebare: 'Cum te descurci cu mâncarea în fiecare lună?',
                optiuni: [
                    {
                        id: 'gatit',
                        eticheta: 'Gătești acasă, buget ~900 lei',
                        bani: -900,
                        puncte: 25,
                        feedback: 'Cea mai eficientă variantă — mănânci bine și cheltui puțin.',
                    },
                    {
                        id: 'comenzi',
                        eticheta: 'Comanzi des mâncare, ~1 800 lei',
                        bani: -1800,
                        puncte: 10,
                        feedback: 'Confortabil, dar costă dublu față de gătit acasă.',
                    },
                    {
                        id: 'combinat',
                        eticheta: 'Combini gătitul cu câteva comenzi, ~1 300 lei',
                        bani: -1300,
                        puncte: 18,
                        feedback: 'Un echilibru rezonabil între confort și cost.',
                    },
                ],
            },
            {
                id: 'economii',
                intrebare: 'Ai bani rămași după cheltuielile fixe. Ce faci cu ei?',
                optiuni: [
                    {
                        id: 'fond-urgenta',
                        eticheta: 'Pui deoparte 20% din salariu într-un fond de urgență',
                        bani: -1700,
                        puncte: 25,
                        feedback: 'Exact ce recomandă orice sfat de educație financiară.',
                    },
                    {
                        id: 'nimic',
                        eticheta: 'Nu economisești nimic luna asta',
                        bani: 0,
                        puncte: 5,
                        feedback: 'Fără fond de urgență, orice cheltuială neprevăzută te lasă descoperit.',
                    },
                    {
                        id: 'putin',
                        eticheta: 'Economisești puțin, 500 lei',
                        bani: -500,
                        puncte: 15,
                        feedback: 'Un început — nu ideal, dar mai bine decât nimic.',
                    },
                ],
            },
            {
                id: 'urgenta',
                intrebare: 'Mașina de spălat s-a stricat. Reparația costă 800 lei. Ce faci?',
                optiuni: [
                    {
                        id: 'fond',
                        eticheta: 'Plătești din fondul de urgență, dacă ai unul',
                        bani: -800,
                        puncte: 25,
                        feedback: 'Exact la asta servește un fond de urgență — o cheltuială neprevăzută, absorbită fără stres.',
                    },
                    {
                        id: 'credit-rapid',
                        eticheta: 'Iei un credit rapid, cu dobândă mare',
                        bani: -1000,
                        puncte: 5,
                        feedback: 'Rezolvi urgența azi, dar plătești 200 lei în plus doar pe dobândă.',
                    },
                    {
                        id: 'amani',
                        eticheta: 'Amâni reparația și speli rufele la o rudă',
                        bani: 0,
                        puncte: 15,
                        feedback: 'Nu te costă nimic acum, dar disconfortul se adună.',
                    },
                ],
            },
        ],
    },
    {
        slug: 'chirie-si-facturi',
        nume: 'Chirie și facturi',
        descriere: 'Te muți singur și afli cât de repede se adună facturile lunare peste chirie.',
        dificultate: 'Mediu',
        soldInitial: 6000,
        necesitaCont: true,
        pasi: [
            {
                id: 'alocare-buget',
                intrebare: 'Ai 6 000 lei venit lunar. Împarte bugetul pe chirie, utilități și economii.',
                context:
                    'Restul rămâne pentru mâncare și cheltuieli variabile — mișcă sliderele ca să vezi efectul.',
                tip: 'alocare',
                optiuni: [],
                alocare: {
                    totalDisponibil: 6000,
                    puncteMaxime: 25,
                    categorii: [
                        { id: 'chirie', eticheta: 'Chirie', min: 1500, max: 3500, implicit: 2500 },
                        { id: 'utilitati', eticheta: 'Utilități (curent, apă, gaz)', min: 300, max: 1200, implicit: 600 },
                        { id: 'economii', eticheta: 'Economii', min: 0, max: 2000, implicit: 400 },
                    ],
                },
            },
            {
                id: 'internet',
                intrebare: 'Alegi un abonament de internet și televiziune.',
                optiuni: [
                    {
                        id: 'mobil',
                        eticheta: 'Fără abonament fix, doar internet mobil, ~80 lei',
                        bani: -80,
                        puncte: 25,
                        feedback: 'Cea mai ieftină variantă — suficientă dacă nu ai nevoie de televiziune.',
                    },
                    {
                        id: 'economic',
                        eticheta: 'Pachet economic internet + TV de bază, 150 lei',
                        bani: -150,
                        puncte: 20,
                        feedback: 'Rezonabil — acoperă nevoile de bază fără să exagerezi.',
                    },
                    {
                        id: 'premium',
                        eticheta: 'Pachet premium cu toate canalele, 350 lei',
                        bani: -350,
                        puncte: 8,
                        feedback: 'Confortabil, dar 350 lei lunar pentru TV e mult pentru bugetul tău.',
                    },
                ],
            },
            {
                id: 'transport',
                intrebare: 'Cum ajungi zilnic la muncă?',
                optiuni: [
                    {
                        id: 'jos',
                        eticheta: 'Mergi pe jos sau cu bicicleta, 0 lei',
                        bani: 0,
                        puncte: 25,
                        feedback: 'Gratuit și sănătos — cea mai bună variantă, dacă distanța permite.',
                    },
                    {
                        id: 'transport-public',
                        eticheta: 'Abonament transport public, 250 lei',
                        bani: -250,
                        puncte: 18,
                        feedback: 'Rezonabil — rapid și previzibil ca și cost lunar.',
                    },
                    {
                        id: 'masina',
                        eticheta: 'Folosești mașina personală, ~600 lei (combustibil + parcare)',
                        bani: -600,
                        puncte: 8,
                        feedback: 'Confortabil, dar de departe cea mai scumpă variantă lunar.',
                    },
                ],
            },
            {
                id: 'factura-neasteptata',
                intrebare:
                    'Primești o factură de întreținere cu 450 lei mai mare decât te așteptai. Ce faci?',
                context: 'Un eveniment neprevăzut — exact genul de situație care testează un buget real.',
                optiuni: [
                    {
                        id: 'platesti-integral',
                        eticheta: 'Plătești integral acum, din economii',
                        bani: -450,
                        puncte: 20,
                        stres: 5,
                        feedback: 'Rezolvi imediat, dar îți golești economiile mai repede decât ai plănuit.',
                    },
                    {
                        id: 'amani',
                        eticheta: 'Amâni plata pentru luna viitoare',
                        bani: 0,
                        puncte: 5,
                        stres: 20,
                        feedback: 'Nu plătești acum, dar penalizările de întârziere vor costa mai mult pe termen lung.',
                    },
                    {
                        id: 'esalonezi',
                        eticheta: 'Suni administrația și negociezi plata în 2 rate',
                        bani: -225,
                        puncte: 25,
                        stres: 0,
                        feedback: 'Cea mai echilibrată soluție — reduci presiunea imediată fără să acumulezi penalizări.',
                    },
                ],
            },
            {
                id: 'reduceri',
                intrebare: 'Bugetul e strâns luna asta. Ce cheltuieli reduci? (poți alege mai multe)',
                context: 'Bifează orice combinație — fiecare reducere își are prețul ei, nu doar financiar.',
                tip: 'selectie-multipla',
                optiuni: [],
                selectieMultipla: {
                    puncteMaxime: 25,
                    itemi: [
                        {
                            id: 'sala',
                            eticheta: 'Renunți temporar la abonamentul de sală (150 lei)',
                            bani: 150,
                            puncte: 6,
                            stres: 5,
                        },
                        {
                            id: 'gatit',
                            eticheta: 'Gătești mai mult acasă în loc să comanzi (300 lei)',
                            bani: 300,
                            puncte: 19,
                            stres: 0,
                        },
                        {
                            id: 'haine',
                            eticheta: 'Amâni cumpărarea unei haine noi (200 lei)',
                            bani: 200,
                            puncte: 6,
                            stres: 3,
                        },
                        {
                            id: 'streaming',
                            eticheta: 'Anulezi un abonament de streaming nefolosit (60 lei)',
                            bani: 60,
                            puncte: 6,
                            stres: 0,
                        },
                    ],
                },
            },
            {
                id: 'vecin',
                intrebare:
                    'Vecinul de la etaj se plânge de zgomot și amenință că cheamă administrația. Cum reacționezi?',
                optiuni: [
                    {
                        id: 'ignori',
                        eticheta: 'Ignori — nu crezi că e chiar o problemă',
                        bani: 0,
                        puncte: 5,
                        stres: 15,
                        feedback: 'Conflictul rămâne nerezolvat și tensiunea crește pe termen lung.',
                    },
                    {
                        id: 'discuti',
                        eticheta: 'Discuți calm cu el și găsiți un compromis',
                        bani: 0,
                        puncte: 25,
                        stres: 0,
                        feedback: 'Cea mai bună variantă — rezolvi conflictul fără costuri și fără stres inutil.',
                    },
                    {
                        id: 'hotel',
                        eticheta: 'Te muți la un hotel câteva zile, ca să eviți conflictul',
                        bani: -400,
                        puncte: 10,
                        stres: 10,
                        feedback: 'Eviți tensiunea imediată, dar plătești pentru asta — literal.',
                    },
                ],
            },
            {
                id: 'reflectie-finala',
                intrebare: 'Ai ajuns la finalul lunii. Ce faci cu ce a mai rămas din buget?',
                optiuni: [
                    {
                        id: 'economii-suplimentare',
                        eticheta: 'Pui tot ce a mai rămas în fondul de economii',
                        bani: 0,
                        puncte: 25,
                        feedback: 'Excelent — orice surplus pus deoparte crește reziliența bugetului tău pe viitor.',
                    },
                    {
                        id: 'jumate-jumate',
                        eticheta: 'Împarți: jumătate economii, jumătate ceva ce-ți dorești',
                        bani: -100,
                        puncte: 18,
                        feedback: 'Un echilibru sănătos — te bucuri puțin, fără să neglijezi viitorul.',
                    },
                    {
                        id: 'cheltuiesti-tot',
                        eticheta: 'Cheltuiești tot pe ceva ce-ți dorești de mult',
                        bani: -200,
                        puncte: 8,
                        feedback: 'Meriți și tu ceva — dar luna viitoare pornești fără nicio rezervă.',
                    },
                ],
            },
        ],
    },
    {
        slug: 'urgenta-medicala',
        nume: 'Urgență medicală',
        descriere: 'O cheltuială neprevăzută îți testează fondul de urgență — sau lipsa lui.',
        dificultate: 'Mediu',
        soldInitial: 5500,
        necesitaCont: true,
        pasi: [
            {
                id: 'declansare',
                intrebare: 'Cineva apropiat se simte brusc foarte rău. Ce faci?',
                optiuni: [
                    {
                        id: 'suni-salvarea',
                        eticheta: 'Suni serviciul de urgență (112)',
                        bani: 0,
                        puncte: 25,
                        stres: 0,
                        feedback: 'Gratuit, rapid și exact procedura corectă într-o urgență reală.',
                    },
                    {
                        id: 'duci-tu',
                        eticheta: 'Îl duci tu, cu mașina, direct la spital',
                        bani: -100,
                        puncte: 15,
                        stres: 15,
                        feedback: 'Poate ajungi la fel de repede, dar riști mult conducând stresat, fără pregătire medicală la bord.',
                    },
                    {
                        id: 'astepti',
                        eticheta: 'Aștepți să vezi dacă îi trece',
                        bani: 0,
                        puncte: 0,
                        stres: 25,
                        feedback: 'Amânarea într-o urgență reală poate agrava mult situația.',
                    },
                ],
            },
            {
                id: 'internare',
                intrebare: 'La camera de gardă, medicul are nevoie de decizia ta acum — pentru internare.',
                context: 'Ai la dispoziție doar câteva secunde să alegi — exact cum se simte o urgență reală.',
                tip: 'presiune-timp',
                optiuni: [],
                presiuneTimp: {
                    secunde: 15,
                    optiuni: [
                        {
                            id: 'stat',
                            eticheta: 'Internare de urgență, secție de stat',
                            bani: -300,
                            puncte: 25,
                            stres: 0,
                            feedback: 'Cost minim, tratament garantat — exact ce trebuie într-o urgență.',
                        },
                        {
                            id: 'privat',
                            eticheta: 'Internare privată, imediat',
                            bani: -1800,
                            puncte: 15,
                            stres: 0,
                            feedback: 'Confort maxim, dar costă de șase ori mai mult decât varianta de stat.',
                        },
                        {
                            id: 'gandire',
                            eticheta: 'Ceri câteva minute să suni pe cineva',
                            bani: 0,
                            puncte: 10,
                            stres: 10,
                            feedback: 'Ai câștigat timp de gândire, dar personalul medical așteaptă un răspuns.',
                        },
                    ],
                    optiuneTimeout: {
                        id: 'timeout',
                        eticheta: 'Timp expirat',
                        bani: -1800,
                        puncte: 0,
                        stres: 30,
                        feedback: 'Timpul a expirat — personalul a decis pentru tine, la varianta cea mai scumpă disponibilă.',
                    },
                },
            },
            {
                id: 'investigatii',
                intrebare: 'Medicul recomandă un set de analize suplimentare. Ce alegi?',
                optiuni: [
                    {
                        id: 'complete',
                        eticheta: 'Faci toate analizele recomandate, 600 lei',
                        bani: -600,
                        puncte: 25,
                        feedback: 'Cost mai mare acum, dar diagnostic complet, fără riscuri ascunse.',
                    },
                    {
                        id: 'minime',
                        eticheta: 'Doar analizele esențiale, 250 lei',
                        bani: -250,
                        puncte: 18,
                        feedback: 'Rezonabil — acoperă principalele riscuri fără cheltuieli inutile.',
                    },
                    {
                        id: 'refuzi',
                        eticheta: 'Refuzi analizele suplimentare, ca să economisești',
                        bani: 0,
                        puncte: 5,
                        stres: 15,
                        feedback: 'Economisești acum, dar rișți să ratezi o problemă reală, nedescoperită la timp.',
                    },
                ],
            },
            {
                id: 'medicamente',
                intrebare: 'Ce cumperi din lista prescrisă de medic? (poți alege mai multe)',
                context: 'Nu tot ce e pe listă e strict necesar — alege cu grijă.',
                tip: 'selectie-multipla',
                optiuni: [],
                selectieMultipla: {
                    puncteMaxime: 22,
                    itemi: [
                        {
                            id: 'antibiotic',
                            eticheta: 'Antibiotic prescris — necesar, 120 lei',
                            bani: -120,
                            puncte: 10,
                        },
                        {
                            id: 'fizioterapie',
                            eticheta: 'Ședințe de recuperare fizioterapie, 350 lei',
                            bani: -350,
                            puncte: 12,
                        },
                        {
                            id: 'suplimente',
                            eticheta: 'Suplimente recomandate, dar opționale, 200 lei',
                            bani: -200,
                            puncte: 0,
                        },
                    ],
                },
            },
            {
                id: 'recuperare',
                intrebare: 'Cum abordezi perioada de recuperare?',
                optiuni: [
                    {
                        id: 'concediu',
                        eticheta: 'Iei concediu medical, te odihnești complet',
                        bani: -100,
                        puncte: 25,
                        feedback: 'Recuperare corectă — corpul are nevoie de timp real, nu doar de tratament.',
                    },
                    {
                        id: 'part-time',
                        eticheta: 'Revii treptat, cu program redus',
                        bani: 0,
                        puncte: 18,
                        feedback: 'Un compromis rezonabil între recuperare și venit.',
                    },
                    {
                        id: 'imediat',
                        eticheta: 'Revii imediat la programul normal',
                        bani: 0,
                        puncte: 5,
                        stres: 20,
                        feedback: 'Rișți o recădere — corpul nu s-a refăcut complet încă.',
                    },
                ],
            },
            {
                id: 'reflectie-finala',
                intrebare: 'Fondul de urgență s-a golit mult. Ce faci acum?',
                optiuni: [
                    {
                        id: 'reconstruiesti',
                        eticheta: 'Începi imediat să reconstruiești fondul de urgență',
                        bani: -200,
                        puncte: 25,
                        feedback: 'Exact instinctul corect — completezi din nou rezerva, cât mai curând.',
                    },
                    {
                        id: 'amani',
                        eticheta: 'Amâni economisirea — ai alte priorități acum',
                        bani: 0,
                        puncte: 8,
                        feedback: 'Ok pe termen scurt, dar rămâi vulnerabil la o nouă urgență.',
                    },
                    {
                        id: 'imprumuti',
                        eticheta: 'Iei un mic împrumut, ca să acoperi golul din buget',
                        bani: -150,
                        puncte: 5,
                        stres: 10,
                        feedback: 'Rezolvi golul imediat, dar adaugi o datorie nouă peste o urgență deja costisitoare.',
                    },
                ],
            },
        ],
    },
    {
        slug: 'primul-credit',
        nume: 'Primul credit',
        descriere: 'Ai nevoie de bani în plus. Alegi un credit — dar știi cât te costă cu adevărat?',
        dificultate: 'Avansat',
        soldInitial: 4000,
        necesitaCont: true,
        scorCreditInitial: 50,
        pasi: [
            {
                id: 'motiv',
                intrebare: 'Ai nevoie de un credit de 15 000 lei. De ce, de fapt?',
                optiuni: [
                    {
                        id: 'necesitate',
                        eticheta: 'Laptop nou, necesar pentru serviciu',
                        bani: 0,
                        puncte: 25,
                        scorCredit: 10,
                        feedback: 'O necesitate reală — exact semnalul pe care orice creditor îl vrea să-l vadă.',
                    },
                    {
                        id: 'cheltuiala-neasteptata',
                        eticheta: 'O reparație urgentă la mașină',
                        bani: 0,
                        puncte: 20,
                        scorCredit: 5,
                        feedback: 'Rezonabil — tot o necesitate, deși neplanificată.',
                    },
                    {
                        id: 'vacanta',
                        eticheta: 'O vacanță pe care ți-o dorești de mult',
                        bani: 0,
                        puncte: 5,
                        scorCredit: -10,
                        stres: 10,
                        feedback: 'Împrumuturile pentru dorințe, nu pentru nevoi, sunt cel mai riscant tip de datorie.',
                    },
                ],
            },
            {
                id: 'comparatie-oferte',
                intrebare: 'Compară trei oferte de credit pentru cei 15 000 lei.',
                context: 'Rata lunară mică nu înseamnă automat cel mai ieftin credit — uită-te la costul total.',
                tip: 'comparatie-oferte',
                optiuni: [],
                comparatieOferte: {
                    suma: 15000,
                    oferte: [
                        {
                            id: 'banca-traditionala',
                            eticheta: 'Bancă tradițională',
                            dobanda: 8.9,
                            durataLuni: 24,
                            rataLunara: 685,
                            costTotal: 16440,
                            puncte: 25,
                            scorCredit: 15,
                            bani: -685,
                            feedback:
                                'Cea mai ieftină variantă per total — deși actele durează ceva mai mult.',
                        },
                        {
                            id: 'credit-rapid-online',
                            eticheta: 'Credit rapid online',
                            dobanda: 15.5,
                            durataLuni: 24,
                            rataLunara: 730,
                            costTotal: 17520,
                            puncte: 15,
                            scorCredit: 5,
                            bani: -730,
                            feedback: 'Aprobare instant, dar costă cu aproape 1 100 lei mai mult pe total.',
                        },
                        {
                            id: 'cumparaturi-in-rate',
                            eticheta: 'Cumpărături în rate (magazin)',
                            dobanda: 22,
                            durataLuni: 18,
                            rataLunara: 1010,
                            costTotal: 18180,
                            puncte: 5,
                            scorCredit: -5,
                            stres: 5,
                            bani: -1010,
                            feedback:
                                'Rata pare similară, dar fără garanții dobânda reală e mult mai mare — cea mai scumpă opțiune.',
                        },
                    ],
                },
            },
            {
                id: 'garantie',
                intrebare: 'Ce tip de garanție alegi pentru credit?',
                optiuni: [
                    {
                        id: 'asigurare',
                        eticheta: 'Asigurare de viață pe durata creditului, +45 lei/lună',
                        bani: -45,
                        puncte: 20,
                        scorCredit: 10,
                        feedback: 'Cost mic în plus, dar te protejează pe tine și familia în caz de imprevizibil.',
                    },
                    {
                        id: 'girant',
                        eticheta: 'Aduci un girant, fără cost suplimentar',
                        bani: 0,
                        puncte: 15,
                        scorCredit: 5,
                        feedback: 'Reduce riscul băncii, dar pune presiune pe altcineva dacă nu poți plăti.',
                    },
                    {
                        id: 'fara-garantie',
                        eticheta: 'Fără nimic suplimentar',
                        bani: 0,
                        puncte: 8,
                        scorCredit: -5,
                        stres: 10,
                        feedback: 'Mai simplu acum, dar cea mai riscantă variantă — și de multe ori, mai scumpă per total.',
                    },
                ],
            },
            {
                id: 'quiz-credit',
                intrebare: 'Adevărat sau fals? Testează-ți cunoștințele despre credite.',
                tip: 'adevarat-fals',
                optiuni: [],
                adevaratFals: {
                    intrebari: [
                        {
                            id: 'dae',
                            afirmatie: 'DAE (dobânda anuală efectivă) include toate comisioanele, nu doar dobânda nominală.',
                            raspunsCorect: true,
                            explicatie: 'Corect — DAE e singura cifră care arată costul real al unui credit.',
                            puncte: 9,
                        },
                        {
                            id: 'intarziere',
                            afirmatie: 'Dacă întârzii o rată, doar acea rată crește — restul creditului rămâne neschimbat.',
                            raspunsCorect: false,
                            explicatie:
                                'Fals — întârzierile pot genera penalizări și îți pot scădea scorul de credit pentru ani de zile.',
                            puncte: 8,
                        },
                        {
                            id: 'rata-mica',
                            afirmatie: 'Un credit cu rată lunară mai mică este întotdeauna mai ieftin pe termen lung.',
                            raspunsCorect: false,
                            explicatie:
                                'Fals — o rată mai mică vine adesea dintr-o durată mai lungă, ceea ce poate crește costul total.',
                            puncte: 8,
                        },
                    ],
                },
            },
            {
                id: 'eveniment-rata',
                intrebare: 'La a 6-a rată, pierzi temporar o parte din venit. Ce faci?',
                optiuni: [
                    {
                        id: 'reesalonare',
                        eticheta: 'Suni banca și ceri reeșalonarea temporară',
                        bani: 0,
                        puncte: 25,
                        scorCredit: 5,
                        stres: 0,
                        feedback: 'Exact procedura corectă — băncile preferă să reeșaloneze decât să piardă clientul.',
                    },
                    {
                        id: 'sari-rata',
                        eticheta: 'Sari peste rată fără să anunți banca',
                        bani: 0,
                        puncte: 0,
                        scorCredit: -25,
                        stres: 20,
                        feedback: 'Cel mai dăunător — îți afectează scorul de credit pentru ani de zile.',
                    },
                    {
                        id: 'imprumut-cineva',
                        eticheta: 'Împrumuți bani de la cineva apropiat, ca să acoperi rata',
                        bani: 0,
                        puncte: 15,
                        stres: 10,
                        feedback: 'Rezolvi pe termen scurt, dar transformi o problemă financiară într-una și personală.',
                    },
                ],
            },
            {
                id: 'dobanda-variabila',
                intrebare: 'Dobânda variabilă crește neașteptat cu 2%. Ce faci?',
                optiuni: [
                    {
                        id: 'refinantezi',
                        eticheta: 'Cauți refinanțare la altă bancă, cu dobândă fixă',
                        bani: -150,
                        puncte: 25,
                        scorCredit: 10,
                        feedback: 'Cost mic acum (comisioane), dar te protejează de creșteri viitoare.',
                    },
                    {
                        id: 'accepti',
                        eticheta: 'Accepți creșterea și continui cu rate mai mari',
                        bani: -380,
                        puncte: 12,
                        stres: 15,
                        feedback: 'Simplu, dar plătești cu aproape 400 lei mai mult per total.',
                    },
                    {
                        id: 'negociezi',
                        eticheta: 'Suni banca actuală și negociezi o dobândă mai bună',
                        bani: 0,
                        puncte: 20,
                        scorCredit: 5,
                        feedback: 'Nu costă nimic să încerci — multe bănci oferă condiții mai bune clienților buni platnici.',
                    },
                ],
            },
            {
                id: 'credit-suplimentar',
                intrebare: 'Ai nevoie de un credit suplimentar mic, pentru o urgență. Ce opțiuni ai?',
                context: 'Unele opțiuni depind de scorul tău de credit acumulat până acum.',
                optiuni: [
                    {
                        id: 'consolidare-avantajoasa',
                        eticheta: 'Consolidare avantajoasă la banca ta, cu dobândă redusă',
                        bani: 500,
                        puncte: 25,
                        scorMinim: 60,
                        feedback: 'Disponibilă doar clienților cu istoric bun — exact răsplata unui scor de credit sănătos.',
                    },
                    {
                        id: 'credit-rapid-suplimentar',
                        eticheta: 'Iei un mic credit rapid, cu dobândă mare',
                        bani: 500,
                        puncte: 10,
                        stres: 10,
                        feedback: 'Acoperă urgența, dar la un cost mare pe termen scurt.',
                    },
                    {
                        id: 'astepti-salariul',
                        eticheta: 'Aștepți până la salariu, fără credit nou',
                        bani: 0,
                        puncte: 18,
                        feedback: 'Cea mai sigură variantă, deși mai puțin comodă pe moment.',
                    },
                ],
            },
            {
                id: 'reflectie-finala',
                intrebare: 'Ai terminat de plătit creditul. Ce concluzie tragi?',
                optiuni: [
                    {
                        id: 'lectie-buna',
                        eticheta: 'Data viitoare compar mai atent DAE-ul, nu doar rata lunară',
                        bani: 0,
                        puncte: 25,
                        feedback: 'Exact lecția centrală a unui credit responsabil.',
                    },
                    {
                        id: 'evita-creditul',
                        eticheta: 'Evit complet creditele pe viitor, orice ar fi',
                        bani: 0,
                        puncte: 15,
                        feedback: 'Prudent, dar un credit folosit corect poate fi un instrument util, nu doar un risc.',
                    },
                    {
                        id: 'nu-schimb-nimic',
                        eticheta: 'Nu cred că aș face ceva diferit',
                        bani: 0,
                        puncte: 5,
                        feedback: 'Fără reflecție, riscul de a repeta aceleași greșeli rămâne mare.',
                    },
                ],
            },
        ],
    },
]

export function getScenarioBySlug(slug: string): ScenarioDef | undefined {
    return scenarios.find((s) => s.slug === slug)
}

export function maxScoreFor(scenario: ScenarioDef): number {
    return scenario.pasi.reduce((sum, step) => {
        if (step.tip === 'alocare' && step.alocare) {
            return sum + step.alocare.puncteMaxime
        }
        if (step.tip === 'selectie-multipla' && step.selectieMultipla) {
            return sum + step.selectieMultipla.puncteMaxime
        }
        if (step.tip === 'presiune-timp' && step.presiuneTimp) {
            const max = Math.max(...step.presiuneTimp.optiuni.map((o) => o.puncte))
            return sum + max
        }
        if (step.tip === 'comparatie-oferte' && step.comparatieOferte) {
            const max = Math.max(...step.comparatieOferte.oferte.map((o) => o.puncte))
            return sum + max
        }
        if (step.tip === 'adevarat-fals' && step.adevaratFals) {
            const max = step.adevaratFals.intrebari.reduce((s, q) => s + q.puncte, 0)
            return sum + max
        }
        const max = Math.max(...step.optiuni.map((o) => o.puncte))
        return sum + max
    }, 0)
}