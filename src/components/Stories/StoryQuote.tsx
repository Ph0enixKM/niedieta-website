"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./Stories.module.css";

/** Long opinions start clamped; the toggle only appears when the text actually overflows the clamp. */
export default function StoryQuote({ quote }: { quote: string }) {
    const ref = useRef<HTMLQuoteElement>(null);
    const id = useId();
    const [open, setOpen] = useState(false);
    const [overflows, setOverflows] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || open) return;
        const measure = () => setOverflows(el.scrollHeight > el.clientHeight + 1);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, [open]);

    return (
        <>
            <blockquote ref={ref} id={id} className={styles.quote} data-open={open || undefined}>
                {quote}
            </blockquote>
            {(overflows || open) && (
                <button type="button" className={styles.more} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
                    {open ? "Zwiń" : "Czytaj dalej"}
                </button>
            )}
        </>
    );
}
