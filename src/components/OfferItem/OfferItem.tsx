import { defaultMaxListeners } from "events"
import styles from "./OfferItem.module.css"

interface Props {
    title: string,
    price: number,
    details: string[],
    color?: string,
    top?: boolean
}

export default function OfferItem({ title, price, color, top, details }: Props) {
    return <div className={[styles.card, top && styles.top].filter(Boolean).join(' ')}>
        <div className={styles.title}>{title}</div>
        <div className={styles.price} style={{ color }}>{price} zł</div>
        <ul className={styles.list}>
            {details.map((item) => <li>{item}</li>)}
        </ul>
    </div>
}