import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
};

export function ArrowRight(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <path d="M4.5 12.2c4.6-.3 9.4-.2 14.6 0" />
            <path d="M13.8 6.6c1.9 2 3.6 3.8 5.4 5.6-1.9 1.8-3.6 3.6-5.3 5.5" />
        </svg>
    );
}

export function ArrowUpRight(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <path d="M7 17.2 17.1 7" />
            <path d="M8.6 6.8h8.6v8.6" />
        </svg>
    );
}

export function CalculatorIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <rect x="5" y="3" width="14" height="18" rx="3.2" />
            <rect x="8" y="6.2" width="8" height="3.6" rx="1" />
            <path d="M8.6 13.4h.01M12 13.4h.01M15.4 13.4h.01M8.6 17h.01M12 17h.01M15.4 17h.01" strokeWidth="2.4" />
        </svg>
    );
}

export function MailIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <rect x="3.2" y="5.2" width="17.6" height="13.6" rx="3" />
            <path d="m4.4 7 7.6 6 7.6-6" />
        </svg>
    );
}

export function CheckIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <path d="M5 12.8c1.7 1.2 3.2 2.7 4.4 4.6 2.6-4.9 5.6-8.6 9.6-11.3" />
        </svg>
    );
}

export function MenuIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <path d="M4 8.5h16M4 15.5h11" />
        </svg>
    );
}

export function CloseIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
        </svg>
    );
}

export function ArIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <path d="M12 3.5 19.5 7.8v8.4L12 20.5 4.5 16.2V7.8L12 3.5Z" />
            <path d="M4.8 8 12 12.2 19.2 8M12 12.2v8" />
        </svg>
    );
}

export function InstagramIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
            <circle cx="12" cy="12" r="3.9" />
            <path d="M17.2 6.9h.01" strokeWidth="2.6" />
        </svg>
    );
}

export function TikTokIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <path d="M13.6 3.8v10.9a3.3 3.3 0 1 1-3.3-3.3" />
            <path d="M13.6 3.8c.4 2.7 2.4 4.6 5.2 4.8" />
        </svg>
    );
}

export function YouTubeIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" {...base} {...props}>
            <path d="M3.4 8.1c.2-1.6 1.3-2.7 2.9-2.8 3.8-.3 7.6-.3 11.4 0 1.6.1 2.7 1.2 2.9 2.8.3 2.6.3 5.2 0 7.8-.2 1.6-1.3 2.7-2.9 2.8-3.8.3-7.6.3-11.4 0-1.6-.1-2.7-1.2-2.9-2.8-.3-2.6-.3-5.2 0-7.8Z" />
            <path d="m10.2 9.2 4.8 2.8-4.8 2.8V9.2Z" fill="currentColor" strokeWidth="1.2" />
        </svg>
    );
}

export const SOCIAL_ICONS = {
    Instagram: InstagramIcon,
    TikTok: TikTokIcon,
    YouTube: YouTubeIcon,
} as const;
