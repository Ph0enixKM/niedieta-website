"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { MailIcon } from "@/components/Icons/Icons";
import { CONTACT_EMAIL, FAQ } from "@/content/site";
import styles from "./Faq.module.css";

type Tone = "sky" | "soft" | "paper" | "sand" | "espresso";

type Curl = { lift: number; bend: number; sway: number; skew: number };

// Controlled chaos: every note gets its own tilt, nudge, colour and resting curl (fixed values, so SSR matches).
// curl: lift = how far the free edge already stands off the wall (deg), bend = how bowed the paper is (0–1),
// sway = which way the light rolls across it, skew = which corner curls more (-1 left … 1 right)
const NOTES: { tilt: number; x: number; y: number; tone: Tone; curl: Curl }[] = [
    { tilt: -3.2, x: 6, y: 12, tone: "sky", curl: { lift: 7, bend: 0.3, sway: -1.2, skew: 0.35 } },
    { tilt: 2.4, x: -8, y: -4, tone: "espresso", curl: { lift: 3.5, bend: 0.18, sway: 0.8, skew: -0.25 } },
    { tilt: -1.3, x: 4, y: 20, tone: "sand", curl: { lift: 9, bend: 0.36, sway: 1.5, skew: -0.45 } },
    { tilt: 3.4, x: -6, y: 2, tone: "soft", curl: { lift: 5, bend: 0.24, sway: -0.6, skew: 0.15 } },
    { tilt: -2.6, x: 10, y: -2, tone: "paper", curl: { lift: 8, bend: 0.32, sway: 1.1, skew: 0.4 } },
    { tilt: 1.7, x: -4, y: 14, tone: "sky", curl: { lift: 4, bend: 0.2, sway: -1.4, skew: -0.3 } },
];

const curlStyle = (c: Curl) => ({
    "--rest-lift": `${c.lift}deg`,
    "--rest-bend": c.bend,
    "--rest-sway": `${c.sway}deg`,
    "--skew": c.skew,
});
const MAX_LIFT = 24;
// above this speed (px/s) a scroll counts as a flick and the notes really start to flap
const FLICK = 1200;
const ASK = { tilt: -3.8, x: 2, y: 6, curl: { lift: 6, bend: 0.26, sway: 0.9, skew: -0.2 } };

function FlipIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 12a7.5 7.5 0 0 1 12.9-5.2L19.5 9" />
            <path d="M19.5 4.5V9H15" />
            <path d="M19.5 12a7.5 7.5 0 0 1-12.9 5.2L4.5 15" />
            <path d="M4.5 19.5V15H9" />
        </svg>
    );
}

/** The notes are glued at the top: scrolling makes their free bottom edge lift and sway, then settle. */
function useFlutter(board: RefObject<HTMLElement | null>) {
    useEffect(() => {
        const root = board.current;
        if (!root) return;
        const notes = Array.from(root.querySelectorAll<HTMLElement>("[data-note]"));
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        const springs = notes.map((_, i) => ({
            lift: 0,
            liftV: 0,
            swing: 0,
            swingV: 0,
            k: 26 + ((i * 37) % 18),
            c: 7 + ((i * 13) % 3),
            dir: i % 2 ? 1 : -1,
            gain: 0.8 + ((i * 29) % 40) / 100,
        }));
        let raf = 0;
        let last = 0;
        let lastY = window.scrollY;
        let velocity = 0;
        let visible = false;

        const tick = (now: number) => {
            raf = 0;
            // rAF timestamps can predate the moment the loop was started, so the first frame gets a nominal step
            const dt = last ? Math.min(0.05, Math.max(0.001, (now - last) / 1000)) : 1 / 60;
            last = now;
            const y = window.scrollY;
            const raw = (y - lastY) / dt;
            lastY = y;
            velocity += (raw - velocity) * (1 - Math.exp(-5 * dt));

            let moving = Math.abs(velocity) > 4;
            springs.forEach((s, i) => {
                const speed = Math.abs(velocity);
                const flick = Math.max(0, speed - FLICK);
                const liftTarget = Math.min(MAX_LIFT, (speed * 0.011 + flick * 0.012) * s.gain);
                const swing = Math.min(7, (speed * 0.003 + flick * 0.003) * s.gain);
                const swingTarget = -Math.sign(velocity) * s.dir * swing;
                s.liftV += ((liftTarget - s.lift) * s.k - s.liftV * s.c) * dt;
                s.lift += s.liftV * dt;
                if (s.lift < 0) {
                    // it can't swing into the wall
                    s.lift = 0;
                    s.liftV = Math.abs(s.liftV) * 0.25;
                }
                s.swingV += ((swingTarget - s.swing) * s.k * 0.8 - s.swingV * s.c) * dt;
                s.swing += s.swingV * dt;
                const note = notes[i];
                note.style.setProperty("--lift", `${s.lift.toFixed(2)}deg`);
                note.style.setProperty("--swing", `${s.swing.toFixed(2)}deg`);
                note.style.setProperty("--l", (s.lift / MAX_LIFT).toFixed(3));
                if (s.lift > 0.03 || Math.abs(s.liftV) > 0.05 || Math.abs(s.swing) > 0.03 || Math.abs(s.swingV) > 0.05) moving = true;
            });
            if (moving && visible) raf = requestAnimationFrame(tick);
        };

        const kick = () => {
            if (raf || !visible || reduced.matches) return;
            last = 0;
            raf = requestAnimationFrame(tick);
        };

        const io = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting;
                lastY = window.scrollY;
                if (visible) kick();
            },
            { rootMargin: "120px 0px" },
        );
        io.observe(root);
        window.addEventListener("scroll", kick, { passive: true });
        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            window.removeEventListener("scroll", kick);
        };
    }, [board]);
}

export default function Faq() {
    const [flipped, setFlipped] = useState<ReadonlySet<number>>(new Set());
    // notes still flipping back down, so they don't slip behind their neighbours mid-air
    const [landing, setLanding] = useState<ReadonlySet<number>>(new Set());
    const boardRef = useRef<HTMLUListElement>(null);
    useFlutter(boardRef);

    const toggle = (set: typeof setFlipped, i: number, on: boolean) =>
        set((prev) => {
            const next = new Set(prev);
            if (on) next.add(i);
            else next.delete(i);
            return next;
        });

    const flip = (i: number, show: boolean) => {
        toggle(setFlipped, i, show);
        if (!show) {
            toggle(setLanding, i, true);
            window.setTimeout(() => toggle(setLanding, i, false), 850);
        }
        // keep keyboard focus on the visible side of the note
        requestAnimationFrame(() => document.getElementById(`faq-${show ? "back" : "front"}-${i}`)?.focus({ preventScroll: true }));
    };

    return (
        <section className={styles.faq} id="faq" aria-labelledby="faq-title">
            <div className="container">
                <header className={styles.header}>
                    <h2 id="faq-title" className="h2" data-reveal>
                        Najczęściej zadawane pytania
                    </h2>
                </header>

                <ul ref={boardRef} className={styles.board}>
                    {FAQ.map((item, i) => {
                        const layout = NOTES[i % NOTES.length];
                        const isFlipped = flipped.has(i);
                        return (
                            <li key={item.q} className={styles.slot} data-reveal data-raised={isFlipped || landing.has(i) || undefined} style={{ "--d": 60 + i * 70 } as CSSProperties}>
                                <div
                                    className={`${styles.note} ${styles[layout.tone]}`}
                                    data-note=""
                                    style={{ "--tilt": `${layout.tilt}deg`, "--x": `${layout.x}px`, "--y": `${layout.y}px`, ...curlStyle(layout.curl) } as CSSProperties}
                                >
                                    <span className={styles.glue} aria-hidden="true" />
                                    <div className={styles.flipper} data-flipped={isFlipped || undefined}>
                                        <button
                                            id={`faq-front-${i}`}
                                            type="button"
                                            className={`${styles.face} ${styles.front}`}
                                            aria-expanded={isFlipped}
                                            aria-controls={`faq-back-${i}-panel`}
                                            inert={isFlipped}
                                            onClick={() => flip(i, true)}
                                        >
                                            <span className={styles.question}>{item.q}</span>
                                            <span className={`${styles.flipIcon} ${styles.emboss}`}>
                                                <FlipIcon />
                                            </span>
                                        </button>
                                        <div id={`faq-back-${i}-panel`} className={`${styles.face} ${styles.back}`} inert={!isFlipped}>
                                            <div className={styles.answer}>
                                                {item.a.map((paragraph) => (
                                                    <p key={paragraph}>{paragraph}</p>
                                                ))}
                                            </div>
                                            <button id={`faq-back-${i}`} type="button" className={`${styles.backButton} ${styles.emboss}`} onClick={() => flip(i, false)}>
                                                <FlipIcon />
                                                Wróć do pytania
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}

                    <li className={styles.slot} data-reveal style={{ "--d": 60 + FAQ.length * 70 } as CSSProperties}>
                        <div
                            className={`${styles.note} ${styles.espresso}`}
                            data-note=""
                            style={{ "--tilt": `${ASK.tilt}deg`, "--x": `${ASK.x}px`, "--y": `${ASK.y}px`, ...curlStyle(ASK.curl) } as CSSProperties}
                        >
                            <span className={styles.glue} aria-hidden="true" />
                            <div className={`${styles.face} ${styles.askFace}`}>
                                <p className={styles.askTitle}>Nie ma tu Twojego pytania?</p>
                                <a href={`mailto:${CONTACT_EMAIL}`} className={`${styles.askButton} ${styles.emboss}`}>
                                    <MailIcon />
                                    Napisz do mnie!
                                </a>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    );
}
