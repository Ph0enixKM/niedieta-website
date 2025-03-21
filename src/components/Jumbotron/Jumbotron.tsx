'use client'

import Image from "next/image";
import styles from "./Jumbotron.module.css";
import JumbotronImage from "@/../public/kinga-jumbo.webp"

export default function Jumbotron() {
    return (
        <div className={styles.jumbotron}>
            <div className={styles.container}>
                <div className={styles.title}>
                    <div className={styles.inner}>
                        <div className={styles.display}>
                            Smacznie, zdrowo,
                            <br/>
                            bez restrykcji.
                        </div>
                        <div className={styles.lato}>
                            Dietetyk Kinga Sobańska
                        </div>
                        <div className={styles.cta} onClick={() => location.href='#offer'}>
                            Umów wizytę
                        </div>
                    </div>
                </div>
                <div className={styles.image}>
                    <Image src={JumbotronImage} alt="Jumbotron" fill />
                </div>
            </div>
        </div>
    )
}
