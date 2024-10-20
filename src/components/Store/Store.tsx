import StoreItem from "../StoreItem/StoreItem";
import styles from "./Store.module.css";

export default function Store() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>Nasze Produkty</div>
            <div className={styles.items} id="store">
                <StoreItem
                    src="/items/letni-jadlospis-wegetarianski.png"
                    title="Letni Jadłospis Wegetariański 1800 kcal"
                    type="Paid"
                    url="https://www.naffy.io/niedieta/letni-jadlospis-wegetarianski-1800-kcal-ra5"
                    demoUrl="https://www.naffy.io/niedieta/probny-jadlospis-wegetarianski-1800-kcal-C88"
                />
                <StoreItem
                    src="/items/tydzien-obiadow.png"
                    title="Tydzień Obiadów 7 przepisów"
                    type="Free"
                    url="https://www.naffy.io/niedieta/tydzien-obiadow-sSG"
                />
            </div>
        </div>
    );
}