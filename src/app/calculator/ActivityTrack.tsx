"use client";

import { useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { rng, smoothPath } from "@/lib/sketch";
import styles from "./ActivityTrack.module.css";

// Keep in sync with the berry thumb in ActivityTrack.module.css
const THUMB = 44;

interface Props {
    labels: string[];
    value: number;
    /** What assistive tech reads out for the current level. */
    valueText: string;
    onChange: (value: number) => void;
}

/**
 * The activity slider: the berry rolls along a hand-drawn track from one level to the next, like on the home page's
 * "how we'd work together" track. A native range input does the work, so it stays keyboard and screen reader friendly.
 */
export default function ActivityTrack({ labels, value, valueText, onChange }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const clipId = useId();
    const [width, setWidth] = useState(0);
    const last = labels.length - 1;

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const measure = () => setWidth(el.offsetWidth);
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // the thumb's centre at each level, which is where the browser draws it
    const stations = useMemo(
        () => labels.map((_, i) => THUMB / 2 + (i / last) * (width - THUMB)),
        [labels, last, width],
    );

    const path = useMemo(() => {
        if (!width) return "";
        const rand = rng(21);
        const y = THUMB / 2;
        const points: [number, number][] = [];
        stations.forEach((x, i) => {
            if (i > 0) points.push([(stations[i - 1] + x) / 2, y + (rand() - 0.5) * 10]);
            points.push([x, y]);
        });
        return smoothPath(points);
    }, [stations, width]);

    return (
        <div ref={ref} className={styles.track} style={{ "--p": value / last } as CSSProperties}>
            {width > 0 && (
                <svg className={styles.art} viewBox={`0 0 ${width} ${THUMB}`} aria-hidden="true">
                    <defs>
                        <clipPath id={clipId}>
                            <rect x={0} y={-THUMB} width={stations[value]} height={THUMB * 3} />
                        </clipPath>
                    </defs>
                    <path d={path} className={styles.line} />
                    <path d={path} className={styles.trail} clipPath={`url(#${clipId})`} />
                    {stations.map((x, i) => (
                        <circle key={i} cx={x} cy={THUMB / 2} r={5.5} className={styles.dot} data-reached={i <= value || undefined} />
                    ))}
                </svg>
            )}
            <input
                type="range"
                min={0}
                max={last}
                step={1}
                value={value}
                className={styles.slider}
                aria-label="Poziom aktywności fizycznej"
                aria-valuetext={valueText}
                onChange={(e) => onChange(Number(e.target.value))}
            />
            {/* the levels can be picked by tapping their labels too; keyboard users have the slider itself */}
            <div className={styles.levels} aria-hidden="true">
                {labels.map((label, i) => (
                    <button
                        key={label}
                        type="button"
                        tabIndex={-1}
                        data-active={i === value || undefined}
                        style={{ "--at": i / last } as CSSProperties}
                        onClick={() => onChange(i)}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
