"use client";

import { useState, type CSSProperties } from "react";
import BerrySlot from "@/components/Berry/BerrySlot";
import { ArrowUpRight, CheckIcon } from "@/components/Icons/Icons";
import Price from "@/components/Price/Price";
import { COOPERATION, type CooperationVariant } from "@/content/site";
import styles from "./Offer.module.css";

function Features({ variant }: { variant: CooperationVariant }) {
    return (
        <ul className={styles.features} key={variant.id}>
            {variant.features.map((feature, i) => (
                <li key={feature} style={{ "--i": i } as CSSProperties}>
                    <CheckIcon />
                    {feature}
                </li>
            ))}
        </ul>
    );
}

function Cta({ variant, bright }: { variant: CooperationVariant; bright: boolean }) {
    return (
        <a href={variant.href} className={`btn ${bright ? "btn-bright" : "btn-deep"} btn-block ${styles.cta}`}>
            Zaczynam współpracę
            <ArrowUpRight />
        </a>
    );
}

/** One length of the cooperation, shown side by side with the others on wider screens. The bestseller is featured. */
export function CooperationLengthCard({ variant }: { variant: CooperationVariant }) {
    const featured = Boolean(variant.bestseller);
    const id = `oferta-${variant.id}`;

    return (
        <article
            className={`${styles.card} ${featured ? styles.featured : ""}`}
            data-berry-host={featured ? "" : undefined}
            aria-labelledby={id}
        >
            {featured && <BerrySlot kind="offer" className={styles.topper} />}
            {featured && <span className={styles.ribbon}>Bestseller</span>}
            <h3 id={id} className={styles.name}>
                {variant.name}
            </h3>
            <p className={styles.tagline}>{variant.tagline}</p>
            <Price amount={variant.price} period={variant.period} className={styles.price} />
            <Features variant={variant} />
            <Cta variant={variant} bright={featured} />
        </article>
    );
}

/** All lengths in one card with a 1 / 3 / 6 month switch - for phones, where three cards would not fit side by side. */
export default function CooperationCard() {
    const [index, setIndex] = useState<number>(COOPERATION.defaultVariant);
    const variant = COOPERATION.variants[index];

    return (
        <article className={`${styles.card} ${styles.featured}`} data-berry-host="" aria-labelledby="oferta-wspolpraca">
            <BerrySlot kind="offer" className={styles.topper} />
            <h3 id="oferta-wspolpraca" className={styles.name}>
                {COOPERATION.name}
            </h3>
            <p className={styles.tagline}>{COOPERATION.tagline}</p>

            <div className={styles.lengths} role="radiogroup" aria-label="Długość współpracy">
                {COOPERATION.variants.map((option, i) => (
                    <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={i === index}
                        className={styles.length}
                        onClick={() => setIndex(i)}
                    >
                        {option.label}
                        {option.bestseller && <span className={styles.badge}>Bestseller</span>}
                    </button>
                ))}
            </div>

            <Price amount={variant.price} period={variant.period} className={styles.price} />
            <Features variant={variant} />
            <Cta variant={variant} bright />
        </article>
    );
}
