# Mesures Google Analytics 4

Le flux de production est `G-EHR9YE7E24`, configuré dans `.env.production`.
L'identifiant est public. Toute modification de `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
nécessite un nouveau build et un déploiement de `out/`.

La balise `gtag.js` est chargée une seule fois, après acceptation du bandeau.
Les événements antérieurs à l'acceptation sont abandonnés. Le refus et le
retrait bloquent aussi les événements automatiques de GA et effacent les cookies
`_ga` accessibles. Le choix est synchronisé entre les onglets.

## Réglages à effectuer dans la propriété GA4

Ces réglages nécessitent l'accès à l'administration Google Analytics ; ils ne
peuvent pas être effectués avec le seul identifiant de mesure.

1. Administration → Collecte et modification des données → Flux de données →
   sélectionner le flux Web correspondant à `G-EHR9YE7E24`.
2. Désactiver la **mesure améliorée** pour ce flux : les pages, clics, formulaires
   et défilements sont suivis par le code ci-dessous. Sinon GA peut également
   collecter des événements automatiques, des URL complètes ou doubler les
   événements du formulaire. Au minimum, désactiver les changements de page
   basés sur l'historique et les interactions avec les formulaires.
3. Marquer **`generate_lead`** comme événement clé. Ne pas utiliser les clics du
   bouton ou la visite de `/merci` pour compter les demandes réellement reçues.
4. Créer des dimensions personnalisées de portée « Événement » pour `location`,
   `element_id`, `element_type`, `form_id`, `error_type` ; ajouter les métriques
   `percent_scrolled` et `invalid_field_count` si elles sont nécessaires aux rapports.

[Vues manuelles et prévention des doublons](https://developers.google.com/analytics/devguides/collection/ga4/views)
et [mesure améliorée](https://support.google.com/analytics/answer/9216061?hl=fr).

## Événements

| Événement | Déclencheur |
| --- | --- |
| `page_view` | Première vue après consentement, puis changement de route |
| `landing_view` / `confirmation_view` | Vue de la landing / confirmation |
| `cta_click` | Bouton d'envoi ou CTA mobile ; `location` et `element_id` identifient le bouton |
| `link_click` / `button_click` | Logo, retour accueil, liens légaux, contact, gestion des cookies |
| `scroll_depth` | Seuils 25, 50, 75, 90 %, une fois par page |
| `form_view` | Formulaire visible à l'écran |
| `form_start` | Première modification d'un champ |
| `form_submit` | Tentative d'envoi d'un formulaire valide |
| `form_validation_error` | Validation refusée ; seul le nombre de champs invalides est envoyé |
| `form_submit_error` | Échec de l'API ; motif générique |
| `form_complete` / `generate_lead` | Acceptation de la demande par l'API |

Recharger la confirmation ne crée pas une nouvelle conversion. Le honeypot ne
génère aucune conversion. Les événements utilisent des identifiants prédéfinis,
jamais le texte affiché, ni les valeurs du formulaire. Les URL envoyées à GA
contiennent uniquement l'origine et une route connue : ni paramètres de requête,
ni fragments. Les référents sont réduits à leur origine. Les UTM et identifiants
publicitaires restent dans l'attribution CRM existante ; ils ne sont pas ajoutés
aux événements GA par cette intégration.

## Vérification

`npm test`, `npm run lint`, `npm run build` et `npm run test:e2e`.
Les tests navigateur utilisent un identifiant fictif et interceptent la balise
Google : aucune conversion de test n'est envoyée au flux de production.
Après déploiement et réglage du flux, accepter le bandeau puis contrôler les
visites et événements dans le rapport Temps réel. La réception dans la propriété
réelle n'est pas validée par les tests locaux.

Google Analytics ne reconstitue pas les clics qui n'ont jamais été enregistrés.
Un historique n'existe que si une balise ou un autre outil était déjà actif.
