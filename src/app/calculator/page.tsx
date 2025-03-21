'use client'

import Navbar from "@/components/Navbar/Navbar";
import styles from "./page.module.css";
import Image from "next/image";
import femaleIcon from "@/../public/calculator/female.svg";
import maleIcon from "@/../public/calculator/male.svg";
import { useState } from "react";

type Gender = 'male' | 'female';

function getAgeUnit(n: number) {
    if (n == 1) return "rok";
    // Naście
    if (n % 100 >= 10 && n % 100 <= 20) return "lat";
    const lastDigit = n % 10;
    if (lastDigit >= 2 && lastDigit <= 4) return "lata";
    return "lat";
}

export default function Home() {
    const [gender, setGender] = useState<Gender | null>(null);
    const [age, setAge] = useState<number | null>(null);
    const [height, setHeight] = useState<number | null>(null);
    const [weight, setWeight] = useState<number | null>(null);

    return <>
        <Navbar />
        <div className={styles.page}>
            <div className={styles.paper}>
                <h1 className={styles.title}>Kalkulatory</h1>
                <p className={styles.description}>
                    Wypełnij dane i poznaj swoje BMI, podstawową przemianę materii (PPM) i całkowitą przemianę materii (CPM).
                </p>
            </div>

            <div className={styles.grid}>
                <div className={styles.paper}>
                    <div className={styles.grid}>
                        <div className={[styles.button, gender === 'male' && styles.male].filter(Boolean).join(' ')} onClick={() => setGender('male')}>
                            <Image src={maleIcon} className={styles['centered-image']} alt="Male gender icon" width={64} />
                            <div className={styles.caption}>Mężczyzna</div>
                        </div>
                        <div className={[styles.button, gender === 'female' && styles.female].filter(Boolean).join(' ')} onClick={() => setGender('female')}>
                            <Image src={femaleIcon} className={styles['centered-image']} alt="Female gender icon" width={64} />
                            <div className={styles.caption}>Kobieta</div>
                        </div>
                    </div>
                </div>
                <div className={styles.paper}>
                    <div className={styles.centered}>
                        <input
                            placeholder="XX"
                            value={age ?? ''}
                            className={[styles.input, styles.two].join(' ')}
                            onChange={(e) => setAge(e.target.value.length ? parseInt(e.target.value) : null)}
                        />
                        <span className={styles.unit}>{age ? getAgeUnit(age) : 'lat'}</span>
                        <div className={styles.caption}>Wiek</div>
                    </div>
                </div>
                <div className={styles.paper}>
                    <div className={styles.centered}>
                        <input
                            placeholder="XXX"
                            value={height ?? ''}
                            className={[styles.input, styles.three].join(' ')}
                            onChange={(e) => setHeight(e.target.value.length ? parseInt(e.target.value) : null)}
                        />
                        <span className={styles.unit}>cm</span>
                        <div className={styles.caption}>Wysokość</div>
                    </div>
                </div>
                <div className={styles.paper}>
                    <div className={styles.centered}>
                        <input
                            placeholder="XX"
                            value={weight ?? ''}
                            className={[styles.input, weight && weight > 99 ? styles.three : styles.two].join(' ')}
                            onChange={(e) => setWeight(e.target.value.length ? parseInt(e.target.value) : null)}
                        />
                        <span className={styles.unit}>kg</span>
                        <div className={styles.caption}>Waga</div>
                    </div>
                </div>
                <div className={[styles.paper, styles.flex].join(' ')}>
                    TUTAJ BĘDZIE PAL
                </div>
            </div>

            <div className={styles.paper}>
                <p className={styles.description}>
                    Jeśli jesteś w ciąży albo masz jakąś jednostkę chorobową lub jesteś sportowcem, to niektóre z tych wskaźników mogą być niemiarodajne. W takim wypadku skonsultuj się z dietetykiem lub lekarzem.
                </p>
            </div>
        </div>
    </>;
}
