'use client'

import Navbar from "@/components/Navbar/Navbar";
import styles from "./page.module.css";
import Image from "next/image";
import femaleIcon from "@/../public/calculator/female.svg";
import maleIcon from "@/../public/calculator/male.svg";
import { useState } from "react";
import { Genos } from "next/font/google";

type Gender = 'male' | 'female';

const PAL = [
    {
        value: 1.2,
        title: 'bardzo niska',
        description: 'osoby leżące, unieruchomione'
    },
    {
        value: 1.4,
        title: 'niska',
        description: 'praca siedząca, mało ruchu poza codziennymi obowiązkami'
    },
    {
        value: 1.5,
        title: 'umiarkowana',
        description: 'regularna aktywność fizyczna, spacery, jeżdżenie na rowerze, siłownia'
    },
    {
        value: 1.6,
        title: 'wyższa',
        description: 'codzienne treningi'
    },
    {
        value: 1.8,
        title: 'wysoka',
        description: 'praca fizyczna, intensywne treningi'
    },
    {
        value: 2.0,
        title: 'bardzo wysoka',
        description: 'np. sportowcy'
    }
];

function getAgeUnit(n: number) {
    if (n == 1) return "rok";
    // Naście
    if (n % 100 >= 10 && n % 100 <= 20) return "lat";
    const lastDigit = n % 10;
    if (lastDigit >= 2 && lastDigit <= 4) return "lata";
    return "lat";
}

function getBMI(weight: number, height: number) {
    return weight / ((height / 100) ** 2);
}

function getPPMMifflin(gender: Gender, weight: number, height: number, age: number) {
    if (gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === 'female') {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
}

function getPPMHarrisBenedict(gender: Gender, weight: number, height: number, age: number) {
    if (gender === 'male') {
        return 66.5 + 13.75 * weight + 5.003 * height - 6.775 * age;
    } else if (gender === 'female') {
        console.log('female', weight, height, age, 655.1 + 9.563 * weight + 1.850 * height - 4.676 * age);
        return 655.1 + 9.563 * weight + 1.850 * height - 4.676 * age;
    }
}

function getCPM(ppm: number, pal: number) {
    return ppm * PAL[pal].value;
}

export default function Home() {
    const [gender, setGender] = useState<Gender | null>(null);
    const [age, setAge] = useState<number | null>(null);
    const [height, setHeight] = useState<number | null>(null);
    const [weight, setWeight] = useState<number | null>(null);
    const [pal, setPal] = useState<number>(0);

    const isComputable = [gender, age, height, weight, pal].every(value => value !== null);
    const bmi = isComputable ? getBMI(weight!, height!) : null;
    const ppm = isComputable ? (bmi! > 24.9
        ? getPPMMifflin(gender!, weight!, height!, age!)
        : getPPMHarrisBenedict(gender!, weight!, height!, age!)) : null;
    const cpm = isComputable ? getCPM(ppm!, pal) : null;

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
                            type="number"
                            pattern="[0-9]*"
                            placeholder="__"
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
                            type="number"
                            pattern="[0-9]*"
                            placeholder="___"
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
                            type="number"
                            pattern="[0-9]*"
                            placeholder="__"
                            value={weight ?? ''}
                            className={[styles.input, weight && weight > 99 ? styles.three : styles.two].join(' ')}
                            onChange={(e) => setWeight(e.target.value.length ? parseInt(e.target.value) : null)}
                        />
                        <span className={styles.unit}>kg</span>
                        <div className={styles.caption}>Waga</div>
                    </div>
                </div>
                <div className={[styles.paper, styles.flex].join(' ')} style={{ width: 200 }} {...{ pal }}>
                    <div className={styles.grid} style={{alignItems: 'center'}}>
                        <h1>{PAL[pal].value.toFixed(1)}</h1>
                        <div style={{textAlign: 'right', flex: 1}}>
                            <div className={styles.caption} style={{textAlign: 'right'}}>
                                Aktywność
                            </div>
                            <b>{PAL[pal].title}</b>
                        </div>
                    </div>
                    <input type="range" min="0" max={PAL.length - 1} value={pal} className={[styles.input, styles.slider].join(' ')} onChange={(e) => setPal(parseInt(e.target.value))} />
                    <div className={styles.caption}>
                        {PAL[pal].description}
                    </div>
                </div>
            </div>

            {isComputable && (
                <div className={styles.grid}>
                    <div className={styles.paper}>
                        <div className={styles.grid} style={{alignItems: 'center'}}>
                            <h1>{bmi?.toFixed(1)}</h1>
                            <div className={styles.caption}>BMI</div>
                        </div>
                    </div>
                    <div className={styles.paper}>
                        <div className={styles.grid} style={{alignItems: 'center'}}>
                            <h1>{ppm?.toFixed()}</h1>
                            <div className={styles.caption}>PPM</div>
                        </div>
                    </div>
                    <div className={styles.paper}>
                        <div className={styles.grid} style={{alignItems: 'center'}}>
                            <h1>{cpm?.toFixed()}</h1>
                            <div className={styles.caption}>CPM</div>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.paper}>
                <p className={styles.description}>
                    Jeśli jesteś w ciąży albo masz jakąś jednostkę chorobową lub jesteś sportowcem, to niektóre z tych wskaźników mogą być niemiarodajne. W takim wypadku skonsultuj się z dietetykiem lub lekarzem.
                </p>
            </div>
        </div>
    </>;
}
