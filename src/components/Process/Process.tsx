"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { HandHeart, SketchRing } from "@/components/Sketch/Sketch";
import { STEPS } from "@/content/site";
import { rng, smoothPath } from "@/lib/sketch";
import styles from "./Process.module.css";

// Keep in sync with Process.module.css
const WIDE = "(min-width: 900px)";
const PIN = "(min-width: 900px) and (min-height: 660px)";
const TRACK_H = 150;

interface Point {
    x: number;
    y: number;
}

interface Geometry {
    w: number;
    h: number;
    d: string;
    stations: Point[];
    start: Point;
    end: Point;
    orientation: "h" | "v";
    mode: "pin" | "scrub" | "follow";
    radius: number;
}

/**
 * "How we'd work together": a hand-drawn track connects the four steps and the 3D berry
 * (see Berry/engine.ts → Roller) travels along it with the scroll. The track is measured
 * from the rendered step markers, so it always passes exactly through them.
 */
export default function Process() {
    const boardRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const [geo, setGeo] = useState<Geometry | null>(null);

    useEffect(() => {
        const board = boardRef.current;
        if (!board) return;
        const wideQuery = window.matchMedia(WIDE);
        const pinQuery = window.matchMedia(PIN);

        // layout offsets ignore transforms, so the reveal animation can't skew the measurement
        const centreWithin = (el: HTMLElement): Point => {
            let x = el.offsetWidth / 2;
            let y = el.offsetHeight / 2;
            let node: HTMLElement | null = el;
            while (node && node !== board) {
                x += node.offsetLeft;
                y += node.offsetTop;
                node = node.offsetParent as HTMLElement | null;
            }
            return { x, y };
        };

        const compute = () => {
            const b = { width: board.offsetWidth, height: board.offsetHeight };
            const anchors = Array.from(board.querySelectorAll<HTMLElement>("[data-station]")).map(centreWithin);
            if (!anchors.length || b.width === 0) return;
            const rand = rng(7);

            if (wideQuery.matches) {
                const lineY = TRACK_H - 24;
                const endX = b.width - 150;
                const startX = Math.max(6, anchors[0].x - 56);
                const pts: [number, number][] = [[startX, lineY]];
                let prev = startX;
                anchors.forEach((a, i) => {
                    if (i > 0) pts.push([(prev + a.x) / 2, lineY + (rand() - 0.5) * 20]);
                    pts.push([a.x, lineY]);
                    prev = a.x;
                });
                pts.push([(prev + endX) / 2, lineY + (rand() - 0.5) * 20]);
                pts.push([endX, lineY - 2]);
                setGeo({
                    w: b.width,
                    h: TRACK_H,
                    d: smoothPath(pts),
                    stations: anchors.map((a) => ({ x: a.x, y: lineY })),
                    start: { x: startX, y: lineY },
                    end: { x: endX, y: lineY - 2 },
                    orientation: "h",
                    mode: pinQuery.matches ? "pin" : "scrub",
                    radius: Math.round(Math.min(32, Math.max(24, b.width / 40))),
                });
            } else {
                const lineX = 18;
                const endY = b.height - 64;
                const pts: [number, number][] = [[lineX, 4]];
                let prev = 4;
                for (const a of anchors) {
                    pts.push([lineX + (rand() - 0.5) * 12, (prev + a.y) / 2]);
                    pts.push([lineX, a.y]);
                    prev = a.y;
                }
                pts.push([lineX + (rand() - 0.5) * 12, (prev + endY) / 2]);
                pts.push([lineX, endY]);
                setGeo({
                    w: 64,
                    h: b.height,
                    d: smoothPath(pts),
                    stations: anchors.map((a) => ({ x: lineX, y: a.y })),
                    start: { x: lineX, y: 4 },
                    end: { x: lineX, y: endY },
                    orientation: "v",
                    mode: "follow",
                    radius: 17,
                });
            }
        };

        compute();
        const ro = new ResizeObserver(compute);
        ro.observe(board);
        wideQuery.addEventListener("change", compute);
        pinQuery.addEventListener("change", compute);
        document.fonts?.ready.then(compute);
        return () => {
            ro.disconnect();
            wideQuery.removeEventListener("change", compute);
            pinQuery.removeEventListener("change", compute);
        };
    }, []);

    // Once the path is in the DOM, record how far along it each station sits (the engine reads these).
    useLayoutEffect(() => {
        const path = pathRef.current;
        const board = boardRef.current;
        if (!geo || !path || !board) return;
        const L = path.getTotalLength();
        const lengths = geo.stations.map((st) => {
            let lo = 0;
            let hi = L;
            for (let i = 0; i < 24; i++) {
                const mid = (lo + hi) / 2;
                const p = path.getPointAtLength(mid);
                const along = geo.orientation === "h" ? p.x < st.x : p.y < st.y;
                if (along) lo = mid;
                else hi = mid;
            }
            return Math.round(lo * 10) / 10;
        });
        board.dataset.stations = lengths.join(",");
        board.dataset.mode = geo.mode;
        board.dataset.radius = String(geo.radius);
    }, [geo]);

    return (
        <section id="wspolpraca" className={styles.process} data-berry-scroll aria-labelledby="wspolpraca-title">
            <div className={styles.sticky}>
                <div className={`container ${styles.inner}`}>
                    <header className={styles.header}>
                        <h2 id="wspolpraca-title" className="h2" data-reveal style={{ "--d": 80 } as CSSProperties}>
                            Jak wyglądałaby nasza współpraca?
                        </h2>
                        <p className={styles.sub} data-reveal style={{ "--d": 160 } as CSSProperties}>
                            Małe kroki, które prowadzą do trwałej zmiany.
                        </p>
                    </header>

                    <div ref={boardRef} className={styles.board} data-berry="process">
                        <svg
                            className={styles.track}
                            viewBox={geo ? `0 0 ${geo.w} ${geo.h}` : undefined}
                            style={geo ? { width: geo.w, height: geo.h } : undefined}
                            aria-hidden="true"
                        >
                            {geo && (
                                <>
                                    <path d={geo.d} className={styles.line} />
                                    <path d={geo.d} className={styles.trail} data-berry-trail="" />
                                    <path ref={pathRef} d={geo.d} fill="none" stroke="none" data-berry-track="" />
                                    {geo.stations.map((st, i) => (
                                        <circle key={i} cx={st.x} cy={st.y} r={5.5} className={styles.dot} data-step={i} />
                                    ))}
                                </>
                            )}
                        </svg>

                        <ol className={styles.steps}>
                            {STEPS.map((step, i) => (
                                <li
                                    key={step.title}
                                    className={styles.step}
                                    data-step={i}
                                    data-reveal
                                    style={{ "--d": 120 + i * 110 } as CSSProperties}
                                >
                                    <span className={styles.num} data-station="">
                                        <SketchRing className={styles.ring} seed={31 + i} strokeWidth={2.2} draw={false} />
                                        <span className={styles.digit}>{i + 1}</span>
                                    </span>
                                    <div>
                                        <h3>{step.title}</h3>
                                        <p>{step.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>

                        {geo && (
                            <div
                                className={`${styles.goal} ${geo.orientation === "v" ? styles.goalV : ""}`}
                                style={{ left: geo.end.x, top: geo.end.y }}
                                data-track-end=""
                            >
                                <HandHeart className={styles.heart} draw={false} />
                                <span>efekty, które zostają</span>
                            </div>
                        )}

                        {geo?.orientation === "v" && (
                            // narrow layouts: the 3D berry's canvas rides on this, kept level with the reading line by CSS
                            <div className={styles.lane} style={{ top: geo.start.y, height: geo.end.y - geo.start.y }}>
                                <div className={styles.rider} data-berry-rider="" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
