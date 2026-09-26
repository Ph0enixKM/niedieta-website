import type { CSSProperties } from "react";
import { MarkerBlob } from "@/components/Sketch/Sketch";
import { TESTIMONIALS } from "@/content/site";
import styles from "./Stories.module.css";

const TILT = ["-1.8deg", "1.2deg", "-0.8deg"];

export default function Stories() {
    // Placeholder opinions are for previewing the layout only — never publish invented reviews.
    const isDev = process.env.NODE_ENV !== "production";
    const stories = TESTIMONIALS.filter((story) => isDev || !story.placeholder);
    if (!stories.length) return null;

    return (
        <section className={styles.stories} id="opinie" aria-labelledby="opinie-title">
            <div className="container">
                <h2 id="opinie-title" className={`h2 ${styles.title}`} data-reveal style={{ "--d": 80 } as CSSProperties}>
                    Historie moich podopiecznych
                </h2>

                <ul className={styles.list}>
                    {stories.map((story, i) => (
                        <li key={story.name + i} data-reveal style={{ "--d": 140 + i * 130 } as CSSProperties}>
                            <figure className={styles.card} style={{ "--tilt": TILT[i % TILT.length] } as CSSProperties}>
                                {story.placeholder && <span className={styles.placeholder}>Przykładowa opinia — podmień</span>}
                                <span className={styles.quoteMark} aria-hidden="true">
                                    <MarkerBlob className={styles.quoteBlob} seed={40 + i} />
                                    <span>“</span>
                                </span>
                                <blockquote>{story.quote}</blockquote>
                                <figcaption>
                                    <span className={styles.name}>{story.name}</span>
                                    <span className={styles.context}>{story.context}</span>
                                </figcaption>
                            </figure>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
