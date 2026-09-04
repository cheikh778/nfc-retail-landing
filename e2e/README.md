# E2E tests

Covers the 4 scenarios from the brief (§44):

| File | Scenario |
| --- | --- |
| `happy-path.spec.ts` | Landing → CTA → step 1 → step 2 → submit → confirmation |
| `utm-attribution.spec.ts` | UTM params on the landing URL reach the submitted lead, and survive a reload |
| `form-validation.spec.ts` | Invalid input → inline errors → correction → success |
| `mobile.spec.ts` | Mobile viewport: no horizontal overflow, sticky CTA show/hide, full flow |

## Running

```bash
cp server/.env.example server/.env   # fill in CSRF_SECRET at minimum
npm run test:e2e
```

Playwright starts both dev servers itself (`playwright.config.ts`'s `webServer`
entries) and reuses them if they're already running.

## Why `data-testid` instead of `getByRole`/`getByLabel`

Locators are hooked to `data-testid` attributes on form fields and key CTAs
rather than accessibility-tree-based queries. This isn't a style preference —
`getByRole`/`getByLabel` reliably hang mid-poll in this project's dev sandbox
specifically right after the step 1 → step 2 re-render (confirmed via
Playwright's own `error-context.md` ARIA snapshot: the target field is present
and correctly named, so the element itself is fine; the accessibility-tree
query round-trip is just too slow/flaky in that environment). `getByRole`
for one-off checks (headings, the confirmation message) and `getByText` are
fine and used where convenient — the swap to `data-testid` is scoped to the
fields that get filled in rapid succession. Elsewhere (a normal machine or
CI), this is unlikely to matter either way; `data-testid` is standard
Playwright practice regardless and doesn't hurt.

## Sandbox-only environment flags

Both are opt-in via `PLAYWRIGHT_CHROMIUM_PATH`, set only when developing
inside this project's containerized dev sandbox — unset on a normal machine
or CI, where Playwright manages its own browser download as usual:

```bash
PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium \
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
npm run test:e2e
```

- `executablePath` — points at the sandbox's pre-installed Chromium instead
  of downloading one.
- `--no-sandbox` — the sandbox container runs as root, and Chromium refuses
  to launch as root without it.

`mobile.spec.ts` uses a plain `viewport` override rather than a full
`devices['iPhone 13']` emulation preset: full device emulation (touch,
mobile UA, etc.) failed to launch in this sandbox even with the two flags
above, while a plain viewport resize — which is what §25/§44's mobile
scenario actually cares about — works reliably.
