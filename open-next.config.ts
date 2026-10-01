import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Every page is prerendered at build time and nothing revalidates, so the prerendered HTML is served
// straight from Workers static assets (no R2/KV needed).
export default {
    ...defineCloudflareConfig({
        incrementalCache: staticAssetsIncrementalCache,
        enableCacheInterception: true,
    }),
    // `npm run build` runs OpenNext (so Workers Builds' default build command produces the Worker), so OpenNext
    // must call Next directly instead of `npm run build`, which would recurse
    buildCommand: "npx next build",
};
