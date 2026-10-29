import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Lighthouse flags first-party JS over 500KB with no source map. The 3D berry chunk is about
    // 620KB. Maps sit beside the scripts and are not requested on a normal page load.
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
