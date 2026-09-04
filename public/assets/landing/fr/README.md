# Assets landing `/fr/visibilite`

Placeholders actuellement utilisés en attendant les fichiers officiels :

| Fichier | Statut | À fournir |
| --- | --- | --- |
| `logo.svg` | Reconstruction main du logo (texte + pictogramme panier/signal), couleurs de marque exactes | Fichier officiel (SVG/AI source) — envoyé deux fois en aperçu dans la conversation mais jamais reçu comme pièce jointe exploitable, donc reconstruit à l'identique visuel plutôt que copié pixel pour pixel |
| `dashboard-placeholder.svg` | Silhouette d'interface générique | Vraie capture desktop du dashboard NFC Retail (`dashboard.webp`) |
| `dashboard-mobile-placeholder.svg` | Silhouette d'interface générique | Vraie capture mobile du dashboard NFC Retail (`dashboard-mobile.webp`) |

Dès que les fichiers réels sont disponibles :

1. Déposer `dashboard.webp` et `dashboard-mobile.webp` (format WebP, optimisés) dans ce dossier.
2. Déposer `logo.svg` officiel (remplace le wordmark provisoire).
3. Mettre à jour les constantes dans `src/content/fr.ts` (`heroVisual.desktopSrc`, `heroVisual.mobileSrc`, `logoSrc`) si les noms de fichiers diffèrent.

Aucune capture fictive du produit n'est utilisée : les placeholders sont des silhouettes abstraites clairement identifiables comme temporaires, jamais présentées comme le vrai dashboard.
