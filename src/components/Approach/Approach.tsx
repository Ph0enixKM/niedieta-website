import type { CSSProperties } from "react";
import Clipboard from "@/components/Clipboard/Clipboard";
import { HandCheck, HandStrike } from "@/components/Sketch/Sketch";
import { GAINS } from "@/content/site";
import ScrollWords from "./ScrollWords";
import styles from "./Approach.module.css";

export default function Approach() {
    return (
        <section className={styles.approach} aria-labelledby="podejscie-title">
            <div className="container">
                <ScrollWords
                    className={styles.statement}
                    text="Problemem nie musi być brak wiedzy, a dobór zaleceń niedopasowanych do Twojej sytuacji życiowej i zdrowotnej."
                />

                <div className={styles.stack}>
                    <div className={styles.head}>
                        <h2 id="podejscie-title" className={`h2 ${styles.nodiet}`} data-reveal>
                            Ode mnie nie dostaniesz kolejnej{" "}
                            <span className={styles.struck}>
                                diety
                                <HandStrike className={styles.strike} delay={700} />
                            </span>
                            .
                        </h2>
                        <p className={styles.copy} data-reveal style={{ "--d": 150 } as CSSProperties}>
                            Za to razem popracujemy nad rozwiązaniami, które jesteś w stanie utrzymać — w swoim tempie
                            i w swojej codzienności.
                        </p>
                    </div>

                    <Clipboard data-reveal="scale" style={{ "--d": 120 } as CSSProperties}>
                        <h3 className={styles.gainsTitle}>Co zyskasz zamiast kolejnej diety?</h3>
                        <ul className={styles.gains}>
                            {GAINS.map((gain, i) => (
                                <li key={gain}>
                                    <span className={styles.box} aria-hidden="true">
                                        <HandCheck className={styles.check} delay={650 + i * 260} />
                                    </span>
                                    {gain}
                                </li>
                            ))}
                        </ul>
                    </Clipboard>
                </div>
            </div>
        </section>
    );
}
