import Image from 'next/image'
import styles from './Leaves.module.css'

export default function Leaves() {
    return <>
        <div className={styles.leaf}>
            <Image src="/leaf.png" alt="leaf" fill />
        </div>
        <div className={styles.leafnd}>
            <Image src="/leaf.png" alt="leaf" fill />
        </div>
        <div className={styles.leafrd}>
            <Image src="/leaf.png" alt="leaf" fill />
        </div>
        <div className={styles.leafth}>
            <Image src="/leaf.png" alt="leaf" fill />
        </div>
    </>
}