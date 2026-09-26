"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import Logo from "@/components/Logo/Logo";
import { SketchUnderline } from "@/components/Sketch/Sketch";
import { CalculatorIcon, CloseIcon, MenuIcon, SOCIAL_ICONS } from "@/components/Icons/Icons";
import { NAV_LINKS, SOCIALS } from "@/content/site";
import styles from "./Navbar.module.css";

interface Props {
    /** On sub-pages section links point back to the home page. */
    home?: boolean;
}

export default function Navbar({ home = true }: Props) {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState<string | null>(null);
    const href = (hash: string) => (home ? hash : `/${hash}`);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!home) return;
        const sections = NAV_LINKS.map((link) => document.querySelector(link.href)).filter(
            (el): el is Element => el !== null,
        );
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setActive(`#${entry.target.id}`);
                }
            },
            { rootMargin: "-45% 0px -50% 0px" },
        );
        sections.forEach((section) => io.observe(section));
        return () => io.disconnect();
    }, [home]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const classes = [styles.header, scrolled && styles.scrolled, open && styles.open].filter(Boolean).join(" ");

    return (
        <header className={classes}>
            <nav className={styles.bar} aria-label="Nawigacja główna">
                <Link
                    href="/"
                    className={styles.brand}
                    aria-label="NieDieta — strona główna"
                    onClick={(e) => {
                        setOpen(false);
                        if (!home) return;
                        // Already on the home page: scroll back to the top instead of navigating.
                        e.preventDefault();
                        if (window.location.hash) history.replaceState(null, "", window.location.pathname);
                        window.scrollTo({ top: 0 });
                    }}
                >
                    <Logo />
                </Link>

                <ul className={styles.links}>
                    {NAV_LINKS.map((link, i) => (
                        <li key={link.href}>
                            <a
                                href={href(link.href)}
                                className={styles.link}
                                aria-current={active === link.href ? "true" : undefined}
                            >
                                {link.label}
                                {active === link.href && (
                                    <SketchUnderline className={styles.underline} seed={i + 2} strokeWidth={6} draw={false} />
                                )}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className={styles.actions}>
                    <Link href="/calculator" className={`btn btn-bright btn-small ${styles.calc}`} aria-label="Kalkulator BMI i zapotrzebowania">
                        <CalculatorIcon />
                        <span className={styles.calcLabel}>Kalkulator</span>
                    </Link>
                    <a href={href("#oferta")} className={`btn btn-deep btn-small ${styles.cta}`}>
                        <span className={styles.ctaLong}>Umów konsultację</span>
                        <span className={styles.ctaShort}>Umów się</span>
                    </a>
                    <button
                        type="button"
                        className={styles.menuButton}
                        aria-expanded={open}
                        aria-controls="menu-mobilne"
                        aria-label={open ? "Zamknij menu" : "Otwórz menu"}
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </nav>

            <div id="menu-mobilne" className={styles.sheet} hidden={!open}>
                <ul>
                    {NAV_LINKS.map((link, i) => (
                        <li key={link.href} style={{ "--i": i } as CSSProperties}>
                            <a href={href(link.href)} onClick={() => setOpen(false)}>
                                {link.label}
                            </a>
                        </li>
                    ))}
                    <li style={{ "--i": NAV_LINKS.length } as CSSProperties}>
                        <Link href="/calculator" onClick={() => setOpen(false)}>
                            Kalkulator
                        </Link>
                    </li>
                </ul>
                <a href={href("#oferta")} className="btn btn-deep btn-block" onClick={() => setOpen(false)}>
                    Umów konsultację
                </a>
                <div className={styles.socials}>
                    {SOCIALS.map((social) => {
                        const Icon = SOCIAL_ICONS[social.name];
                        return (
                            <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                                <Icon />
                            </a>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}
