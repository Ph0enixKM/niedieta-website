import StoreItem from "../StoreItem/StoreItem";
import styles from "./Store.module.css";

export default function Store() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>Nasze Produkty</div>
            <div className={styles.items} id="store">
                <StoreItem
                    src="/items/bajgle.jpeg"
                    title="Bajgle."
                    type="Free"
                    url="https://www.naffy.io/niedieta/bajgle-dSd"
                />
            </div>
        </div>
    );
}
