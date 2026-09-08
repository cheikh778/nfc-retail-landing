/**
 * V1 is France-only. The /fr/ prefix is kept because the production edge
 * router (deploy/cloudflare-worker/worker.js) uses it to split nfcretail.com
 * between this app and WordPress. Re-introducing /ma, /sn later means adding a
 * segment here, not rewriting components.
 */
export const PATHS = {
  visibilite: '/fr/visibilite',
  merci: '/fr/visibilite/merci',
  mentionsLegales: '/fr/mentions-legales',
  politiqueConfidentialite: '/fr/politique-de-confidentialite',
} as const;
