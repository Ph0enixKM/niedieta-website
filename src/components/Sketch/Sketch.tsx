import type { CSSProperties } from "react";
import { markerBlob, roughEdge, sketchLine, sketchLoop, sketchRing } from "@/lib/sketch";

// Hand-drawn SVG decorations. Strokes marked with data-draw animate in when scrolled into view
// (see globals.css); pass `draw={false}` for ones animated by their parent instead.

interface StrokeProps {
    className?: string;
    seed?: number;
    strokeWidth?: number;
    draw?: boolean;
    delay?: number;
    style?: CSSProperties;
}

const drawAttrs = (draw: boolean, delay?: number) =>
    draw ? { "data-draw": "", style: { "--d": delay ?? 0 } as CSSProperties } : {};

export function SketchRing({ className, seed = 1, strokeWidth = 2.4, draw = true, delay, style }: StrokeProps) {
    return (
        <svg viewBox="0 0 100 100" className={className} style={style} fill="none" aria-hidden="true">
            <path
                d={sketchRing(seed)}
                pathLength={1}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                {...drawAttrs(draw, delay)}
            />
        </svg>
    );
}

export function SketchUnderline({ className, seed = 1, strokeWidth = 3, draw = true, delay, style }: StrokeProps) {
    return (
        <svg viewBox="0 0 200 20" preserveAspectRatio="none" className={className} style={style} fill="none" aria-hidden="true">
            <path
                d={sketchLine(seed, 200, 20, 3.4)}
                pathLength={1}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                {...drawAttrs(draw, delay)}
            />
        </svg>
    );
}

interface LoopProps extends StrokeProps {
    width: number;
    height: number;
    turns?: number;
}

/** Big marker scribble; two overlapping passes so the "ink" darkens where they cross. */
export function SketchLoop({ className, seed = 3, width, height, strokeWidth = 34, turns = 1.32, draw = true, delay, style }: LoopProps) {
    const first = sketchLoop(seed, width, height, 0.95, -0.62);
    const second = sketchLoop(seed + 11, width, height, turns - 0.95 + 0.12, 0.27);
    return (
        <svg viewBox={`0 0 ${width} ${height}`} className={className} style={style} fill="none" aria-hidden="true">
            <path d={first} pathLength={1} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" opacity={0.82} {...drawAttrs(draw, delay)} />
            <path d={second} pathLength={1} stroke="currentColor" strokeWidth={strokeWidth * 0.86} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} {...drawAttrs(draw, (delay ?? 0) + 900)} />
        </svg>
    );
}

export function RoughEdge({ className, seed = 1, flip = false }: { className?: string; seed?: number; flip?: boolean }) {
    return (
        <svg
            viewBox="0 0 1440 48"
            preserveAspectRatio="none"
            className={className}
            style={flip ? { transform: "scaleY(-1)" } : undefined}
            aria-hidden="true"
        >
            <path d={roughEdge(seed)} fill="currentColor" />
        </svg>
    );
}

export function MarkerBlob({ className, seed = 1, style }: { className?: string; seed?: number; style?: CSSProperties }) {
    return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className} style={style} aria-hidden="true">
            <path d={markerBlob(seed)} fill="currentColor" />
        </svg>
    );
}

export function HandArrow({ className, draw = true, delay, style }: StrokeProps) {
    return (
        <svg viewBox="0 0 120 80" className={className} style={style} fill="none" aria-hidden="true">
            <path d="M8 12c26-8 62-4 82 20 6 7 9 16 10 26" pathLength={1} stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" {...drawAttrs(draw, delay)} />
            <path d="M88 50c4 3 8 7 12 13 3-6 7-11 12-14" pathLength={1} stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" {...drawAttrs(draw, (delay ?? 0) + 500)} />
        </svg>
    );
}

export function HandHeart({ className, draw = true, delay, style }: StrokeProps) {
    return (
        <svg viewBox="0 0 48 44" className={className} style={style} fill="none" aria-hidden="true">
            <path
                d="M24 39C12 30 4.5 22.5 5.5 14 6.4 7 14.5 4.2 19.8 9.6c1.8 1.8 3 3.8 4.2 6.2 1.4-3.2 3.3-6 6.4-7.6 5.4-2.8 12.2.4 12.2 7.6 0 7.8-8.6 15.8-18.6 23.2"
                pathLength={1}
                stroke="currentColor"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                {...drawAttrs(draw, delay)}
            />
        </svg>
    );
}

export function HandCheck({ className, draw = true, delay, style }: StrokeProps) {
    return (
        <svg viewBox="0 0 32 28" className={className} style={style} fill="none" aria-hidden="true">
            <path d="M4 15.5c3 2 5.4 4.6 7.2 8C15.6 14.6 20.8 8.2 28 3.6" pathLength={1} stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" {...drawAttrs(draw, delay)} />
        </svg>
    );
}

/** Scribbled strike-through, sized to its parent (absolute). */
export function HandStrike({ className, draw = true, delay, style }: StrokeProps) {
    return (
        <svg viewBox="0 0 200 30" preserveAspectRatio="none" className={className} style={style} fill="none" aria-hidden="true">
            <path
                d="M4 19c30-4 62-8 96-7 34 1 62-2 96-6M10 12c40 2 88 5 176 3"
                pathLength={1}
                stroke="currentColor"
                strokeWidth={3.2}
                strokeLinecap="round"
                {...drawAttrs(draw, delay)}
            />
        </svg>
    );
}
