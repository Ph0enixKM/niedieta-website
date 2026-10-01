"use client";

import { useEffect, useState } from "react";
import { ArIcon } from "@/components/Icons/Icons";
import styles from "./Footer.module.css";

type Platform = "ios" | "android" | null;

/**
 * "Put the berry on your desk": AR Quick Look on iOS, Scene Viewer on Android.
 * Rendered only where AR is actually available.
 */
export default function ArLink() {
    const [platform, setPlatform] = useState<Platform>(null);

    useEffect(() => {
        const probe = document.createElement("a");
        if (probe.relList?.supports?.("ar")) setPlatform("ios");
        else if (/android/i.test(navigator.userAgent)) setPlatform("android");
    }, []);

    if (platform === "ios") {
        // Quick Look requires the anchor's only child to be an image; the label comes from CSS.
        return (
            <a rel="ar" href="/models/blueberry.usdz" className={styles.ar} data-label="Postaw borówkę u siebie (AR)">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/berry-96.webp" alt="Borówka NieDiety w rozszerzonej rzeczywistości" width={36} height={36} />
            </a>
        );
    }

    if (platform === "android") {
        const origin = window.location.origin;
        const href =
            `intent://arvr.google.com/scene-viewer/1.0?file=${origin}/models/blueberry-ar.glb&mode=ar_preferred&title=NieDieta` +
            `#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;` +
            `S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`;
        return (
            <a href={href} className={styles.arAndroid}>
                <ArIcon />
                Postaw borówkę u siebie (AR)
            </a>
        );
    }

    return null;
}
