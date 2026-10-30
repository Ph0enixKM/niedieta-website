"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Reels.module.css";

// how far ahead of the viewport a reel starts loading
const LOAD_AHEAD = "300px";

/** Instagram's player for one reel. Nothing is requested from Instagram until the frame nears the viewport. */
export default function ReelEmbed({ id, title }: { id: string; title: string }) {
    const frameRef = useRef<HTMLDivElement>(null);
    const [near, setNear] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const frame = frameRef.current;
        if (!frame) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setNear(true);
                io.disconnect();
            },
            { rootMargin: LOAD_AHEAD },
        );
        io.observe(frame);
        return () => io.disconnect();
    }, []);

    return (
        <div ref={frameRef} className={styles.frame} data-loaded={loaded || undefined}>
            {near && (
                <iframe
                    src={`https://www.instagram.com/reel/${id}/embed/`}
                    title={`Rolka na Instagramie: ${title}`}
                    loading="lazy"
                    allow="encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={() => setLoaded(true)}
                />
            )}
        </div>
    );
}
