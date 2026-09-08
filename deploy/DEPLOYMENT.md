# Guide de déploiement en production — `nfcretail.com`

Ce guide déploie **les deux applications** de ce repo :

| # | Application | Où | Quoi |
|---|---|---|---|
| A | **Landing** (Next.js, export statique `out/`) | Cloudflare Pages | La page `nfcretail.com/fr/visibilite` |
| B | **API leads** (`server/`, Node/Express) | Hostinger — app Node.js sur `api.nfcretail.com` | Reçoit le formulaire, l'envoie au CRM France, garde une copie locale |

Plus **Cloudflare Worker** : un petit routeur qui envoie `nfcretail.com/fr/*`
vers la landing et **tout le reste vers ton WordPress existant** (qui n'est
jamais touché).

```
                          ┌──────────────────────────────┐
        visiteur ───────► │  Cloudflare  (DNS + proxy)    │
                          └──────────────┬───────────────┘
                            Worker sur nfcretail.com/*
                   /fr/*  /_next/  /assets/            tout le reste
                          │                                  │
                          ▼                                  ▼
                 Cloudflare Pages                    WordPress @ Hostinger
                 (out/ de ce repo)                   (inchangé)

  formulaire ──POST──►  https://api.nfcretail.com   (app Node.js @ Hostinger)
                                   │
                                   ▼
                        https://up.moncrm.io/api/v1/leads
```

`nfcretail.com` et `api.nfcretail.com` partagent le domaine racine → **same-site**
→ le cookie CSRF passe sans réglage particulier.

---

## Avant de commencer — checklist

- [ ] Accès à **hPanel** Hostinger (le plan doit proposer **Node.js** dans
      « Avancé » — plans Business / Cloud, ou Premium selon la région).
- [ ] `nfcretail.com` géré par **Cloudflare** (nameservers Cloudflare actifs,
      zone « Active »).
- [ ] Accès au **repo GitHub** + un compte **Cloudflare**.
- [ ] La **vraie clé Bearer du CRM France** (prod), pas la clé temporaire de
      `server/.env.local`.
- [ ] **Node 20+** installé en local (pour construire les bundles).
- [ ] *(Recommandé, non bloquant)* : pages **Mentions légales** /
      **Confidentialité** rédigées, `public/assets/landing/fr/og-image.png` réel,
      `NEXT_PUBLIC_GA4_MEASUREMENT_ID` renseigné dans `.env.production`.

Fais les étapes **dans l'ordre**. Chacune est testable seule.

---

## Étape A — L'API leads sur Hostinger (`api.nfcretail.com`)

### A.1 — Créer le sous-domaine

1. hPanel → **Domaines → Sous-domaines**.
2. Crée `api` (→ `api.nfcretail.com`).
3. Note le **dossier** affiché, par ex.
   `/home/u123456789/domains/api.nfcretail.com/public_html`
   (le « dossier racine de l'app » sera ce dossier, ou son parent — voir A.2).

### A.2 — Créer l'application Node.js

1. hPanel → **Avancé → Node.js** → **Create application**.
2. Renseigne :
   | Champ | Valeur |
   |---|---|
   | **Node.js version** | `22` (ou `20`) |
   | **Application mode** | `Production` |
   | **Application root** | le dossier du sous-domaine (ex. `domains/api.nfcretail.com`) |
   | **Application URL** | `api.nfcretail.com` |
   | **Application startup file** | `dist/index.js` |
3. Valide. hPanel crée le dossier + un `tmp/` (pour le redémarrage).

### A.3 — Variables d'environnement

Toujours dans l'écran de l'app Node.js → section **Environment variables** →
ajoute **une par une** :

| Variable | Valeur |
|---|---|
| `NODE_ENV` | `production` |
| `CSRF_SECRET` | 64 caractères hex — génère-le : `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ALLOWED_ORIGIN` | `https://nfcretail.com` — *(pendant les tests, tu peux mettre `https://nfcretail.com,https://<projet>.pages.dev`)* |
| `CRM_FR_API_URL` | `https://up.moncrm.io/api/v1/leads` |
| `CRM_FR_API_KEY` | **la vraie clé Bearer prod du CRM** |
| `CRM_FR_LOCALE` | `fr-FR` |
| `CRM_FR_OFFER_CODE` | `visibilite` |
| `CRM_FR_SOURCE` | `nfc-retail-landing-fr` |
| `LEAD_STORE_PATH` | chemin **absolu** : `/home/u123456789/domains/api.nfcretail.com/data/leads.jsonl` (adapte `u123456789`) |

> **Ne définis PAS `PORT`** — Passenger le fournit tout seul.

### A.4 — Construire le bundle (en local)

Depuis la racine du repo :

```bash
bash deploy/build-api-bundle.sh
```

Ça produit `deploy/api-bundle/` avec `dist/`, `node_modules/` (prod uniquement),
`package.json`, `data/`.

### A.5 — Téléverser

hPanel → **Fichiers → Gestionnaire de fichiers** (ou SFTP), va dans le
**Application root** défini en A.2, et **téléverse le contenu** de
`deploy/api-bundle/` :

```
<application root>/
├── dist/            ← contenu de deploy/api-bundle/dist/
├── node_modules/    ← contenu de deploy/api-bundle/node_modules/
├── package.json
├── package-lock.json
└── data/            ← dossier vide, doit être accessible en écriture
```

> Pour un gros `node_modules/`, compresse-le en `.zip` en local, téléverse le
> zip, puis « Extraire » dans le Gestionnaire de fichiers.
> **Ne téléverse aucun fichier `.env`.**

### A.6 — Démarrer / redémarrer

hPanel → **Node.js** → bouton **Restart** (ou **Run NPM install** puis
**Restart** si tu n'as pas uploadé `node_modules/`).
Alternative SSH : `touch <application root>/tmp/restart.txt`.

### A.7 — Activer le SSL

hPanel → **Sécurité → SSL** → active sur `api.nfcretail.com`
(**obligatoire** : en prod le cookie CSRF est `Secure` + préfixe `__Host-`).
Attends que le certificat soit « Actif » (quelques minutes).

### A.8 — Vérifier

```bash
curl https://api.nfcretail.com/api/health
# → {"ok":true}

curl -i https://api.nfcretail.com/api/csrf-token
# → 200 + un header Set-Cookie: __Host-nfcr.csrf=...
```

Si `502` / `503` : l'app n'a pas démarré → hPanel → Node.js → **Logs**
(souvent : une variable d'env manquante — le message dit laquelle).

### A.9 — Cron de rattrapage des leads (recommandé)

Si le CRM est momentanément injoignable, le lead est quand même sauvé en
local avec le statut `pending`. Ce cron les renvoie.

1. Par SFTP, dépose **un seul** fichier `.env` **à la racine de l'app**
   (jamais commité) avec :
   ```
   CRM_FR_API_URL=https://up.moncrm.io/api/v1/leads
   CRM_FR_API_KEY=la_vraie_cle
   CRM_FR_LOCALE=fr-FR
   CRM_FR_OFFER_CODE=visibilite
   CRM_FR_SOURCE=nfc-retail-landing-fr
   LEAD_STORE_PATH=/home/u123456789/domains/api.nfcretail.com/data/leads.jsonl
   ```
   *(Ce `.env` ne sert QU'AU cron. L'app web, elle, lit les variables de A.3.)*
2. hPanel → **Avancé → Cron Jobs** → toutes les 15 min :
   ```
   cd /home/u123456789/domains/api.nfcretail.com && /usr/bin/node --env-file=.env dist/scripts/replayPendingLeads.js
   ```
   *(Récupère le chemin exact de `node` avec `which node` en SSH si besoin.)*

---

## Étape B — La landing sur Cloudflare Pages

### B.1 — Créer le projet Pages

1. Dashboard Cloudflare → **Workers & Pages → Create → Pages →
   Connect to Git** → choisis ce repo.
2. Configuration du build :
   | Champ | Valeur |
   |---|---|
   | **Production branch** | `main` |
   | **Framework preset** | `Next.js (Static HTML Export)` |
   | **Build command** | `npm run build` |
   | **Build output directory** | `out` |
   | **Root directory** | *(laisser vide)* |
3. **Environment variables** : **aucune obligatoire**.
   `NEXT_PUBLIC_API_BASE_URL=https://api.nfcretail.com` est déjà dans
   `.env.production` (committé) et chargé par `next build`.
   *(Ajoute `NEXT_PUBLIC_GA4_MEASUREMENT_ID` ici le jour où tu branches GA4.)*
4. **Save and Deploy**.

### B.2 — Récupérer l'URL du projet

Après le 1er build : **projet → Domains** → note l'URL
`https://<projet>.pages.dev` (ex. `nfcretail-web.pages.dev`).

> **N'ajoute PAS `nfcretail.com` comme domaine personnalisé du projet Pages** —
> ça capturerait tout l'apex. C'est le Worker (étape C) qui route.

### B.3 — Vérifier

`https://<projet>.pages.dev/fr/visibilite` → la landing s'affiche.
L'export génère un vrai fichier par route
(`out/fr/visibilite/index.html`, `.../merci/index.html`) → les accès directs
marchent sans règle spéciale.

> Le **formulaire** ne marchera qu'une fois l'API accessible **et** son
> `ALLOWED_ORIGIN` mis à jour. Pour tester tout de suite depuis `*.pages.dev`,
> ajoute temporairement cette URL à `ALLOWED_ORIGIN` (étape A.3) et redémarre
> l'app.

### B.4 — Mises à jour

Chaque `git push` sur `main` → Cloudflare Pages rebuild et redéploie
automatiquement. Rien à faire.

---

## Étape C — Le routeur Cloudflare Worker

Il fait que `nfcretail.com/fr/visibilite` serve la landing, et
`nfcretail.com/` (+ le reste) serve WordPress.

### C.1 — Renseigner l'URL Pages

Édite `deploy/cloudflare-worker/worker.js` :

```js
const PAGES_HOST = 'nfcretail-web.pages.dev';   // ← mets TON URL de B.2
```

Commit + push.

### C.2 — Déployer le Worker

**Option 1 — en local (le plus simple pour la 1re fois) :**

```bash
cd deploy/cloudflare-worker
npx wrangler login
npx wrangler deploy
```

`wrangler.toml` attache le Worker à `nfcretail.com/*` et `www.nfcretail.com/*`
(la zone doit être active sur Cloudflare).

**Option 2 — via GitHub Actions :**

1. Repo → **Settings → Secrets and variables → Actions → Secrets** :
   | Secret | Où le trouver |
   |---|---|
   | `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → template *Edit Cloudflare Workers* |
   | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare → Workers & Pages (colonne de droite) |
2. Onglet **Variables** : `DEPLOY_WORKER_ENABLED` = `true`.
3. Le workflow `Deploy Worker` se lance à chaque changement de
   `deploy/cloudflare-worker/**` (ou **Run workflow** à la main).

### C.3 — Vérifier

- `https://nfcretail.com/` → WordPress (inchangé)
- `https://nfcretail.com/fr/visibilite` → la landing
- `https://nfcretail.com/fr/visibilite/merci` (accès direct) → OK, pas de 404
- `https://www.nfcretail.com/fr/visibilite` → redirige vers `nfcretail.com/...`

---

## Étape D — DNS Cloudflare & SSL

### D.1 — Enregistrements DNS attendus

| Type | Nom | Contenu | Proxy |
|---|---|---|---|
| A | `nfcretail.com` | IP de ton hébergement Hostinger | 🟠 Proxied |
| CNAME | `www` | `nfcretail.com` | 🟠 Proxied |
| A | `api` | IP Hostinger (même IP) | 🟠 Proxied *(ou 🔘 DNS only le temps des tests)* |
| MX / TXT | (emails) | inchangés | 🔘 **DNS only** |

> L'IP Hostinger est dans hPanel → **Vue d'ensemble** (ou « Détails du plan »).

### D.2 — SSL/TLS

Cloudflare → **SSL/TLS** :
- Mode de chiffrement : **Full (strict)**
- **Edge Certificates → Always Use HTTPS : ON**

---

## Étape E — Recette finale (bout-en-bout)

- [ ] `https://api.nfcretail.com/api/health` → `{"ok":true}`
- [ ] `https://nfcretail.com/` → WordPress OK
- [ ] `https://nfcretail.com/fr/visibilite` → landing OK, images/logos OK
- [ ] `https://nfcretail.com/fr/visibilite/merci` (URL directe) → pas de 404
- [ ] **Remplir et envoyer le formulaire** avec des données de **test
      identifiables** :
  - [ ] redirection vers `/fr/visibilite/merci`
  - [ ] le lead apparaît dans le **CRM moncrm**
  - [ ] le lead apparaît dans `data/leads.jsonl` sur le serveur avec
        `"status":"sent"`
  - [ ] **supprimer ce lead de test** dans moncrm
- [ ] Retirer l'URL `*.pages.dev` de `ALLOWED_ORIGIN` (A.3) → **Restart** l'app
- [ ] `console` du navigateur sur la landing → aucune erreur CORS / réseau

---

## Mises à jour après la mise en prod

| Quoi a changé | Action |
|---|---|
| Code / contenu **de la landing** | `git push main` → Cloudflare Pages rebuild auto |
| Code **de l'API** (`server/`) | `bash deploy/build-api-bundle.sh` → re-téléverser `dist/` (et `node_modules/` si `package.json` a changé) → **Restart** |
| **`worker.js`** | `git push` (si Action activée) ou `npx wrangler deploy` |
| Une **variable d'env de l'API** | hPanel → Node.js → Environment variables → modifier → **Restart** |

---

## Dépannage

| Symptôme (console navigateur / réseau) | Cause probable | Correctif |
|---|---|---|
| `ERR_CONNECTION_REFUSED` sur `…/api/csrf-token` | L'app Node ne tourne pas | hPanel → Node.js → **Restart** ; vérifier les **Logs** |
| `502` / `503` sur `api.nfcretail.com` | App plantée au démarrage (env manquant) | hPanel → Node.js → **Logs** — le message nomme la variable |
| Erreur **CORS** (`No 'Access-Control-Allow-Origin'`) | `ALLOWED_ORIGIN` ≠ l'origine réelle | Mettre exactement `https://nfcretail.com` (ou l'URL `*.pages.dev` en test) → **Restart** |
| **403** sur `…/visibilite/lead` | Cookie CSRF absent/rejeté | SSL bien actif sur `api` ? `NODE_ENV=production` ? Les deux hôtes bien en `*.nfcretail.com` ? Pas de bloqueur de cookies tiers |
| Formulaire : « Une erreur temporaire est survenue » | L'API a répondu ≠ 2xx, **ou** le CRM a rejeté | Regarder `data/leads.jsonl` : si `"status":"pending"` → l'API va bien, c'est le CRM (clé/URL). Le cron A.9 renverra le lead |
| **404** sur `/fr/visibilite/merci` en direct | Le Worker ne route pas ce chemin | Vérifier `SPA_PATH` dans `worker.js` (doit matcher `^/fr(/|$)`) et que le Worker est déployé |
| La landing ne se met pas à jour | Cache Cloudflare | Pages redéploie sur push ; sinon Cloudflare → **Caching → Purge Everything** |
| `/assets/...` ou `/_next/...` renvoie du WordPress | Le thème WP sert ces chemins | Ajuster `SPA_PATH` dans `worker.js` |

### Voir les leads stockés sur le serveur (SSH)

```bash
cd <application root>
tail -n 20 data/leads.jsonl              # les 20 derniers
node dist/scripts/listLeads.js           # liste lisible
node --env-file=.env dist/scripts/replayPendingLeads.js   # relancer les "pending"
```

---

## Sécurité

- **Clé CRM** : uniquement dans les variables d'env Hostinger (A.3) + le `.env`
  du cron (A.9). Jamais dans le repo, jamais dans le bundle front.
  Après validation prod, **révoque la clé temporaire** de `server/.env.local`.
- **`CSRF_SECRET`** : long, aléatoire, propre à la prod. Le changer invalide
  les formulaires ouverts au moment du changement (sans gravité).
- **`server/.env` et `server/.env.local`** locaux : gitignorés, ne jamais les
  committer ni les téléverser en prod.

---

## Annexe — Alternative sans Worker (sous-domaine dédié)

Si tu ne veux pas de Worker devant WordPress, tu peux servir la landing sur un
**sous-domaine** (ex. `go.nfcretail.com`) :

1. Cloudflare Pages → projet → **Custom domains** → ajoute `go.nfcretail.com`.
2. Adapte `PATHS` / `SITE_URL` dans le code si tu veux que les URLs canoniques
   pointent sur ce sous-domaine (`lib/seo.ts`, `lib/paths.ts`).
3. `ALLOWED_ORIGIN` de l'API devient `https://go.nfcretail.com`.

C'est plus simple à mettre en place, mais l'URL n'est plus
`nfcretail.com/fr/visibilite` (impact SEO / com').
