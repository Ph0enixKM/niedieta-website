'use client'

import { useState, type CSSProperties } from "react";
import { ArrowRight } from "@/components/Icons/Icons";
import styles from "./page.module.css";

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
        description: 'regularna aktywność fizyczna, spacery, jeżdżenie na rowerze, siłownia'
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
    }
    return 10 * weight + 6.25 * height - 5 * age - 161;
}

function getPPMHarrisBenedict(gender: Gender, weight: number, height: number, age: number) {
    if (gender === 'male') {
        return 66.5 + 13.75 * weight + 5.003 * height - 6.775 * age;
    }
    return 655.1 + 9.563 * weight + 1.850 * height - 4.676 * age;
}

function getCPM(ppm: number, pal: number) {
    return ppm * PAL[pal].value;
}

/** Keeps digits (and one decimal separator when allowed) so typing stays forgiving. */
function sanitize(raw: string, decimals: boolean) {
    const cleaned = raw.replace(decimals ? /[^\d.,]/g : /\D/g, "");
    if (!decimals) return cleaned.slice(0, 3);
    const [int, ...rest] = cleaned.split(/[.,]/);
    return (rest.length ? `${int.slice(0, 3)},${rest.join("").slice(0, 1)}` : int.slice(0, 3));
}

function toNumber(value: string) {
    const n = parseFloat(value.replace(",", "."));
    return Number.isFinite(n) && n > 0 ? n : null;
}

const format = (value: number, digits = 0) =>
    new Intl.NumberFormat("pl-PL", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);

function FemaleIcon() {
    return (
        <svg viewBox="0 0 1000 1000" fill="none" stroke="currentColor" strokeWidth={80} strokeLinecap="round" aria-hidden="true">
            <circle cx="500" cy="374" r="226" />
            <path d="M500 852V601M408 739h184" />
        </svg>
    );
}

function MaleIcon() {
    return (
        <svg viewBox="0 0 1000 1000" fill="none" stroke="currentColor" strokeWidth={80} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="411" cy="589" r="226" />
            <path d="M622 185h193v193M815 185 571 429" />
        </svg>
    );
}

interface FieldProps {
    id: string;
    label: string;
    unit: string;
    value: string;
    placeholder: string;
    decimals?: boolean;
    onChange: (value: string) => void;
}

function NumberField({ id, label, unit, value, placeholder, decimals = false, onChange }: FieldProps) {
    return (
        <label className={styles.numberField} htmlFor={id}>
            <span className={styles.fieldLabel}>{label}</span>
            <span className={styles.numberRow}>
                <input
                    id={id}
                    className={styles.input}
                    inputMode={decimals ? "decimal" : "numeric"}
                    autoComplete="off"
                    placeholder={placeholder}
                    value={value}
                    style={{ "--chars": Math.max(value.length, placeholder.length) } as CSSProperties}
                    onChange={(e) => onChange(sanitize(e.target.value, decimals))}
                />
                <span className={styles.unit}>{unit}</span>
            </span>
        </label>
    );
}

export default function Calculator() {
    const [gender, setGender] = useState<Gender | null>(null);
    const [ageText, setAgeText] = useState("");
    const [heightText, setHeightText] = useState("");
    const [weightText, setWeightText] = useState("");
    const [pal, setPal] = useState<number>(0);

    const age = toNumber(ageText);
    const height = toNumber(heightText);
    const weight = toNumber(weightText);

    const isComputable = gender !== null && age !== null && height !== null && weight !== null;
    const bmi = isComputable ? getBMI(weight, height) : null;
    const ppm = isComputable
        ? bmi! > 24.9
            ? getPPMMifflin(gender, weight, height, age)
            : getPPMHarrisBenedict(gender, weight, height, age)
        : null;
    const cpm = ppm !== null ? getCPM(ppm, pal) : null;
    const activity = PAL[pal];

    return (
        <div className={styles.layout}>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()} aria-label="Dane do obliczeń">
                <fieldset className={styles.card}>
                    <legend className={styles.fieldLabel}>Płeć</legend>
                    <div className={styles.gender}>
                        <button
                            type="button"
                            aria-pressed={gender === 'female'}
                            className={styles.genderOption}
                            onClick={() => setGender('female')}
                        >
                            <FemaleIcon />
                            Kobieta
                        </button>
                        <button
                            type="button"
                            aria-pressed={gender === 'male'}
                            className={styles.genderOption}
                            onClick={() => setGender('male')}
                        >
                            <MaleIcon />
                            Mężczyzna
                        </button>
                    </div>
                </fieldset>

                <div className={styles.numbers}>
                    <NumberField
                        id="wiek"
                        label="Wiek"
                        unit={age ? getAgeUnit(age) : "lat"}
                        value={ageText}
                        placeholder="30"
                        onChange={setAgeText}
                    />
                    <NumberField id="wzrost" label="Wzrost" unit="cm" value={heightText} placeholder="165" onChange={setHeightText} />
                    <NumberField id="waga" label="Waga" unit="kg" value={weightText} placeholder="60" decimals onChange={setWeightText} />
                </div>

                <fieldset className={`${styles.card} ${styles.activity}`}>
                    <legend className={styles.fieldLabel}>Aktywność fizyczna</legend>
                    <div className={styles.activityHead}>
                        <span className={styles.palValue}>{format(activity.value, 1)}</span>
                        <span>
                            <b>{activity.title}</b>
                            <span className={styles.palDescription}>{activity.description}</span>
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={PAL.length - 1}
                        step={1}
                        value={pal}
                        className={styles.slider}
                        style={{ "--p": pal / (PAL.length - 1) } as CSSProperties}
                        aria-label="Poziom aktywności fizycznej"
                        aria-valuetext={`${format(activity.value, 1)} — ${activity.title}`}
                        onChange={(e) => setPal(parseInt(e.target.value))}
                    />
                    <div className={styles.ticks} aria-hidden="true">
                        {PAL.map((level, i) => (
                            <span key={level.value} data-active={i === pal || undefined}>
                                {format(level.value, 1)}
                            </span>
                        ))}
                    </div>
                </fieldset>
            </form>

            <aside className={styles.results} aria-live="polite">
                <h2 className={styles.resultsTitle}>Twoje wyniki</h2>
                {isComputable ? (
                    <div className={styles.resultGrid}>
                        <div className={styles.result}>
                            <span className={styles.resultLabel}>BMI</span>
                            <span className={styles.resultValue}>{format(bmi!, 1)}</span>
                            <span className={styles.resultHint}>wskaźnik masy ciała</span>
                        </div>
                        <div className={`${styles.result} ${styles.resultSky}`}>
                            <span className={styles.resultLabel}>PPM</span>
                            <span className={styles.resultValue}>
                                {format(ppm!)}
                                <small> kcal</small>
                            </span>
                            <span className={styles.resultHint}>tyle energii zużywa Twoje ciało w spoczynku</span>
                        </div>
                        <div className={`${styles.result} ${styles.resultBerry}`}>
                            <span className={styles.resultLabel}>CPM</span>
                            <span className={styles.resultValue}>
                                {format(cpm!)}
                                <small> kcal</small>
                            </span>
                            <span className={styles.resultHint}>szacowane dzienne zapotrzebowanie z uwzględnieniem aktywności</span>
                        </div>
                    </div>
                ) : (
                    <p className={styles.empty}>
                        Uzupełnij płeć, wiek, wzrost i wagę — wyniki pojawią się tutaj od razu.
                    </p>
                )}

                <p className={styles.note}>
                    Jeśli jesteś w ciąży albo masz jakąś jednostkę chorobową lub jesteś sportowcem, to niektóre z tych wskaźników mogą
                    być niemiarodajne. W takim wypadku skonsultuj się z dietetykiem lub lekarzem.
                </p>

                <div className={styles.cta}>
                    <p>Chcesz przełożyć liczby na codzienne jedzenie — bez restrykcji?</p>
                    <a href="/#oferta" className="btn btn-primary">
                        Umów konsultację
                        <ArrowRight />
                    </a>
                </div>
            </aside>
        </div>
    );
}
