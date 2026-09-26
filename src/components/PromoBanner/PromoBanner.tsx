"use client";

import { useState } from "react";
import { ArrowRight, CloseIcon } from "@/components/Icons/Icons";
import { useEvent } from "@/hooks/useEvent";
import styles from "./PromoBanner.module.css";

const LABELS = {
    BlackWeek: "Black Weeks",
    KingasBday: "Urodziny Kingi",
} as const;

export default function PromoBanner({ home = true }: { home?: boolean }) {
    const event = useEvent();
    const [closed, setClosed] = useState(false);

    if (event.type === "None" || closed) return null;

    return (
        <div className={styles.banner} role="status">
            <a href={home ? "#oferta" : "/#oferta"} className={styles.link}>
                <span className={styles.tag}>{LABELS[event.type]}</span>
                <span>
                    Cała oferta i nasze produkty <b>{event.discount}% taniej</b>
                </span>
                <ArrowRight className={styles.arrow} />
            </a>
            <button type="button" className={styles.close} aria-label="Zamknij informację o promocji" onClick={() => setClosed(true)}>
                <CloseIcon />
            </button>
        </div>
    );
}
