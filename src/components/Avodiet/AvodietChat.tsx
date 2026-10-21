"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Avodiet.module.css";

interface Message {
    title: string;
    text: string;
}

const REPLY = "😍";
/**
 * The conversation's rhythm, one step per message and the last for the reply: `wait` is the pause before the typing
 * indicator (or the drafted reply) shows up, `type` how long it stays before the message is sent. Uneven on purpose,
 * like a real chat: a long first message (its wait also lets the window finish fading in), a quick follow-up, a
 * thought-out third one, then the reader takes a moment to read before answering.
 */
const RHYTHM = [
    { wait: 600, type: 1500 },
    { wait: 300, type: 650 },
    { wait: 850, type: 1150 },
    { wait: 1400, type: 950 },
];
// each visit gets slightly different timings, up to this share either way
const JITTER = 0.15;
// a slot counts as scrolled into view once its foot passes this share of the viewport
const SEND_LINE = 0.9;

/**
 * The chat window. Kinga's messages are "sent" one at a time as their slots scroll into view, each after a typing
 * indicator, and the reader answers with an emoji at the end. Every slot is laid out from the start (hidden until
 * sent), so nothing shifts; without JS or with reduced motion the whole thread just shows.
 */
export default function AvodietChat({ messages }: { messages: readonly Message[] }) {
    const total = messages.length + 1;
    const slotRefs = useRef<(HTMLLIElement | null)[]>([]);
    const [sent, setSent] = useState(0);
    const [typing, setTyping] = useState(false);
    const [drafting, setDrafting] = useState(false);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setSent(total);
            return;
        }

        let target = 0;
        let done = 0;
        let busy = false;
        let frame = 0;
        const timers: number[] = [];
        const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
        const vary = (ms: number) => ms * (1 + (Math.random() * 2 - 1) * JITTER);

        const advance = () => {
            if (busy || done >= target) return;
            busy = true;
            const step = RHYTHM[Math.min(done, RHYTHM.length - 1)];
            const isReply = done >= messages.length;
            later(() => {
                if (isReply) setDrafting(true);
                else setTyping(true);
                later(() => {
                    done += 1;
                    setTyping(false);
                    setDrafting(false);
                    setSent(done);
                    busy = false;
                    advance();
                }, vary(step.type));
            }, vary(step.wait));
        };

        const measure = () => {
            frame = 0;
            const line = window.innerHeight * SEND_LINE;
            let visible = 0;
            for (const slot of slotRefs.current) {
                if (slot && slot.getBoundingClientRect().bottom < line) visible += 1;
                else break;
            }
            if (visible > target) {
                target = visible;
                advance();
            }
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(measure);
        };

        measure();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            cancelAnimationFrame(frame);
            timers.forEach(clearTimeout);
        };
    }, [messages.length, total]);

    return (
        <>
            <ol className={styles.thread}>
                {messages.map((message, i) => (
                    <li
                        key={message.title}
                        ref={(el) => {
                            slotRefs.current[i] = el;
                        }}
                        className={styles.message}
                        data-sent={i < sent ? "" : undefined}
                    >
                        {typing && i === sent && (
                            <span className={styles.typing} aria-hidden="true">
                                <i />
                                <i />
                                <i />
                            </span>
                        )}
                        <div className={styles.bubble}>
                            <h3>{message.title}</h3>
                            <p>{message.text}</p>
                        </div>
                    </li>
                ))}
                <li
                    ref={(el) => {
                        slotRefs.current[messages.length] = el;
                    }}
                    className={styles.reply}
                    data-sent={sent >= total ? "" : undefined}
                >
                    <span role="img" aria-label="Odpowiedź: zachwyt">
                        {REPLY}
                    </span>
                </li>
            </ol>

            <div className={styles.compose} data-drafting={drafting ? "" : undefined} aria-hidden="true">
                <span className={styles.field}>{drafting ? REPLY : "Napisz wiadomość…"}</span>
                <span className={styles.send}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19V5.6M6.2 11 12 5.2l5.8 5.8" />
                    </svg>
                </span>
            </div>
        </>
    );
}
