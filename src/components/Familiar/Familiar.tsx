import type { CSSProperties } from "react";
import { SketchRing } from "@/components/Sketch/Sketch";
import { PAINS, type PainIcon } from "@/content/site";
import styles from "./Familiar.module.css";

const TILT = ["-2.4deg", "1.6deg", "-1.2deg"];

function Icon({ name }: { name: PainIcon }) {
    const common = {
        viewBox: "0 0 48 48",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        "aria-hidden": true,
    };
    if (name === "notes") {
        return (
            <svg {...common}>
                <path d="M13.5 8h17.8l6.2 6.2v24.3c0 1.4-1.1 2.5-2.5 2.5H13.5a2.5 2.5 0 0 1-2.5-2.5v-28A2.5 2.5 0 0 1 13.5 8Z" />
                <path d="M31 8.4v6.2h6.1" />
                <path d="M16.5 20h14M16.5 25.6h14M16.5 31.2h7" />
                <path d="M27.4 33.4c1.4-2.6 5-2.9 5.4-.4.4 2.6-4 2.9-3.2-.2.8-3.2 6.4-4.2 8.8-1.2" />
            </svg>
        );
    }
    if (name === "voices") {
        return (
            <svg {...common}>
                <path d="M7 12.6C7 10 9 8 11.6 8h14.8C29 8 31 10 31 12.6v7.8c0 2.6-2 4.6-4.6 4.6H16.6l-6 5v-5.3c-2.1-.6-3.6-2.4-3.6-4.5v-7.8Z" />
                <path d="M35.2 18.2h1.4c2.5 0 4.4 2 4.4 4.4v7c0 1.9-1.1 3.4-2.8 4.1v4.9l-5.6-4.7h-7.4c-2.4 0-4.3-1.9-4.3-4.3" />
                <path d="M13.4 15.2h11.4M13.4 19.4h6.6" />
            </svg>
        );
    }
    return (
        <svg {...common}>
            <path d="M24 39.4C14.6 33 8.3 27 8.8 19.8c.4-5.6 6.9-8.3 11.3-4 1.5 1.5 2.8 3.3 3.9 5.4 1.3-2.8 3-5.1 5.8-6.4 4.8-2.3 10.1.7 9.7 6.6-.5 6.9-7.5 13-15.5 18Z" />
            <path d="M37.8 6.6v5M35.3 9.1h5M9 34.6v3.6M7.2 36.4h3.6" />
        </svg>
    );
}

export default function Familiar() {
    return (
        <section className={styles.familiar} aria-labelledby="znajomo-title">
            <div className={styles.beam} aria-hidden="true" />
            <div className={styles.band}>
                <div className="container">
                    <h2 id="znajomo-title" className={`h2 ${styles.title}`} data-reveal>
                        Brzmi znajomo?
                    </h2>

                    <ul className={styles.cards}>
                        {PAINS.map((pain, i) => (
                            <li key={pain.icon} data-reveal style={{ "--d": 120 + i * 130 } as CSSProperties}>
                                <div className={styles.card} style={{ "--tilt": TILT[i] } as CSSProperties}>
                                    <span className={styles.tape} aria-hidden="true" />
                                    <span className={styles.icon}>
                                        <SketchRing className={styles.ring} seed={20 + i} strokeWidth={2} delay={450 + i * 130} />
                                        <Icon name={pain.icon} />
                                    </span>
                                    <p>{pain.text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
