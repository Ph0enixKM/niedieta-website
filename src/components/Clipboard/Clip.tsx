import type { CSSProperties } from "react";

// Colours, shadows included, come from CSS custom properties (see .clip in Clipboard.module.css), so the metal can be
// retoned there.
const stop = (offset: number, color: string, opacity?: number) => (
    <stop offset={offset} style={{ stopColor: `var(${color})`, stopOpacity: opacity } as CSSProperties} />
);

const LEVER =
    "M52 40H188Q193.5 40 194.2 45.5L199 90Q199.8 104.5 185.5 104.5Q120 108 54.5 104.5Q40.2 104.5 41 90L45.8 45.5Q46.5 40 52 40Z";
const EAR = "M94 46V24A20 20 0 0 1 114 4H126A20 20 0 0 1 146 24V46Z";
// the hanging hole, cut out of the ear (evenodd)
const HOLE = "M127 19A7 7 0 1 0 113 19A7 7 0 1 0 127 19Z";
const RIVETS = [24, 216];

/**
 * A classic lever clip seen from above, lit from the top-left: a base plate riveted to the board,
 * a spring lever whose jaw presses the sheet and whose ear (with a hanging hole) rises past the top edge.
 * Flat SVG with gradients only, so it costs nothing to render.
 */
export default function Clip({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 240 118" aria-hidden="true" focusable="false">
            <defs>
                <linearGradient id="clip-base" x1="0" y1="31" x2="0" y2="64" gradientUnits="userSpaceOnUse">
                    {stop(0, "--m-hi")}
                    {stop(0.16, "--m-light")}
                    {stop(0.62, "--m-mid")}
                    {stop(1, "--m-dark")}
                </linearGradient>
                {/* profile from the back: roll over the pivot, flat run, curl down, beaded lip */}
                <linearGradient id="clip-lever" x1="0" y1="40" x2="0" y2="106" gradientUnits="userSpaceOnUse">
                    {stop(0, "--m-dark")}
                    {stop(0.05, "--m-light")}
                    {stop(0.1, "--m-hi")}
                    {stop(0.17, "--m-light")}
                    {stop(0.42, "--m-mid")}
                    {stop(0.66, "--m-light")}
                    {stop(0.8, "--m-mid")}
                    {stop(0.87, "--m-dark")}
                    {stop(0.9, "--m-deep")}
                    {stop(0.935, "--m-hi")}
                    {stop(0.965, "--m-mid")}
                    {stop(1, "--m-deep")}
                </linearGradient>
                {/* a soft window reflection sweeping across the metal */}
                <linearGradient id="clip-sheen" x1="60" y1="40" x2="170" y2="106" gradientUnits="userSpaceOnUse">
                    <stop offset="0.28" stopColor="#fff" stopOpacity="0" />
                    <stop offset="0.4" stopColor="#fff" stopOpacity="0.38" />
                    <stop offset="0.47" stopColor="#fff" stopOpacity="0.1" />
                    <stop offset="0.56" stopColor="#fff" stopOpacity="0.24" />
                    <stop offset="0.68" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="clip-ear" x1="0" y1="4" x2="0" y2="46" gradientUnits="userSpaceOnUse">
                    {stop(0, "--m-light")}
                    {stop(0.3, "--m-hi")}
                    {stop(0.72, "--m-light")}
                    {stop(0.92, "--m-mid")}
                    {stop(1, "--m-dark")}
                </linearGradient>
                {/* light falls from the left: lit left flank, shaded right flank */}
                <linearGradient id="clip-side" x1="42" y1="0" x2="198" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
                    <stop offset="0.05" stopColor="#fff" stopOpacity="0.06" />
                    <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
                    {stop(0.95, "--m-crease", 0.06)}
                    {stop(1, "--m-crease", 0.28)}
                </linearGradient>
                <radialGradient id="clip-rivet" cx="0.38" cy="0.32" r="0.78">
                    <stop offset="0" stopColor="#fff" />
                    {stop(0.28, "--r-light")}
                    {stop(0.72, "--r-mid")}
                    {stop(1, "--r-dark")}
                </radialGradient>
                <filter id="clip-soft" x="-20" y="-20" width="280" height="160" filterUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="3" />
                </filter>
                <filter id="clip-tight" x="-20" y="-20" width="280" height="160" filterUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="1.1" />
                </filter>
            </defs>

            {/* shadows: the raised lever and ear throw a soft one, the base and the jaw sit tight */}
            <g style={{ fill: "var(--m-shadow)" }}>
                <g opacity="0.3" filter="url(#clip-soft)" transform="translate(2 5)">
                    <path d={LEVER} />
                    <path d={EAR + HOLE} fillRule="evenodd" />
                </g>
                <rect x="6" y="33" width="228" height="34" rx="12" opacity="0.32" filter="url(#clip-tight)" />
                <path
                    d="M52 103Q120 108.5 188 103"
                    fill="none"
                    style={{ stroke: "var(--m-shadow)" }}
                    strokeWidth="3"
                    opacity="0.5"
                    filter="url(#clip-tight)"
                />
            </g>

            {/* base plate: sheet thickness, top face, lit top rim */}
            <rect x="6" y="33" width="228" height="33" rx="12" style={{ fill: "var(--m-deep)" }} />
            <rect x="6" y="31" width="228" height="33" rx="12" fill="url(#clip-base)" />
            <path d="M18 31.7H222" stroke="#fff" strokeOpacity="0.55" strokeWidth="1" strokeLinecap="round" />

            {RIVETS.map((x) => (
                <g key={x}>
                    <circle cx={x + 0.6} cy={49.3} r={7} style={{ fill: "var(--m-crease)" }} opacity="0.35" filter="url(#clip-tight)" />
                    <circle cx={x} cy={48} r={6.5} fill="url(#clip-rivet)" />
                    <circle cx={x} cy={48} r={6.5} fill="none" style={{ stroke: "var(--m-crease)" }} strokeOpacity="0.25" strokeWidth="0.7" />
                    <ellipse cx={x - 2} cy={45.6} rx={2.1} ry={1.3} fill="#fff" opacity="0.85" />
                </g>
            ))}

            {/* lever: bends round the pivot, runs flat, then curls down into the jaw */}
            <path d={LEVER} fill="url(#clip-lever)" />
            <path d={LEVER} fill="url(#clip-sheen)" />
            <path d={LEVER} fill="url(#clip-side)" />
            {/* stamped stiffening panel: shaded upper lip, lit lower lip */}
            <rect x="72" y="57" width="96" height="26" rx="9" fill="none" style={{ stroke: "var(--m-crease)" }} strokeOpacity="0.16" strokeWidth="1.2" />
            <rect x="72" y="58.2" width="96" height="26" rx="9" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="0.9" />
            <path
                d="M50 100.8Q120 104.6 190 100.8"
                fill="none"
                stroke="#fff"
                strokeOpacity="0.55"
                strokeWidth="1.1"
                strokeLinecap="round"
            />
            <path d="M54.5 104.5Q120 108 185.5 104.5" fill="none" style={{ stroke: "var(--m-crease)" }} strokeOpacity="0.35" strokeWidth="1" />

            {/* ear with the hanging hole, rising from the back of the lever */}
            <path d={EAR + HOLE} fill="url(#clip-ear)" fillRule="evenodd" />
            <path
                d="M94 44V24A20 20 0 0 1 114 4H126A20 20 0 0 1 146 24V44"
                fill="none"
                stroke="#fff"
                strokeOpacity="0.4"
                strokeWidth="0.9"
            />
            {/* hole: shaded inner wall at the top, lit rim at the bottom */}
            <path d="M113.3 18A6.8 6.8 0 0 1 126.7 18" fill="none" style={{ stroke: "var(--m-crease)" }} strokeOpacity="0.45" strokeWidth="1.4" />
            <path d="M113.6 21.8A7.3 7.3 0 0 0 126.4 21.8" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="0.9" />
            {/* crease where the ear bends up out of the lever */}
            <path d="M95 44.6H145" style={{ stroke: "var(--m-crease)" }} strokeOpacity="0.35" strokeWidth="1.3" />
            <path d="M95 46.3H145" stroke="#fff" strokeOpacity="0.5" strokeWidth="0.9" />
        </svg>
    );
}
