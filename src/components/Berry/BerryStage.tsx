"use client";

import { useEffect } from "react";
import styles from "./Berry.module.css";

// Software rasterisers draw WebGL on the CPU: every berry frame then costs ~100 ms of main thread, which freezes
// the page on machines without a usable GPU (and is what Lighthouse's headless Chrome runs on).
const SOFTWARE_GL = /swiftshader|llvmpipe|softpipe|software|basic render driver/i;

/** Whether the device has hardware-accelerated WebGL. Software rendering counts as no WebGL. */
function hasFastWebGL() {
    try {
        const attrs: WebGLContextAttributes = { failIfMajorPerformanceCaveat: true };
        const canvas = document.createElement("canvas");
        const gl = (canvas.getContext("webgl2", attrs) ?? canvas.getContext("webgl", attrs)) as WebGLRenderingContext | null;
        if (!gl) return false;
        const info = gl.getExtension("WEBGL_debug_renderer_info");
        const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
        // browsers cap live contexts; don't keep the probe around
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return !SOFTWARE_GL.test(renderer);
    } catch {
        return false;
    }
}

/** Resolves once the page has loaded and the main thread has a quiet moment, so the 3D layer never competes with the first render. */
function afterLoadIdle(): Promise<void> {
    const loaded =
        document.readyState === "complete"
            ? Promise.resolve()
            : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
    return loaded.then(
        () =>
            new Promise<void>((resolve) => {
                if ("requestIdleCallback" in window) window.requestIdleCallback(() => resolve(), { timeout: 2000 });
                else setTimeout(resolve, 200);
            }),
    );
}

/**
 * Starts the 3D berries. three.js and the model load lazily once the page has loaded and gone idle, and only with
 * hardware-accelerated WebGL. The engine then
 * moves its canvas into the BerrySlot (or track) of whichever berry is on screen. Without fast WebGL the static berry
 * images inside each BerrySlot are shown instead.
 */
export default function BerryStage() {
    useEffect(() => {
        const html = document.documentElement;
        if (!document.querySelector("[data-berry]")) return;
        let cancelled = false;
        let dispose: (() => void) | undefined;

        const fallback = () => {
            html.classList.remove("berry-live");
            html.classList.add("berry-fallback");
        };

        if (!hasFastWebGL()) {
            fallback();
            return;
        }

        const canvas = document.createElement("canvas");
        canvas.className = styles.stage;
        canvas.setAttribute("aria-hidden", "true");

        afterLoadIdle()
            .then(() => (cancelled ? Promise.reject(new Error("cancelled")) : import("./engine")))
            .then(({ createBerryEngine }) => createBerryEngine(canvas, fallback))
            .then((engine) => {
                if (cancelled) {
                    engine.dispose();
                    return;
                }
                dispose = engine.dispose;
                html.classList.add("berry-live");
            })
            .catch((error) => {
                if (cancelled) return;
                console.warn("NieDieta: 3D berries unavailable", error);
                fallback();
            });

        return () => {
            cancelled = true;
            dispose?.();
            html.classList.remove("berry-live", "berry-fallback");
        };
    }, []);

    return null;
}
