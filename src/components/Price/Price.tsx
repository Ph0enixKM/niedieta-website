"use client";

import { useEvent } from "@/hooks/useEvent";
import styles from "./Price.module.css";

const format = (value: number) =>
    new Intl.NumberFormat("pl-PL", {
        minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
        maximumFractionDigits: 2,
    }).format(value);

interface Props {
    amount: number;
    period?: string;
    /** Services round the promo price to whole złoty, products keep the grosze. */
    rounding?: "whole" | "cents";
    discountable?: boolean;
    size?: "md" | "sm";
    className?: string;
}

export default function Price({ amount, period, rounding = "whole", discountable = true, size = "md", className }: Props) {
    const event = useEvent();
    const classes = [styles.price, styles[size], className].filter(Boolean).join(" ");

    if (amount === 0) {
        return (
            <div className={classes}>
                <span className={styles.amount}>Za darmo</span>
            </div>
        );
    }

    const factor = 1 - event.discount / 100;
    const discounted =
        discountable && event.discount > 0
            ? rounding === "whole"
                ? Math.round(amount * factor)
                : Math.round(amount * factor * 100) / 100
            : null;

    return (
        <div className={classes}>
            <div className={styles.row}>
                {discounted !== null && <s className={styles.old}>{format(amount)} zł</s>}
                <span className={styles.amount}>
                    {format(discounted ?? amount)}
                    <span className={styles.currency}>&nbsp;zł</span>
                </span>
                {period && <span className={styles.period}>{period}</span>}
            </div>
            {discounted !== null && (
                <p className={styles.lowest}>Najniższa cena z 30 dni przed obniżką: {format(amount)} zł</p>
            )}
        </div>
    );
}
