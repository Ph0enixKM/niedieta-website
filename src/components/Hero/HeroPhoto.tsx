"use client";

import { useState } from "react";
import Image from "next/image";
import heroFull from "@/../public/hero-full.webp";
import heroSmall from "@/../public/hero.webp";
import styles from "./Hero.module.css";

/** The small photo paints first; only once it has loaded is the sharp one requested, and it fades in on top. */
export default function HeroPhoto() {
    const [smallLoaded, setSmallLoaded] = useState(false);
    const [fullLoaded, setFullLoaded] = useState(false);

    return (
        <figure className={styles.photo}>
            <Image
                src={heroSmall}
                alt="Kinga Sobańska siedzi na podłodze przy sofie, z kubkiem kawy w dłoniach"
                fill
                preload
                unoptimized
                placeholder="blur"
                onLoad={() => setSmallLoaded(true)}
            />
            {smallLoaded && (
                <Image
                    src={heroFull}
                    alt=""
                    aria-hidden="true"
                    fill
                    loading="eager"
                    sizes="(min-width: 1920px) 1152px, (min-width: 901px) 60vw, 100vw"
                    className={`${styles.full} ${fullLoaded ? styles.fullLoaded : ""}`}
                    onLoad={() => setFullLoaded(true)}
                />
            )}
        </figure>
    );
}
