'use client';

import styles from './ValentinesCard.module.css';
import Image from 'next/image';
import valentinesImage from '@/../public/valentines.webp';
import valentinesMobileImage from '@/../public/valentines-mobile.webp';

export default function ValentinesCard() {
    const now = new Date();
    const begin = new Date(now.getFullYear(), 1, 10);
    const end = new Date(now.getFullYear(), 1, 16);

    if (now < begin || now > end) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <Image src={valentinesImage} alt="Valentines offer" className={styles.image} />
                <Image src={valentinesMobileImage} alt="Valentines offer" className={styles.mobile} />
            </div>
        </div>
    );
}
