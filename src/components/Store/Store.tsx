import StoreItem from "../StoreItem/StoreItem";
import styles from "./Store.module.css";

export default function Store() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>Nasze Produkty</div>
            <div className={styles.items}>
                <StoreItem
                    src="/letni-jadlospis-wegetarianski.png"
                    title="Letni Jadłospis Wegetariański 1800 kcal"
                    />
                <StoreItem
                    src="/letni-jadlospis-wegetarianski.png"
                    title="Letni Jadłospis Wegetariański 1800 kcal"
                    />
                <StoreItem
                    src="/letni-jadlospis-wegetarianski.png"
                    title="Letni Jadłospis Wegetariański 1800 kcal"
                    />
                <StoreItem
                    src="/letni-jadlospis-wegetarianski.png"
                    title="Letni Jadłospis Wegetariański 1800 kcal"
                />
            </div>
        </div>
    );
}