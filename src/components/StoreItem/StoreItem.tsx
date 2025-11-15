'use client';

import Image from "next/image";
import styles from "./StoreItem.module.css";
import { useEvent } from "@/hooks/useEvent";

type StoreItemType = 'Paid' | 'Free';

interface Props {
    src: string,
    title: string,
    type: StoreItemType,
    url: string,
    demoUrl?: string,
    price?: number
}

export default function StoreItem(props: Props) {
    const event = useEvent();
    
    // Calculate discounted price if there's an active event and item is paid
    const hasDiscount = event.discount > 0 && props.price;
    const originalPrice = (props.price ?? 0).toFixed(2);
    const finalPrice = hasDiscount
        ? (parseFloat(originalPrice) * (1 - event.discount / 100)).toFixed(2)
        : originalPrice;
    return (
        <div className={styles.container}>
            <div className={styles.image}>
                <Image src={props.src} alt="Shop item" fill />
            </div>
            <div className={[styles.title, props.title.length <= 10 && styles.short].filter(Boolean).join(' ')}>
                {props.title}
            </div>
            <div className={styles.buttons}>
                {props.type == 'Paid' && (
                    <>
                        <a href={props.url} className={styles.buy}>
                            {hasDiscount && <span className={styles.originalPrice}>{originalPrice} zł</span>}
                            <span>{props.type == 'Paid' ? `${finalPrice} zł` : 'Darmowe'}</span>
                        </a>
                        {hasDiscount && (
                            <div className={styles.lowestPrice}>
                                Najniższa cena z 30 dni przed obniżką: {originalPrice} zł
                            </div>
                        )}
                    </>
                )}
                {props.type == 'Free' && (
                    <a href={props.url} className={styles.get}>
                        <Image src="/get.svg" alt="Download Icon" width={30} height={30} />
                    </a>
                )}
                {props.demoUrl && (
                    <a href={props.demoUrl} className={styles.demo}>
                        WYPRÓBUJ<br/>ZA DARMO
                    </a>
                )}
            </div>
        </div>
    );
}
