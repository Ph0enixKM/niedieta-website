import type { CSSProperties } from "react";
import { HandArrow, HandHeart, SketchRing } from "@/components/Sketch/Sketch";
import styles from "./About.module.css";

export default function About() {
    return (
        <section className={styles.about} id="o-mnie" aria-labelledby="o-mnie-title">
            <div className={`container ${styles.inner}`}>
                <div className={styles.greeting} data-reveal="left">
                    <div className={styles.avatar}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/brand/kinga-avatar.webp" alt="Kinga Sobańska" width={400} height={400} loading="lazy" decoding="async" />
                        <SketchRing className={styles.avatarRing} seed={12} strokeWidth={2.2} delay={300} />
                    </div>
                    <h2 id="o-mnie-title" className={styles.hello}>
                        Cześć, jestem Kinga!
                    </h2>
                    <HandArrow className={styles.arrow} delay={900} />
                </div>

                <div className={styles.text}>
                    <p className={styles.big} data-reveal style={{ "--d": 100 } as CSSProperties}>
                        Jestem magistrem dietetyki klinicznej i psychodietetyczką. Na co dzień pomagam kobietom wdrażać zmiany
                        żywieniowe, dzięki którym czują się lepiej w swojej skórze.
                    </p>
                    <p className={styles.small} data-reveal style={{ "--d": 220 } as CSSProperties}>
                        Wierzę w <span className="marker">małe kroki</span>, które prowadzą do trwałej zmiany i zauważalnych efektów.
                        Bez zakazanych produktów, bez oceniania — z uważnością na to, jak naprawdę wygląda Twój dzień.
                    </p>
                    <p className={styles.sign} data-reveal style={{ "--d": 340 } as CSSProperties}>
                        <span>Kinga</span>
                        <HandHeart className={styles.heart} delay={900} />
                    </p>
                </div>
            </div>
        </section>
    );
}
