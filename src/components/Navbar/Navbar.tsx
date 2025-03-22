import Link from "next/link"
import Image from "next/image"
import styles from "./Navbar.module.css"

interface Props {
    bg?: string
}

export default function Navbar({ bg = "#eee" }: Props) {
    return <>
        <div className={styles.navbar} style={{ background: `color-mix(in srgb, ${bg} 70%, transparent)` }}>
            <div className={styles.container}>
                <Link href="/">
                    <Image src="/logo.svg" alt="Logo" width={200} height={50} />
                </Link>
                <div className={styles.item}>
                    <Link href="/calculator">Kalkulatory</Link>
                </div>
            </div>
        </div>
        <div className={styles.padding} style={{ background: bg }} />
    </>
}