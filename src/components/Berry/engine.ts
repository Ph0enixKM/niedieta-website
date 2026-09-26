import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// One fixed, transparent canvas renders every blueberry on the page. Each berry is an "actor"
// bound to a DOM anchor (`[data-berry="hero|process|offer"]`) and re-reads the anchor's rect
// every frame, so layout stays in CSS and the 3D layer simply follows it.
//
// World units are CSS pixels: the camera is placed so that the z = 0 plane maps 1:1 to the viewport,
// origin in the viewport centre, y pointing up.

const MODEL_URL = "/models/blueberry.glb";
/** Model space: the body radius is 1 and the berry's bottom sits at y = -BOTTOM. */
const BOTTOM = 0.89;
const FOV = 22;
/** Process track (wide layouts): how far above step 1 the berry starts its drop, in CSS px. */
const DROP_H = 110;

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

interface Actor {
    /** Returns true while the actor needs more frames (on screen or still moving). */
    update(frame: Frame): boolean;
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
    private state: "waiting" | "intro" | "idle" = "waiting";
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

    private hide() {
        this.group.visible = false;
        this.shadow.visible = false;
    }

    update(f: Frame) {
        const r = this.el.getBoundingClientRect();
        const R = r.width / 2;
        if (R <= 0 || !onScreen(r, f.view, R * 2)) {
            this.hide();
            return false;
        }

        if (this.state === "waiting") {
            // only drop in once the landing spot is actually in view
            if (!onScreen(r, f.view, -R * 0.5)) {
                this.hide();
                return false;
            }
            if (f.reduced) {
                this.state = "idle";
            } else {
                this.state = "intro";
                this.y = r.top + r.height / 2 - f.view.top + R * 2.4;
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
        return true;
    }

    dispose() {
        this.group.removeFromParent();
        disposeShadow(this.shadow);
    }
}

// ------------------------------------------------------------------ berry sitting on the featured offer card

class Topper implements Actor {
    private group = new THREE.Group();
    private berry: THREE.Mesh;
    private shadow: THREE.Mesh;
    private host: HTMLElement | null;
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
        this.berry = new THREE.Mesh(kit.geometry, kit.material);
        this.group.add(this.berry);
        this.group.visible = false;
        kit.scene.add(this.group);
        this.shadow = makeShadow(kit, 0.34);
        this.host = el.closest<HTMLElement>("[data-berry-host]");
        this.host?.addEventListener("pointerenter", this.hop);
    }

    private hop = () => {
        if (this.airborne) return;
        this.vy = 7.2 * (this.el.getBoundingClientRect().width / 2);
        this.airborne = true;
        this.squashV -= 1.6;
        this.kit.wake();
    };

    update(f: Frame) {
        const r = this.el.getBoundingClientRect();
        const R = r.width / 2;
        if (R <= 0 || !onScreen(r, f.view, R * 3)) {
            this.group.visible = false;
            this.shadow.visible = false;
            return false;
        }
        const dt = f.dt;

        if (!f.reduced) {
            this.nextHop -= dt;
            if (this.nextHop <= 0) {
                this.nextHop = 5 + Math.random() * 5;
                this.hop();
            }
        }

        if (this.airborne) {
            this.vy -= 32 * R * dt;
            this.y += this.vy * dt;
            if (this.y <= 0) {
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
        toWorld(cx, r.bottom, f.view, this.v);
        const groundY = this.v.y;
        this.group.position.set(this.v.x, groundY + BOTTOM * R * sy + this.y, 0);
        this.group.scale.set(R * sxz, R * sy, R * sxz);
        composeOrientation(this.berry.quaternion, this.spin, 0.38, this.lookX, this.lookY);
        this.group.visible = true;

        const lift = clamp(this.y / (R * 2), 0, 1);
        this.shadow.position.set(this.v.x + R * 0.04, groundY + R * 0.02, -R);
        this.shadow.scale.set(R * 1.9 * (1 - lift * 0.4), R * 0.3 * (1 - lift * 0.3), 1);
        (this.shadow.material as THREE.MeshBasicMaterial).opacity = 0.36 * (1 - lift * 0.6);
        this.shadow.visible = true;
        return true;
    }

    dispose() {
        this.host?.removeEventListener("pointerenter", this.hop);
        this.group.removeFromParent();
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

/**
 * Wide layouts: the berry rolls along the track and hops from station to station.
 * Narrow layouts ("follow"): there's no room for that, so it glides centred on the line, spinning gently.
 */
class Roller implements Actor {
    private group = new THREE.Group();
    private berry: THREE.Mesh;
    private shadow: THREE.Mesh;
    private s = 0;
    private spin = 0;
    private primed = false;
    private config: TrackConfig | null = null;
    private reached: boolean[] = [];
    private endReached = false;
    private lastTrail = -1;
    private v = new THREE.Vector3();
    private q = new THREE.Quaternion();

    constructor(private el: HTMLElement, kit: Kit) {
        this.berry = new THREE.Mesh(kit.geometry, kit.material);
        this.group.add(this.berry);
        this.group.visible = false;
        kit.scene.add(this.group);
        this.shadow = makeShadow(kit, 0.3);
        el.setAttribute("data-live", "");
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

    update(f: Frame) {
        const path = this.el.querySelector<SVGPathElement>("[data-berry-track]");
        const cfg = this.readConfig();
        const r = this.el.getBoundingClientRect();
        if (!path || !cfg || !onScreen(r, f.view, 240)) {
            this.group.visible = false;
            this.shadow.visible = false;
            return false;
        }
        const svg = path.ownerSVGElement!;
        const sr = svg.getBoundingClientRect();
        const L = path.getTotalLength();
        const R = cfg.radius;
        const keys = [0, ...cfg.stations, L];
        const follow = cfg.mode === "follow";

        // where the scroll says the berry should be
        let target = 0;
        if (follow) {
            const aim = f.view.top + f.view.h * 0.55;
            let lo = 0;
            let hi = L;
            for (let i = 0; i < 16; i++) {
                const mid = (lo + hi) / 2;
                if (sr.top + path.getPointAtLength(mid).y < aim) lo = mid;
                else hi = mid;
            }
            target = lo;
        } else {
            let p: number;
            if (cfg.mode === "pin") {
                const wrap = this.el.closest<HTMLElement>("[data-berry-scroll]")?.getBoundingClientRect() ?? r;
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

        if (!this.primed || f.reduced) {
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
        const pt = path.getPointAtLength(at);
        const a = path.getPointAtLength(Math.max(0, at - 1));
        const b = path.getPointAtLength(Math.min(L, at + 1));
        let tx = b.x - a.x;
        let ty = b.y - a.y;
        const tl = Math.hypot(tx, ty) || 1;
        tx /= tl;
        ty /= tl;
        // normal pointing "up" relative to the direction of travel (screen space, y down)
        const nx = ty;
        const ny = -tx;

        const contactX = sr.left + pt.x;
        const contactY = sr.top + pt.y;
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
            // rolling without slipping: angle = distance / radius, clockwise in screen space
            this.q.setFromAxisAngle(AXIS_Z, -s / (R * 0.95));
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
        // the gliding berry keeps spinning; a settled roller lets the loop sleep until the next scroll
        return (follow && !f.reduced) || Math.abs(target - this.s) > 0.2;
    }

    dispose() {
        this.el.removeAttribute("data-live");
        this.group.removeFromParent();
        disposeShadow(this.shadow);
    }
}

// ------------------------------------------------------------------ engine

export async function createBerryEngine(canvas: HTMLCanvasElement, onLost: () => void): Promise<BerryEngine> {
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.02;

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
    const wake = () => {
        if (disposed || raf) return;
        last = performance.now();
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

    const view: View = { left: 0, top: 0, w: 1, h: 1 };
    const measure = () => {
        const rect = canvas.getBoundingClientRect();
        view.left = rect.left;
        view.top = rect.top;
        view.w = Math.max(1, rect.width);
        view.h = Math.max(1, rect.height);
        renderer.setSize(view.w, view.h, false);
        camera.aspect = view.w / view.h;
        camera.position.set(0, 0, view.h / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
        camera.near = camera.position.z * 0.2;
        camera.far = camera.position.z * 3;
        camera.updateProjectionMatrix();
    };
    measure();

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

    let lastScrollY = window.scrollY;
    let scrollV = 0;
    const start = performance.now();
    function tick(now: number) {
        raf = 0;
        const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
        last = now;
        const scrollY = window.scrollY;
        if (dt > 0) scrollV = damp(scrollV, clamp((scrollY - lastScrollY) / dt, -6000, 6000), 8, dt);
        lastScrollY = scrollY;

        const frame: Frame = { t: (now - start) / 1000, dt, view, pointer, scrollV, reduced: motion.matches };
        let active = Math.abs(scrollV) > 5;
        for (const actor of actors) active = actor.update(frame) || active;
        renderer.render(scene, camera);
        if (active) raf = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(() => {
        measure();
        wake();
    });
    ro.observe(canvas);

    const onContextLost = (e: Event) => {
        e.preventDefault();
        cancelAnimationFrame(raf);
        raf = 0;
        onLost();
    };

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut);
    canvas.addEventListener("webglcontextlost", onContextLost);
    motion.addEventListener("change", wake);
    wake();

    return {
        dispose() {
            disposed = true;
            cancelAnimationFrame(raf);
            ro.disconnect();
            window.removeEventListener("scroll", wake);
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
