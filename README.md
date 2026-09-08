# NFC Retail — Landing `/fr/visibilite`

Landing page d'acquisition France pour NFC Retail : promesse de visibilité
(Google, ChatGPT, moteurs IA), formulaire de diagnostic en 2 étapes (modale),
tracking funnel. Construite en **Next.js (App Router)** pour un rendu
pré-généré, indexable et rapide.

Le design de référence est le canvas fourni (`*.dc.html`) : hero centré avec
anneaux de logos en orbite + aperçu produit, formulaire en **modale**
(centrée au desktop, bottom-sheet au mobile), footer.

## Stack

- **Next.js 16 + React 19 + TypeScript**, export statique (`output: 'export'`).
- **Tailwind CSS v4** (via `@tailwindcss/postcss`) + tokens dans `app/globals.css`.
- Polices auto-hébergées via `next/font` : **Space Grotesk** (titres) +
  **Public Sans** (texte).
- **Vitest** (unitaires `lib/` + `server/`) + **Playwright** (E2E `e2e/`).
- **API leads incluse** : `server/` (Node/Express). Reçoit le POST du
  formulaire, l'envoie au CRM France, garde une copie locale. Voir
  `deploy/DEPLOYMENT.md`.

## Démarrage

```bash
npm install
cp .env.example .env.local     # puis renseigner NEXT_PUBLIC_API_BASE_URL si besoin
npm run dev                     # http://localhost:3000/fr/visibilite
```

Sans `NEXT_PUBLIC_API_BASE_URL`, le formulaire affiche son message d'erreur à
la soumission (aucune API à contacter). Pour tester le parcours complet en
local, pointer la variable sur l'API Symfony ou un mock.

## Scripts

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de dev Next |
| `npm run build` | Export statique → `out/` |
| `npm start` | (non applicable en export — servir `out/` avec un serveur statique) |
| `npm run lint` | Oxlint |
| `npm test` | Tests unitaires (Vitest) |
| `npm run test:e2e` | Tests E2E (Playwright — voir `e2e/README.md`) |

## Structure

```
app/                     Routes (App Router) + metadata/SEO, robots.ts, sitemap.ts
  fr/visibilite/         La landing (+ /merci, pages légales sous /fr/)
components/
  landing/               Header, Hero, OrbitField, ProductPreview, Footer, LandingClient
  modal/                 LeadModal (+ étapes 1/2, StepProgress)
  form/                  TextField, Honeypot
  consent/               ConsentBanner (gate analytics first-party)
content/fr.ts            Tout le texte FR (source unique)
hooks/useLeadForm.ts     État + validation + soumission du formulaire
lib/
  api.ts                 POST du lead vers l'API Symfony (contrat à confirmer — voir le TODO en tête)
  tracking.ts / ga4.ts   dataLayer + GA4 (chargé après consentement)
  utm.ts                 Capture UTM / click-ids (sessionStorage)
  validation.ts / phone.ts / url.ts
  seo.ts / paths.ts
```

## Configuration

Variables `NEXT_PUBLIC_*` (inlinées dans le bundle — jamais de secret) :

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Base de l'API Symfony. Le client POST sur `${base}/fr/visibilite/lead`. |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | ID GA4 (`G-XXXX`). Vide = GA4 non chargé. |

`.env.production` (committé) porte les valeurs de build prod.

## SEO

- Rendu pré-généré : `<title>`, `<meta description>`, `<link canonical>`,
  `robots`, OpenGraph/Twitter et JSON-LD (`Organization` + `WebSite`) sont dans
  le HTML statique.
- `robots.txt` et `sitemap.xml` générés (`app/robots.ts`, `app/sitemap.ts`).
- `/fr/visibilite` est en `index, follow` ; `/merci` et les pages légales en
  `noindex`.
- `og-image.png` est un **placeholder** — à remplacer par un vrai visuel 1200×630.

## Déploiement

Guide complet pas-à-pas : **`deploy/DEPLOYMENT.md`**.

En bref :
- **Landing** : `next build` → `out/` (statique) servi par **Cloudflare Pages** ;
  un **Cloudflare Worker** route `nfcretail.com/fr/*` (+ `/assets`, `/_next`,
  `robots.txt`, `sitemap.xml`) vers Pages et le reste vers WordPress.
- **API** (`server/`) : app **Node.js sur Hostinger** (hPanel), sur
  `api.nfcretail.com`. Build du bundle : `bash deploy/build-api-bundle.sh`.

Dev local des deux : `npm run dev:all` (front `:3000` + API `:3001`).

## À faire avant la production

- Confirmer le contrat de l'API Symfony (chemin, auth, réponse, idempotence
  `submissionId`) et brancher `lib/api.ts`.
- Rédiger et faire valider les pages **Mentions légales** et **Politique de
  confidentialité** (placeholders aujourd'hui).
- Fournir un vrai `og-image.png`.
- Renseigner `NEXT_PUBLIC_GA4_MEASUREMENT_ID` et la copie du bandeau de
  consentement (revue juridique).
