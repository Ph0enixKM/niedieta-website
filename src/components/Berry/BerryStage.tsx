"use client";

import { useEffect } from "react";
import styles from "./Berry.module.css";

function supportsWebGL() {
    try {
        const gl = document.createElement("canvas").getContext("webgl2") ?? document.createElement("canvas").getContext("webgl");
        // browsers cap live contexts; don't keep the probe around
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
        return !!gl;
    } catch {
        return false;
    }
}

/**
 * Starts the 3D berries. three.js and the model load lazily after hydration; the engine then moves its canvas into
 * the BerrySlot (or track) of whichever berry is on screen. When WebGL is unavailable the static berry images inside
 * each BerrySlot are shown instead.
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

        if (!supportsWebGL()) {
            fallback();
            return;
        }

        const canvas = document.createElement("canvas");
        canvas.className = styles.stage;
        canvas.setAttribute("aria-hidden", "true");

        import("./engine")
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
                console.warn("NieDieta: 3D berries unavailable", error);
                if (!cancelled) fallback();
            });

        return () => {
            cancelled = true;
            dispose?.();
            html.classList.remove("berry-live", "berry-fallback");
        };
    }, []);

    return null;
}
