import type { CSSProperties } from "react";
import { ArrowRight } from "@/components/Icons/Icons";
import { SketchUnderline } from "@/components/Sketch/Sketch";
import HeroPhoto from "./HeroPhoto";
import styles from "./Hero.module.css";

export default function Hero() {
    return (
        <section className={styles.hero} id="start">
            <HeroPhoto />

            <div className={styles.inner}>
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

                <div className={styles.copy}>
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
            </div>
        </section>
    );
}
