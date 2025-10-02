'use client'

import Image from "next/image";
import styles from "./SubscriptionCard.module.css";
import imgSrc from "@/../public/niedieta-balans.jpeg";

interface Props {
    title: string,
    price: number,
    href?: string
}

export default function SubscriptionCard({ title, price, href }: Props) {
    const content = (
        <>
            <div className={styles.imageContainer}>
                <Image src={imgSrc} alt={title} width={375} height={0} style={{ width: '100%', height: 'auto' }} />
            </div>
            <div className={styles.info}>
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
