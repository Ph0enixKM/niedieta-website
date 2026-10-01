// All copy, links and prices of the landing page live here.
// Offers mirror the products in the Naffy store (https://www.naffy.io/niedieta) - keep prices in sync with it.

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

/**
 * Kinga's diplomas, linked from her credentials in the "O mnie" section. Drop the scans into /public/dyplomy and
 * set the paths here (e.g. "/dyplomy/dietetyka-kliniczna.pdf"); until then the credentials are only highlighted.
 */
export const DIPLOMAS: { clinical?: string; psychodietetics?: string } = {};

export const PAINS = [
    {
        icon: "voices",
        text: "Każdy mówi co innego i nie wiesz, kogo słuchać i co będzie dla Ciebie dobre.",
    },
    {
        icon: "notes",
        text: "Znasz wiele zaleceń, ale nie wiesz, jak je wdrożyć.",
    },
    {
        icon: "heart",
        text: "Chcesz zadbać o swoje zdrowie, ale bez podporządkowania temu całego życia.",
    },
] as const;

export type PainIcon = (typeof PAINS)[number]["icon"];

export const GAINS = [
    "plan dopasowany do Twojej sytuacji",
    "akceptowalne przez Ciebie nawyki do wdrożenia",
    "wsparcie podczas całego procesu",
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
    /** Client message as sent, with only typos and punctuation corrected. */
    quote: string;
    /** Omit for anonymous opinions - the card is then signed "Opinia anonimowa". */
    name?: string;
    context?: string;
    /**
     * PLACEHOLDER - replace with real, consented client opinions before publishing.
     * Placeholders are rendered only in development (with a visible badge) and never in production builds.
     */
    placeholder?: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
    {
        quote: "Kinga, bardzo dziękuję za przygotowaną dietę ❤️ potrawy są bardzo smaczne, szybko i łatwo można je przygotować, a przede wszystkim bardzo dobrze się po nich czuję ❤️ używam Twoich przepisów już ponad 3 miesiące, zgubiłam „brzuszek” i czuję się naprawdę świetnie. Uwzględniłaś wszystkie moje sugestie i dzięki temu nawet nie czuję, że to dieta, bo jem po prostu co lubię. Oczywiście na weekendach często zdarza mi się zjeść coś na mieście, ale mimo to kaloryczność z „tygodnia” powoduje, że waga spada ❤️ chciałabym domówić u Ciebie dietę na sezon jesienno-zimowy i kontynuować dalej współpracę 💪💪💪💪 dziękuję jeszcze raz ❤️❤️❤️",
        name: "Ewa",
    },
    {
        quote: "Myślałam kiedyś tak samo, że diety cud, że redukcja, że wyrzeczenia, ale od kiedy zdaję się na fachową konsultację dietetyczną, już wiem. Zmiany muszą wyjść od nas samych, żadnych wyrzeczeń, żadnych restrykcji. Tylko zdrowa zmiana nawyków. Ja razem z synkiem wprowadziliśmy takie zmiany i są efekty. Nie ma podjadania, bo jesteśmy zaspokojeni kalorycznie. A zmiany na ciele i większa energia przychodzą same. Dziękujemy za porady i prowadzenie.\nNajlepsza dietetyk 💗 Polecam 🤗",
        name: "Iza",
    },
    {
        quote: "Dzień dobry Kingo\nTak, jadłospis dobiegł końca. Muszę przyznać, że bardzo mi służy i myślę jeszcze go stosować. Tym bardziej, że zrobiłem już zakupy na cały tydzień 😆 Od początku stosowania diety schudłem 7 kg, a ciśnienie krwi utrzymuje się w granicach normy. Przed chwilą mierzyłem i mam 120/67. Czasami jest jeszcze niższe. Jak tak dalej będzie, to skonsultuję z lekarzem zmniejszenie dawki leków albo całkowite ich odstawienie. Dużym plusem Twojej diety jest też zmiana nawyków żywieniowych. Już wiem mniej więcej kiedy, jakie produkty i ile jeść w ciągu dnia. Za jakiś czas się odezwę i poproszę o zmianę jadłospisu. Dziękuję bardzo za pomoc i pozdrawiam serdecznie 🙂",
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
    tagline: "Uporządkuj jedzenie, popraw wyniki i zadbaj o masę ciała - małymi krokami, ze stałym wsparciem.",
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

// Each answer is a list of paragraphs.
export const FAQ = [
    {
        q: "Czy dostanę gotowy jadłospis?",
        a: [
            "To zależy od wybranej formy wsparcia. Indywidualny 7-dniowy jadłospis otrzymasz w pakiecie „Konsultacja + jadłospis” - w PDF i w aplikacji, w ciągu 3 dni od spotkania. Wówczas na konsultacji dokładnie omówimy, jak możemy wykorzystać to narzędzie w Twojej sytuacji oraz jak sprawić, aby nie przywiązywać się do niego na stałe.",
            "Gotowe plany posiłków, odświeżane co dwa tygodnie, znajdziesz też w NieDiecie w Apce.",
            "Sama konsultacja nie obejmuje jadłospisu: skupiamy się na planie zmiany dopasowanym do Ciebie, bazując na Twoich dotychczasowych przyzwyczajeniach.",
        ],
    },
    {
        q: "Czy muszę liczyć kalorie?",
        a: [
            "Liczenie kalorii nie jest warunkiem współpracy, ponieważ każda z nas jest inna i nie każdej to narzędzie służy. Skupiamy się głównie na nawykach, komponowaniu posiłków oraz obserwacji sygnałów płynących z organizmu. Jestem jednak świadoma, że łatwo przeszacować kalorie i często na początku współpracy proponuję to rozwiązanie, choćby jako eksperyment czy jedno z narzędzi samokontroli.",
        ],
    },
    {
        q: "Jak wyglądają spotkania?",
        a: [
            "Spotykamy się online, dlatego zawsze sugeruję, aby to było miejsce, w którym czujesz się komfortowo. Rozmawiamy o Twoich celach, stylu życia, drodze, którą przebyłaś, i o miejscu, w którym się teraz znajdujesz - wszystko w spokojnej atmosferze i bez oceniania.",
            "W przypadku 8-tygodniowej współpracy jesteśmy w stałym kontakcie przez aplikację AvoDiet. Znajdziesz w niej czat, ale także dostęp do bazy posiłków, więc na pewno nie zabraknie Ci inspiracji podczas naszej współpracy.",
            "W przypadku jednorazowych konsultacji nie zostawiam Cię samej - jesteśmy w kontakcie przez miesiąc od wizyty, więc w przypadku pojawienia się jakichkolwiek wątpliwości jestem pod telefonem.",
        ],
    },
    {
        q: "Czy współpraca jest dla mnie, jeśli choruję i/lub przyjmuję leki?",
        a: [
            "Jak najbardziej. Jako dietetyczka kliniczna dopasowuję zalecenia do Twojego stanu zdrowia, wyników badań i przyjmowanych leków. Dietoterapia jest ważnym wsparciem dla leczenia, ale go nie zastępuje, dlatego warto zostać także pod opieką lekarza.",
        ],
    },
    {
        q: "Z jakimi osobami nie współpracujesz?",
        a: [
            "Nie współpracuję z osobami cierpiącymi na zaburzenia odżywiania, dziećmi poniżej 12. roku życia oraz sportowcami. W przypadku wątpliwości skontaktuj się ze mną :)",
        ],
    },
    {
        q: "Nie wiem, którą opcję wybrać - co zrobić?",
        a: [
            "Jeśli chcesz na spokojnie przyjrzeć się swojej sytuacji, zacznij od konsultacji. Jeżeli zależy Ci na konkretnym, długofalowym wsparciu i stałym kontakcie, wybierz 8-tygodniową współpracę.",
            "A jeśli wolisz działać samodzielnie, ale szukasz inspiracji na zbilansowane zdrowe posiłki i chcesz otrzymywać sezonowe plany żywieniowe co 2 tygodnie, sprawdź NieDietę w Apce - 3 dni próbnego jadłospisu możesz przetestować za darmo.",
            "Jeżeli nadal masz wątpliwości - napisz do mnie, pomogę Ci dobrać opcję, która będzie dla Ciebie odpowiednia.",
        ],
    },
    {
        q: "Jakie mogę osiągnąć efekty?",
        a: [
            "To zależy od Twojego celu - dla jednej osoby będzie nauka lepszych wyborów żywieniowych, dla innej konkretna poprawa wyników badań. Z doświadczenia jednak wiem, że często to pytanie zadajecie w kontekście utraty masy ciała. Nie obiecuję cudów, ponieważ prawdą jest, że zmiana zależy w znacznej większości od Ciebie, a ja jestem Twoją towarzyszką w tej drodze. Gdybyśmy miały operować na statystykach i liczbach, zdrową redukcję szacuje się na 0,5-1\u00a0kg masy ciała na tydzień i w taką zazwyczaj celujemy przy nadwadze/otyłości.",
        ],
    },
] as const;
