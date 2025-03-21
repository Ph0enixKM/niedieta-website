import StoreItem from "../StoreItem/StoreItem";
import styles from "./Store.module.css";

export default function Store() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>Nasze Produkty</div>
            <div className={styles.items} id="store">
                <StoreItem
                    src="/items/pakiet-jadlospisow-bonus.jpeg"
                    title="Pakiet Jadłospisów + Bonus"
                    type="Paid"
                    url="https://www.naffy.io/niedieta/pakiet-black-week-3Ba"
                    price={120.00}
                />
                <StoreItem
                    src="/items/jesienno-zimowy-jadlospis-wegetarianski.png"
                    title="Jesienno-zimowy Jadłospis Wegetariański 1800 kcal"
                    type="Paid"
                    url="https://www.naffy.io/niedieta/jesienny-jadlospis-wegetarianski-1800-kcal-HiR"
                    demoUrl="https://www.naffy.io/niedieta/probny-jesienny-jadlospis-wegetarianski-1800-kcal-Ymr"
                    price={79.00}
                />
                <StoreItem
                    src="/items/wiosenno-letni-jadlospis-wegetarianski.png"
                    title="Wiosenno-letni Jadłospis Wegetariański 1800 kcal"
                    type="Paid"
                    url="https://www.naffy.io/niedieta/letni-jadlospis-wegetarianski-1800-kcal-ra5"
                    demoUrl="https://www.naffy.io/niedieta/probny-jadlospis-wegetarianski-1800-kcal-C88"
                    price={79.00}
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
