'use client'

import SubscriptionCard from "../SubscriptionCard/SubscriptionCard"
import styles from "./SubscriptionSection.module.css"

interface Props {
    src: string,
    title: string,
    price: number,
    href?: string
}

export default function SubscriptionSection({ src, title, price, href }: Props) {
    return (
        <div className={styles.section}>
            <div className={styles.cardWrapper}>
                <SubscriptionCard 
                    src={src}
                    title={title}
                    price={price}
                    href={href}
                />
            </div>
            <div className={styles.content}>
                <h2 className={styles.title}>NieDieta Balans</h2>
                <p className={styles.description}>
                    NieDieta Balans, to comiesięczny 7-dniowy plan (1800 kcal, 100 g białka) z sezonowymi przepisami i listą zakupów; jesz bez wyrzeczeń, łatwiej utrzymujesz lub redukujesz wagę. Masz dostęp do archiwum jadłospisów i wsparcie dietetyczki. Dołącz i poczuj różnicę.
                </p>
            </div>
        </div>
    )
}
