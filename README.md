# NFC Retail — Landing `/fr/visibilite`

Landing page V1 France pour NFC Retail : diagnostic de visibilité gratuit,
formulaire de lead en 2 étapes, tracking funnel, intégration CRM. Construite
en **React + TypeScript** (SPA légère, pas de Symfony) avec une petite API
Node/Express dédiée à la réception des leads.

Cahier des charges complet : voir le document fourni par l'équipe marketing
(`NFC_Retail_Landing_FR_CLAUDE_CODE_SPEC.md`). Ce README documente ce qui a
été construit, comment le faire tourner, et ce qui reste à fournir avant la
mise en production.

## Stack

- **Client** (racine du repo) : React 19 + TypeScript, Vite, React Router,
  CSS Modules (pas de Tailwind/UI kit — juste des tokens CSS `src/styles/tokens.css`).
- **Serveur** (`server/`) : Node + TypeScript + Express, Zod pour la
  validation, `csrf-csrf` pour le CSRF, `express-rate-limit`, `helmet`.
- **Tests** : Vitest (client + serveur) et Playwright (E2E, `e2e/`).

Pourquoi une petite API dédiée plutôt qu'un simple formulaire côté client :
le brief demande explicitement CSRF, validation serveur, anti-spam,
rate limiting et une intégration CRM — impossible à faire correctement sans
un backend, même minimal. Voir `server/README` (section Architecture
ci-dessous) pour le détail.

## Démarrage rapide

```bash
npm install                                # installe client + serveur (workspaces npm)
cp server/.env.example server/.env         # renseigner au moins CSRF_SECRET
npm run dev:all                            # client sur :5173, API sur :3001 (proxy /api)
```

Ouvrir `http://localhost:5173/fr/visibilite`.

Générer un `CSRF_SECRET` :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Scripts

| Commande | Effet |
| --- | --- |
| `npm run dev` | Client seul (Vite) |
| `npm run dev:server` | API seule |
| `npm run dev:all` | Les deux ensemble |
| `npm run build` | Build client (`dist/`) |
| `npm run build:server` | Build API (`server/dist/`) |
| `npm run build:all` | Les deux |
| `npm test` | Tests unitaires client (Vitest) |
| `npm run test:e2e` | Tests E2E (Playwright — voir `e2e/README.md`) |
| `npm run lint` | Oxlint |
| `npm run test` (dans `server/`) | Tests unitaires + intégration API (Vitest + supertest) |

## Architecture

```text
src/
├── content/          # Copie exacte du brief, par marché ("fr" seul en V1)
├── components/
│   ├── layout/        # Header, Footer, StickyCta
│   ├── sections/       # Hero, Journey, Automation, Faq, Proof, FinalCta
│   ├── form/           # LeadForm 2 étapes + champs réutilisables
│   └── consent/         # Bannière cookies minimale
├── pages/              # VisibilitePage, MerciPage, LegalPlaceholderPage
├── hooks/               # useLeadForm, useAnalyticsBootstrap, useDocumentMeta...
├── lib/                  # validation, tracking, UTM, api client, etc. (fonctions pures, testées)
└── App.tsx               # Routing

server/src/
├── routes/api.ts          # GET /api/csrf-token, POST /api/fr/visibilite/lead
├── controllers/            # Validation → anti-spam → LeadService
├── services/
│   ├── LeadService.ts        # CRM d'abord, fallback stockage local si échec
│   ├── LeadStore.ts            # Fichier JSON Lines (server/data/leads.jsonl)
│   └── crm/                     # CRMClient (interface) + Http/Unconfigured
├── middleware/                    # CSRF (double-submit cookie), rate limiting
└── validation/leadSchema.ts        # Zod, source de vérité serveur
```

Routes livrées, pour chaque marché (`fr`, `ma`, `sn` — voir section
Multi-marché ci-dessous) : `GET /:market/visibilite`, `GET
/:market/visibilite/merci`, `/:market/mentions-legales` et
`/:market/politique-de-confidentialite` (placeholders, voir plus bas). Seul
`fr` a du contenu réel aujourd'hui ; `ma`/`sn` retombent sur le contenu `fr`
(`content/index.ts`) tant que leur copie n'est pas prête — le routage et le
CRM, eux, sont déjà prêts pour ces marchés.

## Multi-marché (fr / ma / sn)

Le segment pays dans l'URL est la seule source de vérité pour deux choses,
et une seule et même liste des marchés supportés les pilote toutes les deux :

1. **Le contenu affiché** — `src/lib/routes.ts` (`SUPPORTED_MARKETS`,
   `normalizeMarket`) + `src/content/index.ts` (`getContent(market)`).
2. **Le CRM qui reçoit le lead** — `server/src/config/markets.ts`
   (`SUPPORTED_MARKETS`, `MARKET_CRM_CONFIG`) : `POST
   /api/:market/visibilite/lead` résout un `CrmClient` différent par marché
   (`server/src/services/crm/resolveCrmClient.ts`), avec repli local
   (`UnconfiguredCrmClient`, statut `pending`) tant qu'un marché n'a pas
   encore son CRM configuré — jamais de lead perdu, jamais de blocage du
   développement en attendant le CRM Maroc/Sénégal.

Ajouter un marché plus tard = de la config, pas du code : déclarer son code
dans les deux listes `SUPPORTED_MARKETS` (client et serveur, à garder
synchronisées) et renseigner `CRM_<CODE>_API_URL` / `_API_KEY` (+
optionnellement `_PIPELINE` / `_SOURCE`) une fois le CRM du marché prêt —
voir `server/.env.example`. Un code marché inconnu dans l'URL ne casse rien
(la page retombe sur le contenu `fr`) ; côté API, seuls les marchés déclarés
dans `SUPPORTED_MARKETS` sont acceptés (`404 unsupported_market` sinon).

### Pourquoi une SPA pour une landing "il ne faut pas sur-engineerer"

Le brief original (Symfony) demandait d'éviter une SPA inutile pour rester
simple. Le contexte a changé : l'utilisateur a explicitement demandé du
React/TypeScript. Dans ce nouveau contexte, une petite SPA Vite *est* la
version simple — pas de SSR, pas de framework full-stack, un seul écran
client-side routé sur 4 chemins. Le principe reste respecté : peu de
dépendances (pas de Redux, pas de librairie de formulaire, pas de UI kit),
CSS Modules plutôt qu'un design system complet.

## Design

Le visuel s'inspire de deux références partagées en cours de projet, jamais
recopiées telles quelles (contenu, structure de page et couleurs de marque
restent ceux du brief NFC Retail) :
- Un template "CryptoCalc" (premier jet) pour le contraste sections
  claires/sombres, les boutons pilule, les cartes flottantes et les rangées
  de type liste.
- Le template React "SecureVest" — page "home 2" (demande du 2026-09-04) —
  pour le pattern actuel : cartes sombres arrondies *contenues* dans une
  section claire (plutôt que des sections 100% sombres), en-têtes de section
  "split" (titre à gauche, paragraphe à droite), cartes numérotées avec un
  très grand chiffre en filigrane, et un mini-repère (icône qui tourne
  lentement) devant chaque eyebrow. Ce template est une référence de design
  uniquement — il n'est pas inclus dans ce dépôt (gitignored, template tiers
  acheté) et son code React n'a pas été réutilisé, seul le rendu visuel a
  servi d'inspiration, entièrement réécrit en CSS Modules avec les couleurs
  NFC Retail.
- Police : Poppins, capée à 600 (semibold) — voir "Accessibilité &
  performance" plus bas.

## CRM (brief §15 ; demande du 2026-09-04 : Web Service côté CRM)

Le Web Service de création de lead sera développé côté CRM (confirmé le
2026-09-04) : ce dépôt ne fait qu'appeler ce WS, il ne l'implémente pas.
`CRMClientInterface` (`server/src/services/crm/CrmClient.ts`) est la
frontière entre les deux, implémentée par :
- `HttpCrmClient` — POST JSON générique avec Bearer token, incluant les
  informations du formulaire, les UTM capturés à l'arrivée et le code marché
  (`market: "fr" | "ma" | "sn"`). **Le format exact n'est pas celui du futur
  WS CRM** : personne ne nous a encore donné son contrat précis ("on pourra
  voir ensemble le format du WS et les champs à transmettre"), donc rien n'a
  été inventé au-delà d'un appel HTTP raisonnable. Tout le format de requête
  est concentré dans ce seul fichier — l'adapter au vrai contrat WS n'impacte
  rien d'autre.
- `UnconfiguredCrmClient` — utilisée tant qu'un marché n'a pas de CRM
  configuré (`CRM_<CODE>_API_URL`/`_API_KEY` vides). Le lead est alors stocké
  en local (`server/data/leads.jsonl`, statut `pending`) et ne bloque jamais
  le visiteur — voir `LeadService.ts`. Un lead `pending` peut être rejoué
  vers le CRM plus tard une fois le WS branché (le fichier garde toutes les
  informations nécessaires, `market` inclus).

Voir aussi "Multi-marché" ci-dessus pour comment le marché décide du CRM
cible.

## Tracking (brief §17-19, §41-42)

- `window.NFCTracking.track(event, params)` pousse dans `window.dataLayer`
  (`src/lib/tracking.ts`), exactement comme demandé. Événements câblés :
  `landing_view`, `cta_click`, `form_start`, `form_step_1_complete`,
  `form_step_2_view`, `form_complete`, `generate_lead`.
- Garde-fou : en dev, `track()` refuse et logue un avertissement si un champ
  ressemble à une donnée personnelle (email/téléphone/nom) — aucune PII ne
  doit atteindre l'analytics.
- GA4 (`src/lib/ga4.ts`) ne se charge que si `VITE_GA4_MEASUREMENT_ID` est
  défini **et** que le consentement analytics a été donné (bannière cookies).
- UTM (`src/lib/utm.ts`) : `utm_source`, `utm_medium`, `utm_campaign`,
  `utm_content`, `utm_term` (+ `gclid`/`fbclid`/`msclkid`) capturés à
  l'arrivée sur `/:market/visibilite?utm_source=chatgpt&utm_medium=paid&...`
  (ChatGPT Ads, Google Ads, ou toute autre source), conservés en
  `sessionStorage` pour la durée de la visite et transmis avec le lead
  (`attribution` dans le payload envoyé au CRM). Un premier-touch est aussi
  gardé en `localStorage` (jamais écrasé) pour une éventuelle exploitation
  first/last-touch ultérieure (brief §20), sans complexifier le payload
  envoyé au lead en V1.

## Sécurité (brief §13, §35, §48)

- CSRF : cookie double-submit (`csrf-csrf`), token récupéré via
  `GET /api/csrf-token` puis envoyé en header `X-CSRF-Token`.
- Anti-spam : honeypot (`companyWebsiteHp`) + piège temporel (rejet si le
  formulaire est soumis en moins de 2s après son affichage). Dans les deux
  cas, la réponse imite un succès — jamais d'indice donné au bot.
- Rate limiting sur `POST /api/fr/visibilite/lead` (10/15 min/IP) et
  `GET /api/csrf-token`.
- Validation serveur (Zod) faisant autorité — jamais confiance au client.
- Erreurs génériques côté visiteur ; jamais de stack trace, message interne
  ou détail CRM exposé (voir le error handler dans `server/src/app.ts`).

## Ce qu'il reste à fournir avant la mise en production (brief §55)

Rien de ce qui suit n'a été inventé — des placeholders clairement identifiés
tiennent leur place en attendant :

- [ ] **Logo officiel** — un logo a été reconstruit à la main à partir de
      deux aperçus partagés dans la conversation (jamais reçus comme fichier
      exploitable, seulement en pièce jointe image). Remplacer
      `public/assets/landing/fr/logo.svg` par le fichier source réel dès
      qu'il peut être transmis en pièce jointe/fichier.
- [ ] **Captures du dashboard** (desktop + mobile) — `dashboard.webp` /
      `dashboard-mobile.webp` à déposer dans `public/assets/landing/fr/`
      (des silhouettes abstraites font office de placeholder, voir le README
      de ce dossier). Le composant les utilise automatiquement dès qu'ils
      existent (fallback propre sinon).
- [ ] **Références clients FR autorisées + chiffres clés validés** — la
      section preuves (`Proof`) ne s'affiche qu'en `dev` tant qu'aucune
      donnée réelle n'est fournie (brief §22 : jamais de placeholder visible
      en production).
- [ ] **Contrat du Web Service CRM France** (champs exacts, auth,
      format de réponse) — à définir ensemble ("on pourra voir ensemble le
      format du WS et les champs à transmettre"), puis à adapter dans
      `HttpCrmClient.ts` uniquement. Idem pour les WS CRM Maroc et Sénégal
      quand ces marchés seront lancés — voir section Multi-marché.
- [ ] **GA4 measurement ID** (`VITE_GA4_MEASUREMENT_ID`) et éventuel GTM.
- [ ] **Texte légal réel** (mentions légales, politique de confidentialité)
      — pages actuellement des placeholders explicites à
      `/fr/mentions-legales` et `/fr/politique-de-confidentialite`, et copie
      de la bannière cookies à faire valider par le juridique.
- [ ] **Décision index/noindex** — actuellement `noindex, follow` par
      défaut (page publicitaire), à confirmer avec l'équipe SEO
      (`content/fr.ts` → `meta.robots`).
- [ ] **Email de notification des leads** — `LEAD_NOTIFICATION_EMAIL` est
      prévu en config serveur mais aucun envoi n'est câblé (pas
      d'implémentation email inventée sans destinataire confirmé).
- [ ] **Règles de qualification CRM**, pipeline/source exacts par marché
      (`CRM_FR_PIPELINE`/`_SOURCE`, puis `CRM_MA_*`/`CRM_SN_*` le moment venu).
- [ ] **Convention exacte des codes marché dans l'URL** — `/fr/`, `/ma/`,
      `/sn/` sont utilisés en l'attente d'une validation ("ou autre
      convention que nous validerons") ; un changement de convention se fait
      dans `SUPPORTED_MARKETS` (client + serveur) sans toucher au reste.

## Déploiement

Le client est un site statique (`npm run build` → `dist/`) et l'API un
process Node classique (`npm run build:server` puis
`node server/dist/index.js`, avec les variables de `server/.env.example`
fournies par l'environnement). En prod, servir `dist/` statiquement et
proxifier `/api/*` vers le process Node (nginx, ou la plateforme
d'hébergement choisie) — voir `ALLOWED_ORIGIN` dans `server/.env.example`
si client et API sont sur des origines différentes.

## Accessibilité & performance

- Contrastes vérifiés WCAG AA (calcul manuel des ratios, pas juste
  visuel) : le rouge de marque `#E2452C` seul ne passe pas 4.5:1 en texte
  normal sur blanc (~4.1:1) — un ton `--color-primary-dark` légèrement plus
  foncé est utilisé pour le texte des boutons/badges, `#E2452C` restant la
  couleur de marque pour les usages larges/décoratifs (icônes, titres).
- Police Poppins (demande du 2026-09-04, remplace Plus Jakarta Sans),
  chargée en 400/500/600 seulement — pas de 700+ ("pas trop gras"), fallback
  système si Google Fonts est indisponible.
- Skip link, landmarks sémantiques, erreurs de formulaire en
  `role="alert"`, focus visible, labels explicites, `autocomplete`/
  `inputmode` corrects par champ.

## Tests

- `npm test` (racine) : validation, phone/URL, UTM (dont `utm_term`),
  tracking (garde PII), routing multi-marché (`normalizeMarket`,
  `getContent`), et le formulaire complet (React Testing Library, API
  mockée).
- `npm test` (dans `server/`) : mêmes fonctions pures côté serveur, plus
  `LeadService` (CRM configuré / non configuré / en échec, par marché —
  jamais de perte de lead), la résolution CRM par marché
  (`config/markets.test.ts`, `resolveCrmClient.test.ts`) et une suite
  d'intégration HTTP complète (`app.test.ts` — CSRF, honeypot, piège
  temporel, validations, routage multi-marché, marché non supporté, 404, pas
  de fuite d'erreur).
- `npm run test:e2e` : les 4 scénarios du brief (§44) avec Playwright, plus
  un scénario multi-marché (`/ma/visibilite` → `/api/ma/visibilite/lead`) —
  voir `e2e/README.md`, y compris une note sur pourquoi les tests utilisent
  `data-testid` plutôt que `getByRole`/`getByLabel`, et comment éviter les
  conflits de port avec `E2E_CLIENT_PORT`/`E2E_API_PORT` si un autre projet
  tourne déjà sur 5173/3001.
