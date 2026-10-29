import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Lighthouse flags first-party JS over 500KB with no source map (the 3D berry chunk is about 620KB).
    // This writes a map for every browser chunk, not just that one. Maps sit beside the scripts and
    // are only requested when DevTools is open.
    productionBrowserSourceMaps: true,
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
