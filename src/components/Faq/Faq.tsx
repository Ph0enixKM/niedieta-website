import { FAQ } from "@/content/site";
import styles from "./Faq.module.css";

export default function Faq() {
    return (
        <section className={styles.faq} id="faq" aria-labelledby="faq-title">
            <div className={`container ${styles.inner}`}>
                <h2 id="faq-title" className="h2" data-reveal>
                    Najczęściej zadawane pytania
                </h2>

                <div className={styles.list} data-reveal>
                    {FAQ.map((item) => (
                        <details key={item.q} className={styles.item}>
                            <summary>
                                {item.q}
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                            </summary>
                            <div className={styles.answer}>
                                {item.a.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
