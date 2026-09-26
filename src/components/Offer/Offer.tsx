import type { CSSProperties } from "react";
import Image from "next/image";
import BerrySlot from "@/components/Berry/BerrySlot";
import { ArrowUpRight, CheckIcon } from "@/components/Icons/Icons";
import Price from "@/components/Price/Price";
import { APP, EBOOKS, NAFFY, PROGRAM } from "@/content/site";
import ConsultationCard from "./ConsultationCard";
import styles from "./Offer.module.css";

export default function Offer() {
    return (
        <section className={styles.offer} id="oferta" aria-labelledby="oferta-title">
            <div className="container">
                <header className={styles.header}>
                    <h2 id="oferta-title" className="h2" data-reveal style={{ "--d": 80 } as CSSProperties}>
                        Wybierz wsparcie, którego <span className={styles.now}>teraz</span> potrzebujesz
                    </h2>
                    <p className={styles.sub} data-reveal style={{ "--d": 160 } as CSSProperties}>
                        Wszystkie spotkania odbywają się online — wystarczy telefon lub komputer.
                    </p>
                </header>

                <div className={styles.cards}>
                    <div data-reveal style={{ "--d": 100 } as CSSProperties}>
                        <ConsultationCard />
                    </div>

                    <div data-reveal style={{ "--d": 220 } as CSSProperties} className={styles.featuredWrap}>
                        <article className={`${styles.card} ${styles.featured}`} data-berry-host="" aria-labelledby="oferta-wspolpraca">
                            <BerrySlot kind="offer" className={styles.topper} />
                            <h3 id="oferta-wspolpraca" className={styles.name}>
                                {PROGRAM.name}
                            </h3>
                            <p className={styles.tagline}>{PROGRAM.tagline}</p>
                            <Price amount={PROGRAM.price} period="za 8 tygodni" className={styles.price} />
                            <ul className={styles.features}>
                                {PROGRAM.features.map((feature) => (
                                    <li key={feature}>
                                        <CheckIcon />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <a href={PROGRAM.href} className={`btn btn-bright btn-block ${styles.cta}`}>
                                Zaczynam współpracę
                                <ArrowUpRight />
                            </a>
                        </article>
                    </div>

                    <div data-reveal style={{ "--d": 340 } as CSSProperties}>
                        <article className={styles.card} aria-labelledby="oferta-apka">
                            <h3 id="oferta-apka" className={styles.name}>
                                {APP.name}
                            </h3>
                            <p className={styles.tagline}>{APP.tagline}</p>
                            <Price amount={APP.price} period="/ miesiąc" discountable={false} className={styles.price} />
                            <ul className={styles.features}>
                                {APP.features.map((feature) => (
                                    <li key={feature}>
                                        <CheckIcon />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.trial}>
                                <span>Wypróbuj 3 dni za darmo:</span>
                                <a href={NAFFY.appTrialClassic}>wersja klasyczna</a>
                                <a href={NAFFY.appTrialVege}>wersja wege</a>
                            </div>
                            <a href={APP.href} className={`btn btn-deep btn-block ${styles.cta}`}>
                                Dołączam
                                <ArrowUpRight />
                            </a>
                        </article>
                    </div>
                </div>

                <div className={styles.shelf} data-reveal>
                    <div className={styles.shelfIntro}>
                        <h3 className={styles.shelfTitle}>E-booki</h3>
                        <p>Przepisy, które ułatwiają codzienność — do pobrania od razu.</p>
                    </div>
                    <ul className={styles.books}>
                        {EBOOKS.map((book) => (
                            <li key={book.title} className={styles.book}>
                                <a href={book.href} className={styles.cover} aria-label={`${book.title} — zobacz e-book`}>
                                    <Image src={book.cover} alt="" width={905} height={1280} sizes="120px" />
                                </a>
                                <div className={styles.bookBody}>
                                    <h4>{book.title}</h4>
                                    <p>{book.text}</p>
                                    <div className={styles.bookFoot}>
                                        <Price amount={book.price} rounding="cents" size="sm" />
                                        <a href={book.href} className="btn btn-bright btn-small">
                                            {book.cta}
                                        </a>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
