import styles from "./Logo.module.css";

interface Props {
    className?: string;
    size?: "md" | "lg";
}

export default function Logo({ className, size = "md" }: Props) {
    return (
        <span className={[styles.logo, styles[size], className].filter(Boolean).join(" ")}>
            <span className={styles.word}>NieDieta</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                className={styles.berry}
                src="/brand/berry-96.webp"
                srcSet="/brand/berry-96.webp 1x, /brand/berry-192.webp 2x"
                alt=""
                width={96}
                height={96}
            />
        </span>
    );
}
