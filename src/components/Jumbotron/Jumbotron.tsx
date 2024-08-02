import Image from "next/image";
import styles from "./Jumbotron.module.css";

export default function Jumbotron() {
    return (
        <div className={styles.jumbotron}>
            <div className={styles.container}>
                <div className={styles.title}>
                    <div className={styles.inner}>
                        <div className={styles.lato}>
                            Letni jadłospis
                        </div>
                        <div className={styles.playwrite}>
                            wegetariański
                        </div>
                        <div className={styles.cta}>
                            Już dostępny!
                        </div>
                    </div>
                </div>
                <div className={styles.image}>
                    <Image src="/jumbotron.png" alt="Jumbotron" fill />
                </div>
            </div>
        </div>
    )
}