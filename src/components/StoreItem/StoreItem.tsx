import Image from "next/image";
import styles from "./StoreItem.module.css";

type StoreItemType = 'Paid' | 'Free';

interface Props {
    src: string,
    title: string,
    type: StoreItemType,
    url: string,
    demoUrl?: string
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
            <a href={props.url} className={styles.buy}>
                {props.type == 'Paid' ? (
                    <Image src="/buy.svg" alt="Purchase Icon" width={30} height={30} />
                ) : (
                    <Image src="/get.svg" alt="Download Icon" width={30} height={30} />
                )}
            </a>
            {props.demoUrl && (
                <a href={props.demoUrl} className={styles.demo}>
                    WYPRÓBUJ<br/>ZA DARMO
                </a>
            )}
        </div>
    );
}