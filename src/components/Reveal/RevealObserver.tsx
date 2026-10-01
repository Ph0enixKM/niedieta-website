"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal], [data-draw]";

/**
 * One observer for the whole document: marks `[data-reveal]` / `[data-draw]` elements with
 * `data-inview` the first time they scroll into view. Styles live in globals.css.
 */
export default function RevealObserver() {
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    entry.target.setAttribute("data-inview", "");
                    io.unobserve(entry.target);
                }
            },
            { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
        );

        const watch = (root: ParentNode) => {
            root.querySelectorAll(SELECTOR).forEach((el) => {
                if (!el.hasAttribute("data-inview")) io.observe(el);
            });
        };

        watch(document);
        document.documentElement.classList.add("reveal-ready");

        const mo = new MutationObserver((records) => {
            for (const record of records) {
                record.addedNodes.forEach((node) => {
                    if (!(node instanceof Element)) return;
                    if (node.matches(SELECTOR)) io.observe(node);
                    watch(node);
                });
            }
        });
        mo.observe(document.body, { childList: true, subtree: true });

        return () => {
            io.disconnect();
            mo.disconnect();
        };
    }, []);

    return null;
}
