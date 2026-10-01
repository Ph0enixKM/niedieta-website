import type { CSSProperties } from "react";
import type { ReactNode } from "react";
import { HandArrow, HandHeart, SketchRing } from "@/components/Sketch/Sketch";
import { DIPLOMAS } from "@/content/site";
import styles from "./About.module.css";

/** A highlighted qualification that opens its diploma, once the scan is in place. */
function Credential({ diploma, children }: { diploma?: string; children: ReactNode }) {
    if (!diploma) return <span className={styles.credential}>{children}</span>;
    return (
        <a className={`${styles.credential} ${styles.diploma}`} href={diploma} target="_blank" rel="noopener" title="Zobacz dyplom">
            {children}
        </a>
    );
}

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
                        Jestem <Credential diploma={DIPLOMAS.clinical}>magistrem dietetyki klinicznej</Credential> oraz{" "}
                        <Credential diploma={DIPLOMAS.psychodietetics}>psychodietetyczką</Credential>. Na co dzień pomagam
                        kobietom wdrażać zmiany żywieniowe, aby lepiej czuły się w swojej skórze, uwzględniając ich zdrowie.
                    </p>
                    <p className={styles.small} data-reveal style={{ "--d": 220 } as CSSProperties}>
                        Wierzę w <span className="marker">małe kroki</span>, które prowadzą do trwałej zmiany i zauważalnych efektów.
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
