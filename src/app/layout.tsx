import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import RevealObserver from "@/components/Reveal/RevealObserver";
import "./globals.css";

const tan = localFont({
    src: "./fonts/tan-nimbus.woff2",
    variable: "--font-tan",
    display: "swap",
});

const garet = localFont({
    src: [
        { path: "./fonts/garet-book.woff2", weight: "400", style: "normal" },
        { path: "./fonts/garet-heavy.woff2", weight: "800", style: "normal" },
    ],
    variable: "--font-garet",
    display: "swap",
});

// Cal Sans (OFL, github.com/calcom/font), subset to Latin + Latin Extended-A for Polish: every title on the site
const cal = localFont({
    src: "./fonts/cal-sans.woff2",
    variable: "--font-cal",
    display: "swap",
});

const geist = localFont({
    src: "./fonts/geist-variable.woff2",
    variable: "--font-geist",
    weight: "100 900",
    display: "swap",
});

// Kinga's own handwriting: letters, digits and . , : ; ! ?. Anything else
// (dashes, quotes, …) falls through to a tiny subset of Playwrite PL.
const kinga = localFont({
    src: "./fonts/kinga.woff2",
    variable: "--font-kinga",
    display: "swap",
});

const handFallback = localFont({
    src: "./fonts/hand-fallback.woff2",
    variable: "--font-hand-fallback",
    weight: "100 400",
    display: "swap",
    preload: false,
});

const description =
    "Dietetyczka kliniczna i psychodietetyczka Kinga Sobańska. Pomogę Ci lepiej poczuć się w swojej skórze - małymi krokami, z uwzględnieniem Twojego zdrowia. Konsultacje online, 8-tygodniowa współpraca, plany posiłków w aplikacji i e-booki.";

export const metadata: Metadata = {
    metadataBase: new URL("https://niedieta.pl"),
    title: {
        default: "NieDieta - Jedz jak lubisz i czuj się dobrze",
        template: "%s · NieDieta",
    },
    description,
    openGraph: {
        title: "NieDieta - Jedz jak lubisz i czuj się dobrze",
        description,
        siteName: "NieDieta",
        locale: "pl_PL",
        type: "website",
        images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "NieDieta - Kinga Sobańska" }],
    },
    twitter: {
        card: "summary_large_image",
    },
};

export const viewport: Viewport = {
    themeColor: "#f5f0e4",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const fonts = [tan, garet, cal, geist, kinga, handFallback].map((font) => font.variable).join(" ");

    return (
        <html lang="pl" className={fonts} data-scroll-behavior="smooth" suppressHydrationWarning>
            <head>
                {/* lets CSS hide scroll-reveal content only when JS is running */}
                <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
            </head>
            <body>
                {children}
                <RevealObserver />
            </body>
        </html>
    );
}
