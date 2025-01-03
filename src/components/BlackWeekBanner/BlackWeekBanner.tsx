'use client';

import styles from './BlackWeekBanner.module.css';

export default function BlackWeekBanner() {
    const now = new Date();
    const begin = new Date(now.getFullYear(), 10, 15);
    const end = new Date(now.getFullYear(), 11, 24);

    if (now < begin || now > end) {
        return null;
    }

    return (
        <div className={styles.bg}>
            <div className={styles.container}>
                Wszystkie jadłospisy <b>50%</b> taniej z kodem <code>BLACKWEEK50</code>!
            </div>
        </div>
    );
}
