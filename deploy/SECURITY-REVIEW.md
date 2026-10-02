# Revue de sécurité — 2 octobre 2026

Périmètre : code de la landing et lecture du dépôt adjacent `nfcretail-api`.
Revue ECC avec coordination Ruflo Swarm. La recherche Ruflo RAG dans le namespace
`security` n'a pas abouti : aucune base de mémoire initialisée n'était disponible.
Les résultats reposent sur le code et les audits de dépendances.

## Corrections dans la landing

- Next.js mis à jour de 16.3.4 à 16.3.8 pour supprimer la dépendance signalée
  par [GHSA-vcvr-r3jv-pc5j](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j).
  Aucun usage de `next/og` identifié ; l'application est exportée statiquement.
- Aucun événement Analytics avant acceptation ; retrait effectif, effacement des
  cookies GA accessibles et maintien du choix même en cas d'échec du stockage.
- Filtrage des données Analytics en production et via le pont public, paramètres
  autorisés uniquement, URL et titres de page contrôlés.
- Demandes capturées comptées après succès API ; verrouillage des envois pendant
  la requête et la navigation vers la confirmation.
- En-têtes Cloudflare Pages dans `public/_headers` : anti-iframe, `nosniff`,
  permissions restreintes, politique de référent, CSP pour base/objets/frames/formulaires.
  Cette CSP ne restreint pas les scripts : un durcissement complet nécessiterait
  les empreintes des scripts intégrés générés à chaque export Next.

L'audit npm de la landing après mise à jour ne signale aucune vulnérabilité connue.

## Constats dans l'API, à traiter séparément

Le dépôt API a été inspecté sans modification ni test contre la production.

| Risque | Emplacement | Action |
| --- | --- | --- |
| Élevé si l'origine est accessible hors Cloudflare | `src/middleware/rateLimit.ts`, `deploy-nginx-api.conf` | Le limiteur utilise directement `CF-Connecting-IP`. Restreindre l'origine aux pairs Cloudflare et reconstruire l'adresse du visiteur depuis un proxy de confiance. Sinon un client peut choisir sa clé de limitation. |
| Modéré | `src/middleware/rateLimit.ts` | Normaliser l'adresse IP validée avec `ipKeyGenerator`, y compris pour la branche Cloudflare, pour limiter les contournements par rotation IPv6. |
| Modéré, dépendance | `package-lock.json` | Mettre à jour `ip-address` 10.7.0 vers au moins 10.7.1, dépendance de production d'`express-rate-limit`. |

Avis de la dépendance API :
[GHSA-j6r3-76f7-8jcv](https://github.com/advisories/GHSA-j6r3-76f7-8jcv),
[GHSA-h3mg-xc3c-68pw](https://github.com/advisories/GHSA-h3mg-xc3c-68pw).

Protections constatées dans le code API : validation serveur Zod et limites de
champs, corps JSON limité à 32 Ko, CSRF signé et cookie HttpOnly/Secure en
production, liste CORS explicite, Helmet, erreurs publiques génériques,
stockage de leads avec permissions restrictives. Aucun secret réel trouvé dans
les fichiers suivis et les motifs usuels recherchés dans l'historique.

Le pare-feu de l'origine, les réglages du flux GA4, les en-têtes réellement servis
et la configuration de l'API déployée restent à vérifier après déploiement.
