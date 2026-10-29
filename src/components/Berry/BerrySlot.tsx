import type { CSSProperties } from "react";
import styles from "./Berry.module.css";

/** Displayed width of each slot's still berry (see Hero.module.css and Offer.module.css), for picking the image size. */
const SIZES = {
    hero: "clamp(88px, 10.9vw, 147px)",
    offer: "92px",
} as const;

interface Props {
    kind: keyof typeof SIZES;
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
                srcSet="/brand/berry-96.webp 96w, /brand/berry-192.webp 192w, /brand/berry-384.webp 384w"
                sizes={SIZES[kind]}
                alt=""
                width={192}
                height={192}
                loading="lazy"
                decoding="async"
            />
        </div>
    );
}
