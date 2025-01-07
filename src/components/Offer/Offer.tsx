import OfferItem from "../OfferItem/OfferItem"
import styles from "./Offer.module.css"

export default function Offer() {
    return <div className={styles.container}>
        <OfferItem
            title="Jadłospis"
            price={100}
            color="#fc3376"
            details={[
                'rozpoczęcie współpracy w ciągu 5 dni roboczych (w tym czasie powstanie Twoje konto w aplikacji, poprzez którą możliwy będzie szybki kontakt, monitorowanie postępów i wypełnienie wstępnej ankiety)',
                'indywidualny jadłospis 7-dniowy ułożony na podstawie ankiety (dostosowany do Twoich potrzeb i upodobań,  jadłospis otrzymasz w 7 dni roboczych od wypełnienia ankiety)',
                'brak nielubianych produktów',
                'wymiana posiłków w aplikacji',
                'interaktywna lista zakupów',
                'proponowana suplementacja',
                'kontakt i odpowiedzi na wiadomości w 48h przez aplikację',
                'analiza postępów i wsparcie',
                'płatność jednorazowa'
            ]}
        />
        <OfferItem
            title="Dieta+"
            price={150}
            color="#eb4c44"
            details={[
                '60 minut rozmowy online',
                'Wywiad zdrowotny i żywieniowy',
                'Analiza aktualnego sposobu żywienia',
                'Wspólne opracowanie strategii działania',
                'Wsparcie i kontakt w aplikacji przez miesiąc od wizyty',
                'rozpoczęcie współpracy w ciągu 3 dni roboczych (w tym czasie powstanie Twoje konto w aplikacji, poprzez którą możliwy będzie szybki kontakt, monitorowanie postępów i wypełnienie wstępnej ankiety)',
                'indywidualny jadłospis 7-dniowy ułożony na podstawie ankiety (dostosowany do Twoich potrzeb i upodobań,  jadłospis otrzymasz w 7 dni roboczych od wypełnienia ankiety)',
                'brak nielubianych produktów',
                'wymiana posiłków w aplikacji',
                'interaktywna lista zakupów',
                'proponowana suplementacja',
                'kontakt i odpowiedzi na wiadomości w 24h przez aplikację',
                'analiza postępów i wsparcie',
                'płatność jednorazowa'
            ]}
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