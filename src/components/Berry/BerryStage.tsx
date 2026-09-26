"use client";

import { useEffect, useRef } from "react";
import styles from "./Berry.module.css";

function supportsWebGL() {
    try {
        const canvas = document.createElement("canvas");
        return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
        return false;
    }
}

/**
 * Mounts the fixed 3D layer. three.js and the model load lazily after hydration;
 * when WebGL is unavailable the static berry images inside each BerrySlot are shown instead.
 */
export default function BerryStage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const html = document.documentElement;
        const canvas = canvasRef.current;
        let cancelled = false;
        let dispose: (() => void) | undefined;

        const fallback = () => {
            html.classList.remove("berry-live");
            html.classList.add("berry-fallback");
        };

        if (!canvas || !supportsWebGL()) {
            fallback();
            return;
        }

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

    return <canvas ref={canvasRef} className={styles.stage} aria-hidden="true" />;
}
