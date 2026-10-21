"use client";

import { useState, type CSSProperties } from "react";
import { ArrowUpRight, CheckIcon } from "@/components/Icons/Icons";
import Price from "@/components/Price/Price";
import { CONSULTATION } from "@/content/site";
import styles from "./Offer.module.css";

export default function ConsultationCard() {
    const [withPlan, setWithPlan] = useState(false);
    const variant = CONSULTATION[withPlan ? 1 : 0];

    return (
        <article className={styles.card} aria-labelledby="oferta-konsultacja">
            <h3 id="oferta-konsultacja" className={styles.name}>
                Konsultacja
            </h3>
            <p className={styles.tagline}>Gdy potrzebujesz kierunku i planu zmiany dopasowanego do Ciebie.</p>

            <label className={styles.addon}>
                <input type="checkbox" checked={withPlan} onChange={(event) => setWithPlan(event.target.checked)} />
                <span className={styles.addonBox} aria-hidden="true">
                    <CheckIcon />
                </span>
                <span className={styles.addonLabel}>{CONSULTATION[1].label}</span>
                <span className={styles.addonDelta}>+{CONSULTATION[1].price - CONSULTATION[0].price} zł</span>
            </label>

            <Price amount={variant.price} className={styles.price} />
            <p className={styles.variantName}>{variant.name}</p>

            <ul className={styles.features}>
                {variant.features.map((feature, i) => (
                    <li key={feature} style={{ "--i": i } as CSSProperties}>
                        <CheckIcon />
                        {feature}
                    </li>
                ))}
            </ul>
            {variant.note && <p className={styles.fine}>{variant.note}</p>}

            <a href={variant.href} className={`btn btn-deep btn-block ${styles.cta}`}>
                {variant.cta}
                <ArrowUpRight />
            </a>
        </article>
    );
}
