# NFC Retail — Landing `/fr/visibilite`

Landing page d'acquisition France pour NFC Retail : promesse de visibilité
(Google, ChatGPT, moteurs IA), formulaire de diagnostic intégré,
tracking funnel. Construite en **Next.js (App Router)** pour un rendu
pré-généré, indexable et rapide.

La landing affiche la promesse et le visuel à gauche, le formulaire à droite,
puis la barre de confiance. Elle tient dans la hauteur des écrans desktop et
portable, sans footer. Sur mobile, le contenu défile avec un CTA fixe.
Le prénom est facultatif ; les autres champs du formulaire restent requis.
La gestion des cookies reste accessible dans l’en-tête ; les pages légales et
la confirmation conservent leur footer.

## Stack

- **Next.js 16 + React 19 + TypeScript**, export statique (`output: 'export'`).
- **Tailwind CSS v4** (via `@tailwindcss/postcss`) + tokens dans `app/globals.css`.
- Polices auto-hébergées via `next/font` : **Space Grotesk** (titres) +
  **Public Sans** (texte).
- **Vitest** (unitaires `lib/`) + **Playwright** (E2E `e2e/`).
- **API leads** : repo séparé **`nfcretail-api`** (Node/Express). Reçoit le POST
  du formulaire, l'envoie au CRM France, garde une copie locale. Voir
  `deploy/DEPLOYMENT.md`.

## Démarrage

```bash
npm install
cp .env.example .env.local     # puis renseigner NEXT_PUBLIC_API_BASE_URL si besoin
npm run dev                     # http://localhost:3000/fr/visibilite
```

Sans `NEXT_PUBLIC_API_BASE_URL`, le formulaire affiche son message d'erreur à
la soumission (aucune API à contacter). Pour tester le parcours complet en
local, pointer la variable sur l'API Node/Express ou un mock.

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
  api.ts                 CSRF + POST du lead vers l'API Node/Express
  tracking.ts / ga4.ts   dataLayer + GA4 (chargé après consentement)
  attribution.ts / utm.ts Attribution des leads, capture UTM/click-ids et secours
  validation.ts / phone.ts / url.ts
  seo.ts / paths.ts
```

## Configuration

Variables `NEXT_PUBLIC_*` (inlinées dans le bundle — jamais de secret) :

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Base de l'API Node/Express. Le client POST sur `${base}/api/fr/visibilite/lead`. |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | ID GA4 (`G-XXXX`). Vide = GA4 non chargé. |

`.env.production` (committé) porte les valeurs de build prod.

## Analytics et sécurité

La configuration du suivi, les événements et les réglages à effectuer dans GA4
sont documentés dans [`deploy/ANALYTICS.md`](deploy/ANALYTICS.md).
La revue de sécurité et les constats concernant l'API sont dans
[`deploy/SECURITY-REVIEW.md`](deploy/SECURITY-REVIEW.md).
L'attribution des leads, les valeurs de secours et les liens à utiliser pour
Google Ads, ChatGPT et les autres sources sont dans
[`deploy/ATTRIBUTION.md`](deploy/ATTRIBUTION.md).

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
- **API** (repo `nfcretail-api`) : app **Node.js sur Hostinger** (hPanel), sur
  `api.nfcretail.com`, déployée **par Git** (voir son `README.md`).

Dev local : `npm run dev` ici (front `:3000`) + `npm run dev` dans un clone de
`nfcretail-api` (API `:3001`).

## À faire avant la production

- Rédiger et faire valider les pages **Mentions légales** et **Politique de
  confidentialité** (placeholders aujourd'hui).
- Fournir un vrai `og-image.png`.
- Finaliser les réglages du flux GA4 décrits dans `deploy/ANALYTICS.md` ;
  l'identifiant de production et le bandeau de consentement sont configurés.
