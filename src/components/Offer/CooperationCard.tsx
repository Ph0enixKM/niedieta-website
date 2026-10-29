"use client";

import { useState, type CSSProperties } from "react";
import BerrySlot from "@/components/Berry/BerrySlot";
import { ArrowUpRight, CheckIcon } from "@/components/Icons/Icons";
import Price from "@/components/Price/Price";
import { COOPERATION } from "@/content/site";
import styles from "./Offer.module.css";

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
                        {"bestseller" in option && option.bestseller && <span className={styles.badge}>Bestseller</span>}
                    </button>
                ))}
            </div>

            <Price amount={variant.price} period={variant.period} className={styles.price} />

            <ul className={styles.features} key={variant.id}>
                {variant.features.map((feature, i) => (
                    <li key={feature} style={{ "--i": i } as CSSProperties}>
                        <CheckIcon />
                        {feature}
                    </li>
                ))}
            </ul>

            <a href={variant.href} className={`btn btn-bright btn-block ${styles.cta}`}>
                Zaczynam współpracę
                <ArrowUpRight />
            </a>
        </article>
    );
}
