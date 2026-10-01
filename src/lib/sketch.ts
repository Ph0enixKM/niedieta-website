// Deterministic "hand-drawn" SVG path generators.
// Everything here is a pure function of its seed, so server and client render identical markup.

type Point = [number, number];

export function rng(seed: number) {
    // mulberry32
    let s = seed | 0;
    return () => {
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Catmull-Rom spline through the points, emitted as cubic Béziers. */
export function smoothPath(points: Point[], closed = false): string {
    if (points.length < 2) return "";
    const pts = closed
        ? [points[points.length - 1], ...points, points[0], points[1]]
        : [points[0], ...points, points[points.length - 1]];
    let d = `M${r2(pts[1][0])} ${r2(pts[1][1])}`;
    for (let i = 1; i < pts.length - 2; i++) {
        const [p0, p1, p2, p3] = [pts[i - 1], pts[i], pts[i + 1], pts[i + 2]];
        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += `C${r2(c1x)} ${r2(c1y)} ${r2(c2x)} ${r2(c2y)} ${r2(p2[0])} ${r2(p2[1])}`;
    }
    return closed ? `${d}Z` : d;
}

/** A quick pen circle that overshoots its start, in a 100×100 box. */
export function sketchRing(seed = 1, turns = 1.14, wobble = 0.05): string {
    const rand = rng(seed);
    const start = rand() * Math.PI * 2;
    const n = Math.round(26 * turns);
    const pts: Point[] = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        const a = start + t * turns * Math.PI * 2;
        const r = 43 * (1 + (rand() - 0.5) * wobble + (t - 0.5) * 0.07);
        pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r * 0.95]);
    }
    return smoothPath(pts);
}

/** Loose marker loop hugging a rectangle, drawn inside a width×height box. */
export function sketchLoop(seed = 1, width = 1000, height = 1000, turns = 1.3, from = -0.6): string {
    const rand = rng(seed);
    const n = Math.round(30 * turns);
    const pad = Math.min(width, height) * 0.05;
    const pts: Point[] = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        const a = (from + t * turns * 2) * Math.PI;
        const c = Math.cos(a);
        const s = Math.sin(a);
        // superellipse so the loop follows the photo's corners
        const x = Math.sign(c) * Math.abs(c) ** 0.62;
        const y = Math.sign(s) * Math.abs(s) ** 0.62;
        const k = 1 + (rand() - 0.5) * 0.07 - t * 0.06;
        pts.push([width / 2 + x * (width / 2 - pad) * k, height / 2 + y * (height / 2 - pad) * k]);
    }
    return smoothPath(pts);
}

/** Wavy pen line across a width×height box. */
export function sketchLine(seed = 1, width = 200, height = 20, amp = 3.2, waves = 1.4): string {
    const rand = rng(seed);
    const pts: Point[] = [];
    const n = 7;
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        const y = height / 2 + Math.sin(t * Math.PI * waves + rand() * 0.8) * amp + (rand() - 0.5) * amp * 0.5;
        pts.push([3 + t * (width - 6), y]);
    }
    return smoothPath(pts);
}

/** Torn/painted edge: a filled shape whose top follows a soft irregular line (width×height box). */
export function roughEdge(seed = 1, width = 1440, height = 48, segments = 22): string {
    const rand = rng(seed);
    const pts: Point[] = [];
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const wave = Math.sin(t * Math.PI * 2.6 + seed) * 0.22 + Math.sin(t * Math.PI * 7.3 + seed * 2) * 0.08;
        const y = height * (0.46 + wave + (rand() - 0.5) * 0.18);
        pts.push([t * width, Math.min(height - 2, Math.max(2, y))]);
    }
    return `${smoothPath(pts)}L${width} ${height + 2}L0 ${height + 2}Z`;
}

/** Irregular filled blob, like a quick marker fill (100×100 box, use preserveAspectRatio="none"). */
export function markerBlob(seed = 1): string {
    const rand = rng(seed);
    const pts: Point[] = [];
    const n = 16;
    for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const c = Math.cos(a);
        const s = Math.sin(a);
        const x = Math.sign(c) * Math.abs(c) ** 0.45;
        const y = Math.sign(s) * Math.abs(s) ** 0.45;
        const k = 1 + (rand() - 0.5) * 0.06;
        pts.push([50 + x * 48 * k, 50 + y * 47 * k]);
    }
    return smoothPath(pts, true);
}
