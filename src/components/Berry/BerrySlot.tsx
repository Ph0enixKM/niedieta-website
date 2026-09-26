import type { CSSProperties } from "react";
import styles from "./Berry.module.css";

interface Props {
    kind: "hero" | "offer";
    className?: string;
    style?: CSSProperties;
}

/** Placeholder box a 3D berry attaches to. Shows a still image until (or unless) WebGL takes over. */
export default function BerrySlot({ kind, className, style }: Props) {
    return (
        <div data-berry={kind} className={[styles.slot, className].filter(Boolean).join(" ")} style={style} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                className={styles.fallback}
                src="/brand/berry-192.webp"
                srcSet="/brand/berry-192.webp 1x, /brand/berry-384.webp 2x"
                alt=""
                width={192}
                height={192}
                loading="lazy"
                decoding="async"
            />
        </div>
    );
}
