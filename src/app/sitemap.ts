import type { MetadataRoute } from "next";

const origin = "https://niedieta.pl";

// Public HTML routes only. In-page hashes and the not-found page are not URLs.
const paths = ["/", "/calculator"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
    return paths.map((path) => ({
        url: path === "/" ? origin : `${origin}${path}`,
    }));
}
