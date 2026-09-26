// All copy, links and prices of the landing page live here.
// Offers mirror the products in the Naffy store (https://www.naffy.io/niedieta) — keep prices in sync with it.

export const CONTACT_EMAIL = "kinganiedieta@gmail.com";

export const SOCIALS = [
    { name: "Instagram", handle: "@nie.dieta", href: "https://www.instagram.com/nie.dieta/" },
    { name: "TikTok", handle: "@nie.dieta", href: "https://www.tiktok.com/@nie.dieta" },
    { name: "YouTube", handle: "@NieDieta", href: "https://www.youtube.com/@NieDieta" },
] as const;

export type SocialName = (typeof SOCIALS)[number]["name"];

export const NAV_LINKS = [
    { href: "#o-mnie", label: "O mnie" },
    { href: "#wspolpraca", label: "Współpraca" },
    { href: "#oferta", label: "Oferta" },
    { href: "#faq", label: "FAQ" },
] as const;

export const PAINS = [
    {
        icon: "notes",
        text: "Znasz wiele zaleceń, ale nie wiesz, jak je wdrożyć.",
    },
    {
        icon: "voices",
        text: "Każdy mówi co innego i nie wiesz już, kogo słuchać.",
    },
    {
        icon: "heart",
        text: "Chcesz zadbać o siebie i swoje zdrowie, ale bez podporządkowywania temu całego życia.",
    },
] as const;

export type PainIcon = (typeof PAINS)[number]["icon"];

export const GAINS = [
    "Plan dopasowany do Twojej sytuacji",
    "Nawyki, które realnie da się wdrożyć",
    "Spokój i pewność siebie przy jedzeniu",
    "Wsparcie na każdym etapie zmiany",
] as const;

export const STEPS = [
    {
        title: "Poznajemy się",
        text: "Ustalamy cele, analizujemy Twoje potrzeby, styl życia i wyniki badań.",
    },
    {
        title: "Ustalamy plan działania",
        text: "Dostajesz indywidualny plan i zalecenia dopasowane do Twojej codzienności, a nie odwrotnie.",
    },
    {
        title: "Wdrażasz zmiany z moim wsparciem",
        text: "Krok po kroku, z konsultacjami kontrolnymi i kontaktem ze mną w aplikacji.",
    },
    {
        title: "Utrwalasz nawyki",
        text: "Uczysz się samodzielnie podejmować decyzje i cieszysz się efektami na dłużej.",
    },
] as const;

export interface Testimonial {
    quote: string;
    name: string;
    context: string;
    /**
     * PLACEHOLDER — replace with real, consented client opinions before publishing.
     * Placeholders are rendered only in development (with a visible badge) and never in production builds.
     */
    placeholder?: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
    {
        quote: "Pierwszy raz nie czułam, że jestem na diecie. Jem normalnie, widzę zmiany i przestałam myśleć o jedzeniu non stop.",
        name: "Anna",
        context: "8-tygodniowa współpraca",
        placeholder: true,
    },
    {
        quote: "Kinga pomogła mi ułożyć posiłki pod moją pracę zmianową. Mam więcej energii i wreszcie wiem, co jeść, kiedy brakuje mi czasu.",
        name: "Magda",
        context: "Konsultacja + jadłospis",
        placeholder: true,
    },
    {
        quote: "Najbardziej doceniam spokój. Bez oceniania i bez zakazów, małymi krokami doszłam do nawyków, które zostały ze mną.",
        name: "Kasia",
        context: "8-tygodniowa współpraca",
        placeholder: true,
    },
];

export const NAFFY = {
    store: "https://www.naffy.io/niedieta",
    consultation: "https://www.naffy.io/niedieta/konsultacja-online-KeA",
    consultationPlan: "https://www.naffy.io/niedieta/konsultacja-indywidualny-7-dniowy-plan-zywieniowy-olw",
    program: "https://www.naffy.io/niedieta/8-tygodniowa-wspolpraca-ssc",
    app: "https://www.naffy.io/niedieta/niedieta-w-apce-l0n",
    appTrialClassic: "https://www.naffy.io/niedieta/3-dni-posilkow-z-apki-na-probe-wersja-klasyczna-Blt",
    appTrialVege: "https://www.naffy.io/niedieta/3-dni-posilkow-z-apki-na-probe-wersja-wege-yQs",
    ebookBreakfasts: "https://www.naffy.io/niedieta/sniadania-14o",
    ebookBagels: "https://www.naffy.io/niedieta/bajgle-dSd",
} as const;

export interface OfferVariant {
    id: string;
    label: string;
    name: string;
    price: number;
    href: string;
    cta: string;
    features: string[];
    note?: string;
}

export const CONSULTATION: OfferVariant[] = [
    {
        id: "konsultacja",
        label: "Sama konsultacja",
        name: "Konsultacja dietetyczna i psychodietetyczna",
        price: 100,
        href: NAFFY.consultation,
        cta: "Umawiam konsultację",
        features: [
            "Pogłębiony wywiad o zdrowiu i stylu życia",
            "Analiza problemów i omówienie celów",
            "Indywidualny plan zmiany",
            "Wsparcie psychodietetyczne: nie tylko dieta, ale też nastawienie",
        ],
        note: "Konsultacja nie obejmuje jadłospisu.",
    },
    {
        id: "konsultacja-jadlospis",
        label: "+ jadłospis",
        name: "Konsultacja + indywidualny 7-dniowy plan żywieniowy",
        price: 300,
        href: NAFFY.consultationPlan,
        cta: "Wybieram pakiet",
        features: [
            "Konsultacja online: Twoje potrzeby i cele",
            "7-dniowy jadłospis dopasowany do Twoich preferencji",
            "Plan w PDF i w aplikacji w ciągu 3 dni",
            "Praktyczne wskazówki: zakupy i przygotowanie posiłków",
        ],
    },
];

export const PROGRAM = {
    name: "8-tygodniowa metamorfoza",
    tagline: "Schudnij, popraw wyniki i uporządkuj jedzenie bez zaczynania od kolejnej diety.",
    price: 899,
    href: NAFFY.program,
    features: [
        "Konsultacja startowa online",
        "Analiza wyników badań, stylu życia i nawyków",
        "Indywidualny plan działania i spersonalizowane zalecenia",
        "Praktyczne porady: posiłki i radzenie sobie z zachciankami",
        "2 konsultacje kontrolne",
        "Aplikacja z przepisami, monitoringiem i czatem",
        "Stały kontakt między spotkaniami",
        "Podsumowanie i plan na dalszą drogę",
    ],
} as const;

export const APP = {
    name: "NieDieta w Apce",
    tagline: "Gdy chcesz działać na własną rękę, ale z gotowym planem pod ręką.",
    price: 49,
    href: NAFFY.app,
    features: [
        "Nowy, zbilansowany plan posiłków co 2 tygodnie",
        "Ponad 1500 przepisów do wymiany posiłków",
        "Automatyczna lista zakupów",
        "Plany ok. 1800 kcal i 100 g białka",
        "Cotygodniowe raporty postępów",
    ],
} as const;

export const EBOOKS = [
    {
        title: "Śniadania.",
        text: "Zdrowe, pyszne i szybkie śniadania, które umilą poranki i dodadzą Ci energii.",
        price: 39,
        cover: "/items/sniadania.jpeg",
        href: NAFFY.ebookBreakfasts,
        cta: "Kupuję",
    },
    {
        title: "Bajgle.",
        text: "Proste i zdrowe przepisy na szybkie śniadania.",
        price: 0,
        cover: "/items/bajgle.jpeg",
        href: NAFFY.ebookBagels,
        cta: "Pobieram za darmo",
    },
] as const;

export const FAQ = [
    {
        q: "Czy dostanę gotowy jadłospis?",
        a: "To zależy od wybranej formy wsparcia. Indywidualny 7-dniowy jadłospis otrzymasz w pakiecie „Konsultacja + jadłospis” — w PDF i w aplikacji, w ciągu 3 dni od spotkania. Gotowe plany posiłków, odświeżane co dwa tygodnie, znajdziesz też w NieDiecie w Apce. Sama konsultacja nie obejmuje jadłospisu: skupiamy się na planie zmiany dopasowanym do Ciebie.",
    },
    {
        q: "Czy muszę liczyć kalorie?",
        a: "Nie. Liczenie kalorii nie jest warunkiem współpracy. Pracujemy na nawykach, komponowaniu posiłków i sygnałach płynących z Twojego ciała — tak, żeby jedzenie przestało być ciągłym rachunkiem.",
    },
    {
        q: "Jak wyglądają spotkania?",
        a: "Spotykamy się online, więc wystarczy telefon lub komputer z internetem. Rozmawiamy o Twoim zdrowiu, stylu życia, nawykach i celach — w spokojnej atmosferze, bez oceniania. W 8-tygodniowej współpracy między spotkaniami jesteśmy w stałym kontakcie przez aplikację.",
    },
    {
        q: "Czy współpraca jest dla mnie, jeśli mam choroby lub przyjmuję leki?",
        a: "Najczęściej tak. Jako dietetyczka kliniczna dopasowuję zalecenia do Twojego stanu zdrowia, wyników badań i przyjmowanych leków. Dietoterapia wspiera leczenie, ale go nie zastępuje, dlatego ważne, byś pozostawała pod opieką lekarza. Nie prowadzę współpracy z osobami z zaburzeniami odżywiania ani ze sportowcami.",
    },
    {
        q: "Nie wiem, którą opcję wybrać — co zrobić?",
        a: "Jeśli chcesz na spokojnie przyjrzeć się swojej sytuacji, zacznij od konsultacji. Jeśli zależy Ci na zmianie z regularnym wsparciem, wybierz 8-tygodniową współpracę. A jeśli wolisz działać samodzielnie, sprawdź NieDietę w Apce — 3 dni możesz przetestować za darmo. Wciąż masz wątpliwości? Napisz do mnie, pomogę wybrać.",
    },
    {
        q: "Jakie efekty mogę osiągnąć?",
        a: "To zależy od Twojego punktu startu i celu. Dla jednej osoby będzie to redukcja masy ciała, dla innej lepsze wyniki badań, więcej energii albo spokojniejsza relacja z jedzeniem. Nie obiecuję cudów w tydzień — stawiam na zmiany, które zostają z Tobą na dłużej.",
    },
] as const;
