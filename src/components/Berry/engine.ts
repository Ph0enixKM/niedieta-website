import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// Each blueberry on the page is an "actor" bound to a DOM anchor (`[data-berry="hero|process|offer"]`) and re-reads
// the anchor's rect every frame, so layout stays in CSS and the 3D layer simply follows it.
//
// The berries share one small WebGL canvas, and it doesn't float above the page: it is placed *inside* the element of
// the berry on screen (its anchor, or a sticky rider on the narrow process track) and moves on when another berry
// scrolls into view. Phones scroll on the compositor while WebGL frames come from the main thread, so a fixed overlay
// always trails the content by a frame or more and shakes; a canvas that is part of the content is moved together with
// its anchor by the compositor, however late the next WebGL frame is.
//
// World units are CSS pixels: the camera frames the viewport so that the z = 0 plane maps 1:1 to it (origin in the
// viewport centre, y pointing up), and each frame renders only the part of that view the canvas covers.

const MODEL_URL = "/models/blueberry.glb";
/** Model space: the body radius is 1 and the berry's bottom sits at y = -BOTTOM. */
const BOTTOM = 0.89;
const FOV = 22;
/** Process track (wide layouts): how far above step 1 the berry starts its drop, in CSS px. */
const DROP_H = 110;
/** Process track (narrow layouts): how far the gliding berry may trail its rider while the page scrolls, in radii. */
const MAX_LAG = 5;
/** Canvas room around a berry's centre, in radii: the body squashed, stretched and seen in perspective. */
const PAD = 2.1;
/** Offer card: how long the berry pops out from behind the card and grows to full size, in s. */
const POP_T = 0.5;
/** Pixel budget of the canvas: small ones get the full device pixel ratio (up to 3), the tall drop-in one less. */
const MAX_PIXELS = 1.6e6;

export interface BerryEngine {
    dispose(): void;
}

interface View {
    left: number;
    top: number;
    w: number;
    h: number;
}

interface PointerState {
    x: number;
    y: number;
    inside: boolean;
    fine: boolean;
}

interface Frame {
    t: number;
    dt: number;
    view: View;
    pointer: PointerState;
    /** Smoothed scroll speed in px/s, positive while scrolling down. */
    scrollV: number;
    reduced: boolean;
}

/** Where the canvas goes while an actor is drawn: a box in CSS px, relative to the host element's top-left corner. */
interface Placement {
    host: HTMLElement;
    /** The host's client rect, as measured this frame. */
    rect: DOMRect;
    x: number;
    y: number;
    w: number;
    h: number;
    /** Whether the berry needs more frames (on screen and animating, or still moving). */
    busy: boolean;
}

interface Actor {
    /** Layout reads only. 2: in view, 1: close to the viewport, 0: further away. */
    measure(frame: Frame): number;
    /** Poses the berry for this frame (DOM writes allowed) and says where the canvas must be, or null to draw nothing. */
    update(frame: Frame): Placement | null;
    hide(): void;
    dispose(): void;
}

interface Kit {
    scene: THREE.Scene;
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    shadowTexture: THREE.Texture;
    wake(): void;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const damp = (current: number, target: number, lambda: number, dt: number) =>
    current + (target - current) * (1 - Math.exp(-lambda * dt));
const easeInOut = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

const AXIS_X = new THREE.Vector3(1, 0, 0);
const AXIS_Y = new THREE.Vector3(0, 1, 0);
const AXIS_Z = new THREE.Vector3(0, 0, 1);

function toWorld(clientX: number, clientY: number, view: View, out: THREE.Vector3) {
    return out.set(clientX - view.left - view.w / 2, view.h / 2 - (clientY - view.top), 0);
}

function onScreen(r: DOMRect, view: View, margin: number) {
    return (
        r.bottom > view.top - margin &&
        r.top < view.top + view.h + margin &&
        r.right > view.left - margin &&
        r.left < view.left + view.w + margin
    );
}

function proximity(r: DOMRect, view: View, margin: number) {
    return onScreen(r, view, 0) ? 2 : onScreen(r, view, margin) ? 1 : 0;
}

/** Placement covering [x0, x1] × [y0, y1] of the host, snapped outwards to whole pixels. */
function cover(host: HTMLElement, rect: DOMRect, x0: number, y0: number, x1: number, y1: number, busy: boolean): Placement {
    const x = Math.floor(x0);
    const y = Math.floor(y0);
    return { host, rect, x, y, w: Math.ceil(x1) - x, h: Math.ceil(y1) - y, busy };
}

const _qSpin = new THREE.Quaternion();
const _qTilt = new THREE.Quaternion();
const _qLook = new THREE.Quaternion();
const _euler = new THREE.Euler(0, 0, 0, "YXZ");

/** Orientation shared by the solo berries: spin around its own axis, tip the crown towards the viewer, then look. */
function composeOrientation(out: THREE.Quaternion, spin: number, tilt: number, lookX: number, lookY: number) {
    _qSpin.setFromAxisAngle(AXIS_Y, spin);
    _qTilt.setFromAxisAngle(AXIS_X, tilt);
    _qLook.setFromEuler(_euler.set(lookX, lookY, 0, "YXZ"));
    return out.copy(_qLook).multiply(_qTilt).multiply(_qSpin);
}

function makeShadow(kit: Kit, opacity: number) {
    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({
            map: kit.shadowTexture,
            color: 0x1c2036,
            transparent: true,
            opacity,
            depthWrite: false,
            toneMapped: false,
        }),
    );
    mesh.renderOrder = -1;
    mesh.visible = false;
    kit.scene.add(mesh);
    return mesh;
}

function disposeShadow(mesh: THREE.Mesh) {
    mesh.geometry.dispose();
    (mesh.material as THREE.Material).dispose();
    mesh.removeFromParent();
}

// ------------------------------------------------------------------ hero mascot

/** Drops in once, then keeps spinning slowly and turns towards the cursor (or reacts to scrolling on touch). */
class Mascot implements Actor {
    private group = new THREE.Group();
    private berry: THREE.Mesh;
    private shadow: THREE.Mesh;
    private rect = new DOMRect();
    private state: "waiting" | "intro" | "idle" = "waiting";
    /** Height (above its resting spot) the drop-in starts from. */
    private dropFrom = 0;
    private y = 0;
    private vy = 0;
    private airborne = false;
    private squash = 1;
    private squashV = 0;
    private spin = Math.random() * Math.PI * 2;
    private spinV = 0.3;
    private lookX = 0;
    private lookY = 0;
    private v = new THREE.Vector3();
    private ground = new THREE.Vector3();

    constructor(private el: HTMLElement, kit: Kit) {
        this.berry = new THREE.Mesh(kit.geometry, kit.material);
        this.group.add(this.berry);
        this.group.visible = false;
        kit.scene.add(this.group);
        this.shadow = makeShadow(kit, 0.26);
    }

    hide() {
        this.group.visible = false;
        this.shadow.visible = false;
    }

    measure(f: Frame) {
        const r = (this.rect = this.el.getBoundingClientRect());
        const R = r.width / 2;
        if (R <= 0) return 0;
        // only drop in once the landing spot is actually in view
        if (this.state === "waiting") return onScreen(r, f.view, -R * 0.5) ? 2 : 0;
        return proximity(r, f.view, R * 2);
    }

    update(f: Frame) {
        const r = this.rect;
        const R = r.width / 2;

        if (this.state === "waiting") {
            if (f.reduced) {
                this.state = "idle";
            } else {
                this.state = "intro";
                this.y = this.dropFrom = r.top + r.height / 2 - f.view.top + R * 2.4;
                this.vy = -R * 2;
                this.airborne = true;
                this.spinV = Math.PI * 1.6;
            }
        }

        const dt = f.dt;
        if (this.airborne) {
            this.vy -= 34 * R * dt;
            this.y += this.vy * dt;
            if (this.y <= 0) {
                this.y = 0;
                const impact = -this.vy / R;
                if (impact > 2.4) {
                    this.vy = -this.vy * 0.36;
                    this.squashV -= impact * 0.19;
                } else {
                    this.vy = 0;
                    this.airborne = false;
                    this.squashV -= impact * 0.12;
                    this.state = "idle";
                }
            }
        }

        const stretch = this.airborne ? 1 + clamp((Math.abs(this.vy) / R) * 0.011, 0, 0.13) : 1;
        this.squashV += (-(this.squash - stretch) * 240 - this.squashV * 12) * dt;
        this.squash = clamp(this.squash + this.squashV * dt, 0.7, 1.3);

        const resting = this.state === "idle" && !this.airborne && !f.reduced;
        const bob = resting ? Math.sin(f.t * 1.7) * R * 0.055 : 0;

        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        let tx = 0;
        let ty = 0;
        let spinTarget = f.reduced ? 0 : 0.3;
        if (f.pointer.fine && f.pointer.inside) {
            // look at the cursor
            ty = clamp(((f.pointer.x - cx) / f.view.w) * 2.4, -0.8, 0.8);
            tx = clamp(((f.pointer.y - cy) / f.view.h) * 1.7, -0.5, 0.55);
        } else if (!f.reduced) {
            // touch screens: the berry leans and spins along with the scroll
            tx = clamp(f.scrollV * 0.00035, -0.4, 0.4);
            ty = Math.sin(f.t * 0.55) * 0.25;
            spinTarget += clamp(f.scrollV * 0.004, -5, 5);
        }
        this.lookX = damp(this.lookX, tx, 4, dt);
        this.lookY = damp(this.lookY, ty, 4, dt);
        this.spinV = damp(this.spinV, spinTarget, this.state === "intro" ? 1.5 : 3, dt);
        this.spin += this.spinV * dt;

        const sy = this.squash;
        const sxz = 1 / Math.sqrt(sy);
        toWorld(cx, cy, f.view, this.v);
        this.group.position.set(this.v.x, this.v.y + this.y + bob + BOTTOM * R * (sy - 1), 0);
        this.group.scale.set(R * sxz, R * sy, R * sxz);
        composeOrientation(this.berry.quaternion, this.spin, 0.4, this.lookX, this.lookY);
        this.group.visible = true;

        const lift = clamp((this.y + bob + R * 0.12) / (R * 3), 0, 1);
        toWorld(cx, cy + R * 1.02, f.view, this.ground);
        this.shadow.position.set(this.ground.x + R * 0.05, this.ground.y, -R);
        this.shadow.scale.set(R * 2.1 * (1 - lift * 0.45), R * 0.42 * (1 - lift * 0.3), 1);
        (this.shadow.material as THREE.MeshBasicMaterial).opacity = 0.3 * (1 - lift * 0.6);
        this.shadow.visible = true;

        // canvas: a square around the resting spot, reaching up to where the drop-in started while it lasts
        const top = this.state === "intro" ? R - this.dropFrom - PAD * R : R - PAD * R;
        return cover(this.el, r, R - PAD * R, top, R + PAD * R, R + PAD * R, true);
    }

    dispose() {
        this.group.removeFromParent();
        disposeShadow(this.shadow);
    }
}

// ------------------------------------------------------------------ berry sitting on the featured offer card

/** Waits for the card to fade in, pops out from behind its top edge, then hops now and then (and on hover). */
class Topper implements Actor {
    private group = new THREE.Group();
    private berry: THREE.Mesh;
    private shadow: THREE.Mesh;
    private material: THREE.Material;
    /** Hides the part of the berry below the card's top edge while it climbs out from behind the card. */
    private clip = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    private host: HTMLElement | null;
    private reveal: HTMLElement | null;
    /** Wakes the (possibly sleeping) frame loop when the card starts fading in. */
    private revealed = new MutationObserver(() => {
        if (!this.reveal?.hasAttribute("data-inview")) return;
        this.revealed.disconnect();
        this.kit.wake();
    });
    private rect = new DOMRect();
    private state: "waiting" | "intro" | "idle" = "waiting";
    /** Seconds left until the pop-out starts (the card's own reveal delay plus most of its fade-in). */
    private wait = -1;
    private pop = 0;
    private y = 0;
    private vy = 0;
    private airborne = false;
    private squash = 1;
    private squashV = 0;
    private spin = Math.random() * Math.PI * 2;
    private lookX = 0;
    private lookY = 0;
    private nextHop = 4;
    private v = new THREE.Vector3();

    constructor(private el: HTMLElement, private kit: Kit) {
        this.material = kit.material.clone();
        this.material.clippingPlanes = [this.clip];
        this.berry = new THREE.Mesh(kit.geometry, this.material);
        this.group.add(this.berry);
        this.group.visible = false;
        kit.scene.add(this.group);
        this.shadow = makeShadow(kit, 0.34);
        this.host = el.closest<HTMLElement>("[data-berry-host]");
        this.reveal = el.closest<HTMLElement>("[data-reveal]");
        if (this.reveal) this.revealed.observe(this.reveal, { attributes: true, attributeFilter: ["data-inview"] });
        this.host?.addEventListener("pointerenter", this.hop);
    }

    private hop = () => {
        if (this.airborne || this.state !== "idle") return;
        this.vy = 7.2 * (this.el.getBoundingClientRect().width / 2);
        this.airborne = true;
        this.squashV -= 1.6;
        this.kit.wake();
    };

    hide() {
        this.group.visible = false;
        this.shadow.visible = false;
    }

    measure(f: Frame) {
        const r = (this.rect = this.el.getBoundingClientRect());
        if (r.width <= 0) return 0;
        // nothing to draw until the card itself starts fading in
        if (this.state === "waiting" && this.reveal && !this.reveal.hasAttribute("data-inview")) return 0;
        return proximity(r, f.view, r.width * 1.5);
    }

    update(f: Frame) {
        const r = this.rect;
        const R = r.width / 2;
        const dt = f.dt;

        if (this.state === "waiting") {
            if (this.wait < 0) {
                const delay = this.reveal ? parseFloat(getComputedStyle(this.reveal).transitionDelay) || 0 : 0;
                this.wait = f.reduced ? 0 : delay + 0.45;
            }
            this.wait -= dt;
            if (this.wait > 0) {
                this.hide();
                return cover(this.el, r, 0, 0, 1, 1, true);
            }
            if (f.reduced) {
                this.state = "idle";
                this.pop = 1;
            } else {
                // start below the card's top edge, at half size, and jump up onto it
                this.state = "intro";
                this.y = -1.3 * R;
                this.vy = 13.5 * R;
                this.airborne = true;
                this.spin -= 2.4;
            }
        }
        if (this.state === "intro") {
            this.pop = Math.min(1, this.pop + dt / POP_T);
            if (!this.airborne) this.state = "idle";
        }
        const u = this.pop;
        const scale = 0.5 + 0.5 * (u < 1 ? 1 + 2.2 * Math.pow(u - 1, 3) + 1.2 * Math.pow(u - 1, 2) : 1);

        if (this.state === "idle" && !f.reduced) {
            this.nextHop -= dt;
            if (this.nextHop <= 0) {
                this.nextHop = 5 + Math.random() * 5;
                this.hop();
            }
        }

        if (this.airborne) {
            this.vy -= 32 * R * dt;
            this.y += this.vy * dt;
            if (this.y <= 0 && this.vy < 0) {
                const impact = -this.vy / R;
                this.y = 0;
                if (impact > 2.6) {
                    this.vy = -this.vy * 0.3;
                } else {
                    this.vy = 0;
                    this.airborne = false;
                }
                this.squashV -= impact * 0.18;
            }
        }

        const breathe = this.airborne || f.reduced ? 0 : Math.sin(f.t * 2.1) * 0.02;
        const target = this.airborne ? 1 + clamp((Math.abs(this.vy) / R) * 0.01, 0, 0.12) : 1 + breathe;
        this.squashV += (-(this.squash - target) * 260 - this.squashV * 12) * dt;
        this.squash = clamp(this.squash + this.squashV * dt, 0.72, 1.28);

        const cx = r.left + r.width / 2;
        let tx = 0;
        let ty = 0;
        if (f.pointer.fine && f.pointer.inside) {
            ty = clamp(((f.pointer.x - cx) / f.view.w) * 1.8, -0.6, 0.6);
            tx = clamp(((f.pointer.y - r.top) / f.view.h) * 1.2, -0.35, 0.45);
        }
        this.lookX = damp(this.lookX, tx, 3, dt);
        this.lookY = damp(this.lookY, ty, 3, dt);
        if (!f.reduced) this.spin += dt * 0.22;

        const sy = this.squash;
        const sxz = 1 / Math.sqrt(sy);
        const S = R * scale;
        toWorld(cx, r.bottom, f.view, this.v);
        const groundY = this.v.y;
        this.group.position.set(this.v.x, groundY + BOTTOM * S * sy + this.y, 0);
        this.group.scale.set(S * sxz, S * sy, S * sxz);
        composeOrientation(this.berry.quaternion, this.spin, 0.38, this.lookX, this.lookY);
        this.group.visible = true;
        // the slot's bottom edge is the card's top edge: while climbing out, the berry is behind the card
        // (the plane stays on the material, and is just moved out of the way later, so the shader never recompiles)
        this.clip.constant = this.state === "intro" ? -(groundY - 0.5) : 1e6;

        const lift = clamp(this.y / (R * 2), 0, 1);
        this.shadow.position.set(this.v.x + R * 0.04, groundY + R * 0.02, -R);
        this.shadow.scale.set(S * 1.9 * (1 - lift * 0.4), S * 0.3 * (1 - lift * 0.3), 1);
        (this.shadow.material as THREE.MeshBasicMaterial).opacity = 0.36 * (1 - lift * 0.6);
        this.shadow.visible = this.y >= 0;

        // canvas: the berry sits on the slot's bottom edge and hops up to ~0.8 R
        return cover(this.el, r, R - PAD * R, 2 * R - (PAD + 1.9) * R, R + PAD * R, 2 * R + 0.6 * R, true);
    }

    dispose() {
        this.host?.removeEventListener("pointerenter", this.hop);
        this.revealed.disconnect();
        this.group.removeFromParent();
        this.material.dispose();
        disposeShadow(this.shadow);
    }
}

// ------------------------------------------------------------------ berry travelling along the "how we work" track

interface TrackConfig {
    key: string;
    mode: "pin" | "scrub" | "follow";
    stations: number[];
    radius: number;
}

/** The track path sampled every ~2px of its length (reading SVG path geometry every frame is slow on phones). */
interface Track {
    d: string;
    L: number;
    step: number;
    xs: Float32Array;
    ys: Float32Array;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

function sampleTrack(path: SVGPathElement, d: string): Track {
    const L = path.getTotalLength();
    const n = Math.max(2, Math.ceil(L / 2) + 1);
    const step = L / (n - 1);
    const xs = new Float32Array(n);
    const ys = new Float32Array(n);
    for (let i = 0; i < n; i++) {
        const p = path.getPointAtLength(i * step);
        xs[i] = p.x;
        ys[i] = p.y;
    }
    return { d, L, step, xs, ys, minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

function pointAt(track: Track, s: number, out: { x: number; y: number }) {
    const last = track.xs.length - 1;
    const u = clamp(s / Math.max(1e-6, track.step), 0, last);
    const i = Math.min(last - 1, Math.floor(u));
    const k = u - i;
    out.x = track.xs[i] + (track.xs[i + 1] - track.xs[i]) * k;
    out.y = track.ys[i] + (track.ys[i + 1] - track.ys[i]) * k;
    return out;
}

/** Distance along a top-to-bottom track at which it reaches height y. */
function lengthAtY(track: Track, y: number) {
    const ys = track.ys;
    let lo = 0;
    let hi = ys.length - 1;
    if (y <= ys[lo]) return 0;
    if (y >= ys[hi]) return track.L;
    while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (ys[mid] < y) lo = mid;
        else hi = mid;
    }
    return (lo + (y - ys[lo]) / Math.max(1e-6, ys[hi] - ys[lo])) * track.step;
}

/**
 * Wide layouts: the berry rolls along the track and hops from station to station.
 * Narrow layouts ("follow"): there's no room for that, so it glides centred on the line, spinning gently. Its canvas
 * rides on a sticky element level with the reading line, so the glide itself is the browser's scrolling.
 */
class Roller implements Actor {
    private group = new THREE.Group();
    private berry: THREE.Mesh;
    private shadow: THREE.Mesh;
    private rect = new DOMRect();
    private path: SVGPathElement | null = null;
    private track: Track | null = null;
    private rider: HTMLElement | null = null;
    private riderRect: DOMRect | null = null;
    private wrapRect: DOMRect | null = null;
    private s = 0;
    private spin = 0;
    private primed = false;
    private config: TrackConfig | null = null;
    private reached: boolean[] = [];
    private endReached = false;
    private lastTrail = -1;
    private v = new THREE.Vector3();
    private q = new THREE.Quaternion();
    private pt = { x: 0, y: 0 };
    private pa = { x: 0, y: 0 };
    private pb = { x: 0, y: 0 };

    constructor(private el: HTMLElement, kit: Kit) {
        this.berry = new THREE.Mesh(kit.geometry, kit.material);
        this.group.add(this.berry);
        this.group.visible = false;
        kit.scene.add(this.group);
        this.shadow = makeShadow(kit, 0.3);
        el.setAttribute("data-live", "");
    }

    hide() {
        this.group.visible = false;
        this.shadow.visible = false;
    }

    private readConfig(): TrackConfig | null {
        const stations = this.el.dataset.stations;
        const mode = this.el.dataset.mode as TrackConfig["mode"] | undefined;
        const radius = Number(this.el.dataset.radius);
        if (!stations || !mode || !radius) return null;
        const key = `${mode}|${stations}|${radius}`;
        if (this.config?.key !== key) {
            this.config = { key, mode, radius, stations: stations.split(",").map(Number) };
        }
        return this.config;
    }

    private setReached(i: number, value: boolean) {
        if (this.reached[i] === value) return;
        this.reached[i] = value;
        this.el.querySelectorAll(`[data-step="${i}"]`).forEach((node) => node.toggleAttribute("data-reached", value));
    }

    measure(f: Frame) {
        const cfg = this.readConfig();
        if (!this.path?.isConnected) this.path = this.el.querySelector<SVGPathElement>("[data-berry-track]");
        if (!this.path || !cfg) return 0;
        const near = proximity((this.rect = this.el.getBoundingClientRect()), f.view, 240);
        if (!near) return 0;

        const d = this.path.getAttribute("d") ?? "";
        if (this.track?.d !== d) this.track = sampleTrack(this.path, d);
        this.riderRect = null;
        this.wrapRect = null;
        if (cfg.mode === "follow") {
            if (!this.rider?.isConnected) this.rider = this.el.querySelector<HTMLElement>("[data-berry-rider]");
            if (!this.rider) return 0;
            this.riderRect = this.rider.getBoundingClientRect();
        } else if (cfg.mode === "pin") {
            this.wrapRect = this.el.closest<HTMLElement>("[data-berry-scroll]")?.getBoundingClientRect() ?? null;
        }
        return near;
    }

    update(f: Frame) {
        const cfg = this.config!;
        const track = this.track!;
        const r = this.rect;
        const L = track.L;
        const R = cfg.radius;
        const keys = [0, ...cfg.stations, L];
        const follow = cfg.mode === "follow";
        // the track's svg sits at the board's top-left corner (Process.module.css → .track)
        const ox = r.left;
        const oy = r.top;

        // where the scroll says the berry should be
        let target = 0;
        if (follow) {
            // CSS keeps the rider level with the reading line; while the page scrolls the berry trails it, about as far
            // as easing towards it would (speed / 9), saturating softly
            const lag = f.reduced ? 0 : -MAX_LAG * R * Math.tanh(f.scrollV / (9 * MAX_LAG * R));
            target = lengthAtY(track, this.riderRect!.top - oy + lag);
        } else {
            let p: number;
            if (cfg.mode === "pin") {
                const wrap = this.wrapRect ?? r;
                p = clamp(-(wrap.top - f.view.top) / Math.max(1, wrap.height - f.view.h), 0, 1);
            } else {
                p = clamp((f.view.top + f.view.h * 0.85 - r.top) / (f.view.h * 0.65), 0, 1);
            }
            // equal scroll per hop, easing in and out of every station;
            // the first segment is the drop onto step 1, eased separately below
            const n = keys.length - 1;
            const x = p * n;
            const seg = Math.min(n - 1, Math.floor(x));
            const u = x - seg;
            target = keys[seg] + (keys[seg + 1] - keys[seg]) * (seg === 0 ? u : easeInOut(u));
        }

        // the gliding berry takes its lag from the smoothed scroll speed rather than from damping: damping the
        // main thread's scroll samples would reintroduce their jitter relative to the sticky rider
        if (follow || !this.primed || f.reduced) {
            this.s = target;
            this.primed = true;
        } else {
            this.s = damp(this.s, target, 9, f.dt);
        }
        const s = clamp(this.s, 0, L);

        // wide layouts: before step 1 the berry drops in from above, growing from nothing
        const first = cfg.stations[0] ?? 0;
        const dropping = !follow && s < first;
        const d = dropping ? clamp(s / Math.max(1, first), 0, 1) : 1;

        // hop between stations (wide layouts only): 0 on a station, peak halfway
        let hop = 0;
        if (!follow && !dropping) {
            let i = 0;
            while (i < keys.length - 2 && s > keys[i + 1]) i++;
            const span = Math.max(1, keys[i + 1] - keys[i]);
            const t = clamp((s - keys[i]) / span, 0, 1);
            hop = 4 * t * (1 - t) * Math.min(R * 1.1, span * 0.32);
        }

        const at = dropping ? first : s;
        const pt = pointAt(track, at, this.pt);
        const a = pointAt(track, Math.max(0, at - 1), this.pa);
        const b = pointAt(track, Math.min(L, at + 1), this.pb);
        let tx = b.x - a.x;
        let ty = b.y - a.y;
        const tl = Math.hypot(tx, ty) || 1;
        tx /= tl;
        ty /= tl;
        // normal pointing "up" relative to the direction of travel (screen space, y down)
        const nx = ty;
        const ny = -tx;

        const contactX = ox + pt.x;
        const contactY = oy + pt.y;
        const lift = follow ? 0 : BOTTOM * R + hop;
        // gravity-like fall (accelerating) while the scale grows 0 → 1 and lands on step 1
        const fall = (1 - d * d) * DROP_H;
        toWorld(contactX + nx * lift, contactY + ny * lift - fall, f.view, this.v);
        this.group.position.copy(this.v);
        this.group.scale.setScalar(Math.max(1e-3, R * d));
        if (follow) {
            if (!f.reduced) this.spin += f.dt * 0.45;
            composeOrientation(this.berry.quaternion, this.spin, 0.35, 0, 0);
        } else {
            // rolling without slipping: angle = distance / radius, clockwise in screen space;
            // measured back from the track's end so the berry comes to rest upright there
            this.q.setFromAxisAngle(AXIS_Z, (L - s) / (R * 0.95));
            composeOrientation(this.berry.quaternion, 0, 0.35, 0, 0);
            this.berry.quaternion.premultiply(this.q);
        }
        this.group.visible = d > 0.01;

        if (follow) {
            // floating on the line: soft shadow just below
            toWorld(contactX + R * 0.08, contactY + R * 1.05, f.view, this.v);
            this.shadow.rotation.z = 0;
            this.shadow.scale.set(R * 1.7, R * 0.34, 1);
            (this.shadow.material as THREE.MeshBasicMaterial).opacity = 0.24;
        } else {
            const hopK = clamp(hop / (R * 1.2), 0, 1);
            toWorld(contactX + nx * R * 0.06, contactY + ny * R * 0.06, f.view, this.v);
            this.shadow.rotation.z = Math.atan2(-ty, tx);
            // while dropping, the shadow on step 1 sharpens as the berry closes in
            const sk = dropping ? d * d : 1;
            this.shadow.scale.set(
                Math.max(1e-3, R * 1.8 * (1 - hopK * 0.45) * (0.4 + 0.6 * sk)),
                Math.max(1e-3, R * 0.34 * (1 - hopK * 0.3) * (0.4 + 0.6 * sk)),
                1,
            );
            (this.shadow.material as THREE.MeshBasicMaterial).opacity = 0.3 * (1 - hopK * 0.55) * sk;
        }
        this.shadow.position.set(this.v.x, this.v.y, -R);
        this.shadow.visible = d > 0.01;

        // step 1 lights up on impact; later ones a little before the berry arrives
        cfg.stations.forEach((st, i) => this.setReached(i, s >= st - (follow || i > 0 ? R * 0.4 : 0.5)));
        const end = s >= L - R * 0.6;
        if (end !== this.endReached) {
            this.endReached = end;
            this.el.querySelector("[data-track-end]")?.toggleAttribute("data-reached", end);
        }
        const trail = this.el.querySelector<SVGPathElement>("[data-berry-trail]");
        if (trail && Math.abs(this.lastTrail - s) > 0.5) {
            this.lastTrail = s;
            // wide layouts: the trail starts where the berry lands (step 1), not at the track's start
            const from = follow ? 0 : first;
            const len = Math.max(0, s - from);
            trail.style.strokeDasharray = `0 ${from.toFixed(1)} ${len.toFixed(1)} ${(L + 10).toFixed(1)}`;
            trail.style.visibility = len < 0.5 ? "hidden" : "";
        }

        if (follow) {
            // canvas on the rider: the line's width, and as far up and down as the berry may trail
            const rr = this.riderRect!;
            const reach = (MAX_LAG + PAD + 0.4) * R;
            return cover(this.rider!, rr, ox + track.minX - rr.left - PAD * R, -reach, ox + track.maxX - rr.left + PAD * R, reach, !f.reduced);
        }
        // canvas on the board, following the berry along the track, tall enough for the hops and the drop onto step 1
        const busy = Math.abs(target - this.s) > 0.2;
        const room = PAD + 0.3;
        return cover(this.el, r, pt.x - room * R, track.minY - Math.max(DROP_H + 2.4 * R, 3.5 * R), pt.x + room * R, track.maxY + R, busy);
    }

    dispose() {
        this.el.removeAttribute("data-live");
        this.group.removeFromParent();
        disposeShadow(this.shadow);
    }
}

// ------------------------------------------------------------------ engine

/**
 * Renders the berries into `canvas`, which the engine moves into the element of whichever berry is on screen
 * (and out of the document while none is).
 */
export async function createBerryEngine(canvas: HTMLCanvasElement, onLost: () => void): Promise<BerryEngine> {
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.localClippingEnabled = true;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const envMap = pmrem.fromScene(room, 0.04).texture;
    room.dispose();
    pmrem.dispose();
    scene.environment = envMap;
    scene.environmentIntensity = 0.62;

    const key = new THREE.DirectionalLight(0xfff3e2, 2.1);
    key.position.set(-0.9, 1.25, 1.2);
    const rim = new THREE.DirectionalLight(0xcfe0ff, 1.5);
    rim.position.set(1.2, 0.6, -0.7);
    const hemi = new THREE.HemisphereLight(0xe6eef4, 0xf6f0e3, 0.55);
    scene.add(key, rim, hemi);

    const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 10000);

    const gltf = await new GLTFLoader().loadAsync(MODEL_URL);
    let source: THREE.Mesh | undefined;
    gltf.scene.traverse((o) => {
        if (!source && (o as THREE.Mesh).isMesh) source = o as THREE.Mesh;
    });
    if (!source) throw new Error("blueberry mesh missing");
    const srcMat = source.material as THREE.MeshStandardMaterial;
    const geometry = source.geometry;
    const material = new THREE.MeshPhysicalMaterial({
        map: srcMat.map,
        roughnessMap: srcMat.roughnessMap,
        roughness: 1,
        metalness: 0,
        sheen: 0.9,
        sheenRoughness: 0.45,
        sheenColor: new THREE.Color("#b8c8d6"),
        color: new THREE.Color("#e4e8ff"),
    });
    srcMat.dispose();

    const shadowTexture = (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 128;
        const g = c.getContext("2d")!;
        const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(0.4, "rgba(255,255,255,0.6)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = grad;
        g.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(c);
    })();

    // ---- frame loop (sleeps whenever nothing is on screen or moving)
    let raf = 0;
    let last = performance.now();
    let disposed = false;
    // Scroll positions of the last ~0.1s: phones hand the main thread the compositor's scroll position at uneven
    // moments, so the scroll speed is measured over this window rather than from frame to frame.
    const scrolls: { t: number; y: number }[] = [];
    const wake = () => {
        if (disposed || raf) return;
        last = performance.now();
        scrolls.length = 0;
        raf = requestAnimationFrame(tick);
    };

    const kit: Kit = { scene, geometry, material, shadowTexture, wake };

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const actors: Actor[] = [];
    document.querySelectorAll<HTMLElement>("[data-berry]").forEach((el) => {
        switch (el.dataset.berry) {
            case "hero":
                actors.push(new Mascot(el, kit));
                break;
            case "offer":
                actors.push(new Topper(el, kit));
                break;
            case "process":
                actors.push(new Roller(el, kit));
                break;
        }
    });

    // ---- the canvas: in the host of the berry on screen, sized to just that berry
    const root = document.documentElement;
    const view: View = { left: 0, top: 0, w: 1, h: 1 };
    const size = { w: 0, h: 0, ratio: 0 };
    const spot = { x: NaN, y: NaN };

    const place = (p: Placement) => {
        if (canvas.parentElement !== p.host) p.host.appendChild(canvas);
        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        const ratio = Math.max(1, Math.min(dpr, Math.floor(Math.sqrt(MAX_PIXELS / (p.w * p.h)) * 4) / 4));
        if (p.w !== size.w || p.h !== size.h || ratio !== size.ratio) {
            size.w = p.w;
            size.h = p.h;
            size.ratio = ratio;
            renderer.setDrawingBufferSize(p.w, p.h, ratio);
            canvas.style.width = `${p.w}px`;
            canvas.style.height = `${p.h}px`;
        }
        if (p.x !== spot.x || p.y !== spot.y) {
            spot.x = p.x;
            spot.y = p.y;
            canvas.style.transform = `translate(${p.x}px, ${p.y}px)`;
        }
        // the camera frames the whole viewport; render just the part the canvas covers right now
        camera.position.set(0, 0, view.h / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
        camera.near = camera.position.z * 0.2;
        camera.far = camera.position.z * 3;
        camera.setViewOffset(view.w, view.h, p.rect.left + p.x - view.left, p.rect.top + p.y - view.top, p.w, p.h);
    };

    // Two berries in view at once (on wide screens the end of the track and the offer card can be, and both then
    // scroll with the page): one canvas covering both, laid out on the document itself — its containing block is the
    // initial one, which sits at the document's origin. Snapped to a coarse grid so small moves don't resize it.
    const GRID = 32;
    const coverAll = (ps: Placement[], scrollX: number, scrollY: number): Placement => {
        let x0 = Infinity;
        let y0 = Infinity;
        let x1 = -Infinity;
        let y1 = -Infinity;
        for (const p of ps) {
            x0 = Math.min(x0, p.rect.left + p.x + scrollX);
            y0 = Math.min(y0, p.rect.top + p.y + scrollY);
            x1 = Math.max(x1, p.rect.left + p.x + p.w + scrollX);
            y1 = Math.max(y1, p.rect.top + p.y + p.h + scrollY);
        }
        const x = Math.floor(x0 / GRID) * GRID;
        const y = Math.floor(y0 / GRID) * GRID;
        const w = Math.ceil((x1 - x) / GRID) * GRID;
        const h = Math.ceil((y1 - y) / GRID) * GRID;
        return { host: document.body, rect: new DOMRect(-scrollX, -scrollY, 0, 0), x, y, w, h, busy: ps.some((p) => p.busy) };
    };

    const pointer: PointerState = { x: -1e4, y: -1e4, inside: false, fine: false };
    const onPointerMove = (e: PointerEvent) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.inside = true;
        pointer.fine = e.pointerType === "mouse" || e.pointerType === "pen";
        wake();
    };
    const onPointerOut = (e: PointerEvent) => {
        if (!e.relatedTarget) pointer.inside = false;
    };

    let scrollV = 0;
    const start = performance.now();
    function tick(now: number) {
        raf = 0;
        const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
        last = now;
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        scrolls.push({ t: now, y: scrollY });
        while (scrolls.length > 2 && now - scrolls[1].t >= 100) scrolls.shift();
        const span = now - scrolls[0].t;
        const speed = span > 0 ? ((scrollY - scrolls[0].y) / span) * 1000 : 0;
        if (dt > 0) scrollV = damp(scrollV, clamp(speed, -6000, 6000), 8, dt);
        view.w = Math.max(1, root.clientWidth);
        view.h = Math.max(1, root.clientHeight);

        const frame: Frame = { t: (now - start) / 1000, dt, view, pointer, scrollV, reduced: motion.matches };
        // layout reads first: draw the berries in view, or else one that is just outside (it may still peek in)
        const near = actors.map((a) => a.measure(frame));
        const drawn = near.includes(2) ? actors.filter((_, i) => near[i] === 2) : actors.filter((_, i) => near[i] === 1).slice(0, 1);
        actors.forEach((a) => drawn.includes(a) || a.hide());

        let active = Math.abs(scrollV) > 5;
        const placements = drawn.flatMap((a) => {
            const p = a.update(frame);
            if (!p) a.hide();
            return p ? [p] : [];
        });
        if (placements.length) {
            place(placements.length === 1 ? placements[0] : coverAll(placements, scrollX, scrollY));
            renderer.render(scene, camera);
            active ||= placements.some((p) => p.busy);
        } else {
            canvas.remove();
        }
        if (active) raf = requestAnimationFrame(tick);
    }

    const onContextLost = (e: Event) => {
        e.preventDefault();
        cancelAnimationFrame(raf);
        raf = 0;
        canvas.remove();
        onLost();
    };

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut);
    canvas.addEventListener("webglcontextlost", onContextLost);
    motion.addEventListener("change", wake);
    wake();

    return {
        dispose() {
            disposed = true;
            cancelAnimationFrame(raf);
            canvas.remove();
            window.removeEventListener("scroll", wake);
            window.removeEventListener("resize", wake);
            window.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("pointerout", onPointerOut);
            canvas.removeEventListener("webglcontextlost", onContextLost);
            motion.removeEventListener("change", wake);
            actors.forEach((a) => a.dispose());
            geometry.dispose();
            material.map?.dispose();
            material.roughnessMap?.dispose();
            material.dispose();
            shadowTexture.dispose();
            envMap.dispose();
            renderer.dispose();
        },
    };
}
