import type { CSSProperties } from "react";
import Image from "next/image";
import heroImage from "@/../public/hero.webp";
import BerrySlot from "@/components/Berry/BerrySlot";
import { ArrowRight } from "@/components/Icons/Icons";
import { SketchLoop, SketchUnderline } from "@/components/Sketch/Sketch";
import styles from "./Hero.module.css";

export default function Hero() {
    return (
        <section className={styles.hero} id="start">
            <div className={`container ${styles.inner}`}>
                <div className={styles.copy}>
                    <h1 className={styles.title}>
                        <span className={styles.row}>
                            Jedz{" "}
                            <em className={styles.word} style={{ "--w": 0 } as CSSProperties}>
                                jak lubisz
                                <SketchUnderline className={styles.underline} seed={4} draw={false} />
                            </em>
                        </span>
                        <span className={styles.row}>
                            i czuj się{" "}
                            <em className={styles.word} style={{ "--w": 1 } as CSSProperties}>
                                dobrze
                            </em>
                        </span>
                    </h1>

                    <p className={`lead ${styles.lead}`}>
                        Pomogę Ci lepiej poczuć się w swojej skórze - małymi krokami, z uwzględnieniem Twojego zdrowia i bez zaczynania od nowa w każdy poniedziałek.
                    </p>

                    <div className={styles.ctas}>
                        <a href="#oferta" className="btn btn-deep">
                            Umów konsultację
                            <ArrowRight />
                        </a>
                    </div>
                </div>

                <div className={styles.media}>
                    <SketchLoop className={styles.loop} width={1300} height={1122} seed={5} strokeWidth={66} draw={false} />
                    <figure className={styles.photo}>
                        <Image
                            src={heroImage}
                            alt="Kinga Sobańska przy stole w jasnej kuchni, z tabletem i kubkiem kawy"
                            priority
                            placeholder="blur"
                            sizes="(min-width: 1240px) 580px, (min-width: 900px) 46vw, 90vw"
                        />
                    </figure>
                    <BerrySlot kind="hero" className={styles.berry} />
                </div>
            </div>
        </section>
    );
}
