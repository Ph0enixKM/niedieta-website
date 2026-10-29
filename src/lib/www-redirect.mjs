const WWW_HOST = "www.niedieta.pl";
const APEX_ORIGIN = "https://niedieta.pl";

/**
 * Permanent redirect from https://www.niedieta.pl/* to https://niedieta.pl/*.
 * Path and query string are copied from the request URL. Any other host, including the apex, returns null.
 *
 * @param {Request} request
 * @returns {Response | null}
 */
export function redirectWwwToApex(request) {
    const url = new URL(request.url);
    if (url.hostname.toLowerCase() !== WWW_HOST) return null;

    // Concatenate instead of resolving against a base URL. A path of `//host`
    // would otherwise be parsed as a scheme-relative URL and leave this site.
    const location = `${APEX_ORIGIN}${url.pathname}${url.search}`;
    return Response.redirect(location, 308);
}
