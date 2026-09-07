# Déploiement — nfcretail.com + api.nfcretail.com

**Un seul repo.** Pas de split. Cloudflare Pages build le landing depuis ce
repo, une GitHub Action déploie l'API quand `server/**` change, une autre
pousse le Worker.

| Élément | Où | Déclencheur |
|---|---|---|
| Landing (React/Vite) | `nfcretail.com/fr/visibilite` (et `/ma`, `/sn`) | Cloudflare Pages, auto sur `git push` |
| Routage apex | Cloudflare Worker devant `nfcretail.com` | `.github/workflows/deploy-worker.yml` |
| WordPress | `nfcretail.com` (tout le reste) | inchangé |
| API (Express) | `api.nfcretail.com` | `.github/workflows/deploy-api.yml` (SSH → Hostinger) |

```
                    ┌─────────────────────────┐
   visiteur ──────► │  Cloudflare (DNS + proxy)│
                    └───────────┬─────────────┘
                     Worker sur nfcretail.com/*
              /fr/* /ma/* /sn/* /assets/*      tout le reste
                        │                            │
                        ▼                            ▼
               Cloudflare Pages              WordPress @ Hostinger
               (dist/ de ce repo)            (inchangé)

   fetch API du SPA ──────────────────────► api.nfcretail.com
                                            Hostinger Node.js app
```

`nfcretail.com` (landing) et `api.nfcretail.com` partagent le domaine racine →
*same-site* → le cookie CSRF `SameSite=Lax` passe sans réglage.

---

## Par où commencer

Fais-le dans cet ordre. Chaque étape est indépendante et testable.

1. **[§1] API sur Hostinger** — sous-domaine + app Node + variables d'env. Test : `/api/health`.
2. **[§2] Secrets GitHub + activer le déploiement API.** Test : un push qui touche `server/`.
3. **[§3] Cloudflare Pages** — connecter le repo. Test : `<projet>.pages.dev/fr/visibilite`.
4. **[§4] Cloudflare Worker** — `PAGES_HOST` + secrets + activer. Test : `nfcretail.com/fr/visibilite`.
5. **[§5] Bascule finale** — vérifs bout-en-bout.

---

## §1 — API sur Hostinger (`api.nfcretail.com`)

### 1a. Sous-domaine + application Node

1. hPanel → **Domaines → Sous-domaines** → créer `api`. Noter le dossier
   (ex. `/home/uXXXXXXXXX/domains/api.nfcretail.com`).
2. hPanel → **Avancé → Node.js** → *Create application* :
   - Node version : **22** (ou 20)
   - Application root : le dossier du sous-domaine
   - Application startup file : `dist/index.js`
   - Application URL : `api.nfcretail.com`
3. **Variables d'environnement** (bouton *Environment variables* de l'app).
   Passenger lance `dist/index.js` directement → `.env.local` n'est PAS lu,
   tout se met ici :

   | Variable | Valeur |
   |---|---|
   | `NODE_ENV` | `production` |
   | `CSRF_SECRET` | chaîne 64 hex (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
   | `CRM_FR_API_URL` | `https://up.moncrm.io/api/v1/leads` |
   | `CRM_FR_API_KEY` | le token Bearer de prod |
   | `CRM_FR_LOCALE` | `fr-FR` |
   | `CRM_FR_OFFER_CODE` | `visibilite` |
   | `CRM_FR_SOURCE` | `nfc-retail-landing-fr` |
   | `ALLOWED_ORIGIN` | `https://nfcretail.com` (+ `,https://<projet>.pages.dev` pendant les tests) |
   | `LEAD_STORE_PATH` | chemin **absolu**, ex. `/home/uXXXX/domains/api.nfcretail.com/data/leads.jsonl` |

   Ne pas définir `PORT` (fourni par Passenger).
4. **SSL** : hPanel → Sécurité → SSL → activer sur `api.nfcretail.com`
   (obligatoire : cookie CSRF `secure` + préfixe `__Host-` en prod).

### 1b. Premier déploiement (manuel, une fois)

Par SSH, ou via *workflow_dispatch* une fois les secrets du §2 en place. Manuel :

```bash
git clone <ce-repo> tmp && cd tmp
npm ci && npm run build --workspace server
mkdir -p bundle/dist && cp -r server/dist/. bundle/dist/ && cp server/package.json bundle/
cd bundle && npm install --omit=dev --no-package-lock
# upload le contenu de bundle/ dans le dossier de l'app (SFTP/scp)
# puis, côté serveur : touch tmp/restart.txt
```

### 1c. Vérifier

`curl https://api.nfcretail.com/api/health` → `{"ok":true}`

### 1d. Cron de rattrapage des leads

Si le CRM tombe, les leads sont stockés `pending`. hPanel → **Cron Jobs**, /15 min :

```
cd /home/uXXXX/domains/api.nfcretail.com && \
node --env-file-if-exists=.env.local dist/scripts/replayPendingLeads.js
```

Déposer **une fois** un `.env.local` à la racine de l'app (SFTP, jamais commité)
avec `CRM_FR_*` et `LEAD_STORE_PATH` — pour le cron seulement ; l'app web
utilise les variables du §1a.

---

## §2 — Secrets GitHub + activer le déploiement API

Repo → **Settings → Secrets and variables → Actions**.

**Secrets** :

| Secret | Valeur |
|---|---|
| `HOSTINGER_SSH_HOST` | hôte SSH (hPanel → Avancé → SSH Access) |
| `HOSTINGER_SSH_USER` | utilisateur (`uXXXXXXXXX`) |
| `HOSTINGER_SSH_PORT` | port SSH (souvent `65002`) |
| `HOSTINGER_SSH_KEY` | clé privée **sans passphrase**, publique ajoutée dans hPanel → SSH Access |
| `HOSTINGER_APP_PATH` | dossier de l'app, ex. `/home/uXXXX/domains/api.nfcretail.com` |

**Variable** (onglet *Variables*, pas *Secrets*) :

| Variable | Valeur |
|---|---|
| `DEPLOY_API_ENABLED` | `true` (quand §1 est prêt — sinon le workflow se skippe proprement) |

Ensuite : `Actions → Deploy API → Run workflow` (ou pousse un changement dans
`server/`). Le workflow build, assemble un bundle prod, l'envoie par rsync et
redémarre Passenger.

---

## §3 — Landing sur Cloudflare Pages

Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** →
ce repo :

- Production branch : `main`
- Framework preset : **Vite**
- Build command : `npm run build`
- Build output directory : `dist`
- Variables : rien d'obligatoire (`VITE_API_BASE_URL` est déjà dans
  `.env.production`). Ajouter `VITE_GA4_MEASUREMENT_ID` ici le moment venu.

Premier build → note l'URL `https://<projet>.pages.dev`.
**Ne pas** ajouter `nfcretail.com` comme domaine personnalisé du projet Pages
(ça capturerait tout l'apex) — c'est le Worker qui route.

`public/_redirects` (déjà présent) fait servir `index.html` pour les routes
profondes (`/fr/visibilite/merci` en accès direct).

Test : `https://<projet>.pages.dev/fr/visibilite` s'affiche. Pour tester le
formulaire, ajoute temporairement cette URL à `ALLOWED_ORIGIN` (§1a).

---

## §4 — Cloudflare Worker (le routage apex)

1. Dans `deploy/cloudflare-worker/worker.js`, remplacer `PAGES_HOST` par ton
   `<projet>.pages.dev`.
2. Secrets GitHub (Settings → Secrets) :

   | Secret | Où |
   |---|---|
   | `CLOUDFLARE_API_TOKEN` | My Profile → API Tokens → template *Edit Cloudflare Workers* |
   | `CLOUDFLARE_ACCOUNT_ID` | barre latérale du dashboard Workers & Pages |

3. Variable : `DEPLOY_WORKER_ENABLED` = `true`.
4. Commit la modif de `worker.js` (ou `Actions → Deploy Worker → Run workflow`).

Premier déploiement manuel possible :

```bash
cd deploy/cloudflare-worker
npx wrangler login
npx wrangler deploy
```

Le `wrangler.toml` attache le Worker à `nfcretail.com/*` et `www.nfcretail.com/*`
(la zone doit être active sur Cloudflare — nameservers basculés, fait).

---

## §5 — DNS Cloudflare & bascule finale

### Enregistrements attendus

| Type | Nom | Contenu | Proxy |
|---|---|---|---|
| A | `nfcretail.com` | IP Hostinger | 🟠 proxied |
| A / CNAME | `www` | IP Hostinger / `nfcretail.com` | 🟠 proxied |
| A | `api` | IP Hostinger | 🟠 proxied (ou 🔘 DNS-only au début) |
| MX / TXT | emails | inchangés | 🔘 **DNS only** |

SSL/TLS → **Full (strict)** ; Edge Certificates → **Always Use HTTPS : ON**.

### Vérifs bout-en-bout

- `https://nfcretail.com/` → WordPress (inchangé)
- `https://nfcretail.com/fr/visibilite` → le landing
- soumettre le formulaire → 200, lead visible dans le CRM **et** dans
  `data/leads.jsonl` sur le serveur
- `https://nfcretail.com/fr/visibilite/merci` en accès direct → OK (pas de 404)
- `https://api.nfcretail.com/api/health` → `{"ok":true}`
- retirer l'URL `*.pages.dev` de `ALLOWED_ORIGIN`

---

## Modifs déjà faites dans le code

| Fichier | Changement |
|---|---|
| `.github/workflows/` | `ci.yml`, `deploy-api.yml`, `deploy-worker.yml` |
| `.env.production` | `VITE_API_BASE_URL=https://api.nfcretail.com/api` (non secret, committé) |
| `public/_redirects` | fallback SPA pour Cloudflare Pages |
| `deploy/cloudflare-worker/` | Worker + `wrangler.toml` |
| `src/lib/api.ts` | `\|\| '/api'` : une variable d'env vide ne blanchit plus l'URL API |
| `server/src/app.ts` | `ALLOWED_ORIGIN` accepte une liste séparée par virgules |
| `server/vitest.config.ts` | exclut `dist/` des tests |

Rien à changer côté routes/assets : le SPA sert déjà des chemins absolus et
`canonicalUrl` pointe déjà sur l'apex.

---

## Points de vigilance

- **`.htaccess` WordPress** : non modifié, aucun risque de ce côté.
- **Plugin multilingue WP** : si WordPress sert déjà des URLs `/fr/…`, collision
  avec le Worker. Vérifier avant bascule.
- **Thème WP servant `/assets/`** : rare ; si c'est le cas, préfixer le build
  (`build.assetsDir`) et ajuster `SPA_PATH` dans le Worker.
- **`req.ip` derrière proxies** : le CSRF lie le token à l'IP. `trust proxy: 1`
  est déjà réglé. `invalid_csrf_token` sporadiques → cette piste.
- **`.tmp-shot*.mjs`** à la racine : brouillons commités par erreur (`39142cd`),
  à supprimer.
