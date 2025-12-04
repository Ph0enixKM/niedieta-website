'use client'

import { defaultMaxListeners } from "events"
import styles from "./OfferItem.module.css"
import { useState } from "react"
import { useEvent } from "@/hooks/useEvent"

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
    const event = useEvent();
    
    // Calculate discounted price if there's an active event
    const finalDiscountedPrice = event.discount > 0 
        ? Math.round(price * (1 - event.discount / 100))
        : discounted_price;

    return <div className={[styles.card, top && styles.top, showFull && styles.full].filter(Boolean).join(' ')}>
        <div className={styles.title}>{title}</div>
        <div className={styles.pricing}>
            {finalDiscountedPrice && <div className={styles.price} style={{ color }}>{finalDiscountedPrice} zł</div>}
            <div className={styles.priceGroup}>
                <div 
                    className={[styles.price, finalDiscountedPrice && styles.discount].filter(Boolean).join(' ')} 
                    style={{ 
                        color: finalDiscountedPrice ? color : color,
                        textDecorationColor: color 
                    }}
                >
                    {price} zł
                </div>
                {finalDiscountedPrice && (
                    <div className={styles.lowestPrice}>
                        Najniższa cena z 30 dni przed obniżką: {price} zł
                    </div>
                )}
            </div>
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
