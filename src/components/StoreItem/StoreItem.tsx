import Image from "next/image";
import styles from "./StoreItem.module.css";

interface Props {
    src: string,
    title: string,
    purchaseUrl: string,
    demoUrl: string
}

export default function StoreItem(props: Props) {
    return (
        <div className={styles.container}>
            <div className={styles.image}>
                <Image src={props.src} alt="Shop item" fill />
            </div>
            <div className={styles.title}>
                {props.title}
            </div>
            <a href={props.purchaseUrl} className={styles.buy}>
                <Image src="/buy.svg" alt="Purchase Icon" width={30} height={30} />
            </a>
            <a href={props.demoUrl} className={styles.demo}>
                WYPRÓBUJ<br/>ZA DARMO
            </a>
        </div>
    );
}