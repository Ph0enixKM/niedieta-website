'use client'

import Image from "next/image";
import styles from "./Jumbotron.module.css";
import JumbotronImage from "@/../public/jumbotron.webp"

export default function Jumbotron() {
    return (
        <div className={styles.jumbotron}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Image src="/logo.svg" alt="Logo" width={200} height={50} />
                </div>
                <div className={styles.title}>
                    <div className={styles.inner}>
                        <div className={styles.lato}>
                            Jesienno-zimowy jadłospis
                        </div>
                        <div className={styles.playwrite}>
                            wegetariański
                        </div>
                        <div className={styles.cta} onClick={() => location.href='#store'}>
                            Już dostępny!
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