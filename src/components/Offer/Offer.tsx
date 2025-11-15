'use client'

import { useState } from "react"
import OfferItem from "../OfferItem/OfferItem"
import SubscriptionSection from "../SubscriptionSection/SubscriptionSection"
import styles from "./Offer.module.css"

export default function Offer() {
    const [showFull, setShowFull] = useState(false);

    return <div className={styles.outer}>
        <div className={styles.subscriptionWrapper}>
            <SubscriptionSection />
        </div>
        <div className={styles.title}>Oferta</div>
        <div className={[styles.container, showFull && styles.full].filter(Boolean).join(' ')} id="offer">
            <OfferItem
                title="Jadłospis"
                description="Wybierając ten plan otrzymujesz:"
                price={150}
                color="#fc3376"
                details={[
                    'rozpoczęcie współpracy w ciągu **5 dni roboczych** (w tym czasie powstanie Twoje konto w aplikacji, poprzez którą możliwy będzie szybki kontakt, monitorowanie postępów i wypełnienie wstępnej ankiety)',
                    'indywidualny jadłospis 7-dniowy ułożony na podstawie ankiety (dostosowany do Twoich potrzeb i upodobań,  jadłospis otrzymasz w 7 dni roboczych od wypełnienia ankiety)',
                    'brak nielubianych produktów',
                    'wymiana posiłków w aplikacji',
                    'interaktywna lista zakupów',
                    'proponowana suplementacja',
                    'kontakt i odpowiedzi na wiadomości w **48h** przez aplikację',
                    'analiza postępów i wsparcie',
                    'płatność jednorazowa'
                ]}
                href="https://www.naffy.io/niedieta/jadlospis-ywS"
            />
            <OfferItem
                title="Dieta+"
                description="Wybierając ten plan otrzymujesz:"
                price={200}
                discounted_price={100}
                color="#eb4c44"
                details={[
                    '50 minut rozmowy online',
                    'wywiad zdrowotny i żywieniowy',
                    'analiza aktualnego sposobu żywienia',
                    'wspólne opracowanie strategii działania',
                    'wsparcie i kontakt w aplikacji przez miesiąc od wizyty',
                    'rozpoczęcie współpracy w ciągu **3 dni roboczych** (w tym czasie powstanie Twoje konto w aplikacji, poprzez którą możliwy będzie szybki kontakt, monitorowanie postępów i wypełnienie wstępnej ankiety)',
                    'indywidualny jadłospis 7-dniowy ułożony na podstawie ankiety (dostosowany do Twoich potrzeb i upodobań,  jadłospis otrzymasz w 7 dni roboczych od wypełnienia ankiety)',
                    'brak nielubianych produktów',
                    'wymiana posiłków w aplikacji',
                    'interaktywna lista zakupów',
                    'proponowana suplementacja',
                    'kontakt i odpowiedzi na wiadomości w **24h** przez aplikację',
                    'analiza postępów i wsparcie',
                    'płatność jednorazowa'
                ]}
                href="https://www.naffy.io/niedieta/jadlospis-ub3"
                top
            />
            <OfferItem
                title="Konsultacje"
                description="Wybierając ten plan otrzymujesz:"
                price={80}
                color="#ed6e40"
                details={[
                    '50 minut rozmowy online',
                    'wywiad zdrowotny i żywieniowy',
                    'analiza aktualnego sposobu żywienia',
                    'wspólne opracowanie strategii działania',
                    'wsparcie i kontakt w aplikacji przez miesiąc od wizyty'
                ]}
                href="https://www.naffy.io/niedieta/konsultacja-online-KeA"
            />
            <div className={styles['show-more']} onClick={() => setShowFull(true)} />
        </div>
    </div>
}
