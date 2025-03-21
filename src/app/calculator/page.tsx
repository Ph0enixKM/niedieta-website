import Navbar from "@/components/Navbar/Navbar";
import styles from "./page.module.css";

export default function Home() {
    return <>
        <Navbar />
        <div className={styles.page}>
            <div className={styles.paper}>
                <h1 className={styles.title}>Kalkulatory</h1>
                <p className={styles.description}>
                    Wypełnij dane i poznaj swoje BMI, podstawową przemianę materii (PPM) i całkowitą przemianę materii (CPM).
                </p>
            </div>

            <div className={styles.grid}>
                <div className={styles.paper}>
                    <div className={styles.grid}>
                        <div className={styles.button}>
                            Male
                        </div>
                        <div className={styles.button}>
                            Female
                        </div>
                    </div>
                </div>
                <div className={[styles.paper, styles.flex].join(' ')}>
                    sranie
                </div>
            </div>

            <div className={styles.paper}>
                <p className={styles.description}>
                    Jeśli jesteś w ciąży albo masz jakąś jednostkę chorobową lub jesteś sportowcem, to niektóre z tych wskaźników mogą być niemiarodajne. W takim wypadku skonsultuj się z dietetykiem lub lekarzem.
                </p>
            </div>
        </div>
    </>;
}
