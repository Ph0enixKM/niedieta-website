"use client";

import { useState, type CSSProperties } from "react";
import Clipboard from "@/components/Clipboard/Clipboard";
import { ArrowRight } from "@/components/Icons/Icons";
import { HandCheck, SketchRing } from "@/components/Sketch/Sketch";
import ActivityTrack from "./ActivityTrack";
import styles from "./page.module.css";

type Gender = "male" | "female";

const GENDERS: { id: Gender; label: string }[] = [
    { id: "female", label: "Kobieta" },
    { id: "male", label: "Mężczyzna" },
];

const PAL = [
    {
        value: 1.2,
        title: "bardzo niska",
        description: "osoby leżące, unieruchomione",
    },
    {
        value: 1.4,
        title: "niska",
        description: "praca siedząca, mało ruchu poza codziennymi obowiązkami",
    },
    {
        value: 1.5,
        title: "umiarkowana",
        description: "regularna aktywność fizyczna, spacery, jeżdżenie na rowerze, siłownia",
    },
    {
        value: 1.6,
        title: "wyższa",
        description: "codzienne treningi",
    },
    {
        value: 1.8,
        title: "wysoka",
        description: "praca fizyczna, intensywne treningi",
    },
    {
        value: 2.0,
        title: "bardzo wysoka",
        description: "np. sportowcy",
    },
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
    if (gender === "male") {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    }
    return 10 * weight + 6.25 * height - 5 * age - 161;
}

function getPPMHarrisBenedict(gender: Gender, weight: number, height: number, age: number) {
    if (gender === "male") {
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
    return rest.length ? `${int.slice(0, 3)},${rest.join("").slice(0, 1)}` : int.slice(0, 3);
}

function toNumber(value: string) {
    const n = parseFloat(value.replace(",", "."));
    return Number.isFinite(n) && n > 0 ? n : null;
}

const format = (value: number, digits = 0) =>
    new Intl.NumberFormat("pl-PL", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);

const PAL_LABELS = PAL.map((level) => format(level.value, 1));

interface FieldProps {
    id: string;
    label: string;
    unit: string;
    value: string;
    placeholder: string;
    decimals?: boolean;
    onChange: (value: string) => void;
}

/** A blank on the form: the number is written on the ruled line, and a swipe of highlighter marks the one in focus. */
function Field({ id, label, unit, value, placeholder, decimals = false, onChange }: FieldProps) {
    return (
        <label className={styles.field} htmlFor={id}>
            <span className={styles.label}>{label}</span>
            <span className={styles.entry}>
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

type Tone = "sky" | "sand" | "espresso";

interface NoteProps {
    tone: Tone;
    label: string;
    value: string | null;
    unit?: string;
    hint: string;
}

/** A result, jotted down on a sticky note (the same papers as the FAQ board's). */
function Note({ tone, label, value, unit, hint }: NoteProps) {
    return (
        <div className={`${styles.note} ${styles[tone]}`}>
            <span className={styles.glue} aria-hidden="true" />
            <div className={styles.face} aria-atomic="true">
                <span className={styles.noteLabel}>{label}</span>
                <span className={styles.value}>
                    {value === null ? (
                        <span className={styles.blank} aria-hidden="true">
                            ?
                        </span>
                    ) : (
                        <>
                            {value}
                            {unit && <small> {unit}</small>}
                        </>
                    )}
                </span>
                <span className={styles.hint}>{hint}</span>
            </div>
        </div>
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
            <Clipboard className={styles.clipboard} data-reveal="scale" style={{ "--d": 120 } as CSSProperties}>
                <form className={styles.form} onSubmit={(e) => e.preventDefault()} aria-labelledby="dane-title">
                    <h2 id="dane-title" className={styles.formTitle}>
                        Twoje dane
                    </h2>

                    <fieldset className={`${styles.group} ${styles.ruled}`}>
                        <legend className={styles.label}>Płeć</legend>
                        <div className={styles.choices}>
                            {GENDERS.map((option) => (
                                <label key={option.id} className={styles.choice}>
                                    <input
                                        type="radio"
                                        name="plec"
                                        value={option.id}
                                        checked={gender === option.id}
                                        className="visually-hidden"
                                        onChange={() => setGender(option.id)}
                                    />
                                    <span className={styles.box} aria-hidden="true">
                                        <HandCheck className={styles.check} draw={false} />
                                    </span>
                                    {option.label}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <div className={styles.measures}>
                        <Field
                            id="wiek"
                            label="Wiek"
                            unit={age ? getAgeUnit(age) : "lat"}
                            value={ageText}
                            placeholder="30"
                            onChange={setAgeText}
                        />
                        <Field id="wzrost" label="Wzrost" unit="cm" value={heightText} placeholder="165" onChange={setHeightText} />
                        <Field id="waga" label="Waga" unit="kg" value={weightText} placeholder="60" decimals onChange={setWeightText} />
                    </div>

                    <fieldset className={styles.group}>
                        <legend className={styles.label}>Aktywność fizyczna</legend>
                        <ActivityTrack
                            labels={PAL_LABELS}
                            value={pal}
                            valueText={`${format(activity.value, 1)} — ${activity.title}`}
                            onChange={setPal}
                        />
                        <div className={styles.level}>
                            <span className={styles.levelValue} aria-hidden="true">
                                <SketchRing className={styles.levelRing} seed={33} strokeWidth={2.2} draw={false} />
                                <span>{format(activity.value, 1)}</span>
                            </span>
                            <span>
                                <b className={styles.levelTitle}>{activity.title}</b>
                                <span className={styles.levelDescription}>{activity.description}</span>
                            </span>
                        </div>
                    </fieldset>
                </form>
            </Clipboard>

            <aside className={styles.results} aria-labelledby="wyniki-title" data-reveal style={{ "--d": 240 } as CSSProperties}>
                <h2 id="wyniki-title" className={styles.resultsTitle}>
                    Twoje wyniki
                </h2>
                <p className={styles.status}>
                    <span data-shown={!isComputable || undefined}>
                        Uzupełnij płeć, wiek, wzrost i wagę — wyniki pojawią się tutaj od razu.
                    </span>
                    <span data-shown={isComputable || undefined}>Zmieniaj dane śmiało — wyniki przeliczą się od razu.</span>
                </p>

                <div className={styles.notes} data-filled={isComputable || undefined} aria-live="polite">
                    <Note tone="sky" label="BMI" value={bmi !== null ? format(bmi, 1) : null} hint="wskaźnik masy ciała" />
                    <Note
                        tone="sand"
                        label="PPM"
                        value={ppm !== null ? format(ppm) : null}
                        unit="kcal"
                        hint="tyle energii zużywa Twoje ciało w spoczynku"
                    />
                    <Note
                        tone="espresso"
                        label="CPM"
                        value={cpm !== null ? format(cpm) : null}
                        unit="kcal"
                        hint="szacowane dzienne zapotrzebowanie z uwzględnieniem aktywności"
                    />
                </div>

                <p className={styles.disclaimer}>
                    Jeśli jesteś w ciąży albo masz jakąś jednostkę chorobową lub jesteś sportowcem, to niektóre z tych wskaźników mogą
                    być niemiarodajne. W takim wypadku skonsultuj się z dietetykiem lub lekarzem.
                </p>

                <div className={styles.cta}>
                    <p>Chcesz przełożyć liczby na codzienne jedzenie — bez restrykcji?</p>
                    <a href="/#oferta" className="btn btn-deep">
                        Umów konsultację
                        <ArrowRight />
                    </a>
                </div>
            </aside>
        </div>
    );
}
