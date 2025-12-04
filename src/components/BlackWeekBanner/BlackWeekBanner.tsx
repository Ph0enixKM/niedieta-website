'use client';

import styles from './BlackWeekBanner.module.css';
import { useEvent } from '@/hooks/useEvent';

export default function BlackWeekBanner() {
    const event = useEvent();

    if (event.type !== 'BlackWeek') {
        return null;
    }

    return (
        <div className={styles.bg}>
            <div className={styles.container}>
                Cała oferta i nasze produkty <b>{event.discount}%</b> taniej!
            </div>
        </div>
    );
}
