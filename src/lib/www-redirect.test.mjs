import assert from "node:assert/strict";
import test from "node:test";
import { redirectWwwToApex } from "./www-redirect.mjs";

function locationOf(url, method = "GET") {
    const response = redirectWwwToApex(new Request(url, { method }));
    assert.ok(response, `expected a redirect for ${url}`);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), expectedLocation(url));
    return response.headers.get("location");
}

function expectedLocation(url) {
    const parsed = new URL(url);
    return `https://niedieta.pl${parsed.pathname}${parsed.search}`;
}

test("redirects www requests to the apex and keeps path and query", () => {
    locationOf("https://www.niedieta.pl/");
    locationOf("https://www.niedieta.pl/calculator");
    locationOf("https://www.niedieta.pl/calculator/");
    locationOf("https://www.niedieta.pl/calculator?a=1&b=2");
    locationOf("https://www.niedieta.pl/calculator?q=hello%20world");
    locationOf("https://www.niedieta.pl/og.jpg");
    locationOf("https://www.niedieta.pl/_next/static/chunks/app.js?dpl=1");
    locationOf("http://www.niedieta.pl/robots.txt");
    locationOf("https://WWW.NIEDIETA.PL/sitemap.xml");
});

test("a scheme-relative path stays on the apex", () => {
    const response = redirectWwwToApex(new Request("https://www.niedieta.pl//evil.com"));
    assert.equal(response?.status, 308);
    assert.equal(response?.headers.get("location"), "https://niedieta.pl//evil.com");
});

test("308 preserves the method", () => {
    const response = redirectWwwToApex(new Request("https://www.niedieta.pl/calculator", { method: "POST" }));
    assert.equal(response?.status, 308);
    assert.equal(response?.headers.get("location"), "https://niedieta.pl/calculator");
});

test("apex and other hosts are not redirected", () => {
    for (const url of [
        "https://niedieta.pl/",
        "https://niedieta.pl/calculator?a=1",
        "https://niedieta.pl/_next/static/chunks/app.js",
        "http://localhost:3000/",
        "http://127.0.0.1:8787/og.jpg",
        "https://notwww.niedieta.pl/",
        "https://www.niedieta.pl.evil.example/",
    ]) {
        assert.equal(redirectWwwToApex(new Request(url)), null, url);
    }
});
