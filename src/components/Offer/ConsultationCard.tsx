"use client";

import { useState, type CSSProperties } from "react";
import { ArrowUpRight, CheckIcon } from "@/components/Icons/Icons";
import Price from "@/components/Price/Price";
import { CONSULTATION } from "@/content/site";
import styles from "./Offer.module.css";

export default function ConsultationCard() {
    const [index, setIndex] = useState(0);
    const variant = CONSULTATION[index];

    return (
        <article className={styles.card} aria-labelledby="oferta-konsultacja">
            <h3 id="oferta-konsultacja" className={styles.name}>
                Konsultacja
            </h3>
            <p className={styles.tagline}>Gdy potrzebujesz kierunku i planu zmiany dopasowanego do Ciebie.</p>

            <div className={styles.toggle} role="radiogroup" aria-label="Wariant konsultacji" style={{ "--i": index } as CSSProperties}>
                {CONSULTATION.map((option, i) => (
                    <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={i === index}
                        className={styles.toggleOption}
                        onClick={() => setIndex(i)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <Price amount={variant.price} className={styles.price} />
            <p className={styles.variantName}>{variant.name}</p>

            <ul className={styles.features} key={variant.id}>
                {variant.features.map((feature, i) => (
                    <li key={feature} style={{ "--i": i } as CSSProperties}>
                        <CheckIcon />
                        {feature}
                    </li>
                ))}
            </ul>
            {variant.note && <p className={styles.fine}>{variant.note}</p>}

            <a href={variant.href} className={`btn btn-primary btn-block ${styles.cta}`}>
                {variant.cta}
                <ArrowUpRight />
            </a>
        </article>
    );
}
