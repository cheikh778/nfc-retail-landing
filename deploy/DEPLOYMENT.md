# Déploiement — nfcretail.com + api.nfcretail.com

Cible :

| Élément | Où | Déploiement |
|---|---|---|
| Landing (React/Vite) | `nfcretail.com/fr/visibilite` (et `/ma`, `/sn`) | Cloudflare Pages, auto sur `git push` |
| Routage apex | Cloudflare Worker devant `nfcretail.com` | `wrangler deploy`, auto via GitHub Actions |
| WordPress | `nfcretail.com` (tout le reste : `/`, `/wp-admin`, articles…) | inchangé, reste sur Hostinger |
| API (Express) | `api.nfcretail.com` | Hostinger Node.js (Passenger), auto via GitHub Actions SSH |

```
                    ┌─────────────────────────┐
   visiteur ──────► │  Cloudflare (DNS + proxy)│
                    └───────────┬─────────────┘
                     Worker sur nfcretail.com/*
                    /fr/* /ma/* /sn/* /assets/*        tout le reste
                          │                                 │
                          ▼                                 ▼
                 Cloudflare Pages                  WordPress @ Hostinger
                 (le dossier dist/)                (inchangé)

   fetch API du SPA ─────────────────────────────► api.nfcretail.com
                                                   Hostinger Node.js app
```

Même domaine racine `nfcretail.com` pour le landing et `api.` → *same-site* →
le cookie CSRF `SameSite=Lax` passe sans réglage particulier.

---

## 1. Scinder le monorepo en deux repos

Le dossier `server/` est autonome (son `package.json`, son `tsconfig`, aucun
import vers l'extérieur). `e2e/` reste avec le front.

### 1a. `nfcretail-api` (nouveau repo)

```bash
cd ..
mkdir nfcretail-api && cd nfcretail-api
rsync -a --exclude node_modules --exclude dist --exclude data \
      ../nfc-retail-landing/server/ .

npm install                 # génère package-lock.json (le monorepo n'en avait pas pour server/)
npm test                    # 56 tests doivent passer
mkdir -p .github/workflows
cp ../nfc-retail-landing/deploy/github-actions/api-repo--deploy.yml .github/workflows/deploy.yml

git init -b main
git add -A && git commit -m "Init API from monorepo"
# créer le repo vide sur github.com (Settings > pas de README)
git remote add origin git@github.com:cheikh778/nfcretail-api.git
git push -u origin main
```

`server/.env`, `server/.env.local` sont gitignorés — ils **ne partent pas** dans
le repo (voir §4 pour les variables en prod).

### 1b. `nfcretail-web` (le repo actuel, allégé)

```bash
cd ../nfc-retail-landing
git rm -r --cached server
rm -rf server
# retirer "workspaces": ["server"] de package.json
mkdir -p .github/workflows
cp deploy/github-actions/web-repo--ci.yml .github/workflows/ci.yml

npm install                 # relockfile sans le workspace
npm test && npm run build   # doit passer
git add -A && git commit -m "Split: web-only repo (server extrait vers nfcretail-api)"
git push
```

Renommer le repo GitHub `nfc-retail-landing` → `nfcretail-web` si tu veux
(Settings → Repository name). L'historique du front est conservé.

> `deploy/` peut rester dans `nfcretail-web` : le Worker y vit et le workflow CI
> le déploie.

---

## 2. L'API sur Hostinger (`api.nfcretail.com`)

### 2a. Sous-domaine + application Node

1. hPanel → **Domaines → Sous-domaines** → créer `api`. Noter le dossier
   (ex. `/home/uXXXXXXXXX/domains/api.nfcretail.com`).
2. hPanel → **Avancé → Node.js** → *Create application* :
   - Node version : **22** (ou 20)
   - Application root : le dossier du sous-domaine
   - Application startup file : `dist/index.js`
   - Application URL : `api.nfcretail.com`
3. **Variables d'environnement** (bouton *Environment variables* de l'app) —
   Passenger lance `dist/index.js` directement, donc `.env.local` n'est PAS lu :
   tout se met ici.

   | Variable | Valeur |
   |---|---|
   | `NODE_ENV` | `production` |
   | `CSRF_SECRET` | la chaîne de 64 hex (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
   | `CRM_FR_API_URL` | `https://up.moncrm.io/api/v1/leads` |
   | `CRM_FR_API_KEY` | **le vrai token Bearer de prod** |
   | `CRM_FR_LOCALE` | `fr-FR` |
   | `CRM_FR_OFFER_CODE` | `visibilite` |
   | `CRM_FR_SOURCE` | `nfc-retail-landing-fr` |
   | `ALLOWED_ORIGIN` | `https://nfcretail.com` (ajouter `,https://<projet>.pages.dev` pendant les tests) |
   | `LEAD_STORE_PATH` | chemin **absolu** hors web, ex. `/home/uXXXX/domains/api.nfcretail.com/data/leads.jsonl` |

   Ne pas définir `PORT` (fourni par Passenger).
4. **SSL** : hPanel → Sécurité → SSL → activer sur `api.nfcretail.com`.
   Indispensable : le cookie CSRF est `secure` + préfixe `__Host-` en prod.

### 2b. Déploiement automatique (GitHub Actions → SSH)

Secrets à créer dans le repo `nfcretail-api` (Settings → Secrets → Actions) :

| Secret | Valeur |
|---|---|
| `HOSTINGER_SSH_HOST` | hôte SSH (hPanel → Avancé → SSH Access) |
| `HOSTINGER_SSH_USER` | utilisateur SSH (`uXXXXXXXXX`) |
| `HOSTINGER_SSH_PORT` | port SSH (souvent `65002` chez Hostinger) |
| `HOSTINGER_SSH_KEY` | clé privée **sans passphrase** dont la publique est ajoutée dans hPanel → SSH Access → *Manage SSH keys* |
| `HOSTINGER_APP_PATH` | le dossier de l'app, ex. `/home/uXXXX/domains/api.nfcretail.com` |

À chaque `push` sur `main` : `npm ci && npm test && npm run build`, rsync vers
Hostinger (en excluant `.env*` et `data/`), puis `touch tmp/restart.txt` pour
redémarrer Passenger.

### 2c. Cron de rattrapage des leads

Si le CRM tombe, les leads sont stockés `pending`. hPanel → **Cron Jobs**,
toutes les 15 min :

```
cd /home/uXXXX/domains/api.nfcretail.com && \
node --env-file-if-exists=.env.local dist/scripts/replayPendingLeads.js
```

Pour que ce cron ait les variables, déposer **une fois** un `server/.env.local`
à la racine de l'app (via SFTP, jamais commité) avec au minimum `CRM_FR_*` et
`LEAD_STORE_PATH`. (L'app web, elle, utilise les variables du §2a.)

### 2d. Vérifier

`curl https://api.nfcretail.com/api/health` → `{"ok":true}`

---

## 3. Le landing sur Cloudflare Pages

### 3a. Créer le projet Pages

Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** →
repo `nfcretail-web` :

- Production branch : `main`
- Framework preset : **Vite**
- Build command : `npm run build`
- Build output directory : `dist`
- Variables d'environnement : rien d'obligatoire (`VITE_API_BASE_URL` est déjà
  dans `.env.production`, committé). Ajouter `VITE_GA4_MEASUREMENT_ID` ici le
  moment venu.

Premier déploiement → note l'URL `https://<projet>.pages.dev`.
**Ne pas** ajouter `nfcretail.com` comme domaine personnalisé du projet Pages
(ça capturerait tout l'apex) — c'est le Worker qui route.

### 3b. Le fichier `_redirects`

`public/_redirects` (déjà dans le repo) contient `/*  /index.html  200` :
Pages sert l'entrée du SPA pour les routes profondes
(`/fr/visibilite/merci` en accès direct).

### 3c. Déployer le Worker

Dans `deploy/cloudflare-worker/worker.js`, remplacer `PAGES_HOST` par ton
`<projet>.pages.dev`.

Secrets du repo `nfcretail-web` :

| Secret | Où le trouver |
|---|---|
| `CLOUDFLARE_API_TOKEN` | My Profile → API Tokens → *Edit Cloudflare Workers* template |
| `CLOUDFLARE_ACCOUNT_ID` | barre latérale droite du dashboard Workers & Pages |

Le workflow `ci.yml` fait `wrangler deploy` (dossier `deploy/cloudflare-worker`)
à chaque push sur `main`. Premier déploiement manuel possible :

```bash
cd deploy/cloudflare-worker
npx wrangler login
npx wrangler deploy
```

Le `wrangler.toml` attache le Worker aux routes `nfcretail.com/*` et
`www.nfcretail.com/*` — la zone doit être active sur Cloudflare (§5).

---

## 4. Modifs déjà faites dans le code

| Fichier | Changement |
|---|---|
| `.env.production` | `VITE_API_BASE_URL=https://api.nfcretail.com/api` (non secret, committé) |
| `server/src/app.ts` | `ALLOWED_ORIGIN` accepte une liste séparée par virgules |
| `server/vitest.config.ts` | exclut `dist/` des tests |
| `public/_redirects` | fallback SPA pour Cloudflare Pages |
| `deploy/` | Worker, `wrangler.toml`, workflows, ce guide |

Rien à changer côté routes/assets : le SPA sert déjà des chemins absolus
(`/fr/visibilite`, `/assets/…`) et `canonicalUrl` pointe déjà sur l'apex.

---

## 5. DNS Cloudflare — enregistrements attendus

Une fois les nameservers basculés (fait) :

| Type | Nom | Contenu | Proxy |
|---|---|---|---|
| A | `nfcretail.com` | IP Hostinger | 🟠 proxied |
| A ou CNAME | `www` | IP Hostinger / `nfcretail.com` | 🟠 proxied |
| A | `api` | IP Hostinger | 🟠 proxied (ou 🔘 DNS-only pour débuter) |
| MX / TXT | emails | inchangés | 🔘 **DNS only** |

Réglages : SSL/TLS → **Full (strict)** ; Edge Certificates → **Always Use HTTPS** : ON.

---

## 6. Ordre de bascule (jour J)

1. API en ligne et testée : `https://api.nfcretail.com/api/health` OK.
2. Pages déployé, testé sur `https://<projet>.pages.dev/fr/visibilite`
   (mettre temporairement ce domaine dans `ALLOWED_ORIGIN` pour tester le form).
3. `PAGES_HOST` renseigné dans le Worker, Worker déployé.
4. Vérifier :
   - `https://nfcretail.com/` → WordPress (inchangé)
   - `https://nfcretail.com/fr/visibilite` → le landing
   - soumettre le formulaire → 200, lead visible dans le CRM **et** dans
     `data/leads.jsonl` sur le serveur
   - `https://nfcretail.com/fr/visibilite/merci` en accès direct → OK (pas de 404)
5. Retirer l'URL `*.pages.dev` de `ALLOWED_ORIGIN`.
6. Cron de rattrapage actif.

---

## 7. Points de vigilance

- **`.htaccess` WordPress** : non modifié ici, donc aucun risque de ce côté.
- **Plugin multilingue WP** : si WordPress sert déjà des URLs `/fr/…`, il y a
  collision avec le Worker. Vérifier avant bascule.
- **Thème WP servant `/assets/`** : rare, mais si c'est le cas, on préfixe le
  build (`build.assetsDir`) et on ajuste `SPA_PATH` dans le Worker.
- **`req.ip` derrière proxies** : le CSRF lie le token à l'IP
  (`getSessionIdentifier`). `trust proxy: 1` est déjà réglé. Si des
  `invalid_csrf_token` sporadiques apparaissent, c'est la piste.
- **`.tmp-shot*.mjs`** à la racine : fichiers de brouillon commités par erreur
  (commit `39142cd`), à supprimer.
