import { ArrowUpRight, CheckIcon } from "@/components/Icons/Icons";
import Price from "@/components/Price/Price";
import { CONSULTATION } from "@/content/site";
import styles from "./Offer.module.css";

export default function ConsultationCard() {
    return (
        <article className={styles.card} aria-labelledby="oferta-konsultacja">
            <h3 id="oferta-konsultacja" className={styles.name}>
                {CONSULTATION.name}
            </h3>
            <p className={styles.tagline}>{CONSULTATION.tagline}</p>

            <Price amount={CONSULTATION.price} className={styles.price} />
            <p className={styles.variantName}>{CONSULTATION.variantName}</p>

            <ul className={styles.features}>
                {CONSULTATION.features.map((feature) => (
                    <li key={feature}>
                        <CheckIcon />
                        {feature}
                    </li>
                ))}
            </ul>

            <a href={CONSULTATION.href} className={`btn btn-deep btn-block ${styles.cta}`}>
                {CONSULTATION.cta}
                <ArrowUpRight />
            </a>
        </article>
    );
}
