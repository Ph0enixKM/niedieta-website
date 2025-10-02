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
                    NieDieta Balans, to <b>comiesięczny 7-dniowy plan</b><br/>(1800&nbsp;kcal, 100&nbsp;g białka) <b>z sezonowymi przepisami</b> i <b>listą zakupów</b>; jesz&nbsp;<b>bez&nbsp;wyrzeczeń</b>, łatwiej <b>utrzymujesz lub redukujesz wagę</b>. Masz dostęp do <b>archiwum jadłospisów</b> i <b>wsparcie dietetyczki</b>.<br/>Dołącz i poczuj różnicę.
                </p>
                <a href={href} className={styles.button}>
                    Dołączam!
                </a>
            </div>
        </div>
    )
}
