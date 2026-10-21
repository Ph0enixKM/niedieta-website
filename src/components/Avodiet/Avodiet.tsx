import type { CSSProperties } from "react";
import { AVODIET } from "@/content/site";
import AvodietChat from "./AvodietChat";
import styles from "./Avodiet.module.css";

/** Where we keep in touch: a photo of the AvoDiet app, and what clients find in it told as Kinga's chat messages
 * (see AvodietChat for how they are sent). */
export default function Avodiet() {
    const { photo, messages } = AVODIET;
    return (
        <section className={styles.avodiet} id="aplikacja" aria-labelledby="aplikacja-title">
            <div className={`container ${styles.inner}`}>
                <figure className={styles.photo} data-reveal="left">
                    <span className={styles.tape} aria-hidden="true" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={photo.src}
                        alt="Aplikacja AvoDiet na telefonie: dzienniczek z zaplanowanymi posiłkami na cały dzień"
                        width={photo.width}
                        height={photo.height}
                        loading="lazy"
                        decoding="async"
                    />
                </figure>

                <div className={styles.text}>
                    <h2 id="aplikacja-title" className="h2" data-reveal style={{ "--d": 80 } as CSSProperties}>
                        Jesteśmy w kontakcie w aplikacji <span className={styles.name}>AvoDiet</span>
                    </h2>
                    <p className={`lead ${styles.lead}`} data-reveal style={{ "--d": 160 } as CSSProperties}>
                        Wszystko, czego potrzebujesz w trakcie naszej współpracy, masz pod ręką.
                    </p>

                    <div className={styles.chat} data-reveal style={{ "--d": 240 } as CSSProperties}>
                        <header className={styles.chatHead}>
                            <span className={styles.avatar}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/brand/kinga-avatar.webp" alt="" width={80} height={80} loading="lazy" decoding="async" />
                            </span>
                            <strong className={styles.who}>Kinga</strong>
                        </header>

                        <AvodietChat messages={messages} />
                    </div>
                </div>
            </div>
        </section>
    );
}
