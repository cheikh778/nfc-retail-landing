# E2E tests

| File | Scenario |
| --- | --- |
| `happy-path.spec.ts` | Landing → CTA → modal step 1 → step 2 → submit → `/merci`; honeypot short-circuit |
| `utm-attribution.spec.ts` | UTM params on the landing URL reach the submitted lead, and survive a param-less revisit |
| `form-validation.spec.ts` | Invalid input → inline errors → correction → success; consent gate; API-failure retry message |
| `mobile.spec.ts` | Mobile viewport: no horizontal overflow, bottom-sheet modal, full flow |

## The lead API is stubbed

The real lead API lives in a **separate Symfony repo**. Specs intercept the
request with `page.route('**/fr/visibilite/lead')` (`stubLeadApi` in
`helpers.ts`) — nothing leaves the browser. `playwright.config.ts` sets
`NEXT_PUBLIC_API_BASE_URL` to a dummy absolute URL so `lib/api.ts` builds a
well-formed request that the route handler then catches.

## Running

```bash
npm run test:e2e
```

Playwright starts `next dev` itself (`playwright.config.ts` → `webServer`) and
reuses a running one outside CI.

## Sandbox-only environment flags

Opt-in via `PLAYWRIGHT_CHROMIUM_PATH`, set only inside this project's
containerized dev sandbox — unset on a normal machine or CI, where Playwright
manages its own browser:

```bash
PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium \
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
npm run test:e2e
```

- `executablePath` — the sandbox's pre-installed Chromium instead of a download.
- `--no-sandbox` — the container runs as root; Chromium refuses to launch as
  root without it.

Tests run with `reducedMotion: 'reduce'` so the modal's idle "breathe"
animation doesn't make elements register as unstable mid-poll.
