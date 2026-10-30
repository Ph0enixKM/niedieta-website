import type { CSSProperties } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import kingaPhoto from "@/../public/kinga-about.webp";
import { HandArrow, SketchRing } from "@/components/Sketch/Sketch";
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
                <div className={styles.greeting} data-reveal="right">
                    <Image
                        className={styles.photo}
                        src={kingaPhoto}
                        alt="Kinga Sobańska przy kuchennym blacie, z miską owsianki w dłoniach"
                        placeholder="blur"
                        sizes="(min-width: 1240px) 472px, (min-width: 901px) 38vw, min(92vw, 520px)"
                    />
                    <div className={styles.avatar}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/brand/kinga-about-avatar.webp"
                            srcSet="/brand/kinga-about-avatar-200.webp 200w, /brand/kinga-about-avatar.webp 400w"
                            sizes="clamp(112px, 12vw, 150px)"
                            alt="Kinga Sobańska"
                            width={400}
                            height={400} loading="lazy" decoding="async" />
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
                </div>
            </div>
        </section>
    );
}
