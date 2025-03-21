'use client'

import { defaultMaxListeners } from "events"
import styles from "./OfferItem.module.css"
import { useState } from "react"

interface Props {
    title: string,
    description: string,
    price: number,
    discounted_price?: number,
    details: string[],
    color?: string,
    href?: string,
    top?: boolean
}

const parseMarkdown = (text: string) => {
    return text.replace(/\*\*([^\*]+)\*\*/, "<b>$1</b>")
}

export default function OfferItem({ title, description, price, discounted_price, color, top, details, href }: Props) {
    const [showFull, setShowFull] = useState(false);

    return <div className={[styles.card, top && styles.top, showFull && styles.full].filter(Boolean).join(' ')}>
        <div className={styles.title}>{title}</div>
        <div className={styles.pricing}>
            {discounted_price && <div className={styles.price} style={{ color }}>{discounted_price} zł</div>}
            <div className={[styles.price, discounted_price && styles.discount].filter(Boolean).join(' ')} style={{ color }}>{price} zł</div>
        </div>
        <div className={styles.description}>{description}</div>
        <ul className={styles.list}>
            {details.map((item, index) => <li key={index} dangerouslySetInnerHTML={{ __html: parseMarkdown(item) }}></li>)}
        </ul>
        <div className={styles.spacer} />
        <a className={styles.button} href={href}>
            Zobacz Ofertę
        </a>
        <div className={styles["show-more"]} onClick={() => setShowFull(true)} />
    </div>
}
