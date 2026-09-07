/**
 * nfcretail.com edge router.
 *
 * One hostname, two origins:
 *   - the React landing on Cloudflare Pages  -> /fr/*, /ma/*, /sn/* and /assets, /favicon
 *   - the existing WordPress site (Hostinger) -> everything else (/, /wp-admin, posts, ...)
 *
 * WordPress is never touched: it keeps serving the apex as today. This Worker
 * sits in front and only peels off the paths that belong to the landing.
 *
 * Deploy:  cd deploy/cloudflare-worker && npx wrangler deploy
 * (or let .github/workflows/ci.yml do it on push to main)
 */

// Your Pages project's *.pages.dev host (Pages dashboard -> project -> "Domains").
const PAGES_HOST = 'nfcretail-web.pages.dev';

// Paths owned by the landing. Keep the market list in sync with
// SUPPORTED_MARKETS (src/lib/routes.ts). `/assets/` covers both the hashed
// build output and public/assets/landing/*. Adjust if the WordPress theme
// ever serves something from `/assets/` at the root.
const SPA_PATH = /^\/(fr|ma|sn)(\/|$)|^\/assets\/|^\/favicon\.svg$/;

export default {
  /** @param {Request} request */
  async fetch(request) {
    const url = new URL(request.url);

    // Canonical host: www -> apex, so there is a single origin for CORS/cookies.
    if (url.hostname === 'www.nfcretail.com') {
      url.hostname = 'nfcretail.com';
      return Response.redirect(url.toString(), 301);
    }

    if (SPA_PATH.test(url.pathname)) {
      const target = new URL(url.pathname + url.search, `https://${PAGES_HOST}`);
      // Reuse method/headers/body. Pages returns index.html (HTTP 200) for
      // unknown client-side routes via public/_redirects.
      return fetch(new Request(target, request));
    }

    // Fall through to the zone's origin server = WordPress on Hostinger.
    // A Worker's fetch() for its own route goes to the origin, not back to
    // the Worker, so this does not loop.
    return fetch(request);
  },
};
