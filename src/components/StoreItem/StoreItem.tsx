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
            {props.type == 'Paid' && (
                <a href={props.url} className={styles.buy}>
                    <Image src="/buy.svg" alt="Purchase Icon" width={30} height={30} />
                </a>
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
    );
}