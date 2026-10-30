import type { CSSProperties } from "react";
import { ArrowUpRight } from "@/components/Icons/Icons";
import { REELS, SOCIALS } from "@/content/site";
import ReelEmbed from "./ReelEmbed";
import styles from "./Reels.module.css";

export default function Reels() {
    const instagram = SOCIALS[0];

    return (
        <section className={styles.reels} id="rolki" aria-labelledby="rolki-title">
            <div className={`container ${styles.inner}`}>
                <header className={styles.header}>
                    <div data-reveal>
                        <h2 id="rolki-title" className="h2">
                            Zajrzyj na moje social media...
                        </h2>
                        <p className={styles.sub}>...gdzie dzielę się dietetycznymi inspiracjami i moją wiedzą na bieżąco</p>
                    </div>
                    <a href={instagram.href} target="_blank" rel="noopener noreferrer" className={`btn btn-bright ${styles.follow}`} data-reveal>
                        Obserwuj {instagram.handle}
                        <ArrowUpRight />
                    </a>
                </header>

                <ul className={styles.list}>
                    {REELS.map((reel, i) => (
                        <li key={reel.id} className={styles.item} data-reveal style={{ "--d": 60 + i * 80 } as CSSProperties}>
                            <ReelEmbed id={reel.id} title={reel.title} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
