import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** @type {import('next').NextConfig} */
const nextConfig = {
    // lets phones on the local network use `next dev` (hot reload and hydration) whatever address the router hands
    // out; each * stands for one part of the IP. Dev-only
    allowedDevOrigins: ["192.168.*.*"],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'github.com',
            },
        ],
    },
};

export default nextConfig;

// gives `next dev` access to the Cloudflare bindings from wrangler.jsonc
initOpenNextCloudflareForDev();
