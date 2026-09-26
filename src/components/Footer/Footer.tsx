import Link from "next/link";
import Logo from "@/components/Logo/Logo";
import { ArrowRight, MailIcon, SOCIAL_ICONS } from "@/components/Icons/Icons";
import { RoughEdge } from "@/components/Sketch/Sketch";
import { CONTACT_EMAIL, NAV_LINKS, SOCIALS } from "@/content/site";
import ArLink from "./ArLink";
import styles from "./Footer.module.css";

interface Props {
    /** On sub-pages section links point back to the home page. */
    home?: boolean;
}

export default function Footer({ home = true }: Props) {
    const href = (hash: string) => (home ? hash : `/${hash}`);
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <RoughEdge className={styles.edge} seed={14} />
            <div className={styles.body}>
                <div className="container">
                    <div className={styles.cta}>
                        <h2 className={styles.ctaTitle} data-reveal>
                            Zrób pierwszy <span className={styles.hand}>mały krok</span>.
                        </h2>
                        <p className={styles.ctaText} data-reveal>
                            Resztę przejdziemy razem — w Twoim tempie.
                        </p>
                        <div className={styles.ctaButtons} data-reveal>
                            <a href={href("#oferta")} className="btn btn-primary">
                                Umów konsultację
                                <ArrowRight />
                            </a>
                            <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-cream">
                                <MailIcon />
                                Napisz do mnie
                            </a>
                        </div>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.brand}>
                            <Link href="/" aria-label="NieDieta — strona główna">
                                <Logo size="lg" />
                            </Link>
                            <p>Dietetyka kliniczna i psychodietetyka bez restrykcji. Jedz normalnie, czuj się dobrze.</p>
                        </div>

                        <nav aria-label="Na skróty">
                            <h3 className={styles.colTitle}>Na skróty</h3>
                            <ul className={styles.links}>
                                {NAV_LINKS.map((link) => (
                                    <li key={link.href}>
                                        <a href={href(link.href)}>{link.label}</a>
                                    </li>
                                ))}
                                <li>
                                    <Link href="/calculator">Kalkulator</Link>
                                </li>
                            </ul>
                        </nav>

                        <div>
                            <h3 className={styles.colTitle}>Obserwuj</h3>
                            <ul className={styles.socials}>
                                {SOCIALS.map((social) => {
                                    const Icon = SOCIAL_ICONS[social.name];
                                    return (
                                        <li key={social.name}>
                                            <a href={social.href} target="_blank" rel="noopener noreferrer">
                                                <span className={styles.socialIcon}>
                                                    <Icon />
                                                </span>
                                                <span>
                                                    {social.name}
                                                    <small>{social.handle}</small>
                                                </span>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div>
                            <h3 className={styles.colTitle}>Kontakt</h3>
                            <a className={styles.mail} href={`mailto:${CONTACT_EMAIL}`}>
                                {CONTACT_EMAIL}
                            </a>
                            <p className={styles.small}>Konsultacje online — gdziekolwiek jesteś.</p>
                            <ArLink />
                        </div>
                    </div>

                    <div className={styles.legal}>
                        <span>
                            © {year} NieDieta · Kinga Sobańska
                        </span>
                        <a href="/policy.pdf" target="_blank" rel="noopener">
                            Polityka prywatności
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
