'use client'

import Image from "next/image";
import styles from "./SubscriptionCard.module.css";

interface Props {
    src: string,
    title: string,
    price: number,
    href?: string
}

export default function SubscriptionCard({ src, title, price, href }: Props) {
    const content = (
        <>
            <div className={styles.imageContainer}>
                <Image src={src} alt={title} fill />
            </div>
            <div className={styles.info}>
                <div className={styles.title}>{title}</div>
                <div className={styles.price}>{price} zł</div>
            </div>
        </>
    );

    if (href) {
        return (
            <a href={href} className={styles.card}>
                {content}
            </a>
        );
    }

    return (
        <div className={styles.card}>
            {content}
        </div>
    );
}
