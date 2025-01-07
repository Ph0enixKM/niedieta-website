import OfferItem from "../OfferItem/OfferItem"
import styles from "./Offer.module.css"

export default function Offer() {
    return <div className={styles.container}>
        <OfferItem
            title="Jadłospis"
            price={100}
            color="#fc3376"
            details={[]}
        />
        <OfferItem
            title="Dieta+"
            price={150}
            color="#eb4c44"
            details={[]}
            top
        />
        <OfferItem
            title="Konsultacje"
            price={100}
            color="#ed6e40"
            details={[
                '60 minut rozmowy online',
                'Wywiad zdrowotny i żywieniowy',
                'Analiza aktualnego sposobu żywienia',
                'Wspólne opracowanie strategii działania',
                'Wsparcie i kontakt w aplikacji przez miesiąc od wizyty'
            ]}
        />
    </div>
}