"use client";

import { useEffect, useRef } from "react";

interface Props {
    text: string;
    className?: string;
}

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
export default function ScrollWords({ text, className }: Props) {
    const ref = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const words = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-word]"));
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        let raf = 0;
        let lit = -1;

        const update = () => {
            raf = 0;
            const r = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const progress = reduced.matches ? 1 : (vh * 0.86 - r.top) / (r.height + vh * 0.34);
            const next = Math.round(Math.min(1, Math.max(0, progress)) * words.length);
            if (next === lit) return;
            lit = next;
            words.forEach((word, i) => word.toggleAttribute("data-lit", i < next));
        };
        const schedule = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
        };
    }, []);

    return (
        <p ref={ref} className={className}>
            {text.split(" ").map((word, i) => (
                <span key={i} data-word="">
                    {word}{" "}
                </span>
            ))}
        </p>
    );
}
