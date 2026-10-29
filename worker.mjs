import nextWorker from "./.open-next/worker.js";
import { redirectWwwToApex } from "./src/lib/www-redirect.mjs";

// www.niedieta.pl is a Worker custom domain. Redirect Rules aren't available on this zone,
// and Next.js redirects skip /_next, so the host check lives here, ahead of OpenNext.
export default {
    async fetch(request, env, ctx) {
        const redirect = redirectWwwToApex(request);
        if (redirect) return redirect;
        return nextWorker.fetch(request, env, ctx);
    },
};
